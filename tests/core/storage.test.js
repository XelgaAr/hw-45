import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, writeJson, storageKey } from '../../src/lib/storage.js';
import { normalizeBasePath } from '../../scripts/base-path.mjs';

test('invalid JSON falls back without throwing', () => {
  assert.deepEqual(readJson({ getItem: () => '{broken' }, 'x', []), []);
});
test('stored data must pass schema validation', () => {
  assert.deepEqual(readJson({ getItem: () => '{"wrong":1}' }, 'x', [], Array.isArray), []);
});
test('blocked or absent storage is non-fatal', () => {
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Quota'); } };
  assert.equal(readJson(blocked, 'x', 'fallback'), 'fallback');
  assert.equal(writeJson(blocked, 'x', []), false);
  assert.equal(writeJson(null, 'x', []), false);
});
test('JSON round trip and independent application keys', () => {
  const memory = new Map();
  const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
  assert.equal(writeJson(storage, 'tasks', [{ id: '1' }]), true);
  assert.deepEqual(readJson(storage, 'tasks', []), [{ id: '1' }]);
  assert.notEqual(storageKey('a', '/repo/'), storageKey('b', '/repo/'));
  assert.notEqual(storageKey('a', '/one/'), storageKey('a', '/two/'));
});
test('Pages base handles project paths and custom domains', () => {
  assert.equal(normalizeBasePath(undefined), './');
  assert.equal(normalizeBasePath('/'), '/');
  assert.equal(normalizeBasePath('my-repo'), '/my-repo/');
  assert.equal(normalizeBasePath('/my-repo/'), '/my-repo/');
  assert.throws(() => normalizeBasePath('https://example.com'), /URL path/);
});
