import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import loginImg from "@/assets/login.png";

type AuthMode = "signin" | "signup";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithIdentity } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signInWithIdentity({
        nationalId: email,
        name: email.split("@")[0],
        ward: "N/A",
        municipality: "N/A",
      });
      navigate("/account", { replace: true });
    } catch {
      setAuthError("Unable to sign in. Please check your details and try again.");
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
        <span className="text-gray-600">{mode === "signup" ? "Sign up" : "Sign in"}</span>
      </nav>

      {/* Left — form panel (50%) */}
      <div className="flex w-full flex-col items-center justify-center px-8 md:w-1/2 md:px-16">
        <div className="w-full max-w-[340px]">
          <h1 className="mb-8 text-center text-[1.6rem] font-semibold tracking-tight text-gray-900">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>

          {/* Google button — signin only */}
          {mode === "signin" && (
            <button
              type="button"
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                autoComplete="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-700" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && <p className="text-xs text-red-500">{authError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right — image panel (50%) */}
      <div className="relative hidden md:block md:w-1/2">
        <img
          src={loginImg}
          alt="Civic illustration"
          className="h-full w-full object-cover"
        />
        {/* Caption card */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 px-5 py-4 backdrop-blur-sm">
          <p className="text-sm text-gray-700 leading-snug">
            A transparent ledger of political promises — tracking every commitment made to citizens across every ward and constituency.
          </p>
          <p className="mt-2 text-xs text-gray-400">CivicLedger · Accountability in every vote</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
