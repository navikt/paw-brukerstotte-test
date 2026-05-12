import { getOboToken } from "@/oboToken.ts";
import { ArbeidsoekerDetaljer, isProblemDetails } from "@/types.ts";

const isLocalhost = Deno.env.get("ENV") === "local";
const HENDELSELOGG_BACKUP_URL = Deno.env.get("HENDELSELOGG_BACKUP_URL");
const NAIS_CLUSTER_NAME = Deno.env.get("NAIS_CLUSTER_NAME");

/**
 * @param ident er enten identitetsnummer for en person ELLER en periode-id
 */
export async function hentHendelselogggBackup(
  ident: string,
  headers: Request,
): Promise<ArbeidsoekerDetaljer> {
  console.log(`hentHendelselogggBackup for ident er i gang`);
  if (isLocalhost) {
    const { default: detaljer } = await import("@/mock/detaljer.json", {
      with: { type: "json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 10));
    return detaljer as ArbeidsoekerDetaljer;
  }

  const scope =
    `api://${NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-hendelselogg-backup/.default`;
  const token = await getOboToken(headers, scope);
  if (!token) {
    throw new Error("Kunne ikke hente OBO token for Hendelselslogg backup");
  }

  if (!HENDELSELOGG_BACKUP_URL) {
    throw new Error("HENDELSELOGG_BACKUP_URL er ikke satt");
  }

  // Legg til timeout på 25 sekunder for å unngå at nginx gir 504 før vi får håndtert feilen selv
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(HENDELSELOGG_BACKUP_URL, {
      method: "POST",
      body: JSON.stringify({ identitetsnummer: ident }),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Sjekk for gateway timeout (504)
      if (response.status === 504) {
        throw new Error(
          "Tjenesten brukte for lang tid på å svare (504 Gateway Timeout). Prøv igjen senere.",
        );
      }

      const error = await response.json();
      if (isProblemDetails(error)) {
        console.error(
          `Feil ved henting av hendelselslogg backup: ${error.status}:${error.title} - ${error.detail}`,
        );
        throw new Error(`${error.title}: ${error.detail}`);
      } else {
        console.error(
          `Ukjent feil ved henting av hendelselslogg backup: ${response.status}`,
        );
        throw new Error(`Ukjent feil fra tjenesten (${response.status})`);
      }
    }

    return await response.json();
  } catch (e) {
    clearTimeout(timeoutId);

    // Håndter abort/timeout fra vår egen AbortController
    if (e instanceof DOMException && e.name === "AbortError") {
      console.error(`Timeout mot ${HENDELSELOGG_BACKUP_URL}`);
      throw new Error(
        "Forespørselen tok for lang tid. Tjenesten svarte ikke innen tidsfristen.",
      );
    }

    console.error(e, `Nettverksfeil mot ${HENDELSELOGG_BACKUP_URL}`);
    throw e;
  }
}
