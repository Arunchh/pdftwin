import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "../../content/blogPosts";
import { BLOG_CATEGORIES } from "../../content/blogPosts";
import { toolPath } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";
import { relatedLandingPath, seoLandingPath, getSeoLandingForTool } from "../../i18n/seoLandings";

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const { locale } = useI18n();

  const toolHref = post.toolId ? toolPath(post.toolId, locale) : null;
  const seoLanding = post.toolId ? getSeoLandingForTool("en", post.toolId) : undefined;

  return (
    <article className="content-page blog-post">
      <header className="content-hero">
        <p className="content-eyebrow">
          {BLOG_CATEGORIES[post.category]} ·{" "}
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        </p>
        <h1>{post.h1}</h1>
        <p className="content-intro">{post.intro}</p>
        <p className="blog-read-time">
          <Clock size={16} aria-hidden="true" />
          {post.readMinutes} min read
        </p>
        {toolHref && (
          <a className="btn btn-primary content-cta" href={toolHref}>
            Open tool
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        )}
      </header>

      {post.sections.map((section, index) => (
        <section key={index} className="content-section">
          {section.heading && <h2>{section.heading}</h2>}
          {section.paragraphs?.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul className="content-bullets">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {(post.relatedSlugs?.length || seoLanding) && (
        <section className="content-section" aria-labelledby="blog-related">
          <h2 id="blog-related">Related</h2>
          <ul className="content-link-list">
            {seoLanding && (
              <li>
                <a href={seoLandingPath(seoLanding)}>SEO guide: {seoLanding.h1}</a>
              </li>
            )}
            {post.relatedSlugs?.map((slug) => {
              const href = relatedLandingPath("en", slug);
              if (!href) return null;
              return (
                <li key={slug}>
                  <a href={href}>{slug.replace(/-/g, " ")}</a>
                </li>
              );
            })}
            <li>
              <a href="/blog">All blog posts</a>
            </li>
          </ul>
        </section>
      )}
    </article>
  );
}
