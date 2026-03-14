import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { IdentityRegistrationInput } from "@/lib/api/contracts";
import { useAuth } from "@/lib/auth/useAuth";

type AuthMode = "signin" | "signup";

const initialIdentityForm: IdentityRegistrationInput = {
  nationalId: "",
  name: "",
  ward: "",
  municipality: "",
};

const modeContent: Record<AuthMode, { title: string; description: string; actionLabel: string }> = {
  signin: {
    title: "Welcome back",
    description:
      "Sign in with your civic identity details to continue tracking projects and community updates.",
    actionLabel: "Continue",
  },
  signup: {
    title: "Create your CivicLedger profile",
    description:
      "Join as a citizen or politician profile and start contributing to transparent public accountability.",
    actionLabel: "Create account",
  },
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithIdentity } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [identityForm, setIdentityForm] = useState<IdentityRegistrationInput>(initialIdentityForm);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const content = modeContent[mode];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      await signInWithIdentity(identityForm);
      navigate("/account", { replace: true });
    } catch {
      setAuthError("Unable to verify identity right now. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-10 md:py-14">
        <section className="surface-band mx-auto max-w-xl p-8 md:p-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-civic-slate">Civic Identity</p>
          <h1 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">{content.title}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{content.description}</p>

          <div className="mb-6 flex items-center gap-6 border-b border-border">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`tab-link ${
                mode === "signin"
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`tab-link ${
                mode === "signup"
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              Sign up
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">National ID</label>
              <input
                className="field-line"
                value={identityForm.nationalId}
                onChange={(event) =>
                  setIdentityForm((prev) => ({ ...prev, nationalId: event.target.value }))
                }
                placeholder="e.g. CZN-00012345"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
              <input
                className="field-line"
                value={identityForm.name}
                onChange={(event) =>
                  setIdentityForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="As shown on official record"
                autoComplete="name"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Ward</label>
                <input
                  className="field-line"
                  value={identityForm.ward}
                  onChange={(event) =>
                    setIdentityForm((prev) => ({ ...prev, ward: event.target.value }))
                  }
                  placeholder="e.g. Ward 5"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Municipality</label>
                <input
                  className="field-line"
                  value={identityForm.municipality}
                  onChange={(event) =>
                    setIdentityForm((prev) => ({ ...prev, municipality: event.target.value }))
                  }
                  placeholder="e.g. Riverside Municipality"
                  required
                />
              </div>
            </div>

            {authError && <p className="text-sm text-destructive">{authError}</p>}

            <Button variant="civic" className="rounded-none" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : content.actionLabel}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
