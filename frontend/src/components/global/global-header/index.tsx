import { navLinks } from '@/constants/nav-links'
import Link from 'next/link'
import React from 'react'

type Props = {}

const GlobalHeader = (props: Props) => {
  return (
    <div className='bg-[var(--accent)] h-[4rem] px-6 sm:px-20 flex items-center justify-between text-white'>
      <div>
        <h1 className='text-2xl font-bold uppercase'>Logo</h1>
      </div>
      <div>
        {navLinks.map((link) => (
          <Link href={link.href} key={link.name} className='mx-4'>{link.name}</Link>
        ))}
      </div>
    </div>
  )
}

export default GlobalHeader