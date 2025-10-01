"use client";

/*
Component Summary: Handles user authentication via Supabase on the login route.
Steps:
1. Collects email and password input with visibility toggles and basic validation.
2. Signs users in through Supabase and redirects to the desired destination on success.
3. Surfaces recovery options by launching the ForgotPasswordModal when requested.
Component Dependencies: components/auth/ForgotPasswordModal.tsx
External Libs: react, next/navigation, next/link, react-intl, lucide-react, @supabase/ssr
*/

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "react-intl";
import { Calendar, Eye, EyeOff } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

// create Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const intl = useIntl();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // redirect back if query param ?from=/something exists
  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(intl.formatMessage({ id: "auth.requiredField", defaultMessage: "All fields are required" }));
      return;
    }

    try {
      setLoading(true);
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      router.replace(from);
    } catch (err: any) {
      setError(err.message || intl.formatMessage({ id: "auth.loginError", defaultMessage: "Login failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + Title */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
              <Calendar className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {intl.formatMessage({ id: "auth.loginTitle", defaultMessage: "Sign in to your account" })}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {intl.formatMessage({ id: "auth.noAccount", defaultMessage: "Don't have an account?" })}{" "}
              <Link href="/auth/register" className="font-medium text-teal-600 hover:text-teal-500">
                {intl.formatMessage({ id: "common.register", defaultMessage: "Register" })}
              </Link>
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-md shadow-sm">
              {/* Email */}
              <div>
                <label htmlFor="email" className="label">
                  {intl.formatMessage({ id: "common.email", defaultMessage: "Email" })}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input w-full"
                  placeholder={intl.formatMessage({ id: "auth.emailPlaceholder", defaultMessage: "you@example.com" })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="label">
                  {intl.formatMessage({ id: "common.password", defaultMessage: "Password" })}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="input w-full pr-10"
                    placeholder={intl.formatMessage({ id: "auth.passwordPlaceholder", defaultMessage: "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {intl.formatMessage({ id: "auth.rememberMe", defaultMessage: "Remember me" })}
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  {intl.formatMessage({ id: "auth.forgotPassword", defaultMessage: "Forgot password?" })}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading
                  ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
                  : intl.formatMessage({ id: "common.login", defaultMessage: "Login" })}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </>
  );
}

