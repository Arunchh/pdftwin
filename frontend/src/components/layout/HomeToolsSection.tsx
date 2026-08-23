import { ArrowRight } from "lucide-react";
import { toolById, toolPath, type ToolId } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

type HomeToolGroupId = "export" | "create" | "pages" | "finish";

const HOME_TOOL_GROUPS: Array<{ id: HomeToolGroupId; toolIds: ToolId[] }> = [
  {
    id: "export",
    toolIds: ["convert-extract", "pdf-to-jpg", "pdf-to-text", "ocr-pdf"],
  },
  {
    id: "create",
    toolIds: ["word-to-pdf", "images-to-pdf", "image-convert", "image-resize"],
  },
  {
    id: "pages",
    toolIds: ["split", "extract-pages", "remove-pages", "rotate-pdf", "arrange-merge"],
  },
  {
    id: "finish",
    toolIds: ["compress-pdf", "watermark-pdf", "sign-pdf", "lock-unlock"],
  },
];

export default function HomeToolsSection() {
  const { locale, messages, localizePath } = useI18n();
  const { complementary } = messages.home;

  return (
    <section className="home-tools-section" id="tools">
      <div className="section-heading">
        <h2>{complementary.heading}</h2>
        <p>{complementary.subheading}</p>
      </div>

      <div className="home-tool-jobs">
        {HOME_TOOL_GROUPS.map((group, index) => {
          const copy = complementary.groups[group.id];

          return (
            <section
              key={group.id}
              className={`home-tool-job home-tool-job--${group.id}`}
              aria-labelledby={`home-tool-job-${group.id}`}
            >
              <header className="home-tool-job-header">
                <span className="home-tool-job-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 id={`home-tool-job-${group.id}`}>{copy.title}</h3>
                  <p>{copy.description}</p>
                </div>
              </header>

              <nav className="home-tool-job-grid" aria-label={copy.title}>
                {group.toolIds.map((toolId) => {
                  const tool = toolById(toolId);
                  const Icon = tool.icon;
                  const toolCopy = messages.tools[toolId];

                  return (
                    <a
                      key={toolId}
                      href={toolPath(toolId, locale)}
                      className={`home-tool-job-card home-tool-job-card--${tool.category}`}
                    >
                      <span className={`home-tool-job-icon home-tool-job-icon--${tool.category}`}>
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="home-tool-job-copy">
                        <strong>{toolCopy.name}</strong>
                        <span>{toolCopy.description}</span>
                      </span>
                      <ArrowRight className="home-tool-job-arrow" size={16} aria-hidden="true" />
                    </a>
                  );
                })}
              </nav>
            </section>
          );
        })}
      </div>

      <div className="home-browse-all">
        <a href={localizePath("/tools")} className="btn btn-secondary">
          {messages.nav.browseToolIndex}
        </a>
      </div>
    </section>
  );
}
