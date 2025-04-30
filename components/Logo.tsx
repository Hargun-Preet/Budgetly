import { PiggyBank } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link href='/' className='flex items-center gap-2'>
      <PiggyBank className='stroke h-11 stroke-green-400/90 stroke-[1.5]' />
      <p className='bg-gradient-to-r from-green-400/90 via-purple-300/90 to-blue-500/90 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
        Budgetly
      </p>
    </Link>
  )
}

export function LogoMobile() {
  return (
    <Link href='/' className='flex items-center gap-2'>
      <p className='bg-gradient-to-r from-green-400/90 via-purple-300/90 to-blue-500/90 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
        Budgetly
      </p>
    </Link>
  )
}

export default Logo
