import { expect, test } from '@playwright/test'

test('homepage, search, route navigation, and JSON processing', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Welcome to DevHub/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /All developer tools/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Small developer tasks/ })).toBeVisible()

  await page.getByPlaceholder('Search tools...').fill('CSV')
  await expect(page.getByText('CSV / JSON Converter')).toBeVisible()
  await page.getByText('CSV / JSON Converter').click()
  await expect(page).toHaveURL(/\/tools\/csv-json$/)
  await expect(page.getByRole('heading', { name: /Convert tabular CSV and JSON data/ })).toBeVisible()

  await page.goto('/tools/json-formatter')
  await page.getByLabel('JSON input').fill('{"ok":true}')
  await expect(page.locator('.output-panel pre')).toContainText('"ok": true')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /JSON/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dev-hub-nu-nine.vercel.app/tools/json-formatter')
})

test('public AdSense crawler files are included in the production output', async ({ request }) => {
  const adsTxt = await request.get('/ads.txt')
  expect(adsTxt.ok()).toBeTruthy()
  expect(await adsTxt.text()).toContain('google.com, pub-1030876896435364, DIRECT, f08c47fec0942fa0')

  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBeTruthy()
  expect(await robots.text()).toContain('https://dev-hub-nu-nine.vercel.app/sitemap.xml')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  const sitemapText = await sitemap.text()
  expect(sitemapText).toContain('https://dev-hub-nu-nine.vercel.app/tools/json-formatter')
  expect(sitemapText).toContain('https://dev-hub-nu-nine.vercel.app/tools/cron')
})

test('every developer tool page includes its own usage guide', async ({ page }) => {
  const paths = [
    '/tools/json-formatter', '/tools/base64', '/tools/regex-tester',
    '/tools/text-toolkit', '/tools/url-encoder', '/tools/uuid-generator',
    '/tools/hash-generator', '/tools/code-playground', '/tools/csv-json',
    '/tools/timestamp-converter', '/tools/yaml-validator', '/tools/color-converter',
    '/tools/xml-formatter', '/tools/markdown', '/tools/sql-formatter',
    '/tools/http-status', '/tools/cron',
  ]

  for (const path of paths) {
    await page.goto(path)
    await expect(page.locator('.tool-guide')).toBeVisible()
    await expect(page.locator('.tool-guide h2')).not.toBeEmpty()
  }
})

test('favorites and theme persist after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Favorite JSON Formatter').click()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await page.reload()
  await expect(page.locator('html[data-theme="light"]')).toHaveCount(1)
  await page.getByRole('button', { name: 'Favorites' }).click()
  await expect(page.getByText('JSON Formatter')).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow')
})

test('new data tools process real input', async ({ page }) => {
  await page.goto('/tools/timestamp-converter')
  await page.getByLabel('Timestamp input').fill('0')
  await expect(page.locator('.output-panel pre')).toContainText('1970-01-01')
  await page.goto('/tools/yaml-validator')
  await expect(page.locator('.output-panel pre')).toContainText('"name": "DevHub"')
  await page.goto('/tools/color-converter')
  await expect(page.locator('.output-panel pre')).toContainText('"hex": "#67e8c0"')
  await page.goto('/tools/http-status')
  await page.getByLabel('Search HTTP statuses').fill('Gateway Timeout')
  await expect(page.getByText('504')).toBeVisible()
})

test('Markdown preview is isolated from the application document', async ({ page }) => {
  await page.goto('/tools/markdown')
  const preview = page.getByTitle('Sandboxed Markdown preview')
  await expect(preview).toHaveAttribute('sandbox', '')
  await expect(preview).toBeVisible()
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
