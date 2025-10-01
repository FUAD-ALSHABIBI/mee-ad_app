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
