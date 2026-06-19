import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>
        
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Shield size={24} className="text-[#50DFAB]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-[#50DFAB] max-w-none"
        >
          <p className="lead text-xl text-white/80">Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-white/70 mb-6">We collect information you provide directly to us, such as your name, email address, and profile picture when you create an account using Google Auth or email registration. We also store the tasks, projects, and collaborative content you create within the app.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-white/70 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-white/70 mb-6 space-y-2">
            <li>Provide, maintain, and improve the Pace application</li>
            <li>Sync your tasks and data across your devices</li>
            <li>Send you important technical notices and support messages</li>
            <li>Enable real-time collaboration features with other users you invite</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
          <p className="text-white/70 mb-6">Your data is stored securely using Firebase infrastructure provided by Google. We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="text-white/70 mb-6">We do not sell your personal data. Your information is only shared with third-party service providers (like Google Firebase) that are essential for operating our service. When you use collaborative features, your name and profile picture may be visible to other members of your shared workspaces.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="text-white/70 mb-6">You have the right to access, update, or delete your personal information at any time. You can delete your account and all associated data directly from the settings menu within the app.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="text-white/70 mb-6">If you have any questions about this Privacy Policy, please contact us at our support email address.</p>
        </motion.div>
      </div>
    </div>
  );
}
