import { useEffect, useState } from 'react';
import { browserStorage } from '../lib/storage.js';
export default function StorageNotice() {
  const [failed, setFailed] = useState(() => !browserStorage());
  useEffect(() => {
    const report = () => setFailed(true);
    window.addEventListener('focus-storage-error', report);
    return () => window.removeEventListener('focus-storage-error', report);
  }, []);
  return failed ? <p role="alert" className="notice warning">Хранилище браузера недоступно. Изменения останутся только до перезагрузки страницы.</p> : null;
}
