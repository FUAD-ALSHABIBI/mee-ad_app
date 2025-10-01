"use client";

import { useMemo } from "react";
import { useIntl } from "react-intl";
import Link from "next/link";
import { Calendar, Users, Clock, ClipboardList } from "lucide-react";

type DashboardClientProps = {
  userEmail: string;
  businessName: string | null;
  businessDescription: string | null;
  bookingLink: string | null;
  stats: {
    today: number;
    upcoming: number;
    total: number;
    new: number;
  };
  services: Array<{
    id: string;
    name: string;
    duration: number | null;
    price: number | null;
    currency: string | null;
  }>;
  hasMoreServices: boolean;
  upcomingAppointments: Array<{
    id: string;
    customerName: string | null;
    serviceName: string | null;
    status: string | null;
    scheduledAt: string | null;
  }>;
};

const statusColorMap: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  confirmed: "bg-teal-100 text-teal-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-slate-100 text-slate-700",
};

const statusMessageIdMap: Record<string, string> = {
  new: "dashboard.bookings.new",
  confirmed: "dashboard.bookings.confirmed",
  cancelled: "dashboard.bookings.cancelled",
  completed: "dashboard.bookings.completed",
};

const baseStats = [
  { key: "today", icon: Calendar, labelId: "dashboard.overview.todayBookings", defaultMessage: "Today's Bookings" },
  { key: "upcoming", icon: Users, labelId: "dashboard.overview.upcomingBookings", defaultMessage: "Upcoming Bookings" },
  { key: "total", icon: ClipboardList, labelId: "dashboard.overview.totalBookings", defaultMessage: "Total Bookings" },
  { key: "new", icon: Clock, labelId: "dashboard.overview.newBookings", defaultMessage: "New Bookings" },
] as const;

export default function DashboardClient({
  userEmail,
  businessName,
  businessDescription,
  bookingLink,
  stats,
  services,
  hasMoreServices,
  upcomingAppointments,
}: DashboardClientProps) {
  const intl = useIntl();

  const overviewStats = useMemo(
    () =>
      baseStats.map((stat) => ({
        ...stat,
        value: stats[stat.key],
      })),
    [stats]
  );

  const hasBusiness = Boolean(businessName);

  const formattedServices = useMemo(
    () =>
      services.map((service) => {
        let priceLabel: string;

        if (service.price !== null && service.currency) {
          try {
            priceLabel = intl.formatNumber(service.price, {
              style: "currency",
              currency: service.currency,
              maximumFractionDigits: 2,
            });
          } catch (error) {
            console.warn("Unable to format service price", error);
            priceLabel = `${service.price.toFixed(2)} ${service.currency}`;
          }
        } else {
          priceLabel = intl.formatMessage({
            id: "dashboard.services.noPrice",
            defaultMessage: "No price",
          });
        }

        return {
          ...service,
          priceLabel,
        };
      }),
    [services, intl]
  );

  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {intl.formatMessage(
                { id: "common.welcome", defaultMessage: "Welcome" },
                { name: businessName ?? userEmail }
              )}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              {businessDescription ??
                intl.formatMessage({
                  id: "dashboard.overview.subtitle",
                  defaultMessage: "Here is a quick overview of your booking activity.",
                })}
            </p>
          </div>
          {!hasBusiness && (
            <Link href="/dashboard/setup" className="btn btn-primary self-start">
              {intl.formatMessage({ id: "common.continue", defaultMessage: "Continue" })}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.key} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <stat.icon size={22} />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  {intl.formatMessage({ id: stat.labelId, defaultMessage: stat.defaultMessage })}
                </h2>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {intl.formatNumber(stat.value ?? 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {intl.formatMessage({ id: "dashboard.bookings.upcoming", defaultMessage: "Upcoming" })}
              </h2>
              <p className="text-sm text-gray-500">
                {intl.formatMessage({
                  id: "dashboard.bookings.manageAppointments",
                  defaultMessage: "Manage and track all your appointments",
                })}
              </p>
            </div>
            <Link href="/dashboard/appointments" className="text-sm font-medium text-teal-600 hover:text-teal-500">
              {intl.formatMessage({ id: "dashboard.overview.viewAll", defaultMessage: "View All" })}
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="px-4 sm:px-6 py-10 text-center text-sm text-gray-500">
              {intl.formatMessage({ id: "dashboard.bookings.noBookings", defaultMessage: "No appointments found" })}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((appointment) => {
                const statusKey = (appointment.status ?? "").toLowerCase();
                const scheduledDate = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;

                return (
                  <div key={appointment.id} className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {appointment.customerName ??
                            intl.formatMessage({ id: "dashboard.bookings.client", defaultMessage: "Client" })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.serviceName ??
                            intl.formatMessage({ id: "dashboard.bookings.service", defaultMessage: "Service" })}
                        </p>
                      </div>

                      <div className="text-sm text-gray-500 md:text-right">
                        <p className="font-medium text-gray-900">
                          {scheduledDate
                            ? intl.formatDate(scheduledDate, { month: "short", day: "numeric" })
                            : intl.formatMessage({ id: "dashboard.bookings.noDate", defaultMessage: "No date" })}
                        </p>
                        <p>
                          {scheduledDate
                            ? intl.formatTime(scheduledDate, { hour: "numeric", minute: "numeric" })
                            : intl.formatMessage({ id: "dashboard.bookings.noTime", defaultMessage: "No time" })}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusColorMap[statusKey] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {intl.formatMessage({
                          id: statusMessageIdMap[statusKey] ?? "dashboard.bookings.status",
                          defaultMessage: appointment.status ?? "-",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900">
              {intl.formatMessage({ id: "dashboard.settings.services", defaultMessage: "Services" })}
            </h2>
            <p className="text-sm text-gray-500">
              {intl.formatMessage({
                id: "dashboard.settings.servicesInfo",
                defaultMessage: "Manage the services you offer",
              })}
            </p>

            <div className="mt-4 space-y-4">
              {formattedServices.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {intl.formatMessage({
                    id: "wizard.step2.noServices",
                    defaultMessage: "No services added yet",
                  })}
                </p>
              ) : (
                formattedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                      {service.duration !== null && (
                        <p className="text-xs text-gray-500">
                          {intl.formatMessage({
                            id: "wizard.step2.duration",
                            defaultMessage: "Duration (minutes)",
                          })}
                          {": "}
                          {intl.formatNumber(service.duration)}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{service.priceLabel}</p>
                  </div>
                ))
              )}
            </div>

            {hasMoreServices && (
              <Link href="/dashboard/services" className="mt-4 inline-flex text-sm text-teal-600 hover:text-teal-500">
                {intl.formatMessage({ id: "dashboard.overview.viewAll", defaultMessage: "View All" })}
              </Link>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900">
              {intl.formatMessage({ id: "wizard.complete.bookingLink", defaultMessage: "Your booking link" })}
            </h2>
            <p className="text-sm text-gray-500">
              {intl.formatMessage({
                id: "dashboard.overview.shareLink",
                defaultMessage: "Share this link with your clients to allow them to book appointments.",
              })}
            </p>

            <div className="mt-4 space-y-3">
              {bookingLink ? (
                <>
                  <code className="block rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 break-all">
                    {bookingLink}
                  </code>
                  <a
                    href={bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex w-full justify-center"
                  >
                    {intl.formatMessage({
                      id: "wizard.complete.viewBookingPage",
                      defaultMessage: "View Booking Page",
                    })}
                  </a>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  {intl.formatMessage({
                    id: "dashboard.overview.noBookingLink",
                    defaultMessage: "Complete your setup to generate a booking link.",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





