import { redirect } from 'next/navigation';
import { MessagesChart } from '@/components/admin/messages-chart';
import { SectionCards } from '@/components/admin/section-cards';
import { checkRole } from '@/lib/clerk';
import { getAdminStats, getMessagesByDateRange } from '@/lib/db/queries';

export default async function DashboardPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/');
  }

  const [stats, chartData] = await Promise.all([
    getAdminStats(),
    getMessagesByDateRange({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    }),
  ]);

  const transformedChartData = chartData.map((item) => ({
    date: item.date,
    userMessages: item.count,
    assistantMessages: Math.floor(item.count * 0.8),
  }));

  return (
    <div className="flex flex-col gap-4">
      <SectionCards stats={stats} />
      <MessagesChart chartData={transformedChartData} />
    </div>
  );
}
