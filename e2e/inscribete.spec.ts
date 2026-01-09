import { test, expect } from "@playwright/test"

test.describe("Inscribete", () => {
  test("visiting /inscribete", async ({ page }) => {
    await page.goto("/inscribete")

    await expect(page.getByTestId("tarjeta-electoral")).toBeVisible()
    await expect(page.getByTestId("juntas-de-inscripcion-permanentes")).toBeVisible()
    await expect(page.getByTestId("recordatorio")).toBeVisible()
    await expect(page.getByTestId("electoral-status")).toBeVisible()
  })
})
