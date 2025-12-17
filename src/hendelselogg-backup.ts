import { getOboToken } from "@/oboToken.ts";
import { ArbeidsoekerDetaljer, isProblemDetails } from "@/types.ts";

const isLocalhost = Deno.env.get("ENV") === "local";
const HENDELSELOGG_BACKUP_URL = Deno.env.get("HENDELSELOGG_BACKUP_URL");
// const NAIS_CLUSTER_NAME = Deno.env.get("NAIS_CLUSTER_NAME");
const NAIS_CLUSTER_NAME = "dev-gcp";

/**
 * @param ident er enten identitetsnummer for en person ELLER en periode-id
 */
export async function hentHendelselogggBackup(
  ident: string,
  headers: Request,
): Promise<ArbeidsoekerDetaljer> {
  console.log(`hentHendelselogggBackup for ident er i gang`);
  if (isLocalhost) {
    const { default: detaljer } = await import("../mock/detaljer.json", {
      with: { type: "json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return detaljer as ArbeidsoekerDetaljer;
  }

  const scope =
    `api://${NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-hendelselogg-backup/.default`;
  const token = getOboToken(headers, scope);
  if (!token) {
    throw new Error("Kunne ikke hente OBO token for Hendelselslogg backup");
  }

  if (!HENDELSELOGG_BACKUP_URL) {
    throw new Error("HENDELSELOGG_BACKUP_URL er ikke satt");
  }

  try {
    const response = await fetch(HENDELSELOGG_BACKUP_URL, {
      method: "POST",
      body: JSON.stringify({ identitetsnummer: ident }),
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
    console.error(e, `Nettverksfeil mot ${HENDELSELOGG_BACKUP_URL}`);
    throw e;
  }
}
