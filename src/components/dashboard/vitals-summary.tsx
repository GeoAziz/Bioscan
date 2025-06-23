import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Thermometer, Droplets, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePatientData } from "@/context/patient-data-context";
import { Skeleton } from "../ui/skeleton";

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

function VitalsSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="flex-1 bg-card/50 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5" />
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-10" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function VitalsSummary() {
  const { patient, loading } = usePatientData();
  
  if (loading) {
    return <VitalsSummarySkeleton />;
  }
  
  const latestVitals = patient?.vitals[patient.vitals.length - 1];

  if (!latestVitals) {
    return <VitalsSummarySkeleton />;
  }

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
