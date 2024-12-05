"use client"


import ServicesFilters from '@/components/Scenes/Filters/Services/ServiceFilter'
import Services from '@/components/Scenes/Tables/Services/Services'
import React from 'react'

const page = () => {
  return (
    <div>

      <ServicesFilters/>
      <Services/>


    </div>
  )
}

export default page