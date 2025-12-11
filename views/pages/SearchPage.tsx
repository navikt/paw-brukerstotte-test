import type { FC } from "hono/jsx";
import BaseLayout from "../layouts/BaseLayout.tsx";
import Header from "../layouts/Header.tsx";

const SearchPage: FC<
  { title: string; searchQuery?: string; rawData?: string }
> = ({ title, searchQuery, rawData }) => {
  return (
    <BaseLayout title={title}>
      <Header />
      <main>
        {searchQuery
          ? <h2>Søkeresultater for "{searchQuery}":</h2>
          : <h2>Ingen søkeparametere er oppgitt</h2>}

        <div>
          <h3>
            data som ble hentet:
          </h3>
          <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </div>
      </main>
    </BaseLayout>
  );
};
export { SearchPage };
