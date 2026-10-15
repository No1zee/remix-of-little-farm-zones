import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "./run-id.server";
import { EVENT_INSTRUCTIONS } from "./event-facts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });
}

export async function handleEventChat(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return json(500, "The event helper isn't configured yet.");

  let body: { id?: unknown; messages?: unknown };
  try { body = await request.json(); } catch { return json(400, "Invalid request."); }
  const id = typeof body.id === "string" && UUID.test(body.id) ? body.id : null;
  if (!id || !Array.isArray(body.messages) || body.messages.length === 0) return json(400, "Invalid request.");
  // Keep the conversation bounded.
  const messages = (body.messages as UIMessage[]).slice(-30);
  const last = messages[messages.length - 1];
  const lastText = last?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "";
  if (last?.role !== "user" || !lastText.trim() || lastText.length > 1000) return json(400, "Please ask a shorter question.");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: EVENT_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: false,
    onError: (error) => {
      console.error("event chat error", error);
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === 429) return "Lots of families are asking right now — please try again in a moment.";
      if (status === 402) return "The event helper is temporarily unavailable. Please contact the team directly.";
      return "Sorry, something went wrong. Please try again or contact the team.";
    },
    onFinish: async ({ messages: all }) => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("event_chats")
        .upsert({ id, messages: all as never, updated_at: new Date().toISOString() });
      if (error) console.error("Failed to save event chat", error);
    },
  });
  return withLovableAiGatewayRunIdHeader(response, runIdFetch);
}
