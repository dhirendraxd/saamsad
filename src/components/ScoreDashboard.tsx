import { getScoreColor } from "@/data/mockData";

interface ScoreDashboardProps {
  accountability: number;
  transparency: number;
  communityTrust: number;
  engagement: number;
  completedPromises: number;
  totalPromises: number;
}

const ScoreRing = ({ value, label, size = 80 }: { value: number; label: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={value >= 80 ? "hsl(var(--civic-green))" : value >= 60 ? "hsl(var(--civic-amber))" : "hsl(var(--destructive))"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold ${getScoreColor(value)}`}>
          {value}
        </span>
      </div>
      <span className="text-[11px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
};

const ScoreDashboard = ({ accountability, transparency, communityTrust, engagement }: ScoreDashboardProps) => {
  return (
    <div className="surface-line pt-6">
      <h3 className="font-bold text-foreground mb-5">Performance Scores</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ScoreRing value={accountability} label="Accountability" />
        <ScoreRing value={transparency} label="Transparency" />
        <ScoreRing value={communityTrust} label="Community Trust" />
        <ScoreRing value={engagement} label="Engagement" size={80} />
      </div>
    </div>
  );
};

export default ScoreDashboard;
