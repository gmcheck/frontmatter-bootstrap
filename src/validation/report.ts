import { FileValidationResult } from "../types";

export function generateReport(results: FileValidationResult[]): string {
	const lines: string[] = [];

	lines.push("# Metadata Health Report");
	lines.push("");

	const resultsWithIssues = results.filter((r) => r.issues.length > 0);
	const cleanFiles = results.filter((r) => r.issues.length === 0);

	lines.push(`**Checked:** ${results.length} file(s)`);
	lines.push(`**With issues:** ${resultsWithIssues.length} file(s)`);
	lines.push(`**Clean:** ${cleanFiles.length} file(s)`);
	lines.push("");

	if (resultsWithIssues.length === 0) {
		lines.push("✅ All checked files have valid metadata.");
		lines.push("");
		return lines.join("\n");
	}

	for (const result of resultsWithIssues) {
		lines.push("---");
		lines.push("");
		lines.push(`## ${result.filePath}`);
		lines.push("");

		const warnings = result.issues.filter((i) => i.severity === "warning");
		const infos = result.issues.filter((i) => i.severity === "info");

		if (warnings.length > 0) {
			lines.push("**Warnings:**");
			lines.push("");
			for (let i = 0; i < warnings.length; i++) {
				lines.push(`${i + 1}. ${warnings[i].message}`);
			}
			lines.push("");
		}

		if (infos.length > 0) {
			lines.push("**Info:**");
			lines.push("");
			for (let i = 0; i < infos.length; i++) {
				lines.push(`${i + 1}. ${infos[i].message}`);
			}
			lines.push("");
		}
	}

	lines.push("---");
	lines.push("");

	return lines.join("\n");
}
