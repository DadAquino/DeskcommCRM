import type { Env } from "../../lib/env";

// Only used by the visual build. No real credentials are read or bundled.
export const env = new Proxy(
  { NODE_ENV: "production" },
  {
    get(target, property) {
      return property === "NODE_ENV" ? target.NODE_ENV : "";
    },
  },
) as Env;
