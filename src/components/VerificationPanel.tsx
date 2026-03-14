import { ThumbsUp, Clock, AlertTriangle, XCircle } from "lucide-react";

interface VerificationPanelProps {
  votes: {
    completed: number;
    inProgress: number;
    delayed: number;
    notStarted: number;
  };
}

const VerificationPanel = ({ votes }: VerificationPanelProps) => {
  const total = votes.completed + votes.inProgress + votes.delayed + votes.notStarted;

  const options = [
    { label: "Completed", value: votes.completed, icon: ThumbsUp, color: "text-civic-green" },
    { label: "In Progress", value: votes.inProgress, icon: Clock, color: "text-accent" },
    { label: "Delayed", value: votes.delayed, icon: AlertTriangle, color: "text-civic-amber" },
    { label: "Not Started", value: votes.notStarted, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="surface-line pt-6">
      <h3 className="font-bold text-foreground mb-1">Citizen Verification</h3>
      <p className="text-xs text-muted-foreground mb-4">{total} citizens have voted</p>

      <div className="space-y-3">
        {options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.value / total) * 100) : 0;
          return (
            <button
              key={opt.label}
              className={`flex w-full items-center gap-3 border-t border-border pt-3 text-left transition-colors hover:text-twitter-blue ${opt.color}`}
            >
              <opt.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium flex-1 text-left">{opt.label}</span>
              <span className="text-xs font-bold">{pct}%</span>
              <span className="text-[10px] text-muted-foreground">({opt.value})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationPanel;
