import { mockPoliticians } from "@/data/mockData";
import {
  authSessionSchema,
  identityRegistrationInputSchema,
  type AuthSession,
  type IdentityRegistrationInput,
  type UserRole,
} from "@/lib/api/contracts";

export const SESSION_STORAGE_KEY = "civicledger.auth.session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function inferRole(input: IdentityRegistrationInput): {
  role: UserRole;
  verified: boolean;
  politicianId?: string;
} {
  const matchedPolitician = mockPoliticians.find(
    (politician) =>
      normalize(politician.name) === normalize(input.name) &&
      normalize(politician.ward) === normalize(input.ward) &&
      normalize(politician.municipality) === normalize(input.municipality),
  );

  if (matchedPolitician) {
    return {
      role: "politician",
      verified: true,
      politicianId: matchedPolitician.id,
    };
  }

  return {
    role: "citizen",
    verified: false,
  };
}

function createSecureId(prefix?: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    const value = crypto.randomUUID();
    return prefix ? `${prefix}-${value}` : value;
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return prefix ? `${prefix}-${value}` : value;
  }

  const fallback = `${Date.now().toString(36)}-${typeof performance !== "undefined" ? Math.floor(performance.now()).toString(36) : "0"}`;
  return prefix ? `${prefix}-${fallback}` : fallback;
}

function hasSessionExpired(session: AuthSession) {
  const expiresAt = Date.parse(session.expiresAt);
  if (!Number.isFinite(expiresAt)) {
    return true;
  }

  return Date.now() >= expiresAt;
}

function persistSession(session: AuthSession) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = authSessionSchema.parse(JSON.parse(raw));

    if (hasSessionExpired(session)) {
      storage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function registerIdentity(input: IdentityRegistrationInput): Promise<AuthSession> {
  const normalizedInput = identityRegistrationInputSchema.parse(input);
  const roleResult = inferRole(normalizedInput);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DURATION_MS);

  const session = authSessionSchema.parse({
    userId: roleResult.politicianId ?? createSecureId("citizen"),
    role: roleResult.role,
    name: normalizedInput.name,
    ward: normalizedInput.ward,
    municipality: normalizedInput.municipality,
    verified: roleResult.verified,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });

  persistSession(session);
  return session;
}

export async function signOut(): Promise<void> {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(SESSION_STORAGE_KEY);
}
