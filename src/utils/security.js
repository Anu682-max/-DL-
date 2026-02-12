// ============================
// Security Utilities
// ============================

/**
 * Sanitize HTML to prevent XSS attacks.
 * Allows only safe tags: b, i, br, strong, em, a (with href)
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  let safe = div.innerHTML;

  // Restore allowed tags
  safe = safe
    .replace(/&lt;b&gt;/gi, '<b>')
    .replace(/&lt;\/b&gt;/gi, '</b>')
    .replace(/&lt;i&gt;/gi, '<i>')
    .replace(/&lt;\/i&gt;/gi, '</i>')
    .replace(/&lt;strong&gt;/gi, '<strong>')
    .replace(/&lt;\/strong&gt;/gi, '</strong>')
    .replace(/&lt;em&gt;/gi, '<em>')
    .replace(/&lt;\/em&gt;/gi, '</em>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
    .replace(/\n/g, '<br>');

  return safe;
}

/**
 * Sanitize plain text input - strip all HTML tags
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Rate limiter - limits actions within a time window
 */
export function createRateLimiter(maxAttempts, windowMs) {
  const attempts = [];

  return {
    canProceed() {
      const now = Date.now();
      // Remove expired attempts
      while (attempts.length > 0 && attempts[0] < now - windowMs) {
        attempts.shift();
      }
      return attempts.length < maxAttempts;
    },
    record() {
      attempts.push(Date.now());
    },
    getTimeUntilReset() {
      if (attempts.length === 0) return 0;
      const oldest = attempts[0];
      return Math.max(0, windowMs - (Date.now() - oldest));
    },
  };
}

/**
 * Input length validator
 */
export function validateLength(text, min, max) {
  if (!text) return false;
  const len = text.trim().length;
  return len >= min && len <= max;
}

/**
 * Detect suspicious patterns (SQL injection, script injection)
 */
export function hasSuspiciousContent(text) {
  const patterns = [
    /<script[\s>]/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /;\s*delete\s+from/i,
    /'\s*or\s+'1'\s*=\s*'1/i,
    /eval\s*\(/i,
    /document\.(cookie|location|write)/i,
  ];
  return patterns.some((p) => p.test(text));
}
