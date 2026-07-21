import { Globe2, ShieldCheck, Timer, Zap } from "lucide-react";
import type { TrustIcon } from "../../config/pricing";
import { TRUST_ITEMS } from "../../config/pricing";

const TRUST_ICONS: Record<TrustIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  timer: Timer,
  zap: Zap,
  globe: Globe2,
};

const TRUST_TONES = ["sapphire", "teal", "amber", "amethyst"] as const;

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Trust and security">
      {TRUST_ITEMS.map((item, index) => {
        const Icon = TRUST_ICONS[item.icon];
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
