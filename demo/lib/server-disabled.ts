import type * as Server from "../../lib/supabase/server";
import type * as Admin from "../../lib/supabase/admin";

// The demo never instantiates a database client, even when a shared component
// imports an original Server Action. The demo proxy also rejects action POSTs.
function disabled(): never {
  throw new Error("Esta demonstração visual não possui banco de dados ou integrações.");
}
export const createClient: typeof Server.createClient = disabled;
export const createAdminClient: typeof Admin.createAdminClient = disabled;
export const createClientDeEntradaComGoogle: typeof Server.createClientDeEntradaComGoogle =
  disabled;
