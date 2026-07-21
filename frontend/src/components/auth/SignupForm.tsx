import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { readNextPath } from "../../utils/authRedirect";
import { AUTH_PROVIDER } from "../../config/providers";

export default function SignupForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      window.location.href = readNextPath();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form panel" onSubmit={handleSubmit}>
      <h1>Create account</h1>
      <p className="description">
        {AUTH_PROVIDER === "supabase"
          ? "Create your PDFTwin account to upgrade to Pro and upload files larger than 24 MB."
          : "Start free today. Your account is stored locally in this preview."}
      </p>

      <label className="auth-field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error && <div className="message error">{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="auth-switch">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </form>
  );
}
