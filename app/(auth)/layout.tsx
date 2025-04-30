import { AuroraBackground } from '@/components/global/aurora'
import Logo from '@/components/Logo'
import React, { ReactNode } from 'react'

function layout({children} : {children: ReactNode}) {
  return (
    <AuroraBackground className='overflow-y-auto'>
    <div className="flex flex-col items-center w-full min-h-screen p-4 ">
      <div className="mt-8">
        <Logo />
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-md mt-8">
        {children}
      </div>
    </div>
    </AuroraBackground>
  )
}

export default layout


