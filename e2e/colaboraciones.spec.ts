import { test, expect } from "@playwright/test"

test.describe("Colaboraciones", () => {
  test("visiting /colaboraciones", async ({ page }) => {
    await page.goto("/colaboraciones")

    await expect(page.getByTestId("proyecto-85")).toBeVisible()
    await expect(page.getByTestId("quien-me-representa")).toBeVisible()
    await expect(page.getByTestId("tu-voto-no-se-deja")).toBeVisible()
    await expect(page.getByTestId("microjuris")).toBeVisible()
    await expect(page.getByTestId("practica-tu-voto")).toBeVisible()
  })
})
