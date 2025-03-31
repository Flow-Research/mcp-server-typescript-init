import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

// Promisify exec for async/await usage
const execAsync = util.promisify(exec);


const server = new McpServer({
    name: "server-typescript-init",
    version: "1.0.0",
});


server.tool(
    "init-typescript",
    "Initializes a new TypeScript project with basic structure (package.json, tsconfig.json, src/index.ts) and dependencies.",
    {
        projectName: z.string().describe("The name for the new TypeScript project directory."),
        destinationFolder: z.string().describe("The absolute or relative path to the folder where the project directory should be created."),
    },
    async ({ projectName, destinationFolder }) => {
        const projectPath = path.resolve(destinationFolder, projectName);

        try {
            console.error(`Creating project directory at: ${projectPath}`);
            await fs.mkdir(projectPath, { recursive: true });

            console.error(`Initializing npm project in ${projectPath}...`);
            await execAsync("npm init -y", { cwd: projectPath });

            console.error(`Installing TypeScript in ${projectPath}...`);
            await execAsync("npm install typescript --save-dev", { cwd: projectPath });

            console.error(`Initializing tsconfig.json in ${projectPath}...`);
            // Initialize tsconfig with reasonable defaults for src/dist structure
            await execAsync(
                "npx tsc --init --rootDir ./src --outDir ./dist --esModuleInterop --resolveJsonModule --lib es6,dom --module commonjs --allowJs true --noImplicitAny true",
                { cwd: projectPath }
            );

            console.error(`Creating src directory and index.ts in ${projectPath}...`);
            const srcPath = path.join(projectPath, "src");
            await fs.mkdir(srcPath, { recursive: true });
            const indexPath = path.join(srcPath, "index.ts");
            await fs.writeFile(indexPath, 'console.log("Hello, TypeScript!");\n');

            console.error(
                `Updating package.json with build scripts in ${projectPath}...`
            );
            const packageJsonPath = path.join(projectPath, "package.json");
            const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
            const packageJson = JSON.parse(packageJsonContent);

            packageJson.scripts = {
                ...(packageJson.scripts || {}), // Preserve existing scripts if any
                build: "tsc",
                start: "node dist/index.js",
            };

            // Ensure main points to the compiled output
            packageJson.main = "dist/index.js";

            await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

            const successMsg = `TypeScript project '${projectName}' created successfully at '${projectPath}'`;
            console.error(successMsg);
            return {
                content: [
                    {
                        type: "text",
                        text: successMsg,
                    }
                ]
            };
        } catch (error: any) {
            console.error(`Error initializing TypeScript project: ${error.message}`);
            console.error(`Stderr: ${error.stderr || "N/A"}`); // Log stderr for debugging
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to initialize TypeScript project: ${error.message}`,
                    }
                ]
            };
        }
    }
);


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("MCP Server 'server-typescript-init' started and listening via stdio.");
}


main().catch((error) => {
    console.error("Fatal error in main(): ", error);
    process.exit(1);
});


