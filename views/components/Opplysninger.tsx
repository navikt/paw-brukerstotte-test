import type { Snapshot } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";
import type { FC } from "hono/jsx";
import { mapOpplysninger } from "@/opplysninger.ts";
import { CopyButton } from "./CopyButton.tsx";

type OpplysningerProps = {
  data: Snapshot;
};

const Opplysninger: FC<OpplysningerProps> = ({ data }) => {
  const { opplysning } = data;
  const jobbsituasjon = opplysning?.jobbsituasjon;

  if (!data || !opplysning) {
    return (
      <div class="card">
        <div class="header">
          <span class="status inactive">Ingen data</span>
          <span class="id">Opplysninger</span>
        </div>
      </div>
    );
  }

  const besvarelser = mapOpplysninger(opplysning);
  const jobbdetaljer = jobbsituasjon?.beskrivelser
    .filter((b) => b.detaljer)
    .map((b) => ({
      stilling: b.detaljer?.stilling ?? "—",
      styrk08: b.detaljer?.stilling_styrk08 ?? "—",
    })) ?? [];

  return (
    <>
      <div class="card">
        <div class="header">
          <span class="status active">Opplysninger</span>
          <span class="id">{opplysning.type}</span>
        </div>
        <div class="header">
          <div class="id">
            id:
          </div>
          <div class="id">
            <CopyButton
              copyString={opplysning.id}
              title={opplysning.id}
              ariaText="Kopier opplysnings-id"
            />
          </div>
        </div>
        <div
          data-island="opplysninger-accordion"
          data-island-props={JSON.stringify({ besvarelser, jobbdetaljer })}
        >
          {/* Fallback: vises før islands.js laster */}
          <div class="content">
            <dl>
              {besvarelser.map((item) => (
                <div
                  class="detail-row"
                  key={`${item.sporsmal}-${item.svar}`}
                >
                  <dt>
                    {item.sporsmal}
                  </dt>
                  <dd>
                    {item.svar}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {jobbdetaljer.length > 0 && (
            <div class="footer">
              <h4>Jobbdetaljer</h4>
              <ul class="footer-list">
                {jobbdetaljer.map((jd, index) => (
                  <li key={index}>
                    <span class="type">{jd.stilling}</span>
                    <span class="time">STYRK: {jd.styrk08}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Opplysninger };
