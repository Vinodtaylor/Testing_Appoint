/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import AddPayments from '@/components/Scenes/Forms/AddPayments/AddPayments';
import DoctorDetails from '@/components/Scenes/Forms/DoctorDetails/DoctorDetails';
import Navbar from '@/components/Scenes/Navbar/Navbar';
import Doctor from '@/components/Scenes/Tables/Doctors/Doctor';
import { AllDoctors } from '@/routes/routes';
import { getDoctor } from '@/types/types';
import moment from 'moment';
import dynamic from 'next/dynamic';
const DoctorFilter = dynamic(() => import('@/components/Scenes/Filters/Doctor/DoctorFilter'), {
  ssr: false,
});
import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface FilterValues {
  department: string;
  gender: string;
  doctor: string;
  region: string;
  startdate: string | null;
  enddate: string | null;
}

const Page = () => {
  const [doctors, setDoctors] = useState<getDoctor[]>([]);  
  const [filterValues, setFilterValues] = useState<FilterValues>({
    department: '',
    gender: '',
    doctor: '',
    region: '',
    startdate: null,
    enddate: null,
  });

  const getDoctorsData = useCallback(async () => {
    try {
      const res = await AllDoctors();
      if (res && res.data) {
        const sortedDoctors = res.data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); 
        });
        setDoctors(sortedDoctors);
      }
    } catch (e) {
      console.error('Failed to fetch doctors:', e);
    }
  }, []);

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesDept = !filterValues.department ||
        (typeof doctor?.department?.department_name === 'string' &&
         doctor?.department?.department_name.toLowerCase().includes(filterValues.department.toLowerCase()));

      const matchesGender = !filterValues.gender || doctor.gender.toLowerCase() === filterValues.gender.toLowerCase();
      
      const matchesName = !filterValues.doctor ||
        (doctor.name && doctor.name.toLowerCase().includes(filterValues.doctor.toLowerCase()));
      
      const matchesRegion = !filterValues.region ||
        (doctor.region &&
         doctor.region.region_name &&
         doctor.region.region_name.toLowerCase().includes(filterValues.region.toLowerCase()));
      
      const doctorCreatedDate = moment(doctor.createdAt, "YYYY-MM-DD");
      const startMoment = filterValues.startdate ? moment(filterValues.startdate).startOf('day') : null;
      const endMoment = filterValues.enddate ? moment(filterValues.enddate).endOf('day') : null;
      
      const isWithinDateRange = (!startMoment || doctorCreatedDate.isSameOrAfter(startMoment)) && 
        (!endMoment || doctorCreatedDate.isSameOrBefore(endMoment));
      
      return matchesDept && matchesGender && matchesName && matchesRegion && isWithinDateRange;
    });
  }, [doctors, filterValues]);


  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters); 
  };

  return (
    <>
    
    <Navbar/>

    <div className='mx-auto p-4'>
      <DoctorFilter
        onFilterChange={handleFilterChange} 
        filterValues={filterValues}
        doctorData={doctors}
        filteredDoctors={filteredDoctors}
      />
      <div className="flex mb-4 gap-4 justify-end">
        <DoctorDetails />
        <AddPayments />
      </div>
      <Doctor doctors={filteredDoctors}  setDoctors={setDoctors}/>
    </div>
    </>
   
  );
};

export default Page;
