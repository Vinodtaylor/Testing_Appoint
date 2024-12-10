"use client";

import React, { useState } from "react";
import { Calendar1Icon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import Region from '../../../../../public/region.png';
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from 'xlsx';
import { DoctorVisittableData } from "@/constants/data";
import SelectDropDown from "../../Select/Select"; 
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";





export const Regions = [
  { name: "Bangalore", icon: Region, doctorCount: 24 },
  { name: "Whitefield", icon: Region, doctorCount: 18 },
  { name: "Koramangala", icon: Region, doctorCount: 30 },
  { name: "Malleswaram", icon: Region, doctorCount: 12 },
  { name: "Indiranagar", icon: Region, doctorCount: 20 },
  { name: "Jayanagar", icon: Region, doctorCount: 15 },
  { name: "Hebbal", icon: Region, doctorCount: 10 },
  { name: "Electronic City", icon: Region, doctorCount: 22 },
  { name: "Yelahanka", icon: Region, doctorCount: 17 },
  { name: "RT Nagar", icon: Region, doctorCount: 14 },
  { name: "Basavanagudi", icon: Region, doctorCount: 8 },
  { name: "JP Nagar", icon: Region, doctorCount: 16 },
  { name: "Banashankari", icon: Region, doctorCount: 9 },
  { name: "Sarjapur Road", icon: Region, doctorCount: 25 },
  { name: "Marathahalli", icon: Region, doctorCount: 20 },
  { name: "Hosur Road", icon: Region, doctorCount: 13 },
  { name: "Bellandur", icon: Region, doctorCount: 19 },
  { name: "HSR Layout", icon: Region, doctorCount: 21 },
  { name: "Domlur", icon: Region, doctorCount: 11 },
  { name: "Ulsoor", icon: Region, doctorCount: 7 },
  { name: "Vijayanagar", icon: Region, doctorCount: 15 },
  { name: "Kumaraswamy Layout", icon: Region, doctorCount: 9 },
  { name: "Magadi Road", icon: Region, doctorCount: 6 },
  { name: "Rajajinagar", icon: Region, doctorCount: 18 },
  { name: "Peenya", icon: Region, doctorCount: 12 },
];


const DoctorVisitFilters: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedRegion, setSelectedRegion] = useState<string>("Bangalore");
  const [dropdownValues, setDropdownValues] = useState({
    bookings: '',
    gender: '',
    doctor: '',
    city: '',
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const filteredregions = Regions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const displayedRegions = showAll ? filteredregions : filteredregions.slice(0, 6);
  const hasMoreThan12Regions = filteredregions.length > 6;

  
  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };
  

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(DoctorVisittableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DoctorVisit');
    XLSX.writeFile(wb, 'DoctorVisit_Data.xlsx');
  };

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  

  return (
    <div className="p-8 mb-8  text-white rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex lg:flex-row gap-4 flex-col lg:items-center lg:justify-between">
        <h1 className="text-lg font-bold border-b-2 border-white">Filters</h1>

        <div className="flex justify-between items-center lg:flex-nowrap flex-wrap gap-4">
        <button onClick={exportToExcel} className="p-3 whitespace-nowrap w-full bg-[#1A91FF] shadow-md border rounded-full text-center flex justify-center gap-2">
          Export as Excel <PiMicrosoftExcelLogo size={20} />
        </button>
        <button onClick={exportToExcel} className="p-3 whitespace-nowrap w-full text-center bg-[#1A91FF] shadow-md border rounded-full  gap-2">
        Apply Filter
        </button>
        </div>
      
      </div>

      <div className="flex  flex-wrap sm:gap-4 md:gap-8 lg:gap-20 items-center">
        {/* Bookings */}
        <div className="flex lg:max-w-sm w-full lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Bookings:</label>
          <SelectDropDown
  value={dropdownValues.bookings}
  onChange={(value) => handleSelectChange('bookings', value)}
  options={['Online', 'Offline', 'All']}
  placeholder="Select Booking Type"
  id="booking-type"
  
  inputClassName="outline-none   rounded-lg bg-transparent h-[48px] shadow-md"  
  containerClassName="w-full"    
  dropdownClassName="text-[#000000] bg-transparent"              
/>

        </div>

        {/* Gender */}
        <div className="flex lg:w-1/6 w-full  lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Gender:</label>
          <SelectDropDown
              value={dropdownValues.gender}
              onChange={(value) => handleSelectChange('gender', value)}            
            options={['Male', 'Female', 'Others']}
            placeholder="Select Gender"
            inputClassName="outline-none rounded-lg bg-transparent h-[48px] shadow-md"  
            containerClassName="w-full"    
            dropdownClassName="text-[#000000] bg-transparent"       
            id="gender"
          />
        </div>

        {/* Date Filters */}
        <div className="flex  w-full lg:flex-row flex-col lg:items-center gap-2 lg:-mt-4  lg:w-96">
          <p className="">Date:</p>
          <div className="flex  lg:flex-row flex-col items-center  gap-4 w-full">
            {/* Start Date Picker */}
            <Popover >
              <PopoverTrigger asChild className="">
                <div className="relative w-full">
                  <Input
                    placeholder="Start Date"
                    value={startDate ? startDate.toLocaleDateString() : ""}
                    className="pr-10 text-sm shadow-md cursor-pointer h-[48px] placeholder:text-white outline-none"
                    readOnly
                  />
                  <Calendar1Icon className="absolute right-3 text-white top-1/2 transform -translate-y-1/2" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-white">to</span>

            {/* End Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative  w-full">
                  <Input
                    placeholder="End Date"
                    value={endDate ? endDate.toLocaleDateString() : ""}
                    className="pr-10 text-sm cursor-pointer h-[48px] placeholder:text-white outline-none shadow-md"
                    readOnly
                  />
                  <Calendar1Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex pb-4  w-full transform lg:-translate-y-0 -translate-y-1  flex-wrap gap-4 md:gap-8 lg:gap-10 items-center">
        {/* Doctor */}
        <div className="flex w-full lg:w-1/3 lg:flex-row flex-col lg:items-center lg:gap-4 mb-1 lg:mb-0">
          <label className="font-medium mb-1">Doctor:</label>
          <SelectDropDown
  value={dropdownValues.doctor}
  onChange={(value) => handleSelectChange('doctor', value)}
  options={['Jane', 'Smith']}
  placeholder="Enter Doctor Name"
  icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}
  id="doctor-name"
  inputClassName="outline-none rounded-full bg-white text-[#000000] h-[48px] shadow-md"  
  containerClassName="w-full"    
  dropdownClassName="text-[#000000] bg-transparent"    
/>

        </div>

        {/* City */}
        <div className="flex lg:flex-row flex-col lg:w-1/6 w-full lg:items-center mb-2 lg:gap-4 lg:mb-0 ">
          <label className="font-medium mb-1">City:</label>
          <SelectDropDown
             value={dropdownValues.city}

           onChange={(value) => handleSelectChange('city', value)}
           options={['Chennai', 'Bangalore']}            placeholder="Select City"
            id="city"
            inputClassName="outline-none border-white border-1 rounded-lg bg-transparent h-[48px] shadow-md"  
            containerClassName="w-full"    
            dropdownClassName="text-[#000000] bg-transparent"
            
          />
        </div>
      </div>


      <div className="  flex lg:flex-row flex-col lg:items-center   lg:gap-4 ">

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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6  transform lg:-translate-y-0 items-start lg:items-center">
  {displayedRegions.map((region, index) => (
    <div
      key={index}
      onClick={() => handleRegionSelect(region.name)}
      className="flex justify-center items-center flex-col"
    >
      <div
        className={`relative mb-4 rounded-full w-36 h-36 justify-center transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center ${
          selectedRegion === region.name
            ? "bg-gradient-to-r from-[#FFFFFF00] shadow-lg to-[#FFFFFFFF]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center flex-col w-full justify-center">
          <Image
            src={region.icon}
            alt={region.name}
            title={region.name}
            className="max-w-[60px] mb-1"
          />
          <p
            className={`text-center text-sm font-medium ${
              selectedRegion === region.name ? "text-[#000000]" : "text-white"
            }`}
          >
            {region.name}
          </p>
        </div>
      </div>
      {selectedRegion === region.name && (
        <div className="bg-[#D9D9D9] p-2 rounded-full">
          <p className="text-[#000000] text-center text-sm">
            {region.doctorCount} Doctors
          </p>
        </div>
      )}
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


      {/* Custom Select for an Option */}
     
    </div>
  );
};

export default DoctorVisitFilters;
