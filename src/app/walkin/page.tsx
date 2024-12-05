"use client"


import WalkinFilters from '@/components/Scenes/Filters/Walkin/WalkinFilters'
import { Walkin } from '@/components/Scenes/Tables/Walkin/Walkin'
import React from 'react'

const page = () => {
  return (
    <div>
      <WalkinFilters/>
      <Walkin/>
    </div>
  )
}

export default page