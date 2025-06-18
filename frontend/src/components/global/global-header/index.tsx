import { navLinks } from '@/constants/nav-links'
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

const GlobalHeader = () => {
  return (
    // <div className='bg-[var(--accent)] h-[4rem] px-6 sm:px-20 flex items-center justify-between text-white'>
    //   <div>
    //     <h1 className='text-2xl font-bold uppercase'>Logo</h1>
    //   </div>
    //   <div>
    //     {navLinks.map((link) => (
    //       <Link href={link.href} key={link.name} className='mx-4'>{link.name}</Link>
    //     ))}
    //   </div>
    //   <div>
    //     <SignedOut>
    //       <div className='flex gap-x-2'>
    //         <SignInButton />
    //         <SignUpButton />
    //       </div>
    //     </SignedOut>
    //     <SignedIn>
    //       <UserButton />
    //     </SignedIn>
    //   </div>
    // </div>

    
      <div className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CompressFlow</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Visualize</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">About</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-slate-300 hover:text-white transition-colors">Sign in</button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}

export default GlobalHeader