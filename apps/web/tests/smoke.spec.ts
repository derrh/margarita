import { expect, test } from "@playwright/test";

test("serves and hydrates the app in the Workers runtime", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("<h1>Margarita</h1>");
  await page.goto("/");
  await expect(page).toHaveTitle("Margarita");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Margarita");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("returns a 404 for an unknown route", async ({ request }) => {
  const response = await request.get("/does-not-exist");
  expect(response.status()).toBe(404);
});
