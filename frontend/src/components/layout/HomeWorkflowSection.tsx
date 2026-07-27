import { ArrowRight } from "lucide-react";
import { toolById, toolPath } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

export default function HomeWorkflowSection() {
  const { locale, messages } = useI18n();
  const { workflow } = messages.home;

  return (
    <section className="home-workflow-section" aria-labelledby="home-workflow-heading">
      <div className="section-heading">
        <h2 id="home-workflow-heading">{workflow.heading}</h2>
        <p>{workflow.subheading}</p>
      </div>

      <ol className="home-workflow-steps">
        {workflow.steps.map((step, index) => {
          const tool = toolById(step.toolId);
          const toolCopy = messages.tools[step.toolId];
          const Icon = tool.icon;

          return (
            <li key={step.toolId} className="home-workflow-step">
              <span className="home-workflow-step-num">{index + 1}</span>
              <div className="home-workflow-step-body">
                <span className={`home-workflow-step-icon home-workflow-step-icon--${tool.category}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <a className="home-workflow-step-link" href={toolPath(step.toolId, locale)}>
                    {toolCopy.shortLabel}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
