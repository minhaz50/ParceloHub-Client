import { apiFetch } from "./client";

export interface PublicOrganization {
  name: string;
  slug: string;
}

export const organizationsApi = {
  listPublic: () => apiFetch<PublicOrganization[]>("/organizations/public"),
};
