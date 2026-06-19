// src/components/tasks/CircularProgress.jsx

export default function CircularProgress({ done, total, size = 52, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : done / total;
  const offset = circumference * (1 - pct);

  const color =
    pct >= 1 ? '#7C9082' : pct >= 0.5 ? '#D4A373' : '#A8615A';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <span
        className="absolute text-[10px] font-semibold"
        style={{ color: 'var(--color-charcoal)' }}
      >
        {done}/{total}
      </span>
    </div>
  );
}
