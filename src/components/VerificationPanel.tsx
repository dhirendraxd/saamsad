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
    { label: "Completed", value: votes.completed, icon: ThumbsUp, color: "bg-civic-green/10 text-civic-green border-civic-green/20" },
    { label: "In Progress", value: votes.inProgress, icon: Clock, color: "bg-accent/10 text-accent border-accent/20" },
    { label: "Delayed", value: votes.delayed, icon: AlertTriangle, color: "bg-civic-amber/10 text-civic-amber border-civic-amber/20" },
    { label: "Not Started", value: votes.notStarted, icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <h3 className="font-bold text-foreground mb-1">Citizen Verification</h3>
      <p className="text-xs text-muted-foreground mb-4">{total} citizens have voted</p>

      <div className="space-y-3">
        {options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.value / total) * 100) : 0;
          return (
            <button
              key={opt.label}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border ${opt.color} hover:opacity-80 transition-opacity`}
            >
              <opt.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium flex-1 text-left">{opt.label}</span>
              <span className="text-xs font-bold">{pct}%</span>
              <span className="text-[10px] opacity-70">({opt.value})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationPanel;
