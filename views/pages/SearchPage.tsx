import type { FC } from "hono/jsx";
import BaseLayout from "@/views/layouts/BaseLayout.tsx";
import Header from "@/views/layouts/Header.tsx";
import { ArbeidsoekerCard } from "@/views/components/ArbeidsoekerCard.tsx";
import type { ArbeidsoekerDetaljer } from "@/types.ts";

const SearchPage: FC<
  { title: string; searchQuery?: string; detaljer?: ArbeidsoekerDetaljer }
> = ({ title, searchQuery, detaljer }) => {
  return (
    <BaseLayout title={title}>
      <Header />
      <main>
        {searchQuery
          ? <h2>Søkeresultater for "{searchQuery}":</h2>
          : <h2>Ingen søkeparametere er oppgitt</h2>}

        <div>
          {detaljer
            ? <ArbeidsoekerCard detaljer={detaljer} />
            : <p>Ingen data funnet</p>}
        </div>
      </main>
    </BaseLayout>
  );
};
export { SearchPage };
