import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-xl">Farm<span className="text-primary-400">Link</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Africa's agricultural operating system. Connecting farmers, buyers, and transporters across Nigeria.
            </p>
            <div className="flex gap-3 mt-5">
              {['Twitter', 'Facebook', 'Instagram'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <span className="text-xs text-gray-400">{s[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {['Marketplace', 'Logistics', 'Escrow Payments', 'AI Crop Scanner', 'Market Prices', 'Weather'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold text-white mb-4">For You</h3>
            <ul className="space-y-2">
              {['Farmers', 'Buyers & Traders', 'Transporters', 'Equipment Owners', 'Investors', 'Admin'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span className="mt-0.5">📍</span>
                Lagos, Nigeria
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📧</span>
                hello@farmlink.ng
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📱</span>
                +234 800 FARM LINK
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Download App</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-sm font-semibold text-white">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 FarmLink. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
