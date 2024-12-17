"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from "xlsx";
import SelectDropdown from "@/components/Scenes/Select/Select"; 
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { getAllRegion,getAllHospital,getAllDept,GetAllDoctorNames } from "@/routes/routes";
import { Appointment, RegionsType } from "@/types/types";
import moment from "moment";




interface FilterValues {
  department: string;
  gender: string;
  doctor: string;
  hospital:string;
  region: string;
  startdate: string | null;  // Add this line
  enddate: string | null;    
}



interface WalkinFilterProps {
  onFilterChange: (newFilters: FilterValues) => void; // Accept FilterValues
  AppointmentData:Appointment[];
  filteredData: Appointment[];
  filterValues: FilterValues; // Pass down the current filters
}

const WalkinFilters:  React.FC<WalkinFilterProps>= ({onFilterChange,AppointmentData,filteredData}) => {
 
  const [selectedRegion, setSelectedRegion] = useState<string>(""); 
   const [dropdownValues, setDropdownValues] = useState({
      gender: '',
      doctor: '',
      department: '',
      region:'',
      startdate:'',
      hospital:'',
      enddate:''
    });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  

 
  const [regiondata, setRegionData] = useState<RegionsType[]>([]);
const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [docNames, setdocNames] = useState<string[]>([]);
  const [HospitalNames, setHospitalNames] = useState<string[]>([]);

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
        const [deptRes, hospitalRes, doctorRes] = await Promise.all([
          getAllDept(),
          getAllHospital(),
          GetAllDoctorNames(),
        ]);
  
        const departmentNames = deptRes.data.map((dept: { department_name: string }) => dept.department_name);
        setDepartmentNames(departmentNames);
  
        const hospitalNames = hospitalRes.data.map((hospital: { hospital_name: string }) => hospital.hospital_name);
        setHospitalNames(hospitalNames);
  
        const doctorNames = doctorRes.data.map((doctor: { name: string }) => doctor.name);
        setdocNames(doctorNames);
          console.log("Department Names:", departmentNames);
        console.log("Hospital Names:", hospitalNames);
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

  
    const filterData = () => {
      const filteredData = AppointmentData.filter((item) => {
        // Gender filter
        const matchesGender =
          !dropdownValues.gender ||
          (item.patient_id && item.patient_id.gender.toLowerCase() === dropdownValues.gender.toLowerCase());
    
        // Doctor filter (name)
        const matchesDoctor =
          !dropdownValues.doctor ||
          (item.doctor_id && item.doctor_id.name.toLowerCase().includes(dropdownValues.doctor.toLowerCase()));


          const matchesHospital = 
          !dropdownValues.hospital || 
          (item.hospital_id?.hospital_name && 
           item.hospital_id.hospital_name.toLowerCase().includes(dropdownValues.hospital.toLowerCase()));
        
        
    
        // Department filter
        const matchesDept =
          !dropdownValues.department ||
          (item?.doctor_id?.department?.department_name && item?.doctor_id?.department?.department_name.toLowerCase().includes(dropdownValues.department.toLowerCase()));
    
          console.log("Filtering by hospital:", dropdownValues.hospital);
          console.log("Hospital name:", item.hospital_id?.hospital_name);
          console.log(dropdownValues.department,"Department Filter")

        // Region filter
            const matchesRegion =
  !selectedRegion ||
  (item.region &&
    item.region.region_name.toLowerCase() ===
      selectedRegion.toLowerCase());

    
        // Date range filter
        const AppointmentCreatedDate = moment(item.createdAt, "YYYY-MM-DD");
    
        // Check if start and end dates are valid moments
        const startMoment = dropdownValues.startdate ? moment(dropdownValues.startdate).startOf('day') : null;
        const endMoment = dropdownValues.enddate ? moment(dropdownValues.enddate).endOf('day') : null;
    
        // Check if doctor's creation date is within the date range
        const isWithinDateRange =
          (!startMoment || AppointmentCreatedDate.isSameOrAfter(startMoment)) &&
          (!endMoment || AppointmentCreatedDate.isSameOrBefore(endMoment));
    
        // Combine all conditions
        return matchesGender && matchesDoctor &&   matchesHospital  &&  matchesDept 
        
        && matchesRegion && isWithinDateRange;
      });
    
      // After filtering, pass the updated filter values to onFilterChange
      onFilterChange({
        gender: dropdownValues.gender,
        doctor: dropdownValues.doctor,
        department: dropdownValues.department,
        region: selectedRegion,
        startdate: dropdownValues.startdate,
        hospital:dropdownValues.hospital,
        enddate: dropdownValues.enddate,
      });
    
      console.log(filteredData, "after filter");
    };



  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WalkinVisit");
    XLSX.writeFile(wb, "WalkinVisit.xlsx");
  };


  const resetFilters = () => {
    setDropdownValues({
      gender: '',
      doctor: '',
      department: '',
      hospital:'',
      region: '',
      startdate:'',
      enddate:'',
    });
    setStartDate(null)
    setEndDate(null)
    setSelectedRegion('');
    setSearchQuery('');
  };


  
    useEffect(() => {
  
      console.log("Applying filters... on Walkin");
  
      filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropdownValues, selectedRegion, searchQuery]);
    
    
  
    useEffect(() => {
      console.log("Selected Region  on Walkin:", selectedRegion);
      console.log("Selected Gender  on Walkin:", dropdownValues.gender);
      console.log("Selected Doctor  on Walkin:", dropdownValues.doctor);
      console.log("Selected Start Date  on Walkin:", dropdownValues.startdate);
      console.log("Selected End Date  on Walkin:", dropdownValues.enddate);
      console.log("Selected End Date  on Walkin:", dropdownValues.hospital);

      console.log("Selected Department:", dropdownValues.department);
      console.log("Search Query:", searchQuery);
    }, [selectedRegion, dropdownValues, searchQuery]);

  return (
    <div className="p-8 mb-8 text-white flex flex-col gap-8 rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex  mb-0 lg:flex-row gap-4 flex-col lg:items-center lg:justify-between">
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

      <div className="flex  lg:flex-nowrap flex-wrap  gap-4 sm:gap-4 md:gap-8  lg:gap-10 items-center">
        {/* <div className="flex  w-full lg:max-w-xs  lg:mb-0 mb-4 lg:flex-row flex-col lg:items-center gap-2"> 
          <label className="font-medium mb-1">Bookings:</label>
          <SelectDropdown
          id="booking"
            options={["All","Online","Offline"]}
            value={dropdownValues.booking}
            onChange={(value) => handleSelectChange("booking", value)}
            placeholder="Select Booking Type"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div> */}

        <div className="flex  w-full  mb-4  lg:mb-0  lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium mb-1">Gender:</label>
          <SelectDropdown
          id="gender"
            options={['Male','Female','Others']}
            value={dropdownValues.gender}
            onChange={(value) => handleSelectChange("gender", value)}
            placeholder="Select Gender"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
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
       {/* Date Filters */}
     

        <div className="flex  b lg:max-w-full   w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium ">Department:</label>
          <SelectDropdown
          id="speciality"
           options={departmentNames}
           value={dropdownValues.department}
            onChange={(value) => handleSelectChange("department", value)}
            placeholder="Select Speciality"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>
      </div>

      <div className="flex w-full flex-wrap lg:flex-nowrap gap-4 md:gap-8 lg:gap-10 items-center">
        <div className="flex lg:mb-0 mb-4 lg:w-full w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium ">Doctor:</label>
          <SelectDropdown
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

        <div className="flex  lg:mb-0 mb-4 lg:w-full w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium">Hospital:</label>
          <SelectDropdown
          id="hospital"
          options={HospitalNames}
          value={dropdownValues.hospital}
          icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}


            onChange={(value) => handleSelectChange("hospital", value)}
            placeholder="Select Hospital Name"
            inputClassName="outline-none rounded-full bg-white text-black h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>

        {/* <div className="flex lg:w-1/6 w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium ">City:</label>
          <SelectDropdown
          id="city"
            options={["Banglore", "Chennai"]}
            value={dropdownValues.city}
            onChange={(value) => handleSelectChange("city", value)}
            placeholder="Select City"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div> */}
      </div>

      <div className="flex lg:flex-row flex-col lg:items-center    lg:gap-4 ">

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
            alt={region.region_name}
            title={region.region_name}
            width={50} height={100}
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

export default WalkinFilters;
