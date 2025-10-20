'use client';

import { motion } from 'framer-motion';

export default function PrincipleStatement() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-8 p-8 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1c1c] dark:to-[#252525] border-2 border-gray-900 dark:border-gray-100 rounded-lg"
    >
      <div className="max-w-3xl mx-auto">
        <blockquote className="border-none text-xl md:text-2xl leading-relaxed font-medium text-center">
          Technology was created to{' '}
          <motion.span
            className="relative inline-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="relative z-10">accelerate and connect</span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-3 bg-gray-900/10 dark:bg-gray-100/10 -z-0"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ originX: 0 }}
            />
          </motion.span>{' '}
          humans, regardless of their abilities and limitations. It is therefore
          imperative that I use it to{' '}
          <motion.span
            className="relative inline-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <span className="relative z-10">empower</span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-3 bg-gray-900/10 dark:bg-gray-100/10 -z-0"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ originX: 0 }}
            />
          </motion.span>{' '}
          individuals and communities, rather than to exploit them.
        </blockquote>
      </div>
    </motion.div>
  );
}
