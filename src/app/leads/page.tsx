"use client"


import LeadsFilters from '@/components/Scenes/Filters/Leads/LeadsFilter'
import Leads from '@/components/Scenes/Tables/Leads/Leads'
import React from 'react'

const page = () => {
  return (
    <div>
      <LeadsFilters/>
      <Leads/>
    </div>
  )
}

export default page