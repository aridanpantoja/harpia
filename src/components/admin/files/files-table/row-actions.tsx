import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FileItem } from '@/types/file-item';

export const RowActions = ({ row }: { row: { original: FileItem } }) => {
  return (
    <div className="flex justify-end">
      <Button asChild size="icon" variant="ghost">
        <a download href={row.original.url}>
          <DownloadIcon aria-hidden="true" size={16} />
          <span className="sr-only">Baixar arquivo</span>
        </a>
      </Button>
    </div>
  );
};
