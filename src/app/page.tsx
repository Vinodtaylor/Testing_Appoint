"use client"

import { DoctorVisit } from '@/components/Scenes/Tables/DoctorVisit/DoctorVisit'
import React from 'react'
import dynamic from 'next/dynamic';
import Navbar from '@/components/Scenes/Navbar/Navbar';
import ProtectedLayout from '@/utilis/Protected';

const DoctorVisitFilters = dynamic(() => import('@/components/Scenes/Filters/DoctorVisit/DoctorVisitFilters'), {
  ssr: false,
});

const Page = () => {  



 
  

  return (
    <>
    <ProtectedLayout>
    <Navbar />
      <div className='mx-auto p-4'>
        <DoctorVisitFilters />
        <DoctorVisit />
      </div>

    </ProtectedLayout>
   
    </>
  )
}

export default Page; 
