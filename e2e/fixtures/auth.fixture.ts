import { test as base, Page, APIRequestContext } from '@playwright/test';
import { TEST_USER, ROUTES, SELECTORS } from '../helpers/constants';
import { loginViaApi } from '../helpers/api';

type AuthFixtures = {
  authenticatedPage: Page;
  apiContext: APIRequestContext;
  authToken: string;
};

export const test = base.extend<AuthFixtures>({
  authToken: async ({ request }, use) => {
    const token = await loginViaApi(request);
    await use(token);
  },

  apiContext: async ({ request }, use) => {
    await use(request);
  },

  authenticatedPage: async ({ page }, use) => {
    await page.goto(ROUTES.login);
    await page.waitForSelector(SELECTORS.emailInput, { timeout: 10000 });

    await page.fill(SELECTORS.emailInput, TEST_USER.email);
    await page.fill(SELECTORS.passwordInput, TEST_USER.password);
    await page.click(SELECTORS.loginButton);

    await page.waitForURL(ROUTES.dashboard, { timeout: 15000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
