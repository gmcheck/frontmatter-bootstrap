import { ValidationIssue, PluginSettings } from "../../types";

export function validateEnum(
	frontmatter: Record<string, unknown> | null,
	settings: PluginSettings
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	if (!frontmatter) return issues;

	const vocabMap: Record<string, { vocab: { value: string }[]; label: string }> = {
		type: { vocab: settings.typeVocabulary, label: "type" },
		status: { vocab: settings.statusVocabulary, label: "status" },
		source: { vocab: settings.sourceVocabulary, label: "source" },
	};

	for (const [field, { vocab }] of Object.entries(vocabMap)) {
		const value = frontmatter[field];
		if (value === undefined || value === null) continue;

		const strValue = String(value);
		const allowedValues = vocab.map((e) => e.value);
		if (!allowedValues.includes(strValue)) {
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
				severity: "warning",
				message: `Domain "${strDomain}" is not in domain vocabulary: ${domainVocab.join(", ")}`,
			});
		}
	}

	return issues;
}
