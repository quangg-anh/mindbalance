import { expect, test, type Page } from '@playwright/test';

const title = (page: Page) => page.getByRole('region', { name: 'Bốn Năm Thanh Xuân' });

async function finishDialogue(page: Page): Promise<void> {
  while (await page.locator('.conversation-actions .advance').isVisible()) {
    await page.locator('.conversation-actions .advance').click();
  }
}

async function resolvePending(page: Page): Promise<void> {
  await finishDialogue(page);
  const surpriseChoices = page.getByRole('group', { name: 'Lựa chọn tình huống bất ngờ' });
  if (await surpriseChoices.isVisible()) await surpriseChoices.getByRole('button').first().click();
  await finishDialogue(page);
  const eventChoices = page.getByRole('group', { name: 'Lựa chọn sự kiện' });
  if (await eventChoices.isVisible()) await eventChoices.getByRole('button').first().click();
}

async function spendSeason(page: Page): Promise<void> {
  for (let action = 0; action < 2; action += 1) {
    await resolvePending(page);
    const activity = page.getByRole('list', { name: 'Chọn hoạt động' }).getByRole('listitem').first();
    await expect(activity).toBeEnabled();
    await activity.click();
    await finishDialogue(page);
    await resolvePending(page);
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('bon-nam-settings', JSON.stringify({ fontScale: 'normal', dialogueSpeed: 'fast', reducedMotionOverride: true, skipRead: false }));
    Date.now = () => 1_700_000_000_000;
  });
});

test.describe('smoke lifecycle', () => {
  test('title, slot, activity, pending choices, advance, menu, gallery and settings', async ({ page }) => {
    await page.goto('/');
    await expect(title(page)).toBeVisible();
    await title(page).getByText('Slot 1', { exact: true }).locator('..').getByRole('button', { name: 'Mới' }).click();
    await expect(title(page)).toBeHidden();
    await spendSeason(page);
    await expect(page.locator('.ap strong')).toHaveText('0');
    await page.getByRole('button', { name: 'Sang mùa tiếp theo' }).click();
    await resolvePending(page);
    await expect(page.locator('.ap strong')).toHaveText('2');
    await page.keyboard.press('Escape');
    const menu = page.getByRole('dialog', { name: 'Bốn Năm Thanh Xuân' });
    await menu.getByRole('button', { name: /Bộ sưu tập kết thúc/ }).click();
    await expect(page.locator('.gallery-cell')).toHaveCount(14);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await menu.getByLabel('Cỡ chữ').selectOption('large');
    await menu.getByLabel('Giảm hiệu ứng').selectOption('on');
    await expect(page.locator('html')).toHaveClass(/reduced-motion/);
  });

  test('four slots create, load and delete independently', async ({ page }) => {
    await page.goto('/');
    for (const slot of [1, 2, 3, 4]) {
      const card = title(page).getByText(`Slot ${slot}`, { exact: true }).locator('..');
      await card.getByRole('button', { name: 'Mới' }).click();
      await page.getByRole('button', { name: 'Mở menu game' }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Về title' }).click();
      await expect(card).not.toContainText('Trống');
    }
    const slot4 = title(page).getByText('Slot 4', { exact: true }).locator('..');
    await slot4.getByRole('button', { name: 'Tiếp tục / Cloud' }).click();
    await expect(title(page)).toBeHidden();
    await page.getByRole('button', { name: 'Mở menu game' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Về title' }).click();
    page.once('dialog', (dialog) => dialog.accept());
    await slot4.getByRole('button', { name: 'Xóa' }).click();
    await expect(slot4).toContainText('Trống');
  });

  test('menu supports keyboard-only focus trap', async ({ page }) => {
    await page.goto('/');
    const create = title(page).getByText('Slot 1', { exact: true }).locator('..').getByRole('button', { name: 'Mới' });
    await create.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    const menu = page.getByRole('dialog', { name: 'Bốn Năm Thanh Xuân' });
    await expect(menu.getByRole('button', { name: 'Đóng menu' })).toBeFocused();
    await menu.locator('button, input, select').last().focus();
    await page.keyboard.press('Tab');
    await expect(menu.getByRole('button', { name: 'Đóng menu' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
  });
});

test('full 16-season journey reaches ending, timeline and title', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Full journey runs once');
  test.setTimeout(45_000);
  await page.goto('/');
  await title(page).getByText('Slot 1', { exact: true }).locator('..').getByRole('button', { name: 'Mới' }).click();
  for (let season = 1; season <= 16; season += 1) {
    await resolvePending(page);
    if (await page.locator('.ending-actions').isVisible()) break;
    await spendSeason(page);
    await page.getByRole('button', { name: 'Sang mùa tiếp theo' }).click();
    await resolvePending(page);
  }
  await expect(page.locator('.ending-actions')).toBeVisible();
  await page.getByRole('button', { name: 'Xem timeline hành trình' }).click();
  await expect(page.getByRole('heading', { name: 'Timeline hành trình' })).toBeVisible();
  await expect(page.locator('.journey-card li')).not.toHaveCount(0);
  await page.locator('.journey-card').getByRole('button', { name: 'Về title' }).click();
  await expect(title(page)).toBeVisible();
});

test('built PWA registers service worker, reports offline state and preserves reload state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Service worker check runs once');
  await page.goto('/');
  await page.waitForFunction(async () => Boolean(await navigator.serviceWorker?.ready));
  if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
    await page.reload();
  }
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.context().setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByRole('status')).toContainText('Đang ngoại tuyến');
  await page.context().setOffline(false);
  await page.reload();
  await expect(title(page)).toBeVisible();
});