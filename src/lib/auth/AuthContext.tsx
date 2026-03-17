import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthSession, IdentityRegistrationInput } from "@/lib/api/contracts";
import { queryKeys } from "@/lib/api/queryKeys";
import { AuthContext, type AuthContextValue } from "@/lib/auth/auth-context";
import {
  SESSION_STORAGE_KEY,
  getSession,
  registerIdentity,
  signOut as clearSession,
} from "@/lib/auth/authService";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setSession(getSession());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    queryClient.setQueryData(queryKeys.session(), session);
  }, [queryClient, session]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY) {
        setSession(getSession());
        setIsReady(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const signInWithIdentity = React.useCallback(
    async (input: IdentityRegistrationInput) => {
      const nextSession = await registerIdentity(input);
      setSession(nextSession);
      setIsReady(true);
      return nextSession;
    },
    [],
  );

  const signOut = React.useCallback(async () => {
    await clearSession();
    setSession(null);
    setIsReady(true);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      session,
      isReady,
      isAuthenticated: !!session,
      role: session?.role ?? null,
      signInWithIdentity,
      signOut,
    }),
    [isReady, session, signInWithIdentity, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
