"use client";

/*
Component Summary: Lets clients browse and choose a service during the booking flow.
Steps:
1. Normalizes service data and derives categories with memoized helpers.
2. Filters services by search text and category selection while showing details.
3. Updates the booking payload and advances when a service is confirmed.
Component Dependencies: None
External Libs: react, react-intl, lucide-react
*/

import { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Clock, DollarSign, ChevronRight, Search, Tag } from "lucide-react";
import type { Service } from "@/app/types/business";

interface ServiceSelectionProps {
  services: Service[];
  selectedService: Service | null;
  updateBookingData: (data: { service: Service }) => void;
  nextStep: () => void;
}

const ServiceSelection = ({
  services,
  selectedService,
  updateBookingData,
  nextStep,
}: ServiceSelectionProps) => {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const normalizedServices = useMemo(
    () => services.filter((service): service is Service => Boolean(service)),
    [services]
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    normalizedServices.forEach((service) => {
      if (service.category) {
        unique.add(service.category);
      }
    });

    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [normalizedServices]);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedServices.filter((service) => {
      const matchesSearch =
        query.length === 0 ||
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        (service.category ?? "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [normalizedServices, searchQuery, selectedCategory]);

  const handleSelectService = useCallback(
    (service: Service) => {
      updateBookingData({ service });
    },
    [updateBookingData]
  );

  const handleContinue = useCallback(() => {
    if (selectedService) {
      nextStep();
    }
  }, [nextStep, selectedService]);

  const formatDuration = useCallback(
    (duration: number) =>
      `${intl.formatNumber(duration)} ${intl.formatMessage({
        id: "booking.step1.minutes",
        defaultMessage: "minutes",
      })}`,
    [intl]
  );

  const formatPrice = useCallback(
    (service: Service) => {
      if (Number.isFinite(service.price) && service.currency) {
        try {
          return intl.formatNumber(service.price, {
            style: "currency",
            currency: service.currency,
          });
        } catch {
          return `${intl.formatNumber(service.price)} ${service.currency}`;
        }
      }

      return intl.formatNumber(service.price ?? 0);
    },
    [intl]
  );

  const hasServices = normalizedServices.length > 0;
  const hasFilteredServices = filteredServices.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-600">
          {intl.formatMessage({
            id: "booking.title",
            defaultMessage: "Book an appointment",
          })}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {intl.formatMessage({ id: "booking.step1.title" })}
        </h2>
        <p className="mt-2 text-gray-600">
          {intl.formatMessage({
            id: "booking.step1.subtitle",
            defaultMessage: "Choose the service you would like to book.",
          })}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="service-search" className="sr-only">
            {intl.formatMessage({
              id: "booking.step1.searchPlaceholder",
              defaultMessage: "Search services",
            })}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="service-search"
              type="text"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              placeholder={intl.formatMessage({
                id: "booking.step1.searchPlaceholder",
                defaultMessage: "Search services",
              })}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="sm:w-48">
          <label htmlFor="service-category" className="sr-only">
            {intl.formatMessage({
              id: "booking.step1.allCategories",
              defaultMessage: "All categories",
            })}
          </label>
          <select
            id="service-category"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">
              {intl.formatMessage({
                id: "booking.step1.allCategories",
                defaultMessage: "All categories",
              })}
            </option>
            {categories
              .slice(1)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>

      {!hasServices ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
          <p className="text-lg font-semibold">
            {intl.formatMessage({
              id: "booking.step1.noServices",
              defaultMessage: "No services available yet",
            })}
          </p>
          <p className="mt-2 text-sm">
            {intl.formatMessage({
              id: "booking.step1.noServicesHint",
              defaultMessage:
                "The business owner will add services soon. Please check back later.",
            })}
          </p>
        </div>
      ) : !hasFilteredServices ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
          <p className="text-base font-medium">
            {intl.formatMessage({
              id: "booking.step1.noResults",
              defaultMessage: "No services match your filters.",
            })}
          </p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            {intl.formatMessage({
              id: "booking.step1.resetFilters",
              defaultMessage: "Reset filters",
            })}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedService?.id === service.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleSelectService(service)}
                aria-pressed={isSelected}
                className={`group flex w-full flex-col rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 sm:p-6 ${
                  isSelected
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-teal-700 sm:text-xl">
                          {service.name}
                        </h3>
                        {service.category && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700">
                            <Tag className="h-3.5 w-3.5" />
                            {service.category}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 flex-shrink-0 transition-colors ${
                          isSelected
                            ? "text-teal-500"
                            : "text-gray-300 group-hover:text-teal-400"
                        }`}
                      />
                    </div>

                    {service.description && (
                      <p className="mt-3 text-sm text-gray-600 sm:text-base">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm sm:gap-6">
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {formatDuration(service.duration)}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-2 text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-base font-semibold sm:text-lg">
                          {formatPrice(service)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="pt-4">
        <button
          type="button"
          className="btn btn-primary w-full py-4 text-lg font-semibold"
          disabled={!selectedService}
          onClick={handleContinue}
        >
          {selectedService
            ? intl.formatMessage(
                { id: "booking.step1.continueWith", defaultMessage: "Continue with {service}" },
                { service: selectedService.name }
              )
            : intl.formatMessage({
                id: "booking.step1.selectService",
                defaultMessage: "Select a service to continue",
              })}
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;

