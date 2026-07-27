import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Grid,
  Plus,
  QrCode,
  Users,
  RefreshCw,
  Check,
  Sparkles,
  Trash2,
  Edit2,
  Key,
  Copy,
  ExternalLink,
  Utensils,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tableSchema } from '../../lib/schemas';
import { RestaurantTable, TableStatus } from '../../types';

export const TableManagementView: React.FC = () => {
  const {
    tables,
    addTable,
    updateTable,
    deleteTable,
    regenerateTableQrToken,
    setSelectedTableNumber,
    setActiveTab,
    dismissWaiterCall,
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const [tableFormData, setTableFormData] = useState({
    number: tables.length + 1,
    capacity: 4,
    status: 'available' as TableStatus,
    assignedStaffName: 'Sarah J.',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAddModal = (tbl?: RestaurantTable) => {
    setFormErrors({});
    if (tbl) {
      setEditingTable(tbl);
      setTableFormData({
        number: tbl.number,
        capacity: tbl.capacity,
        status: tbl.status,
        assignedStaffName: tbl.assignedStaffName || 'Sarah J.',
      });
    } else {
      setEditingTable(null);
      setTableFormData({
        number: Math.max(...tables.map((t) => t.number), 0) + 1,
        capacity: 4,
        status: 'available',
        assignedStaffName: 'Sarah J.',
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parseResult = tableSchema.safeParse({
      number: Number(tableFormData.number),
      capacity: Number(tableFormData.capacity),
      status: tableFormData.status,
      assignedStaffName: tableFormData.assignedStaffName,
    });

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    if (editingTable) {
      updateTable(editingTable.id, parseResult.data);
    } else {
      addTable(parseResult.data);
    }

    setIsAddModalOpen(false);
  };

  const handleCopyLink = (tbl: RestaurantTable) => {
    const link = `${window.location.origin}?token=${tbl.qrToken}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(tbl.id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Available</span>;
      case 'occupied':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">Occupied</span>;
      case 'reserved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/30">Reserved</span>;
      case 'needs_cleaning':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/30">Needs Cleaning</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
            <Grid className="w-4 h-4" />
            <span>SmartServe Floor Matrix</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Table & QR Token Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure restaurant floor tables, capacity, staff assignments & unique cryptographic QR access tokens.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            layout
            className={`bg-slate-900 border rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all relative overflow-hidden ${
              table.waiterCalled
                ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Waiter Alert Banner */}
            {table.waiterCalled && (
              <div className="bg-amber-500 text-slate-950 text-xs font-black py-1 px-3 rounded-xl flex items-center justify-between shadow-md">
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 animate-bounce" />
                  <span>WAITER CALLED</span>
                </span>
                <button
                  onClick={() => dismissWaiterCall(table.number)}
                  className="bg-slate-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-lg hover:bg-slate-900"
                >
                  Clear
                </button>
              </div>
            )}

            <div>
              {/* Table Number & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 bg-slate-950 border border-slate-800 text-amber-400 font-black text-base rounded-2xl flex items-center justify-center shadow-inner">
                    T{table.number}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Table #{table.number}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{table.capacity} Person Capacity</span>
                    </div>
                  </div>
                </div>

                {getStatusBadge(table.status)}
              </div>

              {/* Staff Assignment */}
              <div className="mt-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Staff:</span>
                  <span className="font-bold text-amber-300">
                    {table.assignedStaffName || 'Unassigned'}
                  </span>
                </div>
                {table.currentOrderId && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Active Order:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      #{table.currentOrderId}
                    </span>
                  </div>
                )}
              </div>

              {/* QR Token Box */}
              <div className="mt-3 bg-slate-950 p-2.5 rounded-2xl border border-amber-500/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    <span>QR Security Token</span>
                  </span>
                  <button
                    onClick={() => regenerateTableQrToken(table.id)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition-colors"
                    title="Regenerate cryptographic token"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-mono text-[10px] text-slate-300 truncate bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  {table.qrToken}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleCopyLink(table)}
                  className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1 border border-slate-700 transition-all text-[11px]"
                >
                  {copiedTokenId === table.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedTokenId === table.id ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTableNumber(table.number);
                    setActiveTab('customer');
                  }}
                  className="py-2 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-1 border border-amber-500/30 transition-all text-[11px]"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>View QR Menu</span>
                </button>
              </div>

              {/* Status Quick Toggle */}
              <div className="flex items-center justify-between gap-1">
                <select
                  value={table.status}
                  onChange={(e) =>
                    updateTable(table.id, { status: e.target.value as TableStatus })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="available">Set Available</option>
                  <option value="occupied">Set Occupied</option>
                  <option value="reserved">Set Reserved</option>
                  <option value="needs_cleaning">Needs Cleaning</option>
                </select>

                <button
                  onClick={() => handleOpenAddModal(table)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title="Edit Table"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteTable(table.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700"
                  title="Delete Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT TABLE (Zod validated) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-lg">
                  {editingTable ? 'Edit Table Configuration' : 'Add New Restaurant Table'}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveTable} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Table Number *
                    </label>
                    <input
                      type="number"
                      value={tableFormData.number}
                      onChange={(e) =>
                        setTableFormData({ ...tableFormData, number: Number(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                    {formErrors.number && (
                      <p className="text-[11px] text-rose-400 font-bold mt-1">
                        {formErrors.number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Guest Capacity *
                    </label>
                    <input
                      type="number"
                      value={tableFormData.capacity}
                      onChange={(e) =>
                        setTableFormData({ ...tableFormData, capacity: Number(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.capacity && (
                      <p className="text-[11px] text-rose-400 font-bold mt-1">
                        {formErrors.capacity}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={tableFormData.status}
                    onChange={(e) =>
                      setTableFormData({
                        ...tableFormData,
                        status: e.target.value as TableStatus,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="needs_cleaning">Needs Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Assigned Floor Staff Name
                  </label>
                  <input
                    type="text"
                    value={tableFormData.assignedStaffName}
                    onChange={(e) =>
                      setTableFormData({ ...tableFormData, assignedStaffName: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                  >
                    Save Table (Zod Validated)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
