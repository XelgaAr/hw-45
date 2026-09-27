import { useDispatch, useSelector } from 'react-redux';
import { selectFilters } from '../redux/selectors.js';
import { resetFilters, setFilter } from '../redux/slices/filtersSlice.js';
import { CATEGORIES, PRIORITIES } from '../domain/tasks.js';
import Icon from './Icon.jsx';
export default function Filters() {
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
  const change = (event) => dispatch(setFilter({ name: event.target.name, value: event.target.value }));
  return <section className="filters" aria-label="Фильтры задач">

    <label className="search"><Icon name="search" /><input
      name="query"
      type="search"
      value={filters.query}
      onChange={change}
      placeholder="Найти задачу…"
      aria-label="Поиск задач"
    /></label>

    <div className="filter-row">

      <select name="category" value={filters.category} onChange={change} aria-label="Категория задач">
        <option value="all">Все категории</option>
        {CATEGORIES.map((value) => <option key={value}>{value}</option>)}
      </select>

      <select name="priority" value={filters.priority} onChange={change} aria-label="Приоритет задач">
        <option value="all">Любой приоритет</option>
        {Object.entries(PRIORITIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <select name="sort" value={filters.sort} onChange={change} aria-label="Сортировка задач">
        <option value="newest">Сначала новые</option>
        <option value="priority">По приоритету</option>
        <option value="title">По названию</option>
      </select>

      <button className="text-button" onClick={() => dispatch(resetFilters())}>Сбросить</button>

    </div>

  </section>;
}
