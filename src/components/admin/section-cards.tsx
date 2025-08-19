import { FileText, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SectionCardsProps {
  stats: {
    totalMessages: number;
    totalUsers: number;
    totalFiles: number;
    totalChats: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Mensagens</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {stats.totalMessages.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <MessageSquare className="h-4 w-4" />
              Sistema
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Todas as mensagens do sistema <MessageSquare className="size-4" />
          </div>
          <div className="text-muted-foreground">Usuários e assistente</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Usuários Ativos</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {stats.totalUsers.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Users className="h-4 w-4" />
              Ativos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Usuários únicos <Users className="size-4" />
          </div>
          <div className="text-muted-foreground">Com conversas ativas</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Conversas</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {stats.totalChats.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="h-4 w-4" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Conversas iniciadas <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Sessões de chat</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Arquivos</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {stats.totalFiles.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <FileText className="h-4 w-4" />
              Processados
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Documentos processados <FileText className="size-4" />
          </div>
          <div className="text-muted-foreground">PDFs e metadados</div>
        </CardFooter>
      </Card>
    </div>
  );
}
