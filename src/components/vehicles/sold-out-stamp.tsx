import { useId } from "react";
import { cn } from "cn";

const STAMP_FONT = "Impact, 'Arial Black', 'Helvetica Neue', sans-serif";

/**
 * Text curved around the stamp's centre (100,100), one glyph per letter. Done by
 * hand rather than with <textPath> so it renders identically in every SVG engine.
 * Top text reads left→right over the top with glyphs pointing outward; bottom text
 * reads left→right under the bottom with glyphs pointing inward.
 */
function ArcText({
  text,
  radius,
  side,
  fontSize = 25,
}: {
  text: string;
  radius: number;
  side: "top" | "bottom";
  fontSize?: number;
}) {
  // Approximate advance for a condensed heavy face + tracking, as an angle on this radius.
  const advance = (ch: string) => (ch === " " ? fontSize * 0.45 : fontSize * 0.62);
  const widths = [...text].map(advance);
  const total = widths.reduce((a, b) => a + b, 0);
  const span = total / radius; // radians covered by the whole string

  let offset = 0;
  return (
    <>
      {[...text].map((ch, i) => {
        const centreOfGlyph = offset + widths[i] / 2;
        offset += widths[i];
        if (ch === " ") return null;
        // Top: sweep clockwise centred on 12 o'clock (-90°). Bottom: anticlockwise centred on 6 o'clock (90°).
        const angle =
          side === "top"
            ? -Math.PI / 2 - span / 2 + centreOfGlyph / radius
            : Math.PI / 2 + span / 2 - centreOfGlyph / radius;
        const x = 100 + radius * Math.cos(angle);
        const y = 100 + radius * Math.sin(angle);
        const rotate = (angle * 180) / Math.PI + (side === "top" ? 90 : -90);
        return (
          <text
            key={i}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            transform={`rotate(${rotate.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})`}
            fontFamily={STAMP_FONT}
            fontSize={fontSize}
            fontWeight="900"
            textAnchor="middle"
            stroke="none"
          >
            {ch}
          </text>
        );
      })}
    </>
  );
}

/**
 * Red rubber-stamp "SOLD OUT" badge (double ring, curved text, stars and a
 * tilted banner) drawn as inline SVG so it stays crisp at any size.
 *
 * Use <SoldOutOverlay> to stamp it over a vehicle image.
 */
export function SoldOutStamp({
  className,
  /** Faint white disc behind the stamp so it reads on busy photos. */
  backdrop = true,
}: {
  className?: string;
  backdrop?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const grunge = `sos-grunge-${uid}`;
  const red = "#c62828";

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Sold out"
      className={cn("pointer-events-none select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]", className)}
    >
      <defs>
        {/* Worn ink: mostly solid with sparse knocked-out specks (sharp alpha threshold on noise). */}
        <filter id={grunge} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="7" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 4.6"
            result="mask"
          />
          <feComposite in="SourceGraphic" in2="mask" operator="in" />
        </filter>
      </defs>

      {backdrop && <circle cx="100" cy="100" r="97" fill="white" opacity="0.55" />}

      {/* Rings, curved text and stars */}
      <g transform="rotate(-16 100 100)" filter={`url(#${grunge})`} fill={red} stroke={red}>
        <circle cx="100" cy="100" r="93" fill="none" strokeWidth="6" />
        <circle cx="100" cy="100" r="56" fill="none" strokeWidth="3" />

        <ArcText text="SOLD OUT" radius={72} side="top" />
        <ArcText text="SOLD OUT" radius={86} side="bottom" />

        <text x="100" y="66" fontSize="13" textAnchor="middle" stroke="none" letterSpacing="4">
          ★★★★★
        </text>
        <text x="100" y="146" fontSize="13" textAnchor="middle" stroke="none" letterSpacing="4">
          ★★★★★
        </text>
      </g>

      {/* Banner backing — solid (unfiltered) so it cleanly covers the rings behind it */}
      <rect
        transform="rotate(-16 100 100)"
        x="6"
        y="74"
        width="188"
        height="52"
        rx="6"
        fill="white"
        fillOpacity="0.93"
      />

      {/* Banner ink */}
      <g transform="rotate(-16 100 100)" filter={`url(#${grunge})`} fill={red} stroke={red}>
        <rect x="6" y="74" width="188" height="52" rx="6" fill="none" strokeWidth="6" />
        <rect x="14" y="81" width="172" height="38" rx="3" fill="none" strokeWidth="2" />
        <text
          x="100"
          y="101"
          fontFamily="Impact, 'Arial Black', 'Helvetica Neue', sans-serif"
          fontSize="36"
          fontWeight="900"
          letterSpacing="2"
          stroke="none"
          textAnchor="middle"
          dominantBaseline="central"
        >
          SOLD OUT
        </text>
      </g>
    </svg>
  );
}

/**
 * Stamps a sold vehicle's image in its bottom-left corner. Place inside a
 * `relative` container; renders nothing when the vehicle isn't sold.
 */
export function SoldOutOverlay({
  sold,
  size = "md",
  className,
}: {
  sold: boolean | undefined;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  if (!sold) return null;
  const sizes = {
    xs: "w-7",
    sm: "w-16 sm:w-20",
    md: "w-20 sm:w-24",
    lg: "w-28 sm:w-36",
  } as const;
  const offsets = {
    xs: "bottom-0.5 left-0.5",
    sm: "bottom-2 left-2",
    md: "bottom-3 left-3",
    lg: "bottom-4 left-4",
  } as const;
  return (
    <div className={cn("pointer-events-none absolute z-10", offsets[size], className)}>
      <SoldOutStamp className={cn(sizes[size], "h-auto")} backdrop={size !== "xs"} />
    </div>
  );
}
