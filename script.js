const routes = {
  "/": "home-template",
  "/blog": "blog-template",
  "/contact": "contact-template",
};

const app = document.querySelector("#app");
const navLinks = [...document.querySelectorAll(".site-nav a")];
let posts = [];

if (window.Prism && Prism.plugins && Prism.plugins.autoloader) {
  Prism.plugins.autoloader.languages_path = "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/";
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash.split("?")[0];
}

function setActiveNav(path) {
  navLinks.forEach((link) => {
    const route = link.dataset.route;
    link.classList.toggle("active", route === path || (path.startsWith("/blog/") && route === "/blog"));
  });
}

async function render() {
  const path = currentPath();
  const templateId = routes[path] || (path.startsWith("/blog/") ? "blog-template" : "home-template");
  const template = document.querySelector(`#${templateId}`);
  app.replaceChildren(template.content.cloneNode(true));
  app.focus({ preventScroll: true });
  setActiveNav(path);

  if (templateId === "blog-template") {
    await initBlog(path.replace("/blog/", ""));
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      alert("Cảm ơn bạn. Form mẫu đã nhận ghi chú.");
    });
  }
}

async function initBlog(slugFromRoute) {
  const list = document.querySelector("#post-list");
  const reader = document.querySelector("#post-reader");

  try {
    posts = await fetch("posts/posts.json").then((response) => response.json());
  } catch (error) {
    reader.innerHTML = `<p>Chua tai duoc danh sach bai viet.</p>`;
    return;
  }

  posts.forEach((post, index) => {
    const button = document.createElement("button");
    button.className = "post-card";
    button.type = "button";
    button.dataset.slug = post.slug;
    button.innerHTML = `
      <h2>${escapeHtml(post.title)}</h2>
      <span class="post-date">${escapeHtml(post.date)}</span>
      <span class="post-card-details">
        <span class="tag">${escapeHtml(post.category)}</span>
        <span class="post-excerpt">${escapeHtml(post.excerpt)}</span>
        <span class="post-meta">${escapeHtml(post.readingTime)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      window.location.hash = `#/blog/${post.slug}`;
    });
    button.style.setProperty("--index", index);
    list.append(button);
  });

  const selectedPost = posts.find((post) => post.slug === slugFromRoute) || posts[0];
  await loadPost(selectedPost);
}

async function loadPost(post) {
  const reader = document.querySelector("#post-reader");
  const toc = document.querySelector("#post-toc");
  document.querySelectorAll(".post-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.slug === post.slug);
  });

  try {
    const response = await fetch(post.file);
    if (!response.ok) {
      throw new Error(`Cannot load ${post.file}`);
    }

    const markdown = await response.text();
    const { metadata, body } = parseMarkdownFile(markdown);
    const rendered = markdownToHtml(body);
    reader.innerHTML = `
      <p class="post-meta">${escapeHtml(metadata.date || post.date)} · ${escapeHtml(metadata.author || "Kaleidoscope")}</p>
      <div class="post-content">
        ${rendered.html}
      </div>
    `;
    toc.innerHTML = renderToc(rendered.headings);
    attachTocHandlers(reader, toc);
    // Render LaTeX math if KaTeX auto-render is available.
    try {
      if (typeof renderMathInElement === "function") {
        renderMathInElement(reader, {
          // support both $$...$$ (display) and $...$ (inline)
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        });
      }
    } catch (e) {
      // fail silently if KaTeX not available or rendering errors occur
      console.warn("KaTeX render error:", e);
    }
    try {
      if (window.Prism && typeof Prism.highlightAllUnder === "function") {
        Prism.highlightAllUnder(reader);
      }
    } catch (e) {
      console.warn("Prism highlight error:", e);
    }
    // Keep the content at natural size so the reader can scroll horizontally if needed.
    try {
      fitContentToViewport();
    } catch (e) {
      console.warn('fitContentToViewport error', e);
    }
  } catch (error) {
    reader.innerHTML = `
      <p class="post-meta">${escapeHtml(post.date)} · ${escapeHtml(post.author || "Kaleidoscope")}</p>
      <h1>Không tải được bài viết</h1>
      <p>Kiểm tra lại đường dẫn file Markdown trong <code>posts/posts.json</code>: <code>${escapeHtml(post.file)}</code>.</p>
    `;
    if (toc) {
      toc.innerHTML = "";
    }
  }
}

// Disable any previous fit transform and let the reader panel handle overflow
// with its own scrollbars.
function fitContentToViewport() {
  const reader = document.querySelector('#post-reader');
  if (!reader) return;
  const content = reader.querySelector('.post-content');
  if (!content) return;

  content.style.transform = '';
  content.style.transformOrigin = 'top left';
  reader.classList.remove('fit-enabled');
}

// Debounced resize handler to re-fit content on window resize
let __fitResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(__fitResizeTimer);
  __fitResizeTimer = setTimeout(() => {
    fitContentToViewport();
  }, 150);
});

function parseMarkdownFile(markdown) {
  if (!markdown.startsWith("---")) {
    return { metadata: {}, body: markdown };
  }

  const end = markdown.indexOf("---", 3);
  if (end === -1) {
    return { metadata: {}, body: markdown };
  }

  const metadata = {};
  markdown
    .slice(3, end)
    .trim()
    .split("\n")
    .forEach((line) => {
      const [key, ...value] = line.split(":");
      if (key && value.length) {
        metadata[key.trim()] = value.join(":").trim();
      }
    });

  return { metadata, body: markdown.slice(end + 3).trim() };
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const headings = [];
  let listType = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    // Table detection: pipe-separated header followed by separator line
    const nextLine = lines[i + 1] || "";
    const separatorRe = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
    // Fenced code block detection (```lang)
    if (line.startsWith("```") ) {
      // capture language (optional)
      const lang = line.slice(3).trim();
      const codeLines = [];
      // gather until closing fence or EOF
      while (i + 1 < lines.length && !lines[i + 1].trim().startsWith("```") ) {
        i += 1;
        // preserve original spacing inside code block
        codeLines.push(lines[i]);
      }
      // advance past closing fence if present
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith("```")) {
        i += 1;
      }
      const codeHtml = escapeHtml(codeLines.join("\n"));
      const langClass = lang ? `language-${escapeHtml(lang)}` : "";
      html.push(`<pre><code class="${langClass}">${codeHtml}</code></pre>`);
      continue;
    }
    if (line.includes("|") && separatorRe.test(nextLine)) {
      closeList();
      // parse header — keep empty cells so column counts stay consistent
      const headerCells = line.split(/\|/).map((c) => c.trim());
      // advance past separator
      i += 1;
      const rows = [];
      // collect following pipe rows
      while (i + 1 < lines.length && lines[i + 1].trim() && lines[i + 1].includes("|")) {
        i += 1;
        const row = lines[i].split(/\|/).map((c) => c.trim());
        if (row.length) rows.push(row);
      }

      // build table HTML
      html.push("<table class=\"md-table\">\n");
      html.push("<thead><tr>");
      headerCells.forEach((cell) => html.push(`<th>${inlineMarkdown(cell)}</th>`));
      html.push("</tr></thead>\n");
      if (rows.length) {
        html.push("<tbody>");
        rows.forEach((r) => {
          html.push("<tr>");
          r.forEach((cell) => {
            // detect numeric cells to align right
            const isNumeric = /^[-+]?\d[\d,\.]*$/.test(cell.replace(/\s+/g, ""));
            const cls = isNumeric ? ' class="numeric"' : "";
            html.push(`<td${cls}>${inlineMarkdown(cell)}</td>`);
          });
          html.push("</tr>");
        });
        html.push("</tbody>\n");
      }
      html.push("</table>");
      continue;
    }

    if (line.startsWith("#### ")) {
      closeList();
      const text = line.slice(5);
      const id = createHeadingId(text, headings);
      headings.push({ id, text, level: 4 });
      html.push(`<h4 id="${id}">${inlineMarkdown(text)}</h4>`);
    } else if (line.startsWith("### ")) {
      closeList();
      const text = line.slice(4);
      const id = createHeadingId(text, headings);
      headings.push({ id, text, level: 3 });
      html.push(`<h3 id="${id}">${inlineMarkdown(text)}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      const text = line.slice(3);
      const id = createHeadingId(text, headings);
      headings.push({ id, text, level: 2 });
      html.push(`<h2 id="${id}">${inlineMarkdown(text)}</h2>`);
    } else if (line.startsWith("# ")) {
      closeList();
      const text = line.slice(2);
      const id = createHeadingId(text, headings);
      headings.push({ id, text, level: 1 });
      html.push(`<h1 id="${id}">${inlineMarkdown(text)}</h1>`);
    } else if (line.startsWith("> ")) {
      closeList();
      html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
    } else if (/^- /.test(line)) {
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
    } else if (/^\d+\. /.test(line)) {
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^\d+\. /, ""))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }

  closeList();
  return { html: html.join(""), headings };
}

function renderToc(headings) {
  const sectionHeadings = headings.filter((heading) => heading.level > 1);
  if (!sectionHeadings.length) {
    return `
      <p class="eyebrow">Mục lục</p>
      <p class="toc-empty">Bài viết này chưa có đề mục phụ.</p>
    `;
  }

  return `
    <p class="eyebrow">Mục lục</p>
    <nav class="toc-list">
      ${sectionHeadings
        .map(
          (heading) => `
            <a class="toc-link level-${heading.level}" href="#${heading.id}" data-target="${heading.id}">
              ${escapeHtml(heading.text)}
            </a>
          `,
        )
        .join("")}
    </nav>
  `;
}

function attachTocHandlers(reader, toc) {
  let suppressObserver = false;

  toc.querySelectorAll(".toc-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = reader.querySelector(`#${CSS.escape(link.dataset.target)}`);
      if (target) {
        suppressObserver = true;
        setActiveTocLink(toc, link.dataset.target);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          suppressObserver = false;
        }, 900);
      }
    });
  });

  const links = [...toc.querySelectorAll(".toc-link")];
  const headings = links
    .map((link) => reader.querySelector(`#${CSS.escape(link.dataset.target)}`))
    .filter(Boolean);

  if (!headings.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (suppressObserver) {
        return;
      }

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) {
        return;
      }

      setActiveTocLink(toc, visible.target.id);
    },
    { root: reader, rootMargin: "0px 0px -65% 0px", threshold: 0.1 },
  );

  headings.forEach((heading) => observer.observe(heading));
  links[0]?.classList.add("active");
}

function setActiveTocLink(toc, id) {
  toc.querySelectorAll(".toc-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.target === id);
  });
}

function createHeadingId(text, existingHeadings) {
  const base =
    stripVietnameseMarks(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "section";
  const duplicateCount = existingHeadings.filter((heading) => heading.id === base || heading.id.startsWith(`${base}-`)).length;
  return duplicateCount ? `${base}-${duplicateCount + 1}` : base;
}

function stripVietnameseMarks(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function inlineMarkdown(text, allowSmall = true) {
  // Allow common HTML space entities to be used in Markdown source
  // by converting them to their Unicode characters before escaping.
  let preprocessed = String(text)
    .replace(/&emsp;/g, "\u2003") // em space
    .replace(/&ensp;/g, "\u2002") // en space
    .replace(/&nbsp;/g, "\u00A0"); // non-breaking space

  const placeholderMap = {};
  const storePlaceholder = (html) => {
    const key = `@@PH_${Object.keys(placeholderMap).length}@@`;
    placeholderMap[key] = html;
    return key;
  };

  const sanitizeUrl = (value) => {
    const url = String(value).trim();
    if (/^(https?:|mailto:|tel:|#|\/|\.\.\/|\.\/|data:image\/)/i.test(url)) {
      return escapeHtml(url);
    }
    return "#";
  };

  // Images: ![alt](src)
  preprocessed = preprocessed.replace(/!\[([^\]]*?)\]\((.*?)\)/g, (match, altText, url) => {
    const altHtml = inlineMarkdown(altText, false);
    return storePlaceholder(`<img class="md-image" src="${sanitizeUrl(url)}" alt="${altHtml.replace(/<[^>]*>/g, "")}" loading="lazy" />`);
  });

  // Links: [text](url)
  preprocessed = preprocessed.replace(/\[([^\]]+?)\]\((.*?)\)/g, (match, linkText, url) => {
    const innerHtml = inlineMarkdown(linkText, false);
    return storePlaceholder(`<a class="md-link" href="${sanitizeUrl(url)}" target="_blank" rel="noreferrer noopener">${innerHtml}</a>`);
  });

  // Support a safe inline <small>...</small> syntax. We extract small
  // blocks and replace them with placeholders so inner formatting still
  // runs, then restore them after escaping/formatting.
  const smallMap = {};
  if (allowSmall) {
    preprocessed = preprocessed.replace(/<small>([\s\S]*?)<\/small>/gi, (m, inner) => {
      const key = `@@SMALL_${Object.keys(smallMap).length}@@`;
      // Process inner content without allowing nested <small> to avoid recursion
      smallMap[key] = `<small class="md-small">${inlineMarkdown(inner, false)}</small>`;
      return key;
    });
  }

  let result = escapeHtml(preprocessed)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");

  // Restore small placeholders (they contain safe HTML already)
  Object.keys(smallMap).forEach((k) => {
    result = result.replaceAll(k, smallMap[k]);
  });

  Object.keys(placeholderMap).forEach((k) => {
    result = result.replaceAll(k, placeholderMap[k]);
  });

  return result;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("hashchange", render);
render();
