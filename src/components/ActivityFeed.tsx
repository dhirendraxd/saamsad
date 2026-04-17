import { MessageSquare, Camera, Clock } from "lucide-react";

interface ActivityItem {
  type: "comment" | "evidence" | "update" | "verification";
  author: string;
  content: string;
  date: string;
  ward?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const iconMap = {
  comment: MessageSquare,
  evidence: Camera,
  update: Clock,
  verification: Clock,
};

const colorMap = {
  comment: "bg-primary/10 text-primary",
  evidence: "bg-civic-green/10 text-civic-green",
  update: "bg-accent/10 text-accent",
  verification: "bg-civic-amber/10 text-civic-amber",
};

const displayConstituency = (value: string) => value.replace(/^Ward\b/i, "Constituency");

const ActivityFeed = ({ items }: ActivityFeedProps) => {
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const Icon = iconMap[item.type];
        return (
          <div key={i} className="surface-line flex gap-3 pt-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[item.type]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-foreground">{item.author}</span>
                {item.ward && <span className="text-[10px] text-muted-foreground">{displayConstituency(item.ward)}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.content}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{item.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
export type { ActivityItem };
