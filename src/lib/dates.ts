const longPostDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const shortPostDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function toUtcDate(date: string) {
  const match = dateOnlyPattern.exec(date);

  if (!match) {
    return new Date(date);
  }

  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function formatPostDate(date: string, style: 'long' | 'short' = 'long') {
  return style === 'long'
    ? longPostDateFormatter.format(toUtcDate(date))
    : shortPostDateFormatter.format(toUtcDate(date));
}
