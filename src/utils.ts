const CAMEL_CASE_PATTERN = /[A-Z]/g;

function camelToSnake(key: string): string {
  return key.replace(CAMEL_CASE_PATTERN, (char) => `_${char.toLowerCase()}`);
}

/**
 * Keys whose values are user-defined data and must be passed through
 * untouched, so custom camelCase metadata keys are never rewritten.
 */
const PASSTHROUGH_KEYS = new Set(['metadata']);

/**
 * Recursively converts an object's keys from camelCase to snake_case,
 * matching the Biteship API's parameter names. Keys without uppercase
 * letters (already snake_case) are left unchanged.
 */
export function toSnakeCase(value: unknown): unknown {
  if (value instanceof Date) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toSnakeCase);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[camelToSnake(key)] = PASSTHROUGH_KEYS.has(key) ? val : toSnakeCase(val);
    }
    return result;
  }
  return value;
}
