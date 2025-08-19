'use client';

import { MessageSquareMore } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TooltipButton } from '@/components/common/tooltip-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHistory } from '@/hooks/use-history';
import { DeleteChatButton } from './delete-chat-button';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'agora mesmo';
  }

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`;
  }

  if (diffInHours < 24) {
    return `há ${diffInHours}h`;
  }

  if (diffInDays < 7) {
    return `há ${diffInDays} dias`;
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function HistoryButton() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: chats, isLoading } = useHistory();

  if (!chats) {
    return null;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <TooltipButton content="Histórico" onClick={() => setIsOpen(true)}>
        <MessageSquareMore />
      </TooltipButton>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Histórico de Conversas</DialogTitle>
            <DialogDescription>Suas conversas recentes</DialogDescription>
          </DialogHeader>

          <div className="max-h-60 space-y-4 overflow-y-auto">
            {!chats || chats.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                Nenhuma conversa encontrada
              </p>
            ) : (
              chats.map((chat) => (
                <div
                  className="flex w-full items-center justify-between gap-2"
                  key={chat.id}
                >
                  <Link
                    href={`/c/${chat.id}`}
                    key={chat.id}
                    onClick={() => setIsOpen(false)}
                  >
                    <h3 className="truncate font-medium text-sm">
                      {chat.title}
                    </h3>
                    <span className="text-muted-foreground text-xs">
                      {formatTimeAgo(new Date(chat.createdAt))}
                    </span>
                  </Link>

                  <DeleteChatButton />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
