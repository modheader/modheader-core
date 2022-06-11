import fs from 'fs-extra';
import child_process from 'child_process';
import os from 'os';
import path from 'path';
import archiver from 'archiver';

function zipDirectory(source, destFile) {
  const output = fs.createWriteStream(destFile);
  const archive = archiver('zip');

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log(`Finished creating ${destFile}`);
  });

  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(output);
  archive.directory(source, false);
  archive.finalize();
}

export function build({ platforms }) {
  fs.ensureDirSync('releases');
  fs.emptyDirSync('releases');
  for (const platform of platforms) {
    child_process.execSync(`npm run build-${platform}`);
    fs.copySync('dist', `releases/${platform}/`);
    zipDirectory(`releases/${platform}`, `releases/${platform}.zip`);
  }

  const tmpMaster = path.join(os.tmpdir(), 'tmp-master');
  fs.ensureDirSync(tmpMaster);
  fs.emptyDirSync(tmpMaster);
  const excludedDirs = ['.git', 'dist', 'node_modules', 'releases'];
  fs.copySync('.', `${tmpMaster}/modheader`, {
    filter: (src) => !excludedDirs.find((dir) => src.startsWith(dir))
  });
  fs.copySync(path.join('..', 'modheader-core'), `${tmpMaster}/modheader-core`, {
    filter: (src) => {
      const strippedPrefixPath = src.slice(path.join('..', 'modheader-core').length + 1);
      return !excludedDirs.find((dir) => strippedPrefixPath.startsWith(dir));
    }
  });
  zipDirectory(tmpMaster, 'releases/master.zip');
}
