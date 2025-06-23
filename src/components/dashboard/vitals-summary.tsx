import { mockPatient } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Thermometer, Droplets, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VitalCardProps {
  Icon: LucideIcon;
  title: string;
  value: string;
  unit: string;
  colorClass: string;
}

function VitalCard({ Icon, title, value, unit, colorClass }: VitalCardProps) {
  return (
    <Card className="flex-1 bg-card/50 border-primary/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-sm font-medium font-headline">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-3xl font-bold font-headline">{value}</div>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}

export default function VitalsSummary() {
  const latestVitals = mockPatient.vitals[mockPatient.vitals.length - 1];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <VitalCard
        Icon={HeartPulse}
        title="Heart Rate"
        value={String(latestVitals.heartRate)}
        unit="BPM"
        colorClass="text-red-500"
      />
      <VitalCard
        Icon={Thermometer}
        title="Temperature"
        value={latestVitals.temperature.toFixed(1)}
        unit="°C"
        colorClass="text-orange-400"
      />
      <VitalCard
        Icon={Droplets}
        title="Oxygen Sat."
        value={String(latestVitals.oxygenSaturation)}
        unit="%"
        colorClass="text-blue-400"
      />
      <VitalCard
        Icon={Gauge}
        title="Blood Pressure"
        value={`${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}`}
        unit="mmHg"
        colorClass="text-purple-400"
      />
    </div>
  );
}
