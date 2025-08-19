'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { TooltipButton } from '@/components/common/tooltip-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export function DeleteChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipButton
        content="Apagar conversa"
        onClick={() => setIsOpen(true)}
        variant="outline"
      >
        <Trash />
      </TooltipButton>

      <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja apagar a conversa?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild onClick={() => {}}>
              <Button variant="destructive">Apagar</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
