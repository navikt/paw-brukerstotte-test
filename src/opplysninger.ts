import {
  mapNusKodeTilUtdannignsnivaa,
  SporsmalId,
} from "@navikt/arbeidssokerregisteret-utils";
import type { OpplysningerHendelse } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";

function getSisteStillingSvar(opplysninger: OpplysningerHendelse) {
  return opplysninger.jobbsituasjon?.beskrivelser[0].detaljer?.stilling ||
    "Ikke oppgitt";
}

function getDinSituasjonSvar(opplysninger: OpplysningerHendelse) {
  return opplysninger.jobbsituasjon?.beskrivelser[0].beskrivelse ||
    "Ikke oppgitt";
}

export function mapOpplysninger(
  opplysninger: OpplysningerHendelse,
): { sporsmal: string; svar: string }[] {
  const result: { sporsmal: string; svar: string }[] = [];
  const addIfPresent = (
    sporsmalId: string,
    value: string | undefined | null,
  ) => {
    if (value) {
      result.push({ sporsmal: sporsmalId, svar: value });
    }
  };
  addIfPresent(SporsmalId.dinSituasjon, getDinSituasjonSvar(opplysninger));
  addIfPresent(SporsmalId.sisteStilling, getSisteStillingSvar(opplysninger));
  addIfPresent(
    SporsmalId.utdanning,
    mapNusKodeTilUtdannignsnivaa(opplysninger.utdanning?.nus || ""),
  );
  addIfPresent(SporsmalId.utdanningBestatt, opplysninger.utdanning?.bestaatt);
  addIfPresent(SporsmalId.utdanningGodkjent, opplysninger.utdanning?.godkjent);
  addIfPresent(
    SporsmalId.helseHinder,
    opplysninger.helse?.helsetilstandHindrerArbeid,
  );
  addIfPresent(
    SporsmalId.andreForhold,
    opplysninger.annet?.andreForholdHindrerArbeid,
  );

  return result;
}

export function formatDate(
  dateString: string | undefined,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "long",
  },
): string {
  return dateString
    ? new Intl.DateTimeFormat("nb", options).format(new Date(dateString))
    : "Ingen tidspunkt funnet";
}
