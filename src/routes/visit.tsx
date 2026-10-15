import { createFileRoute } from '@tanstack/react-router';
import { MapPin, CalendarHeart, Clock, ArrowUpRight, Phone, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro } from '@/components/bambino';
import { BookingForm, includes, ticketPrices } from '@/components/booking';
import { EventHelper } from '@/components/event-helper';
export const Route=createFileRoute('/visit')({head:()=>({meta:[{title:'Tickets & Plan Your Visit | BAMBINO World'},{name:'description',content:'Bambino Wonder Day, Saturday 5 December 2026, 10:00 am – 5:00 pm at The Little Farm, Meyrick Park, Harare. Tickets from $25 per child, lunch included. Book online.'},{property:'og:title',content:'Book Bambino Wonder Day | BAMBINO World'},{property:'og:description',content:'Tickets from $25 per child, lunch included. Saturday 5 December 2026 at The Little Farm, Harare. Every last Saturday of the month.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Visit});
function Visit(){return <main><PageIntro eyebrow="Bambino Wonder Day · For kids 6 months to 12 years" title="Let’s make happy memories." description="A fun-filled kids festival for the whole family — nature, play, learning, creativity and family fun. One ticket, a whole day of magical experiences."/>
<section className="section"><div className="info-grid">
<article className="info-item"><CalendarHeart/><h2>Saturday 5 December 2026.</h2><p>Our very first Bambino Wonder Day — then every last Saturday of every month.</p></article>
<article className="info-item"><Clock/><h2>10:00 am – 5:00 pm.</h2><p>Central African Time (CAT, UTC+2). A whole day of play, lunch included.</p></article>
<article className="info-item"><MapPin/><h2>The Little Farm, Meyrick Park, Harare.</h2><p className="coordinates">17°48′33.52″S 31°00′13.85″E</p><Button asChild variant="outline" className="action-button"><a href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472" target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight/></a></Button></article>
</div></section>
<section className="section" id="tickets"><div className="section-heading"><span className="eyebrow">Ticket prices</span><h2>One ticket. A whole day of magic.</h2></div>
<div className="price-grid">{ticketPrices.map(t=><div key={t.id} className={`price-card ${t.id}`}><span>{t.label}</span><strong>${t.price}</strong><small>per child</small><em>{t.note}</em></div>)}</div>
<div className="ticket-layout"><div><div className="sibling-box"><h3>Sibling prices</h3><ul><li><span>2 children</span><strong>$45</strong></li><li><span>3 children</span><strong>$60</strong></li><li><span>4 children</span><strong>$70</strong></li><li><span>Children 2 & under</span><strong>Free</strong></li></ul><p>Sibling totals use the Early Bird price. Under-2s are free with any paying sibling.</p></div>
<div className="includes-box"><h3>Every child’s ticket includes</h3><ul>{includes.map(i=><li key={i}><Heart/>{i}</li>)}</ul><p>Music, dancing, games & more! Safe · Family friendly · Inclusive · Memorable.</p></div></div>
<BookingForm/></div>
<div className="notice contact-row"><strong>Questions?</strong><a href="tel:+263710489896"><Phone/> +263 710 489 896</a><a href="mailto:bambinoworldzw@gmail.com"><Mail/> bambinoworldzw@gmail.com</a><span>@BambinoWorldZw on Facebook, Instagram & TikTok</span></div></section>
<section className="section" id="ask"><div className="section-heading"><span className="eyebrow">Got a question?</span><h2>Ask Bambino anything.</h2></div><EventHelper/></section></main>}
