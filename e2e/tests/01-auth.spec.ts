import { test, expect } from '@playwright/test';
import { TEST_USER, ROUTES, SELECTORS } from '../helpers/constants';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.login);
    await page.waitForSelector(SELECTORS.emailInput, { timeout: 10000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill(SELECTORS.emailInput, TEST_USER.email);
    await page.fill(SELECTORS.passwordInput, TEST_USER.password);
    await page.click(SELECTORS.loginButton);

    await expect(page).toHaveURL(ROUTES.dashboard, { timeout: 15000 });
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.fill(SELECTORS.emailInput, 'nonexistent@invalid.com');
    await page.fill(SELECTORS.passwordInput, TEST_USER.password);
    await page.click(SELECTORS.loginButton);

    // Wait for login attempt to complete (either error shown or redirect)
    await page.waitForTimeout(3000);
    
    // Should either show error or stay on auth page (not redirect to dashboard)
    const errorVisible = await page.locator(SELECTORS.errorMessage).isVisible().catch(() => false);
    const onAuthPage = page.url().includes('auth');
    
    expect(errorVisible || onAuthPage).toBeTruthy();
  });

  test('should show error for invalid password', async ({ page }) => {
    await page.fill(SELECTORS.emailInput, TEST_USER.email);
    await page.fill(SELECTORS.passwordInput, 'wrongpassword123');
    await page.click(SELECTORS.loginButton);

    // Wait for login attempt to complete (either error shown or redirect)
    await page.waitForTimeout(3000);
    
    // Should either show error or stay on auth page (not redirect to dashboard)
    const errorVisible = await page.locator(SELECTORS.errorMessage).isVisible().catch(() => false);
    const onAuthPage = page.url().includes('auth');
    
    expect(errorVisible || onAuthPage).toBeTruthy();
  });

  test('should validate empty email field', async ({ page }) => {
    await page.click(SELECTORS.loginButton);

    await expect(page.locator(SELECTORS.errorMessage)).toBeVisible({ timeout: 5000 });
  });

  test('should validate short password', async ({ page }) => {
    await page.fill(SELECTORS.emailInput, TEST_USER.email);
    await page.fill(SELECTORS.passwordInput, '12345');
    await page.click(SELECTORS.loginButton);

    await expect(page.locator(SELECTORS.errorMessage)).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    await page.fill(SELECTORS.emailInput, TEST_USER.email);
    await page.fill(SELECTORS.passwordInput, TEST_USER.password);
    await page.click(SELECTORS.loginButton);

    await expect(page).toHaveURL(ROUTES.dashboard, { timeout: 15000 });

    // Click on user menu button in sidebar to expand it
    const userMenuButton = page.locator('aside button:has(.rounded-full)').first();
    await userMenuButton.click();
    
    // Wait for menu to open and click Logout
    const logoutButton = page.locator('aside button:has-text("Logout")');
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();

    await expect(page).toHaveURL(/.*auth.*/, { timeout: 10000 });
  });
});
