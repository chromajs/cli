import fs from 'node:fs';
import path from 'node:path';

let data;

export function addFile(filepath, src) {
  if (filepath.split('/').length > 2) {
    filepath.map(folder => {
      if (!folder.split('.').length > 1) {
        fs.mkdirSync(folder);
      }
    });
  }

  fs.writeFileSync(
    path.join(filepath.split('/')[0], filepath.split('/').at(-1)),
    src,
    err => {
      if (err) throw err;
    }
  );
}

export function getFile(filepath, key) {
  data = fs.readFileSync(filepath, 'utf-8');
  return data[key];
}
