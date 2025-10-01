"use client";

import { useState } from "react";
import { useIntl } from "react-intl";

const BookingConfirmationStep = ({ data, updateData, nextStep, prevStep }: any) => {
  const intl = useIntl();
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(
    data.bookingConfirmation
  );

  const handleMethodChange = (method: "automatic" | "manual") => {
    setBookingConfirmation({
      ...bookingConfirmation,
      method,
    });
  };

  const handleNotificationToggle = (type: string) => {
    const notifications = [...bookingConfirmation.notifications];
    const index = notifications.indexOf(type);

    if (index === -1) {
      notifications.push(type);
    } else {
      notifications.splice(index, 1);
    }

    setBookingConfirmation({
      ...bookingConfirmation,
      notifications,
    });
  };

  const handleContinue = () => {
    const username = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!).name.toLowerCase()
      : "user" + Date.now();

    updateData({
      bookingConfirmation,
      bookingUrl: `meead.app/${username}`,
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({
            id: "wizard.step4.title",
            defaultMessage: "Booking confirmation",
          })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({
            id: "wizard.step4.subtitle",
            defaultMessage: "Choose how bookings should be confirmed.",
          })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Confirmation Method */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {intl.formatMessage({
              id: "wizard.step4.confirmationMethod",
              defaultMessage: "Confirmation method",
            })}
          </h3>

          <div className="space-y-3">
            {/* Automatic */}
            <div
              className={`flex cursor-pointer items-start rounded-lg border p-4 ${
                bookingConfirmation.method === "automatic"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleMethodChange("automatic")}
            >
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={bookingConfirmation.method === "automatic"}
                  onChange={() => handleMethodChange("automatic")}
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900">
                  {intl.formatMessage({
                    id: "wizard.step4.automatic",
                    defaultMessage: "Automatic",
                  })}
                </label>
              </div>
            </div>

            {/* Manual */}
            <div
              className={`flex cursor-pointer items-start rounded-lg border p-4 ${
                bookingConfirmation.method === "manual"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleMethodChange("manual")}
            >
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={bookingConfirmation.method === "manual"}
                  onChange={() => handleMethodChange("manual")}
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900">
                  {intl.formatMessage({
                    id: "wizard.step4.manual",
                    defaultMessage: "Manual",
                  })}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {intl.formatMessage({
              id: "wizard.step4.notifications",
              defaultMessage: "Notifications",
            })}
          </h3>

          <div className="space-y-3">
            {["email", "sms", "whatsapp"].map((type) => (
              <div key={type} className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id={type}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={bookingConfirmation.notifications.includes(type)}
                    onChange={() => handleNotificationToggle(type)}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor={type} className="text-sm font-medium text-gray-900">
                    {intl.formatMessage({
                      id: `wizard.step4.${type}`,
                      defaultMessage: type.charAt(0).toUpperCase() + type.slice(1),
                    })}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          {intl.formatMessage({
            id: "common.previous",
            defaultMessage: "Previous",
          })}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleContinue}>
          {intl.formatMessage({
            id: "common.complete",
            defaultMessage: "Complete",
          })}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationStep;
