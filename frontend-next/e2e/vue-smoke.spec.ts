import { expect, test } from '@playwright/test';

test('Vue home and login form', async ({ page, request }) => {
  await page.goto('http://localhost:8010/#/');
  await expect(page.getByText('The Right Coach Is Everything.')).toBeVisible();

  const email = `vue-${Date.now()}@example.com`;
  await request.post('http://localhost:8010/createAccount', {
    data: {
      email,
      password: 'password123',
      isCoach: 0,
      surveyAnswers: [{ prompt: 'What is your name?', type: 'input', inputAnswer: 'Vue User', multiselectAnswer: '' }]
    }
  });

  await page.goto('http://localhost:8010/#/login');
  await page.locator('input[placeholder="Email"]').fill(email);
  await page.locator('input[placeholder="Password"]').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back to Bastion', { exact: false })).toBeVisible({ timeout: 10000 });
});
