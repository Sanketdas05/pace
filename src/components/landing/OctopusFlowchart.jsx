import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Terminal,
  Users,
  Activity,
  Calendar,
  Database,
  BarChart2,
  Share2,
  Workflow
} from 'lucide-react';

const lifecycleStages = [
  {
    id: "stage-1",
    stage: "01",
    title: "Instant Ingestion",
    category: "Command Parser",
    desc: "Type /task, /update, or natural text. Keystrokes are parsed instantly into typed task records.",
    icon: Terminal,
    side: "left",
  },
  {
    id: "stage-2",
    stage: "02",
    title: "AI Deconstruction",
    category: "Groq Reasoning",
    desc: "Complex goals are automatically converted into 3–5 bite-sized, executable subtasks.",
    icon: Sparkles,
    side: "left",
  },
  {
    id: "stage-3",
    stage: "03",
    title: "Timeline Slotting",
    category: "Schedule Engine",
    desc: "Allocates deliverables directly into your hour-by-hour day planner between 8 AM and evening.",
    icon: Calendar,
    side: "left",
  },
  {
    id: "stage-4",
    stage: "04",
    title: "Team Delegation",
    category: "Shared State",
    desc: "Generates one-click invite links so teammates can join and collaborate in real-time.",
    icon: Share2,
    side: "left",
  },
  {
    id: "stage-5",
    stage: "05",
    title: "Live Task Inboxes",
    category: "Multiplayer",
    desc: "In-task comment threads stream updates and notes directly between collaborators.",
    icon: Users,
    side: "right",
  },
  {
    id: "stage-6",
    stage: "06",
    title: "Local-First SQLite",
    category: "Offline Cache",
    desc: "Check off tasks on airplanes or trains. State commits locally first and syncs in background.",
    icon: Database,
    side: "right",
  },
  {
    id: "stage-7",
    stage: "07",
    title: "Velocity Compounding",
    category: "Analytics Engine",
    desc: "Live completion calculations continuously adjust your progress bars and priority rates.",
    icon: BarChart2,
    side: "right",
  },
  {
    id: "stage-8",
    stage: "08",
    title: "Evening Feedback Loop",
    category: "Daily Closure",
    desc: "3-question reflection locks in wins and automatically feeds tomorrow's #1 morning priority.",
    icon: Compass,
    side: "right",
  }
];

export default function OctopusFlowchart({ className = '' }) {
  const [activeStage, setActiveStage] = useState(null);

  const leftStages = lifecycleStages.filter(s => s.side === 'left');
  const rightStages = lifecycleStages.filter(s => s.side === 'right');

  return (
    <section
      id="ecosystem"
      aria-label="Pace Ecosystem Architecture"
      style={{
        backgroundColor: 'var(--lp-dark-bg, #18181B)',
        color: 'var(--lp-dark-text, #FFFFFF)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className={`relative z-20 w-full py-24 md:py-32 rounded-t-[32px] md:rounded-t-[40px] -mt-8 md:-mt-12 border-t border-white/[0.08] overflow-hidden shadow-2xl ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 border"
            style={{ 
              backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.1))', 
              borderColor: 'var(--lp-accent-border, rgba(255,107,0,0.25))',
              color: 'var(--lp-accent, #FF6B00)' 
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }} />
            <span>HOW PACE WORKS</span>
          </div>
          <h2 className="font-display font-medium text-[clamp(32px,4vw,56px)] leading-[1.08] tracking-tight text-white mb-4">
            Turn intentions into progress.
          </h2>
          <p className="text-base md:text-lg text-ink-2 font-normal leading-relaxed max-w-xl mx-auto">
            Capture tasks → break them down → take action → track progress. Rather than separate tools, Pace connects every phase into one continuous loop.
          </p>
        </div>

        {/* Connected Octopus Flowchart Grid */}
        <div className="relative max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Stages (01 - 04: Ingestion & Planning) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 px-1">
                Phase 1: Ingestion & Planning
              </div>
              {leftStages.map((stage) => {
                const Icon = stage.icon;
                const isHovered = activeStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    onMouseEnter={() => setActiveStage(stage.id)}
                    onMouseLeave={() => setActiveStage(null)}
                    style={{
                      backgroundColor: isHovered ? 'var(--lp-dark-card-hover-bg, #1E3F2C)' : 'var(--lp-dark-card-bg, #183323)',
                      borderColor: isHovered ? 'var(--lp-accent, #FF6B00)' : 'var(--lp-dark-card-border, rgba(255,255,255,0.06))',
                    }}
                    className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${isHovered
                        ? 'shadow-lg -translate-x-1'
                        : 'hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-6 h-6 rounded font-mono font-bold text-[11px] flex items-center justify-center"
                          style={{ backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.1))', color: 'var(--lp-accent, #FF6B00)' }}
                        >
                          {stage.stage}
                        </span>
                        <div 
                          className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center"
                          style={{ color: 'var(--lp-accent, #FF6B00)' }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-white font-display">{stage.title}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-ink-3">
                        {stage.category}
                      </span>
                    </div>
                    <p className="text-xs text-ink-2 leading-relaxed pl-8">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Center Octopus Core Nucleus */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center my-6 lg:my-0">
              <div 
                className="relative w-full max-w-[340px] p-7 rounded-3xl border-2 text-center shadow-xl"
                style={{ 
                  backgroundColor: 'var(--lp-dark-card-bg, #183323)',
                  borderColor: 'var(--lp-accent, #FF6B00)' 
                }}
              >

                {/* Center Core Badge */}
                <div 
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-md"
                  style={{ backgroundColor: 'var(--lp-accent, #FF6B00)', color: 'var(--lp-accent-text, #111111)' }}
                >
                  <Workflow size={28} />
                </div>

                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium mb-2.5 border"
                  style={{ 
                    backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.1))',
                    borderColor: 'var(--lp-accent-border, rgba(255,107,0,0.3))',
                    color: 'var(--lp-accent, #FF6B00)' 
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }} />
                  <span>PACE REACTIVE HUB</span>
                </div>

                <h3 className="font-display font-medium text-2xl text-white tracking-tight mb-2">
                  Unified State Bus
                </h3>

                <p className="text-xs text-ink-2 leading-relaxed mb-5">
                  Coordinates keyboard inputs, Groq prompt streaming, real-time team inboxes, and offline SQLite synchronization in a zero-lag event stream.
                </p>

                {/* Core Live Architecture Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.06] text-left">
                  <div 
                    className="p-2.5 rounded-xl border border-white/[0.06]"
                    style={{ backgroundColor: 'var(--lp-dark-mockup-bg, #12261A)' }}
                  >
                    <div className="text-[10px] text-ink-3 font-mono">EVENT LATENCY</div>
                    <div className="text-sm font-mono font-semibold text-white mt-0.5">&lt; 12ms</div>
                  </div>
                  <div 
                    className="p-2.5 rounded-xl border border-white/[0.06]"
                    style={{ backgroundColor: 'var(--lp-dark-mockup-bg, #12261A)' }}
                  >
                    <div className="text-[10px] text-ink-3 font-mono">STORAGE</div>
                    <div className="text-sm font-mono font-semibold mt-0.5" style={{ color: 'var(--lp-accent, #FF6B00)' }}>Local SQLite</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Stages (05 - 08: Execution & Feedback) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 px-1 text-right">
                Phase 2: Execution & Feedback
              </div>
              {rightStages.map((stage) => {
                const Icon = stage.icon;
                const isHovered = activeStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    onMouseEnter={() => setActiveStage(stage.id)}
                    onMouseLeave={() => setActiveStage(null)}
                    style={{
                      backgroundColor: isHovered ? 'var(--lp-dark-card-hover-bg, #1E3F2C)' : 'var(--lp-dark-card-bg, #183323)',
                      borderColor: isHovered ? 'var(--lp-accent, #FF6B00)' : 'var(--lp-dark-card-border, rgba(255,255,255,0.06))',
                    }}
                    className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${isHovered
                        ? 'shadow-lg translate-x-1'
                        : 'hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-6 h-6 rounded font-mono font-bold text-[11px] flex items-center justify-center"
                          style={{ backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.1))', color: 'var(--lp-accent, #FF6B00)' }}
                        >
                          {stage.stage}
                        </span>
                        <div 
                          className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center"
                          style={{ color: 'var(--lp-accent, #FF6B00)' }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-white font-display">{stage.title}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-ink-3">
                        {stage.category}
                      </span>
                    </div>
                    <p className="text-xs text-ink-2 leading-relaxed pl-8">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
