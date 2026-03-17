import * as React from "react";
import type { AuthSession, IdentityRegistrationInput, UserRole } from "@/lib/api/contracts";

export interface AuthContextValue {
  session: AuthSession | null;
  isReady: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  signInWithIdentity: (input: IdentityRegistrationInput) => Promise<AuthSession>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);