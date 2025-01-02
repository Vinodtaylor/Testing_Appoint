"use client"

import Navbar from '@/components/Scenes/Navbar/Navbar'
import Labs from '@/components/Scenes/Tables/Labs/Labs'
import React from 'react'

const page = () => {
  return (
    <>
    <Navbar/>
    <div  className='mx-auto p-4'>
      <Labs/>
    </div>
    </>
 
  )
}

export default page