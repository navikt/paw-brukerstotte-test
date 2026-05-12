import { Accordion } from "@navikt/ds-react/Accordion";

type HistorikkHendelse = {
  hendelseId: string;
  hendelseType: string;
  merged?: boolean;
  metadata: {
    tidspunkt: string;
    utfoertAv: { type: string };
    aarsak: string;
  };
  data: {
    identitetsnummer: string;
  };
  traceparent: string;
};

type HistorikkItem = {
  endret: boolean;
  hendelse: HistorikkHendelse;
};

type Props = {
  historikk: HistorikkItem[];
};

function HistorikkItemContent({ event }: { event: HistorikkItem }) {
  return (
    <span className={event.endret ? "" : "font-light"}>
      Utført av: {event.hendelse.metadata.utfoertAv.type}
      <span>{event.hendelse.metadata.tidspunkt}</span>
      <span>{event.hendelse.hendelseType}</span>
      {event.hendelse.hendelseType === "intern.v1.avsluttet" && (
        <span>{event.hendelse.metadata.aarsak}</span>
      )}
    </span>
  );
}

export function HistorikkAccordion({ historikk }: Props) {
  return (
    <Accordion>
      {historikk.map((event) => (
        <Accordion.Item key={event.hendelse.hendelseId}>
          <Accordion.Header>
            {event.hendelse.hendelseType} — {event.hendelse.metadata.tidspunkt}
          </Accordion.Header>
          <Accordion.Content>
            <HistorikkItemContent event={event} />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
