'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, CheckCircle2, Play, RefreshCw, Cpu, Server, ShieldCheck } from 'lucide-react';

interface CommandOutput {
  command: string;
  lines: { text: string; color?: string; delay?: number }[];
}

const PRESET_COMMANDS: Record<string, CommandOutput> = {
  'cluster-status': {
    command: 'tejas cluster status --region bhubaneswar-01',
    lines: [
      { text: '[INFO] Connecting to TEJAS Chandaka GPU & Compute Datacenter...', color: 'text-muted-foreground' },
      { text: '✓ Authenticated: Fellow session valid (ID: FELLOW-2026-AI)', color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: 'NODE POOL                     ACCELERATOR         STATUS    ALLOCATED', color: 'text-foreground font-bold' },
      { text: 'dgx-h100-node-01              8x NVIDIA H100 80GB ONLINE    72% VRAM (Distributed Training)', color: 'text-emerald-400' },
      { text: 'dgx-a100-node-02              8x NVIDIA A100 80GB ONLINE    88% VRAM (vLLM Inference Cluster)', color: 'text-emerald-400' },
      { text: 'k8s-platform-plane-01         64 vCPU, 256GB RAM  ONLINE    Ready (Istio Service Mesh v1.22)', color: 'text-sky-400' },
      { text: 'fpga-silicon-lab-03           Xilinx UltraScale+  ONLINE    Synthesis Queue Active', color: 'text-amber-400' },
      { text: '', color: '' },
      { text: '★ Quota Remaining: 42.5 GPU-Hours allocated for this sprint.', color: 'text-tejas-flame font-semibold' },
    ],
  },
  'verify-rag': {
    command: 'tejas bench --model llama3-8b --task hybrid-rag --qps 150',
    lines: [
      { text: '[BENCH] Initializing synthetic load generator (150 concurrent QPS)...', color: 'text-muted-foreground' },
      { text: '✓ Vector Retrieval: Milvus HNSW dense + BM25 sparse fusion', color: 'text-sky-400' },
      { text: '✓ FlashAttention-2 enabled | KV cache quantized FP8', color: 'text-emerald-400' },
      { text: '------------------------------------------------------------', color: 'text-muted-foreground' },
      { text: 'METRIC                        BASELINE        TEJAS OPTIMIZED', color: 'text-foreground font-bold' },
      { text: 'p50 First Token Latency       142 ms          18.4 ms   (7.7x faster)', color: 'text-emerald-400' },
      { text: 'p99 End-to-End Latency        850 ms          68.1 ms   (12.4x faster)', color: 'text-emerald-400' },
      { text: 'Throughput (tokens/sec)       410 tok/s       4,820 tok/s', color: 'text-emerald-400' },
      { text: 'Hallucination Guardrail Pass  84.2%           99.8%     (Strict RFC-89)', color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: '✓ Benchmark passed. Capstone deliverable certified for Demo Day.', color: 'text-emerald-400 font-bold' },
    ],
  },
  'mentor-review': {
    command: 'tejas review --pr #104 --fellow ananya-das',
    lines: [
      { text: '[AUDIT] Fetching Pull Request #104 from GitHub: "feat/distributed-bms-firmware"', color: 'text-muted-foreground' },
      { text: '✓ AST Static Analysis: 0 security vulnerabilities detected', color: 'text-emerald-400' },
      { text: '✓ ISO 26262 ASIL-B compliance rules: PASSED', color: 'text-emerald-400' },
      { text: '✓ Extended Kalman Filter state-of-charge error: ±0.8% (Target < 1.0%)', color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: 'MENTOR ANNOTATION (Chief Architect - Mobility):', color: 'text-tejas-orange font-bold' },
      { text: ' "Clean CAN-bus interrupt handler. Memory footprint fits STM32 RAM budget."', color: 'text-foreground italic' },
      { text: ' "Approved for production bench demonstration. Proceed to Hardware Lab 2."', color: 'text-foreground italic' },
      { text: '', color: '' },
      { text: 'Status: PR MERGED → Artifact deployed to Bhubaneswar Test Bench.', color: 'text-emerald-400 font-semibold' },
    ],
  },
  'fde-deploy': {
    command: 'tejas fde-deploy --client enterprise-bank --integration salesforce-sap',
    lines: [
      { text: '[FDE] Initiating Forward Deployment pipeline for Enterprise Client...', color: 'text-muted-foreground' },
      { text: '✓ Client VPC Peering established over AWS Direct Connect', color: 'text-sky-400' },
      { text: '✓ Schema mapping: 50,000 daily transaction records validated', color: 'text-emerald-400' },
      { text: '✓ Dead-letter queue & automatic retry handler mounted', color: 'text-emerald-400' },
      { text: '✓ Enterprise SSO (SAML 2.0 / Okta) integration: VERIFIED', color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: 'DEPLOYMENT REPORT: Zero downtime cutover achieved. SLA 99.99% active.', color: 'text-emerald-400 font-bold' },
      { text: 'Client sign-off completed by Enterprise Technical Account Lead.', color: 'text-muted-foreground' },
    ],
  },
};

export function InteractiveTerminal() {
  const [activeKey, setActiveKey] = useState<keyof typeof PRESET_COMMANDS>('cluster-status');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeCmd = PRESET_COMMANDS[activeKey] || PRESET_COMMANDS['cluster-status'];

  useEffect(() => {
    setDisplayedLines([]);
    setIsTyping(true);

    const cmd = PRESET_COMMANDS[activeKey] || PRESET_COMMANDS['cluster-status'];
    const linesToType = cmd?.lines || [];
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < linesToType.length) {
        const lineItem = linesToType[currentIdx];
        if (lineItem) {
          const lineText = lineItem.text;
          setDisplayedLines(prev => [...prev, lineText]);
        }
        currentIdx++;
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [activeKey]);

  return (
    <section className="border-t border-border bg-card/20 py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-500">
            <TerminalIcon className="h-3.5 w-3.5" />
            <span>Interactive Engineering Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-foreground">
            Experience the <span className="gradient-brand">TEJAS Cloud Lab</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Fellows work directly on live clusters, FPGA synthesizers, and enterprise deployment ranges. Try running commands on our simulated Bhubaneswar infrastructure:
          </p>
        </div>

        {/* Command Selector Buttons: Touch-friendly horizontal scroll on mobile, centered on desktop */}
        <div className="mt-8 sm:mt-10 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar scroll-touch px-1 pb-2">
          {[
            { key: 'cluster-status', label: 'GPU Cluster Status', icon: Server },
            { key: 'verify-rag', label: 'RAG Benchmark', icon: Cpu },
            { key: 'mentor-review', label: 'Mentor Review', icon: ShieldCheck },
            { key: 'fde-deploy', label: 'FDE Rollout', icon: Sparkles },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveKey(key as keyof typeof PRESET_COMMANDS)}
              className={`inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeKey === key
                  ? 'bg-tejas-blue text-white shadow-md scale-102 sm:scale-105'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Terminal Window */}
        <div className="mt-6 sm:mt-8 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-[#08090a] shadow-2xl">
          {/* Mac/Linux Window Header */}
          <div className="flex items-center justify-between border-b border-border/40 bg-[#0f1011] px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/80 shrink-0" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500/80 shrink-0" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500/80 shrink-0" />
              <span className="ml-1.5 sm:ml-2 text-[11px] sm:text-xs font-mono text-muted-foreground truncate">
                tejas-cli v2.6.4 <span className="hidden sm:inline">— fellow@bhubaneswar-lab-cluster:~</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-muted-foreground shrink-0 ml-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Terminal Body with horizontal scroll protection for tables */}
          <div
            ref={terminalRef}
            className="h-[300px] sm:h-[340px] overflow-y-auto overflow-x-auto p-3.5 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed space-y-1 scroll-touch"
          >
            {/* Prompt line */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-muted-foreground">
              <span className="text-tejas-flame font-bold">tejas<span className="hidden sm:inline">-fellow@cluster</span></span>
              <span className="text-muted-foreground/60">:</span>
              <span className="text-sky-400">~/repo</span>
              <span className="text-muted-foreground/60">$</span>
              <span className="text-foreground font-semibold break-all sm:break-normal">{activeCmd.command}</span>
            </div>

            {/* Output lines */}
            <div className="pt-2 space-y-0.5">
              {displayedLines.map((line, i) => {
                const spec = activeCmd?.lines?.[i];
                return (
                  <div key={i} className={spec?.color || 'text-foreground'}>
                    {line || <>&nbsp;</>}
                  </div>
                );
              })}
              {isTyping && (
                <span className="inline-block h-4 w-2 bg-tejas-blue animate-pulse ml-0.5" />
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="flex flex-wrap items-center justify-between border-t border-border/40 bg-[#0c0d0e] px-4 py-2.5 text-[11px] font-mono text-muted-foreground">
            <div>
              Status: <span className="text-emerald-400 font-semibold">Ready for deployment</span> · Hardware: Chandaka GPU DC
            </div>
            <div className="text-tejas-blue font-semibold hover:underline cursor-pointer">
              Run custom code on Bhubaneswar Cluster &rarr;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
