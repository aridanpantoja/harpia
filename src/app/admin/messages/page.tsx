import { redirect } from 'next/navigation';
import MessagesTable from '@/components/admin/messages/messages-table';
import { checkRole } from '@/lib/clerk';
import { getAdminStats, getAllMessagesWithVotes } from '@/lib/db/queries';

export default async function MessagesPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/');
  }

  const [messages, stats] = await Promise.all([
    getAllMessagesWithVotes(),
    getAdminStats(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Mensagens</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todas as mensagens do sistema
          </p>
        </div>
        <div className="flex gap-4 text-muted-foreground text-sm">
          <div>Total: {stats.totalMessages}</div>
          <div>Usuários: {stats.totalUsers}</div>
          <div>Conversas: {stats.totalChats}</div>
        </div>
      </div>

      <MessagesTable initialData={messages} />
    </div>
  );
}
