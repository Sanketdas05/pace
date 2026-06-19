// src/components/ui/PriorityBadge.jsx

const config = {
  high: { label: 'High', class: 'priority-high' },
  medium: { label: 'Medium', class: 'priority-medium' },
  low: { label: 'Low', class: 'priority-low' },
};

export default function PriorityBadge({ priority, size = 'sm' }) {
  const { label, class: cls } = config[priority] || config.low;
  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${cls} ${sizeClass}`}>
      {label}
    </span>
  );
}
