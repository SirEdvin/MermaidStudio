/**
 * Input validation utilities for diagram content and titles.
 * Enforces size limits; rendered SVG is sanitized separately with DOMPurify.
 */

/**
 * Validation limits constants
 */
export const LIMITS = {
  /** Maximum diagram size in characters (100KB) */
  MAX_DIAGRAM_SIZE: 100000,

  /** Maximum number of lines in a diagram */
  MAX_DIAGRAM_LINES: 2000,

  /** Maximum nesting depth for complex diagrams */
  MAX_NESTING_DEPTH: 50,

  /** Maximum title length in characters */
  MAX_TITLE_LENGTH: 200,

  /** Minimum title length in characters */
  MIN_TITLE_LENGTH: 1,
} as const;

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates diagram content for size and line count.
 * Raw-content pattern rejection is intentionally disabled in this fork.
 * This is not a security verdict: SVG output must still be sanitized.
 *
 * @param content - The diagram content to validate
 * @returns ValidationResult indicating if content is valid and any error message
 *
 * @example
 * ```ts
 * const result = validateDiagramContent('graph TD\n  A-->B');
 * if (result.valid) {
 *   // Content is safe to process
 * } else {
 *   console.error(result.error); // "Content exceeds maximum line count"
 * }
 * ```
 */
export function validateDiagramContent(content: string): ValidationResult {
  // Handle empty content (valid)
  if (!content) {
    return { valid: true };
  }

  // Check size limit
  if (content.length > LIMITS.MAX_DIAGRAM_SIZE) {
    return {
      valid: false,
      error: `Content exceeds maximum size of ${LIMITS.MAX_DIAGRAM_SIZE} characters`,
    };
  }

  // Check line count limit
  const lineCount = content.split('\n').length;
  if (lineCount > LIMITS.MAX_DIAGRAM_LINES) {
    return {
      valid: false,
      error: `Content exceeds maximum line count of ${LIMITS.MAX_DIAGRAM_LINES}`,
    };
  }

  return { valid: true };
}

/**
 * Validates diagram title for length constraints.
 * Ensures titles are within reasonable length limits.
 *
 * @param title - The title to validate
 * @returns ValidationResult indicating if title is valid and any error message
 *
 * @example
 * ```ts
 * const result = validateTitle('My Awesome Diagram');
 * if (result.valid) {
 *   // Title is valid
 * } else {
 *   console.error(result.error); // "Title is too long (max 200 characters)"
 * }
 * ```
 */
export function validateTitle(title: string): ValidationResult {
  // Handle empty or whitespace-only title
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return {
      valid: false,
      error: `Title is too short (minimum ${LIMITS.MIN_TITLE_LENGTH} character)`,
    };
  }

  // Check minimum length
  if (trimmedTitle.length < LIMITS.MIN_TITLE_LENGTH) {
    return {
      valid: false,
      error: `Title is too short (minimum ${LIMITS.MIN_TITLE_LENGTH} character)`,
    };
  }

  // Check maximum length
  if (trimmedTitle.length > LIMITS.MAX_TITLE_LENGTH) {
    return {
      valid: false,
      error: `Title is too long (maximum ${LIMITS.MAX_TITLE_LENGTH} characters)`,
    };
  }

  return { valid: true };
}
