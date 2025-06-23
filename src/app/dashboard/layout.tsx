"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PatientCard } from "@/components/dashboard/patient-card";
import { mockPatient } from "@/lib/mock-data";
import { Bell, HardDrive, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
          <PatientCard patient={mockPatient} />
        </SidebarContent>
        <div className="p-4 flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2"><Settings/> Settings</Button>
            <Button variant="ghost" className="justify-start gap-2"><Bell/> Notifications</Button>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2"><LogOut/> Log Out</Button>
            </Link>
        </div>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
