"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "@/lib/router";
import { resolveAssetSrc } from "@/lib/asset";
import { useAuth } from "@/lib/auth/useAuth";
import loginImg from "@/assets/login.png";

interface IdentityFormState {
  nationalId: string;
  name: string;
  ward: string;
  municipality: string;
}

const emptyFormState: IdentityFormState = {
  nationalId: "",
  name: "",
  ward: "",
  municipality: "",
};

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
      await signInWithIdentity({
        nationalId: formState.nationalId.trim(),
        name: formState.name.trim(),
        ward: formState.ward.trim(),
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
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Top-left breadcrumb */}
      <nav className="absolute left-6 top-5 z-10 flex items-center gap-1.5 text-xs text-gray-400">
        <Link to="/" className="transition hover:text-gray-700">Home</Link>
        <span className="select-none">/</span>
        <Link to="/education" className="transition hover:text-gray-700">Education</Link>
        <span className="select-none">/</span>
        <span className="text-gray-600">Identity access</span>
      </nav>

      {/* Left — form panel (50%) */}
      <div className="flex w-full flex-col items-center justify-center px-8 md:w-1/2 md:px-16">
        <div className="w-full max-w-[380px]">
          <h1 className="mb-3 text-center text-[1.6rem] font-semibold tracking-tight text-gray-900">
            Verify your identity
          </h1>
          <p className="mb-8 text-center text-sm leading-relaxed text-gray-500">
            This prototype uses civic identity fields only. Do not enter a personal password on this screen.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="nationalId">National ID</label>
              <input
                id="nationalId"
                type="text"
                value={formState.nationalId}
                onChange={handleChange("nationalId")}
                placeholder="CITIZEN-2044"
                required
                autoComplete="off"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={formState.name}
                onChange={handleChange("name")}
                placeholder="Asha Patel"
                required
                autoComplete="name"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="ward">Ward</label>
              <input
                id="ward"
                type="text"
                value={formState.ward}
                onChange={handleChange("ward")}
                placeholder="Ward 3"
                required
                autoComplete="address-level3"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="municipality">Municipality</label>
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

            {authError && <p className="text-xs text-red-500">{authError}</p>}

            <p className="text-xs leading-relaxed text-gray-500">
              Matching politician records are verified automatically in this demo. Everyone else continues as a citizen account.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "Verifying identity..." : "Continue to account"}
            </button>
          </form>
        </div>
      </div>

      {/* Right — image panel (50%) */}
      <div className="relative hidden md:block md:w-1/2">
        <img
          src={resolveAssetSrc(loginImg)}
          alt="Civic illustration"
          className="h-full w-full object-cover"
        />
        {/* Caption card */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 px-5 py-4 backdrop-blur-sm">
          <p className="text-sm text-gray-700 leading-snug">
            Identity in CivicLedger is still prototype-only. The app tracks public accountability, but secure production sign-in should move to server-issued, HttpOnly sessions.
          </p>
          <p className="mt-2 text-xs text-gray-400">CivicLedger · Accountability in every vote</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
