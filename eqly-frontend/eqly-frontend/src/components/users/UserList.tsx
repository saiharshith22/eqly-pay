/* eslint-disable @typescript-eslint/no-explicit-any */
import { use, Suspense, useState } from "react";
import { Users, Trash2, Mail, Phone, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/api/user.service";
import type { User } from "@/types/user.types";

function UserListContent({ usersPromise }: { usersPromise: Promise<User[]> }) {
  const { toast } = useToast();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const users = use(usersPromise);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      // Optimistic update: hide user immediately
      setDeletedIds((prev) => new Set(prev).add(id));

      // Call API in background
      await userService.deleteUser(id);

      toast({
        title: "User Deleted",
        description: `${name} has been removed.`,
      });
    } catch (err: any) {
      // Rollback: show user again if delete failed
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      toast({
        title: "Delete Failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  // Filter out deleted users
  const visibleUsers = users.filter((user) => !deletedIds.has(user.id));

  // Empty state
  if (visibleUsers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users registered yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Register your first user to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  // User list
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-6 w-6" />
          Registered Users ({visibleUsers.length})
        </CardTitle>
        <CardDescription>Manage user accounts and view details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>

                    {/* Phone (optional) */}
                    {user.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}

                    {/* UPI (optional) */}
                    {user.upiId && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 flex-shrink-0" />
                        <span>{user.upiId}</span>
                      </div>
                    )}
                  </div>

                  {/* Registration date */}
                  <p className="text-xs text-muted-foreground">
                    Registered:{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id, user.name)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for better UX
 */
function UserListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-36 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function UserList() {
  // Create promise (will be passed to child)
  const usersPromise = userService.getAllUsers();

  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListContent usersPromise={usersPromise} />
    </Suspense>
  );
}
