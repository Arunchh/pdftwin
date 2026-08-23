import { Columns2 } from "lucide-react";
import ToolWorkspace from "../ToolWorkspace";
import { useI18n } from "../../i18n/I18nProvider";

export default function HomeCompareHeroSection() {
  const { messages } = useI18n();

  return (
    <div className="home-compare-hero">
      <header className="home-compare-hero-header">
        <p className="hero-eyebrow">
          <Columns2 size={16} />
          {messages.footer.tagline}
        </p>
        <h1>
          {messages.hero.titleLead}
          <span>{messages.hero.titleHighlight}</span>
        </h1>
      </header>
      <ToolWorkspace toolId="pdf-compare" variant="homeCompare" />
    </div>
  );
}
