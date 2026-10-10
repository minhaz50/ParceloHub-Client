"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckIcon,
  CreditCardIcon,
  Loader2Icon,
  MapPinIcon,
  PackageIcon,
  SmartphoneIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { zonesApi } from "@/lib/api/zones";
import { shipmentsApi } from "@/lib/api/shipments";
import { ApiRequestError } from "@/lib/api/client";
import { createShipmentSchema, type CreateShipmentFormValues } from "@/lib/validations/shipment.schema";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "sender", label: "Sender", icon: MapPinIcon },
  { id: "receiver", label: "Receiver", icon: MapPinIcon },
  { id: "parcel", label: "Parcel", icon: PackageIcon },
  { id: "payment", label: "Payment", icon: WalletIcon },
] as const;

const STEP_FIELDS: Record<number, (keyof CreateShipmentFormValues | `senderAddress.${string}` | `receiverAddress.${string}`)[]> = {
  0: ["senderAddress.line1", "senderAddress.city", "senderAddress.zoneId", "senderAddress.contactName", "senderAddress.contactPhone"],
  1: ["receiverAddress.line1", "receiverAddress.city", "receiverAddress.zoneId", "receiverAddress.contactName", "receiverAddress.contactPhone"],
  2: ["weightKg", "declaredValue", "codAmount", "serviceLevel", "description"],
  3: ["paymentMethod"],
};

export function ShipmentWizard() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [step, setStep] = useState(0);

  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: () => zonesApi.list(accessToken as string),
    enabled: !!accessToken,
  });

  const form = useForm<CreateShipmentFormValues>({
    // @hookform/resolvers v5's generic inference doesn't fully line up
    // with Zod v4 on deeply nested object schemas (two structurally
    // identical but nominally distinct `Resolver<T>` types) — this is a
    // TypeScript-level quirk, not a runtime bug; the resolver validates
    // correctly. The explicit cast bridges the two types.
    resolver: zodResolver(createShipmentSchema) as Resolver<CreateShipmentFormValues>,
    defaultValues: {
      senderAddress: { line1: "", city: "", zoneId: "", contactName: "", contactPhone: "" },
      receiverAddress: { line1: "", city: "", zoneId: "", contactName: "", contactPhone: "" },
      weightKg: 1,
      declaredValue: undefined,
      codAmount: undefined,
      serviceLevel: "STANDARD",
      description: "",
      paymentMethod: "CARD",
    },
    mode: "onBlur",
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateShipmentFormValues) =>
      shipmentsApi.create(accessToken as string, {
        senderAddress: values.senderAddress,
        receiverAddress: values.receiverAddress,
        weightKg: values.weightKg,
        declaredValue: values.declaredValue,
        codAmount: values.codAmount,
        serviceLevel: values.serviceLevel,
        description: values.description || undefined,
        paymentMethod: values.paymentMethod,
      }),
    onSuccess: (result) => {
      if (result.redirectUrl) {
        toast.success("Shipment created — redirecting to secure checkout...");
        window.location.href = result.redirectUrl;
        return;
      }
      toast.success(`Shipment ${result.shipment.trackingId} created!`);
      router.push(`/dashboard/${result.shipment.id}`);
    },
    onError: (err) => {
      const message = err instanceof ApiRequestError ? err.message : "Could not create shipment.";
      toast.error(message);
    },
  });

  async function goNext() {
    const fields = STEP_FIELDS[step] as (keyof CreateShipmentFormValues)[];
    const valid = await form.trigger(fields as never, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function onSubmit(values: CreateShipmentFormValues) {
    createMutation.mutate(values);
  }

  const values = form.watch();

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  i < step
                    ? "border-brand bg-brand text-brand-foreground"
                    : i === step
                      ? "border-brand text-brand"
                      : "border-muted text-muted-foreground",
                )}
              >
                {i < step ? <CheckIcon className="size-4" /> : <s.icon className="size-4" />}
              </div>
              <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-brand" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-5 pt-6">
              {step === 0 && (
                <AddressFields prefix="senderAddress" form={form} zones={zones} zonesLoading={zonesLoading} title="Sender details" />
              )}
              {step === 1 && (
                <AddressFields prefix="receiverAddress" form={form} zones={zones} zonesLoading={zonesLoading} title="Receiver details" />
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="weightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STANDARD">Standard</SelectItem>
                              <SelectItem value="EXPRESS">Express</SelectItem>
                              <SelectItem value="SAME_DAY">Same-Day</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="declaredValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Declared value (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>For insurance/liability purposes.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="codAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cash on delivery amount</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>Amount the courier should collect, if any.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="What's in the parcel?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How will you pay?</FormLabel>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { value: "CARD", label: "Card", icon: CreditCardIcon, desc: "Secure checkout via Stripe" },
                            { value: "MOBILE_BANKING", label: "Mobile Banking", icon: SmartphoneIcon, desc: "Secure checkout via Stripe" },
                            { value: "COD", label: "Cash on Delivery", icon: WalletIcon, desc: "Pay the courier in person" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                                field.value === opt.value ? "border-brand bg-brand/5" : "hover:bg-accent",
                              )}
                            >
                              <opt.icon className="size-5 text-brand" />
                              <span className="text-sm font-medium">{opt.label}</span>
                              <span className="text-xs text-muted-foreground">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border bg-secondary/30 p-4">
                    <h3 className="text-sm font-semibold">Review</h3>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">From</dt>
                        <dd>{values.senderAddress.city || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">To</dt>
                        <dd>{values.receiverAddress.city || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Weight</dt>
                        <dd>{values.weightKg || 0} kg</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Service</dt>
                        <dd>{values.serviceLevel}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Exact price is calculated by the server based on your real zone pair and weight
                      bracket — you&apos;ll see it immediately after submitting.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || createMutation.isPending}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2Icon className="animate-spin" />}
                Confirm Shipment
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function AddressFields({
  prefix,
  form,
  zones,
  zonesLoading,
  title,
}: {
  prefix: "senderAddress" | "receiverAddress";
  form: UseFormReturn<CreateShipmentFormValues>;
  zones: { id: string; name: string; city: string }[] | undefined;
  zonesLoading: boolean;
  title: string;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`${prefix}.contactName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${prefix}.contactPhone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact phone</FormLabel>
              <FormControl>
                <Input placeholder="+880 1XXXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${prefix}.line1`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="House, road, area" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`${prefix}.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Dhaka" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${prefix}.zoneId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone</FormLabel>
              {zonesLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a zone" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zones?.map((z) => (
                      <SelectItem key={z.id} value={z.id}>
                        {z.name} ({z.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
