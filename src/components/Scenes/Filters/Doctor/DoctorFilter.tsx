"use client";

import React, { useState } from "react";

import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import Region from '../../../../../public/region.png';
import * as XLSX from 'xlsx';
import { DoctorVisittableData } from "@/constants/data";
import SelectDropDown from "../../Select/Select"; 
import { PiMicrosoftExcelLogo } from "react-icons/pi";


// Define the regions
const Regions = [
  { name: "Bangalore", icon: Region, doctorCount: 24 },
  { name: "Whitefield", icon: Region, doctorCount: 18 },
  { name: "Koramangala", icon: Region, doctorCount: 30 },
  { name: "Malleswaram", icon: Region, doctorCount: 12 },
  { name: "Indiranagar", icon: Region, doctorCount: 20 },
  { name: "Jayanagar", icon: Region, doctorCount: 15 },
];

const DoctorFilter: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Bangalore");
  const [dropdownValues, setDropdownValues] = useState({
    gender: '',
    doctor: '',
    dept: '',
  });
  
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
  const selectedRegionData = Regions.find(region => region.name === selectedRegion);
  const doctorCount = selectedRegionData?.doctorCount || 0;

  return (
    <div className="p-8 mb-8  text-white rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex lg:flex-row gap-4 flex-col lg:items-center lg:justify-between">
        <h1 className="text-lg font-bold border-b-2 border-white">Filters</h1>
        <button onClick={exportToExcel} className="p-3 whitespace-nowrap bg-[#1A91FF] shadow-md border rounded-full flex items-center gap-2">
          Export as Excel <PiMicrosoftExcelLogo size={20} />
        </button>
      </div>

      <div className="flex p-4 lg:flex-row flex-col sm:gap-4 md:gap-8 lg:gap-20 items-center">
        {/* Bookings */}
       

        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Department:</label>
          <SelectDropDown
             value={dropdownValues.dept}

           onChange={(value) => handleSelectChange('city', value)}
           options={['Dept1', 'Dept2']}            placeholder="Select Department"
            id="dept"
            inputClassName="outline-none border-white border-1 rounded-lg bg-transparent h-[48px] shadow-md"  
            containerClassName="w-full"    
            dropdownClassName="text-[#000000] bg-transparent"
            
          />
        </div>
        {/* Gender */}
        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-2 mb-4">
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

        
      </div>

      <div className="flex w-full transform lg:-translate-y-0 -translate-y-8 p-4 flex-wrap gap-4 md:gap-8 lg:gap-10 items-center">
        {/* Doctor */}
        <div className="flex w-full  lg:flex-row flex-col lg:items-center gap-4 mb-4 lg:mb-0">
          <label className="font-medium mb-1">Doctor:</label>
          <SelectDropDown
  value={dropdownValues.doctor}
  onChange={(value) => handleSelectChange('doctor', value)}
  options={['Jane', 'Smith']}
  placeholder="Select Doctor Name"
  icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}
  id="doctor-name"
  inputClassName="outline-none rounded-full bg-white text-[#000000] h-[48px] shadow-md"  
  containerClassName="w-full"    
  dropdownClassName="text-[#000000] bg-transparent"    
/>

        </div>

        {/* City */}
      
      </div>

      {/* Region */}
      <div className="flex lg:flex-row transform lg:-translate-y-0 -translate-y-8  items-start flex-col overflow-hidden lg:items-center p-4 gap-6">
        <label className="font-medium mb-1">Region:</label>
        <div className="flex gap-12">
          {Regions.map((region, index) => (
            <div
              key={index}
              onClick={() => handleRegionSelect(region.name)}
              className="flex justify-center items-center flex-col"
            >
              <div
                className={`relative mb-4 rounded-full w-36 h-36 justify-center transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center ${selectedRegion === region.name ? "bg-gradient-to-r from-[#FFFFFF00]  shadow-lg to-[#FFFFFFFF]" : "bg-transparent"}`}
              >
                <div className="flex items-center flex-col w-full justify-center">
                  <Image
                    src={region.icon}
                    alt={region.name}
                    title={region.name}
                    className="max-w-[60px] mb-1"
                  />
                  <p className={`text-center text-sm font-medium ${selectedRegion === region.name ? "text-[#000000]" : "text-white"}`}>
                    {region.name}
                  </p>
                </div>
              </div>
              {selectedRegion === region.name && (
                <div className="bg-[#D9D9D9] p-2 rounded-full">
                  <p className="text-[#000000] text-center text-sm">
                    {doctorCount} Doctors
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default DoctorFilter;
