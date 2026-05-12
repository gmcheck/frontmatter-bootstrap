import { Plugin, TFile, TFolder, FuzzySuggestModal, Notice } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS, ValidationScope, DEFAULT_TYPE_VOCABULARY, DEFAULT_STATUS_VOCABULARY, DEFAULT_SOURCE_VOCABULARY, DEFAULT_DOMAINS } from "./types";
import { generateTemplate } from "./template";
import { insertFrontMatter, updateModifiedDate, hasFrontMatter, isFileEmpty } from "./metadata";
import { validateCurrentNote, validateFolder, validateVault } from "./validation/engine";
import { generateReport } from "./validation/report";
import { FrontmatterBootstrapSettingTab } from "./settings";

class ScopeSuggestModal extends FuzzySuggestModal<string> {
	private onChoose: (scope: ValidationScope) => void;

	constructor(app: any, onChoose: (scope: ValidationScope) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder("Select validation scope...");
	}

	getItems(): string[] {
		return ["Current Note", "Current Folder", "Entire Vault"];
	}

	getItemText(item: string): string {
		return item;
	}

	onChooseItem(item: string, _: any): void {
		const scopeMap: Record<string, ValidationScope> = {
			"Current Note": "current",
			"Current Folder": "folder",
			"Entire Vault": "vault",
		};
		this.onChoose(scopeMap[item]);
	}
}

export default class FrontmatterBootstrapPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	private createEventRef: EventRef | null = null;
	private modifyEventRef: EventRef | null = null;
	private pendingUpdates: Set<string> = new Set();

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new FrontmatterBootstrapSettingTab(this.app, this));

		this.createEventRef = this.app.vault.on("create", async (file) => {
			if (!(file instanceof TFile)) return;
			if (file.extension !== "md") return;

			const empty = await isFileEmpty(this.app, file);
			if (!empty) return;

			if (hasFrontMatter(this.app, file)) return;

			const templateData = generateTemplate(this.settings);
			await insertFrontMatter(this.app, file, templateData);
		});

		this.modifyEventRef = this.app.vault.on("modify", async (file) => {
			if (!this.settings.autoUpdateModifiedDate) return;
			if (!(file instanceof TFile)) return;
			if (file.extension !== "md") return;

			const path = file.path;
			if (this.pendingUpdates.has(path)) return;

			this.pendingUpdates.add(path);

			setTimeout(async () => {
				this.pendingUpdates.delete(path);

				if (!hasFrontMatter(this.app, file)) return;

				await updateModifiedDate(this.app, file);
			}, 500);
		});

		this.registerEvent(this.createEventRef);
		this.registerEvent(this.modifyEventRef);

		this.addCommand({
			id: "metadata-health-check",
			name: "Metadata Health Check",
			callback: () => {
				const modal = new ScopeSuggestModal(this.app, async (scope) => {
					await this.runValidation(scope);
				});
				modal.open();
			},
		});
	}

	onunload() {
		this.pendingUpdates.clear();
	}

	async loadSettings() {
		const data = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

		let migrated = false;

		if ((this.settings as any).customDomains && this.settings.domainVocabulary.length === 0) {
			this.settings.domainVocabulary = [...(this.settings as any).customDomains];
			delete (this.settings as any).customDomains;
			migrated = true;
		}

		if (!this.settings.typeVocabulary || this.settings.typeVocabulary.length === 0) {
			this.settings.typeVocabulary = [...DEFAULT_TYPE_VOCABULARY];
			migrated = true;
		}
		if (!this.settings.statusVocabulary || this.settings.statusVocabulary.length === 0) {
			this.settings.statusVocabulary = [...DEFAULT_STATUS_VOCABULARY];
			migrated = true;
		}
		if (!this.settings.sourceVocabulary || this.settings.sourceVocabulary.length === 0) {
			this.settings.sourceVocabulary = [...DEFAULT_SOURCE_VOCABULARY];
			migrated = true;
		}

		if (migrated) {
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async runValidation(scope: ValidationScope): Promise<void> {
		let results;

		switch (scope) {
			case "current":
				results = await validateCurrentNote(this.app, this.settings);
				if (results.length === 0) {
					new Notice("No active Markdown file to validate.");
					return;
				}
				break;
			case "folder": {
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) {
					new Notice("No active file. Cannot determine folder.");
					return;
				}
				const parent = activeFile.parent;
				if (!parent) {
					new Notice("Active file has no parent folder.");
					return;
				}
				results = await validateFolder(this.app, this.settings, parent);
				break;
			}
			case "vault":
				results = await validateVault(this.app, this.settings);
				break;
		}

		if (!results || results.length === 0) {
			new Notice("No Markdown files found to validate.");
			return;
		}

		const report = generateReport(results);

		const reportPath = "Metadata Health Report.md";
		const existing = this.app.vault.getAbstractFileByPath(reportPath);
		if (existing) {
			await this.app.vault.modify(existing, report);
		} else {
			await this.app.vault.create(reportPath, report);
		}

		const issueCount = results.reduce((sum, r) => sum + r.issues.length, 0);
		new Notice(`Health check complete: ${issueCount} issue(s) found in ${results.length} file(s).`);

		const file = this.app.vault.getAbstractFileByPath(reportPath);
		if (file) {
			await this.app.workspace.getLeaf(false).openFile(file as TFile);
		}
	}
}
