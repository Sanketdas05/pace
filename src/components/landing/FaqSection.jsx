import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Is Pace free to use?",
    answer: "Yes! Pace is completely free for individual use. You can track tasks, build habits, and earn points without paying a dime."
  },
  {
    question: "Can I use it offline?",
    answer: "Absolutely. Pace features robust offline support. Any tasks you create or complete while disconnected will automatically sync the moment you're back online."
  },
  {
    question: "Is there a desktop or mobile app?",
    answer: "Yes, Pace is a Progressive Web App (PWA). You can install it directly to your home screen or desktop from your browser for a native app-like experience without needing an app store."
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! You can invite friends or team members to specific tasks or entire workspaces. Updates happen in real-time, and you can even chat directly within the task."
  },
  {
    question: "How does the gamification work?",
    answer: "Every task you complete earns you XP. Build daily streaks to multiply your earnings, and level up your profile as you become more productive. Check-offs also earn shields that protect your streak."
  },
  {
    question: "Can I try it without creating an account?",
    answer: "Yes! You can click 'Try Demo' to instantly jump into a fully-functional demo environment. If you like it, you can easily save your demo tasks to a real account later."
  }
];

export default function FaqSection({ className = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section 
      id="faq"
      aria-label="Frequently Asked Questions"
      style={{
        backgroundColor: 'var(--lp-light-bg, #FAF7F0)',
        color: 'var(--lp-light-text, #111111)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className={`relative z-20 w-full py-24 md:py-32 border-t border-black/5 ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Context Column (Moodboard Style) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.05] border border-black/10 text-xs font-mono font-medium text-ink-3">
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="font-display font-medium text-[clamp(32px,4vw,56px)] leading-[1.08] tracking-tight text-[#111111]">
              Frequently asked questions
            </h2>

            <p className="text-base md:text-lg text-[#555555] font-normal leading-relaxed">
              Have questions? We'd love to hear from you. Everything you need to know about streaks, offline mode, team collaboration, and pricing.
            </p>

            {/* Contact / Try Demo Button */}
            <div className="pt-2">
              <Link 
                to="/login"
                style={{
                  backgroundColor: 'var(--lp-accent, #FF6B00)',
                  color: 'var(--lp-accent-text, #111111)',
                  transition: 'background-color 0.4s ease, color 0.4s ease',
                }}
                className="inline-flex items-center justify-center h-12 px-6 rounded-full font-medium text-sm hover:opacity-90 transition-opacity shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Try Pace Demo
              </Link>
            </div>

            {/* Friendly Little Mascot Illustration (from Moodboard) */}
            <div className="pt-8 hidden sm:flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-black/10 flex items-center justify-center shadow-xs">
                {/* Friendly Geometric Character */}
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="8" width="28" height="24" rx="8" fill="var(--lp-accent, #FF6B00)" />
                  {/* Eyes */}
                  <circle cx="15" cy="18" r="2.5" fill="#111111" />
                  <circle cx="25" cy="18" r="2.5" fill="#111111" />
                  {/* Warm Smile */}
                  <path d="M16 23C18 25 22 25 24 23" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                  {/* Cute bowtie/collar */}
                  <polygon points="17,32 23,32 20,35" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="text-xs text-ink-3">
                <div className="text-[#111111] font-medium">Pace Assistant</div>
                <div>Instant answers for habits & routines</div>
              </div>
            </div>
          </div>

          {/* Right Conversational Chat Bubble Column (from Moodboard) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Active Chat Conversation Card with Smooth Interactive Transitions */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm min-h-[220px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {/* User Question Bubble (Aligned Right) */}
                  <div className="flex justify-end">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96, x: 14 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="max-w-md bg-[#111111] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md text-sm md:text-base font-medium"
                    >
                      {faqs[activeIdx].question}
                    </motion.div>
                  </div>

                  {/* Pace Answer Bubble (Aligned Left) */}
                  <div className="flex items-start gap-3 justify-start">
                    <div 
                      className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1 shadow-xs"
                      style={{ backgroundColor: 'var(--lp-accent, #FF6B00)', color: 'var(--lp-accent-text, #111111)' }}
                    >
                      P
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.26, delay: 0.06, ease: "easeOut" }}
                      className="max-w-lg bg-[#F5F5F7] border border-black/5 text-[#111111] px-5 py-4 rounded-2xl rounded-tl-sm text-sm md:text-[15px] leading-relaxed"
                    >
                      {faqs[activeIdx].answer}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Clickable Question Chips / Bubbles to switch conversation */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-ink-3 uppercase tracking-wider pl-1 mb-2">
                Click to ask Pace:
              </div>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <motion.button
                      key={faq.question}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={isActive ? {
                        backgroundColor: 'var(--lp-accent, #FF6B00)',
                        color: 'var(--lp-accent-text, #111111)',
                        borderColor: 'var(--lp-accent, #FF6B00)',
                      } : {}}
                      className={`text-xs md:text-sm px-4 py-2.5 rounded-full border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer ${
                        isActive
                          ? 'font-medium shadow-md'
                          : 'bg-white text-[#111111] border-black/10 hover:border-black/30'
                      }`}
                    >
                      {faq.question}
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
