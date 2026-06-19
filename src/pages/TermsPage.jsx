import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>
        
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Zap size={24} className="text-[#22D3EE]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-[#22D3EE] max-w-none"
        >
          <p className="lead text-xl text-white/80">Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-white/70 mb-6">By accessing and using Pace ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p className="text-white/70 mb-6">Pace is a productivity and task management application that provides users with tools to organize tasks, track progress, collaborate with others, and earn gamified rewards.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="text-white/70 mb-6">To use certain features of the App, you must register for an account using Google Auth or email. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
          <p className="text-white/70 mb-6">You retain all rights to any tasks, projects, or data you submit to the App ("User Content"). By submitting User Content, you grant Pace a license to host, store, and process this content solely for the purpose of providing the service to you.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Acceptable Use</h2>
          <p className="text-white/70 mb-4">You agree not to use the App to:</p>
          <ul className="list-disc pl-6 text-white/70 mb-6 space-y-2">
            <li>Upload or share unlawful, harmful, or abusive content</li>
            <li>Interfere with or disrupt the integrity or performance of the App</li>
            <li>Attempt to gain unauthorized access to the App or related systems</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p className="text-white/70 mb-6">We reserve the right to suspend or terminate your access to the App at any time, with or without cause, and with or without notice.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p className="text-white/70 mb-6">We may modify these Terms at any time. We will provide notice of significant changes. Your continued use of the App after such modifications constitutes your acceptance of the updated Terms.</p>
        </motion.div>
      </div>
    </div>
  );
}
