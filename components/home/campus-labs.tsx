import React from 'react';
import Link from 'next/link';
import { MapPin, Server, Cpu, Zap, Bot, Shield, ArrowRight } from 'lucide-react';

export function CampusLabs() {
  const labs = [
    {
      name: 'NVIDIA GPU Cluster & Inference Lab',
      desc: 'Dedicated H100 and A100 GPU compute nodes with 100Gbps InfiniBand networking for distributed LLM training, fine-tuning, and vLLM benchmarking.',
      icon: Server,
      highlight: 'Multi-Node Slurm Orchestration',
    },
    {
      name: 'Semiconductor & FPGA Emulation Lab',
      desc: 'State-of-the-art Xilinx UltraScale+ FPGA synthesis boards and high-end EDA workstations for synthesizable RTL verification and RISC-V validation.',
      icon: Cpu,
      highlight: 'Hardware-in-the-Loop Emulation',
    },
    {
      name: 'EV Battery & Power Electronics Bench',
      desc: 'Precision multi-channel battery cyclers, thermal chambers, and CAN bus telemetry analyzers for lithium cell balancing and BMS firmware stress-testing.',
      icon: Zap,
      highlight: 'Active Cell Balancing Rig',
    },
    {
      name: 'Industrial Robotics & ROS2 Testbed',
      desc: '6-axis industrial articulated robot arms with synchronized machine vision cameras, OPC-UA industrial gateways, and Gazebo digital twin simulation.',
      icon: Bot,
      highlight: 'Sub-millimeter Vision Guidance',
    },
    {
      name: 'Zero-Trust SOC Cyber Range',
      desc: 'Air-gapped cyber operations center with real-time SIEM log ingestion, automated red/blue adversary simulation, and packet analysis.',
      icon: Shield,
      highlight: 'Live Adversarial Range',
    },
  ];

  return (
    <section className="border-t border-border bg-card/30 py-14 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-tejas-orange" />
            <span>Infocity Tech Corridor, Bhubaneswar, Odisha</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl font-display text-foreground">
            Frontier Physical &amp; Compute Infrastructure
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            True engineering mastery requires physical hardware. TEJAS maintains specialized laboratories designed for deep-tech immersion.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map(lab => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.name}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition hover:border-tejas-blue/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tejas-blue/10 text-tejas-blue">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-tejas-orange">
                  {lab.highlight}
                </div>
                <h3 className="mt-1 text-base font-bold text-foreground">
                  {lab.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {lab.desc}
                </p>
              </div>
            );
          })}

          {/* Campus Visit Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-muted/40 p-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-tejas-blue">
                Campus Immersion
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground">
                Visit Our Bhubaneswar Campus &amp; Labs
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Schedule an in-person tour of our engineering labs, review student demo stations, and meet faculty mentors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Link
                href="/about/labs"
                className="flex items-center gap-1.5 text-xs font-semibold text-tejas-blue hover:underline"
              >
                <span>Explore Lab Specifications</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
