import { cn } from '@/lib/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageContainer({
  children,
  className,
  narrow = false,
}: Props) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
}
