-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION public.hybrid_search(
    query_text text, 
    query_embedding vector, 
    match_count integer, 
    full_text_weight double precision DEFAULT 1, 
    semantic_weight double precision DEFAULT 1, 
    rrf_k integer DEFAULT 50
) 
RETURNS TABLE (
    id uuid,
    content text,
    metadata jsonb,
    full_text_rank int,
    semantic_rank int,
    hybrid_rank double precision
)
LANGUAGE sql
AS $function$
WITH full_text AS (
  SELECT
    id,
    ts_rank_cd(fts, websearch_to_tsquery(query_text)) AS full_text_score,
    row_number() OVER (ORDER BY ts_rank_cd(fts, websearch_to_tsquery(query_text)) DESC) AS rank_ix
  FROM
    file_chunk
  WHERE
    fts @@ websearch_to_tsquery(query_text)
  ORDER BY rank_ix
  LIMIT least(match_count, 30) * 2
),
semantic AS (
  SELECT
    id,
    row_number() OVER (ORDER BY embedding <#> query_embedding) AS rank_ix
  FROM
    file_chunk
  ORDER BY rank_ix
  LIMIT least(match_count, 30) * 2
)
SELECT
  file_chunk.id,
  file_chunk.content,
  file_chunk.metadata,
  full_text.rank_ix AS full_text_rank,
  semantic.rank_ix AS semantic_rank,
  (
    COALESCE(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
    COALESCE(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  ) AS hybrid_rank
FROM
  full_text
  FULL OUTER JOIN semantic ON full_text.id = semantic.id
  JOIN file_chunk ON COALESCE(full_text.id, semantic.id) = file_chunk.id
ORDER BY
  hybrid_rank DESC
LIMIT
  least(match_count, 30)
$function$;
