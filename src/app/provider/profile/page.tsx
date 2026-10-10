"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon, SaveIcon, TruckIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/hooks/use-auth";
import { usersApi } from "@/lib/api/users";
import { couriersApi } from "@/lib/api/couriers";
import { zonesApi } from "@/lib/api/zones";
import { ApiRequestError } from "@/lib/api/client";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/auth.schema";
import { initials } from "@/lib/utils";

export default function ProviderProfilePage() {
  const { user, accessToken, setUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: () => zonesApi.list(accessToken as string),
    enabled: !!accessToken,
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name, phone: user.phone ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const profileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      usersApi.updateProfile(accessToken as string, { name: values.name, phone: values.phone || undefined }),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated.");
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to update profile."),
  });

  const availabilityMutation = useMutation({
    mutationFn: (payload: { isAvailable: boolean; currentZoneId?: string }) =>
      couriersApi.setAvailability(accessToken as string, payload),
    onSuccess: () => {
      toast.success("Availability updated.");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to update availability."),
  });

  if (!user) return null;
  const courierProfile = user.courierProfile;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile & Availability" description="Manage your details and whether you're accepting new assignments." />

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-1">Provider</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
          <CardDescription>Couriers marked unavailable won&apos;t be matched to new pickups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <TruckIcon className="size-5 text-brand" />
              <div>
                <p className="text-sm font-medium">
                  {courierProfile?.isAvailable ? "Available for assignments" : "Not accepting assignments"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Vehicle: {courierProfile?.vehicleType ?? "—"} · Capacity: {courierProfile?.capacityKg ?? "—"}kg
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={courierProfile?.isAvailable ? "outline" : "default"}
              disabled={availabilityMutation.isPending}
              onClick={() =>
                availabilityMutation.mutate({ isAvailable: !courierProfile?.isAvailable })
              }
            >
              {availabilityMutation.isPending && <Loader2Icon className="animate-spin" />}
              {courierProfile?.isAvailable ? "Go Offline" : "Go Online"}
            </Button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Current zone</p>
            <Select
              value={courierProfile?.currentZoneId ?? undefined}
              onValueChange={(zoneId) =>
                availabilityMutation.mutate({ isAvailable: courierProfile?.isAvailable ?? true, currentZoneId: zoneId })
              }
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select your current zone" /></SelectTrigger>
              <SelectContent>
                {zones?.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name} ({z.city})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit((v) => profileMutation.mutate(v))} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
