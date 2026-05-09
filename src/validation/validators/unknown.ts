import { ValidationIssue, KNOWN_FIELDS } from "../../types";

const COMMON_TYPOS: Record<string, string> = {
	statu: "status",
	tyep: "type",
	typ: "type",
	satus: "status",
	staus: "status",
	soruce: "source",
	soucre: "source",
	soource: "source",
	cretaed: "created",
	creatd: "created",
	updaetd: "updated",
	upated: "updated",
	taags: "tags",
	tgas: "tags",
	domian: "domain",
	domaon: "domain",
};

export function validateUnknown(frontmatter: Record<string, unknown> | null): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	if (!frontmatter) return issues;

	const knownSet = new Set(KNOWN_FIELDS);

	for (const key of Object.keys(frontmatter)) {
		if (knownSet.has(key)) continue;

		const lowerKey = key.toLowerCase();
		const suggestion = COMMON_TYPOS[lowerKey];

		if (suggestion) {
			issues.push({
				field: key,
				severity: "info",
				message: `Possible typo: "${key}" → did you mean "${suggestion}"?`,
			});
		}
	}

	return issues;
}
