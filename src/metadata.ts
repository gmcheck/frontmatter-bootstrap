import { App, TFile, parseFrontMatterTags, parseFrontMatterEntry } from "obsidian";
import { formatDate } from "./template";

export async function insertFrontMatter(
	app: App,
	file: TFile,
	data: Record<string, unknown>
): Promise<void> {
	await app.fileManager.processFrontMatter(file, (fm) => {
		for (const [key, value] of Object.entries(data)) {
			if (fm[key] === undefined) {
				fm[key] = value;
			}
		}
	});
}

export async function updateModifiedDate(
	app: App,
	file: TFile
): Promise<void> {
	const cache = app.metadataCache.getFileCache(file);
	if (!cache || !cache.frontmatter) return;

	if (cache.frontmatter.updated === undefined) return;

	const today = formatDate(new Date());
	const currentUpdated = cache.frontmatter.updated;

	if (currentUpdated === today) return;

	await app.fileManager.processFrontMatter(file, (fm) => {
		if (fm.updated !== undefined) {
			fm.updated = today;
		}
	});
}

export function hasFrontMatter(app: App, file: TFile): boolean {
	const cache = app.metadataCache.getFileCache(file);
	return cache !== null && cache.frontmatter !== undefined && cache.frontmatter !== null;
}

export async function isFileEmpty(app: App, file: TFile): Promise<boolean> {
	const content = await app.vault.read(file);
	return content.trim() === "";
}
