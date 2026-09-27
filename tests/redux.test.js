import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppStore } from '../src/redux/store.js';
import { addTask, updateTask, toggleTask, removeTask, clearCompleted } from '../src/redux/slices/tasksSlice.js';
import { setFilter, resetFilters } from '../src/redux/slices/filtersSlice.js';
import { selectStats, selectVisibleTasks } from '../src/redux/selectors.js';
const draft = { title: 'Проверить проект', description: 'Проверка Redux', category: 'Учёба', priority: 'high' };

test('CRUD changes one centralized store immutably', () => {
  const store = createAppStore();
  const before = store.getState();
  store.dispatch(addTask(draft));
  const added = store.getState().tasks.items[0];
  assert.notEqual(store.getState(), before);
  assert.equal(before.tasks.items.length + 1, store.getState().tasks.items.length);
  store.dispatch(updateTask({ ...draft, id: added.id, title: 'Изменённый проект' }));
  assert.equal(store.getState().tasks.items[0].title, 'Изменённый проект');
  store.dispatch(toggleTask(added.id));
  assert.equal(store.getState().tasks.items[0].completed, true);
  store.dispatch(removeTask(added.id));
  assert.equal(store.getState().tasks.items.length, before.tasks.items.length);
});
test('memoized selectors are stable between unrelated actions', () => {
  const store = createAppStore();
  const selected = selectStats(store.getState());
  store.dispatch(setFilter({ name: 'status', value: 'done' }));
  assert.equal(selectStats(store.getState()), selected);
  assert.ok(selectVisibleTasks(store.getState()).every((task) => task.completed));
  store.dispatch(resetFilters());
  assert.equal(selectVisibleTasks(store.getState()).length, selected.total);
});
test('clear completed never removes active tasks', () => {
  const store = createAppStore();
  const active = selectStats(store.getState()).active;
  store.dispatch(clearCompleted());
  assert.equal(selectStats(store.getState()).total, active);
  assert.equal(selectStats(store.getState()).completed, 0);
});
