import DoctorFilter from '@/components/Scenes/Filters/Doctor/DoctorFilter'
import DoctorDetails from '@/components/Scenes/Forms/DoctorDetails/DoctorDetails'
import Doctor from '@/components/Scenes/Tables/Doctors/Doctor'
import React from 'react'

const page = () => {
  return (


    <div className="">

       

       <DoctorFilter/>
    <div className='flex mb-4  justify-end'>
        <DoctorDetails/>
    </div>


    <div className="">
        <Doctor/>
    </div>
    </div>

  )
}

export default page