#!/usr/bin/env node
import {
  existsSync,
  readdirSync,
  rmSync,
  mkdirSync,
  createReadStream,
} from "node:fs";
import { text, isCancel, confirm, group, select, outro } from "@clack/prompts";
import { color } from "console-log-colors";
import unzipper from "unzipper";

let cwd = process.argv[2] || ".";

console.log(`${color.grey(`create-chroma`)}`);

if (cwd === ".") {
  const dir = await text({
    message: "Where should we create your project?",
    placeholder: "  (hit Enter to use current directory)",
  });

  if (isCancel(dir)) process.exit(1);

  if (dir) {
    cwd = dir;
  }
}

if (existsSync(cwd)) {
  if (readdirSync(cwd).length > 0) {
    const force = await confirm({
      message: "Directory not empty. Continue?",
      initialValue: false,
    });

    if (force !== true) {
      process.exit(1);
    }
  }
}

const options = await group(
  {
    framework: () =>
      select({
        message: "Which framework?",
        options: [
          {
            label: `${color.yellow("Vanilla")}`,
            // @ts-ignore
            value: "vanilla",
          },
          {
            label: `${color.red("Svelte")}`,
            // @ts-ignore
            value: "svelte",
          },
          {
            label: `${color.green("Vue")}`,
            // @ts-ignore
            value: "vue",
          },
          {
            label: `${color.blue("React")}`,
            // @ts-ignore
            value: "react",
          },
          {
            label: `${color.white("Static")}`,
            // @ts-ignore
            value: "static",
          },
        ],
      }),

    lang: () =>
      select({
        message: "Which language?",
        options: [
          {
            label: `${color.yellow("JavaScript")}`,
            // @ts-ignore
            value: "js",
          },
          {
            label: `${color.blue("TypeScript")}`,
            // @ts-ignore
            value: "ts",
          },
          {
            label: `${color.blue("HTML (Choose if You Used Static)")}`,
            // @ts-ignore
            value: "html",
          },
        ],
      }),
  },
  { onCancel: () => process.exit(1) }
);

if (existsSync(cwd)) rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd);

if (options.framework === "static") {
  createReadStream("./assets/static.html.zip").pipe(
    unzipper.Extract({ path: cwd })
  );
} else {
  if (options.lang === "html") {
    console.log("HTML is unavailable to your framework!");
    process.exit(1);
  }
  createReadStream(`./assets/${options.framework}.${options.lang}.zip`).pipe(
    unzipper.Extract({ path: cwd })
  );
}

if (options.framework === "static") {
  outro(
    `Your project is ready!\n\tNext Steps:\n\ncd ${cwd}\nnpm install\nnpx chroma-html-compiler -s ./src -o ./out\n\nIf you need help, see the docs (https://chromajs.github.io).`
  );
} else {
  outro(
    `Your project is ready!\n\tNext Steps:\n\ncd ${cwd}\nnpm install\nnpm run dev\n\nIf you need help, see the docs (https://chromajs.github.io).`
  );
}
