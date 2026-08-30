import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = sessionCookie ? verifySessionToken(sessionCookie) : false;

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <AdminDashboardClient />;
}
