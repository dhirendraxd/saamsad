import { Camera, FileText } from "lucide-react";

interface EvidenceItem {
  type: "photo" | "document";
  title: string;
  uploadedBy: string;
  date: string;
}

interface EvidenceGalleryProps {
  items: EvidenceItem[];
}

const EvidenceGallery = ({ items }: EvidenceGalleryProps) => {
  return (
    <div className="surface-line pt-6">
      <h3 className="font-bold text-foreground mb-4">Evidence Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className="surface-line flex aspect-square flex-col items-center justify-center pt-4 text-center transition-colors cursor-pointer hover:border-foreground/30">
            {item.type === "photo" ? (
              <Camera className="w-8 h-8 text-muted-foreground mb-2" />
            ) : (
              <FileText className="w-8 h-8 text-muted-foreground mb-2" />
            )}
            <p className="text-xs font-medium text-foreground line-clamp-2">{item.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{item.uploadedBy}</p>
            <p className="text-[10px] text-muted-foreground">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceGallery;
