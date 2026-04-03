interface WaveDividerProps {
  variant?: "primary" | "subtle" | "accent";
  flip?: boolean;
  className?: string;
}

const gradients: Record<string, { id: string; colors: [string, string, string] }> = {
  primary: { id: "wave-primary", colors: ["hsl(0 72% 51% / 0.6)", "hsl(0 72% 40% / 0.3)", "hsl(0 72% 51% / 0.1)"] },
  subtle: { id: "wave-subtle", colors: ["hsl(0 0% 15% / 0.8)", "hsl(0 0% 10% / 0.4)", "hsl(0 0% 7% / 0.1)"] },
  accent: { id: "wave-accent", colors: ["hsl(0 72% 51% / 0.4)", "hsl(0 50% 30% / 0.2)", "hsl(0 72% 51% / 0.05)"] },
};

const WaveDivider = ({ variant = "subtle", flip = false, className = "" }: WaveDividerProps) => {
  const g = gradients[variant];

  return (
    <div
      className={`w-full overflow-hidden leading-[0] pointer-events-none ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-[50px] sm:h-[70px] lg:h-[90px]"
      >
        <defs>
          <linearGradient id={g.id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={g.colors[0]} />
            <stop offset="50%" stopColor={g.colors[1]} />
            <stop offset="100%" stopColor={g.colors[2]} />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z"
          fill={`url(#${g.id})`}
        />
        <path
          d="M0,60 C300,90 600,20 900,55 C1100,80 1300,30 1440,70 L1440,100 L0,100 Z"
          fill={`url(#${g.id})`}
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
