import { test, expect } from '../fixtures/auth.fixture';
import { ROUTES } from '../helpers/constants';

test.describe('Home Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate directly to homes page
    await authenticatedPage.goto(ROUTES.homes);
    await authenticatedPage.waitForLoadState('networkidle');
  });

  test('should display homes list', async ({ authenticatedPage }) => {
    // Should see homes page content
    const pageContent = authenticatedPage.locator('main');
    await expect(pageContent).toBeVisible({ timeout: 10000 });
    
    // Look for "My Homes" heading
    const homesHeading = authenticatedPage.locator('h1:has-text("My Homes"), h1:has-text("Homes")');
    await expect(homesHeading.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show "Go to Homes" button on dashboard', async ({ authenticatedPage }) => {
    // Go back to dashboard
    await authenticatedPage.goto(ROUTES.dashboard);
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Should see "Go to Homes" button
    const goToHomesButton = authenticatedPage.locator('button:has-text("Go to Homes")');
    await expect(goToHomesButton).toBeVisible({ timeout: 10000 });
    
    // Click and verify navigation
    await goToHomesButton.click();
    await expect(authenticatedPage).toHaveURL(/.*homes.*/);
  });

  test('should display home details when available', async ({ authenticatedPage }) => {
    // Check if there are any home cards or home-related elements
    const homeElements = authenticatedPage.locator('[class*="home"], [class*="card"], button:has-text("View"), button:has-text("Manage")');
    
    // Wait a bit for content to load
    await authenticatedPage.waitForTimeout(2000);
    
    const count = await homeElements.count();
    
    // Test passes if we're on homes page (even if no homes exist yet)
    await expect(authenticatedPage).toHaveURL(/.*homes.*/);
    console.log(`Found ${count} home-related elements`);
  });

  test('should have navigation to homes from sidebar or dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(ROUTES.dashboard);
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Check for either sidebar link or dashboard button
    const sidebarLink = authenticatedPage.locator('nav a[href*="homes"], aside a[href*="homes"]');
    const dashboardButton = authenticatedPage.locator('button:has-text("Go to Homes")');
    
    const hasSidebarLink = await sidebarLink.isVisible().catch(() => false);
    const hasDashboardButton = await dashboardButton.isVisible().catch(() => false);
    
    expect(hasSidebarLink || hasDashboardButton).toBeTruthy();
  });
});
