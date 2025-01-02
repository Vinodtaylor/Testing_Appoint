"use client"


import LeadsFilters from '@/components/Scenes/Filters/Leads/LeadsFilter'
import Navbar from '@/components/Scenes/Navbar/Navbar'
import Leads from '@/components/Scenes/Tables/Leads/Leads'
import React from 'react'

const page = () => {
  return (

    <>
    <Navbar/>

    <div>
      <LeadsFilters/>
      <Leads/>
    </div>
    </>

  )
}

export default page