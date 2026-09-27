import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

// Enumerate explicitly: works in PowerShell, cmd, Bash and Node 22/24 alike.
const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv[2];
if (mode && mode !== 'core') throw new Error('Usage: node scripts/run-tests.mjs [core]');
const directory = join(root, 'tests', mode === 'core' ? 'core' : '');
function collect(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(path, entry.name);
    return entry.isDirectory() ? collect(fullPath) : entry.name.endsWith('.test.js') ? [relative(root, fullPath)] : [];
  });
}
const files = collect(directory).sort();
if (!files.length) throw new Error('No test files found.');
const result = spawnSync(process.execPath, ['--test', ...files], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
