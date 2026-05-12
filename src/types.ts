export interface VocabEntry {
	value: string;
	description: string;
}

export const DEFAULT_TYPE_VOCABULARY: VocabEntry[] = [
	{ value: "note", description: "General knowledge note" },
	{ value: "project", description: "Project-oriented content with a lifecycle" },
];

export const DEFAULT_STATUS_VOCABULARY: VocabEntry[] = [
	{ value: "active", description: "Currently active and maintained" },
	{ value: "done", description: "Completed, but still in active knowledge space" },
	{ value: "archived", description: "Archived from active knowledge space" },
];

export const DEFAULT_SOURCE_VOCABULARY: VocabEntry[] = [
	{ value: "personal", description: "Personal thinking/organization" },
	{ value: "external", description: "External material organization" },
];

export const DEFAULT_DOMAINS: string[] = [
	"music",
	"bigdata",
	"aigc",
	"ecommerce",
	"programming",
	"finance",
	"system",
];

export const REQUIRED_FIELDS: string[] = ["type", "status", "created", "updated"];

export const DATE_FIELDS: string[] = ["created", "updated"];

export const KNOWN_FIELDS: string[] = [
	"type",
	"domain",
	"status",
	"created",
	"updated",
	"source",
	"tags",
];

export interface PluginSettings {
	defaultType: string;
	defaultStatus: string;
	defaultSource: string;
	typeVocabulary: VocabEntry[];
	statusVocabulary: VocabEntry[];
	sourceVocabulary: VocabEntry[];
	enableCreated: boolean;
	enableUpdated: boolean;
	autoUpdateModifiedDate: boolean;
	customTemplate: string;
	domainVocabulary: string[];
}

export const DEFAULT_SETTINGS: PluginSettings = {
	defaultType: "note",
	defaultStatus: "active",
	defaultSource: "personal",
	typeVocabulary: [...DEFAULT_TYPE_VOCABULARY],
	statusVocabulary: [...DEFAULT_STATUS_VOCABULARY],
	sourceVocabulary: [...DEFAULT_SOURCE_VOCABULARY],
	enableCreated: true,
	enableUpdated: true,
	autoUpdateModifiedDate: true,
	customTemplate: "",
	domainVocabulary: [...DEFAULT_DOMAINS],
};

export interface FrontMatterData {
	type?: string;
	domain?: string;
	status?: string;
	created?: string;
	updated?: string;
	source?: string;
	tags?: string[] | string;
}

export type ValidationSeverity = "warning" | "info";

export interface ValidationIssue {
	field: string;
	severity: ValidationSeverity;
	message: string;
}

export interface FileValidationResult {
	filePath: string;
	issues: ValidationIssue[];
}

export type ValidationScope = "current" | "folder" | "vault";
