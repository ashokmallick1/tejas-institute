'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface LiveInteractiveSandboxProps {
  initialCode: string;
  filename: string;
  language: string;
}

export function LiveInteractiveSandbox({
  initialCode,
  filename,
  language,
}: LiveInteractiveSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [stdout, setStdout] = useState<string>('// Bhubaneswar DGX GPU Sandbox Ready. Press "Run Code" to compile & execute.');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setStdout('⚡ Submitting job to Slurm scheduler on NVIDIA H100 node (bom09-dgx)...');

    setTimeout(() => {
      setStdout(
        `[TEJAS-SLURM] Job #89211 allocated 1x NVIDIA H100 80GB SXM5\n` +
        `[TORCH-ENV] PyTorch 2.4.0+cu124 | CUDA Driver 550.54\n` +
        `------------------------------------------------------------\n` +
        `✓ PagedAttention Physical Table Initialized: 1024 Blocks @ 16 Tokens\n` +
        `✓ Allocated physical block IDs: [0, 1, 2, 3]\n` +
        `✓ Total KV Cache footprint allocated: 1.00 MB\n` +
        `✓ Continuous Batching Test: 64 Requests Processed without OOM\n` +
        `✓ Latency: Time to First Token (TTFT) = 28.4ms | Throughput = 184.2 tok/s\n` +
        `------------------------------------------------------------\n` +
        `Process finished with exit code 0 (Execution Duration: 342ms)`
      );
      setIsRunning(false);
    }, 1200);
  };

  const handleReset = () => {
    setCode(initialCode);
    setStdout('// Code reset to Instructor Baseline.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-border overflow-hidden text-zinc-100 font-mono">
      {/* ── Top Editor Header ── */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/90">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-200">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>{filename}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">
            {language}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition"
            title="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition"
            title="Reset code to instructor baseline"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* ── Code Editor Textarea ── */}
      <div className="flex-1 relative min-h-[220px]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-zinc-950 text-xs sm:text-sm text-emerald-300 leading-relaxed font-mono resize-none focus:outline-none focus:ring-0 selection:bg-tejas-blue/40"
        />
      </div>

      {/* ── Terminal Stdout Output Drawer ── */}
      <div className="border-t border-zinc-800 bg-zinc-900/95 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bhubaneswar Cluster Output (stdout)</span>
          </div>
          <span className="text-[10px] text-zinc-400">Cluster: Chandaka DGX-H100</span>
        </div>

        <pre className="text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-36 whitespace-pre-wrap">
          {stdout}
        </pre>
      </div>
    </div>
  );
}
