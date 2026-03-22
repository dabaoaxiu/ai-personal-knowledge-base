export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function extractTitle(content: string) {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "Untitled note";
  }

  return firstLine.length > 72 ? `${firstLine.slice(0, 72)}...` : firstLine;
}

export function truncate(text: string, maxLength = 140) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(input));
}

export function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function dedupeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => normalizeTag(tag))
        .filter(Boolean)
        .slice(0, 5)
    )
  );
}

export function createFallbackSummary(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();

  if (compact.length <= 160) {
    return compact || "No summary available.";
  }

  return `${compact.slice(0, 160).trim()}...`;
}

export function deriveFallbackTags(content: string) {
  const englishStopwords = new Set([
    "this",
    "that",
    "with",
    "from",
    "have",
    "will",
    "your",
    "about",
    "there",
    "their",
    "what",
    "which",
    "when",
    "where",
    "how",
    "into",
    "been",
    "were",
    "then",
    "than",
    "because",
    "while",
    "should",
    "could",
    "would"
  ]);

  const chineseCandidates = content.match(/[\u4e00-\u9fff]{2,}/g) ?? [];
  const englishCandidates = (content.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []).filter(
    (token) => !englishStopwords.has(token)
  );

  return dedupeTags([...chineseCandidates, ...englishCandidates].slice(0, 8));
}

export function getQueryTerms(value: string) {
  const raw = value
    .toLowerCase()
    .split(/[\s,.;:!?/\\|()[\]{}]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);

  return Array.from(new Set(raw));
}
