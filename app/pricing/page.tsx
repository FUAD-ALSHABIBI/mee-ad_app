"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { Check, Star, Zap, Crown, Sparkles } from "lucide-react";

export default function PricingPage() {
  const intl = useIntl();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const t = (id: string, fallback: string) =>
    intl.formatMessage({ id, defaultMessage: fallback });

  const packages = [
    {
      id: "trial",
      name: t("pricing.trial.name", "Free Trial"),
      icon: <Sparkles className="h-6 w-6" />,
      price: { monthly: 0, annually: 0 },
      originalPrice: { monthly: 0, annually: 0 },
      savings: { monthly: 0, annually: 0 },
      popular: false,
      description: t("pricing.trial.desc", "Start free for 14 days"),
      features: [
        t("pricing.trial.feature1", "Basic booking page"),
        t("pricing.trial.feature2", "Appointment management calendar"),
        t("pricing.trial.feature3", "50 automatic alerts per month"),
        t("pricing.trial.feature4", "Email support"),
        t("pricing.trial.feature5", "Basic reports"),
      ],
      buttonText: t("pricing.trial.cta", "Start Free Trial"),
      buttonStyle: "btn-outline border-gray-300 hover:bg-gray-50",
    },
    {
      id: "starter",
      name: t("pricing.starter.name", "Starter Package"),
      icon: <Check className="h-6 w-6" />,
      price: { monthly: 119, annually: 1190 },
      originalPrice: { monthly: 119, annually: 1440 },
      savings: { monthly: 0, annually: 250 },
      popular: false,
      description: t("pricing.starter.desc", "Perfect for small businesses"),
      features: [
        t("pricing.starter.feature1", "Ready-made and professional booking page"),
        t("pricing.starter.feature2", "Appointment management calendar"),
        t("pricing.starter.feature3", "200 automatic alerts per month (SMS / WhatsApp)"),
        t("pricing.starter.feature4", "Email support"),
        t("pricing.starter.feature5", "Simplified monthly reports"),
      ],
      buttonText: t("pricing.starter.cta", "Choose Starter"),
      buttonStyle: "btn-primary",
    },
    {
      id: "business",
      name: t("pricing.business.name", "Business Package - Pro"),
      icon: <Star className="h-6 w-6" />,
      price: { monthly: 299, annually: 2990 },
      originalPrice: { monthly: 299, annually: 3600 },
      savings: { monthly: 0, annually: 610 },
      popular: true,
      description: t("pricing.business.desc", "Most in demand for growing businesses"),
      features: [
        t("pricing.business.feature1", "Everything in Basic +"),
        t("pricing.business.feature2", "Customized design and logo"),
        t("pricing.business.feature3", "Google Calendar & Zoom integration"),
        t("pricing.business.feature4", "1,000 alerts per month"),
        t("pricing.business.feature5", "Advanced reporting and analytics"),
        t("pricing.business.feature6", "Fast WhatsApp support"),
      ],
      buttonText: t("pricing.business.cta", "Choose Pro"),
      buttonStyle:
        "btn-primary bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
    },
    {
      id: "enterprise",
      name: t("pricing.enterprise.name", "Enterprise Package"),
      icon: <Crown className="h-6 w-6" />,
      price: { monthly: 699, annually: 6990 },
      originalPrice: { monthly: 699, annually: 8400 },
      savings: { monthly: 0, annually: 1410 },
      popular: false,
      description: t("pricing.enterprise.desc", "For large companies and enterprises"),
      features: [
        t("pricing.enterprise.feature1", "Everything in Pro +"),
        t("pricing.enterprise.feature2", "Unlimited alerts"),
        t("pricing.enterprise.feature3", "Multiple employee/branch linking"),
        t("pricing.enterprise.feature4", "Advanced control panel with permissions"),
        t("pricing.enterprise.feature5", "Monthly business development consultations"),
        t("pricing.enterprise.feature6", "Live VIP support and calls"),
      ],
      buttonText: t("pricing.enterprise.cta", "Choose Enterprise"),
      buttonStyle:
        "btn-primary bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
    },
  ];

  const handleSelectPackage = (pkgId: string) => {
    if (pkgId === "trial") {
      router.push("/auth/register");
    } else {
      router.push(`/auth/register?plan=${pkgId}&cycle=${billingCycle}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {t("pricing.title", "Choose the Right Plan for You")}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t(
              "pricing.subtitle",
              "Flexible packages suitable for all business sizes, from startups to large enterprises"
            )}
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 text-sm font-medium rounded-md ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("pricing.monthly", "Monthly")}
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={`px-6 py-2 text-sm font-medium rounded-md ${
                  billingCycle === "annually"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("pricing.annually", "Annually")}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t("pricing.saveMore", "Save more")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-105 ${
              pkg.popular ? "ring-2 ring-teal-500 scale-105" : ""
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg">
                  <Zap className="h-4 w-4 mr-1" />
                  {t("pricing.popular", "Most Popular")}
                </span>
              </div>
            )}

            <div className="flex items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  pkg.id === "trial"
                    ? "bg-gray-100 text-gray-600"
                    : pkg.id === "starter"
                    ? "bg-teal-100 text-teal-600"
                    : pkg.id === "business"
                    ? "bg-gradient-to-br from-teal-100 to-blue-100 text-teal-600"
                    : "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600"
                }`}
              >
                {pkg.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  {pkg.price[billingCycle]}
                </span>
                <span className="ml-2 text-lg font-medium text-gray-600">
                  {t("pricing.currency", "SAR")}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  /{billingCycle === "monthly" ? t("pricing.month", "month") : t("pricing.year", "year")}
                </span>
              </div>

              {billingCycle === "annually" && pkg.savings.annually > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500 line-through">
                    {pkg.originalPrice.annually} {t("pricing.currency", "SAR")}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t("pricing.save", "Save")} {pkg.savings.annually} {t("pricing.currency", "SAR")}
                  </span>
                </div>
              )}
            </div>

            <ul className="mt-8 space-y-3">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPackage(pkg.id)}
              className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-all ${pkg.buttonStyle}`}
            >
              {pkg.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("pricing.faq.title", "Frequently Asked Questions")}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t("pricing.faq.q1", "Can I change my plan later?")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "pricing.faq.a1",
                  "Yes, you can upgrade or downgrade your plan at any time. Changes will apply in the next billing cycle."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t("pricing.faq.q2", "What payment methods are available?")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "pricing.faq.a2",
                  "We accept all major credit cards, bank transfers, and local payment methods in Saudi Arabia."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t("pricing.faq.q3", "Are there any setup fees?")}
              </h3>
              <p className="text-gray-600">
                {t("pricing.faq.a3", "No, all plans have no setup fees. What you see is what you pay.")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t("pricing.faq.q4", "Can I cancel my subscription anytime?")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "pricing.faq.a4",
                  "Yes, you can cancel your subscription anytime. You won't be charged after your current period ends."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            {t("pricing.cta.title", "Ready to grow your business?")}
          </h2>
          <p className="mt-4 text-xl text-teal-100">
            {t("pricing.cta.subtitle", "Start your free trial today - no credit card required")}
          </p>
          <button
            onClick={() => router.push("/auth/register")}
            className="mt-8 inline-flex items-center px-8 py-3 rounded-lg text-lg font-medium text-teal-600 bg-white hover:bg-gray-50 transition-colors"
          >
            {t("pricing.cta.button", "Start Free Trial")}
          </button>
        </div>
      </div>
    </div>
  );
}
