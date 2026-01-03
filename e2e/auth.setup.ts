import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

/**
 * Authentication setup for E2E tests
 * This runs before other tests and saves authentication state
 */
setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('/login')

  // For E2E tests, we'll use test credentials
  // In a real scenario, you'd use environment variables
  const testEmail = process.env['E2E_TEST_EMAIL'] || 'test@example.com'
  const testPassword = process.env['E2E_TEST_PASSWORD'] || 'testpassword123'

  // Fill login form
  await page.getByLabel(/email/i).fill(testEmail)
  await page.getByLabel(/senha/i).fill(testPassword)

  // Submit
  await page.getByRole('button', { name: /entrar/i }).click()

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

  // Save authentication state
  await page.context().storageState({ path: authFile })
})

setup.describe.configure({ mode: 'serial' })
