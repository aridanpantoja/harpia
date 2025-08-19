import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
}

export function transformFilesToFileItems(files: any[]) {
  return files.map((file) => ({
    id: file.id,
    fileName: file.filename,
    fileSize: 0, // Não temos tamanho no banco, mas podemos calcular se necessário
    url: file.url,
    description: file.description,
    author: 'Sistema', // Não temos autor no banco
    extension: file.filename.split('.').pop() || 'pdf',
    category: file.category,
    pages: file.pages,
    createdAt: file.createdAt,
  }));
}
