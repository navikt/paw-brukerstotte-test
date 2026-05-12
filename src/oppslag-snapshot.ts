import { Snapshot } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";
import { isProblemDetails } from "./types.ts";
import { getAzureM2MToken } from "./m2mToken.ts";

const isLocalhost = Deno.env.get("ENV") === "local";
const NAIS_CLUSTER_NAME = Deno.env.get("NAIS_CLUSTER_NAME");
const OPPSLAG_V2_URL = Deno.env.get("OPPSLAG_API_V2_URL");

export async function hentSnapshot(
  ident: string,
): Promise<Snapshot | null> {
  if (!ident) return null;
  if (isLocalhost) {
    const { default: snapshot } = await import("@/mock/snapshot.json", {
      with: { type: "json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 10));
    // @ts-expect-error - Give error on type e.g. "OPPLYSNINGER_V4" as string
    return snapshot;
  }

  if (!OPPSLAG_V2_URL) {
    throw new Error("OPPSLAG_V3_URL is not set");
  }
  const url = `${OPPSLAG_V2_URL}/api/v3/snapshot`;
  const scope =
    `api://${NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

  const token = await getAzureM2MToken(scope);
  if (!token) {
    throw new Error("Kunne ikke hente Azure M2M token for oppslag-api");
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
      const text = await response.text();
      if (text) {
        try {
          const error = JSON.parse(text);
          if (isProblemDetails(error)) {
            console.error(
              `Feil ved henting av hendelselslogg backup: ${error.status}:${error.title} - ${error.detail}`,
            );
            throw new Error(`${error.title}: ${error.detail}`);
          }
        } catch (_parseError) {
          console.error(
            `Kunne ikke parse feilrespons: ${text}`,
          );
        }
      }
      console.error(
        `Ukjent feil ved henting av hendelselslogg backup: ${response.status}`,
      );
      throw new Error(`Ukjent feil fra tjenesten (${response.status})`);
    }
    return response.json();
  } catch (e) {
    console.error(e, `Nettverksfeil mot ${OPPSLAG_V2_URL}`);
    throw e;
  }
}
