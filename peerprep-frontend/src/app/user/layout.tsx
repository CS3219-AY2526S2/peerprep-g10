import { Navbar } from '@/src/components/navbar/Navbar';
import RoleLayout from '@/src/components/RoleLayout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleLayout role="user">
      <Navbar />
      {children}
    </RoleLayout>
  );
}