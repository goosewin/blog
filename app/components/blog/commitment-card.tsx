'use client';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CommitmentCard() {
  const handleCommit = () => {
    // Fire confetti from left side
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#000000', '#ffffff', '#808080'],
    });

    // Fire confetti from right side
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#000000', '#ffffff', '#808080'],
    });
  };

  return (
    <div className="my-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br dark:from-[#1c1c1c] dark:to-[#252525] from-gray-100 to-gray-200 rounded-lg text-center shadow-md"
      >
        <h3 className="text-2xl font-semibold mb-4">
          What Will You Optimize For?
        </h3>
        <p className="dark:text-gray-300 text-gray-700 mb-8 max-w-lg mx-auto">
          Make your commitment right now. Choose the path forward.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <button
            onClick={handleCommit}
            className="flex-1 cursor-pointer px-8 py-4 dark:bg-white bg-black dark:text-black text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Agency & Progress
          </button>
          <button
            disabled
            className="flex-1 px-8 py-4 dark:bg-gray-600 bg-gray-100 dark:text-gray-400 text-gray-600 rounded-lg font-semibold cursor-not-allowed opacity-50"
          >
            Engagement & Retention
          </button>
        </div>

        <p className="text-xs dark:text-gray-400 text-gray-600 mt-4">
          (There&apos;s only one real choice)
        </p>
      </motion.div>
    </div>
  );
}
