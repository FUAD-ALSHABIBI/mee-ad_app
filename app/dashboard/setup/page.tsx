"use client";

/*
Component Summary: Orchestrates the business onboarding wizard inside the dashboard.
Steps:
1. Manages multi-step state and accumulates setup form data across the workflow.
2. Renders individual configuration steps with a progress indicator and navigation controls.
3. Calls Supabase auth and setup helpers to persist configuration and surface the booking URL.
Component Dependencies: app/dashboard/setup/steps/BusinessTypeStep.tsx, app/dashboard/setup/steps/ServicesStep.tsx, app/dashboard/setup/steps/WorkingHoursStep.tsx, app/dashboard/setup/steps/BookingConfirmationStep.tsx, app/dashboard/setup/steps/CompletionStep.tsx
External Libs: react, react-intl, lucide-react, @/lib/supabase/auth, @/lib/setup
*/

import { useState } from "react";
import { useIntl } from "react-intl";
import { CheckCircle2 } from "lucide-react";

import BusinessTypeStep from "./steps/BusinessTypeStep";
import ServicesStep from "./steps/ServicesStep";
import WorkingHoursStep from "./steps/WorkingHoursStep";
import BookingConfirmationStep from "./steps/BookingConfirmationStep";
import CompletionStep from "./steps/CompletionStep";
import { getUser } from "@/lib/supabase/auth";
import { completeSetup as completeSetupLib } from "@/lib/setup";

const SetupWizard = () => {
  const intl = useIntl();

  const [url, setURL] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState<any>({
    businessType: "",
    services: [],
    workingHours: {
      monday: { isOpen: true, slots: [{ start: "09:00", end: "17:00" }] },
      tuesday: { isOpen: true, slots: [{ start: "09:00", end: "17:00" }] },
      wednesday: { isOpen: true, slots: [{ start: "09:00", end: "17:00" }] },
      thursday: { isOpen: true, slots: [{ start: "09:00", end: "17:00" }] },
      friday: { isOpen: true, slots: [{ start: "09:00", end: "17:00" }] },
      saturday: { isOpen: false, slots: [] },
      sunday: { isOpen: false, slots: [] },
    },
    bookingConfirmation: {
      method: "automatic",
      notifications: ["email"],
    },
    bookingUrl: "",
  });

  const totalSteps = 5;

  const updateSetupData = (stepData: Partial<any>) => {
    setSetupData((prev: any) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => currentStep < totalSteps && setCurrentStep((prev) => prev + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((prev) => prev - 1);

  const completeSetup = async () => {
    const user = await getUser();
    try {
      const userName =
        (user as any)?.user_metadata?.name ||
        (user as any)?.email?.split("@")[0] ||
        "user";

      const business = await completeSetupLib(userName, setupData);

      if (business && business.booking_url) {
        setURL(business.booking_url);
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error completing setup:", error);
    }
  };

  const renderStepProgress = () => (
    <div className="mb-10">
      <div className="text-center mb-6">
        <p className="text-base font-semibold text-gray-700">
          {intl.formatMessage(
            { id: "wizard.stepCounter", defaultMessage: "Step {current} of {total}" },
            { current: currentStep, total: totalSteps - 1 }
          )}
        </p>
      </div>

      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps - 1 }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors duration-300 ${
                step < currentStep
                  ? "bg-teal-500 text-white"
                  : step === currentStep
                  ? "border-2 border-teal-500 bg-white text-teal-500 font-bold"
                  : "border-2 border-gray-300 bg-white text-gray-400"
              }`}
            >
              {step < currentStep ? <CheckCircle2 size={20} /> : <span>{step}</span>}
            </div>
            {step < totalSteps - 1 && (
              <div
                className={`h-1 w-12 md:w-20 lg:w-28 mx-2 rounded-full transition-colors duration-300 ${
                  step < currentStep ? "bg-teal-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessTypeStep data={setupData} updateData={updateSetupData} nextStep={nextStep} />;
      case 2:
        return <ServicesStep data={setupData} updateData={updateSetupData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <WorkingHoursStep data={setupData} updateData={updateSetupData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <BookingConfirmationStep data={setupData} updateData={updateSetupData} nextStep={completeSetup} prevStep={prevStep} />;
      case 5:
        return <CompletionStep url={url} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {intl.formatMessage({ id: "wizard.title", defaultMessage: "Business Setup Wizard" })}
        </h1>
      </div>

      {currentStep < 5 && renderStepProgress()}

      <div className="rounded-lg bg-white p-6 shadow-md">{renderStep()}</div>
    </div>
  );
};

export default SetupWizard;

