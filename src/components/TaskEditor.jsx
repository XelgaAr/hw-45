import { useState } from 'react';
import { CATEGORIES, PRIORITIES, validateTask } from '../domain/tasks.js';
import Modal from './Modal.jsx';

export default function TaskEditor({ task, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({ title: task?.title ?? '', description: task?.description ?? '', category: task?.category ?? 'Работа', priority: task?.priority ?? 'medium' }));
  const [errors, setErrors] = useState({});
  const update = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateTask(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements[Object.keys(nextErrors)[0]]?.focus();
      return;
    }
    onSave(draft);
  };
  return <Modal title={task ? 'Редактировать задачу' : 'Новая задача'} onClose={onClose}>
    <form onSubmit={submit} noValidate>

      <label className="field">Название задачи
        <input
          name="title"
          value={draft.title}
          onChange={update}
          placeholder="Что нужно сделать?"
          maxLength={100}
          autoFocus
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
      </label>

      {errors.title && <p className="field-error" id="title-error" role="alert">{errors.title}</p>}

      <label className="field">Описание <span className="optional">необязательно</span>
        <textarea
          name="description"
          value={draft.description}
          onChange={update}
          placeholder="Детали, которые помогут начать"
          rows={3}
          maxLength={400}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
      </label>

      {errors.description && <p className="field-error" id="description-error" role="alert">{errors.description}</p>}

      <div className="form-row">

        <label className="field">Категория<select name="category" value={draft.category} onChange={update}>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select></label>

        <label className="field">Приоритет<select name="priority" value={draft.priority} onChange={update}>
          {Object.entries(PRIORITIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>

      </div>

      <div className="modal-actions">
        <button type="button" className="button secondary" onClick={onClose}>Отмена</button>
        <button type="submit" className="button primary">{task ? 'Сохранить изменения' : 'Добавить задачу'}</button>
      </div>

    </form>
  </Modal>;
}
