import {couple, venueAddress, type Ceremony} from '../content/wedding';

const toUtcStamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const escapeIcs = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

const eventTitle = (c: Ceremony) => `${c.name} — ${couple.groom} & ${couple.bride}`;

export function googleCalendarUrl(c: Ceremony) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(c),
    dates: `${toUtcStamp(c.start)}/${toUtcStamp(c.end)}`,
    details: `${c.subtitle}. ${c.line}`,
    location: venueAddress,
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(list: Ceremony[], filename = 'ankur-ekta-wedding.ics') {
  const now = toUtcStamp(new Date().toISOString());
  const events = list.map((c) => [
    'BEGIN:VEVENT',
    `UID:${c.id}-2026@ankur-ekta`,
    `DTSTAMP:${now}`,
    `DTSTART:${toUtcStamp(c.start)}`,
    `DTEND:${toUtcStamp(c.end)}`,
    `SUMMARY:${escapeIcs(eventTitle(c))}`,
    `DESCRIPTION:${escapeIcs(`${c.subtitle}. ${c.line}`)}`,
    `LOCATION:${escapeIcs(venueAddress)}`,
    'END:VEVENT',
  ].join('\r\n'));
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ankur & Ekta//Invitation//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], {type: 'text/calendar;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
