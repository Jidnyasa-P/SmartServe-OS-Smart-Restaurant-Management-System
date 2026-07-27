import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';
import { QrCode, Smartphone, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface ScanSceneProps {
  scrollProgress?: MotionValue<number>;
  isScanned?: boolean;
}

export const ScanScene: React.FC<ScanSceneProps> = ({ isScanned = true }) => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#F4F0E8] text-[#171714] border border-[#171714]/20 rounded-md p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 paper-pattern opacity-40 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#171714]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#171714] text-[#F4F0E8] rounded-xs">
            CHAPTER 01
          </span>
          <span className="font-mono text-xs tracking-widest text-[#171714]/60 uppercase">
            TABLE TOUCHPOINT • SCAN INITIALIZATION
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#1F6B4F] bg-[#1F6B4F]/10 px-2.5 py-1 rounded-xs border border-[#1F6B4F]/20">
          <MapPin className="w-3.5 h-3.5" />
          <span>Main Dining Hall • Table 04</span>
        </div>
      </div>

      {/* Scene Content Layout: Copy on Left, Visual Table & Phone on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E7A23B]/20 text-[#171714] border border-[#E7A23B] text-xs font-bold rounded-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E7A23B]" />
            <span>INSTANT SESSION BINDING</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.1] text-[#171714]">
            One scan. <br />
            <span className="italic font-normal text-[#171714]/80">Every team in sync.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#171714]/80 leading-relaxed font-sans max-w-xl">
            A diner sits at Table 04 and scans the table QR tent. Instantly, SmartServe OS generates a cryptographically signed order ticket—binding the customer menu, kitchen line, floor staff map, and manager analytics into one live operational thread.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
            <div className="p-3 bg-[#EAE5D9]/70 border border-[#171714]/20 rounded-xs space-y-1">
              <div className="font-bold text-[#171714] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6B4F]" />
                <span>Zero App Installs</span>
              </div>
              <p className="text-[11px] text-[#171714]/70 font-sans">
                Opens instant responsive web portal inside browser.
              </p>
            </div>

            <div className="p-3 bg-[#EAE5D9]/70 border border-[#171714]/20 rounded-xs space-y-1">
              <div className="font-bold text-[#171714] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6B4F]" />
                <span>Signed QR Tokens</span>
              </div>
              <p className="text-[11px] text-[#171714]/70 font-sans">
                Prevents remote spoofing and unauthorized table orders.
              </p>
            </div>
          </div>
        </div>

        {/* Right Visual: Restaurant Table Scene & Phone Scanning QR */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-md bg-[#EAE5D9] border border-[#171714]/30 rounded-md p-6 shadow-xl space-y-4">
            {/* Wooden Table Surface Representation */}
            <div className="relative w-full h-72 bg-[#171714] rounded-sm p-4 overflow-hidden flex items-center justify-center border border-[#171714]">
              {/* Table Napkin & Glass Accents */}
              <div className="absolute left-4 top-4 w-12 h-20 bg-[#F4F0E8] rounded-xs border border-[#171714]/20 shadow-md transform -rotate-6" />
              <div className="absolute right-6 bottom-6 w-10 h-10 rounded-full border-2 border-[#F4F0E8]/30 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#E7A23B]/20" />
              </div>

              {/* Table Brass QR Code Tent Stand */}
              <div className="relative z-10 w-36 bg-[#F4F0E8] border-2 border-[#E7A23B] rounded-xs p-3 text-center shadow-2xl space-y-2">
                <div className="text-[9px] font-mono font-bold tracking-widest text-[#171714] uppercase border-b border-[#171714]/20 pb-1">
                  TABLE 04
                </div>
                {/* QR Code Graphic */}
                <div className="relative p-2 bg-[#171714] text-[#F4F0E8] rounded-xs flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-[#F4F0E8]" />

                  {/* Animated Scanning Laser Line */}
                  <motion.div
                    animate={{ y: [-24, 24, -24] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1 right-1 h-0.5 bg-[#E7A23B] shadow-[0_0_8px_#E7A23B]"
                  />
                </div>
                <div className="text-[8px] font-mono font-bold text-[#171714]/70">
                  SCAN FOR LIVE MENU
                </div>
              </div>

              {/* Smartphone Approaching QR Code */}
              <motion.div
                initial={{ opacity: 0.8, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute -right-2 top-8 w-32 bg-[#171714] text-[#F4F0E8] border-2 border-[#D9DBD8] rounded-sm p-2 shadow-2xl z-20 transform rotate-12"
              >
                <div className="flex items-center justify-between text-[8px] font-mono text-[#D9DBD8] border-b border-[#D9DBD8]/30 pb-1 mb-2">
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-2.5 h-2.5 text-[#E7A23B]" />
                    <span>CAMERA</span>
                  </div>
                  <span>100%</span>
                </div>
                <div className="h-28 bg-[#F4F0E8] text-[#171714] rounded-xs p-2 flex flex-col justify-between text-[9px]">
                  <div className="font-bold font-mono border-b border-[#171714]/20 pb-0.5">
                    SmartServe QR
                  </div>
                  <div className="bg-[#1F6B4F] text-[#F4F0E8] p-1 text-[8px] font-bold rounded-xs text-center animate-pulse">
                    Tap to Open Menu &rarr;
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Status Indicator Bar */}
            <div className="p-3 bg-[#F4F0E8] border border-[#171714]/20 rounded-xs flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-ping" />
                <span className="font-bold text-[#171714]">Session Binding Active</span>
              </div>
              <span className="text-[10px] text-[#171714]/60">SHA-256 Token OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Footer Note */}
      <div className="relative z-10 pt-4 border-t border-[#171714]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#171714]/70">
        <div>SCROLL OR SELECT NEXT CHAPTER TO PROGRESS STORY &rarr;</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • STEP 01/06</div>
      </div>
    </div>
  );
};
