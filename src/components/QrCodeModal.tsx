import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { QrCode, X, Printer, Utensils, Copy, Check, RefreshCw, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const { restaurant, tables, selectedTableNumber, setSelectedTableNumber, setActiveTab, regenerateTableQrToken } = useStore();
  const [tableNum, setTableNum] = useState<number>(selectedTableNumber);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTable = tables.find((t) => t.number === tableNum) || tables[0];
  const token = currentTable?.qrToken || `tbl_tok_${tableNum}_safe`;
  const customerLink = `${window.location.origin}?token=${token}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customerLink)}`;

  const handleSimulateScan = () => {
    setSelectedTableNumber(tableNum);
    setActiveTab('customer');
    // Store active token in URL / state
    window.history.replaceState({}, '', `?token=${token}`);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateToken = () => {
    if (currentTable) {
      regenerateTableQrToken(currentTable.id);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <h2 className="font-extrabold text-lg">Table QR Code Generator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Select Table Number:
            </label>
            <select
              value={tableNum}
              onChange={(e) => setTableNum(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.number}>
                  Table #{t.number} ({t.capacity} Seats) - Token: {t.qrToken}
                </option>
              ))}
            </select>
          </div>

          {/* Table Tent Card Mock */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 text-center space-y-3 shadow-xl relative overflow-hidden">
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-widest">
              {restaurant.name}
            </div>

            <div className="text-2xl font-black text-white">
              Table #{tableNum}
            </div>

            <div className="w-40 h-40 bg-white rounded-2xl p-2 mx-auto shadow-inner flex items-center justify-center">
              <img
                src={qrUrl}
                alt={`QR Code Table ${tableNum}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 py-1 px-3 rounded-full border border-amber-500/20 font-mono">
              <Key className="w-3 h-3" />
              <span>Token: {token}</span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Scan with camera to lock session to Table #{tableNum}
            </p>
          </div>

          {/* QR Token Actions */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Link Copied!' : 'Copy QR Link'}</span>
            </button>

            <button
              onClick={handleRegenerateToken}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>New Token</span>
            </button>
          </div>

          {/* Main Action */}
          <button
            onClick={handleSimulateScan}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Utensils className="w-4 h-4" />
            <span>Launch Customer Menu with Token (Table #{tableNum})</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
