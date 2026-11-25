import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, BarChart2, Calendar, Smartphone, Download, CheckCircle2, Laptop, Wifi } from 'lucide-react';
import AppWindow from './AppWindow';

export default function BentoGrid({ className = '' }) {
  const [calendarView, setCalendarView] = useState('Month');

  return (
    <section 
      id="bento"
      aria-label="Capabilities Bento Grid"
      style={{
        backgroundColor: 'var(--lp-light-bg, #FAF7F0)',
        color: 'var(--lp-light-text, #111111)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className={`relative z-20 w-full py-24 md:py-32 rounded-t-[32px] md:rounded-t-[40px] -mt-8 md:-mt-12 border-t border-black/5 shadow-2xl ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.05] border border-black/10 text-xs font-mono font-medium text-ink-3 mb-4">
            <span>BENTO SHOWCASE</span>
          </div>
          <h2 className="font-display font-medium text-[clamp(32px,4vw,56px)] leading-[1.08] tracking-tight text-[#111111] mb-4">
            Small wins. Visible progress.
          </h2>
          <p className="text-lg md:text-xl text-[#555555] font-normal leading-relaxed max-w-2xl">
            Product screenshots, achievement cards and progress visualisations.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Tasks Dashboard & Priorities (col-span-2) - Full Themed App Layout */}
          <div 
            className="md:col-span-2 rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group hover:border-black/20 transition-all duration-200 shadow-sm border"
            style={{ 
              backgroundColor: 'var(--lp-light-card-bg, #FFFFFF)', 
              borderColor: 'var(--lp-light-card-border, rgba(0,0,0,0.08))', 
              color: 'var(--lp-light-text, #111111)' 
            }}
          >
            <div>
              <div 
                className="w-12 h-12 bg-black/[0.04] border border-black/10 rounded-xl flex items-center justify-center mb-6"
                style={{ color: 'var(--lp-accent, #FF6B00)' }}
              >
                <CheckSquare size={22} />
              </div>
              <h3 className="font-display font-medium text-2xl tracking-tight mb-2" style={{ color: 'var(--lp-light-text, #111111)' }}>
                Tasks & Priority Management
              </h3>
              <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--lp-light-muted, #555555)' }}>
                Filter by priority, inspect daily to-do lists, and execute routines with instant check-offs.
              </p>
            </div>

            {/* Themed App Window Layout - Mobile Phone on portrait (< md), Desktop Window on landscape & desktop (md+) */}
            <div className="mt-8 overflow-hidden rounded-2xl max-w-[370px] sm:portrait:max-w-[400px] landscape:max-w-none md:max-w-none mx-auto md:mx-0">
              <AppWindow isBento={true} />
            </div>
          </div>
          {/* Bento 2: Analytics & Priority Breakdown (col-span-1) - From Screenshot 3 */}
          <div 
            className="rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-black/20 transition-all duration-200 shadow-sm border"
            style={{ 
              backgroundColor: 'var(--lp-light-card-bg, #FFFFFF)', 
              borderColor: 'var(--lp-light-card-border, rgba(0,0,0,0.08))', 
              color: 'var(--lp-light-text, #111111)' 
            }}
          >
            <div>
              <div 
                className="w-12 h-12 bg-black/[0.04] border border-black/10 rounded-xl flex items-center justify-center mb-6"
                style={{ color: 'var(--lp-accent, #FF6B00)' }}
              >
                <BarChart2 size={22} />
              </div>
              <h3 className="font-display font-medium text-2xl tracking-tight mb-2" style={{ color: 'var(--lp-light-text, #111111)' }}>
                Analytics
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-light-muted, #555555)' }}>
                Your productivity overview: track overall completion rates and breakdowns by priority.
              </p>
            </div>

            {/* Exact Analytics UI with Donut/Pie Chart from Screenshot 3 */}
            <div className="mt-8 space-y-4">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-base font-bold text-[#111111]">4</div>
                  <div className="text-[10px] text-ink-3">Total Tasks</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-base font-bold" style={{ color: 'var(--lp-accent, #FF6B00)' }}>3</div>
                  <div className="text-[10px] text-ink-3">Completed</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-base font-bold text-[#D97706]">1</div>
                  <div className="text-[10px] text-ink-3">Active</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-base font-bold text-[#EF4444]">0</div>
                  <div className="text-[10px] text-ink-3">Overdue</div>
                </div>
              </div>

              {/* Task Breakdown: Donut / Pie Chart from Screenshot 3 */}
              <div className="bg-[#F9F9F9] border border-black/5 rounded-2xl p-4">
                <div className="text-xs font-semibold text-[#111111] mb-0.5">Task Breakdown</div>
                <div className="text-[10px] text-ink-3 mb-3">All tasks by status</div>
                
                <div className="flex items-center justify-between gap-3">
                  {/* Donut Chart */}
                  <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#EAEAEA" strokeWidth="12" />
                      {/* Completed (75%) */}
                      <circle 
                        cx="50" cy="50" r="38" fill="none" stroke="var(--lp-accent, #FF6B00)" strokeWidth="12" 
                        strokeDasharray="238.7" strokeDashoffset="59.7" strokeLinecap="round" 
                      />
                      {/* Active (25%) */}
                      <circle 
                        cx="50" cy="50" r="38" fill="none" stroke="#D97706" strokeWidth="12" 
                        strokeDasharray="238.7" strokeDashoffset="179" strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono font-bold text-base text-[#111111] leading-none">4</span>
                      <span className="text-[8px] text-ink-3 uppercase font-mono mt-0.5">Tasks</span>
                    </div>
                  </div>

                  {/* Legend list from Screenshot 3 */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }} />
                        <span className="text-[#333333] text-[11px] font-medium">Completed</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-[#111111] font-bold">3</span>
                        <span className="text-ink-3 text-[10px]">75%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                        <span className="text-[#333333] text-[11px] font-medium">Active</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-[#111111] font-bold">1</span>
                        <span className="text-ink-3 text-[10px]">25%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        <span className="text-[#333333] text-[11px] font-medium">Overdue</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-[#111111] font-bold">0</span>
                        <span className="text-ink-3 text-[10px]">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion by Priority Bars */}
              <div className="bg-[#F9F9F9] border border-black/5 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="text-[11px] font-medium text-ink-3">Completion by Priority</div>
                
                {/* High */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#111111] font-medium">High</span>
                    <span className="text-ink-3">2 done · 100%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10">
                    <div className="h-full bg-[#A3423C] rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#111111] font-medium">Medium</span>
                    <span className="text-ink-3">1 done · 50%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10">
                    <div className="h-full bg-[#D97706] rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                {/* Low */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#111111] font-medium">Low</span>
                    <span className="text-ink-3">0 done · 0%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10">
                    <div className="h-full bg-black/20 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

              </div>

            </div>
          </div>
          {/* Bento 3: Interactive Calendar (col-span-2) - From Screenshot 2 */}
          <div 
            className="md:col-span-2 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-black/20 transition-all duration-200 shadow-sm border"
            style={{ 
              backgroundColor: 'var(--lp-light-card-bg, #FFFFFF)', 
              borderColor: 'var(--lp-light-card-border, rgba(0,0,0,0.08))', 
              color: 'var(--lp-light-text, #111111)' 
            }}
          >
            <div>
              <div 
                className="w-12 h-12 bg-black/[0.04] border border-black/10 rounded-xl flex items-center justify-center mb-6"
                style={{ color: 'var(--lp-accent, #FF6B00)' }}
              >
                <Calendar size={22} />
              </div>
              <h3 className="font-display font-medium text-2xl tracking-tight mb-2" style={{ color: 'var(--lp-light-text, #111111)' }}>
                Calendar Schedule & Month View
              </h3>
              <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--lp-light-muted, #555555)' }}>
                Toggle between Month and Timeline views, inspect tasks due this month, and organize scheduled deadlines.
              </p>
            </div>

            {/* Exact Calendar UI from Screenshot 2 */}
            <div className="mt-8 bg-white text-[#111111] rounded-2xl p-5 shadow-lg">
              
              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
                <div>
                  <div className="text-sm font-bold text-[#111111]">Calendar</div>
                  <div className="text-[11px] text-ink-3">0 tasks due this month</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#F4F4F4] p-1 rounded-lg text-xs font-medium relative">
                    <button
                      type="button"
                      onClick={() => setCalendarView('Month')}
                      className={`relative px-3 py-1 rounded-md text-xs font-medium z-10 transition-colors ${
                        calendarView === 'Month' ? 'text-[#111111] font-semibold' : 'text-ink-3 hover:text-black'
                      }`}
                    >
                      {calendarView === 'Month' && (
                        <motion.div
                          layoutId="calendarTab"
                          className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarView('Timeline')}
                      className={`relative px-3 py-1 rounded-md text-xs font-medium z-10 transition-colors ${
                        calendarView === 'Timeline' ? 'text-[#111111] font-semibold' : 'text-ink-3 hover:text-black'
                      }`}
                    >
                      {calendarView === 'Timeline' && (
                        <motion.div
                          layoutId="calendarTab"
                          className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      Timeline
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-[#111111] px-2">November 2026</span>
                </div>
              </div>

              {/* Stat Cards from Screenshot 2 */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="p-2 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-sm font-bold text-[#111111]">0</div>
                  <div className="text-[9px] text-ink-3 font-mono">Total Due</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-sm font-bold" style={{ color: 'var(--lp-accent, #FF6B00)' }}>0</div>
                  <div className="text-[9px] text-ink-3 font-mono">Completed</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F9F9F9] border border-black/5">
                  <div className="text-sm font-bold text-[#EF4444]">0</div>
                  <div className="text-[9px] text-ink-3 font-mono">Overdue</div>
                </div>
              </div>

              {/* Fixed Height View Container with Smooth AnimatePresence Transition */}
              <div className="h-[215px] min-h-[215px] overflow-hidden flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {calendarView === 'Month' ? (
                    <motion.div
                      key="month-view"
                      initial={{ opacity: 0, y: 10, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono mt-2"
                    >
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                        <span key={d} className="text-ink-3 font-semibold pb-1">{d}</span>
                      ))}
                      {[
                        1, 2, 3, 4, 5, 6, 7,
                        8, 9, 10, 11, 12, 13, 14,
                        15, 16, 17, 18, 19, 20, 21,
                        22, 23, 24, 25, 26, 27, 28,
                        29, 30
                      ].map((num) => {
                        const isActive = num === 24;
                        return (
                          <div 
                            key={num} 
                            className={`h-7 rounded flex items-center justify-center font-medium ${
                              isActive 
                                ? 'bg-[#EAEAEA] text-[#111111] font-bold' 
                                : 'text-[#111111] hover:bg-black/5'
                            }`}
                          >
                            {isActive ? (
                              <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold">
                                {num}
                              </span>
                            ) : (
                              num
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="timeline-view"
                      initial={{ opacity: 0, y: 10, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="mt-2 pt-1"
                    >
                      {/* Day Carousel Header */}
                      <div className="flex items-center justify-between px-1 pb-2">
                        <button 
                          type="button" 
                          className="w-7 h-7 rounded-full bg-[#F4F4F4] flex items-center justify-center text-xs text-ink-3 hover:text-black font-semibold transition-transform active:scale-95 cursor-pointer"
                        >
                          ‹
                        </button>
                        
                        <div className="flex items-center gap-2 sm:gap-3.5 text-center">
                          {[
                            { day: 'S', date: 21 },
                            { day: 'S', date: 22 },
                            { day: 'M', date: 23 },
                            { day: 'T', date: 24, active: true },
                            { day: 'W', date: 25 },
                            { day: 'T', date: 26 },
                            { day: 'F', date: 27 },
                            { day: 'S', date: 28 },
                          ].map((item) => (
                            <div key={item.date} className="flex flex-col items-center">
                              <span className="text-[10px] text-ink-3 font-mono">{item.day}</span>
                              <div 
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                                  item.active ? 'font-bold' : 'text-[#444]'
                                }`}
                                style={item.active ? {
                                  border: '2px solid var(--lp-accent, #111111)',
                                  color: 'var(--lp-accent, #111111)'
                                } : {}}
                              >
                                {item.date}
                              </div>
                              {item.active && (
                                <div 
                                  className="w-5 h-0.5 rounded-full mt-1.5" 
                                  style={{ backgroundColor: 'var(--lp-accent, #111111)' }}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <button 
                          type="button" 
                          className="w-7 h-7 rounded-full bg-[#F4F4F4] flex items-center justify-center text-xs text-ink-3 hover:text-black font-semibold transition-transform active:scale-95 cursor-pointer"
                        >
                          ›
                        </button>
                      </div>

                      {/* Hourly Schedule Lines from Image 2 */}
                      <div className="mt-2 border-t border-black/10 divide-y divide-black/5 text-xs">
                        {['08 AM', '09 AM', '10 AM', '11 AM'].map((time) => (
                          <div key={time} className="py-2 flex items-center gap-3">
                            <span className="w-12 text-[10px] font-mono text-ink-3 flex-shrink-0">{time}</span>
                            <div className="flex-1 h-[1px] bg-black/5" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
          {/* Bento 4: Installable PWA & Local-First Engine (col-span-1) - Exact from Screenshot 4 */}
          <div 
            className="rounded-3xl p-6 md:p-8 flex flex-col justify-start gap-4 hover:border-black/20 transition-all duration-200 shadow-sm border"
            style={{ 
              backgroundColor: 'var(--lp-light-card-bg, #FFFFFF)', 
              borderColor: 'var(--lp-light-card-border, rgba(0,0,0,0.08))', 
              color: 'var(--lp-light-text, #111111)' 
            }}
          >
            <div>
              <div 
                className="w-11 h-11 bg-black/[0.04] border border-black/10 rounded-xl flex items-center justify-center mb-4"
                style={{ color: 'var(--lp-accent, #FF6B00)' }}
              >
                <Download size={20} />
              </div>
              <h3 className="font-display font-medium text-2xl tracking-tight mb-1.5" style={{ color: 'var(--lp-light-text, #111111)' }}>
                Installable PWA
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--lp-light-muted, #555555)' }}>
                Access Pace in a dedicated desktop or mobile window with offline persistence and zero app store friction.
              </p>
            </div>

            {/* Exact Chrome PWA Installation Modal from Screenshot 4 */}
            <div className="bg-[#18181B] rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg">
              
              {/* Chrome Browser Address Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#121214] border-b border-white/[0.06] text-[11px] text-ink-3 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span style={{ color: 'var(--lp-accent, #FF6B00)' }}>🔒</span>
                  <span className="text-white/80">pace-manager.web.app/tasks</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Download size={12} style={{ color: 'var(--lp-accent, #FF6B00)' }} />
                </div>
              </div>

              {/* Install App Popup Dialog from Image 4 */}
              <div className="p-4 bg-[#1E1E22] text-white">
                
                {/* Laptop Illustration */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-24 h-14 bg-[#2A2A30] rounded-t-lg border border-white/10 flex items-center justify-center">
                    <div className="w-12 h-6 bg-[#3B3B44] rounded flex items-center justify-center">
                      <div 
                        className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: 'var(--lp-accent, #FF6B00)', color: 'var(--lp-accent-text, #111111)' }}
                      >
                        ↓
                      </div>
                    </div>
                    {/* Laptop base */}
                    <div className="absolute -bottom-1.5 w-28 h-1.5 bg-[#4B4B55] rounded-full" />
                  </div>
                </div>

                <div className="text-center mb-3">
                  <div className="text-sm font-semibold text-white">Install app</div>
                  <div className="text-[11px] text-ink-2 mt-0.5">
                    Access this site in a dedicated window on your computer
                  </div>
                </div>

                {/* App Identity Row */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#26262C] border border-white/[0.06] mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: 'var(--lp-accent, #FF6B00)', color: 'var(--lp-accent-text, #111111)' }}
                  >
                    ⚡
                  </div>
                  <div className="overflow-hidden text-left">
                    <div className="text-xs font-semibold text-white leading-tight">Pace Manager</div>
                    <div className="text-[10px] text-ink-3 truncate">pace-manager.web.app</div>
                  </div>
                </div>

                {/* Action Buttons from Screenshot 4 */}
                <div className="flex items-center justify-end gap-2 pt-1 text-xs font-medium">
                  <span className="text-ink-3 hover:text-white px-2 py-1 text-[11px]">Learn more</span>
                  <span className="px-3 py-1 rounded-lg bg-white/[0.08] text-white text-[11px]">Cancel</span>
                  <span 
                    className="px-3 py-1 rounded-lg font-semibold text-[11px]"
                    style={{ backgroundColor: 'var(--lp-accent, #FF6B00)', color: 'var(--lp-accent-text, #111111)' }}
                  >
                    Install
                  </span>
                </div>

              </div>

            </div>

            {/* Persistent Offline Cache Status Badge */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#141416] border border-white/[0.06] text-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }}
                />
                <span className="text-ink-2 text-[11px]">Persistent Offline Cache</span>
              </div>
              <span 
                className="font-mono text-[10px]"
                style={{ color: 'var(--lp-accent, #FF6B00)' }}
              >
                100% Synced
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
