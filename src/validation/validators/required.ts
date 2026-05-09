import { ValidationIssue, REQUIRED_FIELDS } from "../../types";

export function validateRequired(frontmatter: Record<string, unknown> | null): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	if (!frontmatter) {
		for (const field of REQUIRED_FIELDS) {
			issues.push({
				field,
				severity: "warning",
				message: `Missing required field: ${field}`,
			});
		}
		return issues;
	}

	for (const field of REQUIRED_FIELDS) {
		if (frontmatter[field] === undefined || frontmatter[field] === null) {
			issues.push({
				field,
				severity: "warning",
				message: `Missing required field: ${field}`,
			});
		}
	}

	return issues;
}
