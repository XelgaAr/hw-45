import { createSelector } from '@reduxjs/toolkit';
import { taskStats, visibleTasks } from '../domain/tasks.js';
export const selectTasks = (state) => state.tasks.items;
export const selectFilters = (state) => state.filters;
export const selectVisibleTasks = createSelector([selectTasks, selectFilters], visibleTasks);
export const selectStats = createSelector([selectTasks], taskStats);
