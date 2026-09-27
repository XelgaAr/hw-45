import { useDispatch, useSelector } from 'react-redux';
import { selectFilters, selectStats } from '../redux/selectors.js';
import { setFilter } from '../redux/slices/filtersSlice.js';
import Icon from './Icon.jsx';
export function SidebarView({ stats, status, onStatus, async = false, baseline = false }) {
  return <aside className="sidebar">

    <a href="./" className="brand"><span className="brand-mark"><Icon name="check" size={25} /></span><span>focus<span className="brand-dot">.</span></span></a>

    <span className="sidebar-eyebrow">ЛИЧНОЕ ПРОСТРАНСТВО</span>

    <nav className="side-nav" aria-label="Статус задач">
      {[['all', 'grid', 'Все задачи', stats.total], ['active', 'clock', 'В работе', stats.active], ['done', 'check', 'Выполненные', stats.completed]].map(([value, icon, label, count]) =>
        <button key={value} aria-current={status === value ? 'page' : undefined} onClick={() => onStatus(value)}><Icon name={icon} /><span>{label}</span><b>{count}</b></button>)}
    </nav>

    <div className="sidebar-bottom">
      <span className="tech-pill">{baseline ? 'useState + props' : async ? 'Redux Toolkit + Thunk' : 'Redux Toolkit'}</span>
      <p>Меньше шума.<br />Больше внимания важному.</p>
      <div className="workspace-profile">
        <span className="avatar">F</span>
        <div>
          <strong>Мой планировщик</strong>
          <small>Локальное пространство</small>
        </div>
      </div>
    </div>

  </aside>;
}
export default function Sidebar({ async = false }) {
  const stats = useSelector(selectStats);
  const { status } = useSelector(selectFilters);
  const dispatch = useDispatch();
  return <SidebarView
    stats={stats}
    status={status}
    async={async}
    onStatus={(value) => dispatch(setFilter({ name: 'status', value }))}
  />;
}
