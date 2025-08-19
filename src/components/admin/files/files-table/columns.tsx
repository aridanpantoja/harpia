import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { FileItem } from '@/types/file-item';
import { RowActions } from './row-actions';

const multiColumnFilterFn: FilterFn<FileItem> = (row, _, filterValue) => {
  const searchableRowContent =
    `${row.original.filename} ${row.original.description} ${row.original.category}`.toLowerCase();
  const searchTerm = String(filterValue).toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const columns: ColumnDef<FileItem>[] = [
  {
    header: 'Nome do arquivo',
    accessorKey: 'filename',
    size: 250,
    filterFn: multiColumnFilterFn,
  },
  {
    header: 'Descrição',
    accessorKey: 'description',
    size: 350,
  },
  {
    header: 'Categoria',
    accessorKey: 'category',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('category')}</Badge>
    ),
    size: 120,
  },
  {
    header: 'Páginas',
    accessorKey: 'pages',
    size: 80,
  },
  {
    header: 'Data de criação',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="text-muted-foreground text-sm">
          {new Date(date).toLocaleDateString('pt-BR')}
        </div>
      );
    },
    size: 120,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableSorting: false,
    enableHiding: false,
  },
];
