'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardGatewayPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace('/dashboard/student');
      return;
    }

    switch (user.role) {
      case 'TRAINER':
        router.replace('/dashboard/trainer');
        break;
      case 'MENTOR':
        router.replace('/dashboard/mentor');
        break;
      case 'ADMIN':
      case 'SUPER_ADMIN':
      case 'ACADEMIC_ADMIN':
        router.replace('/dashboard/admin');
        break;
      case 'STUDENT':
      default:
        router.replace('/dashboard/student');
        break;
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-xs text-muted-foreground">
      Loading workspace credentials...
    </div>
  );
}
