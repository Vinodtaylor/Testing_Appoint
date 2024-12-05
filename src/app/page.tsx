"use client"


import DoctorVisitFilters from '@/components/Scenes/Filters/DoctorVisit/DoctorVisitFilters'
import { DoctorVisit } from '@/components/Scenes/Tables/DoctorVisit/DoctorVisit'
import React from 'react'

const page = () => {
  return (
    <div className=' '>

<DoctorVisitFilters/>
      <DoctorVisit/>
    </div>
  )
}

export default page