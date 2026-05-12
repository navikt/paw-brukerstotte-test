import type { ArbeidsoekerDetaljer } from "@/types.ts";

type HistorikkProps = {
  detaljer: ArbeidsoekerDetaljer;
};

function Historikk({ detaljer }: HistorikkProps) {
  const historikkProps = JSON.stringify({
    historikk: detaljer.historikk.map((h) => ({
      endret: h.endret,
      hendelse: h.hendelse,
    })),
  });

  return (
    <div class="card">
      <div class="header">
        <h2>Historikk</h2>
      </div>
      <div
        data-island="historikk-accordion"
        data-island-props={historikkProps}
      >
        {/* Fallback: vises før islands.js laster */}
        <ul>
          {detaljer.historikk.map((event) => (
            <li key={event.hendelse.hendelseId}>
              {event.hendelse.hendelseType} —{" "}
              {event.hendelse.metadata.tidspunkt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { Historikk };
