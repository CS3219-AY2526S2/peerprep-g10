import RoleLayout from '@/src/components/RoleLayout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleLayout role="user">
      {children}
    </RoleLayout>
  );
}