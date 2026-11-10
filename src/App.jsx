import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  media, email, socials, memberBenefits, governingDocs, faq,
  events, board2024, board2023, history, boardYears
} from './data';
import TrossenCalendar from './TrossenCalendar.jsx';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function Brand({ inverse = false }) {
  const [failed, setFailed] = useState(false);
  return <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="Gefleteknologerna – startsidan">
    {!failed ? <img className="brand__logo" src={media.logo} alt="Gefleteknologernas sektionsmärke" onError={() => setFailed(true)} />
      : <span className="brand__fallback">G<span>tech</span></span>}
    <span className="brand__name"><strong>GEFLETEKNOLOGERNA</strong><small>Studentsektionen vid Högskolan i Gävle</small></span>
  </Link>;
}

const links = [
  { label: 'Om oss', submenu: [['Om föreningen', '/#om-oss'], ['Stadgar', '/stadgar'], ['Föreskrifter', '/foreskrifter'], ['Historia', '/historia'], ['Husregler', '/husregler']] },
  { label: 'Inspark', to: '/inspark', submenu: [['Om insparken', '/inspark'], ['För phaddrar', '/inspark/for-phaddrar']] },
  { label: 'Evenemang', to: '/events' },
  { label: 'Trossen', to: '/trossen' },
  { label: 'Styrelsen', to: '/styrelsen' },
  { label: 'Futurum', to: '/futurum' },
  { label: 'Nyheter', to: '/nyheter' },
  { label: 'Kontakt', to: '/kontakt' }
];

function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const location = useLocation();
  useEffect(() => { setOpen(false); setDrop(null); }, [location.pathname, location.hash]);
  return <>
    <div className="topbar"><div className="container topbar__content">
      <span>GTECH · SCIENTIAE IN FUTURUM</span>
      <div className="topbar__links"><a href={`mailto:${email}`}>{email}</a><span className="dot" />
      <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a></div>
    </div></div>
    <header className="site-header"><div className="container header-inner">
      <Brand />
      <button className="menu-toggle" aria-label={open ? 'Stäng meny' : 'Öppna meny'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Huvudmeny">
        {links.map((item, idx) => <div className="nav-item" key={item.label}>
          <div className="nav-item__top">
            {item.to ? <NavLink to={item.to} className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>{item.label}</NavLink>
              : <Link className="nav-link" to="/#om-oss">{item.label}</Link>}
            {item.submenu && <button className="nav-chevron" aria-label={`Visa undermeny för ${item.label}`} aria-expanded={drop === idx}
              onClick={() => setDrop(drop === idx ? null : idx)}>⌄</button>}
          </div>
          {item.submenu && <div className={`nav-dropdown ${drop === idx ? 'nav-dropdown--open' : ''}`}>
            {item.submenu.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
          </div>}
        </div>)}
        <Link className="nav-mobile-cta" to="/kontakt">Kontakta oss <Arrow /></Link>
      </nav>
    </div></header>
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="container footer__main">
      <div className="footer__about"><Brand inverse /><p>För gemenskap, utbildning och ett bättre studentliv vid Högskolan i Gävle.</p>
        <div className="socials"><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a><a href={socials.facebook} target="_blank" rel="noreferrer">Facebook <Arrow diagonal /></a></div>
      </div>
      <div><h3>Utforska</h3><Link to="/inspark">Inspark</Link><Link to="/events">Evenemang</Link><Link to="/styrelsen">Styrelsen</Link><Link to="/futurum">Futurum</Link><Link to="/trossen">Trossen / Pubkalender</Link></div>
      <div><h3>Föreningen</h3><Link to="/historia">Historia</Link><Link to="/stadgar">Stadgar</Link><Link to="/foreskrifter">Föreskrifter</Link><Link to="/husregler">Husregler</Link></div>
      <div><h3>Kontakt</h3><a href={`mailto:${email}`}>{email}</a><p>Regementsvägen 25<br />802 67 Gävle</p><Link to="/kontakt">Alla kontaktuppgifter <Arrow /></Link></div>
    </div>
    <div className="container footer__bottom"><span>© {new Date().getFullYear()} Gefleteknologerna · React-rekreation</span><span>Byggd med React &amp; Vite</span></div>
  </footer>;
}

function PageHero({ eyebrow, title, children, compact = false, image = null }) {
  return <section className={`page-hero ${compact ? 'page-hero--compact' : ''}`} style={image ? { '--hero-image': `url("${image}")` } : {}}>
    <div className="container page-hero__inner"><span className="eyebrow eyebrow--light">{eyebrow || 'GEFLETEKNOLOGERNA'}</span><h1>{title}</h1>{children && <div className="page-hero__description">{children}</div>}</div>
  </section>;
}

function SectionHeading({ eyebrow, title, subtitle, link, label }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{link && <Link className="inline-link" to={link}>{label || 'Läs mer'} <Arrow /></Link>}</div>;
}

function Home() {
  const location = useLocation();
  useEffect(() => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }); }, [location.hash]);
  return <>
    <section className="home-hero">
      <div className="home-hero__image" style={{ backgroundImage: `linear-gradient(90deg,rgba(33,5,19,.94) 0%,rgba(50,9,28,.82) 49%,rgba(50,9,28,.36) 100%),url('${media.cover}')` }} />
      <div className="container home-hero__content">
        <span className="eyebrow eyebrow--light"><span className="accent-line" /> STUDENTLIVET BÖRJAR HÄR</span>
        <h1>Gefle<span>teknologerna.</span></h1>
        <p className="hero-lead">En ideell studentförening för studenter</p>
        <p>Vi samlar teknologer och studenter inom teknik och miljö vid Högskolan i Gävle. Här finns gemenskap, engagemang och minnen för livet.</p>
        <div className="hero-actions"><Link to="/#om-oss" className="button button--cream">Upptäck Gtech <Arrow /></Link><Link to="/inspark" className="button button--outline-light">Om insparken <Arrow /></Link></div>
      </div>
      <div className="hero-bottom"><div className="container"><span>GÄVLE, SVERIGE</span><span>GEMENSKAP · ENGAGEMANG · STUDENTLIV</span></div></div>
    </section>

    <section className="section about-section" id="om-oss"><div className="container about-layout">
      <div className="about-layout__copy"><span className="eyebrow">VILKA ÄR VI?</span><h2>För studenter.<br /><em>Av studenter.</em></h2>
        <p className="lead">Gefleteknologerna, eller Gtech, är studentsektionen för dig som studerar vid Akademin för Teknik och Miljö på Högskolan i Gävle.</p>
        <p>Vi arbetar för att studenter ska ha en bra utbildning och en rolig tid vid högskolan. Du kan vända dig till oss med idéer, frågor och synpunkter på din utbildning.</p>
        <p>På vår studentpub Trossen och under våra arrangemang får du chansen att träffa nya vänner. Vi arrangerar även Futurum, där studenter kan skapa kontakter med arbetslivet.</p>
        <Link className="inline-link" to="/historia">Läs om vår historia <Arrow /></Link>
      </div>
      <div className="about-layout__visual"><div className="about-photo"><img src={media.trossen} alt="Bildcollage från studentpuben Trossen" /></div><div className="about-stamp">SEDAN<br /><strong>1994</strong><small>GEFLETEKNOLOGERNA</small></div></div>
    </div></section>

    <section className="section cards-section"><div className="container"><SectionHeading eyebrow="MER OM FÖRENINGEN" title="Lär känna Gtech" subtitle="Upptäck hur sektionen fungerar, var vi kommer ifrån och vad som gäller hos oss." />
      <div className="feature-grid">{governingDocs.map((d, i) => <Link className="feature-card" to={d.path} key={d.path}>
        <span className="feature-card__num">0{i + 1}</span><div><h3>{d.title}</h3><p>{d.description}</p><span className="circle-arrow"><Arrow diagonal /></span></div></Link>)}</div>
    </div></section>

    <section className="section membership-section"><div className="container membership-layout">
      <div><span className="eyebrow">VAR EN DEL AV OSS</span><h2>Medlemskap<br /><em>som gör skillnad.</em></h2><p>Som medlem i Gefle Studentkår får du tillgång till Gtechs gemenskap och en rad möjligheter under studietiden.</p>
        <ul className="benefits">{memberBenefits.map(x => <li key={x}><span aria-hidden="true">✓</span>{x}</li>)}</ul>
        <a className="button button--burgundy" href={socials.studentkar} target="_blank" rel="noreferrer">Bli medlem via Gefle Studentkår <Arrow diagonal /></a>
      </div>
      <div className="membership-visual"><div className="membership-visual__box"><img src={media.membership} alt="Gefle Studentkårs logotyp" /><p>DIN STUDIETID<br /><strong>DIN GEMENSKAP.</strong></p></div></div>
    </div></section>

    <section className="cta-banner"><div className="container cta-layout"><div><span className="eyebrow eyebrow--light">ENGAGERA DIG</span><h2>Var med och forma<br />framtidens Gtech.</h2><p>Att vara med i styrelsen är ett sätt att påverka, utvecklas och lära känna andra studenter.</p></div><a className="button button--cream" href="mailto:ordforande@gefleteknologerna.se?subject=Intresse%20f%C3%B6r%20styrelsearbete">Sök till styrelsen <Arrow /></a></div></section>

    <section className="section sponsors-section"><div className="container"><SectionHeading eyebrow="TILLSAMMANS MED NÄRINGSLIVET" title="Sponsorer" subtitle="Företag som har synts på föreningens webbplats." />
      <div className="sponsors"><div><img src={media.storaEnso} alt="Stora Enso" /></div><div><img src={media.monitor} alt="Monitor ERP" /></div></div>
    </div></section>
  </>;
}

function Inspark() {
  return <><PageHero eyebrow="STUDENTLIV & GEMENSKAP" title="Inspark" image={media.cover}>En vecka av aktiviteter, möten och minnen vid starten av din studietid.</PageHero>
    <section className="section"><div className="container narrow-content">
      <span className="eyebrow">VÄLKOMMEN TILL GÄVLE</span><h2>Vad är insparken?</h2><p className="lead">Att börja studera är en stor förändring. Under insparken får du träffa andra nya studenter och upptäcka studentlivet tillsammans.</p>
      <p>Gefleteknologerna ordnar insparken tillsammans med studentföreningen VOX under namnet <strong>TechnoVOX</strong>. Under veckan sker gemensamma aktiviteter, lekar och möten med andra studentföreningar.</p>
      <div className="info-panel"><h3>Varför vara med?</h3><p>Insparken är ett lätt sätt att hitta gemenskap och lära känna både högskolan, Gävle och de människor du kommer att möta under studietiden.</p></div>
      <h2>Vill du bli phadder?</h2><p>Phaddrar hjälper nya studenter att få en välkomnande start. Vi har samlat svar på vanliga frågor för dig som funderar på att delta.</p>
      <Link className="button button--burgundy" to="/inspark/for-phaddrar">FAQ för phaddrar <Arrow /></Link>
      <div className="contact-strip"><span>Frågor om insparken?</span><a href="mailto:alderman@gefleteknologerna.se">alderman@gefleteknologerna.se <Arrow diagonal /></a></div>
    </div></section></>;
}

function Phaddrar() {
  const [opened, setOpened] = useState(0);
  return <><PageHero eyebrow="INSPARK" title="För phaddrar" compact>Vanliga frågor för dig som vill hjälpa till under insparken.</PageHero>
    <section className="section"><div className="container narrow-content"><span className="eyebrow">VANLIGA FRÅGOR</span><h2>Allt du vill veta</h2><p>Informationen är ett urval från föreningens tidigare FAQ. Kontrollera alltid aktuella datum, priser och anmälningsregler med arrangörerna.</p>
      <div className="accordion">{faq.map(({q, a}, index) => <div key={q} className={`accordion__item ${opened === index ? 'accordion__item--open' : ''}`}>
        <button aria-expanded={opened === index} onClick={() => setOpened(opened === index ? -1 : index)}><span>{q}</span><span aria-hidden="true">{opened === index ? '−' : '+'}</span></button>
        {opened === index && <div className="accordion__answer">{a}</div>}
      </div>)}</div>
      <p className="minor-text">Se även <a href="https://gefleteknologerna.se/inspark/for-phaddrar/" target="_blank" rel="noreferrer">originalsidans fullständiga information <Arrow diagonal /></a>.</p>
    </div></section></>;
}

function Events() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('Lista');
  const filtered = events.filter(ev => Object.values(ev).join(' ').toLowerCase().includes(query.toLowerCase()));
  return <><PageHero eyebrow="DET HÄNDER HOS OSS" title="Evenemang" compact>Här hittar du aktiviteter och tidigare möten i föreningen.</PageHero>
    <section className="section"><div className="container"><div className="events-toolbar"><label className="event-search"><span>Sök efter evenemang</span><input type="search" placeholder="Sök på namn, plats eller datum …" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="view-switch" role="group" aria-label="Evenemangsvy">{['Lista', 'Månad'].map(v => <button key={v} className={view===v ? 'selected' : ''} onClick={() => setView(v)}>{v}</button>)}</div></div>
      <div className="empty-events"><span className="empty-events__icon">✳</span><div><h2>Inga kommande evenemang</h2><p>Följ oss på Instagram eller Hitract för senaste informationen om aktiviteter.</p></div><a href={socials.instagram} target="_blank" rel="noreferrer" className="inline-link">Till Instagram <Arrow diagonal /></a></div>
      <SectionHeading eyebrow="ARKIV" title="Tidigare evenemang" subtitle="Några av föreningens tidigare arrangemang." />
      {filtered.length ? <div className={view==='Månad' ? 'event-grid event-grid--cards' : 'event-grid'}>{filtered.map(ev => <article className="event-card" key={ev.title}><div className="event-card__date">{ev.date}</div><div><h3>{ev.title}</h3><p className="event-card__meta">{ev.time} · {ev.place}</p><p>{ev.desc}</p></div></article>)}</div> : <p className="no-results">Inga evenemang matchar sökningen.</p>}
    </div></section></>;
}

function Board() {
  const navigate = useNavigate();
  const { year } = useParams();
  const shownYear = year === 'ar-2023' ? 2023 : 2024;
  const people = shownYear === 2023 ? board2023 : board2024;
  return <><PageHero eyebrow="MÄNNISKORNA BAKOM GTECH" title="Styrelsen" compact>Lär känna personerna som har arbetat för sektionen.</PageHero>
    <section className="section"><div className="container"><div className="board-controls"><div><span className="eyebrow">STYRELSEARKIV</span><h2>Verksamhetsår {shownYear}</h2></div><label>Välj år <select value={shownYear} onChange={e => navigate(`/styrelsen/ar-${e.target.value}`)}>{boardYears.map(y => <option key={y} value={y}>{y}</option>)}</select></label></div>
    <p className="section-intro">Personuppgifterna nedan kommer från föreningens publicerade styrelsearkiv. För senare år hänvisar vi till den officiella webbplatsen.</p>
    <div className="board-grid">{people.map(([name, role], i) => <div className="board-card" key={`${name}-${role}`}><div className="board-card__portrait"><span>{name.split(' ').map(x => x[0]).slice(0,2).join('')}</span></div><div className="board-card__info"><span className="board-card__number">{String(i+1).padStart(2,'0')}</span><h3>{name}</h3><p>{role}</p></div></div>)}</div>
    <p className="minor-text">Visa fler verksamhetsår på <a href="https://gefleteknologerna.se/styrelsen/ar-2024/" target="_blank" rel="noreferrer">originalwebbplatsen <Arrow diagonal /></a>.</p>
    </div></section></>;
}

function Futurum() {
  const { edition: editionParam } = useParams();
  const year = editionParam?.match(/^futurum-(2023|2024|2025)$/)?.[1];
  const selectedYear = year || null;
  const editions = [{ year: '2025', date: '12 november 2025', time: '09.00–15.00' }, { year: '2024', date: '20 november 2024', time: '08.00–15.00' }, { year: '2023', date: '24 november 2023', time: 'Se arkiv' }];
  const edition = editions.find(e => e.year === selectedYear);
  return <><PageHero eyebrow="MÖT DIN FRAMTID" title={edition ? `Futurum ${edition.year}` : 'Futurum'} image={media.cover}>Gefleteknologernas arbetsmarknadsdag för studenter och företag.</PageHero>
    <section className="section"><div className="container futurum-layout"><div className="futurum-layout__copy"><span className="eyebrow">KONTAKTER FÖR FRAMTIDEN</span><h2>En mötesplats för studenter och näringsliv.</h2>
      <p className="lead">Futurum är arbetsmarknadsdagen där studenter kan möta arbetsgivare, hitta inspiration till examensarbeten och bygga sitt nätverk.</p>
      <p>Gefleteknologerna representerar utbildningar inom teknik och miljö vid Högskolan i Gävle. På Futurum får företag och studenter möjlighet att samtala om karriärvägar, praktik och framtida samarbeten.</p>
      {edition && <div className="date-box"><strong>{edition.date}</strong><span>{edition.time} · Högskolan i Gävle</span><span className="tiny">Arkivuppgift – datumet har passerat.</span></div>}
      <a className="button button--burgundy" href="mailto:futurum@gefleteknologerna.se?subject=F%C3%B6rfr%C3%A5gan%20om%20Futurum">Kontakta Futurum <Arrow /></a>
    </div><div className="futurum-poster"><img src={media.futurum} alt="Futurums logotyp i vinrött" /><span>ARBETSMARKNADSDAG</span></div></div></section>
    <section className="section cards-section"><div className="container"><SectionHeading eyebrow="TIDIGARE ÅR" title="Futurum genom åren" subtitle="Utforska tidigare upplagor av Gefleteknologernas arbetsmarknadsdag." />
      <div className="edition-grid">{editions.map(e => <Link className={`edition-card ${selectedYear === e.year ? 'edition-card--selected' : ''}`} key={e.year} to={`/futurum/futurum-${e.year}`}><span className="eyebrow">FUTURUM</span><strong>{e.year}</strong><p>{e.date}</p><span className="circle-arrow"><Arrow diagonal /></span></Link>)}</div>
      {edition && <p className="minor-text">Se <a href={`https://gefleteknologerna.se/futurum/futurum-${selectedYear}/`} target="_blank" rel="noreferrer">hela originalprogrammet för {selectedYear} <Arrow diagonal /></a>.</p>}
    </div></section></>;
}

function News() {
  return <><PageHero eyebrow="SENASTE FRÅN FÖRENINGEN" title="Nyheter" compact>Uppdateringar om föreningens verksamhet.</PageHero>
    <section className="section"><div className="container narrow-content center-empty"><span className="center-empty__star">✳</span><h2>Inga nyheter publicerade just nu</h2><p>Följ Gefleteknologerna på Instagram för nyheter och kommande aktiviteter.</p><a className="button button--burgundy" href={socials.instagram} target="_blank" rel="noreferrer">Följ oss på Instagram <Arrow diagonal /></a></div></section></>;
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', address: '', message: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Kontakt från ${form.name} – Gtech React`);
    const body = encodeURIComponent(`Namn: ${form.name}\nTelefon: ${form.phone || 'Ej angivet'}\nE-post: ${form.address}\n\n${form.message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };
  return <><PageHero eyebrow="VI FINNS HÄR FÖR DIG" title="Kontakt" compact>Frågor, förslag eller nyfiken på vår verksamhet? Hör av dig.</PageHero>
    <section className="section"><div className="container contact-layout"><div className="contact-details"><span className="eyebrow">HÖR AV DIG</span><h2>Vi vill gärna höra från dig.</h2><p>Kontakta sektionen om din utbildning, vår verksamhet eller om du vill engagera dig.</p>
      <div className="contact-detail"><span>BESÖKSADRESS</span><p>Regementsvägen 25<br />802 67 Gävle, Sverige</p></div>
      <div className="contact-detail"><span>POSTADRESS</span><p>Gefleteknologerna<br />Stenhammarsvägen 15<br />802 67 Gävle</p></div>
      <div className="contact-detail"><span>E-POST</span><a href={`mailto:${email}`}>{email} <Arrow diagonal /></a></div>
      <div className="contact-detail"><span>ORGANISATIONSNUMMER</span><p>885001-6471</p></div>
      <a href="https://www.google.com/maps/search/?api=1&query=Regementsv%C3%A4gen+25%2C+G%C3%A4vle" target="_blank" rel="noreferrer" className="inline-link">Visa på Google Maps <Arrow diagonal /></a>
    </div>
    <form className="contact-form" onSubmit={send}><h3>Skicka ett meddelande</h3><p>Formuläret öppnar ditt e-postprogram med meddelandet förberett.</p>
      <div className="form-row"><label>Namn <input name="name" required autoComplete="name" value={form.name} onChange={change} placeholder="Ditt namn" /></label><label>Telefon <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={change} placeholder="Ditt telefonnummer" /></label></div>
      <label>E-post <input name="address" type="email" required autoComplete="email" value={form.address} onChange={change} placeholder="namn@exempel.se" /></label>
      <label>Meddelande <textarea name="message" required rows="6" value={form.message} onChange={change} placeholder="Vad vill du kontakta oss om?" /></label>
      <button className="button button--burgundy" type="submit">Öppna e-postprogram <Arrow /></button>
    </form></div></section></>;
}

function Rules() {
  const sections = [
    ['Inträde & trygghet', 'Besökare ska följa personalens anvisningar. Kontroll vid entrén är en del av föreningens säkerhetsrutiner.'],
    ['Ansvarsfull servering', 'Gäster som är för berusade kan nekas tillträde. Alkohol får inte drickas i kön till Trossen.'],
    ['Ta hand om lokalen', 'Klotter, skadegörelse och annat som påverkar lokalen eller andra gäster accepteras inte.'],
    ['Respektera personalen', 'Personalen och ansvariga bestämmer om exempelvis serveringsstopp och avvisning. Respektera deras beslut.']
  ];
  return <><PageHero eyebrow="OM OSS" title="Husregler" compact>För en trygg och välkomnande kväll på Trossen.</PageHero><section className="section"><div className="container narrow-content"><span className="eyebrow">TROSSENS HUSREGLER</span><h2>Vi tar hand om varandra.</h2><p className="lead">Trossen är en mötesplats för studenter. Tillsammans skapar vi en trivsam och säker miljö.</p><div className="document-sections">{sections.map(([title, text], i) => <div key={title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><p className="minor-text">Detta är en lättläst sammanfattning. Läs <a target="_blank" rel="noreferrer" href="https://gefleteknologerna.se/husregler/">originalreglerna <Arrow diagonal /></a> före ditt besök.</p></div></section></>;
}

function History() {
  return <><PageHero eyebrow="OM OSS" title="Historia" compact>Föreningens väg från de första teknologerna till dagens Gtech.</PageHero><section className="section"><div className="container narrow-content"><span className="eyebrow">VÅR HISTORIA</span><h2>Traditioner som lever vidare.</h2><p className="lead">Gefleteknologernas historia börjar med studentengagemang kring teknikutbildningarna i Sandviken under 1980-talet.</p>
    <div className="timeline">{history.map(([year, text]) => <div className="timeline__item" key={year}><span>{year}</span><p>{text}</p></div>)}</div><p className="minor-text">Den längre historien finns på <a href="https://gefleteknologerna.se/historia/" target="_blank" rel="noreferrer">originalwebbplatsen <Arrow diagonal /></a>.</p></div></section></>;
}

function DocumentPage({ kind }) {
  const statutes = [
    ['Namn och ändamål', 'Sektionen heter Gefleteknologerna och arbetar både med utbildningsbevakning och studiesociala aktiviteter.'],
    ['Medlemskap', 'Stadgarna anger vem som kan bli medlem och vilka rättigheter ett medlemskap ger.'],
    ['Årsmöte', 'Årsmötet är föreningens högsta beslutande organ. Där behandlas bland annat budget, verksamhetsplan och motioner.'],
    ['Styrelse och utskott', 'Styrelsen leder det löpande arbetet tillsammans med olika utskott för verksamhetens delar.'],
    ['Revision och ändringar', 'Stadgarna reglerar revision, ändringar i stadgan och vad som händer vid upplösning.']
  ];
  const regulations = [
    ['Organisation', 'Utskott ansvarar bland annat för sexmästeri, utbildning, marknadsföring, näringsliv och introduktion.'],
    ['Information och evenemang', 'Föreningen informerar studenter och ordnar aktiviteter som sittningar, möten och andra studenttraditioner.'],
    ['Inspark', 'Introduktionen ska välkomna nya studenter, hjälpa dem att hitta gemenskap och ske med respekt för alla.'],
    ['Klädsel och traditioner', 'Gtechs overallfärg är bordeaux och den traditionella smäcken är buteljgrön.'],
    ['Ansvar och policy', 'Föreskrifterna tar även upp ekonomiskt ansvar, lokaler och alkohol- och drogpolicy.']
  ];
  const isStatute = kind === 'stadgar';
  const title = isStatute ? 'Stadgar' : 'Föreskrifter';
  const paragraphs = isStatute ? statutes : regulations;
  return <><PageHero eyebrow="OM OSS" title={title} compact>Dokument som beskriver hur Gefleteknologerna fungerar.</PageHero>
    <section className="section"><div className="container narrow-content"><span className="eyebrow">FÖRENINGSDOKUMENT</span><h2>{isStatute ? 'Grunden för vår förening.' : 'Så driver vi verksamheten.'}</h2><p className="lead">Här finns en översikt över {title.toLowerCase()}. För exakt ordalydelse och fullständiga regler ska du använda originaldokumentet.</p>
      <div className="document-sections">{paragraphs.map(([heading, text], index) => <div key={heading}><span>{String(index + 1).padStart(2,'0')}</span><div><h3>{heading}</h3><p>{text}</p></div></div>)}</div>
      <a className="button button--burgundy" target="_blank" rel="noreferrer" href={`https://gefleteknologerna.se/${kind}/`}>Läs fullständiga {title.toLowerCase()} <Arrow diagonal /></a>
    </div></section></>;
}

function NotFound() {
  return <><PageHero title="Sidan hittades inte" compact /><section className="section"><div className="container narrow-content center-empty"><h2>Här var det tomt.</h2><p>Sidan du söker finns inte i denna React-version.</p><Link className="button button--burgundy" to="/">Till startsidan <Arrow /></Link></div></section></>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  return <><ScrollToTop /><Header /><main id="main-content"><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/inspark" element={<Inspark />} />
    <Route path="/inspark/for-phaddrar" element={<Phaddrar />} />
    <Route path="/events" element={<Events />} />
    <Route path="/trossen" element={<TrossenCalendar />} />
    <Route path="/styrelsen" element={<Board />} />
    <Route path="/styrelsen/:year" element={<Board />} />
    <Route path="/futurum" element={<Futurum />} />
    <Route path="/futurum/:edition" element={<Futurum />} />
    <Route path="/nyheter" element={<News />} />
    <Route path="/kontakt" element={<Contact />} />
    <Route path="/husregler" element={<Rules />} />
    <Route path="/historia" element={<History />} />
    <Route path="/stadgar" element={<DocumentPage kind="stadgar" />} />
    <Route path="/foreskrifter" element={<DocumentPage kind="foreskrifter" />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /></>;
}
