import { type KeyboardEvent, useEffect, useState } from "react";
import { User, Award, MapPin } from "lucide-react";
import type { Politician } from "@/lib/api/contracts";

interface PoliticianCardProps {
  politician: Politician;
  onClick?: () => void;
  grayscalePhoto?: boolean;
  fadedText?: boolean;
  hoverLabel?: string;
}

const PoliticianCard = ({ politician, onClick, grayscalePhoto = false, fadedText = false, hoverLabel }: PoliticianCardProps) => {
  const fallbackPhotoSrc = "/generated/politician-portrait.webp";
  const resolvedPhotoSrc = politician.photo?.trim() || fallbackPhotoSrc;
  const [photoSrc, setPhotoSrc] = useState(resolvedPhotoSrc);
  const overlayTitleTone = fadedText ? "text-white/70" : "text-white";
  const overlayMetaTone = fadedText ? "text-white/60" : "text-white/85";
  const primaryTextTone = fadedText ? "text-foreground/70" : "text-foreground";
  const mutedTextTone = fadedText ? "text-muted-foreground/70" : "text-muted-foreground";

  useEffect(() => {
    setPhotoSrc(resolvedPhotoSrc);
  }, [resolvedPhotoSrc]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group surface-line relative overflow-hidden border-x border-border/40 bg-transparent transition-colors hover:border-accent/40 ${onClick ? "cursor-pointer focus:outline-none focus:ring-0 focus:border-accent/40" : ""}`}
    >
      <div className="relative h-64 w-full overflow-hidden border-b border-border/50 bg-neutral-100">
        <img
          src={photoSrc}
          alt={`${politician.name} profile`}
          className={`block h-full w-full object-cover object-center ${grayscalePhoto ? "grayscale" : ""}`}
          loading="lazy"
          onError={() => setPhotoSrc((current) => (current === fallbackPhotoSrc ? current : fallbackPhotoSrc))}
        />
        {hoverLabel && (
          <div className="pointer-events-none absolute left-3 top-3 border border-white/40 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            {hoverLabel}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
          <p className={`truncate text-xl font-extrabold ${overlayTitleTone}`}>{politician.name}</p>
          <p className={`truncate text-sm ${overlayMetaTone}`}>{politician.party}</p>
          <p className={`mt-1 truncate text-xs ${overlayMetaTone}`}>{politician.constituency}</p>
        </div>
      </div>

      <div className="flex items-start gap-4 p-4">
        <div className="w-14 h-14 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`truncate font-bold ${primaryTextTone}`}>{politician.name}</h3>
            {politician.verified && (
              <span className="w-4 h-4 rounded-full bg-twitter-blue flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] text-white">✓</span>
              </span>
            )}
          </div>
          <p className={`text-xs ${mutedTextTone}`}>{politician.party}</p>
          <div className={`mt-1 flex items-center gap-1 text-xs ${mutedTextTone}`}>
            <MapPin className="w-3 h-3" />
            <span>{politician.constituency}</span>
          </div>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-6 px-4 pb-4">
        <div className="border-t border-border pt-3 text-center">
          <p className={`text-lg font-extrabold ${fadedText ? "text-civic-green/70" : "text-civic-green"}`}>
            {politician.accountabilityScore}%
          </p>
          <p className={`text-[10px] ${mutedTextTone}`}>Accountability</p>
        </div>
        <div className="border-t border-border pt-3 text-center">
          <p className={`text-lg font-extrabold ${primaryTextTone}`}>
            {politician.completedPromises}/{politician.totalPromises}
          </p>
          <p className={`text-[10px] ${mutedTextTone}`}>Promises Kept</p>
        </div>
      </div>

      {politician.badges.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5 px-4 pb-4">
          {politician.badges.map((badge) => (
            <span key={badge} className={`inline-flex items-center gap-1 border-b border-border px-0 pb-0.5 text-[10px] font-medium ${primaryTextTone}`}>
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
