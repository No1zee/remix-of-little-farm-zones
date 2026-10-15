import { createServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Loads a family's saved conversation. The random conversation id lives only in their browser.
export const getEventChat = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => {
    if (!UUID.test(input?.id ?? "")) throw new Error("Invalid conversation");
    return { id: input.id };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("event_chats").select("messages").eq("id", data.id).maybeSingle();
    if (error) { console.error(error); return { messages: [] as UIMessage[] }; }
    return { messages: ((row?.messages ?? []) as unknown as UIMessage[]) };
  });
