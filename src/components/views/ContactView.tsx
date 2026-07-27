import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Building2,
  Globe,
  Bot,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    restaurantName: '',
    role: 'manager',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: 'How does SmartServe OS handle table QR code security?',
      a: 'Tables use 256-bit cryptographically generated random tokens hashed with SHA-256 before storage in Cloud Firestore. Frontend price payloads are ignored and canonical menu prices are derived exclusively server-side.',
    },
    {
      q: 'Does SmartServe OS require specialized POS hardware?',
      a: 'No! SmartServe OS is 100% web-native and runs on any modern browser (tablets, iPads, Android KDS monitors, smartphones, laptops, and PCs).',
    },
    {
      q: 'How does Gemini AI process restaurant analytics securely?',
      a: 'Our Express backend pipeline strips all PII (Customer Names, Emails, User IDs, QR Tokens) before sending aggregated shift stats to Google Gemini 2.5 Flash, preventing data leaks.',
    },
    {
      q: 'Can kitchen staff mark sold-out items on the fly?',
      a: 'Yes! Kitchen staff can toggle 86 status directly from the Kitchen KDS or Menu Catalog view. The change propagates across all customer QR screens immediately.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-12 max-w-6xl mx-auto"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>24/7 SUPPORT & ENGINEERING DESK</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Get in Touch with SmartServe OS
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Have questions regarding enterprise deployments, custom KDS integrations, or VibeAthon6.0 hackathon details? Reach out to our engineering team directly.
        </p>
      </div>

      {/* Main Form & Contact Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Contact Information</span>
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-sans text-[11px]">DEVELOPER EMAIL</div>
                  <div className="text-white font-bold font-mono">support@smartserve.os</div>
                  <div className="text-slate-500 text-[10px] font-sans mt-0.5">Average response: under 2 hours</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-sans text-[11px]">OPERATIONS DESK</div>
                  <div className="text-white font-bold font-mono">+1 (800) 555-SERVE</div>
                  <div className="text-slate-500 text-[10px] font-sans mt-0.5">Mon-Sun 8:00 AM - 11:00 PM EST</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-sans text-[11px]">HEADQUARTERS & CLOUD RUN</div>
                  <div className="text-white font-bold font-mono">Google Cloud Platform • Cloud Run</div>
                  <div className="text-slate-500 text-[10px] font-sans mt-0.5">San Francisco, CA & Global Edge</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Contact Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant Gemini Assistant</h4>
                <p className="text-[10px] text-amber-300 font-mono">LIVE ON-DEMAND RESTAURANT INSIGHTS</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Need immediate operational advice for your shift? Try asking our Gemini AI Engine in the Gemini AI tab for real-time recommendations.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-extrabold text-white">Send Us a Message</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill out the form below and an engineer will respond shortly.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-8"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Message Dispatched Successfully!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-emerald-400 font-bold">{formData.name || 'Partner'}</span>. Your inquiry regarding <span className="text-white font-semibold">{formData.subject}</span> has been logged to the SmartServe OS support desk.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        restaurantName: '',
                        role: 'manager',
                        subject: 'General Inquiry',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-300">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Chef Marcus Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-300">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="marcus@aureliusdining.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-300">
                        RESTAURANT NAME
                      </label>
                      <input
                        type="text"
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        placeholder="e.g. Aurelius Fine Dining"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-300">
                        INQUIRY SUBJECT
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="SaaS Deployment">SaaS Deployment / Enterprise</option>
                        <option value="Hackathon Feedback">VibeAthon6.0 Hackathon Feedback</option>
                        <option value="Technical Support">Technical Support / Bug Report</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300">
                      MESSAGE DETAILS *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry, operational requirements, or feedback..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-black text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between font-bold text-xs text-white">
                <span>{faq.q}</span>
                <span className="text-amber-400 font-mono">{activeFaq === index ? '−' : '+'}</span>
              </div>
              {activeFaq === index && (
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed font-sans">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
