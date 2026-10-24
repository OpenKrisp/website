import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { languages } from '../i18n.js';

const project = new URL('../', import.meta.url);
const run = promisify(execFile);

test('development and production serve every locale, shared asset and discovery file', async t => {
  await run(process.execPath, ['scripts/build.mjs'], { cwd: project });
  for (const mode of ['development', 'production']) {
    await t.test(mode, async () => {
      const server = spawn(process.execPath, ['scripts/serve.mjs', ...(mode === 'production' ? ['--dist'] : [])],
        { cwd: project, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
      try {
        const address = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(Error('Server did not start')), 5000);
          server.stdout.on('data', data => {
            const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
            if (match) { clearTimeout(timeout); resolve(match[0]); }
          });
          server.once('error', error => { clearTimeout(timeout); reject(error); });
          server.once('exit', code => { clearTimeout(timeout); reject(Error(`Server exited: ${code}`)); });
        });
        for (const { code } of languages) {
          const response = await fetch(`${address}/${code}/`);
          assert.equal(response.status, 200);
          const html = await response.text();
          assert.ok(html.includes(`<html lang="${code}">`));
          assert.doesNotMatch(html, /\{\{/);
          const redirect = await fetch(`${address}/${code}?campaign=test`, { redirect: 'manual' });
          assert.equal(redirect.status, 308);
          assert.equal(redirect.headers.get('location'), `/${code}/?campaign=test`);
        }
        for (const path of ['/', '/index.html', '/app.js', '/i18n.js', '/styles.css', '/assets/filter.svg', '/assets/filter-off.svg', '/sitemap.xml', '/robots.txt']) {
          assert.equal((await fetch(address + path)).status, 200, path);
        }
        assert.equal((await fetch(`${address}/fr/`, { method: 'HEAD' })).status, 200);
        assert.equal((await fetch(`${address}/fr/`, { method: 'POST' })).status, 405);
        assert.equal((await fetch(`${address}/xx/`)).status, 404);
        assert.equal((await fetch(`${address}/locales/en.json`)).status, 404);
      } finally { server.kill(); }
    });
  }
});
