import { readFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

const root = resolve(import.meta.dirname, "..");
const manifestPath = join(root, "manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const version = manifest.version;
const pluginId = manifest.id;

const zipsDir = join(root, "zips");
if (!existsSync(zipsDir)) {
	mkdirSync(zipsDir, { recursive: true });
}

const zipFileName = `${pluginId}-${version}.zip`;
const zipFilePath = join(zipsDir, zipFileName);

const files = ["main.js", "manifest.json", "styles.css"].filter((f) =>
	existsSync(join(root, f))
);

const fileList = files.join(" ");
const cmd = `powershell -Command "Compress-Archive -Path ${files.map((f) => `'${join(root, f)}'`).join(",")} -DestinationPath '${zipFilePath}' -Force"`;

try {
	execSync(cmd, { stdio: "inherit" });
	console.log(`\nDeploy complete: ${zipFilePath}`);
} catch (err) {
	console.error("Failed to create zip:", err.message);
	process.exit(1);
}
