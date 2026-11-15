import type { SupabaseClient } from "@supabase/supabase-js";

// Local stand-in for the browser SDK: no websocket, token or remote URL.
function channel() {
  const instance = {
    on: () => instance,
    subscribe: (callback?: (status: string) => void) => {
      queueMicrotask(() => callback?.("SUBSCRIBED"));
      return instance;
    },
    unsubscribe: async () => "ok",
    track: async () => "ok",
    untrack: async () => "ok",
    send: async () => "ok",
    presenceState: () => ({}),
  };
  return instance;
}
const client = {
  channel,
  removeChannel: async () => "ok",
  removeAllChannels: async () => [],
  realtime: { setAuth: async () => {}, disconnect: () => {} },
  auth: {
    refreshSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
  },
} as unknown as SupabaseClient;
export function createClient() {
  return client;
}
export function resetRealtimeAuthentication() {}
export const __resetTokenDoRealtime = resetRealtimeAuthentication;
export async function prepareRealtimeAuthentication() {}
