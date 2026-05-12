import { Accordion } from "@navikt/ds-react/Accordion";

type Besvarelse = {
  sporsmal: string;
  svar: string;
};

type Jobbdetalj = {
  stilling: string;
  styrk08: string;
};

type Props = {
  besvarelser: Besvarelse[];
  jobbdetaljer: Jobbdetalj[];
};

export function OpplysningerAccordion({ besvarelser, jobbdetaljer }: Props) {
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Besvarelser ({besvarelser.length})</Accordion.Header>
        <Accordion.Content>
          <dl>
            {besvarelser.map((item) => (
              <div className="detail-row" key={`${item.sporsmal}-${item.svar}`}>
                <dt>{item.sporsmal}</dt>
                <dd>{item.svar}</dd>
              </div>
            ))}
          </dl>
        </Accordion.Content>
      </Accordion.Item>
      {jobbdetaljer.length > 0 && (
        <Accordion.Item>
          <Accordion.Header>
            Jobbdetaljer ({jobbdetaljer.length})
          </Accordion.Header>
          <Accordion.Content>
            <ul className="footer-list">
              {jobbdetaljer.map((jd, index) => (
                <li key={index}>
                  <span className="type">{jd.stilling}</span>
                  <span className="time">STYRK: {jd.styrk08}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      )}
    </Accordion>
  );
}
