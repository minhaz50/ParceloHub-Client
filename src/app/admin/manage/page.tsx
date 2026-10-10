"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon, PencilIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAuth } from "@/hooks/use-auth";
import { useUrlPagination } from "@/hooks/use-pagination";
import { adminApi } from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import type { Role, User } from "@/types";

const ALL_ROLES: Role[] = ["CUSTOMER", "COURIER", "HUB_MANAGER", "OPS_MANAGER", "ADMIN"];

export default function ManageUsersPage() {
  const { accessToken, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { page, limit, setPage, setParam } = useUrlPagination({ limit: 10 });
  const searchParams = useSearchParams();
  const roleFilterValue = (searchParams.get("role") as Role | null) ?? undefined;
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { page, limit, role: roleFilterValue }],
    queryFn: () => adminApi.listUsers(accessToken as string, { page, limit, role: roleFilterValue }),
    enabled: !!accessToken,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => adminApi.updateUserRole(accessToken as string, id, role),
    onSuccess: () => {
      toast.success("Role updated.");
      setRoleTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to update role."),
  });

  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <Badge variant="secondary">{ROLE_LABEL[u.role]}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (u) => <Badge variant={u.status === "ACTIVE" ? "success" : "destructive"}>{u.status}</Badge>,
    },
    { key: "joined", header: "Joined", render: (u) => formatDateShort(u.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (u) => (
        <Button
          size="sm"
          variant="ghost"
          disabled={u.id === currentUser?.id}
          onClick={() => {
            setRoleTarget(u);
            setNewRole(u.role);
          }}
        >
          <PencilIcon className="size-3.5" /> Edit role
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Users" description="View and update roles for every user in your organization." />

      <Select
        value={roleFilterValue ?? "ALL"}
        onValueChange={(v) => setParam({ role: v === "ALL" ? undefined : v, page: 1 })}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All roles</SelectItem>
          {ALL_ROLES.map((r) => (
            <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        rows={data?.data}
        isLoading={isLoading}
        emptyIcon={UsersIcon}
        emptyTitle="No users found"
        emptyDescription="Users will appear here as they register."
      />

      <PaginationControls meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!roleTarget} onOpenChange={(open) => !open && setRoleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role for {roleTarget?.name}</DialogTitle>
            <DialogDescription>This takes effect immediately on their next API request.</DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleTarget(null)}>Cancel</Button>
            <Button
              disabled={!newRole || newRole === roleTarget?.role || roleMutation.isPending}
              onClick={() => roleTarget && newRole && roleMutation.mutate({ id: roleTarget.id, role: newRole })}
            >
              {roleMutation.isPending && <Loader2Icon className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
