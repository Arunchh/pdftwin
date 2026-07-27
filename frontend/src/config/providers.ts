import { getRuntimeEnv } from "./runtimeEnv";

export function getAuthProvider(): string {
  return getRuntimeEnv().authProvider;
}

export function getBillingProvider(): string {
  return getRuntimeEnv().billingProvider;
}
