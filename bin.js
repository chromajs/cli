#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import * as prompt from '@clack/prompts';
import format from 'kleur';

import * as util from './utils';

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
    framework: () =>
      prompt.select({
        message: 'Which framework?',
        options: [
          {
            label: `${format.yellow('Vanilla')}`,
            value: 'va',
          },
          {
            label: `${format.white('Svelte')}`,
            value: 'sv',
          },
          {
            label: `${format.green('Vue')}`,
            value: 'vu',
          },
          {
            label: `${format.blue('React')}`,
            value: 're',
          },
          {
            label: `${format.magenta('Preact')}`,
            value: 'pr',
          },
          {
            label: `${format.red('Lit')}`,
            value: 'li',
          },
        ],
      }),

    lang: () =>
      prompt.select({
        message: 'Which language?',
        options: [
          {
            label: `${format.yellow('JavaScript')}`,
            value: 'js',
          },
          {
            label: `${format.blue('TypeScript')}`,
            value: 'ts',
          },
        ],
      }),
  },
  { onCancel: () => process.exit(1) }
);

prompt.outro(`Your project is ready!`);

if (cwd && !fs.existsSync(cwd)) {
  fs.mkdirSync(cwd);
} else {
  fs.readdirSync(cwd, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlinkSync(path.join(cwd, file), err => {
        if (err) throw err;
      });
    }
  });
}

fs.writeFileSync(join(cwd, 'p'));

switch (options.framework) {
  case 'va':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
  case 'sv':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
  case 'vu':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
  case 're':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
  case 'pr':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
  case 'li':
    switch (options.lang) {
      case 'js':
        break;
      case 'ts':
        break;
    }
    break;
}
