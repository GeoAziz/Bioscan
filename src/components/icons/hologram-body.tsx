import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

type HologramBodyProps = SVGProps<SVGSVGElement> & {
  activePart?: string | null;
  onPartHover: (part: string | null) => void;
};

export function HologramBody({ activePart, onPartHover, className, ...props }: HologramBodyProps) {
  const partClasses = "transition-all duration-300 ease-in-out cursor-pointer";
  const activePartClasses = "fill-primary/70 stroke-primary";
  const inactivePartClasses = "fill-primary/10 stroke-primary/60 hover:fill-primary/30";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 400"
      className={cn("hologram", className)}
      {...props}
      data-ai-hint="human body"
    >
      <g onMouseLeave={() => onPartHover(null)}>
        {/* Head */}
        <path
          id="head"
          d="M100 60 C80 60, 70 80, 70 95 S80 130, 100 130 S120 130, 130 95 S120 60, 100 60Z"
          className={cn(partClasses, activePart === 'head' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('head')}
        />
        {/* Torso */}
        <path
          id="torso"
          d="M80 135 L70 240 Q75 250, 100 250 Q125 250, 130 240 L120 135Z"
          className={cn(partClasses, activePart === 'torso' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('torso')}
        />
        {/* Left Arm */}
        <path
          id="left-arm"
          d="M75 140 L65 145 L50 220 L60 225Z"
          className={cn(partClasses, activePart === 'left-arm' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('left-arm')}
        />
        {/* Right Arm */}
        <path
          id="right-arm"
          d="M125 140 L135 145 L150 220 L140 225Z"
          className={cn(partClasses, activePart === 'right-arm' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('right-arm')}
        />
        {/* Left Leg */}
        <path
          id="left-leg"
          d="M75 245 L80 350 L70 360 L65 250Z"
          className={cn(partClasses, activePart === 'left-leg' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('left-leg')}
        />
        {/* Right Leg */}
        <path
          id="right-leg"
          d="M125 245 L120 350 L130 360 L135 250Z"
          className={cn(partClasses, activePart === 'right-leg' ? activePartClasses : inactivePartClasses)}
          onMouseEnter={() => onPartHover('right-leg')}
        />
      </g>
    </svg>
  );
}
