import Icon from './Icon.jsx';
import { PRIORITIES } from '../domain/tasks.js';
export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return <article className={`task-card ${task.completed ? 'is-complete' : ''}`} data-testid="task-card">

    <label className="task-checkbox"><input
      type="checkbox"
      checked={task.completed}
      onChange={() => onToggle(task.id)}
      aria-label={`Выполнено: ${task.title}`}
    /><span><Icon name="check" size={16} /></span></label>

    <div className="task-content">

      <div className="task-tags">
        <span className={`category category-${task.category === 'Работа' ? 'work' : task.category === 'Учёба' ? 'study' : 'personal'}`}>{task.category}</span>
        <span className={`priority priority-${task.priority}`}><i />{PRIORITIES[task.priority]} приоритет</span>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

    </div>

    <div className="task-actions">
      <button
        className="icon-button"
        onClick={() => onEdit(task)}
        aria-label={`Редактировать: ${task.title}`}
        title="Редактировать"
      ><Icon name="edit" size={18} /></button>
      <button
        className="icon-button danger"
        onClick={() => onDelete(task)}
        aria-label={`Удалить: ${task.title}`}
        title="Удалить"
      ><Icon name="trash" size={18} /></button>
    </div>

  </article>;
}
