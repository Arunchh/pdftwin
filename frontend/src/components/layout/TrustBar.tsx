import { Globe2, ShieldCheck, Timer, Zap } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

const TRUST_ICONS = [ShieldCheck, Timer, Zap, Globe2] as const;
const TRUST_TONES = ["sapphire", "teal", "amber", "amethyst"] as const;

export default function TrustBar() {
  const { messages } = useI18n();

  return (
    <section className="trust-bar" aria-label="Trust and security">
      {messages.trust.map((item, index) => {
        const Icon = TRUST_ICONS[index] ?? ShieldCheck;
        const tone = TRUST_TONES[index] ?? "sapphire";
        return (
          <div key={item.title} className={`trust-item trust-item--${tone}`}>
            <span className="trust-item-icon">
              <Icon size={18} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
