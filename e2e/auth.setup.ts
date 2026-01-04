import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

/**
 * Authentication setup for E2E tests
 * This runs before other tests and saves authentication state
 * Handles both new user registration and existing user login
 */
setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('/login')

  // Require test credentials from environment
  const testEmail = process.env['E2E_TEST_EMAIL']
  const testPassword = process.env['E2E_TEST_PASSWORD']

  if (!testEmail || !testPassword) {
    throw new Error(
      'E2E_TEST_EMAIL and E2E_TEST_PASSWORD environment variables are required. ' +
      'Please set these secrets before running E2E tests.'
    )
  }

  // Step 1: Fill email and click continue
  await page.getByLabel(/email/i).fill(testEmail)
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click()

  // Step 2: Wait for either password step (existing user) or create password step (new user)
  // Both have a password input, but with different labels
  const passwordInput = page.locator('input[type="password"], input[id="password"], input[id="new-password"]')
  await passwordInput.waitFor({ state: 'visible', timeout: 5000 })
  await passwordInput.fill(testPassword)

  // Step 3: Check which button is visible and click it
  const enterButton = page.getByRole('button', { name: 'ENTRAR', exact: true })
  const createButton = page.getByRole('button', { name: 'CRIAR CONTA', exact: true })

  // Try to click whichever button is visible and enabled
  if (await createButton.isVisible() && await createButton.isEnabled()) {
    await createButton.click()
  } else if (await enterButton.isVisible()) {
    await enterButton.click()
  } else {
    // Fallback: wait for either button to become available
    await expect(enterButton.or(createButton)).toBeVisible({ timeout: 5000 })
    if (await createButton.isVisible() && await createButton.isEnabled()) {
      await createButton.click()
    } else {
      await enterButton.click()
    }
  }

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })

  // Save authentication state
  await page.context().storageState({ path: authFile })
})

setup.describe.configure({ mode: 'serial' })
