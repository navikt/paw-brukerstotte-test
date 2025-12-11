import type { FC } from "hono/jsx";

const BaseLayout: FC<{
  title: string;
  children: unknown;
}> = ({
  title,
  children,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/static/stylesheet.css" />
        <script src="/static/app.js" defer></script>
      </head>
      <body style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
