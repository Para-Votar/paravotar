import { test, expect } from "@playwright/test"

test.describe("Sal a votar", () => {
  test("visiting /sal-a-votar", async ({ page }) => {
    await page.goto("/sal-a-votar")
    await expect(page.getByTestId("voto-ausente-y-adelantado")).toBeVisible()
  })
})
