import { Navbar } from '@/src/components/navbar/Navbar';
import RoleLayout from '@/src/components/RoleLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleLayout role="admin">
      <Navbar />
      {children}
    </RoleLayout>
  );
}