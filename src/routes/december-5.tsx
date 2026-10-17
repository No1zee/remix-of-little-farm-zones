import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Bookmark, BookmarkCheck, CalendarDays, Clock, MapPin, Music2, Check, Phone, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zones, setupImages } from '@/components/bambino';
import { ticketPrices, includes } from '@/components/booking';
import { decemberEvent, programme, sessionsOverlap } from '@/lib/event-programme';
import farmPhoto from '@/assets/bambino-farm.jpg';

export const Route = createFileRoute('/december-5')({
  head: () => ({ meta: [
    { title: '5 December 2026 Event & Zone Schedule | BAMBINO World' },
    { name: 'description', content: 'Plan Bambino Wonder Day on Saturday 5 December 2026, 10 am–5 pm CAT at The Little Farm, Harare. Explore the proposed five-zone programme, tickets and directions.' },
    { property: 'og:title', content: 'Bambino Wonder Day • 5 December 2026' },
    { property: 'og:description', content: 'A full day of play, creativity and discovery. Explore the proposed programme for all five zones and plan your family visit.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: DecemberEvent,
});

function DecemberEvent() {
  const [zone, setZone] = useState('all');
  const [saved, setSaved] = useState<string[]>([]);
  const [showPlan, setShowPlan] = useState(false);
  const selected = programme.filter(s => saved.includes(s.id)).sort((a, b) => a.start.localeCompare(b.start));
  const conflicts = selected.some(a => selected.some(b => sessionsOverlap(a, b)));
  const toggle = (id: string) => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const visibleZones = zones.filter(z => zone === 'all' || z.tone === zone);
  return <main>
    <section className="hero event-hero">
      <img className="hero-photo" src={farmPhoto} width={1536} height={1024} alt="Children enjoying colourful outdoor play on a sunny farm lawn" fetchPriority="high" />
      <div className="hero-inner">
        <span className="eyebrow">BAMBINO World · Opening day</span>
        <h1>Bambino<br/>Wonder Day<span>.</span></h1>
        <p>Nature, play, learning and a little magic. Five happy zones, one unforgettable family day.</p>
        <div className="event-hero-details"><span><CalendarDays/>Saturday 5 December 2026</span><span><Clock/>10:00 am – 5:00 pm CAT</span></div>
        <div className="hero-actions"><Button asChild className="action-button"><Link to="/visit" hash="tickets">Book your tickets <ArrowRight/></Link></Button><Button asChild variant="outline" className="action-button hero-secondary"><a href="#programme">See the programme <ArrowRight/></a></Button></div>
      </div>
    </section>
    <div className="event-at-a-glance"><span><MapPin/>The Little Farm, Harare</span><span>Children 6 months – 12 years</span><span>From $25 per child · Lunch included</span></div>
    <section className="section" id="programme">
      <div className="section-heading"><span className="eyebrow">A day full of possibilities</span><h2>Find their kind of wonder.</h2><p>From tiny first discoveries to big adventures, there’s a little world for everyone.</p></div>
      <div className="programme-notice"><CalendarDays/><div><strong>Proposed opening-day programme</strong><p>These activity times are a draft, not yet confirmed by the BAMBINO team. All times are Central African Time (CAT, UTC+2).</p></div></div>
      <div className="programme-toolbar"><label htmlFor="zone-filter">Zone<select id="zone-filter" value={zone} onChange={e => setZone(e.target.value)}><option value="all">All five zones</option>{zones.map(z => <option key={z.tone} value={z.tone}>{z.name}</option>)}</select></label><Button variant={showPlan ? 'default' : 'outline'} aria-pressed={showPlan} onClick={() => setShowPlan(!showPlan)}><Bookmark/>My day ({saved.length})</Button></div>
      {showPlan ? <div className="family-plan"><h3>Our little adventure</h3><p className="programme-caption">Your selected activities · {saved.length} planned · Not a session reservation</p>{conflicts && <p className="programme-warning">Some activities overlap. Choose different times if everyone is staying together.</p>}{selected.length === 0 ? <p className="programme-empty">No activities selected yet.</p> : <ol className="session-list">{selected.map(s => { const z = zones.find(z => z.tone === s.zone); return <li key={s.id}><time>{s.start} – {s.end}</time><div><strong>{s.title}</strong><span>{z?.name}</span></div><Button variant="ghost" size="icon" aria-label={`Remove ${s.title} from my day`} title="Remove from my day" onClick={() => toggle(s.id)}><BookmarkCheck/></Button></li>; })}</ol>}<Button variant="outline" onClick={() => setShowPlan(false)}>Back to all activities <ArrowRight/></Button></div> : <div className="programme-zones">{visibleZones.map(z => {
        const image = setupImages[z.tone];
        return <section key={z.tone} className={`programme-zone ${z.tone}`} aria-label={`${z.name} schedule`}>
          <div className="programme-zone-intro">{image ? <figure><img src={image.src} width={image.w} height={image.h} loading="lazy" alt={`${z.name} proposed setup`}/><figcaption>Setup vision · Reference image</figcaption></figure> : <div className="programme-stage-art"><Music2/><span>Music. Laughter. Together.</span></div>}<div className="programme-zone-copy"><span className="zone-age">{z.age}</span><h3><z.icon/>{z.name}</h3><p>{z.description}</p></div></div>
          <ol className="session-list">{programme.filter(s => s.zone === z.tone).map(s => <li key={s.id}><time dateTime={`${decemberEvent.date}T${s.start}:00+02:00`}>{s.start} – {s.end}</time><strong>{s.title}</strong><Button variant="ghost" size="icon" aria-pressed={saved.includes(s.id)} aria-label={`${saved.includes(s.id) ? 'Remove' : 'Add'} ${s.title} ${saved.includes(s.id) ? 'from' : 'to'} my day`} title={saved.includes(s.id) ? 'Remove from my day' : 'Add to my day'} onClick={() => toggle(s.id)}>{saved.includes(s.id) ? <BookmarkCheck/> : <Bookmark/>}</Button></li>)}</ol>
        </section>;
      })}</div>}
    </section>
    <section className="zones-band"><div className="section"><div className="section-heading"><span className="eyebrow">A whole day, one ticket</span><h2>Little moments. Lots included.</h2></div><div className="price-grid">{ticketPrices.map(t => <article key={t.id} className={`price-card ${t.id}`}><span>{t.label}</span><strong>${t.price}</strong><small>per child · Lunch included</small><em>{t.note}</em></article>)}</div><p className="event-sibling-note">Early Bird sibling totals: 2 children $45 · 3 children $60 · 4 children $70.<br/>Children 2 & under are free with a paying sibling.</p><ul className="event-inclusions">{includes.map(i => <li key={i}><Check/>{i}</li>)}</ul><div className="event-book-action"><Button asChild className="action-button"><Link to="/visit" hash="tickets">Book for 5 December <ArrowRight/></Link></Button><p>EcoCash to 0779 140 417 or arrange payment with the team.</p></div></div></section>
    <section className="section event-arrival"><div><span className="eyebrow">Meet us at The Little Farm</span><h2>A little fresh air.<br/>A whole world of play.</h2><p><strong>The Little Farm, Meyrick Park</strong><br/>5 Richwell Ave, Mabelreign, Harare</p><Button asChild variant="outline" className="action-button"><a href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472" target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight/></a></Button></div><div className="event-arrival-details"><h3>For your family</h3><p>Registration is at the entrance, with a parents’ lounge on site. Ponds are fenced and supervised; the swimming pool is fenced off and is not an activity.</p><p>Questions about allergies, access or your booking? Contact the BAMBINO team.</p><a href="tel:+263710489896"><Phone/>+263 710 489 896</a><a href="tel:+263779140417"><Phone/>0779 140 417</a><Button asChild variant="outline"><Link to="/visit" hash="ask">Ask Bambino <ArrowRight/></Link></Button></div></section>
  </main>;
}