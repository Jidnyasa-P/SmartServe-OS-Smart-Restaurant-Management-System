import React from 'react';
import { motion } from 'motion/react';
import { QrCode, BookOpen, ChefHat, LayoutGrid, BarChart3, CheckCircle2 } from 'lucide-react';

export interface Chapter {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface StoryChapterRailProps {
  activeChapter: number;
  onSelectChapter: (chapterId: number) => void;
  className?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    number: '01',
    title: 'THE SCAN',
    subtitle: 'Table QR Contact',
    icon: <QrCode className="w-3.5 h-3.5" />,
  },
  {
    id: 2,
    number: '02',
    title: 'THE CHOICE',
    subtitle: 'Live Customer Menu',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: 3,
    number: '03',
    title: 'THE PASS',
    subtitle: 'Kitchen KDS Station',
    icon: <ChefHat className="w-3.5 h-3.5" />,
  },
  {
    id: 4,
    number: '04',
    title: 'THE FLOOR',
    subtitle: 'Service Map & Routing',
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
  },
  {
    id: 5,
    number: '05',
    title: 'THE SIGNAL',
    subtitle: 'Manager Gemini Analytics',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
  },
  {
    id: 6,
    number: '06',
    title: 'THE PAYOFF',
    subtitle: 'Unified Operation',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
];

export const StoryChapterRail: React.FC<StoryChapterRailProps> = ({
  activeChapter,
  onSelectChapter,
  className = '',
}) => {
  return (
    <div
      className={`sticky top-20 z-30 bg-[#D9DBD8] text-[#171714] border border-[#171714]/20 shadow-lg rounded-md p-2 w-full max-w-xs ${className}`}
    >
      {/* Brass Ticket Rail Header */}
      <div className="flex items-center justify-between border-b border-[#171714]/20 pb-2 mb-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E7A23B] border border-[#171714]" />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#171714]">
            KITCHEN TICKET RAIL
          </span>
        </div>
        <span className="font-mono text-[10px] bg-[#171714] text-[#F4F0E8] px-1.5 py-0.5 rounded-xs">
          CH {activeChapter}/06
        </span>
      </div>

      {/* Chapters list */}
      <div className="space-y-1">
        {CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id;
          const isPassed = activeChapter > ch.id;

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={`w-full text-left p-2 rounded-xs border transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-[#F4F0E8] border-[#171714] shadow-sm text-[#171714]'
                  : isPassed
                  ? 'bg-[#EAE5D9]/50 border-transparent text-[#171714]/70 hover:bg-[#F4F0E8]/70'
                  : 'bg-transparent border-transparent text-[#171714]/50 hover:bg-[#F4F0E8]/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono text-[11px] font-bold border transition-colors ${
                    isActive
                      ? 'bg-[#E7A23B] text-[#171714] border-[#171714]'
                      : isPassed
                      ? 'bg-[#1F6B4F] text-[#F4F0E8] border-[#1F6B4F]'
                      : 'bg-[#171714]/10 text-[#171714]/60 border-[#171714]/20'
                  }`}
                >
                  {ch.number}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold leading-tight tracking-wide">
                    {ch.title}
                  </div>
                  <div className="text-[10px] font-sans text-[#171714]/60 leading-none mt-0.5">
                    {ch.subtitle}
                  </div>
                </div>
              </div>

              <div
                className={`transition-transform ${
                  isActive ? 'scale-110 text-[#E7A23B]' : 'opacity-40 group-hover:opacity-80'
                }`}
              >
                {ch.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
