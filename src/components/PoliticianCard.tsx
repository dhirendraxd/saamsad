import { User, Award, MapPin } from "lucide-react";
import { type Politician, getScoreColor } from "@/data/mockData";

interface PoliticianCardProps {
  politician: Politician;
  onClick?: () => void;
}

const PoliticianCard = ({ politician, onClick }: PoliticianCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all cursor-pointer border border-transparent hover:border-accent/20 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground truncate">{politician.name}</h3>
            {politician.verified && (
              <span className="w-4 h-4 rounded-full bg-civic-green flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] text-civic-green-foreground">✓</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{politician.party}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{politician.constituency}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <p className={`text-lg font-extrabold ${getScoreColor(politician.accountabilityScore)}`}>
            {politician.accountabilityScore}%
          </p>
          <p className="text-[10px] text-muted-foreground">Accountability</p>
        </div>
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <p className="text-lg font-extrabold text-foreground">
            {politician.completedPromises}/{politician.totalPromises}
          </p>
          <p className="text-[10px] text-muted-foreground">Promises Kept</p>
        </div>
      </div>

      {politician.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {politician.badges.map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1 text-[10px] font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-full">
              <Award className="w-2.5 h-2.5" />
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliticianCard;
