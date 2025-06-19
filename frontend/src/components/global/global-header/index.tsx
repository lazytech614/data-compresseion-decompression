"use client"

import { NAV_LINKS } from '@/constants/nav-links'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Zap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export default function GlobalHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle sidebar
  const toggleMobile = () => setMobileOpen(prev => !prev);

  return (
    <>
      <header className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">CompressFlow</h1>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex space-x-8 absolute left-1/2 -translate-x-1/2">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                  return (
                    <Link
                      href={link.href}
                      key={link.name}
                      className={
                        `px-4 py-2 font-sm transition-colors rounded-md ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                        }`
                      }
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md"
                  onClick={toggleMobile}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <SignedOut>
                  <Link href={'/auth/sign-in'}>
                    <Button className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all'>
                      Get started
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar panel */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800 z-50 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">CompressFlow</h1>
              </Link>
              <button
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-grow">
              <ul className="space-y-4">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={
                          `block px-3 py-2 rounded-md text-base font-medium ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700'
                          }`
                        }
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            {/* Optional: Move SignedIn/SignedOut buttons into sidebar on mobile */}
            <div className="mt-auto space-y-4">
              <SignedOut>
                <Link href={'/auth/sign-in'} onClick={() => setMobileOpen(false)}>
                  <Button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all'>
                    Get started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
