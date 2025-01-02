"use client"


import ServicesFilters from '@/components/Scenes/Filters/Services/ServiceFilter'
import Navbar from '@/components/Scenes/Navbar/Navbar'
import Services from '@/components/Scenes/Tables/Services/Services'
import React from 'react'

const page = () => {
  return (


    <>
    
    <Navbar/>

    <div>

<ServicesFilters/>
<Services/>


</div>
    </>
   
  )
}

export default page