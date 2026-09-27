import { createSlice, nanoid } from '@reduxjs/toolkit';
import { normalizeTask, SEED_TASKS } from '../../domain/tasks.js';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: SEED_TASKS },
  reducers: {
    addTask: {
      prepare(draft) {
        return { payload: { ...normalizeTask(draft), id: nanoid(), completed: false, createdAt: Date.now() } };
      },
      reducer(state, action) { state.items.unshift(action.payload); },
    },
    updateTask: {
      prepare({ id, ...draft }) { return { payload: { id, ...normalizeTask(draft) } }; },
      reducer(state, action) {
        const task = state.items.find((item) => item.id === action.payload.id);
        if (task) Object.assign(task, action.payload);
      },
    },
    toggleTask(state, action) {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    removeTask(state, action) { state.items = state.items.filter((task) => task.id !== action.payload); },
    clearCompleted(state) { state.items = state.items.filter((task) => !task.completed); },
  },
});
export const { addTask, updateTask, toggleTask, removeTask, clearCompleted } = tasksSlice.actions;
export default tasksSlice.reducer;
