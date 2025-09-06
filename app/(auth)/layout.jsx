import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-accent'>{children}</div>
  )
}

export default AuthLayout