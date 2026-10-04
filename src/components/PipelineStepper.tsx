import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';

export interface AIProcessingStep {
  id: string;
  name: string;
  detail: string;
}

export const AI_PROCESSING_STEPS: AIProcessingStep[] = [
  { id: 'context', name: 'Analyzing strategic context', detail: 'Deconstructing core premise & value prop' },
  { id: 'audience', name: 'Understanding target audience', detail: 'Mapping psychographic triggers & pain points' },
  { id: 'goal', name: 'Mapping communication goal', detail: 'Aligning conversion funnel & CTA directives' },
  { id: 'brand_voice', name: 'Applying brand voice', detail: 'Calibrating syntax, vocabulary & cadence' },
  { id: 'platform_intel', name: 'Adapting content to platform', detail: 'Engineering native algorithm structure' },
  { id: 'generation', name: 'Generating native content', detail: 'Synthesizing 5 platform-specific outputs' },
];

interface PipelineStepperProps {
  currentStepIndex: number;
  isGenerating: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStepIndex,
  isGenerating,
}) => {
  const isComplete = !isGenerating && currentStepIndex >= AI_PROCESSING_STEPS.length - 1;
  const progressPercent = isGenerating
    ? Math.min(100, Math.round(((currentStepIndex + 1) / AI_PROCESSING_STEPS.length) * 100))
    : isComplete
    ? 100
    : 0;

  return (
    <div className="w-full my-6 p-5 sm:p-6 studio-card border border-[#3A2347] bg-[#21132B]/90 shadow-2xl relative overflow-hidden text-[#FFF8FC] animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase font-display text-[#FFF8FC] flex items-center gap-2">
              <span>✦ AI Content Engine</span>
              {isGenerating && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C026D3]/20 text-[#F472B6] border border-[#C026D3]/40 font-mono animate-pulse">
                  Processing...
                </span>
              )}
              {isComplete && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/30 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>AI adaptation complete</span>
                </span>
              )}
            </h3>
            <p className="text-xs text-[#B8A8BE] mt-0.5">
              Transforming one idea into 5 distinct, platform-adapted intelligence assets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#B8A8BE]">
          <span>{progressPercent}%</span>
          <span className="text-[#3A2347]">|</span>
          <span className="text-[#F5C451]">
            Step {Math.min(currentStepIndex + 1, AI_PROCESSING_STEPS.length)} of {AI_PROCESSING_STEPS.length}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-1.5 bg-[#160D20] rounded-full overflow-hidden mb-5 border border-[#3A2347]/50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#A855F7] via-[#F472B6] to-[#C026D3]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* 6 Sequenced Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {AI_PROCESSING_STEPS.map((step, idx) => {
          const isDone = isComplete || idx < currentStepIndex;
          const isCurrent = isGenerating && idx === currentStepIndex;
          const isPending = !isComplete && idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-start gap-2.5 ${
                isDone
                  ? 'bg-[#160D20]/90 border-[#55D6A0]/30 text-[#FFF8FC]'
                  : isCurrent
                  ? 'bg-[#160D20] border-[#A855F7] text-[#FFF8FC] shadow-sm shadow-[#A855F7]/20'
                  : 'bg-[#160D20]/40 border-[#3A2347]/40 text-[#B8A8BE]/60'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-[#55D6A0]/20 text-[#55D6A0] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center">
                    <Loader2 className="w-3 h-3 animate-spin text-[#A855F7]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#3A2347] flex items-center justify-center text-[9px] font-mono text-[#B8A8BE]/50">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className={`text-xs font-semibold leading-tight truncate ${
                  isCurrent ? 'text-[#F5C451]' : isDone ? 'text-[#FFF8FC]' : 'text-[#B8A8BE]'
                }`}>
                  {step.name}
                </div>
                <div className="text-[10px] text-[#B8A8BE] truncate mt-0.5">
                  {step.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
