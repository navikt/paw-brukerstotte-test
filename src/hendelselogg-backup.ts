import { getOboToken } from "@/oboToken.ts";
import { ArbeidsoekerDetaljer, isProblemDetails } from "@/types.ts";

const isLocalhost = Deno.env.get("ENV") === "local";
const URL_HENDELSESLOGG_BACKUP = "mock-url";
const SCOPE_HENDELSESLOGG_BACKUP = "mock-scope";

/**
 * @param ident er enten identitetsnummer for en person ELLER en periode-id
 */
export async function hentHendelselogggBackup(
  ident: string,
  headers: Request,
): Promise<ArbeidsoekerDetaljer> {
  if (isLocalhost) {
    const { default: detaljer } = await import("../mock/detaljer.json", {
      with: { type: "json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return detaljer as ArbeidsoekerDetaljer;
  }

  const token = getOboToken(headers, SCOPE_HENDELSESLOGG_BACKUP);
  if (!token) {
    throw new Error("Kunne ikke hente OBO token for Hendelselslogg backup");
  }

  try {
    const response = await fetch(URL_HENDELSESLOGG_BACKUP, {
      method: "POST",
      // TODO: Bytte ut 'ident' med korrekt payload
      body: JSON.stringify({ ident }),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      if (isProblemDetails(error)) {
        console.error(
          `Feil ved henting av hendelselslogg backup: ${error.status}:${error.title} - ${error.detail}`,
        );
      } else {
        console.error(
          `Ukjent feil ved henting av hendelselslogg backup: ${response.status}`,
        );
      }
    }

    return await response.json();
  } catch (e) {
    console.error(e, `Nettverksfeil mot ${URL_HENDELSESLOGG_BACKUP}`);
    throw e;
  }
}
