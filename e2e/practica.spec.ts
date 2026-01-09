import { test, expect, Page } from '@playwright/test';
import { ballotsByPrecint, stateBallot, municipalBallot, legislativeBallot } from './fixtures';

// Setup API mocking for all tests
async function setupApiMocks(page: Page) {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    
    // Mock the ballot by precint endpoint (AWS Lambda API)
    if (url.includes('ballots/ByPrecint')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ballotsByPrecint),
      });
    }
    
    // Mock the ballot data endpoints (CDN)
    if (url.includes('data.json') && url.includes('papeletas')) {
      let data;
      if (url.includes('estatal')) {
        data = stateBallot;
      } else if (url.includes('legislativa')) {
        data = legislativeBallot;
      } else {
        data = municipalBallot;
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    }
    
    // Continue with default handling for other requests
    return route.continue();
  });
}

test.describe('Practica - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('visiting /practica shows the practice page', async ({ page }) => {
    await page.goto('/practica');
    await expect(page.locator('#practica-tu-voto')).toBeVisible();
  });

  test('root route renders practica page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#practica-tu-voto')).toBeVisible();
  });

  test('can start practice and select precinct', async ({ page }) => {
    await page.goto('/practica');
    
    // Click start practice
    await page.getByTestId('start-practice').click();
    
    // Should show precinct selection
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  });

  test('can navigate to ballot selection after selecting precinct', async ({ page }) => {
    await page.goto('/practica');
    
    await page.getByTestId('start-practice').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    
    // Should show ballot type selection
    await expect(page.getByTestId('state-ballot')).toBeVisible();
    await expect(page.getByTestId('legislative-ballot')).toBeVisible();
    await expect(page.getByTestId('municipal-ballot')).toBeVisible();
  });
});

test.describe('Practica - State Ballot', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('can open state ballot', async ({ page }) => {
    await page.goto('/practica');
    
    await page.getByTestId('start-practice').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByTestId('state-ballot').click();
    
    // Should show the ballot with party headers
    await expect(page.getByText('PARTIDO NUEVO PROGRESISTA')).toBeVisible();
    await expect(page.getByText('PARTIDO POPULAR')).toBeVisible();
  });

  test('can vote for a party on state ballot', async ({ page }) => {
    await page.goto('/practica');
    
    await page.getByTestId('start-practice').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByTestId('state-ballot').click();
    
    // Click on party checkbox
    await page.getByTestId('partido-nuevo-progresista').click();
    
    // Should show explicit vote
    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(1);
  });
});

test.describe('Practica - Municipal Ballot', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('can open municipal ballot', async ({ page }) => {
    await page.goto('/practica');
    
    await page.getByTestId('start-practice').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByTestId('municipal-ballot').click();
    
    // Should show the ballot with party headers (using regex for flexible match)
    await expect(page.getByText(/PARTIDO NUEVO PROGRESISTA/i)).toBeVisible();
  });
});

test.describe('Practica - Legislative Ballot', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('can open legislative ballot', async ({ page }) => {
    await page.goto('/practica');
    
    await page.getByTestId('start-practice').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByTestId('legislative-ballot').click();
    
    // Should show the ballot with party headers
    await expect(page.getByText(/PARTIDO/i).first()).toBeVisible();
  });
});
