export default function TimeAgo({ date, className = '' }) {
  if (!date) return null;

  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  let text;
  if (diffSec < 60) text = 'just now';
  else if (diffMin < 60) text = `${diffMin}m ago`;
  else if (diffHr < 24) text = `${diffHr}h ago`;
  else if (diffDay < 7) text = `${diffDay}d ago`;
  else if (diffWeek < 52) text = `${diffWeek}w ago`;
  else text = then.getFullYear().toString();

  return <span className={className}>{text}</span>;
}
