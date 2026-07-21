import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      window.location.href = "/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form panel" onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      <p className="description">Access your account and Pro limits when enabled.</p>

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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error && <div className="message error">{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="auth-switch">
        New here? <a href="/signup">Create an account</a>
      </p>
    </form>
  );
}
