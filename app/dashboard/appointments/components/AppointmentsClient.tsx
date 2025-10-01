"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";
import { RefreshCcw, CheckCircle2, XCircle } from "lucide-react";

import {
  getAppointments,
  updateAppointmentStatus,
  type Appointment,
} from "@/lib/appointment";

type StatusFilter = "all" | Appointment["status"];

type AppointmentsClientProps = {
  businessId: string | null;
  businessName: string | null;
  initialAppointments: Appointment[];
  fetchError: string | null;
};

const statusColorMap: Record<Appointment["status"], string> = {
  new: "bg-amber-100 text-amber-700",
  confirmed: "bg-teal-100 text-teal-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-slate-100 text-slate-700",
};

const defaultStatusLabels: Record<Appointment["status"], string> = {
  new: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const statusFilterOptions: Array<{
  value: StatusFilter;
  messageId: string;
  defaultMessage: string;
}> = [
  { value: "all", messageId: "dashboard.bookings.all", defaultMessage: "All appointments" },
  { value: "new", messageId: "dashboard.bookings.pending", defaultMessage: "Pending" },
  { value: "confirmed", messageId: "dashboard.bookings.confirmed", defaultMessage: "Confirmed" },
  { value: "cancelled", messageId: "dashboard.bookings.cancelled", defaultMessage: "Cancelled" },
  { value: "completed", messageId: "dashboard.bookings.completed", defaultMessage: "Completed" },
];

export default function AppointmentsClient(props: AppointmentsClientProps) {
  const intl = useIntl();
  const [appointments, setAppointments] = useState<Appointment[]>(props.initialAppointments);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(props.fetchError);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setAppointments(props.initialAppointments);
  }, [props.initialAppointments]);

  useEffect(() => {
    setErrorMessage(props.fetchError);
  }, [props.fetchError]);

  const handleRefresh = useCallback(async () => {
    if (!props.businessId) {
      return;
    }

    try {
      setIsRefreshing(true);
      setErrorMessage(null);
      const data = await getAppointments(props.businessId);
      setAppointments(data);
    } catch (error) {
      console.error("Appointments refresh error:", error);
      setErrorMessage(
        intl.formatMessage({
          id: "dashboard.bookings.refreshError",
          defaultMessage: "Could not refresh appointments. Please try again.",
        })
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [intl, props.businessId]);

  useEffect(() => {
    if (!props.businessId) {
      return;
    }

    if (props.initialAppointments.length > 0 || props.fetchError) {
      return;
    }

    handleRefresh();
  }, [handleRefresh, props.businessId, props.fetchError, props.initialAppointments.length]);

  const handleUpdateStatus = useCallback(
    async (id: string, status: Appointment["status"]) => {
      if (!props.businessId) {
        return;
      }

      try {
        setUpdatingId(id);
        setErrorMessage(null);
        const updated = await updateAppointmentStatus(id, status);

        if (!updated) {
          throw new Error("Status update failed");
        }

        setAppointments((prev) => prev.map((appt) => (appt.id === id ? updated : appt)));
      } catch (error) {
        console.error("Appointment status update error:", error);
        setErrorMessage(
          intl.formatMessage({
            id: "dashboard.bookings.statusUpdateError",
            defaultMessage: "Could not update the appointment status. Please try again.",
          })
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [intl, props.businessId]
  );

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") {
      return appointments;
    }

    return appointments.filter((appt) => appt.status === statusFilter);
  }, [appointments, statusFilter]);

  const hasBusiness = Boolean(props.businessId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {intl.formatMessage({
              id: "dashboard.bookings.title",
              defaultMessage: "Appointments",
            })}
          </h1>
          {props.businessName && (
            <p className="text-sm text-gray-500">
              {intl.formatMessage(
                {
                  id: "dashboard.bookings.businessLabel",
                  defaultMessage: "Showing appointments for {name}",
                },
                { name: props.businessName }
              )}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-outline inline-flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing || !hasBusiness}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {intl.formatMessage({
              id: "dashboard.bookings.refresh",
              defaultMessage: "Refresh",
            })}
          </button>
        </div>
      </header>

      {!hasBusiness ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-lg font-medium text-gray-900">
            {intl.formatMessage({
              id: "dashboard.bookings.completeSetup",
              defaultMessage: "Complete setup",
            })}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {intl.formatMessage({
              id: "dashboard.bookings.completeSetupDescription",
              defaultMessage: "Finish setting up your business to start receiving appointments.",
            })}
          </p>
          <Link href="/dashboard/setup" className="btn btn-primary mt-4 inline-flex items-center justify-center">
            {intl.formatMessage({ id: "wizard.title", defaultMessage: "Business Setup Wizard" })}
          </Link>
        </div>
      ) : (
        <>
          <StatusFilterChips
            value={statusFilter}
            onChange={setStatusFilter}
            disabled={isRefreshing && appointments.length === 0}
          />

          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </div>
          )}

          <AppointmentsList
            appointments={filteredAppointments}
            intl={intl}
            isRefreshing={isRefreshing}
            updatingId={updatingId}
            onUpdateStatus={handleUpdateStatus}
          />
        </>
      )}
    </div>
  );
}

type StatusFilterChipsProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  disabled?: boolean;
};

function StatusFilterChips({ value, onChange, disabled }: StatusFilterChipsProps) {
  const intl = useIntl();

  return (
    <div className="flex flex-wrap gap-2">
      {statusFilterOptions.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              isActive
                ? "border-teal-500 bg-teal-50 text-teal-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            } ${disabled ? "opacity-60" : ""}`}
          >
            {intl.formatMessage({ id: option.messageId, defaultMessage: option.defaultMessage })}
          </button>
        );
      })}
    </div>
  );
}

type AppointmentsListProps = {
  appointments: Appointment[];
  intl: IntlShape;
  isRefreshing: boolean;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: Appointment["status"]) => Promise<void>;
};

function AppointmentsList({ appointments, intl, isRefreshing, updatingId, onUpdateStatus }: AppointmentsListProps) {
  if (isRefreshing && appointments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
        {intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
        {intl.formatMessage({
          id: "dashboard.bookings.noBookings",
          defaultMessage: "No appointments found",
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentRow
          key={appointment.id}
          appointment={appointment}
          intl={intl}
          isUpdating={updatingId === appointment.id}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}

type AppointmentRowProps = {
  appointment: Appointment;
  intl: IntlShape;
  isUpdating: boolean;
  onUpdateStatus: (id: string, status: Appointment["status"]) => Promise<void>;
};

function AppointmentRow({ appointment, intl, isUpdating, onUpdateStatus }: AppointmentRowProps) {
  const dateTime = useMemo(() => {
    if (!appointment.appointment_date) {
      return null;
    }

    const normalizedTime = (() => {
      if (!appointment.appointment_time) {
        return "00:00:00";
      }

      if (appointment.appointment_time.length === 5) {
        return `${appointment.appointment_time}:00`;
      }

      if (appointment.appointment_time.length === 8) {
        return appointment.appointment_time;
      }

      return "00:00:00";
    })();

    const parsed = new Date(`${appointment.appointment_date}T${normalizedTime}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [appointment.appointment_date, appointment.appointment_time]);

  const formattedDate = dateTime
    ? intl.formatDate(dateTime, { dateStyle: "medium" })
    : intl.formatMessage({ id: "dashboard.bookings.noDate", defaultMessage: "No date" });

  const formattedTime = dateTime
    ? intl.formatTime(dateTime, { hour: "numeric", minute: "2-digit" })
    : intl.formatMessage({ id: "dashboard.bookings.noTime", defaultMessage: "No time" });

  const statusLabel = intl.formatMessage({
    id: `dashboard.bookings.${appointment.status}`,
    defaultMessage: defaultStatusLabels[appointment.status],
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">
            {appointment.client_name ||
              intl.formatMessage({
                id: "dashboard.bookings.client",
                defaultMessage: "Client",
              })}
          </p>
          {appointment.client_email && (
            <p className="text-sm text-gray-500">{appointment.client_email}</p>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>
              {intl.formatMessage({ id: "dashboard.bookings.date", defaultMessage: "Date" })}: {formattedDate}
            </span>
            <span>
              {intl.formatMessage({ id: "dashboard.bookings.time", defaultMessage: "Time" })}: {formattedTime}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColorMap[appointment.status]}`}
          >
            {statusLabel}
          </span>

          <div className="flex flex-wrap gap-2">
            {appointment.status === "new" && (
              <button
                type="button"
                className="btn btn-primary inline-flex items-center gap-2 text-sm"
                onClick={() => onUpdateStatus(appointment.id, "confirmed")}
                disabled={isUpdating}
              >
                <CheckCircle2 className="h-4 w-4" />
                {intl.formatMessage({ id: "dashboard.bookings.confirm", defaultMessage: "Confirm" })}
              </button>
            )}

            {(appointment.status === "new" || appointment.status === "confirmed") && (
              <button
                type="button"
                className="btn btn-outline inline-flex items-center gap-2 text-sm text-red-600"
                onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4" />
                {intl.formatMessage({ id: "dashboard.bookings.cancel", defaultMessage: "Cancel" })}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
