import { test, expect } from '@playwright/test';

// Smoke E2E: load → activity → advance month → menu → gallery → settings.
// KHÔNG chạy đủ 48 tháng. Chỉ verify shell chính hoạt động.

test.describe('smoke flow', () => {
  test('load home and advance through core shell', async ({ page }) => {
    // (1) Load / → verify title brand rendered.
    await page.goto('/');
    await expect(page.locator('.brand')).toContainText('Bốn Năm Thanh Xuân');

    // (2) Chọn activity đầu → verify dialogue xuất hiện.
    const firstActivity = page.locator('.activity-chip').first();
    await expect(firstActivity).toBeVisible();
    await firstActivity.click();
    await expect(page.locator('.dialogue')).toBeVisible();

    // (3) Advance month nếu possible (đã dùng hết AP sẽ hiện nút Sang mùa).
    // Đi hết AP bằng cách chọn activity thứ hai nếu có.
    const remainingActivity = page.locator('.activity-chip:not([disabled])').first();
    if (await remainingActivity.count() > 0) {
      await remainingActivity.click().catch(() => undefined);
    }
    const advanceBtn = page.locator('button.advance', { hasText: 'Sang mùa tiếp theo' });
    if (await advanceBtn.isEnabled()) {
      await advanceBtn.click();
      // Toast hoặc month transition xuất hiện.
      await expect(page.locator('.game-toast, .month-transition')).toBeVisible({ timeout: 5_000 });
    }

    // (4) ESC mở menu → verify menu dialog.
    await page.keyboard.press('Escape');
    await expect(page.locator('.game-menu[role="dialog"]')).toBeVisible();

    // (5) Mở gallery (nút "Bộ sưu tập") nếu có → verify lưới endings.
    const galleryBtn = page.locator('button', { hasText: 'Bộ sưu tập' });
    if (await galleryBtn.isVisible().catch(() => false)) {
      await galleryBtn.click();
      await expect(page.locator('.gallery')).toBeVisible();
      await expect(page.locator('.gallery-cell')).toHaveCount(14, { timeout: 5_000 });
    }

    // (6) Toggle settings → no crash. Đóng menu rồi mở lại nếu cần.
    const closeBtn = page.locator('.menu-close');
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    }
    // Mở menu lại, toggle sound (placeholder cho settings toggle).
    await page.keyboard.press('Escape');
    const soundBtn = page.locator('.game-menu button', { hasText: 'Âm thanh' });
    if (await soundBtn.isVisible().catch(() => false)) {
      await soundBtn.click();
      // Verify DOM stable sau toggle (không crash).
      await expect(page.locator('.game-menu')).toBeVisible();
    }
  });
});