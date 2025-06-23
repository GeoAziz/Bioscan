import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HologramBody } from '@/components/icons/hologram-body';

interface HolographicBodyViewProps {
  activePart: string | null;
  setActivePart: (part: string | null) => void;
}

const partNames: Record<string, string> = {
  head: "Head & Brain",
  torso: "Torso & Organs",
  "left-arm": "Left Arm",
  "right-arm": "Right Arm",
  "left-leg": "Left Leg",
  "right-leg": "Right Leg",
}

export default function HolographicBodyView({ activePart, setActivePart }: HolographicBodyViewProps) {
  return (
    <Card className="h-full flex flex-col bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline">
          Holographic View: <span className="text-primary">{activePart ? partNames[activePart] : 'Full Body'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <HologramBody 
          className="w-auto h-full max-h-[400px]"
          activePart={activePart}
          onPartHover={setActivePart}
        />
      </CardContent>
    </Card>
  );
}
