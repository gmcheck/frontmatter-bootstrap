import { App, PluginSettingTab, Setting } from "obsidian";
import { PluginSettings, VALID_TYPES, VALID_STATUSES, VALID_SOURCES, DEFAULT_SETTINGS } from "./types";
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

		containerEl.createEl("h2", { text: "Frontmatter Bootstrap" });

		new Setting(containerEl)
			.setName("Default type")
			.setDesc("note = General knowledge note | project = Project-oriented content with a lifecycle")
			.addDropdown((dd) => {
				for (const t of VALID_TYPES) {
					dd.addOption(t, t);
				}
				dd.setValue(this.plugin.settings.defaultType)
					.onChange(async (v) => {
						this.plugin.settings.defaultType = v as PluginSettings["defaultType"];
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Default status")
			.setDesc("active = Currently active and maintained | done = Completed, but still in active knowledge space | archived = Archived from active knowledge space")
			.addDropdown((dd) => {
				for (const s of VALID_STATUSES) {
					dd.addOption(s, s);
				}
				dd.setValue(this.plugin.settings.defaultStatus)
					.onChange(async (v) => {
						this.plugin.settings.defaultStatus = v as PluginSettings["defaultStatus"];
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Default source")
			.setDesc("personal = Personal thinking/organization | external = External material organization")
			.addDropdown((dd) => {
				for (const s of VALID_SOURCES) {
					dd.addOption(s, s);
				}
				dd.setValue(this.plugin.settings.defaultSource)
					.onChange(async (v) => {
						this.plugin.settings.defaultSource = v as PluginSettings["defaultSource"];
						await this.plugin.saveSettings();
					});
			});

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
						this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
						await this.plugin.saveSettings();
						this.display();
					});
			});
	}
}
