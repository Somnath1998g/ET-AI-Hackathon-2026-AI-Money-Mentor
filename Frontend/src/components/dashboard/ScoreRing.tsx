interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  label?: string;
}

export default function ScoreRing({ score, maxScore = 100, size = 140, label }: ScoreRingProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const color = score >= 70 ? "hsl(var(--finance-green))" : score >= 40 ? "hsl(var(--finance-orange))" : "hsl(var(--finance-red))";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--border))" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="font-heading text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground">/{maxScore}</span>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
