import { ValidationIssue, DATE_FIELDS } from "../../types";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateDate(frontmatter: Record<string, unknown> | null): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	if (!frontmatter) return issues;

	for (const field of DATE_FIELDS) {
		const value = frontmatter[field];
		if (value === undefined || value === null) continue;

		const strValue = String(value);
		if (!DATE_REGEX.test(strValue)) {
			issues.push({
				field,
				severity: "warning",
				message: `Invalid date format: ${field}: ${strValue}\nExpected: YYYY-MM-DD`,
			});
		}
	}

	return issues;
}
