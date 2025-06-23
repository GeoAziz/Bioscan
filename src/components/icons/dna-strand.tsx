import type { SVGProps } from 'react';

export function DnaStrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="dna-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <g stroke="url(#dna-gradient)">
        <path d="M 50,10 C 150,50 50,150 150,190" />
        <path d="M 150,10 C 50,50 150,150 50,190" />
        {[...Array(9)].map((_, i) => {
          const p = (i + 1) / 10;
          const x1 = 50 + 100 * p;
          const y1 = 10 + 40 * p + (90-Math.abs(p-0.5)*180) * (Math.sin(p * Math.PI * 2));
          const x2 = 150 - 100 * p;
          const y2 = 10 + 40 * p + (90-Math.abs(p-0.5)*180) * (Math.sin(p * Math.PI * 2 + Math.PI));
          const y_lerp = (t: number) => 10 + (190 - 10) * t;
          const cx_lerp1 = (t: number) => 50 + (150 - 50) * t;
          const cy_lerp1 = (t: number) => (y_lerp(t) + (50 + 100 * (t - 0.5) * (t - 0.5) * 4 * -40));
          const cx_lerp2 = (t: number) => 150 - (150 - 50) * t;
          
          const t = (i + 1) * 0.1;

          const p1x = 50 * (1 - t) * (1-t) * (1-t) + 150 * 3 * (1-t) * (1-t) * t + 50 * 3 * (1-t) * t * t + 150 * t*t*t;
          const p1y = 10 * (1 - t) * (1-t) * (1-t) + 50 * 3 * (1-t) * (1-t) * t + 150 * 3 * (1-t) * t * t + 190 * t*t*t;

          const p2x = 150 * (1 - t) * (1-t) * (1-t) + 50 * 3 * (1-t) * (1-t) * t + 150 * 3 * (1-t) * t * t + 50 * t*t*t;
          const p2y = 10 * (1 - t) * (1-t) * (1-t) + 50 * 3 * (1-t) * (1-t) * t + 150 * 3 * (1-t) * t * t + 190 * t*t*t;

          return <path key={i} d={`M ${p1x},${p1y} L ${p2x},${p2y}`} strokeWidth="2.5" opacity="0.7" />;
        })}
      </g>
    </svg>
  );
}
