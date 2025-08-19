'use client';

import { Monitor, Moon, Settings, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { TooltipButton } from '@/components/common/tooltip-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <TooltipButton content="Configurações" onClick={() => setIsOpen(true)}>
        <Settings />
      </TooltipButton>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
            <DialogDescription>Configurações da Harpia</DialogDescription>
          </DialogHeader>
          <div>
            <ToggleGroup
              className="w-full"
              defaultValue={theme}
              onValueChange={(value) => setTheme(value)}
              type="single"
              value={theme}
              variant="outline"
            >
              <ToggleGroupItem aria-label="Toggle light" value="light">
                <Sun />
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Toggle dark" value="dark">
                <Moon />
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Toggle system" value="system">
                <Monitor />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
