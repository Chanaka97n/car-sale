"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SvgDivider() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <svg
      ref={ref}
      className="w-full max-w-[1180px] mx-auto opacity-70"
      viewBox="0 0 1180 34"
      preserveAspectRatio="none"
      style={{ height: 34 }}
      aria-hidden="true"
    >
      <motion.path
        d="M0 17 L400 17 L430 4 L460 30 L490 17 L1180 17"
        fill="none"
        stroke="#e8590c"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 0.8, 0.28, 1] }}
      />
    </svg>
  );
}
