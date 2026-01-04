'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Heart, X } from 'lucide-react';

interface VotingPatternWarningProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VotingPatternWarning({ isOpen, onClose }: VotingPatternWarningProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient top accent */}
              <div className="h-1.5 bg-gradient-warm" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-4 p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors rounded-full hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="px-6 pt-6 pb-5">
                {/* Icon with pulse animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    delay: 0.1,
                    damping: 15,
                    stiffness: 200,
                  }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-500/20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <AlertTriangle className="h-7 w-7 text-secondary-400" />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-center text-xl font-bold text-white mb-3"
                >
                  Ei, percebemos algo...
                </motion.h2>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 text-center"
                >
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Suas últimas avaliações estão muito parecidas entre si.
                  </p>

                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Pensa com a gente: você gostaria que alguém avaliasse suas fotos sem
                    realmente olhar para elas?
                  </p>

                  {/* Empathy highlight */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Heart className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-300 text-sm font-medium">
                      Cada foto é de uma pessoa real
                    </span>
                    <Heart className="w-4 h-4 text-primary-400" />
                  </div>

                  {/* Warning box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 rounded-xl bg-neutral-800/50 border border-neutral-700 p-3"
                  >
                    <p className="text-xs text-neutral-400">
                      <span className="text-secondary-400 font-semibold">Atenção:</span>{' '}
                      Se identificarmos esse padrão novamente, o ganho de karma será zerado.
                    </p>
                  </motion.div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30"
                >
                  Entendi, vou prestar mais atenção
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
