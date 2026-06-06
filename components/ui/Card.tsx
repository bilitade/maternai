import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
  padding = true,
}: Props) {
  return (
    <div
      className={cn(
        ds.card,
        hover && ds.cardHover,
        padding && ds.cardPadding,
        className
      )}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    variant === 'primary'
      ? ds.btnPrimary
      : variant === 'danger'
        ? ds.btnDanger
        : ds.btnSecondary;
  const width =
    fullWidth &&
    (variant === 'primary'
      ? ds.btnPrimaryFull
      : variant === 'danger'
        ? ds.btnDangerFull
        : ds.btnSecondaryFull);

  return (
    <button className={cn(base, width, className)} {...props}>
      {children}
    </button>
  );
}
