"use client";

/*
Component Summary: Registers new users through Supabase and prepares them for onboarding.
Steps:
1. Collects name, email, and password confirmation with validation checks.
2. Submits a Supabase signUp request storing the name in user metadata and setting redirect URLs.
3. Routes successful signups to the setup flow while surfacing any errors to the form.
Component Dependencies: None
External Libs: react, next/navigation, next/link, react-intl, lucide-react, @supabase/ssr
*/

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIntl } from "react-intl";
import { Calendar, Eye, EyeOff } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const intl = useIntl();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError(intl.formatMessage({ id: "auth.requiredField", defaultMessage: "All fields are required" }));
      return;
    }

    if (password !== confirmPassword) {
      setError(intl.formatMessage({ id: "auth.passwordMismatch", defaultMessage: "Passwords do not match" }));
      return;
    }

    if (password.length < 8) {
      setError(intl.formatMessage({ id: "auth.invalidPassword", defaultMessage: "Password must be at least 8 characters" }));
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Redirect to setup flow
      router.replace("/setup");
    } catch (err: any) {
      setError(err.message || intl.formatMessage({ id: "auth.signupError", defaultMessage: "Failed to register" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <Calendar className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {intl.formatMessage({ id: "auth.registerTitle", defaultMessage: "Create an account" })}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {intl.formatMessage({ id: "auth.haveAccount", defaultMessage: "Already have an account?" })}{" "}
            <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-500">
              {intl.formatMessage({ id: "common.login", defaultMessage: "Login" })}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="label">
                {intl.formatMessage({ id: "common.name", defaultMessage: "Name" })}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input w-full"
                placeholder={intl.formatMessage({ id: "auth.namePlaceholder", defaultMessage: "Your name" })}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div>
              <label htmlFor="password" className="label">
                {intl.formatMessage({ id: "common.password", defaultMessage: "Password" })}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="input w-full pr-10"
                  placeholder={intl.formatMessage({ id: "auth.passwordPlaceholder", defaultMessage: "Enter password" })}
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

            <div>
              <label htmlFor="confirmPassword" className="label">
                {intl.formatMessage({ id: "common.confirmPassword", defaultMessage: "Confirm Password" })}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="input w-full"
                placeholder={intl.formatMessage({ id: "auth.confirmPasswordPlaceholder", defaultMessage: "Confirm password" })}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading
                ? intl.formatMessage({ id: "common.loading", defaultMessage: "Loading..." })
                : intl.formatMessage({ id: "common.register", defaultMessage: "Register" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

