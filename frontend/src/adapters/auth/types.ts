export type Plan = "free" | "pro";

export interface AuthUser {
  id: string;
  email: string;
  plan: Plan;
}

export interface AuthSession {
  user: AuthUser | null;
}

export interface AuthAdapter {
  getSession(): AuthSession;
  signUp(email: string, password: string): Promise<AuthUser>;
  signIn(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  setPlan(plan: Plan): Promise<AuthUser>;
}
