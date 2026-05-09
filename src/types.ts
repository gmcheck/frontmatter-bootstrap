export type NoteType = "note" | "project";
export type NoteStatus = "active" | "done" | "archived";
export type NoteSource = "personal" | "external";

export const VALID_TYPES: NoteType[] = ["note", "project"];
export const VALID_STATUSES: NoteStatus[] = ["active", "done", "archived"];
export const VALID_SOURCES: NoteSource[] = ["personal", "external"];
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

export const ENUM_FIELDS: Record<string, string[]> = {
	type: VALID_TYPES,
	status: VALID_STATUSES,
	source: VALID_SOURCES,
};

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
	defaultType: NoteType;
	defaultStatus: NoteStatus;
	defaultSource: NoteSource;
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
