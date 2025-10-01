"use client";

/*
Component Summary: Provides the dashboard settings UI to manage business profile data.
Steps:
1. Builds tab metadata and form defaults from existing business records with react-intl labels.
2. Tracks form changes, dirty state, and handles reset interactions.
3. Persists updates through updateBusinessDetails while reporting success or failure to the user.
Component Dependencies: None
External Libs: react, react-intl, next/link, @/lib/business
*/

import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";

import { updateBusinessDetails } from "@/lib/business";

export type SettingsBusiness = {
  id: string;
  name?: string | null;
  description?: string | null;
  business_type?: string | null;
  booking_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
};

export type SettingsService = {
  id: string;
  name: string | null;
  duration: number | null;
  price: number | null;
  currency: string | null;
  category: string | null;
};

type SettingsClientProps = {
  business: SettingsBusiness | null;
  services: SettingsService[];
  userEmail: string | null;
};

type SaveState = "idle" | "saving" | "success" | "error";

type FormState = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

const TAB_IDS = ["general", "services", "availability", "notifications", "appearance", "account"] as const;

type TabId = typeof TAB_IDS[number];

const placeholderTabs: Record<TabId, { infoId: string; contentId: string }> = {
  general: { infoId: "dashboard.settings.businessInfo", contentId: "dashboard.settings.businessInfo" },
  services: { infoId: "dashboard.settings.servicesInfo", contentId: "dashboard.settings.servicesContent" },
  availability: { infoId: "dashboard.settings.availabilityInfo", contentId: "dashboard.settings.availabilityContent" },
  notifications: { infoId: "dashboard.settings.notificationsInfo", contentId: "dashboard.settings.notificationsContent" },
  appearance: { infoId: "dashboard.settings.appearanceInfo", contentId: "dashboard.settings.appearanceContent" },
  account: { infoId: "dashboard.settings.accountInfo", contentId: "dashboard.settings.accountContent" },
};

function buildInitialForm(business: SettingsClientProps["business"], fallbackEmail: string | null): FormState {
  return {
    name: business?.name ?? "",
    description: business?.description ?? "",
    address: business?.address ?? "",
    phone: business?.phone ?? "",
    email: business?.email ?? fallbackEmail ?? "",
    website: business?.website ?? "",
  };
}

export default function SettingsClient({ business, services, userEmail }: SettingsClientProps) {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [form, setForm] = useState<FormState>(() => buildInitialForm(business, userEmail));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tabs = useMemo(
    () =>
      TAB_IDS.map((id) => ({
        id,
        label: intl.formatMessage({
          id: `dashboard.settings.${id}`,
          defaultMessage: id.charAt(0).toUpperCase() + id.slice(1),
        }),
      })),
    [intl]
  );

  const isDirty = useMemo(() => {
    const initial = buildInitialForm(business, userEmail);
    return (
      form.name !== initial.name ||
      form.description !== initial.description ||
      form.address !== initial.address ||
      form.phone !== initial.phone ||
      form.email !== initial.email ||
      form.website !== initial.website
    );
  }, [business, form, userEmail]);

  const handleInputChange = useCallback(
    (field: keyof FormState) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        if (saveState !== "idle") {
          setSaveState("idle");
          setErrorMessage(null);
        }
      },
    [saveState]
  );

  const handleReset = useCallback(() => {
    setForm(buildInitialForm(business, userEmail));
    setSaveState("idle");
    setErrorMessage(null);
  }, [business, userEmail]);

  const handleSave = useCallback(async () => {
    if (!business) {
      return;
    }

    try {
      setSaveState("saving");
      setErrorMessage(null);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
      } as const;

      const updated = await updateBusinessDetails(business.id, payload);

      if (!updated) {
        throw new Error("Update returned null");
      }

      setForm(buildInitialForm(updated, userEmail));
      setSaveState("success");
    } catch (error) {
      console.error("Settings save error:", error);
      setSaveState("error");
      setErrorMessage(
        intl.formatMessage({
          id: "dashboard.settings.saveError",
          defaultMessage: "We couldn't save your changes. Please try again.",
        })
      );
    }
  }, [business, form, intl, userEmail]);

  if (!business) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({
            id: "dashboard.settings.noBusiness",
            defaultMessage: "No business found",
          })}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {intl.formatMessage({
            id: "dashboard.settings.completeSetup",
            defaultMessage: "Complete your setup to manage settings.",
          })}
        </p>
        <Link href="/dashboard/setup" className="btn btn-primary mt-6 inline-flex">
          {intl.formatMessage({
            id: "dashboard.settings.startSetup",
            defaultMessage: "Start setup",
          })}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {intl.formatMessage({ id: "dashboard.settings.title", defaultMessage: "Settings" })}
        </h1>
        <p className="text-sm text-gray-600">
          {intl.formatMessage({
            id: "dashboard.settings.subtitle",
            defaultMessage: "Manage your account and business settings",
          })}
        </p>
      </header>

      {saveState === "success" && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="alert">
          {intl.formatMessage({
            id: "dashboard.settings.saveSuccess",
            defaultMessage: "Changes saved successfully",
          })}
        </div>
      )}

      {saveState === "error" && errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto" aria-label="Settings tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-teal-500 text-teal-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id as TabId)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" ? (
            <GeneralSettingsTab form={form} onChange={handleInputChange} />
          ) : (
            <PlaceholderTab tabId={activeTab} />
          )}

          {activeTab === "services" && services.length > 0 && (
            <ServicesTable services={services} />
          )}

          {activeTab === "general" && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleReset}
                disabled={saveState === "saving" || !isDirty}
              >
                {intl.formatMessage({ id: "common.cancel", defaultMessage: "Cancel" })}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saveState === "saving" || !isDirty}
              >
                {saveState === "saving"
                  ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
                  : intl.formatMessage({ id: "dashboard.settings.save", defaultMessage: "Save Changes" })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type handleFactory = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

type GeneralSettingsTabProps = {
  form: FormState;
  onChange: handleFactory;
};

function GeneralSettingsTab({ form, onChange }: GeneralSettingsTabProps) {
  const intl = useIntl();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {intl.formatMessage({ id: "dashboard.settings.business", defaultMessage: "Business Information" })}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {intl.formatMessage({
            id: "dashboard.settings.businessInfo",
            defaultMessage: "Update your business information and contact details",
          })}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="businessName" className="label">
            {intl.formatMessage({ id: "dashboard.settings.businessName", defaultMessage: "Business Name" })}
          </label>
          <input
            id="businessName"
            className="input w-full"
            value={form.name}
            onChange={onChange("name")}
            placeholder={intl.formatMessage({ id: "dashboard.settings.businessName", defaultMessage: "Business Name" })}
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            {intl.formatMessage({ id: "dashboard.settings.description", defaultMessage: "Description" })}
          </label>
          <textarea
            id="description"
            rows={3}
            className="input w-full"
            value={form.description}
            onChange={onChange("description")}
            placeholder={intl.formatMessage({ id: "dashboard.settings.description", defaultMessage: "Description" })}
          />
        </div>

        <div>
          <label htmlFor="address" className="label">
            {intl.formatMessage({ id: "dashboard.settings.address", defaultMessage: "Address" })}
          </label>
          <input
            id="address"
            className="input w-full"
            value={form.address}
            onChange={onChange("address")}
            placeholder={intl.formatMessage({ id: "dashboard.settings.address", defaultMessage: "Address" })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="label">
              {intl.formatMessage({ id: "dashboard.settings.phoneNumber", defaultMessage: "Phone Number" })}
            </label>
            <input
              id="phone"
              className="input w-full"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder={intl.formatMessage({ id: "dashboard.settings.phoneNumber", defaultMessage: "Phone Number" })}
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              {intl.formatMessage({ id: "dashboard.settings.email", defaultMessage: "Email" })}
            </label>
            <input
              id="email"
              type="email"
              className="input w-full"
              value={form.email}
              onChange={onChange("email")}
              placeholder={intl.formatMessage({ id: "dashboard.settings.email", defaultMessage: "Email" })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="label">
            {intl.formatMessage({ id: "dashboard.settings.website", defaultMessage: "Website" })}
          </label>
          <input
            id="website"
            className="input w-full"
            value={form.website}
            onChange={onChange("website")}
            placeholder="https://"
          />
        </div>
      </div>
    </div>
  );
}

type ServicesTableProps = {
  services: SettingsService[];
};

function ServicesTable({ services }: ServicesTableProps) {
  const intl = useIntl();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">
        {intl.formatMessage({ id: "dashboard.settings.services", defaultMessage: "Services" })}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {intl.formatMessage({ id: "dashboard.settings.servicesInfo", defaultMessage: "Manage the services you offer" })}
      </p>

      {services.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          {intl.formatMessage({
            id: "dashboard.settings.servicesContent",
            defaultMessage: "Services management coming soon...",
          })}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {intl.formatMessage({ id: "dashboard.settings.services", defaultMessage: "Services" })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {intl.formatMessage({ id: "wizard.step2.duration", defaultMessage: "Duration (minutes)" })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {intl.formatMessage({ id: "wizard.step2.price", defaultMessage: "Price" })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {intl.formatMessage({ id: "common.category", defaultMessage: "Category" })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{service.name ?? ""}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {service.duration ? intl.formatNumber(service.duration) : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {service.price !== null && service.price !== undefined && service.currency
                      ? `${intl.formatNumber(service.price, { maximumFractionDigits: 2 })} ${service.currency}`
                      : intl.formatMessage({ id: "dashboard.services.noPrice", defaultMessage: "No price" })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{service.category ?? intl.formatMessage({ id: "common.general", defaultMessage: "General" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type PlaceholderTabProps = {
  tabId: TabId;
};

function PlaceholderTab({ tabId }: PlaceholderTabProps) {
  const intl = useIntl();
  const copy = placeholderTabs[tabId];

  if (tabId === "general") {
    return null;
  }

  return (
    <div className="space-y-3 text-sm text-gray-600">
      <p>{intl.formatMessage({ id: copy.infoId, defaultMessage: "This section is coming soon." })}</p>
      <p className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
        {intl.formatMessage({ id: copy.contentId, defaultMessage: "Feature coming soon." })}
      </p>
    </div>
  );
}

