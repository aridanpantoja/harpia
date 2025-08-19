'use client';

import { UserButton } from '@clerk/nextjs';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Select as SelectPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { SettingsButton } from '../common/settings-button';

const navigationLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/files', label: 'Arquivos' },
  { href: '/dashboard/messages', label: 'Mensagens' },
];

export function DashboardNav() {
  return (
    <header className="w-full border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Logo</title>
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem className="w-full" key={link.label}>
                      <NavigationMenuLink className="py-1.5" href={link.href}>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          <Select defaultValue="1">
            <SelectPrimitive.SelectTrigger aria-label="Select project" asChild>
              <Button
                className="h-8 p-1.5 text-foreground focus-visible:bg-accent focus-visible:ring-0"
                variant="ghost"
              >
                <SelectValue placeholder="Select project" />
                <ChevronsUpDown
                  className="text-muted-foreground/80"
                  size={14}
                />
              </Button>
            </SelectPrimitive.SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              <SelectItem value="1">Main project</SelectItem>
              <SelectItem value="2">Origin project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Nav menu */}
            <div className="max-md:hidden">
              <ul className="flex items-center gap-6 text-sm">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <SettingsButton />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
