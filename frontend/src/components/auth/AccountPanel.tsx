import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../../config/limits";
import { AUTH_PROVIDER } from "../../config/providers";
import { openCheckout } from "../../utils/checkoutEvents";
import {
  readWorkspaceUsage,
  type WorkspaceUsage,
} from "../../stores/workspaceUsageStore";

function formatLastActive(iso: string | null): string {
  if (!iso) return "Not yet";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "Not yet";
  }
}

export default function AccountPanel() {
  const { user, isAuthenticated, entitlements, signOut, setPlan } = useAuth();
  const [usage, setUsage] = useState<WorkspaceUsage>(() => readWorkspaceUsage());

  useEffect(() => {
    setUsage(readWorkspaceUsage());
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="auth-form panel">
        <h1>Your account</h1>
        <p className="description">Sign in to manage your plan and workspace preferences.</p>
        <div className="auth-actions-row">
          <a className="btn btn-primary" href="/login">
            Sign in
          </a>
          <a className="btn btn-secondary" href="/signup">
            Create account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="account-panel panel">
      <h1>Your account</h1>
      <p className="description">
        {AUTH_PROVIDER === "supabase"
          ? "Manage your PDFTwin account, plan, and upload limits."
          : "Preview account — ready to connect to Supabase when you are."}
      </p>

      <div className="account-grid">
        <section className="account-card">
          <h2>Profile</h2>
          <p className="account-field">
            <strong>Email</strong>
            <span>{user.email}</span>
          </p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => signOut()}>
            Sign out
          </button>
        </section>

        <section className="account-card account-card--plan">
          <h2>
            <Sparkles size={18} />
            Plan
          </h2>
          <p className="account-plan-badge">{entitlements.label} plan</p>
          <p className="account-field">
            File limit: <strong>{formatFileLimit(entitlements.fileLimitMb)}</strong> per upload
            {!entitlements.isPro && (
              <span className="muted"> · Free uploads up to {formatFileLimit(FREE_FILE_LIMIT_MB)} without signing in</span>
            )}
          </p>
          {entitlements.isPro ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setPlan("free")}
            >
              Switch to Free (preview)
            </button>
          ) : (
            <div className="account-actions">
              <button type="button" className="btn btn-primary btn-sm" onClick={openCheckout}>
                Upgrade to Pro
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPlan("pro")}
              >
                Enable Pro preview
              </button>
            </div>
          )}
        </section>

        <section className="account-card">
          <h2>Workspace</h2>
          <p className="account-field">
            <strong>Files in tray</strong>
            <span>{usage.filesInTray}</span>
          </p>
          <p className="account-field">
            <strong>Last tool used</strong>
            <span>{usage.lastToolLabel ?? "None yet"}</span>
          </p>
          <p className="account-field">
            <strong>Last active</strong>
            <span>{formatLastActive(usage.lastActiveAt)}</span>
          </p>
          <a className="btn btn-secondary btn-sm" href="/tools/convert">
            Open workspace
          </a>
        </section>
      </div>
    </div>
  );
}
