// Calendar helper for date invite (.ics and Google Calendar link)

export function generateGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  dateStr: string,
  senderName: string
): string {
  // Try to parse or default to upcoming Saturday
  const base = new Date();
  base.setDate(base.getDate() + ((6 - base.getDay() + 7) % 7 || 7));
  base.setHours(10, 30, 0, 0);

  const startIso = base.toISOString().replace(/-|:|\.\d\d\d/g, '');
  base.setHours(22, 0, 0, 0);
  const endIso = base.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: `${details}\n\nPrepared with love by ${senderName}.`,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  title: string,
  details: string,
  location: string,
  senderName: string
) {
  const now = new Date();
  const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  start.setHours(10, 30, 0, 0);
  const end = new Date(start.getTime() + 12 * 60 * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${senderName}//Special Date Invitation//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Special-Date-Invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
