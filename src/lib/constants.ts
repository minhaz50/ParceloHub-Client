import type { Role } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const TOKEN_COOKIE = "clx_access_token";
export const ROLE_COOKIE = "clx_role";
export const REFRESH_COOKIE = "clx_refresh_token";

export const DEMO_ACCOUNTS: {
  role: Role;
  label: string;
  email: string;
  password: string;
  blurb: string;
}[] = [
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@swiftline.example",
    password: "Password123!",
    blurb: "Full platform oversight — users, analytics, audit logs",
  },
  {
    role: "CUSTOMER",
    label: "User",
    email: "customer@swiftline.example",
    password: "Password123!",
    blurb: "Book shipments, track parcels, manage payments",
  },
  {
    role: "COURIER",
    label: "Provider",
    email: "courier1@swiftline.example",
    password: "Password123!",
    blurb: "Accept assignments, complete deliveries, track earnings",
  },
];

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
  OPS_MANAGER: "/admin",
  HUB_MANAGER: "/admin",
  CUSTOMER: "/dashboard",
  COURIER: "/provider",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  OPS_MANAGER: "Ops Manager",
  HUB_MANAGER: "Hub Manager",
  CUSTOMER: "User",
  COURIER: "Provider",
};

export const SHIPMENT_STATUS_LABEL: Record<string, string> = {
  CREATED: "Created",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  COURIER_ASSIGNED: "Courier Assigned",
  PICKUP_FAILED: "Pickup Failed",
  PICKED_UP: "Picked Up",
  AT_ORIGIN_HUB: "At Origin Hub",
  IN_TRANSIT: "In Transit",
  AT_DESTINATION_HUB: "At Destination Hub",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERY_FAILED: "Delivery Failed",
  DELIVERED: "Delivered",
  RETURN_INITIATED: "Return Initiated",
  RETURN_IN_TRANSIT: "Return In Transit",
  RETURNED_TO_SENDER: "Returned to Sender",
  CANCELLED: "Cancelled",
};

export const SHIPMENT_STATUS_VARIANT: Record<
  string,
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "brand"
> = {
  CREATED: "secondary",
  PICKUP_SCHEDULED: "outline",
  COURIER_ASSIGNED: "brand",
  PICKUP_FAILED: "destructive",
  PICKED_UP: "brand",
  AT_ORIGIN_HUB: "outline",
  IN_TRANSIT: "warning",
  AT_DESTINATION_HUB: "outline",
  OUT_FOR_DELIVERY: "warning",
  DELIVERY_FAILED: "destructive",
  DELIVERED: "success",
  RETURN_INITIATED: "destructive",
  RETURN_IN_TRANSIT: "warning",
  RETURNED_TO_SENDER: "secondary",
  CANCELLED: "destructive",
};
