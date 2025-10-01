"use client";

import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Settings, ArrowRight } from "lucide-react";

export default function HomePage() {
  const intl = useIntl();
  const router = useRouter();

  // Setup steps localized with react-intl
  const setupSteps = [
    intl.formatMessage({ id: "home.setup.step1", defaultMessage: "Select your business type" }),
    intl.formatMessage({ id: "home.setup.step2", defaultMessage: "Add your services and prices" }),
    intl.formatMessage({ id: "home.setup.step3", defaultMessage: "Set your working hours" }),
    intl.formatMessage({ id: "home.setup.step4", defaultMessage: "Choose notification methods" }),
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {intl.formatMessage({ id: "home.hero.title", defaultMessage: "Organize your bookings" })}
              </h1>
              <p className="mt-4 max-w-md text-lg text-teal-100">
                {intl.formatMessage({ id: "home.hero.subtitle", defaultMessage: "The easiest way to manage appointments online." })}
              </p>
              <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="btn bg-white text-teal-600 hover:bg-teal-50"
                >
                  {intl.formatMessage({ id: "home.hero.cta", defaultMessage: "Get Started" })}
                </button>
                <button
                  onClick={() => router.push("/pricing")}
                  className="btn border border-white bg-transparent text-white hover:bg-white/10"
                >
                  {intl.formatMessage({ id: "common.pricing", defaultMessage: "View Pricing" })}
                </button>
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative rounded-lg bg-white p-6 shadow-xl">
                <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Calendar size={32} />
                </div>
                <div className="pl-12 pt-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {intl.formatMessage({ id: "home.hero.feature.title", defaultMessage: "Online Booking" })}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {intl.formatMessage({ id: "home.hero.feature.desc", defaultMessage: "Let your clients book appointments 24/7" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {intl.formatMessage({ id: "home.features.title", defaultMessage: "Why choose Mee'ad?" })}
            </h2>
            <div className="mx-auto mt-12 grid max-w-xl gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:max-w-none lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
                <div className="rounded-full bg-teal-100 p-3">
                  <Settings size={28} className="text-teal-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {intl.formatMessage({ id: "home.features.feature1.title", defaultMessage: "Easy Setup" })}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {intl.formatMessage({ id: "home.features.feature1.description", defaultMessage: "Configure your business in minutes." })}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
                <div className="rounded-full bg-amber-100 p-3">
                  <Calendar size={28} className="text-amber-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {intl.formatMessage({ id: "home.features.feature2.title", defaultMessage: "Smart Scheduling" })}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {intl.formatMessage({ id: "home.features.feature2.description", defaultMessage: "Automated appointment management." })}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
                <div className="rounded-full bg-indigo-100 p-3">
                  <Users size={28} className="text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {intl.formatMessage({ id: "home.features.feature3.title", defaultMessage: "Client Management" })}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {intl.formatMessage({ id: "home.features.feature3.description", defaultMessage: "Keep track of all your customers easily." })}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
                <div className="rounded-full bg-blue-100 p-3">
                  <Clock size={28} className="text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {intl.formatMessage({ id: "home.features.feature4.title", defaultMessage: "24/7 Availability" })}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {intl.formatMessage({ id: "home.features.feature4.description", defaultMessage: "Your clients can book anytime." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {intl.formatMessage({ id: "home.setup.title", defaultMessage: "Simple setup process" })}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {intl.formatMessage({
                  id: "home.setup.description",
                  defaultMessage:
                    "Create your booking system in just a few steps. Add your services, set your availability, and get a dedicated booking page instantly.",
                })}
              </p>
              <div className="mt-8">
                <ul className="space-y-4">
                  {setupSteps.map((step, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white">
                        {index + 1}
                      </div>
                      <span className="ml-3 text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => router.push("/pricing")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  {intl.formatMessage({ id: "home.setup.cta", defaultMessage: "View Pricing" })}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-10 overflow-hidden rounded-xl shadow-2xl md:mt-0 md:w-1/2">
              {/* Demo Box Placeholder */}
              <div className="bg-white p-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <div className="mb-2 flex items-center">
                    <div className="flex">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-sm text-gray-500">meead.app/dashboard</div>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white p-4">
                    <div className="mb-4 h-8 w-1/3 rounded-full bg-teal-100"></div>
                    <div className="mb-6 space-y-2">
                      <div className="h-4 w-full rounded-full bg-gray-100"></div>
                      <div className="h-4 w-5/6 rounded-full bg-gray-100"></div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <div className="h-12 w-1/4 rounded-lg bg-teal-50 p-2"></div>
                      <div className="h-12 w-1/4 rounded-lg bg-amber-50 p-2"></div>
                      <div className="h-12 w-1/4 rounded-lg bg-indigo-50 p-2"></div>
                    </div>
                    <div className="h-32 rounded-lg bg-gray-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {intl.formatMessage({ id: "home.cta.title", defaultMessage: "Ready to get started?" })}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-100">
              {intl.formatMessage({
                id: "home.cta.subtitle",
                defaultMessage: "Create your free account today and take control of your bookings.",
              })}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/auth/register")}
                className="btn bg-white text-teal-700 hover:bg-teal-50"
              >
                {intl.formatMessage({ id: "home.cta.button", defaultMessage: "Get Started" })}
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="btn border border-white bg-transparent text-white hover:bg-white/10"
              >
                {intl.formatMessage({ id: "home.cta.pricing", defaultMessage: "View Pricing Plans" })}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
