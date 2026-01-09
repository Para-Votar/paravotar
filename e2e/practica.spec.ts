import { test, expect, Page } from "@playwright/test"
import {
  ballotsByPrecint,
  legislativeBallot,
  municipalBallot,
  stateBallot,
} from "./fixtures"

async function setupApiMocks(page: Page) {
  await page.route("**/*", async (route) => {
    const url = route.request().url()

    if (url.includes("ballots/ByPrecint")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotsByPrecint),
      })
    }

    if (url.includes("data.json") && url.includes("papeletas")) {
      let data
      if (url.includes("estatal")) data = stateBallot
      else if (url.includes("legislativa")) data = legislativeBallot
      else data = municipalBallot

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      })
    }

    return route.continue()
  })
}

async function navigateToBallot(
  page: Page,
  ballotType: "state-ballot" | "municipal-ballot" | "legislative-ballot"
) {
  await page.goto("/practica")
  await page.getByTestId("start-practice").click()

  // The precinct dropdown has a default selection (Adjuntas - 055),
  // so we just need to click confirm to proceed
  await page.getByTestId("confirm-precint").click()

  await page.getByTestId(ballotType).click()
}

test.describe("Practica", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test("visiting /practica", async ({ page }) => {
    await page.goto("/practica")
    await expect(page.getByTestId("practica-tu-voto")).toBeVisible()
  })

  test("root route renders practica page", async ({ page }) => {
    await page.goto("/")
    // "/" renders the Practica component directly (same as /practica)
    await expect(page.getByTestId("practica-tu-voto")).toBeVisible()
  })
})

test.describe("Practice - State Ballot", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test("should be able to emit a straight party vote on the state ballot", async ({
    page,
  }) => {
    await navigateToBallot(page, "state-ballot")
    await page.getByTestId("partido-nuevo-progresista").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      1
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      2
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to emit a mixed party vote on the state ballot", async ({
    page,
  }) => {
    await navigateToBallot(page, "state-ballot")
    await page.getByTestId("partido-popular--democrático").click()
    await page.getByTestId("luis-roberto-piñero").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      2
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      1
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to vote for candidates on the state ballot", async ({
    page,
  }) => {
    await navigateToBallot(page, "state-ballot")
    await page.getByTestId("eliezer-molina-pérez").click()
    await page.getByTestId("luis-roberto-piñero").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      2
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      0
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })
})

test.describe("Practice - Municipal Ballot", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test("should be able to emit a straight party vote", async ({ page }) => {
    await navigateToBallot(page, "municipal-ballot")
    await page.getByTestId("partido-independentista--puertorriqueño").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      1
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      10
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to emit a mixed party vote", async ({ page }) => {
    await navigateToBallot(page, "municipal-ballot")
    await page.getByTestId("partido-independentista--puertorriqueño").click()
    await page.getByTestId("elvin-gil-boneta").click()
    await page.getByTestId("arcelio-gonzález-vélez").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      3
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      8
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to emit a mixed party vote by choosing a different mayor", async ({
    page,
  }) => {
    await navigateToBallot(page, "municipal-ballot")
    await page.getByTestId("partido-independentista--puertorriqueño").click()
    await page.getByTestId("josé-hiram-soto--rivera").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      2
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      9
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to candidate vote", async ({ page }) => {
    await navigateToBallot(page, "municipal-ballot")
    await page.getByTestId("josé-hiram-soto--rivera").click()
    await page.getByTestId("elvin-gil-boneta").click()
    await page.getByTestId("arcelio-gonzález-vélez").click()
    await page.getByTestId("adalberto-lugo-boneta").click()
    await page.getByTestId("axel-medina-caraballo").click()
    await page.getByTestId("félix-colón-mercado").click()
    await page.getByTestId("guadalupe-rivera-oquendo").click()
    await page.getByTestId("carmen-cotty-pabón").click()
    await page.getByTestId("rafael-pérez-núñez").click()
    await page.getByTestId("jeniffer-arroyo-lópez").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      10
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      0
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })
})

test.describe("Practice - Legislative Ballot", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test("should be able to emit a straight party vote", async ({ page }) => {
    await navigateToBallot(page, "legislative-ballot")
    await page.getByTestId("partido-popular--democrático").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      1
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      5
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to emit a mixed party vote", async ({ page }) => {
    await navigateToBallot(page, "legislative-ballot")
    await page.getByTestId("partido-popular--democrático").click()
    await page.getByTestId("josé-(maché)-ortiz").click()
    // Use joanne-rodríguez-veve instead of josé-antonio-vargas-vidot
    // (Vargas Vidot is in the write-in column position so doesn't have a testId)
    await page.getByTestId("joanne-rodríguez-veve").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      3
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      3
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })

  test("should be able to vote for individual candidates", async ({ page }) => {
    await navigateToBallot(page, "legislative-ballot")
    await page.getByTestId("edia-quiñones").click()
    await page.getByTestId("josé-(maché)-ortiz").click()
    await page.getByTestId("daniel-(danny)-ortiz").click()
    await page.getByTestId("héctor-ferrer").click()
    // Use joanne-rodríguez-veve instead of josé-antonio-vargas-vidot
    // (Vargas Vidot is in the write-in column position so doesn't have a testId)
    await page.getByTestId("joanne-rodríguez-veve").click()

    await expect(page.locator('[data-vote-type="explicit-vote"]')).toHaveCount(
      5
    )
    await expect(page.locator('[data-vote-type="implicit-vote"]')).toHaveCount(
      0
    )

    await page.getByTestId("submit").click()
    await expect(page.getByTestId("voting-result")).toBeVisible()
  })
})
