"use client";

import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  CheckCircle,
} from "lucide-react";
import type { Service } from "@/app/types/business";
import type { Business } from "@/lib/interfaces";

interface BookingConfirmationProps {
  business: Business;
  bookingData: {
    service: Service | null;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    notes: string;
  };
  resetBooking: () => void;
}

const BookingConfirmation = ({
  business,
  bookingData,
  resetBooking,
}: BookingConfirmationProps) => {
  const intl = useIntl();
  const [calendarAdded, setCalendarAdded] = useState(false);

  const formattedDate = useMemo(() => {
    if (!bookingData.date) {
      return null;
    }

    const date = new Date(`${bookingData.date}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return intl.formatDate(date, { dateStyle: "long" });
  }, [bookingData.date, intl]);

  const formattedTime = useMemo(() => {
    if (!bookingData.time) {
      return null;
    }

    const normalized =
      bookingData.time.length === 5
        ? `${bookingData.time}:00`
        : bookingData.time;
    const date = new Date(`${bookingData.date || "1970-01-01"}T${normalized}`);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return intl.formatTime(date, { hour: "numeric", minute: "2-digit" });
  }, [bookingData.date, bookingData.time, intl]);

  const priceLabel = useMemo(() => {
    if (!bookingData.service) {
      return null;
    }

    const { price, currency } = bookingData.service;

    if (Number.isFinite(price) && currency) {
      try {
        return intl.formatNumber(price, {
          style: "currency",
          currency,
        });
      } catch {
        return `${intl.formatNumber(price)} ${currency}`;
      }
    }

    return intl.formatNumber(price ?? 0);
  }, [bookingData.service, intl]);

  const timezoneLabel = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const confirmationNumber = useMemo(() => {
    const seed = `${business?.id ?? ""}${bookingData.date}${bookingData.time}`;

    if (!seed) {
      return `BK-${Date.now().toString().slice(-6)}`;
    }

    const hash = seed
      .split("")
      .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);

    return `BK-${(hash % 1_000_000).toString().padStart(6, "0")}`;
  }, [business?.id, bookingData.date, bookingData.time]);

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "booking.confirmation.title" })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({ id: "booking.confirmation.subtitle" })}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {intl.formatMessage({ id: "booking.confirmation.bookingId" })}
            </h3>
            <p className="text-lg font-semibold text-gray-900">{confirmationNumber}</p>
          </div>

          {bookingData.service && (
            <div className="flex items-start">
              <Calendar className="mt-1 mr-3 h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {intl.formatMessage({ id: "booking.confirmation.service" })}
                </h3>
                <p className="text-base text-gray-900">
                  {bookingData.service.name}
                </p>
                {priceLabel && (
                  <p className="text-sm text-gray-600">
                    {intl.formatMessage({ id: "booking.confirmation.totalPrice" })}: {priceLabel}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start">
            <Calendar className="mt-1 mr-3 h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {intl.formatMessage({ id: "booking.confirmation.date" })}
              </h3>
              <p className="text-base text-gray-900">
                {formattedDate ? bookingData.date : "--"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="mt-1 mr-3 h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {intl.formatMessage({ id: "booking.confirmation.time" })}
              </h3>
              <p className="text-base text-gray-900">
                {formattedTime ? bookingData.time : "--"}
              </p>
              <p className="text-xs text-gray-500">
                {intl.formatMessage(
                  {
                    id: "booking.confirmation.calendarHint",
                    defaultMessage: "Times are shown in {timezone}",
                  },
                  { timezone: timezoneLabel }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          {intl.formatMessage({ id: "booking.confirmation.contactInfo" })}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <User className="mr-3 h-5 w-5 text-gray-400" />
            <span className="text-gray-900">{bookingData.clientName}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-3 h-5 w-5 text-gray-400" />
            <span className="text-gray-900">{bookingData.clientEmail}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-3 h-5 w-5 text-gray-400" />
            <span className="text-gray-900">{bookingData.clientPhone}</span>
          </div>
          {bookingData.notes && (
            <div className="flex items-start">
              <MessageSquare className="mr-3 h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{bookingData.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">
          {intl.formatMessage({ id: "booking.confirmation.note" })}
        </p>
      </div>

      <div className="flex flex-col space-y-3 pt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
        <button
          type="button"
          className={`btn flex-1 ${
            calendarAdded
              ? "bg-green-500 text-white hover:bg-green-600"
              : "btn-outline border-teal-200 hover:bg-teal-50"
          }`}
          onClick={handleAddToCalendar}
          disabled={calendarAdded}
        >
          {calendarAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              {intl.formatMessage({
                id: "booking.confirmation.addedToCalendar",
                defaultMessage: "Added to calendar",
              })}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {intl.formatMessage({ id: "booking.confirmation.addToCalendar" })}
            </span>
          )}
        </button>
        <button
          type="button"
          className="btn btn-primary flex-1"
          onClick={resetBooking}
        >
          {intl.formatMessage({ id: "booking.confirmation.bookAnother" })}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
