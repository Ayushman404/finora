import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center px-4'>
        <h1 className='text-4xl font-bold bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text mb-4'>404 - Not Found</h1>
        <p className='text-2xl font-semibold mb-4'>The page you are looking for does not exist.</p>
        <p className='text-foreground mb-8'>Please check the URL or return to the homepage.</p>
        <Link href={"/"}>
          <Button>Return Home</Button>
        </Link>
    </div>
  )
}

export default NotFound