"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import * as XLSX from 'xlsx';
import SelectDropDown from "../../Select/Select"; 
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { getAllRegion,GetAllDoctorNames, getAllDept } from "@/routes/routes";
import {  getDoctor, RegionsType} from "@/types/types";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

interface FilterValues {
  department: string;
  gender: string;
  doctor: string;
  region: string;
  startdate: string | null;  
  enddate: string | null;  
}


interface DoctorFilterProps {
  onFilterChange: (newFilters: FilterValues) => void; 
  doctorData: getDoctor[];
  filteredDoctors: getDoctor[];
  filterValues: FilterValues; // Pass down the current filters
}

const DoctorFilter: React.FC<DoctorFilterProps>  = ({onFilterChange,doctorData,filteredDoctors}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  const [dropdownValues, setDropdownValues] = useState({
    gender: '',
    doctor: '',
    department: '',
    region:'',
    startdate:'',
    enddate:''
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [docNames, setdocNames] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  

   
  const [regiondata, setRegionData] = useState<RegionsType[]>([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllRegion();
        setRegionData(res.data);
      } catch (e) {
        console.error("Error fetching regions:", e);
      }
    };

    getData();
  }, []);

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [ deptRes,doctorRes] = await Promise.all([
            getAllDept(),
            GetAllDoctorNames(),
          ]);
          console.log(deptRes,"deptResponse")
    
          const departmentNames = deptRes.data.map((dept: { department_name: string }) => dept.department_name);
          setDepartmentNames(departmentNames);

          console.log(departmentNames,"dept names")
    
          // const hospitalNames = hospitalRes.data.map((hospital: { hospital_name: string }) => hospital.hospital_name);
          // setHospitalNames(hospitalNames);
    
          const doctorNames = doctorRes.data.map((doctor: { name: string }) => doctor.name);
          setdocNames(doctorNames);
       
          console.log("Doctor Names:", doctorNames);
    
        } catch (e) {
          console.error("Error fetching data:", e);
        }
      };
    
      fetchData();
    }, []);
  

  const filteredregions = regiondata.filter(region =>
    region.region_name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const displayedRegions = showAll ? filteredregions : filteredregions.slice(0, 6);
  const hasMoreThan12Regions = filteredregions.length > 6;

  
  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };
  



  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };


  useEffect(() => {

    console.log("Applying filters...");

    filterData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownValues, selectedRegion, searchQuery]);
  
  

  useEffect(() => {
    console.log("Selected Region:", selectedRegion);
    console.log("Selected Gender:", dropdownValues.gender);
    console.log("Selected Doctor:", dropdownValues.doctor);
    console.log("Selected Start Date:", dropdownValues.startdate);
    console.log("Selected End Date:", dropdownValues.enddate);

    console.log("Selected Department:", dropdownValues.department);
    console.log("Search Query:", searchQuery);
  }, [selectedRegion, dropdownValues, searchQuery]);
  


  const filterData = () => {
    const filteredData = doctorData.filter((item) => {
      // Gender filter
      const matchesGender =
        !dropdownValues.gender ||
        (item.gender && item.gender.toLowerCase() === dropdownValues.gender.toLowerCase());
  
      // Doctor filter (name)
      const matchesDoctor =
        !dropdownValues.doctor ||
        (item.name && item.name.toLowerCase().includes(dropdownValues.doctor.toLowerCase()));
  
        const matchesDept =
        !dropdownValues.department ||
        (typeof item.department?.department_name === 'string' &&
         item?.department?.department_name.toLowerCase().includes(dropdownValues.department.toLowerCase()));
      
  
      // Region filter
      const matchesRegion =
        !selectedRegion ||
        (item.region &&
          Array.isArray(item.region) &&
          item.region.some(
            (region) => region?.region_name?.toLowerCase() === selectedRegion.toLowerCase()
          ));
  
      // Date range filter
      const doctorCreatedDate = moment(item.createdAt, "YYYY-MM-DD");
  
      // Check if start and end dates are valid moments
      const startMoment = dropdownValues.startdate ? moment(dropdownValues.startdate).startOf('day') : null;
      const endMoment = dropdownValues.enddate ? moment(dropdownValues.enddate).endOf('day') : null;
  
      // Check if doctor's creation date is within the date range
      const isWithinDateRange =
        (!startMoment || doctorCreatedDate.isSameOrAfter(startMoment)) &&
        (!endMoment || doctorCreatedDate.isSameOrBefore(endMoment));
  
      // Combine all conditions
      return matchesGender && matchesDoctor && matchesDept && matchesRegion && isWithinDateRange;
    });
  
    // After filtering, pass the updated filter values to onFilterChange
    onFilterChange({
      gender: dropdownValues.gender,
      doctor: dropdownValues.doctor,
      department: dropdownValues.department,
      region: selectedRegion,
      startdate: dropdownValues.startdate,
      enddate: dropdownValues.enddate,
    });
  
    console.log(filteredData, "after filter");
  };
  
  
  
  

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDoctors); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FilteredDoctors');
    XLSX.writeFile(wb, 'Filtered_Doctors.xlsx');
  };
  


  const handleStartDateChange = (date: Date | undefined) => {
    const newStartDate = date ? moment(date).format("YYYY-MM-DD") : '';
    setDropdownValues((prevValues) => ({
      ...prevValues,
      startdate: newStartDate,
    }));
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    const newEndDate = date ? moment(date).format("YYYY-MM-DD") : '';
    setDropdownValues((prevValues) => ({
      ...prevValues,
      enddate: newEndDate,
    }));
  };
  

  const resetFilters = () => {
    setDropdownValues({
      gender: '',
      doctor: '',
      department: '',
      region: '',
      startdate:'',
      enddate:'',
    });
    setStartDate(null)
    setEndDate(null)
    setSelectedRegion('');
    setSearchQuery('');
  };

  return (
    <div className="p-8 mb-8  text-white rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex lg:flex-row gap-4 flex-col lg:items-center lg:justify-between">
        <h1 className="text-lg font-bold border-b-2 border-white">Filters</h1>
        <div className="flex justify-between items-center lg:flex-nowrap flex-wrap gap-4">
  <button
    onClick={exportToExcel}
    className="p-3 whitespace-nowrap w-full bg-gradient-to-r from-[#1A91FF] to-[#3498db] text-white shadow-lg border border-transparent rounded-full text-center flex justify-center gap-2 hover:from-[#3498db] hover:to-[#1A91FF] transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none"
  >
    Export as Excel <PiMicrosoftExcelLogo size={20} />
  </button>
  
  <button
    onClick={filterData}
    className="p-3 whitespace-nowrap w-full text-white bg-gradient-to-r from-[#1A91FF] to-[#3498db] shadow-lg border border-transparent rounded-full text-center gap-2 hover:from-[#3498db] hover:to-[#1A91FF] transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none"
  >
    Apply Filter
  </button>
  
  <button
    onClick={resetFilters}
    className="p-3 whitespace-nowrap w-full text-white bg-gradient-to-r from-[#1A91FF] to-[#3498db] shadow-lg border border-transparent rounded-full text-center gap-2 hover:from-[#3498db] hover:to-[#1A91FF] transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none"
  >
    Reset
  </button>
</div>

      </div>




   


      <div className="flex  lg:flex-row flex-col sm:gap-4 md:gap-8 lg:gap-8 items-center">
        {/* Bookings */}
       

        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-2 lg:pb-0  pb-4">
          <label className="font-medium ">Department:</label>
          <SelectDropDown
  value={dropdownValues.department}
  onChange={(value) => handleSelectChange('department', value)}
  options={departmentNames}  
  placeholder="Select Department"
  id="dept"
  inputClassName="outline-none border-white border-1 rounded-lg bg-transparent h-[48px] shadow-md"
  containerClassName="w-full"
  dropdownClassName="text-[#000000] bg-transparent w-full"
/>


        </div>


        <div className="flex w-full lg:flex-row flex-col lg:items-center  lg:mb-0 mb-4 gap-2 ">
      <p>Date:</p>
      <div className="flex lg:flex-row flex-col items-center gap-4 w-full">
        {/* Start Date Picker */}
        <Popover>
  <PopoverTrigger asChild>
    <div className="relative w-full">
      <input
        placeholder="Start Date"
        value={dropdownValues.startdate}
        className="pr-10 text-center pl-4 w-full text-sm shadow-md rounded-lg cursor-pointer h-[48px] placeholder:text-white outline-none border bg-transparent"
        readOnly
      />
    </div>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={startDate?.toDate()}
      onSelect={handleStartDateChange}
      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
      initialFocus
    />
  </PopoverContent>
</Popover>

{/* End Date Picker */}



        <span className="text-white">to</span>

        {/* End Date Picker */}
    <Popover>
  <PopoverTrigger asChild>
    <div className="relative w-full">
      <input
        placeholder="End Date"
        value={dropdownValues.enddate}
        className="pr-10 text-center pl-4 w-full text-sm cursor-pointer h-[48px] placeholder:text-white rounded-lg outline-none shadow-md border bg-transparent"
        readOnly
      />
    </div>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={endDate?.toDate()}
      onSelect={handleEndDateChange}
      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
      initialFocus
    />
  </PopoverContent>
</Popover>
      </div>
    </div>


    
        {/* Gender */}
        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-2 lg:pb-0  pb-4">
          <label className="font-medium ">Gender:</label>
          <SelectDropDown
              value={dropdownValues.gender}
              onChange={(value) => handleSelectChange('gender', value)}            
            options={['Male', 'Female', 'Others']}
            placeholder="Select Gender"
            inputClassName="outline-none rounded-lg bg-transparent h-[48px] shadow-md"  
            containerClassName="w-full"    
            dropdownClassName="text-[#000000] bg-transparent w-full"       
            id="gender"
          />
        </div>

        
      </div>

      <div className="flex w-full lg:pb-4   flex-wrap gap-4 md:gap-8 lg:gap-10 items-center">
        {/* Doctor */}
        <div className="flex w-full  lg:flex-row flex-col lg:items-center lg:gap-4 lg:pb-0  pb-4  lg:mb-0 ">
          <label className="font-medium ">Doctor:</label>
          <SelectDropDown
           id="doctor"
           options={docNames}
           value={dropdownValues.doctor}
           icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}
             onChange={(value) => handleSelectChange("doctor", value)}
             placeholder="Select Doctor Name"
             inputClassName="outline-none rounded-full bg-white text-black h-[48px] shadow-md bg-transparent"
             containerClassName="w-full"
             dropdownClassName="bg-white text-black"
 
          />

        </div>

        {/* City */}
      
      </div>

      {/* Region */}
      <div className="flex lg:flex-row flex-col lg:items-center lg:pb-0  pb-4   lg:gap-4 ">

<label htmlFor="" className="mb-1 whitespace-nowrap">Regions</label>
<input
  placeholder="Search Regions"
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full text-gray-700 shadow-md px-8 p-3 rounded-full outline-none"
/>
      </div>

      {/* Region */}
      <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6  transform lg:-translate-y-0 items-start lg:items-center">
  {displayedRegions.map((region, index) => (
    <div
      key={index}
      onClick={() => handleRegionSelect(region.region_name)}
      className="flex justify-center items-center flex-col"
    >
      <div
        className={`relative mb-4 rounded-full w-36 h-36 justify-center transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center ${
          selectedRegion === region.region_name
            ? "bg-gradient-to-r from-[#FFFFFF00] shadow-lg to-[#FFFFFFFF]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center flex-col w-full justify-center">
          <Image
            src={region.region_image}
            width={50}
            height={100}
            alt={region.region_name}
            title={region.region_name}
            className="max-w-[60px] mb-1"
          />
          <p
            className={`text-center text-sm font-medium ${
              selectedRegion === region.region_name ? "text-[#000000]" : "text-white"
            }`}
          >
            {region.region_name}
          </p>
        </div>
      </div>
      {/* {selectedRegion === region.name && (
        <div className="bg-[#D9D9D9] p-2 rounded-full">
          <p className="text-[#000000] text-center text-sm">
            {region.doctorCount} Doctors
          </p>
        </div>
      )} */}
    </div>
  ))}
</div>

{hasMoreThan12Regions && (
<div className="flex justify-center">
<button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-white border  px-4 py-2 rounded-full"
        >
          {showAll ? "View Less" : "View More"}
        </button>
</div>
)}

     
    </div>
  );
};

export default DoctorFilter;
