"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRoundIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/hooks/use-auth";
import { usersApi } from "@/lib/api/users";
import { ApiRequestError } from "@/lib/api/client";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormValues,
  type ChangePasswordFormValues,
} from "@/lib/validations/auth.schema";
import { ROLE_LABEL } from "@/lib/constants";
import { initials } from "@/lib/utils";

export default function ProfilePage() {
  const { user, accessToken, setUser } = useAuth();
  const queryClient = useQueryClient();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name, phone: user.phone ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

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

  const passwordMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      usersApi.changePassword(accessToken as string, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed.");
      passwordForm.reset();
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to change password."),
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile & Settings" description="Manage your personal details and security." />

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-1">{ROLE_LABEL[user.role]}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal details</CardTitle>
          <CardDescription>Your name and phone number are editable; email cannot be changed.</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
          <CardDescription>Choose a new password of at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="outline" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? <Loader2Icon className="animate-spin" /> : <KeyRoundIcon />}
                Change password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
