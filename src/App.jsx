import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, removeTask, clearCompleted } from './redux/slices/tasksSlice.js';
import { selectStats } from './redux/selectors.js';
import Sidebar from './components/Sidebar.jsx';
import Stats from './components/Stats.jsx';
import Filters from './components/Filters.jsx';
import TaskList from './components/TaskList.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import TaskEditor from './components/TaskEditor.jsx';
import Modal from './components/Modal.jsx';
import Icon from './components/Icon.jsx';
import StorageNotice from './components/StorageNotice.jsx';

export default function App() {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const [editor, setEditor] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState('');
  const save = (draft) => {
    dispatch(editor.task ? updateTask({ ...draft, id: editor.task.id }) : addTask(draft));
    setMessage(editor.task ? 'Изменения сохранены.' : 'Задача добавлена.');
    setEditor(null);
  };
  const confirm = () => {
    dispatch(confirmation.all ? clearCompleted() : removeTask(confirmation.task.id));
    setMessage(confirmation.all ? 'Выполненные задачи удалены.' : 'Задача удалена.');
    setConfirmation(null);
  };
  return <div className="app-shell">

    <a className="skip-link" href="#main">Перейти к задачам</a>

    <Sidebar />

    <div className="workspace">
      <header className="topbar">
        <span>Рабочее пространство <span className="breadcrumb-slash">/</span> <strong>Обзор</strong></span>
        <span className="session-badge"><i /> В вашем браузере</span>
      </header>

      <main id="main" className="main-content">

        <StorageNotice />

        <section className="page-heading">
          <div>
            <span className="eyebrow">ВАШ ДЕНЬ. ВАШ РИТМ.</span>
            <h1>Освободите место<br />для важного<span>.</span></h1>
            <p>Соберите планы в одном месте — и двигайтесь по порядку.</p>
          </div>
          <button className="button primary" onClick={() => setEditor({ task: null })}><Icon name="plus" />Новая задача</button>
        </section>

        <Stats />

        <div className="content-grid">
          <div>
            <Filters />
            <TaskList onEdit={(task) => setEditor({ task })} onDelete={(task) => setConfirmation({ task })} />

            <div className="list-footer">
              <span role="status" aria-live="polite">{message || 'Задачи сохраняются на этом устройстве.'}</span>
              <button className="text-button" disabled={!stats.completed} onClick={() => setConfirmation({ all: true })}>Удалить выполненные</button>
            </div>

          </div>
          <ProgressPanel />
        </div>

        <footer className="page-footer">
          <span>Focus · Планировщик задач</span>
          <a href="?view=legacy">Версия до Redux <Icon name="arrow" size={15} /></a>
        </footer>

      </main>

    </div>

    {editor && <TaskEditor task={editor.task} onSave={save} onClose={() => setEditor(null)} />}

    {confirmation && <Modal
      title={confirmation.all ? 'Удалить выполненные задачи?' : 'Удалить задачу?'}
      onClose={() => setConfirmation(null)}
    ><p>{confirmation.all ? 'Будут удалены только завершённые задачи. Это действие нельзя отменить.' : `«${confirmation.task.title}» будет удалена. Это действие нельзя отменить.`}</p><div className="modal-actions">
        <button className="button secondary" onClick={() => setConfirmation(null)}>Отмена</button>
        <button className="button danger-button" onClick={confirm}>Подтвердить удаление</button>
      </div></Modal>}

  </div>;
}
