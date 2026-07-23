import { useI18n } from "../../i18n/I18nProvider";

export default function FormatSupportSection() {
  const { messages } = useI18n();

  return (
    <section className="format-support-section" id="formats">
      <div className="section-heading">
        <h2>{messages.formats.heading}</h2>
        <p>{messages.formats.subheading}</p>
      </div>

      <div className="format-support-grid">
        {messages.formats.inputs.map((format) => (
          <div key={format.ext} className="format-support-card">
            <span className="format-support-ext">{format.ext}</span>
            <span>{format.use}</span>
          </div>
        ))}
      </div>

      <ul className="format-support-highlights">
        {messages.formats.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
