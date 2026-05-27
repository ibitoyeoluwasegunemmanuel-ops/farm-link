import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FEATURES = [
  {
    icon: '🛒',
    title: 'Direct Farm Marketplace',
    desc: 'Buy fresh produce directly from verified farmers. No middlemen — better prices for buyers, more profit for farmers.',
    color: 'bg-green-50 border-green-200',
  },
  {
    icon: '🔒',
    title: 'Escrow Payment Protection',
    desc: 'Your money is held securely in escrow and only released to the farmer after you confirm delivery. Zero risk.',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    icon: '🚚',
    title: 'Integrated Logistics',
    desc: 'Book verified trucks and drivers directly on the platform. Real-time GPS tracking from farm to your door.',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    icon: '🤖',
    title: 'AI Crop Scanner',
    desc: 'Point your phone at any crop. Our AI instantly identifies diseases, pests and suggests treatments — saving harvests.',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    icon: '📈',
    title: 'Live Market Prices',
    desc: 'Real-time commodity prices from all major Nigerian markets. Know when to sell, when to hold.',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    icon: '💳',
    title: 'Agricultural Finance',
    desc: 'Access loans, government grants, equipment financing and crop insurance — all in one place.',
    color: 'bg-red-50 border-red-200',
  },
];

const ROLES = [
  {
    icon: '🌾',
    title: 'Farmers',
    desc: 'List your harvest, reach 50,000+ buyers, track sales and get paid securely.',
    gradient: 'from-green-800 to-green-600',
    stats: '12,000+ active',
  },
  {
    icon: '🏪',
    title: 'Buyers & Traders',
    desc: 'Source fresh produce from verified farms with guaranteed quality and escrow protection.',
    gradient: 'from-blue-800 to-blue-600',
    stats: '8,500+ active',
  },
  {
    icon: '🚛',
    title: 'Transporters',
    desc: 'Accept delivery jobs, earn guaranteed income and manage your fleet on the platform.',
    gradient: 'from-orange-700 to-orange-500',
    stats: '2,200+ drivers',
  },
  {
    icon: '🚜',
    title: 'Equipment Owners',
    desc: 'Rent out your tractors, harvesters and farm equipment to farmers who need them.',
    gradient: 'from-purple-800 to-purple-600',
    stats: '450+ listings',
  },
  {
    icon: '💼',
    title: 'Investors',
    desc: 'Fund verified farms, earn competitive returns and build your agri-investment portfolio.',
    gradient: 'from-red-800 to-red-600',
    stats: '₦2B+ deployed',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up with your phone number in under 2 minutes. Choose your role — farmer, buyer, transporter or investor.',
  },
  {
    step: '02',
    title: 'Browse or List',
    desc: 'Buyers search thousands of verified farm listings by crop, location and price. Farmers post their harvest in minutes.',
  },
  {
    step: '03',
    title: 'Trade Safely',
    desc: 'Payment goes into escrow. Farmer ships. You confirm delivery. Funds release automatically. Everyone wins.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Emeka Okafor',
    role: 'Maize Farmer, Kaduna',
    quote: 'Before FarmLink I was selling at the roadside market for ₦40,000 per tonne. Now I get ₦65,000 directly from buyers in Lagos. My family\'s life has changed.',
    avatar: 'E',
    color: 'bg-green-700',
  },
  {
    name: 'Fatima Abdullahi',
    role: 'Food Processor, Kano',
    quote: 'The escrow system gives me total peace of mind. I\'ve completed 47 orders and never lost a naira to fraud. The logistics integration is the best part.',
    avatar: 'F',
    color: 'bg-blue-700',
  },
  {
    name: 'Chukwuemeka Eze',
    role: 'Transporter, Enugu',
    quote: 'I earn 3x more doing farm deliveries on FarmLink than general haulage. The job matching is instant and payments are guaranteed.',
    avatar: 'C',
    color: 'bg-orange-700',
  },
];

const STATS = [
  { value: '50,000+', label: 'Registered Farmers' },
  { value: '₦12B+', label: 'Total Trade Volume' },
  { value: '36', label: 'States Covered' },
  { value: '98%', label: 'Successful Deliveries' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-950 via-green-900 to-green-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-green-400 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-600 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-200 text-sm font-medium">Now live in all 36 Nigerian states</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Africa's{' '}
                <span className="text-green-400">Agricultural</span>{' '}
                Operating System
              </h1>

              <p className="text-green-100/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Connect directly with farmers. Buy fresh produce with escrow protection, integrated logistics, and AI-powered farm tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-900/40"
                >
                  Browse Marketplace →
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-3.5 rounded-xl border border-white/20 transition-all"
                >
                  How It Works
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 mt-10">
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <span>🔒</span> Escrow Protected
                </div>
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <span>✅</span> Verified Farmers
                </div>
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <span>📱</span> Mobile App Available
                </div>
              </div>
            </div>

            {/* Right — floating phone mockup / stats cards */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-80">
                {/* Central card */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">🌽</div>
                    <div>
                      <p className="font-semibold text-gray-900">White Maize</p>
                      <p className="text-sm text-gray-500">Emeka Farms, Kaduna</p>
                    </div>
                    <span className="ml-auto font-bold text-green-700 text-lg">₦55,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>✅ Verified Farmer</span>
                    <span>📦 200 bags available</span>
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm">
                    Buy with Escrow →
                  </button>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-10 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <span>🔒</span> Payment Secured
                </div>
                <div className="absolute -bottom-4 -left-10 bg-green-600 rounded-2xl shadow-xl p-3 text-white text-sm font-semibold">
                  🚚 Driver assigned!
                </div>
                <div className="absolute top-1/2 -right-14 bg-white rounded-2xl shadow-xl p-3 text-sm">
                  <p className="font-bold text-green-700">₦380K</p>
                  <p className="text-gray-500 text-xs">In escrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-green-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</p>
                <p className="text-green-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Everything You Need</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              One platform. Every farm need.
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
              From listing your harvest to getting paid — FarmLink handles the entire agricultural value chain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-6 ${f.color} hover:shadow-lg transition-shadow`}>
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              Trade in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-2/3 w-full h-0.5 bg-green-100 -translate-y-1/2" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-800 text-white font-black text-xl mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLES ─── */}
      <section id="roles" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">Built For Everyone</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
              Who is FarmLink for?
            </h2>
            <p className="mt-3 text-gray-400 text-lg max-w-xl mx-auto">
              Five roles, one ecosystem. Everyone in the agricultural chain wins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ROLES.map((r) => (
              <div
                key={r.title}
                className={`rounded-2xl bg-gradient-to-br ${r.gradient} p-6 text-white hover:scale-105 transition-transform cursor-pointer`}
              >
                <span className="text-4xl block mb-4">{r.icon}</span>
                <h3 className="font-bold text-lg mb-2">{r.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{r.desc}</p>
                <span className="text-xs font-semibold bg-white/20 rounded-full px-3 py-1">{r.stats}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Real Stories</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              Farmers. Buyers. Drivers. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOWNLOAD CTA ─── */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-3xl block mb-4">📱</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Start trading in minutes
          </h2>
          <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
            Download the FarmLink app, create your account, and start buying or selling fresh produce today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <p className="text-gray-400 text-xs">Get it on</p>
                <p className="text-white font-bold">Google Play</p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-400 rounded-xl px-6 py-3 transition-colors"
            >
              <span className="text-2xl">🌐</span>
              <div className="text-left">
                <p className="text-green-200 text-xs">Or browse on</p>
                <p className="text-white font-bold">Web Marketplace</p>
              </div>
            </Link>
          </div>

          <p className="text-green-300/60 text-sm">Free to join. No monthly fees. Pay only on successful trades.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
