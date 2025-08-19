import { DashboardNav } from '../../components/admin/dashboard-nav';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center">
      <DashboardNav />
      <div className="mx-2.5 my-8 h-full w-full max-w-7xl flex-1 md:mx-4 md:my-16">
        {children}
      </div>
    </div>
  );
}
