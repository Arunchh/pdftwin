import { useState } from "react";
import { CheckCircle2, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { connectPayPalAccount } from "../../services/payments";

export default function PayPalConnectPanel() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [mode, setMode] = useState<"sandbox" | "live">("sandbox");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const handleConnect = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setConnected(false);

    try {
      const result = await connectPayPalAccount({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        mode,
      });
      setConnected(result.connected);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not connect PayPal account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="paypal-connect-section" id="admin-payments">
      <div className="section-heading">
        <h2>Connect PayPal</h2>
        <p>
          Link your PayPal business account to accept Pro subscriptions. Verify credentials here,
          then add them to your server environment.
        </p>
      </div>

      <div className="paypal-connect-grid">
        <article className="panel paypal-connect-card">
          <div className="paypal-connect-header">
            <span className="paypal-connect-icon">
              <CreditCard size={22} />
            </span>
            <div>
              <h3>Merchant credentials</h3>
              <p className="description">
                Create a REST app in the{" "}
                <a href="https://developer.paypal.com/dashboard/" target="_blank" rel="noreferrer">
                  PayPal Developer Dashboard
                  <ExternalLink size={14} />
                </a>{" "}
                and paste your Client ID and Secret below.
              </p>
            </div>
          </div>

          <form className="paypal-connect-form" onSubmit={handleConnect}>
            <label>
              Environment
              <select value={mode} onChange={(event) => setMode(event.target.value as "sandbox" | "live")}>
                <option value="sandbox">Sandbox (testing)</option>
                <option value="live">Live (production)</option>
              </select>
            </label>

            <label>
              Client ID
              <input
                type="text"
                value={clientId}
                onChange={(event) => setClientId(event.target.value)}
                placeholder="AaBbCc123..."
                required
              />
            </label>

            <label>
              Client Secret
              <input
                type="password"
                value={clientSecret}
                onChange={(event) => setClientSecret(event.target.value)}
                placeholder="EeFfGg456..."
                required
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Verifying…
                </>
              ) : (
                "Verify PayPal connection"
              )}
            </button>
          </form>

          {message && (
            <p className={`paypal-connect-message ${connected ? "success" : "error"}`}>
              {connected && <CheckCircle2 size={16} />}
              {message}
            </p>
          )}
        </article>

        <article className="panel paypal-connect-steps">
          <h3>Enable live checkout</h3>
          <ol>
            <li>Verify credentials using the form on the left.</li>
            <li>
              Add these environment variables to Vercel or your server:
              <code>PAYPAL_CLIENT_ID</code>, <code>PAYPAL_CLIENT_SECRET</code>,{" "}
              <code>PAYPAL_MODE</code>.
            </li>
            <li>
              Optional: set <code>PAYPAL_PLAN_ID</code> if you already created a billing plan.
            </li>
            <li>Redeploy — the Pro plan button will activate PayPal checkout automatically.</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
