import { useState } from 'react';
import { z } from 'zod';
import { Check, Minus, Plus, Ticket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const ticketPrices = [
  { id: 'early_bird', label: 'Early Bird', price: 25, note: 'Limited tickets — book early!' },
  { id: 'standard', label: 'Standard', price: 30, note: 'Online, before the day' },
  { id: 'gate', label: 'At the Gate', price: 35, note: 'Pay on arrival' },
] as const;
// Sibling add-ons follow the flyer's totals: 2 kids $45, 3 kids $60, 4 kids $70 (early bird base).
const siblingAddOns = [20, 15, 10];
export const includes = ['Lunch & juice', 'Popcorn pack', 'Unlimited candyfloss', 'Unlimited waffles', 'Face painting', 'Clown & live entertainment', 'Inflatables & outdoor games', 'Creative activities & workshops', 'Discovery experiences', 'Bambino Explorer Passport', 'Prizes & giveaways'];

export function estimateTotal(base: number, children: number) {
  let total = base;
  for (let i = 1; i < children; i++) total += siblingAddOns[Math.min(i - 1, siblingAddOns.length - 1)] ?? 0;
  return total;
}

const schema = z.object({
  parent_name: z.string().trim().min(2, 'Please enter your name').max(100),
  phone: z.string().trim().min(6, 'Please enter a phone number').max(30).regex(/^[+\d\s()-]+$/, 'Numbers only, please'),
  email: z.string().trim().max(255).email('Check your email address').or(z.literal('')),
  notes: z.string().trim().max(500),
});

function Counter({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return <div className="counter"><span>{label}</span><div><Button type="button" variant="outline" size="icon" aria-label={`Fewer ${label}`} onClick={() => set(Math.max(min, value - 1))}><Minus /></Button><strong aria-live="polite">{value}</strong><Button type="button" variant="outline" size="icon" aria-label={`More ${label}`} onClick={() => set(Math.min(max, value + 1))}><Plus /></Button></div></div>;
}

export function BookingForm() {
  const [type, setType] = useState<'early_bird' | 'standard'>('early_bird');
  const [children, setChildren] = useState(1);
  const [underTwos, setUnderTwos] = useState(0);
  const [form, setForm] = useState({ parent_name: '', phone: '', email: '', notes: '' });
  const [error, setError] = useState('');
  const [pay, setPay] = useState<'ecocash' | 'pay_later'>('ecocash');
  const [eco, setEco] = useState({ ref: '', from: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const base = ticketPrices.find(t => t.id === type)!.price;
  const total = estimateTotal(base, children);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    const parsed = schema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    if (pay === 'ecocash' && eco.ref.trim().length < 4) { setError('Please enter the EcoCash transaction reference from your confirmation SMS.'); return; }
    setStatus('sending');
    const { error: dbError } = await supabase.from('ticket_bookings').insert({
      event_date: '2026-12-05', ticket_type: type, children, under_twos: underTwos, estimated_total: total,
      parent_name: parsed.data.parent_name, phone: parsed.data.phone, email: parsed.data.email || null, notes: parsed.data.notes || null,
      payment_method: pay, ecocash_reference: pay === 'ecocash' ? eco.ref.trim().slice(0, 60) : null, ecocash_payer_number: pay === 'ecocash' ? (eco.from.trim().slice(0, 30) || null) : null,
    });
    if (dbError) { setStatus('idle'); setError('Something went wrong sending your booking. Please try again or call us.'); return; }
    setStatus('done');
  }

  if (status === 'done') return <div className="booking-card booking-done"><Check /><h3>You’re on the list!</h3><p>We’ve received your booking for Bambino Wonder Day — {children} {children === 1 ? 'child' : 'children'}{underTwos ? ` + ${underTwos} under 2` : ''}, estimated ${total}. {pay === 'ecocash' ? `We’ll check your EcoCash payment (ref ${eco.ref.trim()}) and confirm on ${form.phone}.` : `We’ll contact you on ${form.phone} to confirm and arrange payment.`}</p></div>;

  return <form className="booking-card" onSubmit={submit} noValidate>
    <h3><Ticket /> Book your tickets</h3>
    <p className="booking-event">Bambino Wonder Day · Saturday 5 December 2026 · 10:00 am – 5:00 pm</p>
    <fieldset className="ticket-choice"><legend>Ticket type</legend>{ticketPrices.filter(t => t.id !== 'gate').map(t => <label key={t.id} data-active={type === t.id}><input type="radio" name="type" checked={type === t.id} onChange={() => setType(t.id as typeof type)} /><span>{t.label}</span><strong>${t.price}</strong></label>)}</fieldset>
    <Counter label="Children (2 & over)" value={children} set={setChildren} min={1} max={10} />
    <Counter label="Children under 2 (free)" value={underTwos} set={setUnderTwos} min={0} max={10} />
    <div className="booking-fields">
      <label>Parent / guardian name<input value={form.parent_name} maxLength={100} onChange={e => setForm({ ...form, parent_name: e.target.value })} autoComplete="name" /></label>
      <label>Phone / WhatsApp<input value={form.phone} maxLength={30} onChange={e => setForm({ ...form, phone: e.target.value })} autoComplete="tel" inputMode="tel" placeholder="+263 …" /></label>
      <label>Email (optional)<input type="email" value={form.email} maxLength={255} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
      <label>Anything we should know? (optional)<textarea value={form.notes} maxLength={500} rows={2} onChange={e => setForm({ ...form, notes: e.target.value })} /></label>
    </div>
    <div className="booking-total"><span>Estimated total</span><strong>${total}</strong></div>
    <fieldset className="ticket-choice pay-choice"><legend>How would you like to pay?</legend>
      <label data-active={pay === 'ecocash'}><input type="radio" name="pay" checked={pay === 'ecocash'} onChange={() => setPay('ecocash')} /><span>Pay now with EcoCash</span></label>
      <label data-active={pay === 'pay_later'}><input type="radio" name="pay" checked={pay === 'pay_later'} onChange={() => setPay('pay_later')} /><span>Pay later</span></label>
    </fieldset>
    {pay === 'ecocash' && <div className="ecocash-box">
      <ol><li>Send <strong>${total}</strong> by EcoCash to <strong>0779 140 417</strong> (dial *151# → Send Money).</li><li>Enter the transaction reference from your confirmation SMS below.</li></ol>
      <div className="booking-fields">
        <label>EcoCash transaction reference<input value={eco.ref} maxLength={60} onChange={e => setEco({ ...eco, ref: e.target.value })} placeholder="e.g. MP261205.1234.A12345" /></label>
        <label>Number you paid from (optional)<input value={eco.from} maxLength={30} inputMode="tel" onChange={e => setEco({ ...eco, from: e.target.value })} placeholder="07…" /></label>
      </div>
    </div>}
    {error && <p className="booking-error" role="alert">{error}</p>}
    <Button type="submit" className="action-button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : pay === 'ecocash' ? 'Confirm booking & payment' : 'Request my tickets'}</Button>
    <p className="booking-small">{pay === 'ecocash' ? 'Your tickets are confirmed once we’ve matched your EcoCash payment — we’ll message you.' : 'We’ll call or WhatsApp you to confirm your tickets and arrange payment.'}</p>
  </form>;
}
