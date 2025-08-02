import { el } from "@webtaku/el";
import { View } from "./view";

export function createGaiaNameIntroView(): View {
  const view = el("ion-app",
    el("ion-header",
      el("ion-toolbar",
        el("ion-title", { style: "text-align: center;" }, "Gaia Names")
      )
    ),
    el("ion-content",
      el(".intro-view",
        el("section.name-search-form-container"), // SearchForm이 나중에 mount됨

        el("section.intro",
          el("h2", "Your Exclusive Identity in Gaia Protocol"),
          el("p",
            "Gaia Names is a unique feature designed exclusively for God Mode holders, providing a personalized identity within Gaia Protocol ecosystem."
          ),

          el("h3", "What is Gaia Name?"),
          el("p",
            "Gaia Name is a distinct and non-duplicable .gaia identifier available only to users who meet the following criteria:"
          ),
          el("ul",
            el("li",
              "Hold at least one ",
              el("a", { href: "https://thegods.gaia.cc/", target: "_blank" }, "Gods NFT"),
              " or"
            ),
            el("li",
              "Possess 10,000 or more ",
              el("a", { href: "https://token.gaia.cc/", target: "_blank" }, "$GAIA"),
              " tokens"
            )
          ),

          el("p",
            "This exclusive naming system allows God Mode holders to establish a recognizable presence across all Gaia Protocol services."
          ),

          el("h3", "Why Secure Your Gaia Name?"),
          el("ul",
            el("li", "Uniqueness - Each Gaia Name is exclusive and cannot be replicated."),
            el("li", "Integration - Seamlessly use your Gaia Name across all Gaia Protocol services."),
            el("li", "Prestige - Reflect your status as a God Mode holder within the ecosystem.")
          ),

          el("p",
            "Take ownership of your Gaia Name and solidify your identity within Gaia Protocol today."
          )
        ),

        el(".credit",
          "Created by ",
          el("a", { href: "https://gaiaprotocol.com", target: "_blank" }, "Gaia Protocol")
        )
      )
    )
  );

  return {
    el: view,
    remove: () => view.remove(),
  };
}
