'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface MessagesChartProps {
  chartData: Array<{
    date: string;
    userMessages: number;
    assistantMessages: number;
  }>;
}

const chartConfig = {
  views: {
    label: 'Mensagens',
  },
  userMessages: {
    label: 'Usuários',
    color: 'var(--chart-2)',
  },
  assistantMessages: {
    label: 'Assistente',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function MessagesChart({ chartData }: MessagesChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('userMessages');

  const total = useMemo(
    () => ({
      userMessages: chartData.reduce((acc, curr) => acc + curr.userMessages, 0),
      assistantMessages: chartData.reduce(
        (acc, curr) => acc + curr.assistantMessages,
        0
      ),
    }),
    [chartData]
  );

  return (
    <Card className="py-0">
      <CardHeader className="!p-0 flex flex-col items-stretch border-b sm:flex-row">
        <div className="sm:!py-0 flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <CardTitle>Gráfico Interativo das Mensagens</CardTitle>
          <CardDescription>
            Exibindo o total de mensagens nos últimos 30 dias
          </CardDescription>
        </div>
        <div className="flex">
          {['userMessages', 'assistantMessages'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                data-active={activeChart === chart}
                key={chart}
                onClick={() => setActiveChart(chart)}
                type="button"
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="font-bold text-lg leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  nameKey="views"
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
