"use client";

import React, { useState } from "react";

import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import Region from '../../../../../public/region.png';
import * as XLSX from 'xlsx';
import { DoctorVisittableData } from "@/constants/data";
import SelectDropDown from "../../Select/Select"; 
import { PiMicrosoftExcelLogo } from "react-icons/pi";


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

const DoctorFilter: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Bangalore");
  const [dropdownValues, setDropdownValues] = useState({
    gender: '',
    doctor: '',
    dept: '',
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

  // Get the doctor count for the selected region

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

      <div className="flex  lg:flex-row flex-col sm:gap-4 md:gap-8 lg:gap-20 items-center">
        {/* Bookings */}
       

        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-2 lg:pb-4  pb-4">
          <label className="font-medium ">Department:</label>
          <SelectDropDown
             value={dropdownValues.dept}

           onChange={(value) => handleSelectChange('city', value)}
           options={['Dept1', 'Dept2']}            placeholder="Select Department"
            id="dept"
            inputClassName="outline-none border-white border-1 rounded-lg bg-transparent h-[48px] shadow-md"  
            containerClassName="w-full"    
            dropdownClassName="text-[#000000] bg-transparent w-full"
            
          />
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
  value={dropdownValues.doctor}
  onChange={(value) => handleSelectChange('doctor', value)}
  options={['Jane', 'Smith']}
  placeholder="Select Doctor Name"
  icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}
  id="doctor-name"
  inputClassName="outline-none rounded-full bg-white text-[#000000] h-[48px] shadow-md"  
  containerClassName="w-full"    
  dropdownClassName="text-[#000000] bg-transparent w-full"    
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

     
    </div>
  );
};

export default DoctorFilter;
