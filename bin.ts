#!/usr/bin/env node
import { existsSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { text, isCancel, confirm, group, select, outro } from '@clack/prompts';
import { color } from 'console-log-colors';

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
            value: 'va',
          },
          {
            label: `${color.red('Svelte')}`,
            value: 'sv',
          },
          {
            label: `${color.green('Vue')}`,
            value: 'vu',
          },
          {
            label: `${color.blue('React')}`,
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
            value: 'js',
          },
          {
            label: `${color.blue('TypeScript')}`,
            value: 'ts',
          },
        ],
      }),
  },
  { onCancel: () => process.exit(1) }
);

outro(
  `Your project is ready!\n\tNext Steps:\n\nnpm install\nnpm run dev\n\nIf you need help, see the docs (https://chromajs.github.io).`
);

if (existsSync(cwd)) rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd);

export {};
