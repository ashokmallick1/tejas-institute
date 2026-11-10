'use client';

import React from 'react';

const ITEMS = [
  'Generative AI Engineering',
  'MLOps & LLMOps',
  'Agentic AI Systems',
  'GPU Cloud Infrastructure',
  'Platform Engineering',
  'Kubernetes & DevOps',
  'Cloud Architecture',
  'Cybersecurity & SOC',
  'VLSI RTL Design',
  'Embedded & 5G',
  'EV & BMS Engineering',
  'Industrial Robotics',
  'AI Full-Stack',
  'GIS & GeoAI',
  'HealthTech & FHIR',
  'Data Engineering',
  'Cloud FinOps',
];

interface MarqueeTickerProps {
  speed?: number; // seconds for one full loop
  label?: string;
}

export function MarqueeTicker({ speed = 35, label }: MarqueeTickerProps) {
  // Duplicate for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden">
      {label && (
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[1.8px] text-muted-foreground">
          {label}
        </p>
      )}
      {/* Gradient mask — Scaler production pattern */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div
          className="flex gap-2 whitespace-nowrap"
          style={{ animation: `marqueeScroll ${speed}s linear infinite` }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shrink-0 hover:border-tejas-blue/40 hover:text-foreground transition-colors cursor-default"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-tejas-blue/60 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
