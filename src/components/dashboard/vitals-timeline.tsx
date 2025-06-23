'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { mockPatient } from '@/lib/mock-data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceDot } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type VitalKey = 'heartRate' | 'temperature' | 'oxygenSaturation';

const chartConfig = {
  heartRate: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-1))',
  },
  temperature: {
    label: 'Temperature',
    color: 'hsl(var(--chart-2))',
  },
  oxygenSaturation: {
    label: 'Oxygen Sat.',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const partToVitalMap: Record<string, VitalKey> = {
  torso: 'heartRate',
  head: 'temperature',
  default: 'heartRate',
};

export default function VitalsTimeline({ activePart }: { activePart: string | null }) {
  const [selectedVital, setSelectedVital] = useState<VitalKey>('heartRate');
  const [activeIndex, setActiveIndex] = useState(mockPatient.vitals.length - 1);

  const currentVital = useMemo<VitalKey>(() => {
    if (activePart && partToVitalMap[activePart]) {
      return partToVitalMap[activePart];
    }
    return selectedVital;
  }, [activePart, selectedVital]);
  
  const chartData = useMemo(() => {
    return mockPatient.vitals.map(v => ({
      time: new Date(v.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate: v.heartRate,
      temperature: v.temperature,
      oxygenSaturation: v.oxygenSaturation,
    }));
  }, []);

  const yAxisDomain = useMemo(() => {
    switch(currentVital) {
        case 'heartRate': return [40, 100];
        case 'temperature': return [35, 39];
        case 'oxygenSaturation': return [90, 100];
        default: return ['auto', 'auto']
    }
  }, [currentVital]);

  const activeDataPoint = chartData[activeIndex];

  return (
    <Card className="bg-card/50 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">Vitals Timeline</CardTitle>
                <CardDescription>
                    {chartConfig[currentVital].label} over the last 24 hours.
                    Current: <span className="text-primary font-bold">{activeDataPoint ? activeDataPoint[currentVital] : ''}</span>
                </CardDescription>
            </div>
            <Tabs value={currentVital} onValueChange={(v) => setSelectedVital(v as VitalKey)} className="hidden md:block">
                <TabsList>
                    <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
                    <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    <TabsTrigger value="oxygenSaturation">Oxygen</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
             onMouseMove={(state) => {
                if (state.isTooltipActive && state.activeTooltipIndex) {
                  setActiveIndex(state.activeTooltipIndex);
                }
              }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis domain={yAxisDomain} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <defs>
              <linearGradient id={currentVital} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig[currentVital].color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig[currentVital].color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={currentVital}
              stroke={chartConfig[currentVital].color}
              fillOpacity={1}
              fill={`url(#${currentVital})`}
              strokeWidth={2}
            />
             {activeDataPoint && (
              <ReferenceDot
                r={5}
                y={activeDataPoint[currentVital]}
                x={activeDataPoint.time}
                fill={chartConfig[currentVital].color}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
