'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <LoginForm />
    </div>
  );
}
