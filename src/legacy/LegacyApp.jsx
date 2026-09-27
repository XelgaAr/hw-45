import { useEffect, useState } from 'react';
import { CATEGORIES, DEFAULT_FILTERS, PRIORITIES, SEED_TASKS, normalizeTask, taskStats, validTaskList, visibleTasks } from '../domain/tasks.js';
import { browserStorage, readJson, writeJson, storageKey } from '../lib/storage.js';
import { SidebarView } from '../components/Sidebar.jsx';
import { StatsView } from '../components/Stats.jsx';
import { ProgressView } from '../components/ProgressPanel.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskEditor from '../components/TaskEditor.jsx';
import Modal from '../components/Modal.jsx';
import Icon from '../components/Icon.jsx';
import StorageNotice from '../components/StorageNotice.jsx';

const key = storageKey('focus-before-redux', import.meta.env.BASE_URL);
const storage = browserStorage();

// This working baseline deliberately passes state through props.
function LegacyList({ tasks, onToggle, onEdit, onDelete }) {
  return <section aria-label="Список задач">
    <div className="list-heading">
      <h2>Ваши задачи</h2>
      <span className="count-pill">{tasks.length}</span>
    </div>

    {tasks.length ? <div className="task-list">
      {tasks.map((task) => <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)}
    </div> : <div className="empty-state">
      <h3>Здесь пока ничего нет</h3>
      <p>Добавьте задачу или сбросьте фильтры.</p>
    </div>}

  </section>;
}
function LegacyBoard({ tasks, filters, onFilter, onReset, onToggle, onEdit, onDelete }) {
  return <><section className="filters" aria-label="Фильтры задач">
    <label className="search"><Icon name="search" /><input
      type="search"
      aria-label="Поиск задач"
      placeholder="Найти задачу…"
      value={filters.query}
      onChange={(event) => onFilter('query', event.target.value)}
    /></label>

    <div className="filter-row">
      <select
        aria-label="Категория задач"
        value={filters.category}
        onChange={(event) => onFilter('category', event.target.value)}
      >
        <option value="all">Все категории</option>
        {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
      </select>

      <select
        aria-label="Приоритет задач"
        value={filters.priority}
        onChange={(event) => onFilter('priority', event.target.value)}
      >
        <option value="all">Любой приоритет</option>
        {Object.entries(PRIORITIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <select
        aria-label="Сортировка задач"
        value={filters.sort}
        onChange={(event) => onFilter('sort', event.target.value)}
      >
        <option value="newest">Сначала новые</option>
        <option value="priority">По приоритету</option>
        <option value="title">По названию</option>
      </select>
      <button className="text-button" onClick={onReset}>Сбросить</button>
    </div>
  </section>
    <LegacyList tasks={visibleTasks(tasks, filters)} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} /></>;
}
export default function LegacyApp() {
  const [tasks, setTasks] = useState(() => readJson(storage, key, SEED_TASKS, validTaskList));
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [editor, setEditor] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const stats = taskStats(tasks);
  useEffect(() => {
    if (!writeJson(storage, key, tasks)) window.dispatchEvent(new Event('focus-storage-error'));
  }, [tasks]);
  const onFilter = (name, value) => setFilters((previous) => ({ ...previous, [name]: value }));
  const save = (draft) => {
    const fields = normalizeTask(draft);
    setTasks((previous) => editor.task ? previous.map((task) => task.id === editor.task.id ? { ...task, ...fields } : task) : [{ ...fields, id: crypto.randomUUID(), completed: false, createdAt: Date.now() }, ...previous]);
    setEditor(null);
  };
  const remove = () => {
    setTasks((previous) => previous.filter((task) => confirmation.all ? !task.completed : task.id !== confirmation.task.id));
    setConfirmation(null);
  };
  return <div className="app-shell">
    <SidebarView baseline stats={stats} status={filters.status} onStatus={(value) => onFilter('status', value)} />

    <div className="workspace">
      <header className="topbar">
        <strong>Исходная версия · useState + props</strong>
        <a href="./">Перейти к Redux</a>
      </header>
      <main className="main-content">
        <StorageNotice />

        <section className="page-heading">
          <div>
            <span className="eyebrow">ДО РЕФАКТОРИНГА</span>
            <h1>Те же задачи.<br />Локальный state.</h1>
            <p>Отдельный набор данных для сравнения архитектуры.</p>
          </div>
          <button className="button primary" onClick={() => setEditor({ task: null })}><Icon name="plus" />Новая задача</button>
        </section>

        <StatsView stats={stats} />
        <div className="content-grid">
          <div>
            <LegacyBoard
              tasks={tasks}
              filters={filters}
              onFilter={onFilter}
              onReset={() => setFilters({ ...DEFAULT_FILTERS })}
              onToggle={(id) => setTasks((previous) => previous.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))}
              onEdit={(task) => setEditor({ task })}
              onDelete={(task) => setConfirmation({ task })}
            />

            <div className="list-footer">
              <span>Данные исходной версии независимы от Redux-версии.</span>
              <button className="text-button" disabled={!stats.completed} onClick={() => setConfirmation({ all: true })}>Удалить выполненные</button>
            </div>
          </div>
          <ProgressView stats={stats} />
        </div>

      </main>
    </div>

    {editor && <TaskEditor task={editor.task} onSave={save} onClose={() => setEditor(null)} />}

    {confirmation && <Modal title="Удалить выбранные задачи?" onClose={() => setConfirmation(null)}><p>Это действие нельзя отменить.</p><div className="modal-actions">
      <button className="button secondary" onClick={() => setConfirmation(null)}>Отмена</button>
      <button className="button danger-button" onClick={remove}>Подтвердить удаление</button>
    </div></Modal>}

  </div>;
}
