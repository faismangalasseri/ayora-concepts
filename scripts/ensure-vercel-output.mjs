import { access, readFile, writeFile } from "node:fs/promises";

const outputDir = new URL("../.vercel/output/", import.meta.url);
const configPath = new URL("config.json", outputDir);
const serverConfigPath = new URL(
  "functions/__server.func/.vc-config.json",
  outputDir,
);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(outputDir))) {
  throw new Error("Vercel output was not generated.");
}

if (!(await exists(serverConfigPath))) {
  throw new Error("Vercel server function was not generated.");
}

if (!(await exists(configPath))) {
  await writeFile(
    configPath,
    `${JSON.stringify(
      {
        version: 3,
        framework: { name: "nitro", version: "3" },
        routes: [
          { handle: "filesystem" },
          { src: "/.*", dest: "/__server" },
        ],
      },
      null,
      2,
    )}\n`,
  );
}

const config = JSON.parse(await readFile(configPath, "utf8"));
if (config.version !== 3 || !Array.isArray(config.routes)) {
  throw new Error("Vercel output routing manifest is invalid.");
}

console.log("Verified Vercel Build Output API manifest.");