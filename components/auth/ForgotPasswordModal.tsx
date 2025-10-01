"use client";

/*
Component Summary: Guides users through a modal-based password reset flow backed by Supabase auth.
Steps:
1. Tracks modal visibility and step progression across email, verify, reset, and success views.
2. Calls Supabase resetPasswordForEmail and handles demo verification feedback.
3. Validates new credentials, simulates reset, and clears form state when closing.
Component Dependencies: None
External Libs: react, react-intl, @supabase/ssr, lucide-react
*/

/*
Component Summary: Guides users through a modal-based password reset flow backed by Supabase auth.
Steps:
1. Tracks modal visibility and step progression across email, verify, reset, and success views.
2. Calls Supabase resetPasswordForEmail and handles demo verification feedback.
3. Validates new credentials, simulates reset, and clears form state when closing.
Dependent Components: app/auth/login/page.tsx
External Libs: react, react-intl, @supabase/ssr, lucide-react
*/

import { useState } from "react";
import { useIntl } from "react-intl";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const intl = useIntl();
  const [step, setStep] = useState<"email" | "verify" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // send reset email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(intl.formatMessage({ id: "auth.emailRequired", defaultMessage: "Email is required" }));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setStep("verify");
    } catch (err: any) {
      setError(err.message || intl.formatMessage({ id: "auth.resetError", defaultMessage: "Failed to send reset email" }));
    } finally {
      setLoading(false);
    }
  };

  // for demo only, accept any 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!verificationCode) {
      setError(intl.formatMessage({ id: "auth.codeRequired", defaultMessage: "Verification code is required" }));
      return;
    }

    if (verificationCode.length === 6) {
      setStep("reset");
    } else {
      setError(intl.formatMessage({ id: "auth.invalidCode", defaultMessage: "Please enter a valid 6-digit code" }));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError(intl.formatMessage({ id: "auth.passwordRequired", defaultMessage: "Both password fields are required" }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(intl.formatMessage({ id: "auth.passwordMismatch", defaultMessage: "Passwords do not match" }));
      return;
    }

    if (newPassword.length < 8) {
      setError(intl.formatMessage({ id: "auth.invalidPassword", defaultMessage: "Password must be at least 8 characters" }));
      return;
    }

    try {
      setLoading(true);
      // With Supabase v2: when user clicks the reset link from email, you handle the reset in /reset-password page
      // Here we simulate local reset for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("success");
    } catch (err: any) {
      setError(err.message || intl.formatMessage({ id: "auth.resetFailed", defaultMessage: "Failed to reset password" }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  // Steps rendering
  const renderEmailStep = () => (
    <form onSubmit={handleSendResetEmail} className="space-y-4">
      <label htmlFor="reset-email" className="label">
        {intl.formatMessage({ id: "common.email", defaultMessage: "Email" })}
      </label>
      <input
        id="reset-email"
        type="email"
        required
        className="input w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={intl.formatMessage({ id: "auth.emailPlaceholder", defaultMessage: "you@example.com" })}
      />
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading
          ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
          : intl.formatMessage({ id: "auth.sendCode", defaultMessage: "Send verification code" })}
      </button>
    </form>
  );

  const renderVerifyStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <label htmlFor="verification-code" className="label">
        {intl.formatMessage({ id: "auth.codeLabel", defaultMessage: "Verification Code" })}
      </label>
      <input
        id="verification-code"
        type="text"
        maxLength={6}
        required
        className="input w-full text-center text-lg tracking-widest"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
      />
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading
          ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
          : intl.formatMessage({ id: "auth.verifyCode", defaultMessage: "Verify code" })}
      </button>
      <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("email")}>
        {intl.formatMessage({ id: "auth.backToEmail", defaultMessage: "Back to email" })}
      </button>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <label htmlFor="new-password" className="label">
        {intl.formatMessage({ id: "auth.newPassword", defaultMessage: "New Password" })}
      </label>
      <div className="relative">
        <input
          id="new-password"
          type={showPassword ? "text" : "password"}
          required
          className="input w-full pr-10"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <label htmlFor="confirm-password" className="label">
        {intl.formatMessage({ id: "auth.confirmPassword", defaultMessage: "Confirm Password" })}
      </label>
      <input
        id="confirm-password"
        type={showPassword ? "text" : "password"}
        required
        className="input w-full"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading
          ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
          : intl.formatMessage({ id: "auth.resetPassword", defaultMessage: "Reset password" })}
      </button>
      <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("verify")}>
        {intl.formatMessage({ id: "auth.backToVerify", defaultMessage: "Back to verification" })}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="space-y-4 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {intl.formatMessage({ id: "auth.resetSuccess", defaultMessage: "Password reset successful" })}
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        {intl.formatMessage({ id: "auth.resetSuccessDesc", defaultMessage: "You can now log in with your new password." })}
      </p>
      <button type="button" className="btn btn-primary w-full" onClick={handleClose}>
        {intl.formatMessage({ id: "auth.continueLogin", defaultMessage: "Continue to login" })}
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case "email":
        return renderEmailStep();
      case "verify":
        return renderVerifyStep();
      case "reset":
        return renderResetStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />
        <div className="relative transform overflow-hidden rounded-lg bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}



