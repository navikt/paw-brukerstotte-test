import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { hentHendelselogggBackup } from "@/hendelselogg-backup.ts";
import { SearchPage } from "../views/pages/SearchPage.tsx";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(
    <SearchPage title="ARBS" />,
  );
});

app.post("/search", async (c) => {
  const body = await c.req.parseBody();
  const query = body.q as string;

  const headers = c.req.raw;
  const personDetaljer = await hentHendelselogggBackup(query, headers);

  // Later som det tar litt tid
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return c.html(
    <SearchPage
      title={`ARBS | Søk: ${query}`}
      searchQuery={query}
      rawData={personDetaljer}
    />,
  );
});

Deno.serve({ port: 8000 }, app.fetch);
