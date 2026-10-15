import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/event-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleEventChat } = await import("@/lib/ai/event-chat.server");
        return handleEventChat(request);
      },
    },
  },
});
