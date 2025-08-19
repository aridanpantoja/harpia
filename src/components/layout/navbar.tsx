import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { LogIn, Origami } from 'lucide-react';
import Link from 'next/link';
import { HistoryDialog } from '@/components/common/history-button';
import { SettingsButton } from '../common/settings-button';
import { TooltipButton } from '../common/tooltip-button';
import { WidthWrapper } from '../common/width-wrapper';

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <WidthWrapper>
        <div className="mx-auto flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <Origami className="size-4" />
            <span className="font-semibold text-lg">Harpia</span>
          </Link>

          <div className="flex items-center gap-2">
            <SettingsButton />
            <HistoryDialog />

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <TooltipButton content="Entrar" href="/sign-in">
                <LogIn />
              </TooltipButton>
            </SignedOut>
          </div>
        </div>
      </WidthWrapper>
    </header>
  );
}
