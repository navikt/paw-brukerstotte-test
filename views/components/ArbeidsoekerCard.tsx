import type { FC } from "hono/jsx";
import type { ArbeidsoekerDetaljer } from "@/types.ts";

const ArbeidsoekerCard: FC<{ detaljer: ArbeidsoekerDetaljer }> = ({
  detaljer,
}) => {
  const { arbeidssoekerId, gjeldeneTilstand, historikk, kafkaPartition } =
    detaljer;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div class="card">
      <div class="header">
        <span
          class={`status ${gjeldeneTilstand.harAktivePeriode ? "active" : "inactive"
            }`}
        >
          {gjeldeneTilstand.harAktivePeriode ? "Aktiv" : "Inaktiv"}
        </span>
        <span class="id">Arbeidsøkerid: {arbeidssoekerId}</span>
      </div>

      <div class="content">
        <dl class="details">
          <div class="detail-row">
            <dt>Periode ID</dt>
            <dd>{gjeldeneTilstand.periodeId ?? "—"}</dd>
          </div>
          <div class="detail-row">
            <dt>Startet</dt>
            <dd>{formatDate(gjeldeneTilstand.startet)}</dd>
          </div>
          <div class="detail-row">
            <dt>Avsluttet</dt>
            <dd>{formatDate(gjeldeneTilstand?.avsluttet || null)}</dd>
          </div>
          <div class="detail-row">
            <dt>Kafka partition</dt>
            <dd>{kafkaPartition}</dd>
          </div>
        </dl>

        <div class="api-status">
          <h4>API-status</h4>
          <ul>
            <li>
              <span
                class={`indicator ${gjeldeneTilstand.apiKall.harOpplysning ? "ok" : "missing"
                  }`}
              />
              Har opplysning
            </li>
            <li>
              <span
                class={`indicator ${gjeldeneTilstand.apiKall.harProfilering ? "ok" : "missing"
                  }`}
              />
              Har profilering
            </li>
            <li>
              <span
                class={`indicator ${gjeldeneTilstand.harOpplysningerMottattHendelse
                    ? "ok"
                    : "missing"
                  }`}
              />
              Opplysninger mottatt
            </li>
          </ul>
        </div>
      </div>

      {historikk.length > 0 && (
        <div class="footer">
          <h4>Historikk ({historikk.length} hendelser)</h4>
          <ul class="footer-list">
            {historikk.slice(0, 5).map((h) => (
              <li key={h.hendelse.hendelseId}>
                <span class="type">{h.hendelse.hendelseType}</span>
                <span class="time">
                  {formatDate(h.hendelse.metadata.tidspunkt)}
                </span>
              </li>
            ))}
            {historikk.length > 5 && (
              <li class="more">
                + {historikk.length - 5} flere hendelser
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export { ArbeidsoekerCard };
