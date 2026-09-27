import { test, expect } from '@playwright/test';

test('create, edit, complete, reload and delete a task', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Новая задача', exact: true }).click();
  await page.getByLabel('Название задачи').fill('Проверка интерфейса');
  await page.getByRole('button', { name: 'Добавить задачу', exact: true }).click();
  const card = page.getByTestId('task-card').filter({ has: page.getByRole('heading', { name: 'Проверка интерфейса', exact: true }) });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Редактировать: Проверка интерфейса', exact: true }).click();
  await page.getByLabel('Название задачи').fill('Обновлённая проверка');
  await page.getByRole('button', { name: 'Сохранить изменения', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Выполнено: Обновлённая проверка', exact: true }).check();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Выполнено: Обновлённая проверка', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Удалить: Обновлённая проверка', exact: true }).click();
  await page.getByRole('button', { name: 'Подтвердить удаление' }).click();
  await expect(page.getByRole('heading', { name: 'Обновлённая проверка' })).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('invalid input and empty search are handled', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Новая задача', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить задачу', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('от 3 до 100');
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox', { name: 'Поиск задач' }).fill('несуществующая-задача-45678');
  await expect(page.getByText('Здесь пока ничего нет')).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await expect(page.getByTestId('task-card').first()).toBeVisible();
});
test('baseline works at a query URL without Redux Provider', async ({ page }) => {
  await page.goto('./?view=legacy');
  await expect(page.getByText('Исходная версия · useState + props')).toBeVisible();
  await page.getByRole('button', { name: 'Новая задача', exact: true }).click();
  await page.getByLabel('Название задачи').fill('Исходная задача');
  await page.getByRole('button', { name: 'Добавить задачу' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Исходная задача' })).toBeVisible();
});
