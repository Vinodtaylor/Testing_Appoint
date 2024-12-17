/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Walkin } from '@/components/Scenes/Tables/Walkin/Walkin';
import { getWalkinData } from '@/routes/routes';
import { Appointment } from '@/types/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const WalkinFilters = dynamic(() => import('@/components/Scenes/Filters/Walkin/WalkinFilters'), {
  ssr: false,
});

interface FilterValues {
  department: string;
  gender: string;
  doctor: string;
  region: string;
  hospital: string;
  startdate: string | null;
  enddate: string | null;
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    department: '',
    gender: '',
    doctor: '',
    region: '',
    hospital: '',
    startdate: null,
    enddate: null,
  });
  const [filteredData, setFilteredData] = useState<Appointment[]>([]);
  const [data, setData] = useState<Appointment[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getWalkinData();
        const filteredData = result.data.filter(
          (item: Appointment) => item.booking_type === 'Walkin'
        );


        // Sort filteredData by createdAt in descending order
        const sortedFilteredData = filteredData.sort((a:any, b:any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        console.log(sortedFilteredData, 'Filtered and Sorted Data');
        setData(sortedFilteredData);
        setTotalPages(sortedFilteredData.totalPages);

      } catch (e) {
        console.error(e, 'Error fetching data');
      }
    };

    getData();
  }, []);

  useEffect(() => {
    console.log('Current Filter Values:', filterValues);

    const filterAppointments = () => {
      const filtered = data.filter((appointment) => {
        // Check for department match
        const matchesDept =
          !filterValues.department ||
          (appointment.doctor_id.department.department_name &&
            appointment.doctor_id.department.department_name
              .toLowerCase()
              .includes(filterValues.department.toLowerCase()));

        // Check for gender match
        const matchesGender =
          !filterValues.gender ||
          appointment.patient_id.gender.toLowerCase() === filterValues.gender.toLowerCase();

        // Check for doctor match
        const matchesDoctor =
          !filterValues.doctor ||
          (appointment.doctor_id.name &&
            appointment.doctor_id.name.toLowerCase().includes(filterValues.doctor.toLowerCase()));



            const matchesHospital =
            !filterValues.hospital ||
            (appointment.hospital_id.hospital_name && appointment.hospital_id.hospital_name.toLowerCase().includes(filterValues.hospital.toLowerCase()));
  

        // Check for region match
        const matchesRegion =
        !filterValues.region ||
        (appointment.region &&
          appointment.region.region_name.toLowerCase() ===
            filterValues.region.toLowerCase());
      

        // Handle date range comparison
        const appointmentDate = moment(appointment.createdAt, 'YYYY-MM-DD');
        const startMoment = filterValues.startdate
          ? moment(filterValues.startdate).startOf('day')
          : null;
        const endMoment = filterValues.enddate
          ? moment(filterValues.enddate).endOf('day')
          : null;

        // Check if the appointment's creation date is within the start and end date range
        const isWithinDateRange =
          (!startMoment || appointmentDate.isSameOrAfter(startMoment)) &&
          (!endMoment || appointmentDate.isSameOrBefore(endMoment));

        // Return true if all conditions match
        return (
          matchesDept &&
          matchesGender &&
          matchesHospital &&
          matchesDoctor &&
          matchesRegion &&
          isWithinDateRange
        );
      });

      setFilteredData(filtered);
    };

    if (data && data.length > 0) {
      filterAppointments();
    }
  }, [filterValues, data]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters); // Update filter values
  };



  console.log("Filtered Data in Parent:", filteredData);


  return (
    <div>
      <WalkinFilters 
      
      onFilterChange={handleFilterChange} 
        filterValues={filterValues}
        AppointmentData={data}
filteredData={filteredData}
/>
      <Walkin
      
      Appointmentdata={filteredData || []}
      
      setAppointments={setData}
       currentPage={currentPage}
       totalPages={totalPages}
       onPrevPage={handlePrevPage}   
       onNextPage={handleNextPage} 
      
      />
    </div>
  );
};

export default Page;
