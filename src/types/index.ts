export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OPS_MANAGER"
  | "HUB_MANAGER"
  | "COURIER"
  | "CUSTOMER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type ServiceLevel = "STANDARD" | "EXPRESS" | "SAME_DAY";

export type ShipmentStatus =
  | "CREATED"
  | "PICKUP_SCHEDULED"
  | "COURIER_ASSIGNED"
  | "PICKUP_FAILED"
  | "PICKED_UP"
  | "AT_ORIGIN_HUB"
  | "IN_TRANSIT"
  | "AT_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERY_FAILED"
  | "DELIVERED"
  | "RETURN_INITIATED"
  | "RETURN_IN_TRANSIT"
  | "RETURNED_TO_SENDER"
  | "CANCELLED";

export type PaymentMethod = "COD" | "CARD" | "MOBILE_BANKING";
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type AssignmentLegType =
  | "PICKUP"
  | "DELIVERY"
  | "RETURN_PICKUP"
  | "RETURN_DELIVERY";
export type AssignmentStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "REASSIGNED"
  | "CANCELLED";

export interface User {
  id: string;
  organizationId: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  organization?: Organization | null;
  courierProfile?: CourierProfile | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  contactPhone: string | null;
  isActive: boolean;
}

export interface Zone {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  city: string;
}

export interface Hub {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  zoneId: string;
  address: string;
  isActive: boolean;
  zone?: Zone;
}

export interface Address {
  id: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  zoneId: string;
  postCode?: string | null;
  country: string;
  contactName: string;
  contactPhone: string;
}

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note: string | null;
  location: string | null;
  createdAt: string;
  actor?: { id: string; name: string; email: string; role: Role } | null;
}

export interface Payment {
  id: string;
  organizationId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: string | null;
  providerRef: string | null;
  paidAt: string | null;
  createdAt: string;
  shipment?: { id: string; trackingId: string; customerId: string } | null;
}

export interface CourierAssignment {
  id: string;
  shipmentId: string;
  courierId: string;
  legType: AssignmentLegType;
  status: AssignmentStatus;
  assignedAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  failureReason: string | null;
  shipment?: Shipment;
  courier?: CourierProfile;
}

export interface CourierProfile {
  id: string;
  userId: string;
  organizationId: string;
  homeHubId: string | null;
  currentZoneId: string | null;
  vehicleType: string;
  capacityKg: number;
  isAvailable: boolean;
  activeParcelCount: number;
  rating: number;
  user?: User;
}

export interface CourierEarning {
  id: string;
  courierId: string;
  shipmentId: string;
  assignmentId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REVERSED";
  createdAt: string;
  paidAt: string | null;
  shipment?: { trackingId: string };
}

export interface Shipment {
  id: string;
  trackingId: string;
  organizationId: string;
  customerId: string;
  senderAddressId: string;
  receiverAddressId: string;
  originZoneId: string;
  destinationZoneId: string;
  originHubId: string | null;
  destinationHubId: string | null;
  currentHubId: string | null;
  weightKg: number;
  declaredValue: number | null;
  codAmount: number;
  serviceLevel: ServiceLevel;
  description: string | null;
  status: ShipmentStatus;
  price: number;
  paymentId: string | null;
  pickupScheduledAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  senderAddress?: Address;
  receiverAddress?: Address;
  originHub?: Hub | null;
  destinationHub?: Hub | null;
  currentHub?: Hub | null;
  payment?: Payment | null;
  events?: ShipmentEvent[];
  assignments?: CourierAssignment[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: PaginationMeta;
  data: T;
}

export interface ApiErrorShape {
  success: false;
  statusCode: number;
  message: string;
  errorDetails?: { path: string; message: string }[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardSummary {
  shipmentsByStatus: Partial<Record<ShipmentStatus, number>>;
  totalRevenue: number;
  couriers: { active: number; total: number };
  activeHubs: number;
  avgDeliveryTimeHours: number | null;
  sampledDeliveredCount: number;
}

export interface CourierLeaderboardEntry {
  courier: { name: string; email: string } | null;
  totalEarnings: number;
  completedLegs: number;
  rating: number | null;
}

export interface AuditLogEntry {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note: string | null;
  location: string | null;
  createdAt: string;
  shipment: { id: string; trackingId: string };
  actor: { id: string; name: string; email: string; role: Role } | null;
}

export interface PricingQuote {
  price: number;
  currency: string;
  breakdown: {
    baseFee: number;
    perKgFee: number;
    baseWeightKg: number;
    billableExtraKg: number;
    extraCharge: number;
    source: "EXACT_ZONE_PAIR" | "ORG_DEFAULT" | "PLATFORM_DEFAULT";
  };
}
