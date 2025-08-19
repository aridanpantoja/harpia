'use client';

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { columns } from '@/components/admin/files/files-table/columns';
import type { FileItem } from '@/types/dashboard.type';

const mockData: FileItem[] = [
  {
    id: 1,
    fileName: 'Q1_Financial_Report.pdf',
    fileSize: 1_572_864,
    url: '/files/Q1_Financial_Report.pdf',
    description: 'The complete financial report for the first quarter.',
    author: 'Alice Johnson',
    extension: 'pdf',
  },
  {
    id: 2,
    fileName: 'Marketing_Campaign_Assets.zip',
    fileSize: 26_214_400,
    url: '/files/Marketing_Campaign_Assets.zip',
    description: 'All visual assets for the upcoming summer campaign.',
    author: 'Bob Williams',
    extension: 'zip',
  },
  {
    id: 3,
    fileName: 'Project_Alpha_Specification.docx',
    fileSize: 419_430,
    url: '/files/Project_Alpha_Specification.docx',
    description: 'Technical and functional specifications for Project Alpha.',
    author: 'Carol White',
    extension: 'docx',
  },
  {
    id: 4,
    fileName: 'User_Research_Data.xlsx',
    fileSize: 8_388_608,
    url: '/files/User_Research_Data.xlsx',
    description: 'Raw data and analysis from the latest user research.',
    author: 'David Green',
    extension: 'xlsx',
  },
  {
    id: 5,
    fileName: 'Website_Homepage_Mockup.png',
    fileSize: 2_097_152,
    url: '/files/Website_Homepage_Mockup.png',
    description: 'High-fidelity mockup for the new website homepage design.',
    author: 'Alice Johnson',
    extension: 'png',
  },
];

export function useFilesTable() {
  const [data] = useState<FileItem[]>(() => [...mockData]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'fileName', desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  return { table };
}
