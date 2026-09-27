import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const activeElement = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); activeElement?.focus(); };
  }, []);
  return <dialog
    ref={ref}
    className="modal"
    aria-labelledby="dialog-title"
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
  >

    <div className="modal-inner">

      <div className="section-heading">
        <h2 id="dialog-title">{title}</h2>
        <button type="button" className="icon-button" aria-label="Закрыть окно" onClick={onClose}><Icon name="close" /></button>
      </div>

      {children}

    </div>

  </dialog>;
}
