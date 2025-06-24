import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Watch, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const deviceIcons: Record<string, LucideIcon> = {
  sw01: Watch,
  sp02: Smartphone,
  si03: Cpu,
};

export function PatientCardSkeleton() {
  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Card className="bg-background/50 border-primary/20">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-headline">Connected Devices</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function PatientCard({ patient }: { patient: User }) {
  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary glow-shadow">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-headline text-xl font-semibold">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">Status: Monitored</p>
        </div>
      </div>
      {patient.devices && patient.devices.length > 0 && (
          <Card className="bg-background/50 border-primary/20">
            <CardHeader className="p-3">
              <CardTitle className="text-base font-headline">Connected Devices</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              {patient.devices.map((device) => {
                const Icon = deviceIcons[device.id] || Smartphone;
                return (
                  <div key={device.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-accent" />
                      <span className="font-medium">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-400/50 text-green-400">{device.battery}%</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
      )}
    </div>
  );
}
