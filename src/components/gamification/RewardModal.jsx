import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Zap, Crown, Shield } from 'lucide-react';

const CHARMS = {
  7: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', glow: 'shadow-[0_0_60px_-15px_rgba(250,204,21,0.5)]' },
  14: { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10', glow: 'shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)]' },
  30: { icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10', glow: 'shadow-[0_0_60px_-15px_rgba(192,132,252,0.5)]' },
};

const TITLES = {
  7: 'The Unstoppable',
  14: 'The Relentless',
  30: 'The God-Tier',
};

export default function RewardModal({ isOpen, onClose, streak, alias }) {
  const charm = CHARMS[streak] || CHARMS[7];
  const Icon = charm.icon;
  const title = TITLES[streak] || 'Epic Milestone';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-sm bg-[#0F1014] rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${charm.glow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-10 pt-16 flex flex-col items-center text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${charm.bg}`}
                >
                  <Icon size={64} className={charm.color} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider border border-white/10 mb-4">
                    <Flame size={14} className="text-orange-400" />
                    {streak}-Day Streak
                  </div>
                  
                  <h3 className="text-white/60 text-sm font-medium uppercase tracking-[0.2em] mb-2">New Title Unlocked</h3>
                  
                  <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                    {title}
                  </h2>
                  
                  <p className="text-white/60 text-sm">
                    <span className="font-semibold text-white/90">{alias}</span> has ascended to a new level. The grind continues.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
