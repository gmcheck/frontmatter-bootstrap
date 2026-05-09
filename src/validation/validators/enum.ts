import { ValidationIssue, ENUM_FIELDS, PluginSettings } from "../../types";

export function validateEnum(
	frontmatter: Record<string, unknown> | null,
	settings: PluginSettings
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	if (!frontmatter) return issues;

	for (const [field, allowedValues] of Object.entries(ENUM_FIELDS)) {
		const value = frontmatter[field];
		if (value === undefined || value === null) continue;

		const strValue = String(value);
		if (!allowedValues.includes(strValue as never)) {
			issues.push({
				field,
				severity: "warning",
				message: `Invalid enum value: ${field}: ${strValue}\nAllowed: ${allowedValues.join(", ")}`,
			});
		}
	}

	const domainValue = frontmatter["domain"];
	if (domainValue !== undefined && domainValue !== null && domainValue !== "") {
		const domainVocab = settings.domainVocabulary;
		const strDomain = String(domainValue);
		if (!domainVocab.includes(strDomain)) {
			issues.push({
				field: "domain",
				severity: "info",
				message: `Domain "${strDomain}" is not in domain vocabulary: ${domainVocab.join(", ")}`,
			});
		}
	}

	return issues;
}
