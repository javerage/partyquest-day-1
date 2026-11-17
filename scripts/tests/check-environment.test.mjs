import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, chmodSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

const sourceScript = fileURLToPath(new URL('../check-environment.mjs', import.meta.url));
const secret = 'fake-secret-must-not-appear';

function fixture(t, { missing = [], failure = [], unexpected = [], hanging = [], versionOverrides = {} } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'partyquest-check-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const bin = path.join(dir, 'bin');
  const scripts = path.join(dir, 'scripts');
  mkdirSync(bin);
  mkdirSync(scripts);
  copyFileSync(sourceScript, path.join(scripts, 'check-environment.mjs'));
  mkdirSync(path.join(dir, 'frontend'));
  mkdirSync(path.join(dir, 'api'));
  writeFileSync(path.join(dir, 'package.json'), '{}');
  writeFileSync(path.join(dir, 'frontend/package.json'), '{}');
  writeFileSync(path.join(dir, 'api/package.json'), '{}');
  for (const id of ['increment-scope', 'contract-testing', 'debugging', 'verification']) {
    const skillDir = path.join(dir, '.opencode/skills', id);
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(path.join(skillDir, 'SKILL.md'), 'fixture');
  }
  for (const name of ['node', 'npm', 'opencode', 'git']) {
    if (missing.includes(name)) continue;
    const file = path.join(bin, name);
    const versions = { node: 'v26.13.1', npm: '11.20.0', opencode: '2.0.0', git: 'git version 2.50.0', ...versionOverrides };
    const output = failure.includes(name) || unexpected.includes(name) ? secret : versions[name];
    writeFileSync(file, `#!/bin/sh\n${hanging.includes(name) ? 'exec /bin/sleep 4' : ''}\nif [ "$1" = "--version" ]; then echo '${output}'; ${failure.includes(name) ? 'exit 7' : 'exit 0'}; fi\nexit 0\n`);
    chmodSync(file, 0o755);
  }
  return { dir, bin, script: path.join(scripts, 'check-environment.mjs') };
}
function run(setup) {
  const env = { ...process.env, PATH: setup.bin };
  return spawnSync(process.execPath, [setup.script], { cwd: setup.dir, env, encoding: 'utf8', timeout: 3000 });
}

test('reports missing public tools without changing fixture package files', (t) => {
  const setup = fixture(t, { missing: ['npm', 'opencode'] });
  const marker = path.join(setup.dir, 'fixture.txt');
  writeFileSync(marker, 'unchanged');
  const before = readdirSync(setup.dir).sort();
  const result = run(setup);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /npm: no disponible/i);
  assert.match(result.stdout, /OpenCode: no disponible/i);
  assert.equal(result.stderr, '');
  assert.deepEqual(readdirSync(setup.dir).sort(), before);
  assert.equal(readFileSync(marker, 'utf8'), 'unchanged');
  assert.equal(result.stdout.includes(secret), false);
});

test('reports successful tool versions and optional Git without treating Git as required', (t) => {
  const setup = fixture(t);
  const result = run(setup);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Node\.js: v?26\.13\.1/);
  assert.match(result.stdout, /npm: 11\.20\.0/);
  assert.match(result.stdout, /OpenCode: 2\.0\.0/);
  assert.match(result.stdout, /Git \(opcional\): (?:git version )?2\.50\.0/);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout.includes(secret), false);
});

test('recognizes the Git for Windows version format', (t) => {
  const setup = fixture(t, { versionOverrides: { git: 'git version 2.47.1.windows.1' } });
  const result = run(setup);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Git \(opcional\): 2\.47\.1\n/);
  assert.doesNotMatch(result.stdout, /no se pudo consultar la versión/);
  assert.equal(result.stdout.includes('windows'), false);
  assert.equal(result.stderr, '');
});

test('reports failed version commands using a nonsensitive diagnostic', (t) => {
  const setup = fixture(t, { failure: ['npm'] });
  const result = run(setup);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /npm: disponible, no se pudo consultar la versión/i);
  assert.equal(result.stdout.includes(secret), false);
  assert.equal(result.stderr.includes(secret), false);
  assert.equal(result.stderr, '');
});

test('never echoes unexpected stdout even when a version command exits successfully', (t) => {
  const setup = fixture(t, { unexpected: ['opencode'] });
  const marker = path.join(setup.dir, 'fixture.txt');
  writeFileSync(marker, 'unchanged');
  const result = run(setup);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /OpenCode: disponible, no se pudo consultar la versión/);
  assert.equal(result.stdout.includes(secret), false);
  assert.equal(result.stderr, '');
  assert.equal(readFileSync(marker, 'utf8'), 'unchanged');
});

test('bounds a stalled version command and leaves fixture data unchanged', (t) => {
  const setup = fixture(t, { hanging: ['opencode'] });
  const marker = path.join(setup.dir, 'fixture.txt');
  writeFileSync(marker, 'unchanged');
  const result = run(setup);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /OpenCode: disponible, no se pudo consultar la versión/);
  assert.equal(result.stdout.includes(secret), false);
  assert.equal(result.stderr, '');
  assert.equal(readFileSync(marker, 'utf8'), 'unchanged');
});

test('checks local project files and the four project skill IDs', (t) => {
  const setup = fixture(t);
  for (const file of ['package.json', 'frontend/package.json', 'api/package.json']) rmSync(path.join(setup.dir, file));
  const result = run({ ...setup, bin: path.join(setup.dir, 'missing-bin') });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /package\.json: falta/i);
  assert.match(result.stdout, /increment-scope/);
  assert.match(result.stdout, /contract-testing/);
  assert.match(result.stdout, /debugging/);
  assert.match(result.stdout, /verification/);
  assert.equal(result.stderr, '');
});
