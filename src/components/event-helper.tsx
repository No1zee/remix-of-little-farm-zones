import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useServerFn } from '@tanstack/react-start';
import { RotateCcw } from 'lucide-react';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { getEventChat } from '@/lib/event-chat.functions';

const KEY = 'bambino-event-chat-id';
const suggestions = ['How much for 3 kids?', 'What’s included in lunch?', 'Is there something for my 1-year-old?', 'How do I pay?'];

function ChatWindow({ id, initial, onReset }: { id: string; initial: UIMessage[]; onReset: () => void }) {
  const [error, setError] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop } = useChat({
    id, messages: initial,
    transport: new DefaultChatTransport({ api: '/api/event-chat', body: { id } }),
    onError: (e) => setError(e.message?.startsWith('{') ? (JSON.parse(e.message).error ?? 'Something went wrong.') : (e.message || 'Something went wrong — please try again.')),
  });
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => { if (!busy) textRef.current?.focus({ preventScroll: true }); }, [busy]);
  const ask = (text: string) => { if (!text.trim() || busy) return; setError(''); sendMessage({ text }); };

  return <div className="helper-card">
    <div className="helper-head">
      <img src="/favicon.svg" alt="" width={44} height={44} />
      <div><h3>Ask Bambino</h3><p>Instant answers about tickets, times, the venue and activities.</p></div>
      {messages.length > 0 && <button type="button" className="helper-reset" onClick={onReset} aria-label="Start a new conversation"><RotateCcw /> New</button>}
    </div>
    <Conversation className="helper-log">
      <ConversationContent>
        {messages.length === 0 && <div className="helper-empty"><p>Hi! Ask me anything about Bambino Wonder Day.</p><div className="helper-chips">{suggestions.map(s => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div></div>}
        {messages.map(m => <Message key={m.id} from={m.role}><MessageContent className={m.role === 'user' ? 'helper-user' : 'helper-bot'}>
          {m.parts.map((p, i) => p.type === 'text' ? (m.role === 'user' ? <p key={i}>{p.text}</p> : <MessageResponse key={i}>{p.text}</MessageResponse>) : null)}
        </MessageContent></Message>)}
        {status === 'submitted' && <Message from="assistant"><MessageContent className="helper-bot"><Shimmer>Checking the event details…</Shimmer></MessageContent></Message>}
        {error && <p className="helper-error" role="alert">{error}</p>}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
    <PromptInput onSubmit={(msg) => ask(msg.text ?? '')}>
      <PromptInputTextarea ref={textRef} placeholder="e.g. Can I bring my own snacks?" maxLength={1000} />
      <PromptInputFooter className="justify-end">
        <PromptInputSubmit status={status} onStop={stop} />
      </PromptInputFooter>
    </PromptInput>
    <small className="helper-note">AI answers come from our event details. For anything else, call +263 710 489 896.</small>
  </div>;
}

export function EventHelper() {
  const load = useServerFn(getEventChat);
  const [state, setState] = useState<{ id: string; messages: UIMessage[] } | null>(null);
  useEffect(() => {
    let id = localStorage.getItem(KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    const cid = id;
    load({ data: { id: cid } }).then(r => setState({ id: cid, messages: JSON.parse(r.messagesJson) as UIMessage[] })).catch(() => setState({ id: cid, messages: [] }));
  }, [load]);
  const reset = () => { const id = crypto.randomUUID(); localStorage.setItem(KEY, id); setState({ id, messages: [] }); };
  if (!state) return <div className="helper-card"><Shimmer>Loading…</Shimmer></div>;
  return <ChatWindow key={state.id} id={state.id} initial={state.messages} onReset={reset} />;
}
