import React from 'react';

export default function AppWindow({ className = '', isBento = false }) {
  return (
    <div 
      className={isBento ? `relative w-full overflow-hidden ${className}` : `app-window-root relative w-full lg:max-w-none ${className}`}
      role="img"
      aria-label="Pace app showing tasks, habits and streak tracking"
    >
      <div 
        className={`app-window-card overflow-hidden relative border transition-colors duration-400 ${
          isBento ? 'rounded-2xl shadow-xl' : 'rounded-2xl md:rounded-t-[20px] lg:rounded-tl-[20px] lg:rounded-tr-none lg:border-r-0 shadow-2xl'
        }`}
        style={{
          backgroundColor: 'var(--lp-app-bg, #FAF7F0)',
          borderColor: 'var(--lp-app-border, rgba(255,255,255,0.14))',
          color: 'var(--lp-app-text, #111111)',
          WebkitMaskImage: isBento ? 'none' : 'var(--window-mask)',
          maskImage: isBento ? 'none' : 'var(--window-mask)',
        }}
      >
        {!isBento && (
          <>
            <style>{`
              .app-window-card {
                --window-mask: linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0.3) 88%, transparent 100%);
              }
            `}</style>
            {/* Smooth bottom gradient overlay to blend into hero section on all viewports */}
            <div 
              className="absolute inset-x-0 bottom-0 h-32 md:h-44 pointer-events-none z-20 transition-opacity duration-400"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 40%, var(--lp-hero-bg) 95%)',
              }}
            />
          </>
        )}

        {/* ============================================================== */}
        {/* DESKTOP APPLICATION WINDOW LAYOUT (md+ OR landscape mobile)     */}
        {/* ============================================================== */}
        <div className="hidden md:block landscape:block">
          {/* Chrome: Slim top bar */}
          <div 
            className="flex items-center justify-between px-4 h-9 border-b transition-colors duration-400"
            style={{
              backgroundColor: 'var(--lp-app-topbar-bg, #FAFAFA)',
              borderColor: 'var(--lp-app-border, rgba(0,0,0,0.08))',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
            </div>
            {/* Top address / filler pill */}
            <div 
              className="w-36 h-2 rounded-full opacity-20" 
              style={{ backgroundColor: 'var(--lp-app-text, #111111)' }}
            />
            <div className="w-8" />
          </div>

          {/* Window Body: Sidebar + Main */}
          <div className="flex flex-row min-h-[380px]">
            
            {/* Left Sidebar: 175px on md+, responsive on mobile landscape */}
            <aside 
              className="flex flex-col w-[140px] sm:w-[155px] md:w-[175px] flex-shrink-0 border-r p-2.5 sm:p-3 md:p-3.5 justify-between transition-colors duration-400"
              style={{
                backgroundColor: 'var(--lp-app-sidebar-bg, #FCFCFC)',
                borderColor: 'var(--lp-app-sidebar-border, #EAEAEA)',
                color: 'var(--lp-app-sidebar-text, #111111)',
              }}
            >
              <div className="space-y-4">
                {/* Brand Header with Pace folded-leaf signature mark */}
                <div className="flex items-center gap-2 px-1 py-1">
                  <svg 
                    viewBox="0 0 36 36" 
                    className="w-6 h-6 flex-shrink-0" 
                    fill="none" 
                    style={{ color: 'var(--lp-accent, #FF6B00)', transition: 'color 0.4s ease' }}
                    aria-hidden="true"
                  >
                    <path 
                      d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
                      fill="currentColor"
                      fillOpacity="0.84"
                    />
                    <path 
                      d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
                      fill="currentColor"
                    />
                  </svg>
                  <div>
                    <div 
                      className="font-display font-medium text-xs leading-none lowercase"
                      style={{ color: 'var(--lp-app-sidebar-text, #111111)' }}
                    >
                      pace
                    </div>
                    <div 
                      className="text-[9px] leading-tight mt-0.5"
                      style={{ color: 'var(--lp-app-sidebar-muted, #888888)' }}
                    >
                      Defining the speed of life
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1">
                  {/* Tasks (Selected) */}
                  <div 
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-xs transition-colors duration-400"
                    style={{
                      backgroundColor: 'var(--lp-app-sidebar-active-bg, #111111)',
                      color: 'var(--lp-app-sidebar-active-text, #FFFFFF)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <span>Tasks</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                  </div>

                  {/* Calendar */}
                  <div 
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--lp-app-sidebar-muted, #888888)' }}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Calendar</span>
                  </div>

                  {/* Analytics */}
                  <div 
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--lp-app-sidebar-muted, #888888)' }}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    <span>Analytics</span>
                  </div>

                  {/* Settings */}
                  <div 
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--lp-app-sidebar-muted, #888888)' }}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Settings</span>
                  </div>
                </nav>
              </div>

              {/* User Profile Snippet */}
              <div 
                className="flex items-center gap-2 pt-3 border-t transition-colors duration-400"
                style={{ borderColor: 'var(--lp-app-sidebar-border, #EAEAEA)' }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
                  style={{ 
                    backgroundColor: 'var(--lp-accent, #FF6B00)', 
                    color: 'var(--lp-accent-text, #111111)' 
                  }}
                >
                  A
                </div>
                <div className="overflow-hidden">
                  <div 
                    className="text-[11px] font-medium truncate"
                    style={{ color: 'var(--lp-app-sidebar-text, #111111)' }}
                  >
                    Alex Morgan
                  </div>
                  <div 
                    className="text-[9px] truncate"
                    style={{ color: 'var(--lp-app-sidebar-muted, #888888)' }}
                  >
                    alex@workspace.io
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Workspace Area */}
            <main 
              className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 transition-colors duration-400 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--lp-app-bg, #FAF7F0)',
                color: 'var(--lp-app-text, #111111)',
              }}
            >
              <div>
                {/* Header row: "Good morning, Alex!" + "+ New Task" */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div>
                    <span 
                      className="text-[11px] block"
                      style={{ color: 'var(--lp-app-muted, #666666)' }}
                    >
                      Good morning,
                    </span>
                    <h3 
                      className="text-sm sm:text-base md:text-lg font-bold tracking-tight"
                      style={{ color: 'var(--lp-app-text, #111111)' }}
                    >
                      Alex!
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      tabIndex="-1"
                      aria-hidden="true"
                      className="h-6 sm:h-7 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors duration-400 whitespace-nowrap"
                      style={{
                        backgroundColor: 'var(--lp-app-btn-new-bg, #111111)',
                        color: 'var(--lp-app-btn-new-text, #FFFFFF)',
                      }}
                    >
                      <span>+ New Task</span>
                    </button>
                  </div>
                </div>

                {/* Top Cards Layout: Large Left 'Today' + Stacked Right ('To do list' & 'Overview') */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3 mb-3 md:mb-4">
                  
                  {/* Left Large Card: Today */}
                  <div 
                    className="col-span-7 min-w-0 rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[120px] md:min-h-[140px] border shadow-xs transition-colors duration-400"
                    style={{
                      backgroundColor: 'var(--lp-app-card-today-bg, #FFFFFF)',
                      borderColor: 'var(--lp-app-card-today-border, rgba(0,0,0,0.06))',
                    }}
                  >
                    <div>
                      <h4 
                        className="font-bold text-base md:text-lg leading-snug tracking-tight truncate"
                        style={{ color: 'var(--lp-app-text, #111111)' }}
                      >
                        Today
                      </h4>
                      <p 
                        className="text-[11px] md:text-xs mt-0.5 md:mt-1 line-clamp-2"
                        style={{ color: 'var(--lp-app-muted, #666666)' }}
                      >
                        No tasks scheduled for today.
                      </p>
                    </div>

                    <div 
                      className="flex items-center justify-between pt-2.5 sm:pt-3 border-t text-[10px] md:text-[11px] font-mono gap-1"
                      style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.06))' }}
                    >
                      <span className="truncate" style={{ color: 'var(--lp-app-muted, #888888)' }}>Schedule Status</span>
                      <span 
                        className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold whitespace-nowrap flex-shrink-0"
                        style={{ 
                          backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.12))', 
                          color: 'var(--lp-accent, #FF6B00)' 
                        }}
                      >
                        All caught up
                      </span>
                    </div>
                  </div>

                  {/* Right Stacked Column: 'To do list' & 'Overview' */}
                  <div className="col-span-5 min-w-0 flex flex-col gap-2 md:gap-2.5">
                    
                    {/* Top Card: 'To do list' */}
                    <div 
                      className="flex-1 min-w-0 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between border shadow-xs transition-colors duration-400"
                      style={{
                        backgroundColor: 'var(--lp-app-card-todo-bg, #F5F5F7)',
                        borderColor: 'var(--lp-app-card-todo-border, rgba(0,0,0,0.06))',
                        color: 'var(--lp-app-text, #111111)',
                      }}
                    >
                      <div className="w-5 h-5 flex items-center" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 012-2h11" />
                        </svg>
                      </div>
                      <div>
                        <div 
                          className="text-[9px] md:text-[10px] font-mono truncate"
                          style={{ color: 'var(--lp-app-muted, #666666)' }}
                        >
                          1 tasks
                        </div>
                        <div className="text-xs md:text-sm font-bold leading-tight truncate">To do list</div>
                      </div>
                    </div>

                    {/* Bottom Card: 'Overview' */}
                    <div 
                      className="flex-1 min-w-0 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-xs transition-colors duration-400"
                      style={{
                        backgroundColor: 'var(--lp-app-card-overview-bg, #111111)',
                        color: 'var(--lp-app-card-overview-text, #FFFFFF)',
                      }}
                    >
                      <div className="w-5 h-5 opacity-80 flex items-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="2" x2="12" y2="6" />
                          <line x1="12" y1="18" x2="12" y2="22" />
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                          <line x1="2" y1="12" x2="6" y2="12" />
                          <line x1="18" y1="12" x2="22" y2="12" />
                          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[9px] md:text-[10px] opacity-75 font-mono truncate">3 total tasks</div>
                        <div className="text-xs md:text-sm font-bold leading-tight truncate">Overview</div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-[11px] font-medium">
                  <span 
                    className="px-2.5 py-1 rounded-full shadow-xs transition-colors duration-400 font-semibold"
                    style={{
                      backgroundColor: 'var(--lp-app-filter-all-bg, #111111)',
                      color: 'var(--lp-app-filter-all-text, #FFFFFF)',
                    }}
                  >
                    All
                  </span>
                  {['High', 'Medium', 'Low', 'Completed'].map((filter) => (
                    <span 
                      key={filter}
                      className="px-2.5 py-1 rounded-full border transition-colors duration-400"
                      style={{
                        backgroundColor: 'var(--lp-app-filter-other-bg, #FFFFFF)',
                        borderColor: 'var(--lp-app-border, rgba(0,0,0,0.08))',
                        color: 'var(--lp-app-filter-other-text, #666666)',
                      }}
                    >
                      {filter}
                    </span>
                  ))}
                </div>

                {/* Tasks list */}
                <div className="space-y-2">
                  {/* Task 1: Meditation (Checked) */}
                  <div 
                    className="task-row flex items-center justify-between p-2.5 rounded-xl border shadow-xs transition-colors duration-400"
                    style={{
                      backgroundColor: 'var(--lp-app-task-card-bg, #FFFFFF)',
                      borderColor: 'var(--lp-app-task-card-border, rgba(0,0,0,0.08))',
                      color: 'var(--lp-app-task-card-text, #111111)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="task-check-circle w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }}
                      >
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="task-strike-text text-xs font-medium select-none line-through opacity-70"
                          style={{ color: 'var(--lp-app-task-card-text, #111111)' }}
                        >
                          Meditation
                        </span>
                        <span 
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold"
                          style={{ 
                            backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.12))', 
                            color: 'var(--lp-accent, #FF6B00)' 
                          }}
                        >
                          Medium
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[10px] font-mono"
                        style={{ color: 'var(--lp-app-muted, #666666)' }}
                      >
                        7:00 AM
                      </span>
                      <span className="text-[10px] font-medium text-emerald-600">Done</span>
                    </div>
                  </div>

                  {/* Task 2: Review specs */}
                  <div 
                    className="flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-400"
                    style={{
                      backgroundColor: 'var(--lp-app-task-card-bg, #FFFFFF)',
                      borderColor: 'var(--lp-app-task-card-border, rgba(0,0,0,0.08))',
                      color: 'var(--lp-app-task-card-text, #111111)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.2))' }}
                      />
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-medium select-none"
                          style={{ color: 'var(--lp-app-task-card-text, #111111)' }}
                        >
                          Review product design specs
                        </span>
                        <span 
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold"
                          style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.12)', 
                            color: '#EF4444' 
                          }}
                        >
                          High
                        </span>
                      </div>
                    </div>
                    <span 
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--lp-app-muted, #666666)' }}
                    >
                      Today
                    </span>
                  </div>

                  {/* Task 3: Team sprint retro & roadmap */}
                  <div 
                    className="flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-400"
                    style={{
                      backgroundColor: 'var(--lp-app-task-card-bg, #FFFFFF)',
                      borderColor: 'var(--lp-app-task-card-border, rgba(0,0,0,0.08))',
                      color: 'var(--lp-app-task-card-text, #111111)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.2))' }}
                      />
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-medium select-none"
                          style={{ color: 'var(--lp-app-task-card-text, #111111)' }}
                        >
                          Team sprint retro & roadmap
                        </span>
                        <span 
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold"
                          style={{ 
                            backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.12))', 
                            color: 'var(--lp-accent, #FF6B00)' 
                          }}
                        >
                          Medium
                        </span>
                      </div>
                    </div>
                    <span 
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--lp-app-muted, #666666)' }}
                    >
                      2:30 PM
                    </span>
                  </div>

                  {/* Task 4: Daily closure & reflection (Submerged in gradient) */}
                  <div 
                    className="flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-400 opacity-60"
                    style={{
                      backgroundColor: 'var(--lp-app-task-card-bg, #FFFFFF)',
                      borderColor: 'var(--lp-app-task-card-border, rgba(0,0,0,0.08))',
                      color: 'var(--lp-app-task-card-text, #111111)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.2))' }}
                      />
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-medium select-none"
                          style={{ color: 'var(--lp-app-task-card-text, #111111)' }}
                        >
                          Daily evening reflection & win lock
                        </span>
                        <span 
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold"
                          style={{ 
                            backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                            color: '#3B82F6' 
                          }}
                        >
                          Daily
                        </span>
                      </div>
                    </div>
                    <span 
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--lp-app-muted, #666666)' }}
                    >
                      6:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </main>

          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE PHONE MOCKUP LAYOUT (< md in portrait only)             */}
        {/* Matches mobile app layout: Today, Overview, Pills & Nav Tab    */}
        {/* ============================================================== */}
        <div className="block md:hidden landscape:hidden p-4 sm:p-5 flex flex-col justify-between">
          
          {/* Top Header: Greeting + Notification Bell + User Avatar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs block" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                Good evening,
              </span>
              <h3 className="text-xl font-bold font-display tracking-tight" style={{ color: 'var(--lp-app-text, #111111)' }}>
                Alex!
              </h3>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Notification Bell */}
              <div 
                className="w-9 h-9 rounded-full border flex items-center justify-center shadow-xs transition-colors"
                style={{
                  backgroundColor: 'var(--lp-app-card-today-bg, #FFFFFF)',
                  borderColor: 'var(--lp-app-border, rgba(0,0,0,0.08))',
                  color: 'var(--lp-app-text, #111111)',
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              {/* User Avatar */}
              <div 
                className="w-9 h-9 rounded-full overflow-hidden border shadow-xs flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: 'var(--lp-accent, #FF6B00)',
                  color: 'var(--lp-accent-text, #111111)',
                  borderColor: 'var(--lp-app-border, rgba(0,0,0,0.08))',
                }}
              >
                A
              </div>
            </div>
          </div>

          {/* Today Card (Full Width) */}
          <div 
            className="rounded-2xl p-4 border shadow-xs mb-3 transition-colors duration-400"
            style={{
              backgroundColor: 'var(--lp-app-card-today-bg, #FDFBF7)',
              borderColor: 'var(--lp-app-card-today-border, rgba(0,0,0,0.06))',
            }}
          >
            <h4 className="text-base font-bold mb-1" style={{ color: 'var(--lp-app-text, #111111)' }}>
              Today
            </h4>
            <p className="text-xs" style={{ color: 'var(--lp-app-muted, #666666)' }}>
              No tasks scheduled for today.
            </p>
          </div>

          {/* 2-Column Cards (To do list & Overview) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* To do list card */}
            <div 
              className="rounded-2xl p-3.5 border shadow-xs flex flex-col justify-between min-h-[105px] transition-colors duration-400"
              style={{
                backgroundColor: 'var(--lp-app-card-todo-bg, #EDF3ED)',
                borderColor: 'var(--lp-app-card-todo-border, rgba(0,0,0,0.06))',
                color: 'var(--lp-app-text, #111111)',
              }}
            >
              <div className="w-5 h-5 flex items-center" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                  2 tasks
                </div>
                <div className="text-sm font-bold leading-tight">To do list</div>
              </div>
            </div>

            {/* Overview card */}
            <div 
              className="rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] transition-colors duration-400"
              style={{
                backgroundColor: 'var(--lp-app-card-overview-bg, #1F3A2B)',
                color: 'var(--lp-app-card-overview-text, #FFFFFF)',
              }}
            >
              <div className="w-5 h-5 opacity-80 flex items-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] opacity-75 font-mono">4 total tasks</div>
                <div className="text-sm font-bold leading-tight">Overview</div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 text-xs font-medium">
            <span 
              className="px-3 py-1 rounded-full shadow-xs font-semibold"
              style={{
                backgroundColor: 'var(--lp-app-filter-all-bg, #1F3A2B)',
                color: 'var(--lp-app-filter-all-text, #FFFFFF)',
              }}
            >
              All
            </span>
            {['High', 'Medium', 'Low', 'Completed', 'Trash'].map((filter) => (
              <span 
                key={filter}
                className="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--lp-app-filter-other-bg, #FFFFFF)',
                  borderColor: 'var(--lp-app-border, rgba(0,0,0,0.08))',
                  color: 'var(--lp-app-filter-other-text, #666666)',
                }}
              >
                {filter}
              </span>
            ))}
          </div>

          {/* Switch Row: "Hide completed" */}
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-8 h-4 rounded-full p-0.5 flex items-center justify-end"
              style={{ backgroundColor: 'var(--lp-app-card-overview-bg, #1F3A2B)' }}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--lp-app-muted, #666666)' }}>
              Hide completed
            </span>
          </div>

          {/* Task Card Preview with FABs */}
          <div className="relative mb-4">
            <div 
              className="rounded-2xl border p-3.5 pl-4 relative overflow-hidden shadow-xs transition-colors"
              style={{
                backgroundColor: 'var(--lp-app-task-card-bg, #FFFFFF)',
                borderColor: 'var(--lp-app-task-card-border, rgba(0,0,0,0.08))',
                color: 'var(--lp-app-task-card-text, #111111)',
              }}
            >
              {/* Red priority strip on left */}
              <div className="absolute left-0 inset-y-0 w-1 bg-[#E05A47]" />

              {/* Task Title & Trash */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span className="text-xs font-bold">Launch sprint roadmap</span>
                </div>
                <svg className="w-3.5 h-3.5 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold bg-red-50 text-red-600 border border-red-200">
                  High
                </span>
                <span className="text-[9px] font-mono opacity-75 flex items-center gap-1" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Dec 1, 2026
                </span>
              </div>

              {/* Subtasks Accordion */}
              <div className="text-[10px] opacity-75 flex items-center gap-1 mb-2 font-medium" style={{ color: 'var(--lp-app-muted, #666666)' }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                <span>Show subtasks (0/5)</span>
              </div>

              {/* Team Pill */}
              <div className="rounded-xl border p-2 flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.06))' }}>
                <span style={{ color: 'var(--lp-app-muted, #666666)' }}>Work in progress</span>
                <span className="px-2 py-0.5 rounded-full bg-black/5 font-semibold">1 in team</span>
              </div>
            </div>

            {/* Floating Action Buttons (FABs Stack) */}
            <div className="absolute -right-2 bottom-0 flex flex-col gap-2 items-center z-10">
              {/* Add Task FAB */}
              <div 
                className="w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--lp-app-card-overview-bg, #1F3A2B)',
                  color: 'var(--lp-app-card-overview-text, #FFFFFF)',
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </div>
              {/* AI Sparkles FAB */}
              <div 
                className="w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center opacity-90 transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--lp-app-card-overview-bg, #1F3A2B)',
                  color: 'var(--lp-accent, #9ED98F)',
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              </div>
              {/* Split View / Book FAB */}
              <div 
                className="w-10 h-9 rounded-xl border shadow-xs flex items-center justify-center bg-white"
                style={{ borderColor: 'var(--lp-app-border, rgba(0,0,0,0.1))', color: 'var(--lp-app-text, #111111)' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
            </div>
          </div>

          {/* Native Bottom Navigation Bar */}
          <div 
            className="flex items-center justify-around pt-3 border-t transition-colors -mx-4 -mb-4 px-3 pb-3 rounded-b-2xl"
            style={{
              backgroundColor: 'var(--lp-app-card-today-bg, #FFFFFF)',
              borderColor: 'var(--lp-app-border, rgba(0,0,0,0.06))',
            }}
          >
            {/* Tasks Tab (Active) */}
            <div className="flex flex-col items-center gap-0.5">
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
                style={{ color: 'var(--lp-accent, #1F3A2B)' }}
              >
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--lp-app-text, #111111)' }}>Tasks</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--lp-accent, #1F3A2B)' }} />
            </div>

            {/* Calendar Tab */}
            <div className="flex flex-col items-center gap-0.5 opacity-60">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[10px] font-medium" style={{ color: 'var(--lp-app-muted, #666666)' }}>Calendar</span>
            </div>

            {/* Analytics Tab */}
            <div className="flex flex-col items-center gap-0.5 opacity-60">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span className="text-[10px] font-medium" style={{ color: 'var(--lp-app-muted, #666666)' }}>Analytics</span>
            </div>

            {/* Settings Tab */}
            <div className="flex flex-col items-center gap-0.5 opacity-60">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-[10px] font-medium" style={{ color: 'var(--lp-app-muted, #666666)' }}>Settings</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
