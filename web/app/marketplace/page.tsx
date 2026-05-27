'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Harvest {
  id: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  quality: string;
  status: string;
  location?: { state?: string; town?: string };
  images?: string[];
  farmer?: { id: string; fullName?: string; farmName?: string; rating?: number };
  createdAt?: string;
  views?: number;
}

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Fruits', 'Tubers', 'Livestock', 'Seeds', 'Spices'];

const STATES = [
  'All States', 'Lagos', 'Kano', 'Kaduna', 'Rivers', 'Ogun', 'Oyo', 'Anambra',
  'Enugu', 'Delta', 'Imo', 'Kwara', 'Niger', 'Borno', 'Plateau',
];

const MOCK: Harvest[] = [
  { id: '1', cropType: 'White Maize', quantity: 200, unit: 'bag (100kg)', pricePerUnit: 55000, quality: 'Grade A', status: 'available', location: { state: 'Kaduna', town: 'Zaria' }, farmer: { id: 'f1', fullName: 'Emeka Okafor', rating: 4.8 } },
  { id: '2', cropType: 'Cassava (Dried)', quantity: 500, unit: 'bag', pricePerUnit: 8500, quality: 'Grade A', status: 'available', location: { state: 'Enugu', town: 'Nsukka' }, farmer: { id: 'f2', fullName: 'Fatima Agro', rating: 4.6 } },
  { id: '3', cropType: 'Fresh Tomatoes', quantity: 80, unit: 'crate', pricePerUnit: 12000, quality: 'Grade B', status: 'available', location: { state: 'Ogun', town: 'Abeokuta' }, farmer: { id: 'f3', fullName: 'Kola Fresh Farms', rating: 4.2 } },
  { id: '4', cropType: 'Yam Tubers', quantity: 1000, unit: 'tuber', pricePerUnit: 3500, quality: 'Grade A', status: 'available', location: { state: 'Benue', town: 'Makurdi' }, farmer: { id: 'f4', fullName: 'Nnamdi Farm', rating: 4.9 } },
  { id: '5', cropType: 'Groundnuts', quantity: 300, unit: 'bag (50kg)', pricePerUnit: 22000, quality: 'Grade A', status: 'available', location: { state: 'Kano', town: 'Kano City' }, farmer: { id: 'f5', fullName: 'Suleiman Farms', rating: 4.7 } },
  { id: '6', cropType: 'Palm Oil', quantity: 100, unit: 'jerry (25L)', pricePerUnit: 35000, quality: 'Grade A', status: 'available', location: { state: 'Rivers', town: 'Port Harcourt' }, farmer: { id: 'f6', fullName: 'Niger Delta Produce', rating: 4.5 } },
  { id: '7', cropType: 'Soya Beans', quantity: 150, unit: 'bag (100kg)', pricePerUnit: 72000, quality: 'Grade A', status: 'available', location: { state: 'Plateau', town: 'Jos' }, farmer: { id: 'f7', fullName: 'Highland Farms', rating: 4.8 } },
  { id: '8', cropType: 'Garri (White)', quantity: 200, unit: 'bag (25kg)', pricePerUnit: 8000, quality: 'Grade B', status: 'available', location: { state: 'Delta', town: 'Asaba' }, farmer: { id: 'f8', fullName: 'Chinwe Produce', rating: 4.3 } },
];

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

function qualityColor(q: string) {
  if (q?.toLowerCase().includes('a')) return 'bg-green-100 text-green-800';
  if (q?.toLowerCase().includes('b')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-700';
}

function ProductCard({ h }: { h: Harvest }) {
  const initials = (h.farmer?.fullName || 'F').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden group">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative">
        <span className="text-5xl">
          {h.cropType.toLowerCase().includes('maize') || h.cropType.toLowerCase().includes('corn') ? '🌽' :
           h.cropType.toLowerCase().includes('tomato') ? '🍅' :
           h.cropType.toLowerCase().includes('yam') ? '🍠' :
           h.cropType.toLowerCase().includes('cassava') ? '🌿' :
           h.cropType.toLowerCase().includes('groundnut') || h.cropType.toLowerCase().includes('peanut') ? '🥜' :
           h.cropType.toLowerCase().includes('palm') ? '🫙' :
           h.cropType.toLowerCase().includes('rice') ? '🌾' :
           h.cropType.toLowerCase().includes('soya') || h.cropType.toLowerCase().includes('soy') ? '🌱' :
           h.cropType.toLowerCase().includes('garri') ? '🍚' :
           '🌾'}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${qualityColor(h.quality)}`}>
          {h.quality || 'Grade A'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{h.cropType}</h3>
        <p className="text-2xl font-black text-green-700 mb-1">
          {formatNaira(h.pricePerUnit)}
          <span className="text-sm font-normal text-gray-400 ml-1">/{h.unit}</span>
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
          <span>📦 {h.quantity.toLocaleString()} {h.unit}s left</span>
          {h.location?.state && <span>📍 {h.location.state}</span>}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700 truncate">{h.farmer?.fullName || 'Verified Farmer'}</p>
            {h.farmer?.rating && (
              <p className="text-xs text-yellow-500">{'★'.repeat(Math.round(h.farmer.rating))} {h.farmer.rating}</p>
            )}
          </div>
          <span className="text-xs text-green-700 font-medium flex-shrink-0">✅ Verified</span>
        </div>

        <button className="mt-3 w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-sm font-semibold transition-colors">
          Buy with Escrow
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All States');
  const [sort, setSort] = useState('newest');

  const fetchHarvests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '60' });
      if (category !== 'All') params.set('cropType', category);
      if (state !== 'All States') params.set('state', state);
      const res = await fetch(`${API}/harvests?${params}`);
      const data = await res.json();
      const items: Harvest[] = data.data?.length ? data.data : MOCK;
      setHarvests(items);
    } catch {
      setHarvests(MOCK);
    } finally {
      setLoading(false);
    }
  }, [category, state]);

  useEffect(() => { fetchHarvests(); }, [fetchHarvests]);

  const filtered = harvests
    .filter(h =>
      !search || h.cropType.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.state?.toLowerCase().includes(search.toLowerCase()) ||
      h.farmer?.fullName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sort === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Home</Link> / <span className="text-white">Marketplace</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Farm Marketplace</h1>
          <p className="text-green-200">Fresh produce from verified farmers across Nigeria — escrow-protected</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search crops, farmers, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                category === cat
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500 hover:text-green-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
            <span>🔒</span> All trades escrow-protected
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-6 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🌾</span>
            <p className="text-gray-500 text-lg font-medium">No listings found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(h => <ProductCard key={h.id} h={h} />)}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <section className="bg-green-800 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Are you a farmer?</h2>
          <p className="text-green-200 mb-5">List your harvest and reach thousands of buyers across Nigeria — for free.</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            📱 Download the app to list your produce →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
