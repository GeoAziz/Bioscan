
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserCard, UserCardSkeleton } from "@/components/dashboard/user-card";
import { Bell, LogOut, Settings, Shield, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { UserDataProvider, useUserData } from "@/context/user-data-context";
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

function SidebarUserCard() {
  const { user, loading } = useUserData();
  if (loading) {
    return <UserCardSkeleton />;
  }
  if (!user) {
    return <div className="p-4 text-sm text-muted-foreground">Could not load user data.</div>;
  }
  return <UserCard user={user} />;
}

function SidebarNav() {
    const { user } = useUserData();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        });
        router.push('/login');
    };
    
    const navLinkClasses = "w-full justify-start gap-2";
    const activeNavLinkClasses = "bg-accent/80 text-accent-foreground border border-accent/50";

    return (
        <div className="p-4 flex flex-col gap-2">
            <Button asChild variant="ghost" className={`${navLinkClasses} ${pathname.startsWith('/dashboard/patient') ? activeNavLinkClasses : ''}`}>
                <Link href="/dashboard/patient">
                    <LayoutDashboard /> Patient View
                </Link>
            </Button>
            {user?.role === 'doctor' && (
                <Button asChild variant="ghost" className={`${navLinkClasses} ${pathname.startsWith('/dashboard/doctor') ? activeNavLinkClasses : ''}`}>
                    <Link href="/dashboard/doctor">
                        <User /> Doctor View
                    </Link>
                </Button>
            )}
            {user?.role === 'admin' && (
                <Button asChild variant="ghost" className={`${navLinkClasses} ${pathname.startsWith('/dashboard/admin') ? activeNavLinkClasses : ''}`}>
                    <Link href="/dashboard/admin">
                        <Shield /> Admin Panel
                    </Link>
                </Button>
            )}
            <hr className="my-2 border-border" />
            <Button asChild variant="ghost" className={`${navLinkClasses} ${pathname.startsWith('/dashboard/settings') ? activeNavLinkClasses : ''}`}>
              <Link href="/dashboard/settings">
                  <Settings/> Settings
              </Link>
            </Button>
            <Button variant="ghost" className={navLinkClasses}><Bell/> Notifications</Button>
            <Button variant="ghost" onClick={handleLogout} className={navLinkClasses}><LogOut/> Log Out</Button>
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
    <UserDataProvider userId={user.uid}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                  <DnaStrandIcon className="h-8 w-8 text-primary" />
                  <h2 className="font-headline text-2xl font-bold text-primary">BioScan</h2>
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarUserCard />
          </SidebarContent>
          <SidebarNav />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </UserDataProvider>
  );
}
