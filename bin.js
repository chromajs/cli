#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import * as prompt from '@clack/prompts';
import format from 'kleur';

const { version } = JSON.parse(
  fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8')
);
let cwd = process.argv[2] || '.';

console.log(`${format.grey(`create-chroma version ${version}`)}`);

if (cwd === '.') {
  const dir = await prompt.text({
    message: 'Where should we create your project?',
    placeholder: '  (hit Enter to use current directory)',
  });

  if (prompt.isCancel(dir)) process.exit(1);

  if (dir) {
    cwd = dir;
  }
}

if (fs.existsSync(cwd)) {
  if (fs.readdirSync(cwd).length > 0) {
    const force = await prompt.confirm({
      message: 'Directory not empty. Continue?',
      initialValue: false,
    });

    if (force !== true) {
      process.exit(1);
    }
  }
}

const options = await prompt.group(
  {
    types: () =>
      prompt.select({
        message: 'Which language?',
        options: [
          {
            label: `${format.yellow('Vanilla')}`,
            value: 0,
          },
          {
            label: `${format.white('Svelte')}`,
            value: 1,
          },
          {
            label: `${format.green('Vue')}`,
            value: 2,
          },
          {
            label: `${format.blue('React')}`,
            value: 3,
          },
          {
            label: `${format.magenta('Preact')}`,
            value: 4,
          },
          {
            label: `${format.red('Lit')}`,
            value: 5,
          },
        ],
      }),

    features: () =>
      prompt.multiselect({
        message: 'Select additional options (use arrow keys/space bar)',
        required: false,
        options: [
          {
            value: 'eslint',
            label: 'Add ESLint for code linting',
          },
          {
            value: 'prettier',
            label: 'Add Prettier for code formatting',
          },
        ],
      }),
  },
  { onCancel: () => process.exit(1) }
);
