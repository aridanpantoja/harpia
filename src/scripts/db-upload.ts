/** biome-ignore-all lint/suspicious/noConsole: this is a script */
/** biome-ignore-all lint/nursery/noAwaitInLoop: this is a script */

import { openai } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';
import { embedMany, generateObject } from 'ai';
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { drizzle } from 'drizzle-orm/postgres-js';
import pdf from 'pdf-parse';
import postgres from 'postgres';
import { z } from 'zod';
import { file, fileChunk } from '@/lib/db/schema';

(async () => {
  try {
    console.log('🚀 Iniciando o script...');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('Variável de ambiente SUPABASE_URL não definida.');
    }

    if (!supabaseKey) {
      throw new Error(
        'Variável de ambiente SUPABASE_SERVICE_ROLE_KEY não definida.'
      );
    }

    const connection = postgres(process.env.DATABASE_URL as string);
    const db = drizzle(connection);

    const supabase = createClient(supabaseUrl, supabaseKey);
    const embeddingModel = openai.textEmbeddingModel('text-embedding-3-small');
    const chatModel = openai('gpt-5-nano');

    console.log('📄 Lendo o arquivo PDF...');

    const filePath =
      './src/scripts/uploads/Edital_05_2024_COPERPS_PS2025_retificado_v3.pdf';
    const filename = path.basename(filePath);
    const fileBody = await fs.readFile(filePath);

    const { data: storageData, error: storageError } = await supabase.storage
      .from('harpia')
      .upload(`uploads/${filename}`, fileBody, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (storageError) {
      throw storageError;
    }

    console.log('✅ Upload concluído!');

    console.log('🔍 Extraindo metadados e carregando páginas com PDFLoader...');

    const loader = new PDFLoader(filePath);
    const pageLevelDocs = await loader.load();
    const numPages = pageLevelDocs.length;

    const parsedPdfData = await pdf(await fs.readFile(filePath));
    const fileLevelMetadata = parsedPdfData.info;

    console.log('🧠 Gerando categoria e descrição com IA...');

    const fullTextForAI = pageLevelDocs
      .map((doc) => doc.pageContent)
      .join('\n');

    const { object: fileAiMetadata } = await generateObject({
      model: chatModel,
      schema: z.object({
        category: z
          .string()
          .describe(
            'Sugira uma categoria para o documento ("Edital", "Edital Retificado", "Nota de aviso", "Homologação", "Resultado").'
          ),
        description: z
          .string()
          .describe('Crie uma descrição concisa do documento. '),
      }),
      prompt: `Analise as seguinte informações e gere uma categoria e uma descrição: 
      
      Nome do arquivo: "${filename}"
      Número de páginas: ${numPages}
      Início do conteúdo: "${fullTextForAI.substring(0, 4000)}"
      `,
    });

    console.log('💾 Salvando metadados do arquivo principal...');

    const [fileRecord] = await db
      .insert(file)
      .values({
        filename,
        url: storageData.path,
        category: fileAiMetadata.category,
        description: fileAiMetadata.description,
        pages: numPages,
        metadata: fileLevelMetadata,
      })
      .returning();

    console.log(`✅ Registro do arquivo salvo com ID: ${fileRecord.id}`);

    console.log(
      '🔪 Dividindo o texto e calculando posições (caractere e linha)...'
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const documentsToProcess: {
      content: string;
      metadata: {
        pageNumber: number;
        loc: {
          characters: {
            from: number;
            to: number;
          };
          lines: {
            from: number;
            to: number;
          };
        };
      };
    }[] = [];

    for (const doc of pageLevelDocs) {
      const pageText = doc.pageContent;
      const pageNumber = doc.metadata.loc.pageNumber;
      const chunks = await splitter.splitText(pageText);

      let searchStartIndex = 0;

      for (const chunkContent of chunks) {
        const startIndex = pageText.indexOf(chunkContent, searchStartIndex);

        if (startIndex === -1) {
          continue;
        }

        const endIndex = startIndex + chunkContent.length;
        const startLine = pageText.substring(0, startIndex).split('\n').length;
        const endLine = pageText.substring(0, endIndex).split('\n').length;

        documentsToProcess.push({
          content: chunkContent,
          metadata: {
            pageNumber,
            loc: {
              characters: {
                from: startIndex,
                to: endIndex,
              },
              lines: {
                from: startLine,
                to: endLine,
              },
            },
          },
        });

        searchStartIndex = startIndex + 1;
      }
    }

    console.log(
      `✅ Texto dividido em ${documentsToProcess.length} chunks com metadados de posição.`
    );

    console.log('🔢 Gerando embeddings para cada chunk...');
    const chunksContent = documentsToProcess.map((doc) => doc.content);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunksContent,
    });

    if (embeddings.length !== documentsToProcess.length) {
      throw new Error('A contagem de embeddings e chunks não corresponde.');
    }

    console.log(`✅ ${embeddings.length} embeddings gerados.`);

    console.log('💾 Salvando chunks e embeddings no banco de dados...');
    const documentsToInsert = documentsToProcess.map((doc, index) => ({
      fileId: fileRecord.id,
      content: doc.content,
      embedding: embeddings[index],
      metadata: doc.metadata,
    }));

    await db.insert(fileChunk).values(documentsToInsert);

    console.log('🎉 Processo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Ocorreu um erro no script:', error);
  }
})();
