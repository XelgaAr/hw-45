# Focus — планировщик задач на Redux Toolkit

Планировщик задач с централизованным состоянием. В репозитории сохранена отдельная запускаемая версия до рефакторинга: useState и передача props.

Домашнее задание: `hw-45-r08.pdf`. Базовая лекция: `#8. Introduction to Redux.pdf`.

## Возможности

Создание, редактирование, завершение и удаление задач; отдельное подтверждение удаления и очистки выполненных. Поиск по названию и описанию, фильтры по статусу, категории и приоритету, сортировка. Статистика и индикатор прогресса автоматически обновляются из Redux. Данные сохраняются в localStorage с проверкой структуры и обработкой ошибок доступа.

Основной интерфейс открывается на `/`, исходная версия — на `/?view=legacy`. В dev-сервере это `http://127.0.0.1:5173/?view=legacy`, на GitHub Pages — адрес проекта с добавленным `?view=legacy`. Эти два режима используют независимые ключи хранилища.

**Стек:** React 19, Vite 8, Redux Toolkit 2, React Redux 9, CSS.

## Запуск в VS Code

Установите Node.js **24** (рекомендуется; минимальная версия проекта — 22.12) и откройте папку этого репозитория через File → Open Folder. Либо из терминала в общей папке архива:

```bash
cd hw-45-redux
code .
npm install
npm run dev -- --open
```

Откроется `http://127.0.0.1:5173/`. `code .` — необязательная команда: при отсутствии VS Code в PATH папку можно открыть вручную. Команды npm выполняются во встроенном Terminal → New Terminal, **из папки с package.json**. Сервер останавливается Ctrl+C.

Зависимости уже перечислены в package.json; повторно выполнять `npm create vite` и устанавливать каждую библиотеку отдельно не нужно. Файл `.nvmrc` содержит `24`; при установленном совместимом менеджере версий можно использовать `nvm install` / `nvm use`. Менеджер версий не обязателен.

Первое подключение к npm создаст `package-lock.json`. Его следует включить в репозиторий. Затем используйте `npm ci` для повторяемой установки. В архив не включены node_modules и dist.

## Проверки и production preview

```bash
npm run test:core
npm test
npm run lint
npm run build
npm run preview -- --open
```

Production preview: `http://127.0.0.1:4173/`. Команда `npm run check` последовательно запускает ESLint, все unit-тесты и сборку. `npm run test:core` не требует установки библиотек приложения; `npm test` может требовать зависимости, указанные в этом проекте.

Для браузерных сценариев:

```bash
npx playwright install chromium
npm run test:e2e
```

Тесты сами собирают приложение и открывают production preview под `/repository-check/`, чтобы проверять не только корневой адрес, но и модель project Pages. Предусмотрены desktop и mobile Chromium. Перед запуском освободите порт 4173. Для интерактивного просмотра тестов: `npm run test:e2e:ui`.

**Фактически выполнено при подготовке:** 12 тестов `test:core`, синтаксическая проверка и анализ локальных импортов. Установка npm, полный ESLint, зависимые тесты, сборка Vite, E2E и публикация не подтверждены: npm registry недоступен из среды подготовки. Подробности — [docs/CHECK_REPORT.md](docs/CHECK_REPORT.md). Наличие тестового кода не означает его успешного запуска.

## Анализ состояния и миграция

Предыдущий React-проект не был приложен к заданию. Поэтому для воспроизводимого сравнения подготовлен небольшой исходный планировщик в `src/legacy/LegacyApp.jsx`. Он не выдаётся за существовавший ранее пользовательский проект. Это рабочая точка отсчёта с той же предметной областью и основными операциями.

| Данные / действие | До рефакторинга | После рефакторинга |
|---|---|---|
| Массив задач | `LegacyApp.useState` | `state.tasks.items` |
| Поиск, фильтры, сортировка | `LegacyApp.useState`, props в `LegacyBoard` | `state.filters`, `setFilter`, `resetFilters` |
| Отображаемый список | `LegacyApp → LegacyBoard → LegacyList` | `TaskList → useSelector(selectVisibleTasks)` |
| Статистика | Вычисление в родителе и props | `Stats`, `Sidebar`, `ProgressPanel` используют селекторы |
| Создание / редактирование | Callback из родителя | `addTask`, `updateTask` |
| Статус / удаление | Callback с `setTasks` | `toggleTask`, `removeTask`, `clearCompleted` |
| Черновик формы, открытое окно | Локальное состояние | Остались локальными: другим компонентам не нужны |

В исходном режиме цепочка `LegacyApp → LegacyBoard → LegacyList → TaskCard` демонстрирует prop drilling. В основной версии данные берутся в подключённых компонентах; props используются для презентационных компонентов и управления локальными диалогами, а не как глобальное хранилище.

`configureStore` находится в `src/redux/store.js`, слайсы — в `src/redux/slices`, мемоизированные селекторы — в `src/redux/selectors.js`, `Provider` — в `src/main.jsx`. Идентификаторы и время создаются в `prepare`, а не в reducers. Запись в localStorage выполняется подпиской на store, а не внутри reducers.

### Соответствие PDF

Подготовка Vite — `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`. Анализ состояния — таблица выше. Миграция — `src/redux`, `Provider`, селекторы и actions. Проверки — `tests/core`, `tests/redux.test.js`, `e2e/app.spec.js`. Документация и публикация — этот README и `.github/workflows/pages.yml`.

Проект собран в структуре Vite вручную; команда `npm create vite@latest` в изолированной среде не запускалась. Это не меняет способ запуска через Vite.

## Структура

```text
.github/workflows/pages.yml  Проверки и GitHub Pages
.vscode/                    Задачи, рекомендации расширений, запуск отладчика
scripts/                    Нормализация base path и запуск Node-тестов
src/components/             Компоненты интерфейса
src/main.jsx                Точка входа React
src/App.jsx                 Сборка интерфейса
src/index.css               Стили
public/                     Локальные публичные ресурсы
tests/                      Unit-тесты, core-тесты без внешних библиотек
e2e/                        Сценарии Playwright
docs/                       Публикация, источники, ручная проверка, отчёт
vite.config.js              Vite и переносимый base path
playwright.config.js        Проверка production-сборки под вложенным путём
```

## Публикация

В каждом репозитории уже есть `.github/workflows/pages.yml`. В GitHub установите **Settings → Pages → Source: GitHub Actions**, после загрузки файлов запустите workflow или сделайте push в `main`. Базовый путь берётся из метаданных Pages, поэтому любое допустимое имя репозитория не требует ручной правки конфигурации.

Полная инструкция с командами Git: [docs/PUBLISHING.md](docs/PUBLISHING.md).

### Репозиторий и демо

Адреса ниже — **шаблоны**. Замените `USERNAME` и `REPOSITORY` после создания репозитория и успешного workflow; настоящая публикация из среды подготовки не выполнялась.

```text
Репозиторий: https://github.com/USERNAME/REPOSITORY
Демо:        https://USERNAME.github.io/REPOSITORY/
```

## Документация

[Ручная проверка](docs/TESTING.md) · [Источники и актуальные API](docs/SOURCES.md) · [Отчёт о проверках](docs/CHECK_REPORT.md) · [GitHub Pages](docs/PUBLISHING.md)
