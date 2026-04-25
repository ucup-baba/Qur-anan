/**
 * Minimal HTML sanitizer. Strips script/style/event-handler content and keeps
 * only a small whitelist of inline formatting tags. Intended for trusted-ish
 * third-party content (e.g. tafsir text from public APIs) so an unexpected
 * HTML payload cannot execute script or inject attributes.
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'em',
  'strong',
  'i',
  'b',
  'u',
  'span',
  'ul',
  'ol',
  'li',
  'blockquote',
]);

function stripAttributes(tag: string): string {
  const match = tag.match(/^<\s*\/?\s*([a-zA-Z0-9]+)/);
  if (!match) return '';
  const name = match[1].toLowerCase();
  if (!ALLOWED_TAGS.has(name)) return '';
  const isClosing = /^<\s*\//.test(tag);
  const selfClosing = /\/\s*>$/.test(tag);
  if (isClosing) return `</${name}>`;
  if (selfClosing || name === 'br') return `<${name} />`;
  return `<${name}>`;
}

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  // First, strip script and style blocks entirely
  const withoutScripts = input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  // Replace all tags with their sanitized equivalents
  return withoutScripts.replace(/<[^>]+>/g, (tag) => stripAttributes(tag));
}
