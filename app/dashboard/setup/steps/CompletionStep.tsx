"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

const CompletionStep = ({ url }: any) => {
  const intl = useIntl();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://meead.app/${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-teal-100 p-3">
          <CheckCircle size={48} className="text-teal-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "wizard.complete.title", defaultMessage: "Setup Completed!" })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({ id: "wizard.complete.subtitle", defaultMessage: "Your booking page is ready." })}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          {intl.formatMessage({ id: "wizard.complete.bookingLink", defaultMessage: "Your booking link" })}
        </h3>
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-l-md border border-r-0 border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={`https://meead.app/${url}`}
            readOnly
          />
          <button
            type="button"
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <CheckCircle size={16} className="mr-2 text-teal-500" />
                {intl.formatMessage({ id: "wizard.complete.linkCopied", defaultMessage: "Link Copied!" })}
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                {intl.formatMessage({ id: "wizard.complete.copyLink", defaultMessage: "Copy Link" })}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pt-6 space-y-3">
        <a
          href={`https://meead.app/${url}`}
          className="btn btn-primary inline-flex w-full items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} className="mr-2" />
          {intl.formatMessage({ id: "wizard.complete.viewBookingPage", defaultMessage: "View Booking Page" })}
        </a>

        <Link className="btn btn-outline w-full" href="/dashboard">
          {intl.formatMessage({ id: "wizard.complete.dashboard", defaultMessage: "Go to Dashboard" })}
        </Link>
      </div>
    </div>
  );
};

export default CompletionStep;

