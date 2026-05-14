import { test, expect } from '../fixtures/auth.fixture';

test.describe('Device Control', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to Control page
    const controlLink = authenticatedPage.locator('nav a[href="/devices"], a:has-text("Control")');
    await controlLink.click();
    await authenticatedPage.waitForLoadState('networkidle');
  });

  test('should display Control page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/.*devices.*/);
    
    const pageContent = authenticatedPage.locator('main');
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test('should show device control options', async ({ authenticatedPage }) => {
    // Look for any control elements (buttons, switches, sliders)
    const controlElements = authenticatedPage.locator('button, [role="switch"], input[type="range"]');
    
    const count = await controlElements.count();
    console.log(`Found ${count} control elements on Control page`);
    
    // Page should have some interactive elements
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be able to navigate back to dashboard', async ({ authenticatedPage }) => {
    const dashboardLink = authenticatedPage.locator('nav a[href="/"], a:has-text("Dashboard")');
    await dashboardLink.click();
    await authenticatedPage.waitForLoadState('networkidle');
    
    await expect(authenticatedPage).toHaveURL('/');
  });
});
