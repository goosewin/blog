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
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: ${date}`);
    }

    return parsed;
  }

  const [, year, month, day] = match;
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const parsed = new Date(Date.UTC(numericYear, numericMonth - 1, numericDay));

  if (
    parsed.getUTCFullYear() !== numericYear ||
    parsed.getUTCMonth() !== numericMonth - 1 ||
    parsed.getUTCDate() !== numericDay
  ) {
    throw new Error(`Invalid calendar date: ${date}`);
  }

  return parsed;
}

export function formatPostDate(date: string, style: 'long' | 'short' = 'long') {
  return style === 'long'
    ? longPostDateFormatter.format(toUtcDate(date))
    : shortPostDateFormatter.format(toUtcDate(date));
}
