"use client";

import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Calendar, Clock, User } from "lucide-react";
import type { Service } from "@/app/types/business";

type ClientDetails = {
  service?: Service | null;
  date?: string;
  time?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
};

interface ClientInfoFormProps {
  bookingData: ClientDetails;
  updateBookingData: (data: Partial<ClientDetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

const ClientInfoForm = ({
  bookingData,
  updateBookingData,
  nextStep,
  prevStep,
  isSubmitting,
}: ClientInfoFormProps) => {
  const intl = useIntl();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const formattedDate = useMemo(() => {
    if (!bookingData.date) {
      return null;
    }

    const date = new Date(`${bookingData.date}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return intl.formatDate(date, { dateStyle: "medium" });
  }, [bookingData.date, intl]);

  const formattedTime = useMemo(() => {
    if (!bookingData.time) {
      return null;
    }

    const normalizedTime =
      bookingData.time.length === 5
        ? `${bookingData.time}:00`
        : bookingData.time;

    const referenceDate = bookingData.date || "1970-01-01";
    const date = new Date(`${referenceDate}T${normalizedTime}`);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return intl.formatTime(date, { hour: "numeric", minute: "2-digit" });
  }, [bookingData.date, bookingData.time, intl]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    updateBookingData({ [name]: value } as Partial<ClientDetails>);

    if (errors[name]) {
      setErrors((previous) => {
        const nextErrors = { ...previous };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.clientName) {
      newErrors.clientName = intl.formatMessage({
        id: "booking.step3.nameRequired",
      });
    }

    if (!bookingData.clientEmail) {
      newErrors.clientEmail = intl.formatMessage({
        id: "booking.step3.emailRequired",
      });
    } else if (!/\S+@\S+\.\S+/.test(bookingData.clientEmail)) {
      newErrors.clientEmail = intl.formatMessage({ id: "auth.invalidEmail" });
    }

    if (!bookingData.clientPhone) {
      newErrors.clientPhone = intl.formatMessage({
        id: "booking.step3.phoneRequired",
      });
    }

    if (!termsAccepted) {
      newErrors.terms = intl.formatMessage({
        id: "booking.step3.termsRequired",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      nextStep();
    }
  };

  const serviceName = bookingData.service?.name;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "booking.step3.title" })}
        </h2>
        <p className="mt-2 text-gray-600">
          {intl.formatMessage({
            id: "booking.step3.subtitle",
            defaultMessage: "Tell us a little about yourself so we can confirm your booking.",
          })}
        </p>
      </div>

      <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 text-left">
        <p className="text-sm font-semibold text-teal-700">
          {intl.formatMessage({
            id: "booking.step3.summaryTitle",
            defaultMessage: "You're booking",
          })}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-teal-900">
          {serviceName && (
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              {intl.formatMessage(
                {
                  id: "booking.step3.summaryService",
                  defaultMessage: "Service: {service}",
                },
                { service: serviceName }
              )}
            </span>
          )}
          {formattedDate && (
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {intl.formatMessage(
                {
                  id: "booking.step3.summaryDate",
                  defaultMessage: "Date: {date}",
                },
                { date: formattedDate }
              )}
            </span>
          )}
          {formattedTime && (
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {intl.formatMessage(
                {
                  id: "booking.step3.summaryTime",
                  defaultMessage: "Time: {time}",
                },
                { time: formattedTime }
              )}
            </span>
          )}
        </div>
        {(!formattedDate || !formattedTime) && (
          <p className="mt-2 text-xs text-teal-700">
            {intl.formatMessage({
              id: "booking.step3.summaryPending",
              defaultMessage: "Select a date and time to see the full summary.",
            })}
          </p>
        )}
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="label">
            {intl.formatMessage({ id: "booking.step3.name" })} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            className={`input w-full ${errors.clientName ? "border-red-500" : ""}`}
            value={bookingData.clientName}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "booking.step3.name" })}
            aria-invalid={Boolean(errors.clientName)}
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientEmail" className="label">
            {intl.formatMessage({ id: "booking.step3.email" })} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            className={`input w-full ${errors.clientEmail ? "border-red-500" : ""}`}
            value={bookingData.clientEmail}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "booking.step3.email" })}
            aria-invalid={Boolean(errors.clientEmail)}
          />
          {errors.clientEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.clientEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientPhone" className="label">
            {intl.formatMessage({ id: "booking.step3.phone" })} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            className={`input w-full ${errors.clientPhone ? "border-red-500" : ""}`}
            value={bookingData.clientPhone}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "booking.step3.phone" })}
            aria-invalid={Boolean(errors.clientPhone)}
          />
          {errors.clientPhone && (
            <p className="mt-1 text-sm text-red-500">{errors.clientPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="label">
            {intl.formatMessage({ id: "booking.step3.notes" })}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="input w-full"
            value={bookingData.notes}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "booking.step3.notes" })}
          />
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              className={`h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 ${
                errors.terms ? "border-red-500" : ""
              }`}
              checked={termsAccepted}
              onChange={() => {
                setTermsAccepted((current) => !current);
                if (errors.terms) {
                  setErrors((previous) => {
                    const nextErrors = { ...previous };
                    delete nextErrors.terms;
                    return nextErrors;
                  });
                }
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              {intl.formatMessage({ id: "booking.step3.terms" })}
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" className="btn btn-outline" onClick={prevStep}>
            {intl.formatMessage({ id: "common.previous" })}
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                {intl.formatMessage({
                  id: "booking.step3.submitting",
                  defaultMessage: "Submitting...",
                })}
              </span>
            ) : (
              intl.formatMessage({ id: "common.submit" })
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientInfoForm;
