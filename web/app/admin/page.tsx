'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';
const ADMIN_PASSWORD = 'farmlink2025';

interface Harvest {
  id: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  status: string;
  farmerId: string;
  location?: { state?: string };
  createdAt?: any;
  views?: number;
}

interface Transaction {
  id: string;
  buyerId: string;
  productId: string;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  createdAt?: any;
  farmerAmount?: number;
  platformFee?: number;
}

function formatNaira(n: number) {
  return '₦' + (n || 0).toLocaleString('en-NG');
}

function timeAgo(ts: any): string {
  if (!ts) return '—';
  const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-600',
    completed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    pending_payment: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[s] || 'bg-gray-100 text-gray-600'}`}>
      {s?.replace(/_/g, ' ') || '—'}
    </span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState<'overview' | 'listings' | 'transactions'>('overview');
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Incorrect password. Try: farmlink2025');
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/harvests?limit=100`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([hData]) => {
      setHarvests(hData.data || []);
    }).finally(() => setLoading(false));
  }, [authed]);

  const stats = {
    totalListings: harvests.length,
    activeListings: harvests.filter(h => h.status === 'available').length,
    totalValue: harvests.reduce((s, h) => s + (h.pricePerUnit * h.quantity), 0),
    avgViews: harvests.length ? Math.round(harvests.reduce((s, h) => s + (h.views || 0), 0) / harvests.length) : 0,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-black">F</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">FarmLink Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="Enter admin password"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${pwError ? 'border-red-400' : 'border-gray-200'}`}
              />
              {pwError && <p className="text-red-500 text-xs mt-1">{pwError}</p>}
            </div>
            <button
              onClick={login}
              className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">F</span>
            </div>
            <span className="font-bold">FarmLink Admin</span>
            <span className="text-green-400 text-xs ml-2">Dashboard</span>
          </div>
          <button onClick={() => setAuthed(false)} className="text-green-300 hover:text-white text-sm">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 w-fit mb-8 shadow-sm">
          {(['overview', 'listings', 'transactions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-green-700 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Listings', value: stats.totalListings, icon: '📦', color: 'bg-green-50 border-green-200' },
                { label: 'Active Listings', value: stats.activeListings, icon: '✅', color: 'bg-emerald-50 border-emerald-200' },
                { label: 'Total Inventory Value', value: formatNaira(stats.totalValue), icon: '💰', color: 'bg-yellow-50 border-yellow-200' },
                { label: 'Avg. Views / Listing', value: stats.avgViews, icon: '👁️', color: 'bg-blue-50 border-blue-200' },
              ].map(card => (
                <div key={card.label} className={`rounded-2xl border p-5 ${card.color}`}>
                  <span className="text-2xl block mb-2">{card.icon}</span>
                  <p className="text-2xl font-black text-gray-900">{card.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Recent listings preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">Recent Listings</h2>
                <button onClick={() => setTab('listings')} className="text-green-700 text-sm font-medium hover:underline">
                  View all →
                </button>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Crop</th>
                      <th className="px-6 py-3 text-left">Qty</th>
                      <th className="px-6 py-3 text-left">Price</th>
                      <th className="px-6 py-3 text-left">Location</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {harvests.slice(0, 5).map(h => (
                      <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-semibold text-gray-900">{h.cropType}</td>
                        <td className="px-6 py-3 text-gray-500">{h.quantity} {h.unit}</td>
                        <td className="px-6 py-3 font-semibold text-green-700">{formatNaira(h.pricePerUnit)}</td>
                        <td className="px-6 py-3 text-gray-500">{h.location?.state || '—'}</td>
                        <td className="px-6 py-3"><StatusBadge s={h.status} /></td>
                        <td className="px-6 py-3 text-gray-400">{timeAgo(h.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">All Listings ({harvests.length})</h2>
              <span className="text-green-700 text-xs bg-green-50 px-3 py-1 rounded-full font-medium">
                {stats.activeListings} active
              </span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading listings...</div>
            ) : harvests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No listings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Crop</th>
                      <th className="px-6 py-3 text-left">Quantity</th>
                      <th className="px-6 py-3 text-left">Price / Unit</th>
                      <th className="px-6 py-3 text-left">Total Value</th>
                      <th className="px-6 py-3 text-left">State</th>
                      <th className="px-6 py-3 text-left">Views</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {harvests.map(h => (
                      <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-400 font-mono text-xs">{h.id.slice(0, 8)}…</td>
                        <td className="px-6 py-3 font-semibold text-gray-900">{h.cropType}</td>
                        <td className="px-6 py-3 text-gray-600">{h.quantity.toLocaleString()} {h.unit}</td>
                        <td className="px-6 py-3 font-semibold text-green-700">{formatNaira(h.pricePerUnit)}</td>
                        <td className="px-6 py-3 text-gray-700">{formatNaira(h.pricePerUnit * h.quantity)}</td>
                        <td className="px-6 py-3 text-gray-500">{h.location?.state || '—'}</td>
                        <td className="px-6 py-3 text-gray-400">{h.views || 0}</td>
                        <td className="px-6 py-3"><StatusBadge s={h.status} /></td>
                        <td className="px-6 py-3 text-gray-400 text-xs">{timeAgo(h.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Transactions</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                To view transactions, enter a user ID below.
              </p>
            </div>
            <TransactionLookup />
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionLookup() {
  const [userId, setUserId] = useState('');
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookup = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API}/transactions/user/${userId.trim()}`);
      const data = await res.json();
      setTxs(data.transactions || []);
    } catch {
      setTxs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter user ID (from Firestore)..."
          value={userId}
          onChange={e => setUserId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup()}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={lookup}
          className="px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          Look Up
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm">Searching...</p>}
      {!loading && searched && txs.length === 0 && (
        <p className="text-gray-400 text-sm">No transactions found for this user.</p>
      )}
      {txs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Farmer Gets</th>
                <th className="px-4 py-3 text-left">Platform Fee</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Escrow</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {txs.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatNaira(t.totalAmount)}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">{formatNaira(t.farmerAmount || 0)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatNaira(t.platformFee || 0)}</td>
                  <td className="px-4 py-3"><StatusBadge s={t.status} /></td>
                  <td className="px-4 py-3"><StatusBadge s={t.escrowStatus} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
