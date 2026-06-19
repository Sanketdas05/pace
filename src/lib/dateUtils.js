export function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
  const options = { month: 'short', day: 'numeric' };
  if (timeStr) {
    options.hour = 'numeric';
    options.minute = '2-digit';
  } else {
    options.year = 'numeric';
  }
  return d.toLocaleDateString('en-US', options);
}

export function formatTimeOnly(timeStr) {
  if (!timeStr) return '';
  const d = new Date(`1970-01-01T${timeStr}`);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function getTimeRemaining(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const target = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diffMs = target - now;
  
  if (diffMs <= 0) return { text: 'Overdue', isUrgent: true, color: 'var(--color-high-dot)', animate: true };
  
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours > 24) return null; // Only show countdown if < 24h
  
  const h = Math.floor(diffHours);
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let color = null;
  let animate = false;
  
  if (h === 0) {
    if (m <= 5) { color = '#DC2626'; animate = true; } // < 5 mins, flashing red
    else if (m <= 10) color = '#EF4444'; // < 10 mins, red
    else if (m <= 15) color = '#F97316'; // < 15 mins, orange
    else if (m <= 30) color = '#F59E0B'; // < 30 mins, amber
    else color = 'var(--color-medium-dot)'; // < 1 hour, theme yellow
  } else if (diffHours <= 1) {
    color = 'var(--color-medium-dot)';
  }
  
  const isUrgent = diffHours <= 1; // Less than 1 hour is urgent
  
  if (h === 0) return { text: `Due in ${m}m`, isUrgent, color, animate };
  return { text: `Due in ${h}h ${m}m`, isUrgent, color, animate };
}

export function isOverdue(dateStr, timeStr) {
  if (!dateStr) return false;
  const target = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
  const now = new Date();
  if (!timeStr) {
    target.setDate(target.getDate() + 1); // If no time, overdue next day
  }
  return target < now;
}
