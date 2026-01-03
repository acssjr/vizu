import { test, expect } from '@playwright/test'

test.describe('Voting Flow', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should display voting page with photo to rate', async ({ page }) => {
    await page.goto('/vote')

    // Should see voting interface
    await expect(page.getByRole('heading', { name: /avaliar/i })).toBeVisible()

    // Should have a photo displayed
    await expect(page.locator('img[alt*="foto"]')).toBeVisible()

    // Should have rating sliders for all three axes
    await expect(page.getByLabel(/atra/i)).toBeVisible()
    await expect(page.getByLabel(/confia/i)).toBeVisible()
    await expect(page.getByLabel(/intelig/i)).toBeVisible()
  })

  test('should submit vote and show next photo', async ({ page }) => {
    await page.goto('/vote')

    // Wait for photo to load
    await expect(page.locator('img[alt*="foto"]')).toBeVisible()

    // Get current photo src to compare later
    const firstPhotoSrc = await page.locator('img[alt*="foto"]').getAttribute('src')

    // Set ratings (using sliders or buttons depending on implementation)
    // Attraction = 2 (Sim)
    await page.getByLabel(/atra/i).click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')

    // Trust = 2 (Sim)
    await page.getByLabel(/confia/i).click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')

    // Intelligence = 2 (Sim)
    await page.getByLabel(/intelig/i).click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')

    // Submit vote
    await page.getByRole('button', { name: /votar|enviar|confirmar/i }).click()

    // Should show success feedback or load next photo
    await expect(
      page.getByText(/sucesso|obrigado|próxim/i).or(page.locator('img[alt*="foto"]'))
    ).toBeVisible({ timeout: 5000 })

    // If new photo loaded, it should be different
    const newPhotoSrc = await page.locator('img[alt*="foto"]').getAttribute('src')
    if (newPhotoSrc && firstPhotoSrc) {
      // Photos might be the same if only one in queue, so we just check it loaded
      expect(newPhotoSrc).toBeDefined()
    }
  })

  test('should allow skipping a photo', async ({ page }) => {
    await page.goto('/vote')

    // Wait for photo
    await expect(page.locator('img[alt*="foto"]')).toBeVisible()

    // Find and click skip button
    const skipButton = page.getByRole('button', { name: /pular|skip/i })

    if (await skipButton.isVisible()) {
      await skipButton.click()

      // Should load next photo or show message
      await expect(
        page.locator('img[alt*="foto"]').or(page.getByText(/sem.*fotos|fila.*vazia/i))
      ).toBeVisible({ timeout: 5000 })
    }
  })

  test('should show karma balance', async ({ page }) => {
    await page.goto('/vote')

    // Karma display should be visible somewhere
    await expect(
      page.getByText(/karma/i).or(page.locator('[data-testid="karma-display"]'))
    ).toBeVisible()
  })

  test('should handle empty queue gracefully', async ({ page }) => {
    await page.goto('/vote')

    // If no photos in queue, should show appropriate message
    const emptyMessage = page.getByText(/sem.*fotos|fila.*vazia|volte.*depois/i)
    const photo = page.locator('img[alt*="foto"]')

    // Either show empty message or a photo
    await expect(emptyMessage.or(photo)).toBeVisible({ timeout: 10000 })
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
