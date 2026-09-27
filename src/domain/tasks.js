export const CATEGORIES = ['Работа', 'Учёба', 'Личное'];
export const PRIORITIES = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
export const DEFAULT_FILTERS = { query: '', status: 'all', category: 'all', priority: 'all', sort: 'newest' };
export const SEED_TASKS = [
  { id: 'seed-1', title: 'Собрать интерфейс планировщика', description: 'Продумать карточки, фильтры и удобную навигацию.', category: 'Работа', priority: 'high', completed: false, createdAt: 6 },
  { id: 'seed-2', title: 'Разобраться с Redux Toolkit', description: 'Store, slice, actions и селекторы — всё на своих местах.', category: 'Учёба', priority: 'high', completed: false, createdAt: 5 },
  { id: 'seed-3', title: 'Запланировать прогулку', description: 'Оставить в расписании время без экрана.', category: 'Личное', priority: 'low', completed: false, createdAt: 4 },
  { id: 'seed-4', title: 'Проверить мобильную версию', description: 'Пройти основные сценарии на небольшом экране.', category: 'Работа', priority: 'medium', completed: false, createdAt: 3 },
  { id: 'seed-5', title: 'Подготовить структуру проекта', description: 'Отделить компоненты от логики приложения.', category: 'Учёба', priority: 'medium', completed: true, createdAt: 2 },
  { id: 'seed-6', title: 'Навести порядок в заметках', description: 'Важное оставить, лишнее убрать.', category: 'Личное', priority: 'low', completed: true, createdAt: 1 },
];

export function validateTask(draft) {
  const errors = {};
  const title = typeof draft.title === 'string' ? draft.title.trim() : '';
  if (title.length < 3 || title.length > 100) errors.title = 'Название должно содержать от 3 до 100 символов.';
  if (typeof draft.description !== 'string' || draft.description.length > 400) errors.description = 'Описание — не более 400 символов.';
  if (!CATEGORIES.includes(draft.category)) errors.category = 'Выберите категорию.';
  if (!Object.hasOwn(PRIORITIES, draft.priority)) errors.priority = 'Выберите приоритет.';
  return errors;
}

export function normalizeTask(draft) {
  if (Object.keys(validateTask(draft)).length) throw new Error('Некорректные данные задачи.');
  return { title: draft.title.trim(), description: draft.description.trim(), category: draft.category, priority: draft.priority };
}

export function validTaskList(value) {
  if (!Array.isArray(value) || value.length > 5000) return false;
  const ids = new Set();
  return value.every((item) => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || ids.has(item.id)) return false;
    ids.add(item.id);
    return Object.keys(validateTask(item)).length === 0 && typeof item.completed === 'boolean' && Number.isFinite(item.createdAt);
  });
}

export function visibleTasks(items, filters) {
  const query = filters.query.trim().toLocaleLowerCase('ru');
  const rank = { high: 0, medium: 1, low: 2 };
  return items.filter((task) =>
    (filters.status === 'all' || (filters.status === 'done' ? task.completed : !task.completed)) &&
    (filters.category === 'all' || task.category === filters.category) &&
    (filters.priority === 'all' || task.priority === filters.priority) &&
    `${task.title} ${task.description}`.toLocaleLowerCase('ru').includes(query)
  ).sort((a, b) => {
    if (filters.sort === 'title') return a.title.localeCompare(b.title, 'ru');
    if (filters.sort === 'priority') return rank[a.priority] - rank[b.priority] || b.createdAt - a.createdAt;
    return b.createdAt - a.createdAt;
  });
}

export function taskStats(items) {
  const completed = items.filter((task) => task.completed).length;
  return { total: items.length, completed, active: items.length - completed, percent: items.length ? Math.round(completed / items.length * 100) : 0 };
}

/** Merge only new ids; repeated imports never overwrite local edits. */
export function mergeTasks(current, incoming) {
  const ids = new Set(current.map((task) => task.id));
  const additions = incoming.filter((task) => {
    if (ids.has(task.id)) return false;
    ids.add(task.id);
    return true;
  });
  return [...additions, ...current];
}
