import type { FC } from "hono/jsx";

const Header: FC = () => {
  return (
    <header>
      <h1>Arbeidssøkerregisteret - Brukerstøtte</h1>

      <form class="search-form" action="/search" method="post">
        <input type="search" name="q" placeholder="Søk..." aria-label="Søk" />
        <button type="submit">
          <span class="button-text">Søk</span>
          <span class="spinner" aria-hidden="true"></span>
        </button>
      </form>
    </header>
  );
};

export default Header;
