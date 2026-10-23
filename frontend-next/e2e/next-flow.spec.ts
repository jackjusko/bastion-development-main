import { expect, test } from '@playwright/test';

test('Next login reaches dashboard and offers', async ({ page, request }) => {
  const email = `next-${Date.now()}@example.com`;
  await request.post('http://localhost:8010/createAccount', {
    data: {
      email,
      password: 'password123',
      isCoach: 0,
      surveyAnswers: [{ prompt: 'What is your name?', type: 'input', inputAnswer: 'Next User', multiselectAnswer: '' }]
    }
  });

  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByTestId('client-dashboard')).toBeVisible({ timeout: 15000 });

  await page.goto('http://localhost:3000/offers');
  await expect(page.getByTestId('offers-page')).toBeVisible();
  await expect(page.getByText('You\'ve received offers from')).toBeVisible();
});
