"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PatientCard, PatientCardSkeleton } from "@/components/dashboard/patient-card";
import { Bell, LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { PatientDataProvider, usePatientData } from "@/context/patient-data-context";
import { DnaStrandIcon } from "@/components/icons/dna-strand";

function DashboardSkeleton() {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <DnaStrandIcon className="h-24 w-24 animate-dna-spin text-primary" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
}

function SidebarPatientCard() {
  const { patient, loading } = usePatientData();
  if (loading) {
    return <PatientCardSkeleton />;
  }
  if (!patient) {
    return <div className="p-4 text-sm text-muted-foreground">Could not load patient data.</div>;
  }
  return <PatientCard patient={patient} />;
}

function SidebarNav() {
    const { patient } = usePatientData();
    const router = useRouter();

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        });
        router.push('/login');
    };

    return (
        <div className="p-4 flex flex-col gap-2">
            {patient?.role === 'doctor' && (
                <Button asChild variant="ghost" className="w-full justify-start gap-2 bg-accent/20 text-accent-foreground border border-accent/50">
                    <Link href="/dashboard/admin">
                        <Shield /> Admin Panel
                    </Link>
                </Button>
            )}
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/dashboard/settings">
                <Settings/> Settings
            </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2"><Bell/> Notifications</Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2"><LogOut/> Log Out</Button>
        </div>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <PatientDataProvider userId={user.uid}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                  <svg
                      className="w-8 h-8 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                      <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      ></path>
                      <path
                          d="M12 2C12 2 12 8 12 12C12 16 12 22 12 22"
                          stroke="currentColor"
                          strokeOpacity="0.5"
                          strokeWidth="2"
                      ></path>
                      <path
                          d="M2 12H22"
                          stroke="currentColor"
                          strokeOpacity="0.5"
                          strokeWidth="2"
                      ></path>
                  </svg>
                  <h2 className="font-headline text-2xl font-bold text-primary">BioScan</h2>
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarPatientCard />
          </SidebarContent>
          <SidebarNav />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </PatientDataProvider>
  );
}
