import { PluginSettings } from "./types";

export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function generateTemplate(settings: PluginSettings): Record<string, unknown> {
	const today = formatDate(new Date());

	if (settings.customTemplate && settings.customTemplate.trim() !== "") {
		return parseCustomTemplate(settings.customTemplate, today);
	}

	const data: Record<string, unknown> = {};

	data.type = settings.defaultType;
	data.domain = "";
	data.status = settings.defaultStatus;

	if (settings.enableCreated) {
		data.created = today;
	}

	if (settings.enableUpdated) {
		data.updated = today;
	}

	data.source = settings.defaultSource;
	data.tags = [];

	return data;
}

function parseCustomTemplate(template: string, date: string): Record<string, unknown> {
	const replaced = template.replace(/\{\{date\}\}/g, date);
	const result: Record<string, unknown> = {};

	const lines = replaced.split("\n");
	for (const line of lines) {
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) continue;

		const key = line.substring(0, colonIndex).trim();
		const value = line.substring(colonIndex + 1).trim();

		if (key === "") continue;

		if (value === "") {
			result[key] = "";
		} else {
			result[key] = value;
		}
	}

	return result;
}
