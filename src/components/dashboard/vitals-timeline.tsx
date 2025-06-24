
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceDot } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { handleSummarizeTimeline } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from '@/context/user-data-context';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

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

function TimelineSkeleton() {
    return (
        <Card className="bg-card/50 border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Skeleton className="h-10 w-64 hidden md:block" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    )
}

export default function VitalsTimeline({ activePart }: { activePart: string | null }) {
  const [selectedVital, setSelectedVital] = useState<VitalKey>('heartRate');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const { toast } = useToast();
  const { user, loading: userLoading } = useUserData();

  const filteredVitals = useMemo(() => {
    if (!user?.vitals) return [];
    if (!date?.from || !date?.to) return user.vitals;
    
    // Set to start of the day for 'from' and end of the day for 'to' to include all vitals on those days
    const fromDate = new Date(date.from.setHours(0, 0, 0, 0));
    const toDate = new Date(date.to.setHours(23, 59, 59, 999));

    return user.vitals.filter(v => {
        const vitalTime = new Date(v.time);
        return vitalTime >= fromDate && vitalTime <= toDate;
    });
  }, [user?.vitals, date]);


  const onSummarize = async () => {
    if (!filteredVitals || filteredVitals.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Summary Error',
        description: 'No data available for the selected range.',
      });
      return;
    }
    setIsSummarizing(true);
    setSummary(null);

    const vitalsData = JSON.stringify(filteredVitals);
    const startTime = filteredVitals[0].time;
    const endTime = filteredVitals[filteredVitals.length - 1].time;

    const result = await handleSummarizeTimeline({ vitalsData, startTime, endTime });

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Summary Error',
        description: result.error,
      });
    } else {
      setSummary(result.summary);
    }
    
    setIsSummarizing(false);
  };

  const currentVital = useMemo<VitalKey>(() => {
    if (activePart && partToVitalMap[activePart]) {
      return partToVitalMap[activePart];
    }
    return selectedVital;
  }, [activePart, selectedVital]);
  
  const chartData = useMemo(() => {
    return filteredVitals.map(v => ({
      time: new Date(v.time).toLocaleTimeString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      heartRate: v.heartRate,
      temperature: v.temperature,
      oxygenSaturation: v.oxygenSaturation,
    }));
  }, [filteredVitals]);

  useEffect(() => {
    if (chartData.length > 0) {
        setActiveIndex(chartData.length - 1);
    } else {
        setActiveIndex(null);
    }
  }, [chartData]);


  const yAxisDomain = useMemo(() => {
    switch(currentVital) {
        case 'heartRate': return [40, 100];
        case 'temperature': return [35, 39];
        case 'oxygenSaturation': return [90, 100];
        default: return ['auto', 'auto']
    }
  }, [currentVital]);

  const activeDataPoint = activeIndex !== null && chartData[activeIndex] ? chartData[activeIndex] : null;

  if (userLoading) {
      return <TimelineSkeleton />;
  }

  return (
    <Card className="bg-card/50 border-primary/20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
                <CardTitle className="font-headline">Vitals Timeline</CardTitle>
                <CardDescription>
                    {chartConfig[currentVital].label} trend.
                    Current: <span className="text-primary font-bold">{activeDataPoint ? activeDataPoint[currentVital] : 'N/A'}</span>
                </CardDescription>
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Tabs value={currentVital} onValueChange={(v) => setSelectedVital(v as VitalKey)}>
                  <TabsList>
                      <TabsTrigger value="heartRate">Heart</TabsTrigger>
                      <TabsTrigger value="temperature">Temp</TabsTrigger>
                      <TabsTrigger value="oxygenSaturation">O2</TabsTrigger>
                  </TabsList>
              </Tabs>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={onSummarize}
                  disabled={isSummarizing || !user || chartData.length === 0}
                  className="shrink-0"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isSummarizing ? 'Summarizing...' : 'Summarize'}
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              onMouseMove={(state) => {
                  if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                    setActiveIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => {
                  if(chartData.length > 0) setActiveIndex(chartData.length - 1);
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
              {activeDataPoint && activeDataPoint[currentVital] !== undefined && (
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
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No data available for the selected date range.
          </div>
        )}
        
        {isSummarizing && (
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}

        {summary && (
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-4">
                <h4 className="font-semibold text-md text-primary flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5"/> AI Summary</h4>
                <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
