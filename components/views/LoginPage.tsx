'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Card';
import { inputClassName, labelClassName } from '@/components/ui/FormField';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';
import Card from '@/components/ui/Card';

interface Props {
  onSuccess: () => void;
  onGoSignup: () => void;
}

export default function LoginPage({ onSuccess, onGoSignup }: Props) {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(t('invalidCredentials'));
      return;
    }
    onSuccess();
  };

  return (
    <div className={ds.page}>
      <WebHeader title={t('loginTitle')} subtitle={t('loginSub')} showBrand />
      <PageContainer narrow className="py-10">
        <Card padding className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClassName}>{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="you@example.com"
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
            {error && (
              <p className="text-sm text-rose-600">{error}</p>
            )}
            <Button type="submit" fullWidth disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {t('loginTitle')}
            </Button>
          </form>
          <p className="text-sm text-slate-500 text-center mt-4">
            {t('noAccount')}{' '}
            <button
              type="button"
              onClick={onGoSignup}
              className="text-teal-700 font-medium hover:underline"
            >
              {t('signUpLink')}
            </button>
          </p>
        </Card>
      </PageContainer>
    </div>
  );
}
