
'use client';

import { useEffect, useState } from 'react';
import { handleGetAllUsers } from '@/app/actions';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, User as UserIcon, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<(User & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    handleGetAllUsers().then((result) => {
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching users',
          description: result.error,
        });
      } else {
        setUsers(result.users);
      }
      setLoading(false);
    });
  }, [toast]);
  
  const roleIcons: Record<User['role'], React.ReactNode> = {
    admin: <Shield className="h-4 w-4 text-red-500" />,
    doctor: <Briefcase className="h-4 w-4 text-blue-500" />,
    patient: <UserIcon className="h-4 w-4 text-green-500" />,
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
        <Shield /> Admin Dashboard
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            A list of all users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <UserListSkeleton />
          ) : users.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary">
                                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize flex gap-2 items-center">
                                    {roleIcons[user.role]}
                                    {user.role}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No users found in the system.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
