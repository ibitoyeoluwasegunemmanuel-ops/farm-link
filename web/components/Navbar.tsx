'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" stroke="none"/>
                <path d="M17 8c0-2.76-2.24-5-5-5S7 5.24 7 8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Farm<span className="text-primary-400">Link</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '#features', label: 'Features' },
              { href: '#how-it-works', label: 'How It Works' },
              { href: '/marketplace', label: 'Marketplace' },
              { href: '#roles', label: 'Who It\'s For' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-400 ${
                  scrolled ? 'text-gray-700' : 'text-white/80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/marketplace"
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                scrolled
                  ? 'border-primary-800 text-primary-800 hover:bg-primary-50'
                  : 'border-white/40 text-white hover:bg-white/10'
              }`}
            >
              Browse Produce
            </Link>
            <Link
              href="/admin"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              Admin Panel
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled ? 'bg-gray-900' : 'bg-white'} ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled ? 'bg-gray-900' : 'bg-white'} ${open ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 transition-all ${scrolled ? 'bg-gray-900' : 'bg-white'} ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {[
            { href: '#features', label: 'Features' },
            { href: '#how-it-works', label: 'How It Works' },
            { href: '/marketplace', label: 'Marketplace' },
            { href: '#roles', label: 'Who It\'s For' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/marketplace" className="text-center py-2 rounded-lg border border-primary-800 text-primary-800 font-medium text-sm">
              Browse Produce
            </Link>
            <Link href="/admin" className="text-center py-2 rounded-lg bg-primary-500 text-white font-semibold text-sm">
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
