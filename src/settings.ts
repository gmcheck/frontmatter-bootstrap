import { App, PluginSettingTab, Setting } from "obsidian";
import { PluginSettings, VocabEntry, DEFAULT_SETTINGS } from "./types";
import type FrontmatterBootstrapPlugin from "./main";

export class FrontmatterBootstrapSettingTab extends PluginSettingTab {
	plugin: FrontmatterBootstrapPlugin;

	constructor(app: App, plugin: FrontmatterBootstrapPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const title = containerEl.createEl("h2", { text: "Frontmatter Bootstrap" });
		title.style.fontSize = "1.8em";
		title.style.marginBottom = "1em";

		containerEl.createEl("h3", { text: "Base options" });

		this.renderVocabularySection(containerEl, "Type", "type", "Defines the structural role of a note.");
		this.renderVocabularySection(containerEl, "Status", "status", "Represents lifecycle state.");
		this.renderVocabularySection(containerEl, "Source", "source", "Represents content origin.");

		containerEl.createEl("h3", { text: "Feature toggles" });

		new Setting(containerEl)
			.setName("Enable created field")
			.setDesc("Insert the created field when creating new notes")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.enableCreated)
					.onChange(async (v) => {
						this.plugin.settings.enableCreated = v;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Enable updated field")
			.setDesc("Insert the updated field when creating new notes")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.enableUpdated)
					.onChange(async (v) => {
						this.plugin.settings.enableUpdated = v;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Auto-update modified date")
			.setDesc("Automatically update the updated field on file save")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoUpdateModifiedDate)
					.onChange(async (v) => {
						this.plugin.settings.autoUpdateModifiedDate = v;
						await this.plugin.saveSettings();
					});
			});

		containerEl.createEl("h3", { text: "Domain options" });

		new Setting(containerEl)
			.setName("Domain vocabulary")
			.setDesc("Comma-separated domain values used for validation. Values not in this list will be reported as warnings.")
			.addTextArea((text) => {
				text.setPlaceholder("music, bigdata, aigc, ...")
					.setValue(this.plugin.settings.domainVocabulary.join(", "))
					.onChange(async (v) => {
						this.plugin.settings.domainVocabulary = v
							.split(",")
							.map((d) => d.trim())
							.filter((d) => d.length > 0);
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 2;
				text.inputEl.cols = 40;
			});

		containerEl.createEl("h3", { text: "Custom template" });

		new Setting(containerEl)
			.setName("Custom YAML template")
			.setDesc("Override the default template. Use {{date}} for YYYY-MM-DD. Leave empty to use defaults. Format: key: value per line.")
			.addTextArea((text) => {
				text.setPlaceholder("type: note\nstatus: active\ncreated: {{date}}")
					.setValue(this.plugin.settings.customTemplate)
					.onChange(async (v) => {
						this.plugin.settings.customTemplate = v;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 8;
				text.inputEl.cols = 40;
			});

		new Setting(containerEl)
			.setName("Reset to defaults")
			.setDesc("Reset all settings to default values")
			.addButton((btn) => {
				btn.setButtonText("Reset")
					.onClick(async () => {
						this.plugin.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
						await this.plugin.saveSettings();
						this.display();
					});
			});
	}

	private renderVocabularySection(
		containerEl: HTMLElement,
		label: string,
		field: "type" | "status" | "source",
		description: string
	): void {
		const vocabKey = `${field}Vocabulary` as "typeVocabulary" | "statusVocabulary" | "sourceVocabulary";
		const defaultKey = `default${field.charAt(0).toUpperCase() + field.slice(1)}` as "defaultType" | "defaultStatus" | "defaultSource";

		const section = containerEl.createDiv();
		section.style.background = "var(--background-secondary)";
		section.style.border = "1px solid var(--background-modifier-border)";
		section.style.borderRadius = "6px";
		section.style.padding = "12px 16px";
		section.style.marginBottom = "12px";
		section.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.08)";

		const headerEl = section.createEl("div");
		headerEl.style.display = "flex";
		headerEl.style.alignItems = "center";
		headerEl.style.justifyContent = "space-between";
		headerEl.style.marginBottom = "10px";

		const headerLeft = headerEl.createDiv();
		headerLeft.style.display = "flex";
		headerLeft.style.alignItems = "baseline";
		headerLeft.style.gap = "12px";

		const labelSpan = headerLeft.createSpan({ text: label });
		labelSpan.style.fontSize = "1.1em";
		labelSpan.style.fontWeight = "normal";
		labelSpan.style.color = "var(--text-normal)";

		const descSpan = headerLeft.createSpan({ text: description });
		descSpan.style.color = "var(--text-faint)";
		descSpan.style.fontSize = "0.85em";

		const addBtn = headerEl.createEl("button", { text: "+ Add" });
		addBtn.style.background = "var(--interactive-normal)";
		addBtn.style.border = "1px solid var(--background-modifier-border)";
		addBtn.style.color = "var(--text-normal)";
		addBtn.style.cursor = "pointer";
		addBtn.style.padding = "4px 10px";
		addBtn.style.fontSize = "0.85em";
		addBtn.style.borderRadius = "4px";
		addBtn.addEventListener("mouseenter", () => {
			addBtn.style.background = "var(--interactive-hover)";
		});
		addBtn.addEventListener("mouseleave", () => {
			addBtn.style.background = "var(--interactive-normal)";
		});

		const vocab = this.plugin.settings[vocabKey];

		const listEl = section.createDiv();
		listEl.style.marginBottom = "8px";

		for (let i = 0; i < vocab.length; i++) {
			const entry = vocab[i];
			const rowEl = listEl.createDiv();
			rowEl.style.display = "flex";
			rowEl.style.alignItems = "center";
			rowEl.style.padding = "4px 0";
			rowEl.style.gap = "8px";
			rowEl.style.borderBottom = "1px solid var(--background-modifier-border)";

			const valueSpan = rowEl.createSpan({ text: entry.value });
			valueSpan.style.fontWeight = "normal";
			valueSpan.style.minWidth = "100px";
			valueSpan.style.color = "var(--text-normal)";

			const entryDescSpan = rowEl.createSpan({ text: entry.description });
			entryDescSpan.style.color = "var(--text-muted)";
			entryDescSpan.style.flex = "1";
			entryDescSpan.style.fontSize = "0.9em";

			const deleteBtn = rowEl.createEl("button", { text: "✕" });
			deleteBtn.style.background = "none";
			deleteBtn.style.border = "none";
			deleteBtn.style.color = "var(--text-faint)";
			deleteBtn.style.cursor = "pointer";
			deleteBtn.style.padding = "2px 6px";
			deleteBtn.style.fontSize = "1em";
			deleteBtn.style.lineHeight = "1";
			deleteBtn.style.borderRadius = "3px";
			deleteBtn.addEventListener("mouseenter", () => {
				deleteBtn.style.color = "var(--text-error)";
				deleteBtn.style.background = "var(--background-modifier-hover)";
			});
			deleteBtn.addEventListener("mouseleave", () => {
				deleteBtn.style.color = "var(--text-faint)";
				deleteBtn.style.background = "none";
			});
			deleteBtn.addEventListener("click", async () => {
				vocab.splice(i, 1);
				if (this.plugin.settings[defaultKey] === entry.value) {
					(this.plugin.settings as any)[defaultKey] = vocab.length > 0 ? vocab[0].value : "";
				}
				await this.plugin.saveSettings();
				this.display();
			});
		}

		const addContainer = section.createDiv();
		addContainer.style.display = "none";
		addContainer.style.alignItems = "center";
		addContainer.style.marginBottom = "12px";
		addContainer.style.marginTop = "8px";

		const valueInput = addContainer.createEl("input", {
			type: "text",
			placeholder: "Value",
		});
		valueInput.style.marginRight = "8px";
		valueInput.style.width = "120px";
		valueInput.style.padding = "4px 8px";
		valueInput.style.border = "1px solid var(--background-modifier-border)";
		valueInput.style.borderRadius = "4px";
		valueInput.style.background = "var(--background-modifier-form-field)";
		valueInput.style.color = "var(--text-normal)";
		valueInput.style.fontSize = "0.9em";

		const descInput = addContainer.createEl("input", {
			type: "text",
			placeholder: "Description",
		});
		descInput.style.marginRight = "8px";
		descInput.style.width = "200px";
		descInput.style.padding = "4px 8px";
		descInput.style.border = "1px solid var(--background-modifier-border)";
		descInput.style.borderRadius = "4px";
		descInput.style.background = "var(--background-modifier-form-field)";
		descInput.style.color = "var(--text-normal)";
		descInput.style.fontSize = "0.9em";

		const saveBtn = addContainer.createEl("button", { text: "Save" });
		saveBtn.style.marginRight = "8px";

		const cancelBtn = addContainer.createEl("button", { text: "Cancel" });

		addBtn.addEventListener("click", () => {
			addContainer.style.display = "flex";
			valueInput.value = "";
			descInput.value = "";
			valueInput.focus();
		});

		saveBtn.addEventListener("click", async () => {
			const val = valueInput.value.trim();
			const desc = descInput.value.trim();
			if (!val) return;

			if (vocab.some((e) => e.value === val)) return;

			vocab.push({ value: val, description: desc || val });
			await this.plugin.saveSettings();
			this.display();
		});

		cancelBtn.addEventListener("click", () => {
			addContainer.style.display = "none";
		});

		new Setting(section)
			.setName(`Default ${label.toLowerCase()}`)
			.setDesc(`Select the default value for new notes`)
			.addDropdown((dd) => {
				dd.addOption("", "— select —");
				for (const entry of vocab) {
					dd.addOption(entry.value, entry.value);
				}
				dd.setValue(this.plugin.settings[defaultKey] || "")
					.onChange(async (v) => {
						(this.plugin.settings as any)[defaultKey] = v;
						await this.plugin.saveSettings();
					});
			});
	}
}
