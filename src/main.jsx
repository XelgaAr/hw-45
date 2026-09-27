import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { createAppStore } from './redux/store.js';
import { SEED_TASKS, validTaskList } from './domain/tasks.js';
import { readJson, writeJson, browserStorage, storageKey } from './lib/storage.js';
import './index.css';

const storage = browserStorage();
const key = storageKey('focus-redux', import.meta.env.BASE_URL);
const items = readJson(storage, key, SEED_TASKS, validTaskList);
const store = createAppStore({ tasks: { items } });
let previousItems = items;
store.subscribe(() => {
  const nextItems = store.getState().tasks.items;
  if (nextItems !== previousItems) {
    previousItems = nextItems;
    if (!writeJson(storage, key, nextItems)) window.dispatchEvent(new Event('focus-storage-error'));
  }
});
const LegacyApp = lazy(() => import('./legacy/LegacyApp.jsx'));
const legacy = new URLSearchParams(window.location.search).get('view') === 'legacy';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ErrorBoundary>

      <Suspense fallback={<p className="loading-page">Загружаем рабочее пространство…</p>}>

        {legacy ? <LegacyApp /> : <Provider store={store}>
          <App />
        </Provider>}

      </Suspense>

    </ErrorBoundary>

  </StrictMode>,
);
