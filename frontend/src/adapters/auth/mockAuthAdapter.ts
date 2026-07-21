import type { AuthAdapter, AuthSession, AuthUser, Plan } from "./types";
import { readSession, writeSession } from "../../stores/authStore";

const USERS_KEY = "pdftwin_mock_users";

interface StoredUser {
  id: string;
  email: string;
  password: string;
  plan: Plan;
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, email: user.email, plan: user.plan };
}

export const mockAuthAdapter: AuthAdapter = {
  getSession(): AuthSession {
    return readSession();
  },

  async signUp(email, password) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
      throw new Error("Use a valid email and a password with at least 6 characters.");
    }

    const users = readUsers();
    if (users.some((user) => user.email === normalized)) {
      throw new Error("An account with this email already exists.");
    }

    const created: StoredUser = {
      id: crypto.randomUUID(),
      email: normalized,
      password,
      plan: "free",
    };
    writeUsers([...users, created]);
    const authUser = toAuthUser(created);
    writeSession(authUser);
    return authUser;
  },

  async signIn(email, password) {
    const normalized = email.trim().toLowerCase();
    const match = readUsers().find(
      (user) => user.email === normalized && user.password === password
    );
    if (!match) {
      throw new Error("Incorrect email or password.");
    }
    const authUser = toAuthUser(match);
    writeSession(authUser);
    return authUser;
  },

  async signOut() {
    writeSession(null);
  },

  async setPlan(plan) {
    const session = readSession();
    if (!session.user) {
      throw new Error("Sign in to change your plan.");
    }

    const users = readUsers().map((user) =>
      user.id === session.user!.id ? { ...user, plan } : user
    );
    writeUsers(users);

    const updated = { ...session.user, plan };
    writeSession(updated);
    return updated;
  },
};
