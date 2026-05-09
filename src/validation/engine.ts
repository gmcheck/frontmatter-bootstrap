import { App, TFile, TFolder } from "obsidian";
import { PluginSettings, FileValidationResult, ValidationIssue } from "../types";
import { validateRequired } from "./validators/required";
import { validateEnum } from "./validators/enum";
import { validateDate } from "./validators/date";
import { validateUnknown } from "./validators/unknown";

export async function validateFile(
	app: App,
	file: TFile,
	settings: PluginSettings
): Promise<FileValidationResult> {
	const issues: ValidationIssue[] = [];

	const cache = app.metadataCache.getFileCache(file);
	const frontmatter = cache?.frontmatter ?? null;

	const fmRecord: Record<string, unknown> | null = frontmatter
		? (frontmatter as unknown as Record<string, unknown>)
		: null;

	issues.push(...validateRequired(fmRecord));
	issues.push(...validateEnum(fmRecord, settings));
	issues.push(...validateDate(fmRecord));
	issues.push(...validateUnknown(fmRecord));

	return {
		filePath: file.path,
		issues,
	};
}

export async function validateCurrentNote(
	app: App,
	settings: PluginSettings
): Promise<FileValidationResult[]> {
	const activeFile = app.workspace.getActiveFile();
	if (!activeFile || activeFile.extension !== "md") return [];

	const result = await validateFile(app, activeFile, settings);
	return [result];
}

export async function validateFolder(
	app: App,
	settings: PluginSettings,
	folder: TFolder
): Promise<FileValidationResult[]> {
	const results: FileValidationResult[] = [];

	const files = collectMarkdownFiles(app, folder);
	for (const file of files) {
		const result = await validateFile(app, file, settings);
		results.push(result);
	}

	return results;
}

export async function validateVault(
	app: App,
	settings: PluginSettings
): Promise<FileValidationResult[]> {
	const results: FileValidationResult[] = [];

	const files = app.vault.getMarkdownFiles();
	for (const file of files) {
		const result = await validateFile(app, file, settings);
		results.push(result);
	}

	return results;
}

function collectMarkdownFiles(app: App, folder: TFolder): TFile[] {
	const files: TFile[] = [];

	for (const child of folder.children) {
		if (child instanceof TFile && child.extension === "md") {
			files.push(child);
		} else if (child instanceof TFolder) {
			files.push(...collectMarkdownFiles(app, child));
		}
	}

	return files;
}
