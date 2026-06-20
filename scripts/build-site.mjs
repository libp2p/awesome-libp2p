import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "site");
const output = resolve(root, "dist");
const readmePath = resolve(root, "README.md");
const indexPath = resolve(output, "index.html");

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const readme = await readFile(readmePath, "utf8");
const index = await readFile(indexPath, "utf8");
const { description, title, sections } = parseReadme(readme);
const projectsHtml = renderProjects(sections);

await writeFile(
  indexPath,
  index
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<h1>.*?<\/h1>/, `<h1>${escapeHtml(title)}</h1>`)
    .replace(
      /<p class="lede">[\s\S]*?<\/p>/,
      `<p class="lede">\n          ${escapeHtml(description)}\n        </p>`,
    )
    .replace(
      /<!-- README_PROJECTS_START -->[\s\S]*<!-- README_PROJECTS_END -->/,
      `<!-- README_PROJECTS_START -->\n${projectsHtml}\n      <!-- README_PROJECTS_END -->`,
    ),
);

console.log(`Built site: ${source} -> ${output}`);

function parseReadme(markdown) {
  const lines = markdown.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# ")) ?? "# Awesome libp2p";
  const title = stripMarkdown(titleLine.replace(/^#\s+/, "")).trim();
  const description = lines.find((line) => line.trim() && !line.startsWith("#"))?.trim() ?? "";
  const sections = [];
  let currentSection = null;
  let currentItem = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);

    if (heading) {
      currentSection = { items: [], title: heading[1].trim() };
      sections.push(currentSection);
      currentItem = null;
      continue;
    }

    const item = line.match(/^(\s*)-\s+(.+)$/);

    if (!item || !currentSection) {
      continue;
    }

    const indent = item[1].length;
    const text = item[2].trim();

    if (indent === 0) {
      currentItem = { children: [], text };
      currentSection.items.push(currentItem);
      continue;
    }

    if (currentItem) {
      currentItem.children.push(text);
    }
  }

  return { description, sections, title };
}

function renderProjects(sections) {
  const renderedSections = sections
    .filter((section) => section.items.length > 0)
    .map((section, index) => {
      const number = String(index + 1).padStart(2, "0");
      const items = section.items.map(renderItem).join("\n");

      return `        <h3><span>${number}</span> ${escapeHtml(section.title)}</h3>\n        <ul class="project-list">\n${items}\n        </ul>`;
    })
    .join("\n\n");

  return `      <section id="projects" aria-labelledby="projects-title">\n        <h2 id="projects-title">Projects</h2>\n\n${renderedSections}\n      </section>`;
}

function renderItem(item) {
  if (item.children.length === 0) {
    return `          <li>${renderInline(item.text)}</li>`;
  }

  return `          <li>${renderInline(item.text)}: ${item.children.map(renderInline).join(", ")}</li>`;
}

function renderInline(markdown) {
  const namedUrl = markdown.match(/^(.+?)\s+-\s+(https?:\/\/\S+)$/);

  if (namedUrl) {
    return `<a href="${escapeAttribute(namedUrl[2])}">${escapeHtml(namedUrl[1])}</a>`;
  }

  const parts = [];
  let remaining = markdown;
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)/;

  while (remaining) {
    const match = remaining.match(linkPattern);

    if (!match) {
      parts.push(escapeHtml(remaining));
      break;
    }

    parts.push(escapeHtml(remaining.slice(0, match.index)));

    const label = match[1] ?? linkLabel(match[3]);
    const url = match[2] ?? match[3];
    parts.push(`<a href="${escapeAttribute(url)}">${escapeHtml(label)}</a>`);
    remaining = remaining.slice(match.index + match[0].length);
  }

  return parts.join("");
}

function linkLabel(url) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return humanizeLabel(segments.at(-1) ?? parsed.hostname);
  } catch {
    return url;
  }
}

function humanizeLabel(value) {
  return value
    .split(/[-_]/)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : `${part[0].toUpperCase()}${part.slice(1)}`))
    .join(" ");
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
