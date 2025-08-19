import { redirect } from 'next/navigation';
import FilesTable from '@/components/admin/files/files-table';
import { checkRole } from '@/lib/clerk';
import { getFiles } from '@/lib/db/queries';
import { transformFilesToFileItems } from '@/lib/utils';

export default async function FilesPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/');
  }

  const files = await getFiles();
  const fileItems = transformFilesToFileItems(files);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Arquivos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os arquivos processados pelo sistema
          </p>
        </div>
        <div className="text-muted-foreground text-sm">
          Total: {files.length} arquivo(s)
        </div>
      </div>

      <FilesTable initialData={fileItems} />
    </div>
  );
}
