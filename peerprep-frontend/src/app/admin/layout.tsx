import AdminSidebar from '@/src/components/admin/AdminSidebar';
import RoleLayout from '@/src/components/RoleLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleLayout role="admin">
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-8">
          {children}
        </main>
      </div>
    </RoleLayout>
  );
}
