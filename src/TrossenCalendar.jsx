import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { email } from './data';
import {
  isSharedCalendar, loadShifts, saveShift, deleteShift, submitSignup,
  logInAdmin, signOutAdmin, hasAdminSession, loadSignups, deleteSignup
} from './pubApi';

const weekdayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
const monthTitle = new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric' });
const fullDate = new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const parseDate = value => new Date(`${value}T12:00:00`);
const displayDate = value => fullDate.format(parseDate(value));
const today = () => dateKey(new Date());
const initialShift = date => ({ id: null, date, opens: '18:00', closes: '23:00', work_from: '17:00', work_to: '23:30', helpers_needed: 4, notes: '' });
const initialSignup = { name: '', contact_method: 'Messenger', contact_value: '', consent: false };

function monthDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const before = (first.getDay() + 6) % 7;
  return Array.from({ length: Math.ceil((before + last) / 7) * 7 }, (_, i) => {
    const date = new Date(month.getFullYear(), month.getMonth(), i - before + 1);
    return { date: dateKey(date), day: date.getDate(), inMonth: date.getMonth() === month.getMonth() };
  });
}

function timeRange(from, to) { return `${from?.slice(0, 5) || '--:--'}–${to?.slice(0, 5) || '--:--'}${to && from && to < from ? ' (+1 dag)' : ''}`; }

export default function TrossenCalendar() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [signup, setSignup] = useState(initialSignup);
  const [sending, setSending] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [admin, setAdmin] = useState(() => isSharedCalendar && hasAdminSession());
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(() => initialShift(today()));
  const [signups, setSignups] = useState([]);
  const [signupLoading, setSignupLoading] = useState(false);

  const refresh = useCallback(async () => {
    try { setError(''); setShifts(await loadShifts()); }
    catch (err) { setError(`Kunde inte hämta kalendern: ${err.message}`); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  const byDate = useMemo(() => new Map(shifts.map(s => [s.date, s])), [shifts]);
  const currentShift = byDate.get(selected);
  const days = useMemo(() => monthDays(month), [month]);
  const upcoming = useMemo(() => shifts.filter(s => s.date >= today()).slice(0, 5), [shifts]);

  const selectDate = value => {
    setSelected(value);
    setSignup(initialSignup);
    setNotice('');
    setEditor(byDate.has(value) ? { ...byDate.get(value) } : initialShift(value));
  };
  const changeMonth = delta => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    selectDate(dateKey(next));
  };
  const goToDate = value => {
    setMonth(new Date(parseDate(value).getFullYear(), parseDate(value).getMonth(), 1));
    selectDate(value);
  };
  const startNewShift = () => setEditor(initialShift(selected));
  const openAdmin = () => {
    setAdminOpen(value => !value);
    setEditor(currentShift ? { ...currentShift } : initialShift(selected));
    setNotice('');
  };

  const submitShift = async event => {
    event.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try {
      if (shifts.some(s => s.date === editor.date && s.id !== editor.id)) throw new Error('Datumet har redan en pubkväll. Redigera den befintliga istället.');
      if (editor.date < today()) throw new Error('Välj dagens datum eller ett framtida datum.');
      await saveShift(editor);
      await refresh();
      goToDate(editor.date);
      setNotice('Pubkvällen har sparats i kalendern.');
    } catch (err) { setError(`Kunde inte spara: ${err.message}`); }
    finally { setBusy(false); }
  };

  const removeShift = async () => {
    if (!editor.id || !window.confirm('Ta bort pubkvällen? Eventuella anmälningar kommer också att raderas i den delade databasen.')) return;
    setBusy(true); setError(''); setNotice('');
    try { await deleteShift(editor.id); await refresh(); setEditor(initialShift(selected)); setNotice('Pubkvällen har tagits bort.'); }
    catch (err) { setError(`Kunde inte ta bort: ${err.message}`); }
    finally { setBusy(false); }
  };

  const sendApplication = async event => {
    event.preventDefault();
    if (!currentShift || currentShift.date < today() || !signup.consent) return;
    setSending(true); setError(''); setNotice('');
    try {
      if (isSharedCalendar) {
        await submitSignup({ ...signup, shift_id: currentShift.id });
        setNotice('Tack! Din intresseanmälan har sparats och kan ses av kalenderns administratörer.');
      } else {
        const body = [
          'Hej Gefleteknologerna!', '',
          'Jag vill anmäla mitt intresse för att arbeta på Trossen.',
          `Datum: ${displayDate(currentShift.date)}`,
          `Arbetstid: ${timeRange(currentShift.work_from, currentShift.work_to)}`,
          `Namn: ${signup.name.trim()}`,
          `Kontaktväg: ${signup.contact_method}`,
          `Kontaktuppgift: ${signup.contact_value.trim()}`,
          'Samtycke till att spara kontaktuppgifter för bemanning: Ja', '',
          'Skickat via kalendern på webbplatsen.'
        ].join('\n');
        const subject = `Arbetspass Trossen ${currentShift.date}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setNotice('Ett mejl har förberetts. Du måste skicka det i ditt e-postprogram för att anmälan ska nå Gefleteknologerna.');
      }
      setSignup(initialSignup);
    } catch (err) { setError(`Kunde inte anmäla: ${err.message}`); }
    finally { setSending(false); }
  };

  const signIn = async event => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try { await logInAdmin(credentials.email, credentials.password); setAdmin(true); setCredentials({ email: '', password: '' }); setNotice('Du är inloggad som kalenderadministratör.'); }
    catch (err) { setError(`Inloggning misslyckades: ${err.message}`); }
    finally { setBusy(false); }
  };
  const logOut = () => { signOutAdmin(); setAdmin(false); setSignups([]); setNotice('Du är utloggad.'); };

  const viewSignups = async () => {
    if (!currentShift) return;
    setSignupLoading(true); setError('');
    try { setSignups(await loadSignups(currentShift.id)); }
    catch (err) { setError(`Kunde inte hämta anmälningar: ${err.message}`); }
    finally { setSignupLoading(false); }
  };
  const eraseSignup = async id => {
    if (!window.confirm('Radera kontaktuppgifterna för denna anmälan?')) return;
    try { await deleteSignup(id); await viewSignups(); setNotice('Anmälan raderad.'); }
    catch (err) { setError(`Kunde inte radera anmälan: ${err.message}`); }
  };

  useEffect(() => { setSignups([]); }, [selected]);

  return <>
    <section className="page-hero page-hero--compact trossen-hero">
      <div className="container page-hero__inner"><span className="eyebrow eyebrow--light">TROSSEN · STUDENTPUBEN</span><h1>Pubkalender</h1><div className="page-hero__description">Se när Trossen har öppet och anmäl ditt intresse för ett arbetspass.</div></div>
    </section>

    <section className="section trossen-section"><div className="container">
      <div className="trossen-intro"><div><span className="eyebrow">PUBKVÄLLAR &amp; ARBETSPASS</span><h2>Vad händer på Trossen?</h2><p>Välj ett markerat datum i kalendern för att se öppettider och anmäla dig som funktionär.</p></div>
        <button type="button" className="button button--burgundy" onClick={openAdmin} aria-expanded={adminOpen}>{adminOpen ? 'Stäng administration' : 'Administrera kalendern'} <span aria-hidden="true">→</span></button>
      </div>

      {!isSharedCalendar && <div className="trossen-warning" role="note"><strong>Demoläge:</strong> Datum du lägger till sparas bara i den här webbläsaren. För en gemensam kalender och sparade anmälningar, anslut Supabase enligt README. Anmälningar öppnar ett förberett mejl.</div>}
      {error && <p role="alert" className="trossen-message trossen-message--error">{error} <button type="button" onClick={() => setError('')} aria-label="Stäng felmeddelandet">×</button></p>}
      {notice && <p role="status" className="trossen-message trossen-message--ok">{notice} <button type="button" onClick={() => setNotice('')} aria-label="Stäng meddelandet">×</button></p>}

      <div className="trossen-layout">
        <div className="pub-calendar" aria-label="Kalender för Trossens öppettider">
          <div className="pub-calendar__head"><div><span className="eyebrow">ÖPPETTIDER</span><h3>{monthTitle.format(month)}</h3></div><div className="pub-calendar__nav"><button type="button" onClick={() => changeMonth(-1)} aria-label="Föregående månad">‹</button><button type="button" onClick={() => goToDate(today())} className="pub-calendar__today">Idag</button><button type="button" onClick={() => changeMonth(1)} aria-label="Nästa månad">›</button></div></div>
          <div className="pub-calendar__grid pub-calendar__weekdays">{weekdayNames.map(d => <span key={d}>{d}</span>)}</div>
          <div className="pub-calendar__grid pub-calendar__days">{days.map(d => {
            const shift = byDate.get(d.date);
            const isCurrent = d.date === today();
            return <button key={d.date} type="button" className={['pub-day', !d.inMonth && 'pub-day--muted', shift && 'pub-day--open', selected === d.date && 'pub-day--selected', isCurrent && 'pub-day--today'].filter(Boolean).join(' ')} aria-pressed={selected === d.date} aria-label={`${displayDate(d.date)}${shift ? `, öppet ${timeRange(shift.opens, shift.closes)}` : ', ingen pubkväll publicerad'}`} onClick={() => goToDate(d.date)}>
              <span className="pub-day__number">{d.day}</span>{shift && <span className="pub-day__pill">{shift.opens.slice(0, 5)} <span className="pub-day__pill-text">öppet</span></span>}
            </button>;
          })}</div>
          <div className="pub-calendar__legend"><span><i className="pub-dot pub-dot--open" /> Pubkväll</span><span><i className="pub-dot pub-dot--today" /> Idag</span><span><i className="pub-dot pub-dot--selected" /> Valt datum</span></div>
        </div>

        <aside className="pub-details"><span className="eyebrow">VALT DATUM</span><h3>{displayDate(selected)}</h3>{loading ? <p>Hämtar öppettider…</p> : currentShift ? <>
          <div className="pub-status"><span className="pub-status__icon">✓</span><div><strong>Pubkväll planerad</strong><small>Välkommen till Trossen!</small></div></div>
          <dl className="pub-details__facts"><div><dt>Öppettider</dt><dd>{timeRange(currentShift.opens, currentShift.closes)}</dd></div><div><dt>Arbetspass</dt><dd>{timeRange(currentShift.work_from, currentShift.work_to)}</dd></div><div><dt>Funktionärer sökes</dt><dd>{currentShift.helpers_needed > 0 ? `${currentShift.helpers_needed} personer` : 'Kontakta ansvariga'}</dd></div></dl>
          {currentShift.notes && <p className="pub-details__notes">{currentShift.notes}</p>}
          {selected >= today() ? <a href="#trossen-signup" className="button button--burgundy pub-details__cta">Anmäl intresse <span aria-hidden="true">→</span></a> : <p className="pub-details__past">Datumet har redan passerat.</p>}
        </> : <div className="pub-details__empty"><div className="pub-details__empty-icon" aria-hidden="true">◇</div><strong>Ingen pubkväll publicerad</strong><p>Det finns inga öppettider registrerade för detta datum. Välj ett annat markerat datum.</p></div>}</aside>
      </div>

      <div className="trossen-bottom-grid">
        <div className="pub-upcoming"><span className="eyebrow">NÄSTA PUBKVÄLLAR</span><h3>Kommande datum</h3>{upcoming.length ? <div className="pub-upcoming__list">{upcoming.map(shift => <button key={shift.id} type="button" className="pub-upcoming__item" onClick={() => goToDate(shift.date)}><span><strong>{displayDate(shift.date)}</strong><small>Öppet {timeRange(shift.opens, shift.closes)}</small></span><span aria-hidden="true">→</span></button>)}</div> : <p>Inga kommande pubkvällar är publicerade ännu.</p>}</div>
        <div id="trossen-signup" className="pub-signup"><span className="eyebrow">HJÄLP TILL PÅ TROSSEN</span><h3>Anmäl intresse för arbetspass</h3>{currentShift && selected >= today() ? <><p className="pub-signup__subtitle"><strong>{displayDate(selected)}</strong> · {timeRange(currentShift.work_from, currentShift.work_to)}</p>
          <form onSubmit={sendApplication} className="pub-form"><label>Fullständigt namn <input required maxLength="120" autoComplete="name" value={signup.name} onChange={e => setSignup({ ...signup, name: e.target.value })} placeholder="För- och efternamn" /></label>
            <div className="pub-form__row"><label>Kontaktväg <select value={signup.contact_method} onChange={e => setSignup({ ...signup, contact_method: e.target.value })}><option>Messenger</option><option>Instagram</option><option>WhatsApp</option><option>E-post</option><option>Annat</option></select></label><label>{signup.contact_method === 'E-post' ? 'E-postadress' : 'Profilnamn eller kontaktuppgift'} <input required maxLength="200" type={signup.contact_method === 'E-post' ? 'email' : 'text'} value={signup.contact_value} onChange={e => setSignup({ ...signup, contact_value: e.target.value })} placeholder={signup.contact_method === 'Messenger' ? 'Facebook-namn eller profillänk' : 'Din kontaktuppgift'} /></label></div>
            <label className="pub-consent"><input type="checkbox" required checked={signup.consent} onChange={e => setSignup({ ...signup, consent: e.target.checked })} /><span>Jag samtycker till att Gefleteknologerna sparar och använder mitt namn och min kontaktuppgift för att hantera min intresseanmälan och planera arbetspass. Jag kan begära att uppgifterna raderas via <a href={`mailto:${email}`}>{email}</a>.</span></label>
            <button className="button button--burgundy" type="submit" disabled={sending || !signup.consent}>{sending ? 'Skickar…' : isSharedCalendar ? 'Skicka intresseanmälan' : 'Förbered anmälan via mejl'} <span aria-hidden="true">→</span></button>
            <small className="pub-form__help">{isSharedCalendar ? 'Din anmälan sparas i Gefleteknologernas kalender. Endast behöriga administratörer kan läsa kontaktuppgifterna. Ingen automatisk bekräftelse skickas.' : 'Ett mejl öppnas i din e-postklient. Ingen anmälan skickas automatiskt eller lagras här.'}</small>
          </form></> : <p>Välj ett kommande datum som är markerat som pubkväll i kalendern för att anmäla dig.</p>}</div>
      </div>

      {adminOpen && <section className="pub-admin" aria-label="Kalenderadministration"><div className="pub-admin__heading"><div><span className="eyebrow">ADMINISTRATION</span><h3>Hantera öppettider &amp; arbetspass</h3></div>{isSharedCalendar && admin && <button type="button" className="pub-admin__logout" onClick={logOut}>Logga ut</button>}</div>
        {isSharedCalendar && !admin ? <form className="pub-form pub-admin__login" onSubmit={signIn}><p>Logga in med ditt administratörskonto för att lägga till, ändra eller ta bort pubkvällar.</p><div className="pub-form__row"><label>E-post <input required type="email" autoComplete="username" value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value })} /></label><label>Lösenord <input required type="password" autoComplete="current-password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} /></label></div><button className="button button--burgundy" disabled={busy}>{busy ? 'Loggar in…' : 'Logga in'}</button></form>
          : <><p className="pub-admin__hint">{isSharedCalendar ? 'Ändringar publiceras för alla besökare direkt.' : 'Det här är ett lokalt redigeringsläge utan lösenord. Ändringar syns enbart i denna webbläsare.'}</p>
          <div className="pub-admin__tools"><button type="button" className="pub-admin__new" onClick={startNewShift}>+ Ny pubkväll</button>{currentShift && <button type="button" className="pub-admin__new" onClick={() => setEditor({ ...currentShift })}>Redigera valt datum</button>}</div>
          <form onSubmit={submitShift} className="pub-form pub-admin__form"><div className="pub-form__row"><label>Datum <input type="date" required min={today()} value={editor.date} onChange={e => setEditor({ ...editor, date: e.target.value })} /></label><label>Antal funktionärer som behövs <input type="number" min="0" max="100" required value={editor.helpers_needed} onChange={e => setEditor({ ...editor, helpers_needed: e.target.value })} /></label></div>
            <div className="pub-form__row"><label>Puben öppnar <input type="time" required value={editor.opens} onChange={e => setEditor({ ...editor, opens: e.target.value })} /></label><label>Puben stänger <input type="time" required value={editor.closes} onChange={e => setEditor({ ...editor, closes: e.target.value })} /></label></div>
            <div className="pub-form__row"><label>Arbetspass från <input type="time" required value={editor.work_from} onChange={e => setEditor({ ...editor, work_from: e.target.value })} /></label><label>Arbetspass till <input type="time" required value={editor.work_to} onChange={e => setEditor({ ...editor, work_to: e.target.value })} /></label></div>
            <label>Information (valfritt) <textarea rows="3" maxLength="1000" placeholder="T.ex. pubtema eller samlingstid" value={editor.notes} onChange={e => setEditor({ ...editor, notes: e.target.value })} /></label>
            <div className="pub-admin__actions"><button type="submit" className="button button--burgundy" disabled={busy}>{busy ? 'Sparar…' : editor.id ? 'Spara ändringar' : 'Publicera pubkväll'}</button>{editor.id && <button type="button" className="pub-admin__danger" disabled={busy} onClick={removeShift}>Ta bort pubkväll</button>}</div>
          </form>
          {isSharedCalendar && currentShift && <div className="pub-admin__signups"><div className="pub-admin__signups-head"><h4>Anmälningar – {displayDate(selected)}</h4><button type="button" onClick={viewSignups} disabled={signupLoading}>{signupLoading ? 'Hämtar…' : 'Visa / uppdatera anmälningar'}</button></div>
            {signups.length ? <div className="pub-admin__signup-list">{signups.map(person => <div key={person.id}><span><strong>{person.name}</strong><small>{person.contact_method}: {person.contact_value}</small></span><button type="button" onClick={() => eraseSignup(person.id)}>Radera</button></div>)}</div> : <p>Inga anmälningar visas. Klicka på knappen för att hämta dem.</p>}
          </div>}</>}
      </section>}
    </div></section>
  </>;
}
