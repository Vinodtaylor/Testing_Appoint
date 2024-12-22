/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import AddPayments from '@/components/Scenes/Forms/AddPayments/AddPayments';
import DoctorDetails from '@/components/Scenes/Forms/DoctorDetails/DoctorDetails';
import Doctor from '@/components/Scenes/Tables/Doctors/Doctor';
import { GetAllDoctorwithPagination } from '@/routes/routes';
import { getDoctor } from '@/types/types';
import moment from 'moment';
import dynamic from 'next/dynamic';
const DoctorFilter = dynamic(() => import('@/components/Scenes/Filters/Doctor/DoctorFilter'), {
  ssr: false,
});
import React, { useEffect, useState, useCallback } from 'react';

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
  const [filteredDoctors, setFilteredDoctors] = useState<getDoctor[]>([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    department: '',
    gender: '',
    doctor: '',
    region: '',
    startdate:null,
    enddate:null,
  });

  const limit = 10;
  const getDoctorsData = useCallback(async () => {
    try {
      const res = await GetAllDoctorwithPagination(currentPage, limit);
      if (res && res.data) {
        // Sort the doctors by createdAt in descending order
        const sortedDoctors = res.data.data.sort((a:any, b:any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); 

        });


        console.log(totalPages,"doctor total pages")

        console.log(sortedDoctors,"Latest")
        setDoctors(sortedDoctors);
        setTotalPages(res?.data?.pagination?.total);
        setFilteredDoctors(sortedDoctors); 
      }
    } catch (e) {
      console.error('Failed to fetch doctors:', e);
    }
  }, [currentPage]);
  

  useEffect(() => {
    getDoctorsData();
  }, [currentPage, getDoctorsData]);



  useEffect(() => {

    console.log (filterValues,"FilterValues")
    const filterDoctors = () => {
      const filtered = doctors.filter((doctor) => {
        // Check for department match


        const matchesDept =
        !filterValues.department ||
        (typeof doctor.department === 'string' && 
         doctor.department.toLowerCase().includes(filterValues.department.toLowerCase()));
    
        // Check for gender match
        const matchesGender =
          !filterValues.gender || doctor.gender.toLowerCase() === filterValues.gender.toLowerCase();
    
        // Check for name match
        const matchesName =
          !filterValues.doctor ||
          (doctor.name && doctor.name.toLowerCase().includes(filterValues.doctor.toLowerCase()));
    
        // Check for region match
        const matchesRegion =
          !filterValues.region ||
          (doctor.region &&
            doctor.region.region_name &&
            doctor.region.region_name.toLowerCase().includes(filterValues.region.toLowerCase()));
    
        // Handle date range comparison
        const doctorCreatedDate = moment(doctor.createdAt, "YYYY-MM-DD");
    
        const startMoment = filterValues.startdate ? moment(filterValues.startdate).startOf('day') : null;
        const endMoment = filterValues.enddate ? moment(filterValues.enddate).endOf('day') : null;
    
        // Check if doctor's creation date is within the start and end date range
        const isWithinDateRange =
          (!startMoment || doctorCreatedDate.isSameOrAfter(startMoment)) && 
          (!endMoment || doctorCreatedDate.isSameOrBefore(endMoment));
    
        // Return true if all conditions match
        return matchesDept && matchesGender && matchesName && matchesRegion && isWithinDateRange;
      });
    

      
      setFilteredDoctors(filtered);


      
      
    };

  
    if (doctors && doctors.length > 0) {
      filterDoctors();  // Only filter when doctors data is available
    }
  }, [filterValues, doctors]);
  
  
  useEffect(() => {
    console.log("Current Filter Values:", filterValues);
      console.log("Filtered Doctors:", filteredDoctors);
  
  }, [filterValues, filteredDoctors]);  
  


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters); 
  };




  return (
    <div>
      <DoctorFilter
        onFilterChange={handleFilterChange} 
        filterValues={filterValues}
        doctorData={doctors}
        filteredDoctors={filteredDoctors}
      />
      <div className="flex mb-4 gap-4 justify-end">
        <DoctorDetails />
        <AddPayments/>
      </div>
      <Doctor
        doctors={filteredDoctors}  
        setDoctors={setDoctors}
        currentPage={currentPage}
        limit={limit}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}   
        onNextPage={handleNextPage} 
      />
    </div>
  );
};

export default Page;
