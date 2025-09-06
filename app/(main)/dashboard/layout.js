import React, { Suspense } from 'react'
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';

const DashboardLayout = async () => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl font-bold tracking-tighter bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text mb-5'>Dashboard</h1>

      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color={"#9333ea"}/>}>
        <DashboardPage />
      </Suspense>
    </div>
  )
}

export default DashboardLayout;