#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import * as prompt from '@clack/prompts';
import format from 'kleur';

import * as util from './utils.js';
import common from './assets/common.js';

// Prompts

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

// Create/Clear Directory

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

// Create Shared Files

Object.keys(common).forEach(key => {
  util.addFile(path.join(cwd, key), common[key]);
});

// Create Files for Framework/Lang
let addData;

switch (options.framework) {
  case 'va':
    switch (options.lang) {
      case 'js':
        addData = util.getFile('./assets/vanilla.js', 'js');
        break;
      case 'ts':
        addData = util.getFile('./assets/vanilla.js', 'ts');
        break;
    }
    break;
  case 'sv':
    switch (options.lang) {
      case 'js':
        addData = util.getFile('./assets/svelte.js', 'js');
        break;
      case 'ts':
        addData = util.getFile('./assets/svelte.js', 'ts');
        break;
    }
    break;
  case 'vu':
    switch (options.lang) {
      case 'js':
        addData = util.getFile('./assets/vue.js', 'js');
        break;
      case 'ts':
        addData = util.getFile('./assets/vue.js', 'ts');
        break;
    }
    break;
  case 're':
    switch (options.lang) {
      case 'js':
        addData = util.getFile('./assets/react.js', 'js');
        break;
      case 'ts':
        addData = util.getFile('./assets/react.js', 'ts');
        break;
    }
    break;
}
