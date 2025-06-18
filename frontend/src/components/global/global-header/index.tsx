import { NAV_LINKS } from '@/constants/nav-links'
import Link from 'next/link'
import React from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const GlobalHeader = () => {
  return (
      <header className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CompressFlow</h1>
            </Link>
            <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex space-x-8">
              {NAV_LINKS.map((link) => (
                <Link 
                  href={link.href} 
                  key={link.name} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
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
  )
}

export default GlobalHeader