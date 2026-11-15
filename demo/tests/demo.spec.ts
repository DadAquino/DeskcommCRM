import { test, expect } from "@playwright/test";

const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

test("abre sem login, pesquisa os contatos e abre um formulário original", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/app/contacts");
  await expect(page.getByText("Ana Martins", { exact: true })).toBeVisible();
  await page.getByPlaceholder(/busc/i).last().fill("Bruno");
  await expect(page.getByText("Bruno Costa", { exact: true })).toBeVisible();
  await expect(page.getByText("Ana Martins", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Novo contato", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("Nome", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("abre o funil e a conversa com dados fictícios", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`/app/pipelines/${id(10)}`);
  await expect(page.getByText("Implantação do ERP", { exact: true })).toBeVisible();
  await page.goto(`/app/inbox?id=${id(300)}`);
  await expect(
    page.getByText("Olá! Gostaria de conhecer melhor a proposta.", { exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
  await expect(page.locator("main")).toContainText("Implantação do ERP");
  expect(errors).toEqual([]);
});

const screens = [
  ["/app/kanban", "Vendas"],
  ["/app/tasks", "Apresentar proposta comercial"],
  ["/app/team", "Mariana Silva"],
  ["/app/agenda", "Agenda"],
  ["/app/metrics", "Desempenho"],
  ["/app/settings", "Configurações"],
  ["/app/connections", "Conexões"],
  ["/app/settings/profile", "Perfil"],
  [`/app/contacts/${id(100)}`, "Ana Martins"],
  ["/app/painel", "Painel de atendimento"],
  ["/app/campaigns", "Campanhas"],
  ["/app/proposals", "Propostas"],
  ["/app/ai/agents", "Assistente comercial"],
  ["/app/products", "Licença empresarial"],
  ["/app/radar", "Radar de risco"],
  ["/app/companies", "Empresas"],
];
for (const [path, text] of screens) {
  test(`tela ${path} abre sem erros de JavaScript`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path!);
    await expect(page.locator("main")).toContainText(text!);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("nenhuma escrita ou Server Action chega ao backend", async ({ request }) => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    const response = await request.fetch("/api/v1/contacts", {
      method,
      data: { name: "Não salvar" },
    });
    expect(response.status()).toBe(403);
    expect((await response.json()).error.code).toBe("visual_demo");
  }
  const action = await request.post("/app/settings/profile", {
    headers: { "Next-Action": "qualquer-acao" },
    data: {},
  });
  expect(action.status()).toBe(403);
  const list = await request.get("/api/v1/contacts");
  expect((await list.json()).data).toHaveLength(8);
});

test("navegação móvel mantém acesso aos contatos", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/contacts");
  await expect(page.getByText("Ana Martins", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
