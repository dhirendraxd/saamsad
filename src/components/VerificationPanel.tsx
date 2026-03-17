import { ThumbsUp, Clock, AlertTriangle, XCircle } from "lucide-react";

interface VerificationPanelProps {
  votes: {
    completed?: number;
    inProgress?: number;
    delayed?: number;
    notStarted?: number;
  };
}

const VerificationPanel = ({ votes }: VerificationPanelProps) => {
  const totals = {
    completed: votes.completed ?? 0,
    inProgress: votes.inProgress ?? 0,
    delayed: votes.delayed ?? 0,
    notStarted: votes.notStarted ?? 0,
  };
  const total = totals.completed + totals.inProgress + totals.delayed + totals.notStarted;

  const options = [
    {
      label: "Completed",
      value: totals.completed,
      icon: ThumbsUp,
      labelColor: "text-civic-green",
      valueColor: "text-civic-green",
    },
    {
      label: "In Progress",
      value: totals.inProgress,
      icon: Clock,
      labelColor: "text-accent",
      valueColor: "text-accent",
    },
    {
      label: "Delayed",
      value: totals.delayed,
      icon: AlertTriangle,
      labelColor: "text-civic-amber",
      valueColor: "text-civic-green",
    },
    {
      label: "Not Started",
      value: totals.notStarted,
      icon: XCircle,
      labelColor: "text-destructive",
      valueColor: "text-destructive",
    },
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
              className="flex w-full items-center gap-3 border-t border-border pt-3 text-left text-foreground transition-colors hover:text-twitter-blue"
            >
              <opt.icon className={`w-4 h-4 flex-shrink-0 ${opt.labelColor}`} />
              <span className={`flex-1 text-left text-sm font-medium ${opt.labelColor}`}>{opt.label}</span>
              <span className={`text-xs font-bold ${opt.valueColor}`}>{pct}%</span>
              <span className="text-[10px] text-muted-foreground">({opt.value})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationPanel;
