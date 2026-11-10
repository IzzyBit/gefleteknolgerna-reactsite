// Image URLs point to the public files used by the original website.
// Download the assets into public/images/ and change the paths for offline hosting.
const uploads = 'https://usercontent.one/wp/gefleteknologerna.se/wp-content/uploads/';
export const media = {
  logo: uploads + 'logogtech_ai_02-ai_-200x114.png',
  logoLarge: uploads + 'logogtech_ai_02-ai_.png',
  cover: uploads + 'FBGroupCover.jpg',
  trossen: uploads + 'Trossen_Bilder_01.png',
  membership: uploads + 'GS-logga-scaled.jpeg',
  futurum: uploads + 'Futurum-text-bordeaux356jpeg-1.jpg',
  storaEnso: uploads + 'Stora-Enso-logga-2023-10-17-e1701209447377.png',
  monitor: uploads + '042961aa-aa43-46b9-bea9-df66990af0d4.jpg'
};

export const email = 'info@gefleteknologerna.se';
export const socials = {
  instagram: 'https://www.instagram.com/gefleteknologerna/',
  facebook: 'https://www.facebook.com/GefleteknologernaHiG/',
  hitract: 'https://hitract.se/',
  studentkar: 'https://geflestudentkar.se/'
};

export const memberBenefits = [
  'Stöd och representation i utbildningsfrågor',
  'Medlemsaktiviteter, sittningar och pubkvällar',
  'Möjlighet att påverka studentlivet',
  'Medlemspriser och särskilda arrangemang',
  'Möjlighet att köpa teknologoverall',
  'Kaffe på Trossen'
];

export const governingDocs = [
  { title: 'Husregler', path: '/husregler', description: 'Det här gäller när du besöker Trossen.' },
  { title: 'Historia', path: '/historia', description: 'Från Sandvikenteknologerna till dagens Gtech.' },
  { title: 'Föreskrifter', path: '/foreskrifter', description: 'Föreningens traditioner, ansvar och verksamhet.' },
  { title: 'Stadgar', path: '/stadgar', description: 'Regler för sektionens organisation och beslut.' }
];

export const faq = [
  {
    q: 'När kan jag anmäla mig som phadder?',
    a: 'Anmälan brukar publiceras på Instagram och Hitract under våren. Efter ansökan får du information via mejl. Kontrollera föreningens aktuella kanaler för årets datum.'
  },
  {
    q: 'Vad gör jag om jag har fått förhinder?',
    a: 'Meddela introduktionsansvariga så snart som möjligt på alderman@gefleteknologerna.se.'
  },
  {
    q: 'Behöver jag gå phadderutbildningen?',
    a: 'Ja, deltagande i den obligatoriska utbildningen krävs för att få vara phadder. Datum meddelas av arrangörerna.'
  },
  {
    q: 'Kan jag önska att vara i samma grupp som en vän?',
    a: 'I tidigare anmälningar har det gått att önska en person. Exakt gruppindelning och regler bestäms inför respektive inspark.'
  },
  {
    q: 'Kan jag vara phadder om jag arbetar under veckan?',
    a: 'Det är ofta möjligt att delta under delar av veckan. Meddela ansvariga och din phaddergrupp när du är tillgänglig.'
  },
  {
    q: 'Behöver jag ha en overall?',
    a: 'Föreningen brukar ordna möjlighet att köpa overall före insparken. Se aktuella uppgifter i deras sociala kanaler.'
  },
  {
    q: 'Vad händer om jag aldrig arbetat på Trossen?',
    a: 'Du får introduktion till ditt arbetspass på plats av de ansvariga. Schema och närmare instruktioner kommuniceras innan veckan.'
  }
];

export const events = [
  { date: '13 feb 2025', title: 'Gefleteknologernas årsmöte 2025', time: '17:00–20:00', place: 'Sal 33:202, Högskolan i Gävle', desc: 'Årsmöte med möjlighet för medlemmar att påverka sektionens arbete och lämna motioner.' },
  { date: '13 feb 2024', title: 'Årsmöte 2024', time: '17:00', place: 'Sal 33:202, Högskolan i Gävle', desc: 'Medlemmar samlades för beslut om verksamhet, budget och föreningens framtid.' },
  { date: '9 nov 2023', title: 'Skiftesmötet 2023', time: '17:00', place: 'Trossen, Regementsvägen 25', desc: 'Val av förtroendevalda och ny styrelse för kommande verksamhetsår.' }
];

export const board2024 = [
  ['Lukas Ingeltorp', 'Ordförande'],
  ['Matilda Karlsson', 'Vice ordförande'],
  ['Filip Blomsterberg', 'Kassör'],
  ['Fredrik Mickelsson', 'Vice ordförande Näringsliv (spons)'],
  ['Marcus Persson', 'Vice ordförande Näringsliv (Futurum)'],
  ['Paulina Engvall', 'Ordförande Intro'],
  ['Albin Söderlund', 'Vice ordförande Intro'],
  ['Izzy Cahling', 'Ordförande Marknadsföring'],
  ['Charlie Larsson', 'Vice ordförande Marknadsföring'],
  ['Kalle Aalto', 'Ordförande Utbildning'],
  ['David Johansson', 'Vice ordförande Utbildning'],
  ['Elias', 'Ordförande Sexmästeriet'],
  ['Elisa Kvarnström', 'Vice ordförande Sexmästeriet och Toast'],
  ['William Pettersson', 'Ordförande Lokal'],
  ['Anton Köijer', 'Vice ordförande Lokal'],
  ['Texas Tannemark', 'Inköpsansvarig'],
  ['Oliver Lans', 'Ledamot'],
  ['Henrik Lugnet', 'Ledamot'],
  ['Adam Johansson', 'Ledamot']
];

export const board2023 = [
  ['Jakob Salomonsson', 'Ordförande'],
  ['Lukas Ingeltorp', 'Vice ordförande'],
  ['Daniel Vidmark', 'Kassör'],
  ['Maximillian Tigerstrand', 'Ordförande Intro'],
  ['Axel Asp', 'Vice ordförande Intro'],
  ['Paulina Engvall', 'Ordförande Marknadsföring'],
  ['Izzy Cahling', 'Vice ordförande Marknadsföring'],
  ['Kalle Aalto', 'Toast och ordförande Utbildning'],
  ['Dennis Wilén', 'Ordförande Sexmästeriet'],
  ['Albin Söderlund', 'Vice ordförande Sexmästeriet'],
  ['William Pettersson', 'Ordförande Lokal'],
  ['Matilda Karlsson', 'Vice ordförande Lokal'],
  ['Anton Köijer', 'Inköpsansvarig och ordförande Näringsliv'],
  ['Charlie Larsson', 'Ledamot']
];

export const history = [
  ['1986', 'Teknologerna i Sandviken organiserar sig. De första mottagningsaktiviteterna och studenttraditionerna tar form.'],
  ['1987', 'Den första examensringen tas fram och en tidig arbetsmarknadsdag arrangeras.'],
  ['1994', 'När teknikutbildningarna flyttar till Gävle går Sandvikenteknologerna och Gefletec samman och bildar Gefleteknologerna.'],
  ['2014', 'Föreningen flyttar från Röda BARacken till Trossen, som fortfarande är samlingsplatsen för många aktiviteter.'],
  ['2022', 'Gefleteknologerna blir en sektion under Gefle Studentkår.']
];

export const boardYears = [2024, 2023];
