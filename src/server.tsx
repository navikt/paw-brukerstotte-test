import { Hono } from "hono";
import { timeout } from "hono/timeout";
import { serveStatic } from "hono/deno";
import { hentHendelselogggBackup } from "@/hendelselogg-backup.ts";
import { SearchPage } from "@/views/pages/SearchPage.tsx";
import { Error } from "@/views/pages/Error.tsx";
import { hentSnapshot } from "./oppslag-snapshot.ts";

const app = new Hono();
console.log("Server konfigurert og starter...");

app.use("/static/*", serveStatic({ root: "./" }));
app.use("/search", timeout(30000));

// Health check
app.get("/isalive", (c) => c.json("alive"));
app.get("/isready", (c) => c.json("ready"));

app.get("/", (c) => {
  return c.html(
    <SearchPage title="Brukerstøtte" />,
  );
});

app.post("/search", async (c) => {
  const body = await c.req.parseBody();
  const query = body.q as string;

  const headers = c.req.raw;
  console.log(`Mottatt søk for ident. Kaller hendelseloggbakup.`);
  const personDetaljer = await hentHendelselogggBackup(query, headers);
  const identnummerFraDetaljer = personDetaljer?.historikk[0]?.hendelse.data
    .identitetsnummer;
  const snapshot = await hentSnapshot(identnummerFraDetaljer, headers);

  return c.html(
    <SearchPage
      title={`Brukerstøtte | Søk: ${query}`}
      searchQuery={query}
      detaljer={personDetaljer}
      snapshot={snapshot}
    />,
  );
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.html(<Error message={err.message} />, 500);
});

Deno.serve({ port: 8000 }, app.fetch);
