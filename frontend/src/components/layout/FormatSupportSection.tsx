import { CONVERSION_HIGHLIGHTS, SUPPORTED_INPUT_FORMATS } from "../../config/formats";

export default function FormatSupportSection() {
  return (
    <section className="format-support-section" id="formats">
      <div className="section-heading">
        <h2>Formats your business already uses</h2>
        <p>
          PDFTwin covers everyday document and image workflows — so your team stops jumping between
          single-purpose tools.
        </p>
      </div>

      <div className="format-support-grid">
        {SUPPORTED_INPUT_FORMATS.map((format) => (
          <div key={format.ext} className="format-support-card">
            <span className="format-support-ext">{format.ext}</span>
            <span>{format.use}</span>
          </div>
        ))}
      </div>

      <ul className="format-support-highlights">
        {CONVERSION_HIGHLIGHTS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
