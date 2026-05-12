import type { FC } from "hono/jsx";
import BaseLayout from "@/views/layouts/BaseLayout.tsx";
import Header from "@/views/layouts/Header.tsx";
import { ArbeidsoekerCard } from "@/views/components/ArbeidsoekerCard.tsx";
import type { ArbeidsoekerDetaljer } from "@/types.ts";
import { Snapshot } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";
import { Opplysninger } from "../components/Opplysninger.tsx";
import { Historikk } from "../components/Historikk.tsx";

type SearchPageProps = {
  title: string;
  searchQuery?: string;
  detaljer?: ArbeidsoekerDetaljer;
  snapshot?: Snapshot | null;
};

const SearchPage: FC<
  SearchPageProps
> = ({ title, searchQuery, detaljer, snapshot }) => {
  return (
    <BaseLayout title={title}>
      <Header />
      <main>
        {searchQuery
          ? <h2>Søkeresultater for "{searchQuery}":</h2>
          : <h2>Ingen søkeparametere er oppgitt</h2>}

        <div class="card-grid">
          <div>
            {detaljer
              ? <ArbeidsoekerCard detaljer={detaljer} />
              : <p>Ingen data funnet</p>}
          </div>

          {snapshot && <Opplysninger data={snapshot} />}
        </div>
        <div>
          {detaljer && <Historikk detaljer={detaljer} />}
        </div>
      </main>
    </BaseLayout>
  );
};
export { SearchPage };
