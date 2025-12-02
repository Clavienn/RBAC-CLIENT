import LayoutD from '@/components/layout/LayoutD'
import About from '@/components/sections/About'
import Hero from '@/components/sections/Hero'
import React from 'react'

function page() {
  return (
    <div>
      <LayoutD>
        <Hero />
        <About />
      </LayoutD>
    </div>
  )
}

export default page