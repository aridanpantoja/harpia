import { cn } from '@/lib/utils';

type WidthWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export function WidthWrapper({ children, className }: WidthWrapperProps) {
  return (
    <div className={cn('mx-auto w-full px-2.5 md:px-6', className)}>
      {children}
    </div>
  );
}
