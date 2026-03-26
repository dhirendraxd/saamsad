"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import Image from "next/image";
import { Link, Navigate, useNavigate } from "@/lib/router";
import { useAuth } from "@/lib/auth/useAuth";
import loginImg from "@/assets/login.webp";

interface IdentityFormState {
  nationalId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  municipality: string;
}

const emptyFormState: IdentityFormState = {
  nationalId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  municipality: "",
};

const ERROR_MESSAGE_ID = "identity-form-error";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isReady, signInWithIdentity } = useAuth();
  const [formState, setFormState] = useState<IdentityFormState>(emptyFormState);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof IdentityFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((current) => ({
        ...current,
        [field]: value,
      }));
    };

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500">Loading access...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const fullName = [formState.firstName, formState.middleName, formState.lastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");

      await signInWithIdentity({
        nationalId: formState.nationalId.trim(),
        name: fullName,
        ward: "N/A",
        municipality: formState.municipality.trim(),
      });
      navigate("/account", { replace: true });
    } catch {
      setAuthError("Unable to verify this identity. Check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-y-auto bg-white md:h-screen md:overflow-hidden">
      {/* Top-left breadcrumb */}
      <nav className="absolute left-6 top-5 z-10 flex items-center gap-1.5 text-xs text-gray-400">
        <Link to="/" className="transition hover:text-gray-700">Home</Link>
        <span className="select-none">/</span>
        <Link to="/education" className="transition hover:text-gray-700">Education</Link>
        <span className="select-none">/</span>
        <span className="text-gray-600">Identity access</span>
      </nav>

      {/* Left — form panel (50%) */}
      <div className="flex w-full flex-col items-center justify-center px-6 pb-10 pt-24 sm:px-8 md:w-1/2 md:px-16 md:py-0">
        <div className="w-full max-w-[380px]">
          <h1 id="identity-form-title" className="mb-3 text-center text-[1.6rem] font-semibold tracking-tight text-gray-900">
            Verify your identity
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-labelledby="identity-form-title"
            aria-describedby={authError ? ERROR_MESSAGE_ID : undefined}
          >
            <fieldset className="space-y-4" disabled={isSubmitting}>
              <legend className="sr-only">Identity details</legend>

              <div className="space-y-1.5">
                <p className="block text-sm text-gray-700">Legal name</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-600" htmlFor="firstName">First</label>
                    <input
                      id="firstName"
                      type="text"
                      value={formState.firstName}
                      onChange={handleChange("firstName")}
                      placeholder="First"
                      required
                      autoComplete="given-name"
                      autoCapitalize="words"
                      className="w-full rounded-md border border-gray-300 px-2.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-600" htmlFor="middleName">Middle</label>
                    <input
                      id="middleName"
                      type="text"
                      value={formState.middleName}
                      onChange={handleChange("middleName")}
                      placeholder="Middle"
                      autoComplete="additional-name"
                      autoCapitalize="words"
                      className="w-full rounded-md border border-gray-300 px-2.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-600" htmlFor="lastName">Last</label>
                    <input
                      id="lastName"
                      type="text"
                      value={formState.lastName}
                      onChange={handleChange("lastName")}
                      placeholder="Last"
                      required
                      autoComplete="family-name"
                      autoCapitalize="words"
                      className="w-full rounded-md border border-gray-300 px-2.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm text-gray-700" htmlFor="nationalId">National ID</label>
                <input
                  id="nationalId"
                  type="text"
                  value={formState.nationalId}
                  onChange={handleChange("nationalId")}
                  placeholder="CITIZEN-2044"
                  required
                  minLength={4}
                  maxLength={32}
                  pattern="[A-Za-z0-9-]+"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  inputMode="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm text-gray-700" htmlFor="municipality">Municipality</label>
                <input
                  id="municipality"
                  type="text"
                  value={formState.municipality}
                  onChange={handleChange("municipality")}
                  placeholder="Kathmandu Metropolitan"
                  required
                  autoComplete="address-level2"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                />
              </div>
            </fieldset>

            {authError && (
              <p id={ERROR_MESSAGE_ID} role="alert" aria-live="assertive" className="text-xs text-red-500">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="mt-1 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "Verifying identity..." : "Continue to account"}
            </button>
          </form>
        </div>
      </div>

      {/* Right — image panel (50%) */}
      <div className="relative hidden md:block md:w-1/2">
        <Image
          src={loginImg}
          alt="Samsad civic illustration"
          className="object-cover"
          fill
          sizes="50vw"
          priority
        />
      </div>
    </div>
  );
};

export default AuthPage;
