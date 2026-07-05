import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  X, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Student, Expense } from '../types';

interface FinanceViewProps {
  key?: React.Key;
  expenses: Expense[];
  students: Student[];
  onAddExpense: (expense: Expense) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export default function FinanceView({ 
  expenses, 
  students, 
  onAddExpense,
  searchTerm: parentSearchTerm,
  onSearchChange: parentOnSearchChange
}: FinanceViewProps) {
  const [ledgerTab, setLedgerTab] = useState<'expenses' | 'income'>('expenses');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchTerm = parentSearchTerm !== undefined ? parentSearchTerm : localSearchTerm;
  const setSearchTerm = (val: string) => {
    if (parentOnSearchChange) {
      parentOnSearchChange(val);
    } else {
      setLocalSearchTerm(val);
    }
  };
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Expense form states
  const [formData, setFormData] = useState({
    amount: '',
    status: 'Complete' as 'Complete' | 'Pending' | 'Canceled',
    payer: '',
    purpose: '',
  });

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.payer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || exp.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredStudents = students.filter(stud => {
    const matchesSearch = stud.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stud.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stud.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || stud.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.payer || !formData.purpose) return;

    // Standard Vietnamese local date format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newExpense: Expense = {
      id: `#123456${Math.floor(100 + Math.random() * 900)}`,
      date: `${day} ${month} ${year}, ${time}`,
      amount: Number(formData.amount),
      status: formData.status,
      payer: formData.payer,
      purpose: formData.purpose
    };

    onAddExpense(newExpense);
    setIsAddModalOpen(false);
    setFormData({ amount: '', status: 'Complete', payer: '', purpose: '' });
  };

  // Calculate real metrics dynamically
  const totalIncome = students
    .filter(s => s.status === 'Complete')
    .reduce((sum, s) => sum + s.tuitionFee, 0);

  const totalExpenses = expenses
    .filter(e => e.status === 'Complete')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Custom Balance Analytics Line Chart Coordinates
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Dynamic analytics data scaling over months to current actual net balance in Jul/Dec
  const analyticsData = [45000, 52000, 58000, 68000, 72000, 85000, 92000, 99000, 110000, 125000, 140000, netBalance];
  const maxVal = Math.max(...analyticsData, 150000);
  const width = 800;
  const height = 150;

  const points = analyticsData.map((val, idx) => {
    const x = (idx / (analyticsData.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return { x, y };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
    const cpY2 = p1.y;
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFE4D6]/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#7A7A7A] block">Total Income (Tuition)</span>
              <span className="text-2xl font-extrabold text-[#2D2D2D] mt-1 block">${totalIncome.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#70D6FF] bg-[#70D6FF]/10 px-2.5 py-1 rounded-full">From Student Tuition</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFE4D6]/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#7A7A7A] block">Total Expenses (Ledger)</span>
              <span className="text-2xl font-extrabold text-[#2D2D2D] mt-1 block">${totalExpenses.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#ff5b5b] bg-[#ff5b5b]/10 px-2.5 py-1 rounded-full">From Approved Bills</span>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FF5BAE] p-6 rounded-3xl shadow-md text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
              <CircleDollarSign className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-white/70 block">Net Balance</span>
              <span className="text-2xl font-extrabold mt-1 block">${netBalance.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-full">Safe Margin</span>
        </div>
      </div>

      {/* 2. Interactive Balance Line Chart */}
      <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#2D2D2D] font-display">Balance Analytics</h3>
            <span className="text-xs text-[#7A7A7A] font-semibold mt-1 block">Live tracking of institutional liquidity</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#FF5BAE] bg-[#FF5BAE]/10 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" /> Upward Trend
          </span>
        </div>

        {/* SVG Curve */}
        <div className="relative w-full overflow-x-auto pt-4">
          <div className="min-w-[600px] h-44 relative">
            <svg className="w-full h-36 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5BAE" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF5BAE" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

              {/* Path Shading Area */}
              <path d={areaPath} fill="url(#balanceGrad)" />

              {/* Solid Path Line */}
              <path d={linePath} fill="none" stroke="#FF5BAE" strokeWidth="4" strokeLinecap="round" />

              {/* Highlight Dot for current month (Dec) */}
              <circle cx={points[11].x} cy={points[11].y} r="6" fill="#FF9B71" stroke="#white" strokeWidth="3" className="animate-ping" />
              <circle cx={points[11].x} cy={points[11].y} r="5" fill="#FF9B71" stroke="#white" strokeWidth="2" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between text-[11px] font-bold text-[#7A7A7A] px-2 mt-2">
              {months.map((m, idx) => (
                <span key={m} className={idx === 11 ? 'text-[#FF5BAE] font-extrabold' : ''}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Ledger Card with Tabs */}
      <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-4 border-b border-[#FFE4D6]/50">
          {/* Tabs for Ledger Type */}
          <div className="flex border border-[#FFE4D6] p-1 rounded-2xl bg-[#FFF5F1]/30">
            <button
              onClick={() => { setLedgerTab('expenses'); setStatusFilter('All'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                ledgerTab === 'expenses'
                  ? 'bg-[#FF5BAE] text-white shadow-sm'
                  : 'text-[#7A7A7A] hover:text-[#2D2D2D]'
              }`}
            >
              Institution Expenses
            </button>
            <button
              onClick={() => { setLedgerTab('income'); setStatusFilter('All'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                ledgerTab === 'income'
                  ? 'bg-[#FF5BAE] text-white shadow-sm'
                  : 'text-[#7A7A7A] hover:text-[#2D2D2D]'
              }`}
            >
              Student Tuition Income
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-[#7A7A7A]" />
              </span>
              <input
                id="ledger-search"
                type="text"
                placeholder={ledgerTab === 'expenses' ? "Search ledger..." : "Search students..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-[#FFE4D6] rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] w-48 text-[#2D2D2D] font-semibold bg-[#FFF5F1]/50"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1">
              {['All', 'Complete', 'Pending', 'Canceled'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${
                    statusFilter === f 
                      ? 'bg-[#FF5BAE] text-white' 
                      : 'bg-[#FFF5F1] hover:bg-slate-100 text-[#2D2D2D]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Action button (Only for Expenses) */}
            {ledgerTab === 'expenses' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5BAE] text-white rounded-full text-xs font-bold hover:bg-[#FF5BAE]/90 transition-all shadow-sm animate-fade-in"
              >
                <Plus className="w-4 h-4" /> Add Bill
              </button>
            )}
          </div>
        </div>

        {ledgerTab === 'expenses' ? (
          /* Ledger Table: EXPENSES */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#FFE4D6]">
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Receipt ID</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Date & Time</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Paid By</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Purpose</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Amount Paid</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Verification Status</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFE4D6]/40">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FFF5F1] transition-colors group">
                    {/* ID */}
                    <td className="py-4 font-bold text-[#FF5BAE] text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-slate-400" />
                      {exp.id}
                    </td>
                    {/* Date */}
                    <td className="py-4 text-xs font-semibold text-[#2D2D2D] whitespace-nowrap">{exp.date}</td>
                    {/* Paid By */}
                    <td className="py-4 text-xs font-bold text-slate-700">{exp.payer || 'N/A'}</td>
                    {/* Purpose */}
                    <td className="py-4 text-xs font-semibold text-slate-600 max-w-[180px] truncate" title={exp.purpose}>
                      {exp.purpose || 'N/A'}
                    </td>
                    {/* Amount */}
                    <td className="py-4 text-sm font-extrabold text-[#2D2D2D]">${exp.amount.toLocaleString()}</td>
                    {/* Status */}
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        exp.status === 'Complete' 
                          ? 'bg-[#70D6FF]/10 text-[#70D6FF]' 
                          : exp.status === 'Pending' 
                            ? 'bg-[#FFD21E]/10 text-[#FFD21E]' 
                            : 'bg-[#ff5b5b]/10 text-[#ff5b5b]'
                      }`}>
                        {exp.status === 'Complete' && <CheckCircle className="w-3.5 h-3.5" />}
                        {exp.status === 'Pending' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {exp.status === 'Canceled' && <XCircle className="w-3.5 h-3.5" />}
                        {exp.status}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#FF5BAE] hover:bg-[#FF5BAE]/5 rounded-full transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Ledger Table: TUITION INCOME */
          <div className="overflow-x-auto animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#FFE4D6]">
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Student ID</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Date Enrolled</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Student Name</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Class/Grade</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Tuition Fee</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Payment Status</th>
                  <th className="pb-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFE4D6]/40">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-[#FFF5F1] transition-colors group">
                    {/* ID */}
                    <td className="py-4 font-bold text-[#FF5BAE] text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-slate-400" />
                      {stud.id}
                    </td>
                    {/* Date */}
                    <td className="py-4 text-xs font-semibold text-[#2D2D2D] whitespace-nowrap">{stud.date}</td>
                    {/* Name */}
                    <td className="py-4 text-xs font-bold text-slate-700">{stud.name}</td>
                    {/* Grade */}
                    <td className="py-4 text-xs font-bold text-slate-500">{stud.grade}</td>
                    {/* Fee */}
                    <td className="py-4 text-sm font-extrabold text-[#2D2D2D]">${stud.tuitionFee.toLocaleString()}</td>
                    {/* Status */}
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        stud.status === 'Complete' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                          : stud.status === 'Pending' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60' 
                            : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                      }`}>
                        {stud.status === 'Complete' && <CheckCircle className="w-3.5 h-3.5" />}
                        {stud.status === 'Pending' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {stud.status === 'Canceled' && <XCircle className="w-3.5 h-3.5" />}
                        {stud.status === 'Complete' ? 'Paid' : stud.status === 'Pending' ? 'Unpaid' : 'Overdue'}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#FF5BAE] hover:bg-[#FF5BAE]/5 rounded-full transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Billing record dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
            >
              <div className="bg-[#FF5BAE] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <CircleDollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold font-display">Record Bill Expense</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Paid By (Payer) *</label>
                  <input
                    type="text"
                    required
                    value={formData.payer}
                    onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
                    placeholder="e.g. Robert Johnson"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Payment Purpose *</label>
                  <input
                    type="text"
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g. Teacher Salaries"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Billing Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 50036"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Billing Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm bg-white text-[#2D2D2D] font-semibold"
                  >
                    <option value="Complete">Complete / Approved</option>
                    <option value="Pending">Pending / Verifying</option>
                    <option value="Canceled">Canceled / Rejected</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFE4D6]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-full text-[#2D2D2D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF5BAE] text-white rounded-full text-xs font-bold shadow transition-all"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
