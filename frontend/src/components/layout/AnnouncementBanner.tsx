import { Rocket, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { joinWaitlist } from "../../services/waitlist";

const DISMISS_KEY = "pdftwin-waitlist-banner-dismissed";
const JOINED_KEY = "pdftwin-waitlist-joined";

export default function AnnouncementBanner() {
  const { messages } = useI18n();
  const { waitlist } = messages;
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    const joined = localStorage.getItem(JOINED_KEY) === "1";
    setVisible(!dismissed && !joined);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await joinWaitlist(email, name);
      const message = result.duplicate ? waitlist.alreadyJoined : waitlist.success;
      setSuccess(message);
      localStorage.setItem(JOINED_KEY, "1");
      window.setTimeout(() => setVisible(false), 3200);
    } catch (err) {
      setError(err instanceof Error ? err.message : waitlist.error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <section className="announcement-banner" aria-label={waitlist.ariaLabel}>
      <div className="announcement-banner-shimmer" aria-hidden="true" />
      <div className="announcement-banner-glow announcement-banner-glow-left" aria-hidden="true" />
      <div className="announcement-banner-glow announcement-banner-glow-right" aria-hidden="true" />

      <div className="announcement-banner-inner">
        <div className="announcement-banner-copy">
          <span className="announcement-badge">
            <Rocket size={14} strokeWidth={2.5} aria-hidden="true" />
            {waitlist.badge}
          </span>

          <div className="announcement-banner-text">
            <p className="announcement-headline">
              <Sparkles size={18} className="announcement-sparkle" aria-hidden="true" />
              {waitlist.headline}
            </p>
            <p className="announcement-subtext">{waitlist.subtext}</p>
          </div>
        </div>

        {success ? (
          <p className="announcement-success" role="status">
            {success}
          </p>
        ) : (
          <form className="announcement-form" onSubmit={handleSubmit}>
            <label className="announcement-field announcement-field-name">
              <span className="sr-only">{waitlist.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                placeholder={waitlist.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="announcement-field announcement-field-email">
              <span className="sr-only">{waitlist.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                placeholder={waitlist.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <button type="submit" className="announcement-submit" disabled={loading}>
              {loading ? waitlist.submitting : waitlist.submit}
            </button>

            {error && (
              <p className="announcement-error" role="alert">
                {error}
              </p>
            )}
          </form>
        )}

        <button
          type="button"
          className="announcement-dismiss"
          onClick={dismiss}
          aria-label={waitlist.dismiss}
        >
          <X size={18} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
