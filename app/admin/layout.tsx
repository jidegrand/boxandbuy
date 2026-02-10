import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar userName={session.user.name || session.user.email} />
      <main className="flex-1 p-4 lg:p-8 overflow-auto lg:ml-64">
        {children}
      </main>
    </div>
  );
}
