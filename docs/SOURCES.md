# Официальные источники

Дата сверки документации: **27 сентября 2026 года**. Учебные PDF определяют требования; ссылки ниже уточняют действующие API и способ публикации. Минимальные версии/допустимые диапазоны указаны в `package.json`; фактически установленные версии фиксируются первым успешным `npm install` в `package-lock.json`.

## Общая основа

- React: https://react.dev/reference/react-dom/client/createRoot
- React, ref как prop: https://react.dev/reference/react/forwardRef
- Vite, запуск и требования Node: https://vite.dev/guide/
- Vite, сборка/preview/GitHub Pages: https://vite.dev/guide/static-deploy.html
- Vite React plugin, официальные релизы: https://github.com/vitejs/vite-plugin-react/releases
- GitHub Pages, workflow: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Настройка Node в Actions: https://github.com/actions/setup-node
- Метаданные Pages: https://github.com/actions/configure-pages
- Node test runner: https://nodejs.org/api/test.html
- Playwright, сервер для E2E: https://playwright.dev/docs/test-webserver
- Playwright, запуск тестов: https://playwright.dev/docs/running-tests

## Библиотеки заданий

- Redux Toolkit, quick start: https://redux-toolkit.js.org/tutorials/quick-start
- Redux Toolkit, createAsyncThunk: https://redux-toolkit.js.org/api/createAsyncThunk
- React Redux, hooks: https://react-redux.js.org/api/hooks
- JSONPlaceholder, руководство: https://jsonplaceholder.typicode.com/guide/
- Formik, useFormik: https://formik.org/docs/api/useFormik
- Yup, официальный README: https://github.com/jquense/yup
- React Hook Form, официальный README: https://github.com/react-hook-form/react-hook-form
- Material UI, установка: https://mui.com/material-ui/getting-started/installation/
- Material UI, TextField / slotProps: https://mui.com/material-ui/react-text-field/
- Material UI, Drawer: https://mui.com/material-ui/react-drawer/
- Material UI, Dialog: https://mui.com/material-ui/react-dialog/
- Material UI, тема: https://mui.com/material-ui/customization/theming/

Для RHF использованы официальный README и API актуальной ветки, а не старый пример `ref={register(...)}` из лекции. MUI подключён через Emotion и ThemeProvider. GitHub Pages выбран вместо примеров Vercel/Netlify из PDF согласно требованию к публикации этих проектов.

## Версии и воспроизводимость

Основа проектов: React/React DOM `^19.3.0`, Vite `^8.3.1`, `@vitejs/plugin-react` `^6.1.1`. Для предметных библиотек: RTK `^2.12.0`, React Redux `^9.3.0`, Formik `^2.4.9`, Yup `^1.7.1`, RHF `^7.89.0`, MUI и его иконки `^9.4.0`, Emotion `^11.14.0`. Playwright: `^1.63.0`.

Это не утверждение, что зависимости установлены или совместимость подтверждена запуском: итоговый `docs/CHECK_REPORT.md` отделяет выполненные проверки от ожидающих установки. После установки используйте lockfile; не обновляйте все зависимости на следующий major без проверки. Приведённые диапазоны не требуют перехода на prerelease.
