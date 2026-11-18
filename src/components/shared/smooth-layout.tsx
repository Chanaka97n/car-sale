"use client";

import { ReactNode } from "react";
import { CursorGlow } from "./cursor-glow";
import { LoadingScreen } from "./loading-screen";

export function SmoothLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <CursorGlow />
      {children}
    </>
  );
}
