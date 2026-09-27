import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_FILTERS, SEED_TASKS, normalizeTask, validateTask, visibleTasks, taskStats, validTaskList, mergeTasks } from '../../src/domain/tasks.js';

test('seed data has valid unique records', () => { assert.equal(validTaskList(SEED_TASKS), true); });
test('title is required and whitespace is trimmed', () => {
  assert.ok(validateTask({ ...SEED_TASKS[0], title: '   ' }).title);
  assert.equal(normalizeTask({ ...SEED_TASKS[0], title: '  Новый план  ' }).title, 'Новый план');
  assert.throws(() => normalizeTask({ ...SEED_TASKS[0], priority: 'invalid' }));
});
test('invalid persisted data is rejected', () => {
  assert.equal(validTaskList([null]), false);
  assert.equal(validTaskList([SEED_TASKS[0], SEED_TASKS[0]]), false);
  assert.equal(validTaskList([{ ...SEED_TASKS[0], completed: 'true' }]), false);
  assert.equal(validTaskList([{ ...SEED_TASKS[0], createdAt: Infinity }]), false);
});
test('query, status, category and priority combine', () => {
  const result = visibleTasks(SEED_TASKS, { ...DEFAULT_FILTERS, query: ' REDUX ', status: 'active', category: 'Учёба', priority: 'high' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'seed-2');
});
test('sorting does not mutate input', () => {
  const before = structuredClone(SEED_TASKS);
  const result = visibleTasks(SEED_TASKS, { ...DEFAULT_FILTERS, sort: 'priority' });
  assert.equal(result[0].priority, 'high');
  assert.deepEqual(SEED_TASKS, before);
});
test('statistics handle empty and completed lists', () => {
  assert.deepEqual(taskStats([]), { total: 0, completed: 0, active: 0, percent: 0 });
  assert.equal(taskStats(SEED_TASKS).completed, 2);
  assert.equal(taskStats(SEED_TASKS.map((task) => ({ ...task, completed: true }))).percent, 100);
});
test('re-import keeps local changes and removes duplicate incoming ids', () => {
  const edited = { ...SEED_TASKS[0], title: 'Локальная правка' };
  const result = mergeTasks([edited], [SEED_TASKS[0], SEED_TASKS[1], SEED_TASKS[1]]);
  assert.equal(result.length, 2);
  assert.equal(result.find((task) => task.id === edited.id).title, 'Локальная правка');
});
