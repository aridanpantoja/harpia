import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipButtonProps = {
  content: string;
  children: React.ReactNode;
  href?: ComponentProps<typeof Link>['href'];
  target?: ComponentProps<typeof Link>['target'];
} & ComponentProps<typeof Button>;

export function TooltipButton({
  content,
  children,
  variant = 'ghost',
  size = 'icon',
  href,
  target,
  className,
  ...props
}: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Link
            className={buttonVariants({ className, size, variant })}
            href={href}
            target={target}
          >
            {children}
          </Link>
        ) : (
          <Button size={size} type="button" variant={variant} {...props}>
            {children}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
