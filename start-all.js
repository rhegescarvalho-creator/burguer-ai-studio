const { spawn } = require('child_process');
const path = require('path');

const processes = [
  { name: 'API', cmd: 'npm', args: ['run', 'dev:api'], color: '\x1b[32m' },
  { name: 'Dashboard', cmd: 'npm', args: ['run', 'dev:dashboard'], color: '\x1b[34m' },
  { name: 'Player', cmd: 'npm', args: ['run', 'dev:player'], color: '\x1b[35m' },
  { name: 'Orchestrator', cmd: 'node', args: ['agents/orchestrator/dist/index.js'], color: '\x1b[36m' },
  { name: 'Copywriter', cmd: 'node', args: ['agents/copywriter/dist/index.js'], color: '\x1b[33m' },
  { name: 'Designer', cmd: 'node', args: ['agents/designer/dist/index.js'], color: '\x1b[31m' },
  { name: 'Image Gen', cmd: 'node', args: ['agents/image/dist/index.js'], color: '\x1b[37m' },
  { name: 'Video Gen', cmd: 'node', args: ['agents/video/dist/index.js'], color: '\x1b[92m' },
  { name: 'TV Builder', cmd: 'node', args: ['agents/tv/dist/index.js'], color: '\x1b[94m' },
  { name: 'Social', cmd: 'node', args: ['agents/social/dist/index.js'], color: '\x1b[95m' },
  { name: 'Publisher', cmd: 'node', args: ['agents/publisher/dist/index.js'], color: '\x1b[96m' }
];

console.log('\x1b[1mStarting Burger AI Studio (Apps & Agents) concurrently...\x1b[0m\n');

processes.forEach(p => {
  const child = spawn(p.cmd, p.args, {
    shell: true,
    stdio: 'pipe',
    env: process.env
  });

  child.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${p.color}[${p.name}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${p.color}[${p.name} ERROR]\x1b[0m ${line}`);
      }
    });
  });

  child.on('close', code => {
    console.log(`${p.color}[${p.name}]\x1b[0m process exited with code ${code}`);
  });
});
