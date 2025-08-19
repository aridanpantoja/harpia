'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  MessageSquare,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MessagePart } from '@/types/ai.type';
import type { MessageWithVotes } from '@/types/message-item';

export const columns: ColumnDef<MessageWithVotes>[] = [
  {
    accessorKey: 'role',
    header: 'Tipo',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <Badge variant={role === 'user' ? 'default' : 'secondary'}>
          {role === 'user' ? 'Usuário' : 'Assistente'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'chatTitle',
    header: 'Conversa',
    cell: ({ row }) => {
      const title = row.getValue('chatTitle') as string;
      return (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-[200px] truncate" title={title}>
            {title || 'Sem título'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'userId',
    header: 'Usuário',
    cell: ({ row }) => {
      const userId = row.getValue('userId') as string;
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{userId.slice(0, 8)}...</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'parts',
    header: 'Conteúdo',
    cell: ({ row }) => {
      const parts = row.getValue('parts') as MessagePart[];
      const content = JSON.stringify(parts) || 'Sem conteúdo';
      return (
        <div className="max-w-[300px] truncate" title={content}>
          {content}
        </div>
      );
    },
  },
  {
    accessorKey: 'vote',
    header: 'Voto',
    cell: ({ row }) => {
      const upvotes = row.getValue('upvotes') as number;
      const downvotes = row.getValue('downvotes') as number;

      if (upvotes === 0 && downvotes === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      if (upvotes > downvotes) {
        return (
          <Badge
            className="bg-green-100 text-green-800 hover:bg-green-100"
            variant="default"
          >
            <ThumbsUp className="mr-1 h-3 w-3" />
            Positivo
          </Badge>
        );
      }
      if (downvotes > upvotes) {
        return (
          <Badge
            className="bg-red-100 text-red-800 hover:bg-red-100"
            variant="destructive"
          >
            <ThumbsDown className="mr-1 h-3 w-3" />
            Negativo
          </Badge>
        );
      }
      return (
        <Badge
          className="bg-gray-100 text-gray-800 hover:bg-gray-100"
          variant="secondary"
        >
          Neutro
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const message = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(message.id)}
            >
              Copiar ID da mensagem
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(message.chatId)}
            >
              Copiar ID da conversa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(message.userId)}
            >
              Copiar ID do usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
