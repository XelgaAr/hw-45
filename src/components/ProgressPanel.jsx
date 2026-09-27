import { useSelector } from 'react-redux';
import { selectStats } from '../redux/selectors.js';
import Icon from './Icon.jsx';
export function ProgressView({ stats }) {
  return <aside className="progress-panel">
    <span className="eyebrow">ШАГ ЗА ШАГОМ</span>
    <h2>Хороший темп.</h2>
    <p>Каждая небольшая задача приближает вас к большому результату.</p>

    <div className="progress-ring" style={{ '--progress': `${stats.percent}%` }}>
      <div>
        <strong>{stats.percent}%</strong>
        <span>выполнено</span>
      </div>
    </div>

    <label className="sr-only" htmlFor="task-progress">Общий прогресс</label>
    <progress className="sr-only" id="task-progress" max="100" value={stats.percent} />

    <p className="progress-summary">{stats.completed} из {stats.total} задач завершено</p>
    <div className="daily-note">
      <Icon name="leaf" />
      <p>Выберите одну важную задачу и начните с неё.</p>
    </div>

  </aside>;
}
export default function ProgressPanel() { return <ProgressView stats={useSelector(selectStats)} />; }
