'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Heart, Loader2, Stethoscope } from 'lucide-react';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Card';
import { inputClassName, labelClassName } from '@/components/ui/FormField';
import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import Card from '@/components/ui/Card';
import type { UserRole } from '@/lib/types';

interface Props {
  onSuccess: () => void;
  onGoLogin: () => void;
}

export default function SignupPage({ onSuccess, onGoLogin }: Props) {
  const { t } = useLocale();
  const [role, setRole] = useState<UserRole>('mother');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const reg = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name: role === 'hew' ? name : name.trim() || undefined,
        role,
      }),
    });
    const data = await reg.json();
    if (!reg.ok) {
      setLoading(false);
      setError(data.error ?? 'Registration failed');
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Account created but sign-in failed. Try logging in.');
      return;
    }
    onSuccess();
  };

  return (
    <div className={ds.page}>
      <WebHeader title={t('signupTitle')} subtitle={t('signupSub')} showBrand />
      <PageContainer narrow className="py-10">
        <Card padding className="max-w-md mx-auto">
          <div className="flex gap-2 mb-6">
            {(
              [
                { r: 'mother' as const, label: t('roleMother'), Icon: Heart },
                { r: 'hew' as const, label: t('roleHew'), Icon: Stethoscope },
              ] as const
            ).map(({ r, label, Icon }) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-2 py-3 rounded-xl text-xs font-medium border transition-colors',
                  role === r ? ds.navPillActive : ds.navPillInactive
                )}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {role === 'hew' && (
              <div>
                <label className={labelClassName}>{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                />
              </div>
            )}
            <div>
              <label className={labelClassName}>{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>{t('password')}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName}
              />
            </div>
            {role === 'mother' && (
              <p className="text-xs text-slate-500 -mt-2">
                Your name and health details are collected once in the next step.
              </p>
            )}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {t('signupTitle')}
            </Button>
          </form>
          <p className="text-sm text-slate-500 text-center mt-4">
            {t('hasAccount')}{' '}
            <button
              type="button"
              onClick={onGoLogin}
              className="text-teal-700 font-medium hover:underline"
            >
              {t('signInLink')}
            </button>
          </p>
        </Card>
      </PageContainer>
    </div>
  );
}
