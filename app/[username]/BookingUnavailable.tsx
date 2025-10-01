"use client";

import { useIntl } from "react-intl";

interface BookingUnavailableProps {
  variant: "not-found" | "load-failed";
}

const BookingUnavailable = ({ variant }: BookingUnavailableProps) => {
  const intl = useIntl();

  const headingId =
    variant === "not-found"
      ? { id: "booking.businessNotFound", defaultMessage: "Business not found" }
      : {
          id: "booking.loadFailed",
          defaultMessage: "We couldn't load the business information. Please try again later.",
        };

  const descriptionId =
    variant === "not-found"
      ? {
          id: "booking.businessNotFoundDescription",
          defaultMessage:
            "The business you're looking for doesn't exist or is no longer available.",
        }
      : {
          id: "booking.loadFailed",
          defaultMessage:
            "We couldn't load the business information. Please try again later.",
        };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage(headingId)}
        </h1>
        <p className="text-gray-600">{intl.formatMessage(descriptionId)}</p>
      </div>
    </div>
  );
};

export default BookingUnavailable;
