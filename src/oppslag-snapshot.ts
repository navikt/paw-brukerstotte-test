import { Snapshot } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";
import { getOboToken } from "./oboToken.ts";
import { isProblemDetails } from "./types.ts";

const isLocalhost = Deno.env.get("ENV") === "local";
const HENDELSELOGG_BACKUP_URL = Deno.env.get("HENDELSELOGG_BACKUP_URL");
const NAIS_CLUSTER_NAME = Deno.env.get("NAIS_CLUSTER_NAME");
const OPPSLAG_V2_URL = Deno.env.get("OPPSLAG_API_V2_URL");

export async function hentSnapshot(
  ident: string,
  headers: Request,
): Promise<Snapshot | null> {
  if (!ident) return null;
  if (isLocalhost) {
    const { default: snapshot } = await import("@/mock/snapshot.json", {
      with: { type: "json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // @ts-expect-error - Give error on type e.g. "OPPLYSNINGER_V4" as string
    return snapshot;
  }

  if (!OPPSLAG_V2_URL) {
    throw new Error("OPPSLAG_V3_URL is not set");
  }
  const url = `${OPPSLAG_V2_URL}/api/v3/snapshot`;
  const scope =
    `api://${NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

  const token = await getOboToken(headers, scope);
  if (!token) {
    throw new Error("Kunne ikke hente OBO token for Hendelselslogg backup");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        type: "IDENTITETSNUMMER",
        identitetsnummer: ident,
      }),
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
        throw new Error(`${error.title}: ${error.detail}`);
      } else {
        console.error(
          `Ukjent feil ved henting av hendelselslogg backup: ${response.status}`,
        );
        throw new Error(`Ukjent feil fra tjenesten (${response.status})`);
      }
    }
    return response.json();
  } catch (e) {
    console.error(e, `Nettverksfeil mot ${HENDELSELOGG_BACKUP_URL}`);
    throw e;
  }
}
