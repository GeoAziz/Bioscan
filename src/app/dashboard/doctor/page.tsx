
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { handleGetPatientsForDoctor } from '@/app/actions';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function PatientListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function DoctorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<(User & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      handleGetPatientsForDoctor(user.uid).then((result) => {
        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Error fetching patients',
            description: result.error,
          });
        } else {
          setPatients(result.patients);
        }
        setLoading(false);
      });
    }
  }, [user, toast]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
        <Briefcase /> Doctor's Dashboard
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Patient Roster</CardTitle>
          <CardDescription>
            A list of all patients assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PatientListSkeleton />
          ) : patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Monitored</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              You have no patients assigned to you.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
