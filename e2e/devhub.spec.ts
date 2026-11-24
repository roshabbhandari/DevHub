import { expect, test } from '@playwright/test'

test('homepage, search, route navigation, and JSON processing', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Good morning/ })).toBeVisible()
  await page.getByPlaceholder('Search tools...').fill('CSV')
  await expect(page.getByText('CSV / JSON Converter')).toBeVisible()
  await page.getByText('CSV / JSON Converter').click()
  await expect(page).toHaveURL(/\/tools\/csv-json$/)
  await page.goto('/tools/json-formatter')
  await page.getByLabel('JSON input').fill('{"ok":true}')
  await expect(page.locator('.output-panel pre')).toContainText('"ok": true')
})

test('favorites and theme persist after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Favorite JSON Formatter').click()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await page.reload()
  await expect(page.locator('html[data-theme="light"]')).toHaveCount(1)
  await page.getByRole('button', { name: 'Favorites' }).click()
  await expect(page.getByText('JSON Formatter')).toBeVisible()
})

test('new data tools process real input', async ({ page }) => {
  await page.goto('/tools/timestamp-converter')
  await page.getByLabel('Timestamp input').fill('0')
  await expect(page.locator('.output-panel pre')).toContainText('1970-01-01')
  await page.goto('/tools/yaml-validator')
  await expect(page.locator('.output-panel pre')).toContainText('"name": "DevHub"')
  await page.goto('/tools/color-converter')
  await expect(page.locator('.output-panel pre')).toContainText('"hex": "#67e8c0"')
})

test('mobile navigation opens and closes accessibly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open navigation' })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'Close navigation' }).click()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})
