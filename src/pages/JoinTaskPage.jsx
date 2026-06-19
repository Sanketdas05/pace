import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { joinTask } from '../lib/firestore';
import { motion } from 'framer-motion';

export default function JoinTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isDemoMode } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processJoin = async () => {
      if (!taskId) return;
      if (isDemoMode || !currentUser) {
        // In demo mode, there's no actual database joining needed
        // as local storage tasks don't have true access control separation
        navigate(`/task/${taskId}`, { replace: true });
        return;
      }

      try {
        await joinTask(taskId, currentUser.uid);
        navigate(`/task/${taskId}`, { replace: true });
      } catch (err) {
        console.error('Failed to join task:', err);
        setError(err.message || 'Failed to join the task. Please check if the link is correct.');
      }
    };

    processJoin();
  }, [taskId, currentUser, isDemoMode, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-terracotta mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-3 border-[var(--color-mist)] border-t-[var(--color-primary)] rounded-full mb-4"
      />
      <p className="text-[var(--color-smoke)]">Joining team task...</p>
    </div>
  );
}
