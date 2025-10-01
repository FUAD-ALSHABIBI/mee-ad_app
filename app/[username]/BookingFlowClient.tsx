"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import ServiceSelection from "./steps/ServiceSelection";
import DateTimeSelection from "./steps/DateTimeSelection";
import ClientInfoForm from "./steps/ClientInfoForm";
import BookingConfirmation from "./steps/BookingConfirmation";

import { createAppointment } from "@/lib/appointment";
import type { Service } from "@/app/types/business";
import type { Business } from "@/lib/interfaces";
import type { AppointmentInput } from "@/lib/types/appointment";

type BookingStep = 1 | 2 | 3 | 4;

type BookingData = {
  service: Service | null;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
};

const initialBookingData: BookingData = {
  service: null,
  date: "",
  time: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  notes: "",
};

type SubmissionErrorKey = "submissionError";

interface BookingFlowClientProps {
  business: Business;
  services: Service[];
}

const BookingFlowClient = ({ business, services }: BookingFlowClientProps) => {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<SubmissionErrorKey | null>(null);

  const bookingDataRef = useRef<BookingData>(initialBookingData);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    bookingDataRef.current = bookingData;
  }, [bookingData]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  const steps = useMemo(
    () => [
      {
        id: 1 as BookingStep,
        label: intl.formatMessage({ id: "booking.step1.title" }),
        description: intl.formatMessage({
          id: "booking.step1.subtitle",
          defaultMessage: "Choose the service you would like to book.",
        }),
      },
      {
        id: 2 as BookingStep,
        label: intl.formatMessage({ id: "booking.step2.title" }),
        description: intl.formatMessage({
          id: "booking.step2.subtitle",
          defaultMessage: "Pick a date and time that works for you.",
        }),
      },
      {
        id: 3 as BookingStep,
        label: intl.formatMessage({ id: "booking.step3.title" }),
        description: intl.formatMessage({
          id: "booking.step3.subtitle",
          defaultMessage: "Tell us a little about yourself so we can confirm your booking.",
        }),
      },
    ],
    [intl]
  );

  const annotatedSteps = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        isActive: currentStep === step.id,
        isCompleted: currentStep > step.id,
        isLast: index === steps.length - 1,
      })),
    [currentStep, steps]
  );

  const updateBookingData = useCallback((data: Partial<BookingData>) => {
    setBookingData((previous) => ({ ...previous, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((previous) =>
      previous < 4 ? ((previous + 1) as BookingStep) : previous
    );
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((previous) =>
      previous > 1 ? ((previous - 1) as BookingStep) : previous
    );
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setBookingData(initialBookingData);
    bookingDataRef.current = initialBookingData;
    setIsSubmitting(false);
    setSubmissionError(null);
    isSubmittingRef.current = false;
  }, []);

  const handleBookingSubmit = useCallback(async () => {
    const snapshot = bookingDataRef.current;

    if (
      isSubmittingRef.current ||
      !business ||
      !snapshot.service ||
      !snapshot.date ||
      !snapshot.time
    ) {
      return;
    }

    const payload: AppointmentInput = {
      business_id: business.id,
      service_id: snapshot.service.id,
      client_name: snapshot.clientName.trim(),
      client_email: snapshot.clientEmail.trim(),
      client_phone: snapshot.clientPhone.trim() || null,
      appointment_date: snapshot.date,
      appointment_time: snapshot.time,
      status: "new",
      notes: snapshot.notes ? snapshot.notes.trim() : null,
    };

    try {
      setSubmissionError(null);
      setIsSubmitting(true);

      const appointment = await createAppointment(payload);

      if (!appointment) {
        throw new Error("Appointment creation failed");
      }

      nextStep();
    } catch (error) {
      console.error("Error creating appointment:", error);
      setSubmissionError("submissionError");
    } finally {
      setIsSubmitting(false);
    }
  }, [business, nextStep]);

  const servicesCount = services.length;

  const averageDuration = useMemo(() => {
    if (!servicesCount) {
      return null;
    }

    const totalDuration = services.reduce(
      (total, service) => total + (service.duration ?? 0),
      0
    );

    const average = Math.round(totalDuration / servicesCount);
    return Number.isFinite(average) && average > 0 ? average : null;
  }, [services, servicesCount]);

  const businessInitials = useMemo(() => {
    if (!business?.name) {
      return "";
    }

    return business.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  }, [business?.name]);

  const submissionErrorMessage = useMemo(() => {
    if (!submissionError) {
      return null;
    }

    return intl.formatMessage({
      id: "booking.submissionError",
      defaultMessage:
        "We couldn't submit your booking. Please review your details and try again.",
    });
  }, [intl, submissionError]);

  const renderBusinessHeader = () => (
    <div className="bg-white shadow-sm">
      <div className="container-responsive py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          <div className="mb-6 flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-4xl font-bold text-white shadow-md lg:mb-0 lg:h-48 lg:w-80">
            {businessInitials || business.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              {business.name}
            </h1>
            {business.description && (
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                {business.description}
              </p>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
              {business.address && (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-teal-500" />
                  <span>{business.address}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-teal-500" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-teal-500" />
                  <span>{business.email}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-teal-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1">
                {intl.formatMessage(
                  {
                    id: "booking.header.servicesCount",
                    defaultMessage:
                      "{count, plural, one {{count} service} other {{count} services}}",
                  },
                  { count: servicesCount }
                )}
              </span>
              {averageDuration && (
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1">
                  <Clock className="h-3.5 w-3.5" />
                  {intl.formatMessage(
                    {
                      id: "booking.header.averageDuration",
                      defaultMessage: "Avg. duration {duration} min",
                    },
                    { duration: intl.formatNumber(averageDuration) }
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgressSteps = () => {
    if (currentStep === 4) {
      return null;
    }

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            {annotatedSteps.map((step) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold sm:h-10 sm:w-10 sm:text-base ${
                      step.isCompleted
                        ? "bg-teal-500 text-white"
                        : step.isActive
                        ? "border-2 border-teal-500 bg-white text-teal-500"
                        : "border-2 border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {step.id}
                  </div>
                  {!step.isLast && (
                    <div
                      className={`mx-2 h-1 flex-1 sm:mx-4 ${
                        step.isCompleted ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid gap-2 text-xs text-gray-500 sm:grid-cols-3 sm:text-sm">
            {annotatedSteps.map((step) => (
              <div
                key={`label-${step.id}`}
                className={
                  step.isCompleted || step.isActive
                    ? "text-teal-600 font-medium"
                    : "text-gray-500"
                }
              >
                <div>{step.label}</div>
                <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            services={services}
            selectedService={bookingData.service}
            updateBookingData={(data) =>
              updateBookingData({ service: data.service })
            }
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            businessId={business.id}
            serviceDuration={bookingData.service?.duration ?? 30}
            selectedDate={bookingData.date}
            selectedTime={bookingData.time}
            updateBookingData={({ date, time }) =>
              updateBookingData({ date, time })
            }
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ClientInfoForm
            bookingData={bookingData}
            updateBookingData={(data) => updateBookingData(data)}
            nextStep={handleBookingSubmit}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <BookingConfirmation
            business={business}
            bookingData={bookingData}
            resetBooking={resetBooking}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderBusinessHeader()}
      {submissionErrorMessage && currentStep !== 4 && (
        <div className="container-responsive pt-4">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {submissionErrorMessage}
          </div>
        </div>
      )}
      {renderProgressSteps()}

      <div className="container-responsive py-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          {servicesCount === 0 && currentStep === 1 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {intl.formatMessage({
                id: "booking.servicesUnavailable",
                defaultMessage: "Services are not available yet. Please check back soon.",
              })}
            </div>
          )}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-4 sm:p-6 lg:p-8">{renderStep()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlowClient;
