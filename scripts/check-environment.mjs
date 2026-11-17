#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'package.json',
  'frontend/package.json',
  'api/package.json',
  '.opencode/skills/increment-scope/SKILL.md',
  '.opencode/skills/contract-testing/SKILL.md',
  '.opencode/skills/debugging/SKILL.md',
  '.opencode/skills/verification/SKILL.md',
];
const tools = [
  { label: 'Node.js', command: 'node', required: true },
  { label: 'npm', command: 'npm', required: true },
  { label: 'OpenCode', command: 'opencode', required: true },
  { label: 'Git (opcional)', command: 'git', required: false },
];

function version(command) {
  return new Promise((resolve) => {
    let settled = false;
    let timer;
    let child;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    try {
      // npm is commonly exposed as npm.cmd on Windows; use a fixed command string,
      // never user-supplied arguments, because cmd.exe is required for .cmd files.
      child = process.platform === 'win32' && command === 'npm'
        ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm.cmd --version'], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] })
        : spawn(command, ['--version'], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      finish({ available: false });
      return;
    }
    timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({ available: true, versionFailed: true });
    }, 1500);
    let output = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      if (settled) return;
      if (output.length + chunk.length > 4096) {
        child.kill('SIGKILL');
        finish({ available: true, versionFailed: true });
        return;
      }
      output += chunk;
    });
    child.once('error', () => finish({ available: false }));
    child.once('close', (code) => {
      // Report only a numeric version, never arbitrary subprocess output.
      // Git for Windows appends ".windows.N" (for example "2.47.1.windows.1").
      const match = output.trim().match(/^(?:v|git version |opencode(?: version)? )?(\d+\.\d+\.\d+)(?:\.windows\.\d+)?(?:[-+][a-zA-Z0-9.-]+)?(?: \(Apple Git-[\d.]+\))?$/);
      finish(code === 0 && match
        ? { available: true, version: match[1] }
        : { available: true, versionFailed: true });
    });
  });
}

let failed = false;
console.log('Diagnóstico local de PartyQuest D1 (sin instalar ni conectarse a servicios).');
console.log('Las versiones observadas no garantizan compatibilidad; consulta la guía del taller.');
for (const tool of tools) {
  const result = await version(tool.command);
  if (result.available && result.version) console.log(`${tool.label}: ${result.version}`);
  else if (result.available) {
    console.log(`${tool.label}: disponible, no se pudo consultar la versión`);
    if (tool.required) failed = true;
  } else {
    console.log(`${tool.label}: no disponible${tool.required ? ' (requerido)' : ' (opcional)'}`);
    if (tool.required) failed = true;
  }
}
console.log('\nArchivos del paquete:');
for (const relative of requiredFiles) {
  try {
    await access(path.join(root, relative));
    if (relative === 'package.json' || relative.endsWith('/package.json')) {
      const manifest = JSON.parse(await readFile(path.join(root, relative), 'utf8'));
      if (!manifest || typeof manifest !== 'object') throw new Error('invalid');
    }
    console.log(`${relative}: presente`);
  } catch {
    console.log(`${relative}: falta o no es válido`);
    failed = true;
  }
}
console.log('\nEste diagnóstico no instala software, consulta cuentas, lee variables de entorno ni comprueba credenciales.');
process.exitCode = failed ? 1 : 0;
