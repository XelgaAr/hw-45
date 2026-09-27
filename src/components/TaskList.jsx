import { useDispatch, useSelector } from 'react-redux';
import { selectVisibleTasks } from '../redux/selectors.js';
import { toggleTask } from '../redux/slices/tasksSlice.js';
import { resetFilters } from '../redux/slices/filtersSlice.js';
import TaskCard from './TaskCard.jsx';
import Icon from './Icon.jsx';
export default function TaskList({ onEdit, onDelete }) {
  const tasks = useSelector(selectVisibleTasks);
  const dispatch = useDispatch();
  return <section aria-label="Список задач">

    <div className="list-heading">
      <h2>Ваши задачи</h2>
      <span className="count-pill" aria-live="polite">{tasks.length}</span>
    </div>

    {tasks.length ? <div className="task-list">
      {tasks.map((task) => <TaskCard
        key={task.id}
        task={task}
        onToggle={(id) => dispatch(toggleTask(id))}
        onEdit={onEdit}
        onDelete={onDelete}
      />)}
    </div> :
      <div className="empty-state">
        <Icon name="leaf" size={38} />
        <h3>Здесь пока ничего нет</h3>
        <p>Добавьте задачу или измените условия поиска.</p>
        <button className="button secondary" onClick={() => dispatch(resetFilters())}>Сбросить фильтры</button>
      </div>}

  </section>;
}
