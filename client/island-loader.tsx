import { createElement } from "react";
import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";

import { OpplysningerAccordion } from "./islands/OpplysningerAccordion.tsx";
import { HistorikkAccordion } from "./islands/HistorikkAccordion.tsx";

const islandRegistry: Record<string, ComponentType<Record<string, unknown>>> = {
  "opplysninger-accordion": OpplysningerAccordion as ComponentType<
    Record<string, unknown>
  >,
  "historikk-accordion": HistorikkAccordion as ComponentType<
    Record<string, unknown>
  >,
};

function mountIslands(): void {
  document.querySelectorAll("[data-island]").forEach((element) => {
    try {
      const islandName = element.getAttribute("data-island");
      const propsAttr = element.getAttribute("data-island-props");
      const props = propsAttr ? JSON.parse(propsAttr) : {};
      if (islandName && islandRegistry[islandName]) {
        createRoot(element).render(
          createElement(islandRegistry[islandName], props),
        );
      }
    } catch (e) {
      console.error("Island hydration failed for", element, e);
    }
  });
}

document.addEventListener("DOMContentLoaded", mountIslands);
