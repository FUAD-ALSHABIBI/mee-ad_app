/*
Component Summary: Resolves the public booking page by loading business data and orchestrating the client flow.
Steps:
1. Normalizes the username route param and fails fast when missing.
2. Fetches business and service records via server-side helpers with graceful error handling.
3. Renders the interactive BookingFlowClient or a BookingUnavailable state based on fetch results.
Component Dependencies: app/[username]/BookingFlowClient.tsx, app/[username]/BookingUnavailable.tsx
External Libs: @/lib/server/business
*/

import BookingFlowClient from "./BookingFlowClient";
import BookingUnavailable from "./BookingUnavailable";
import {
  getBusinessByUrlServer,
  getBusinessServicesServer,
} from "@/lib/server/business";

interface BookingPageProps {
  params: {
    username?: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const username = typeof params?.username === "string" ? params.username : "";

  if (!username) {
    return <BookingUnavailable variant="not-found" />;
  }

  const { business, error: businessError } = await getBusinessByUrlServer(username);

  if (!business) {
    const variant = businessError ? "load-failed" : "not-found";
    return <BookingUnavailable variant={variant} />;
  }

  const { services, error: servicesError } = await getBusinessServicesServer(
    business.id
  );

  if (servicesError) {
    return <BookingUnavailable variant="load-failed" />;
  }

  return <BookingFlowClient business={business} services={services} />;
}

