import Navbar from '@/components/Scenes/Navbar/Navbar'
import Departments from '@/components/Scenes/Tables/Departments/Departments'
import React from 'react'

const page = () => {
  return (
    <>
    
    <Navbar/>

    <div className='mx-auto p-4'>
        <Departments/>
    </div>
    </>

  )
}

export default page