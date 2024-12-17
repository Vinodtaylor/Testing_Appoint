"use client"


import { DoctorVisit } from '@/components/Scenes/Tables/DoctorVisit/DoctorVisit'
import React from 'react'
import dynamic from 'next/dynamic';
const DoctorVisitFilters = dynamic(() => import('@/components/Scenes/Filters/DoctorVisit/DoctorVisitFilters'), {
  ssr: false,
});
const page = () => {



  return (
    <div className=' '>
 
<DoctorVisitFilters/>
      <DoctorVisit/>
    </div>
  )
}

export default page