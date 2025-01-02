import Navbar from '@/components/Scenes/Navbar/Navbar'
import Hospitals from '@/components/Scenes/Tables/Hospitals/Hospitals'
import React from 'react'

const page = () => {
  return (
    <>
    <Navbar/>

    <div  className='mx-auto p-4'>
        <Hospitals/>
    </div>
    
    </>
 
  )
}

export default page