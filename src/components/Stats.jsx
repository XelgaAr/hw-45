import { useSelector } from 'react-redux';
import { selectStats } from '../redux/selectors.js';
import Icon from './Icon.jsx';
export function StatsView({ stats }) {
  return <section className="stats" aria-label="Статистика задач">

    {[['grid', 'Всего задач', stats.total], ['clock', 'В работе', stats.active], ['check', 'Выполнено', stats.completed]].map(([icon, label, count]) =>
      <div className="stat-card" key={label}>
        <span className="stat-icon"><Icon name={icon} /></span>
        <span className="stat-label">{label}</span>
        <strong>{count}</strong>
      </div>)}

  </section>;
}
export default function Stats() { return <StatsView stats={useSelector(selectStats)} />; }
