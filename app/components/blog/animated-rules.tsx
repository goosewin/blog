'use client';

import { motion } from 'framer-motion';

interface Rule {
  number: number;
  title: string;
  description: string;
}

const rules: Rule[] = [
  {
    number: 1,
    title: 'Optimize for agency, not addiction',
    description:
      'Reward completion, mastery, off-ramps. Not infinite scroll. Shift metrics from session length to successful outcomes.',
  },
  {
    number: 2,
    title: 'Minimize time for intent-to-outcome',
    description:
      'Fewer clicks to outcome. Summaries with links to sources. Defaults that reduce cognitive overhead.',
  },
  {
    number: 3,
    title: 'Provide privacy by default',
    description:
      'Contextual consent, not blanket. Clear, reversible choices. No dark patterns.',
  },
  {
    number: 4,
    title: 'Data dignity as fundamental right',
    description:
      'User-owned data. Easy export/import. Local-first where possible.',
  },
  {
    number: 5,
    title: 'Verifiable credibility',
    description:
      "Show sources. Expose uncertainty. Make verification easy. Put humans in the driver's seat.",
  },
  {
    number: 6,
    title: 'Measure progress, not engagement',
    description:
      'Capture tasks completed, skills gained, relationships strengthened. Not attention captured.',
  },
  {
    number: 7,
    title: 'Build for exit velocity',
    description:
      'Best experiences make themselves obsolete by leveling users up. Graduation is the desired outcome.',
  },
];

export default function AnimatedRules() {
  return (
    <div className="">
      {rules.map((rule, index) => (
        <motion.div
          key={rule.number}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '50px' }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="grid min-h-[100px] grid-cols-[60px_1fr] md:grid-cols-[40px_1fr] gap-6 items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="text-right"
          >
            <motion.span
              initial={{ backgroundPosition: '0% 50%' }}
              whileInView={{ backgroundPosition: '100% 50%' }}
              viewport={{ once: true, margin: '50px' }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              className="font-mono text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-gray-400 dark:from-gray-600 dark:via-gray-100 dark:to-gray-600 bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              {rule.number}
            </motion.span>
          </motion.div>
          <div className="h-full flex flex-col justify-center py-4">
            <h3 className="text-lg md:text-xl font-semibold mb-1 leading-tight mt-0">
              {rule.title}
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-0">
              {rule.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

