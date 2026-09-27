import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice.js';
import filtersReducer from './slices/filtersSlice.js';

// A factory keeps tests isolated; persistence belongs outside reducers.
export function createAppStore(preloadedState) {
  return configureStore({
    reducer: { tasks: tasksReducer, filters: filtersReducer },
    preloadedState,
  });
}
