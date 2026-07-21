import { Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { formatFileLimit } from "../../config/limits";
import { openCheckout } from "../../utils/checkoutEvents";

export default function AccountPanel() {
  const { user, isAuthenticated, entitlements, signOut, setPlan } = useAuth();

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
      <p className="description">Preview account — ready to connect to Supabase when you are.</p>

      <div className="account-grid">
        <section className="account-card">
          <h2>Profile</h2>
          <p>
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
          <p>
            File limit: <strong>{formatFileLimit(entitlements.fileLimitMb)}</strong> per upload
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
          <p>
            Uploaded files are saved in your browser (IndexedDB) so you can switch tools without
            re-uploading.
          </p>
          <a className="btn btn-secondary btn-sm" href="/tools/convert">
            Open workspace
          </a>
        </section>
      </div>
    </div>
  );
}
