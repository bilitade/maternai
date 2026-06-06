import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

export const inputClassName = ds.input;
export const labelClassName = ds.label;
export const selectClassName = ds.select;

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, className, id, ...props }: FieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className={labelClassName}>
        {label}
      </label>
      <input id={fieldId} className={cn(inputClassName, className)} {...props} />
    </div>
  );
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export function SelectField({
  label,
  className,
  id,
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className={labelClassName}>
        {label}
      </label>
      <select id={fieldId} className={cn(selectClassName, className)} {...props}>
        {children}
      </select>
    </div>
  );
}
