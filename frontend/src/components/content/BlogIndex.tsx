import { ArrowRight } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogCategory } from "../../content/blogPosts";

const CATEGORY_ORDER: BlogCategory[] = ["how-to", "product", "privacy"];

export default function BlogIndex() {
  return (
    <div className="content-page blog-index">
      <header className="content-hero">
        <p className="content-eyebrow">PDFTwin Blog</p>
        <h1>Guides for business PDF workflows</h1>
        <p className="content-intro">
          Practical how-tos on compare, merge, conversion, and privacy — shorter posts for quick wins
          and long-form guides for email limits, signatures, and architecture.
        </p>
      </header>

      {CATEGORY_ORDER.map((category) => {
        const posts = BLOG_POSTS.filter((p) => p.category === category);
        if (posts.length === 0) return null;
        return (
          <section key={category} className="content-section" aria-labelledby={`blog-${category}`}>
            <h2 id={`blog-${category}`}>{BLOG_CATEGORIES[category]}</h2>
            <ul className="blog-card-list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <a href={`/blog/${post.slug}`} className="blog-card">
                    <span className="blog-card-meta">
                      {post.publishedAt} · {post.readMinutes} min read
                    </span>
                    <strong>{post.h1}</strong>
                    <p>{post.intro.slice(0, 160)}…</p>
                    <span className="blog-card-link">
                      Read guide
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer className="content-footer">
        <p>
          Looking for tool-specific SEO pages? Browse our{" "}
          <a href="/guides/merge-pdf-free">PDF guides</a> or open a tool from the{" "}
          <a href="/#tools">workspace</a>.
        </p>
      </footer>
    </div>
  );
}
