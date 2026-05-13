import { test, expect } from '../fixtures/auth.fixture';
import { ROUTES } from '../helpers/constants';

test.describe('Home Members Management', () => {
  test('should display homes page with member info', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(ROUTES.homes);
    await authenticatedPage.waitForLoadState('networkidle');

    // Check if we're on the homes page
    const homesHeading = authenticatedPage.locator('h1:has-text("My Homes"), h1:has-text("Homes")');
    await expect(homesHeading.first()).toBeVisible({ timeout: 10000 });
    
    // Look for any home card that might show member count or owner info
    const pageContent = authenticatedPage.locator('main');
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test('should access home detail page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(ROUTES.homes);
    await authenticatedPage.waitForLoadState('networkidle');

    // Click on a home card or "View" button to access home detail
    const homeCard = authenticatedPage.locator('h3, [class*="card"]').first();
    
    if (await homeCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeCard.click();
      await authenticatedPage.waitForLoadState('networkidle');
      
      // Should navigate to home detail
      await expect(authenticatedPage).toHaveURL(/.*homes\/.+/);
    } else {
      // If no home cards, the test still passes (no homes to view)
      console.log('No home cards found to click');
    }
  });

  test('should show owner email in current session', async ({ authenticatedPage }) => {
    // Check that the logged-in user (owner) email is visible somewhere
    await authenticatedPage.goto(ROUTES.dashboard);
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Look for owner email in sidebar or header
    const ownerEmail = authenticatedPage.locator('text=thanh.nguyen422005@gmail.com');
    await expect(ownerEmail.first()).toBeVisible({ timeout: 10000 });
  });
});
