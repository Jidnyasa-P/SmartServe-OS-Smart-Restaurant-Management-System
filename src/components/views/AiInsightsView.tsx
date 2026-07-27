import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Bot, Send, Lightbulb, TrendingUp, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AiInsightsView: React.FC = () => {
  const {
    aiInsights,
    generateAiInsights,
    isGeneratingAi,
    askAiQuestion,
    restaurant,
  } = useStore();

  const [question, setQuestion] = useState<string>('');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsQuerying(true);
    const answer = await askAiQuestion(question);
    setChatAnswer(answer);
    setIsQuerying(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* AI Hub Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 border border-purple-500/30 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Gemini 2.5 AI Operational Intelligence Engine
            </h1>
            <p className="text-xs text-purple-200/80">
              Analyzes live kitchen orders, stock degradation, and peak hour turnover to maximize restaurant yield.
            </p>
          </div>
        </div>

        <button
          disabled={isGeneratingAi}
          onClick={generateAiInsights}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-purple-500/20 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGeneratingAi ? 'Analyzing Live Telemetry...' : 'Generate AI Insights'}</span>
        </button>
      </div>

      {/* Generated Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiInsights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col justify-between space-y-4 shadow-xl hover:border-purple-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {insight.type}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {insight.impact}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-100">
                {insight.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {insight.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
              <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Actionable Recommendation:</span>
              </div>
              <p className="text-xs text-slate-200">
                {insight.recommendation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive AI Operational Assistant Chat */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Bot className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold text-base">Ask Gemini AI Operational Consultant</h2>
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How can we reduce Table 2 wait time or boost dessert sales tonight?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isQuerying}
            className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isQuerying ? 'Reasoning...' : 'Ask AI'}</span>
          </button>
        </form>

        {chatAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap"
          >
            <span className="font-bold text-amber-300 block mb-1">
              Gemini AI Recommendation:
            </span>
            {chatAnswer}
          </motion.div>
        )}
      </div>
    </div>
  );
};
