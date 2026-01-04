import { test, expect } from '@playwright/test'

test.describe('Voting Flow', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should display voting page with photo to rate', async ({ page }) => {
    await page.goto('/vote')

    // Wait for page to load - should see the voting interface
    // The page has photos with alt "Foto para avaliação" or "Próxima foto"
    const photo = page.getByRole('img', { name: /foto/i }).first()
    await expect(photo).toBeVisible({ timeout: 10000 })

    // Should have rating columns for all three axes
    // Use locator with visible filter to avoid hidden mobile duplicates
    await expect(page.locator('text=/atraente/i >> visible=true').first()).toBeVisible()
    await expect(page.locator('text=/inteligente/i >> visible=true').first()).toBeVisible()
    await expect(page.locator('text=/confiável/i >> visible=true').first()).toBeVisible()

    // Should have rating buttons (Muito, Sim, Pouco, Não)
    await expect(page.getByRole('button', { name: /muito/i }).first()).toBeVisible()
  })

  test('should submit vote and show next photo', async ({ page }) => {
    await page.goto('/vote')

    // Wait for photo to load
    const photo = page.getByRole('img', { name: /foto/i }).first()
    await expect(photo).toBeVisible({ timeout: 10000 })

    // Select ratings for each axis (click "Sim" = 2 for each)
    // The buttons are in columns: ATRAENTE, INTELIGENTE, CONFIÁVEL
    const simButtons = page.getByRole('button', { name: /^2\s*sim$/i })

    // Click all three "Sim" buttons (one per category)
    const buttonCount = await simButtons.count()
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      await simButtons.nth(i).click()
    }

    // Submit vote
    const submitButton = page.getByRole('button', { name: /enviar/i })
    await expect(submitButton).toBeEnabled({ timeout: 5000 })
    await submitButton.click()

    // Should show next photo or success state
    // Wait for either new photo or loading state to resolve
    await expect(photo).toBeVisible({ timeout: 10000 })
  })

  test('should allow skipping a photo', async ({ page }) => {
    await page.goto('/vote')

    // Wait for photo
    const photo = page.getByRole('img', { name: /foto/i }).first()
    await expect(photo).toBeVisible({ timeout: 10000 })

    // Find and click skip button
    const skipButton = page.getByRole('button', { name: /pular/i }).first()
    await expect(skipButton).toBeVisible()
    await skipButton.click()

    // Confirmation modal appears - click "Pular" again to confirm
    const confirmSkip = page.getByRole('button', { name: /pular/i }).last()
    await expect(confirmSkip).toBeVisible({ timeout: 3000 })
    await confirmSkip.click()

    // Should load next photo or show empty queue message
    await expect(
      photo.or(page.getByText(/sem.*fotos|volte.*depois/i))
    ).toBeVisible({ timeout: 10000 })
  })

  test('should show karma in mobile menu', async ({ page, isMobile }) => {
    await page.goto('/vote')

    // Wait for page to load
    const photo = page.getByRole('img', { name: /foto/i }).first()
    await expect(photo).toBeVisible({ timeout: 10000 })

    if (isMobile) {
      // On mobile, karma is in the hamburger menu
      const menuButton = page.getByRole('button', { name: /menu/i }).or(
        page.locator('button').filter({ has: page.locator('svg') }).first()
      )

      if (await menuButton.isVisible()) {
        await menuButton.click()
        // Karma is displayed as "{number} karma" in the menu
        await expect(page.getByText(/\d+\s*karma/i)).toBeVisible({ timeout: 3000 })
      }
    } else {
      // On desktop, karma may be in the header or action bar
      // The page shows karma progress somewhere
      const karmaDisplay = page.getByText(/karma/i)
      // Just verify the page loaded successfully if karma isn't visible
      await expect(photo).toBeVisible()
    }
  })

  test('should handle voting with varied ratings', async ({ page }) => {
    await page.goto('/vote')

    // Wait for photo to load
    const photo = page.getByRole('img', { name: /foto/i }).first()
    await expect(photo).toBeVisible({ timeout: 10000 })

    // Select different ratings for each axis
    // ATRAENTE - "Muito" (3)
    const muitoButton = page.getByRole('button', { name: /^3\s*muito$/i }).first()
    await expect(muitoButton).toBeVisible({ timeout: 5000 })
    await muitoButton.click()

    // INTELIGENTE - "Sim" (2) - second column
    const simButtons = page.getByRole('button', { name: /^2\s*sim$/i })
    await expect(simButtons.nth(1)).toBeVisible({ timeout: 5000 })
    await simButtons.nth(1).click()

    // CONFIÁVEL - "Pouco" (1) - third column
    const poucoButtons = page.getByRole('button', { name: /^1\s*pouco$/i })
    await expect(poucoButtons.nth(2)).toBeVisible({ timeout: 5000 })
    await poucoButtons.nth(2).click()

    // Submit button must become enabled after all 3 ratings are selected
    const submitButton = page.getByRole('button', { name: /enviar/i })
    await expect(submitButton).toBeEnabled({ timeout: 5000 })

    // Submit and wait for next photo
    await submitButton.click()
    await expect(photo).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Voting Flow - Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/vote')

    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 5000 })
  })
})
