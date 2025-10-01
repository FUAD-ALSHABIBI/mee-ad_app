"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import { Scissors, Stethoscope, Dumbbell, MessageSquare, MoreHorizontal } from "lucide-react";

const BusinessTypeStep = ({ data, updateData, nextStep }: any) => {
  const intl = useIntl();
  const [businessType, setBusinessType] = useState(data.businessType);
  const [otherType, setOtherType] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!businessType) {
      setError(
        intl.formatMessage({ id: "auth.requiredField", defaultMessage: "This field is required" })
      );
      return;
    }

    if (businessType === "other" && !otherType) {
      setError(
        intl.formatMessage({ id: "auth.requiredField", defaultMessage: "This field is required" })
      );
      return;
    }

    updateData({
      businessType: businessType === "other" ? otherType : businessType,
    });
    nextStep();
  };

  const businessTypes = [
    {
      id: "salon",
      label: intl.formatMessage({ id: "wizard.step1.salon", defaultMessage: "Salon" }),
      icon: <Scissors size={24} />,
    },
    {
      id: "clinic",
      label: intl.formatMessage({ id: "wizard.step1.clinic", defaultMessage: "Clinic" }),
      icon: <Stethoscope size={24} />,
    },
    {
      id: "fitness",
      label: intl.formatMessage({ id: "wizard.step1.fitness", defaultMessage: "Fitness" }),
      icon: <Dumbbell size={24} />,
    },
    {
      id: "consultation",
      label: intl.formatMessage({ id: "wizard.step1.consultation", defaultMessage: "Consultation" }),
      icon: <MessageSquare size={24} />,
    },
    {
      id: "other",
      label: intl.formatMessage({ id: "wizard.step1.other", defaultMessage: "Other" }),
      icon: <MoreHorizontal size={24} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "wizard.step1.title", defaultMessage: "Choose your business type" })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({
            id: "wizard.step1.subtitle",
            defaultMessage: "Select the type of business you want to set up.",
          })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`flex h-24 items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-gray-50 ${
              businessType === type.id
                ? "border-teal-500 bg-teal-50"
                : "border-gray-200"
            }`}
            onClick={() => {
              setBusinessType(type.id);
              setError("");
            }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`mb-2 ${
                  businessType === type.id ? "text-teal-500" : "text-gray-500"
                }`}
              >
                {type.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  businessType === type.id ? "text-teal-700" : "text-gray-700"
                }`}
              >
                {type.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {businessType === "other" && (
        <div>
          <label htmlFor="otherType" className="label">
            {intl.formatMessage({
              id: "wizard.step1.otherPlaceholder",
              defaultMessage: "Enter your business type",
            })}
          </label>
          <input
            id="otherType"
            type="text"
            className="input w-full"
            value={otherType}
            onChange={(e) => {
              setOtherType(e.target.value);
              setError("");
            }}
            placeholder={intl.formatMessage({
              id: "wizard.step1.otherPlaceholder",
              defaultMessage: "Enter your business type",
            })}
          />
        </div>
      )}

      <div className="pt-4">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleContinue}
        >
          {intl.formatMessage({ id: "common.next", defaultMessage: "Next" })}
        </button>
      </div>
    </div>
  );
};

export default BusinessTypeStep;
