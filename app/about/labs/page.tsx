import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { Server, Cpu, Zap, Bot, Shield, HardDrive, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Engineering Labs & Infrastructure | TEJAS Institute',
  description: 'Technical specifications of compute clusters, FPGA emulation, robotics, and cyber ranges at TEJAS Bhubaneswar.',
};

export default function LabsPage() {
  const labs = [
    {
      title: 'H100 / A100 GPU Compute Cluster',
      specs: [
        'Dedicated NVIDIA HGX H100 80GB SXM5 nodes',
        '100Gbps RoCE v2 & InfiniBand low-latency fabrics',
        'Ceph & Lustre parallel scratch storage (>50TB)',
        'Managed Slurm workload scheduler with priority fellow queues',
      ],
      icon: Server,
    },
    {
      title: 'Semiconductor & FPGA Emulation Bench',
      specs: [
        'Xilinx UltraScale+ MPSoC development boards',
        'High-speed logic analyzers & mixed-signal oscilloscopes',
        'Synopsys & Questa SystemVerilog verification tool suites',
        'Dedicated RISC-V hardware development kits',
      ],
      icon: Cpu,
    },
    {
      title: 'CleanTech EV & Battery Testing Lab',
      specs: [
        'High-precision programmable multi-channel cell cyclers',
        'Environmental thermal simulation chambers (-20°C to +80°C)',
        'Vector CANalyzer and Kvaser CAN/CAN-FD interfaces',
        'Active and passive cell balancing evaluation hardware',
      ],
      icon: Zap,
    },
    {
      title: 'Industrial Robotics & Smart Factory Testbed',
      specs: [
        'Industrial 6-axis articulated robot arms with gripper payloads',
        'Industrial 3D stereo-vision cameras for defect localization',
        'Siemens S7-1200 / S7-1500 PLC racks with OPC-UA connectivity',
        'Digital twin workstation running ROS2 Humble & NVIDIA Isaac Sim',
      ],
      icon: Bot,
    },
    {
      title: 'Zero-Trust SOC Cyber Range',
      specs: [
        'Wazuh enterprise SIEM with automated threat detection rules',
        'Isolated malware detonation and dynamic analysis sandbox',
        'eBPF runtime security telemetry with Falco and Cilium',
        'Hardware network traffic generators for DDoS and penetration drills',
      ],
      icon: Shield,
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            Hardware Immersion
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Frontier Compute &amp; Hardware Labs
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            TEJAS is equipped with institutional-grade hardware so fellows gain real-world execution experience from Day 1.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          {labs.map(lab => {
            const Icon = lab.icon;
            return (
              <div key={lab.title} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tejas-blue/10 text-tejas-blue">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-foreground">{lab.title}</h2>
                    <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
                      {lab.specs.map(spec => (
                        <li key={spec} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicShell>
  );
}
