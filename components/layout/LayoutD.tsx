import React from 'react'
import Navbar from './Navbar'

interface LayoutDProps {
  children: React.ReactNode;
}

function LayoutD({ children }: LayoutDProps) {
  return (
    <div>
        <Navbar />
        <main>
            {children}
        </main>
    </div>
  )
}

export default LayoutD