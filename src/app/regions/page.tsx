"use client"

import Navbar from '@/components/Scenes/Navbar/Navbar'
import RegionsTable from '@/components/Scenes/Tables/Regions/Regions'
import React from 'react'


const page = () => {
  return (
    <>
    <Navbar/>

    <div>
      <RegionsTable/>
    </div>
    </>
 
  )
}

export default page