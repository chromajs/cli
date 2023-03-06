#!/usr/bin/env node
import {
  existsSync,
  readdirSync,
  rmSync,
  mkdirSync,
  createReadStream,
} from 'node:fs';
import { text, isCancel, confirm, group, select, outro } from '@clack/prompts';
import { color } from 'console-log-colors';
import unzipper from 'unzipper';

let cwd = process.argv[2] || '.';

console.log(`${color.grey(`create-chroma`)}`);

if (cwd === '.') {
  const dir = await text({
    message: 'Where should we create your project?',
    placeholder: '  (hit Enter to use current directory)',
  });

  if (isCancel(dir)) process.exit(1);

  if (dir) {
    cwd = dir;
  }
}

if (existsSync(cwd)) {
  if (readdirSync(cwd).length > 0) {
    const force = await confirm({
      message: 'Directory not empty. Continue?',
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
        message: 'Which framework?',
        options: [
          {
            label: `${color.yellow('Vanilla')}`,
            // @ts-ignore
            value: 'va',
          },
          {
            label: `${color.red('Svelte')}`,
            // @ts-ignore
            value: 'sv',
          },
          {
            label: `${color.green('Vue')}`,
            // @ts-ignore
            value: 'vu',
          },
          {
            label: `${color.blue('React')}`,
            // @ts-ignore
            value: 're',
          },
        ],
      }),

    lang: () =>
      select({
        message: 'Which language?',
        options: [
          {
            label: `${color.yellow('JavaScript')}`,
            // @ts-ignore
            value: 'js',
          },
          {
            label: `${color.blue('TypeScript')}`,
            // @ts-ignore
            value: 'ts',
          },
        ],
      }),
  },
  { onCancel: () => process.exit(1) }
);

if (existsSync(cwd)) rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd);

createReadStream(`./assets/${options.framework}.${options.lang}.zip`).pipe(
  unzipper.Extract({ path: cwd })
);

outro(
  `Your project is ready!\n\tNext Steps:\n\nnpm install\nnpm run dev\n\nIf you need help, see the docs (https://chromajs.github.io).`
);
