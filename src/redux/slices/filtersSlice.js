import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_FILTERS } from '../../domain/tasks.js';

const filtersSlice = createSlice({
  name: 'filters', initialState: DEFAULT_FILTERS,
  reducers: {
    setFilter(state, { payload: { name, value } }) {
      if (Object.hasOwn(DEFAULT_FILTERS, name) && typeof value === 'string') state[name] = value;
    },
    resetFilters() { return { ...DEFAULT_FILTERS }; },
  },
});
export const { setFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
