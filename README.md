# MCP Server: TypeScript Project Initializer

This project implements a Model Context Protocol (MCP) server that provides a tool to initialize a basic TypeScript project structure.

The server exposes a single tool, `init-typescript`, which takes a project name and destination folder as input and creates:

*   A project directory.
*   `package.json` (via `npm init -y`).
*   Installs `typescript` as a dev dependency.
*   `tsconfig.json` with basic settings.
*   A `src` directory with a simple `index.ts` file.
*   Adds `build` and `start` scripts to `package.json`.

## Prerequisites

*   Node.js and npm (or a compatible package manager)
*   Make

## Usage with Makefile

A `Makefile` is provided for common tasks. Run these commands from the root directory of this project (`mcp-server-typescript-init`):

*   **Install Dependencies:**
    ```bash
    make install
    ```
    (Runs `npm install`)

*   **Build the Project:**
    ```bash
    make build
    ```
    (Runs `npm run build`, which compiles TypeScript to JavaScript in the `build/` directory)

*   **Inspect the Server:**
    ```bash
    make inspect
    ```
    (Runs `make build` first, then starts the MCP inspector using `npx @modelcontextprotocol/inspector node build/index.js`)

*   **Install, Build, and Inspect (Default):**
    ```bash
    make
    ```
    or
    ```bash
    make all
    ```
    (Runs `make install`, `make build`, and `make inspect` sequentially)

*   **Clean Project:**
    ```bash
    make clean
    ```
    (Removes `node_modules`, `build`, `dist`, and `*.tsbuildinfo` files)

## Running Manually

If you prefer not to use Make:

1.  Install dependencies: `npm install`
2.  Build the project: `npm run build`
3.  Run the server (e.g., with the inspector):
    ```bash
    npx @modelcontextprotocol/inspector node build/index.js
    ```
    Or run the server directly if connecting with a client:
    ```bash
    node build/index.js
    ```
