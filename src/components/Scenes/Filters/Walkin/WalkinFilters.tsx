"use client";

import React, { useState } from "react";
import { Calendar1Icon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import Region from "../../../../../public/region.png";
import { Calendar } from "@/components/ui/calendar";
import {  WalkintableData } from "@/constants/data";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import SelectDropdown from "@/components/Scenes/Select/Select"; 

const Regions = [
  { name: "Bangalore", icon: Region, doctorCount: 24 },
  { name: "Whitefield", icon: Region, doctorCount: 18 },
  { name: "Koramangala", icon: Region, doctorCount: 30 },
  { name: "Malleswaram", icon: Region, doctorCount: 12 },
  { name: "Indiranagar", icon: Region, doctorCount: 20 },
  { name: "Jayanagar", icon: Region, doctorCount: 15 },
];

const WalkinFilters: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedRegion, setSelectedRegion] = useState<string>("Bangalore"); // Default to Bangalore
  const [dropdownValues, setDropdownValues] = useState({
    booking: "",
    gender: "",
    speciality: "",
    doctor: "",
    hospital: "",
    city: "",
  });

  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  // Get the doctor count for the selected region
  const selectedRegionData = Regions.find((region) => region.name === selectedRegion);
  const doctorCount = selectedRegionData?.doctorCount || 0;

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(WalkintableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WalkinVisit");
    XLSX.writeFile(wb, "WalkinVisit.xlsx");
  };

  return (
    <div className="p-8 mb-8 text-white flex flex-col gap-8 rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex lg:flex-row gap-4 flex-col lg:items-center lg:justify-between">
        <h1 className="text-lg font-bold border-b-2 border-white">Filters</h1>
        <button
          className="p-3 whitespace-nowrap bg-[#1A91FF] shadow-md border rounded-full flex items-center gap-2"
          onClick={exportToExcel}
        >
          Export as Excel <SiMicrosoftexcel size={20} />
        </button>
      </div>

      <div className="flex  flex-wrap lg:flex-wrap sm:gap-4 md:gap-8 lg:gap-10 items-center">
        <div className="flex lg:w-1/5 w-full lg:mb-0 mb-4 lg:flex-row flex-col lg:items-center gap-2"> 
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
        </div>

        <div className="flex lg:w-1/6 w-full  lg:flex-row flex-col lg:items-center gap-2">
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


       {/* Date Filters */}
       <div className="flex w-full lg:flex-row flex-col lg:items-center gap-4 space-y-2 lg:max-w-md mb-4">
          <p>Date:</p>
          <div className="flex  lg:flex-row flex-col items-center gap-4 w-full">
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

        <div className="flex lg:w-1/6 w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium mb-1">Speciality:</label>
          <SelectDropdown
          id="speciality"
           options={["ENT","Cardiology"]}
           value={dropdownValues.speciality}
            onChange={(value) => handleSelectChange("speciality", value)}
            placeholder="Select Speciality"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>
      </div>

      <div className="flex w-full  flex-wrap gap-4 md:gap-8 lg:gap-10 items-center">
        <div className="flex lg:w-1/3 w-full lg:flex-row flex-col lg:items-center gap-4">
          <label className="font-medium mb-1">Doctor:</label>
          <SelectDropdown
           id="doctor"
           options={["Doctor 1","Doctor 2"]}
           value={dropdownValues.doctor}
           icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}
             onChange={(value) => handleSelectChange("doctor", value)}
             placeholder="Select Doctor Name"
             inputClassName="outline-none rounded-full bg-white text-black h-[48px] shadow-md bg-transparent"
             containerClassName="w-full"
             dropdownClassName="bg-white text-black"
 
          />
        </div>

        <div className="flex lg:w-1/3 w-full lg:flex-row flex-col lg:items-center gap-4">
          <label className="font-medium mb-1">Hospital:</label>
          <SelectDropdown
          id="hospital"
          options={["Apollo","Medidocs"]}
          value={dropdownValues.hospital}
          icon={[<VscTriangleDown size={20} key="down" />, <VscTriangleUp key="up" size={20}/>]}


            onChange={(value) => handleSelectChange("hospital", value)}
            placeholder="Select Hospital Name"
            inputClassName="outline-none rounded-full bg-white text-black h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>

        <div className="flex lg:w-1/6 w-full lg:flex-row flex-col lg:items-center gap-2">
          <label className="font-medium mb-1">City:</label>
          <SelectDropdown
          id="city"
            options={["Male", "Female", "Others"]}
            value={dropdownValues.city}
            onChange={(value) => handleSelectChange("city", value)}
            placeholder="Select City"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center overflow-hidden gap-6">
        <label className="font-medium mb-1">Region:</label>
        <div className="flex gap-12">
          {Regions.map((region, index) => (
            <div
              key={index}
              onClick={() => handleRegionSelect(region.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`relative mb-4 rounded-full  flex justify-center items-center flex-col w-36 h-36 transition-all duration-300 ease-in-out ${
                  selectedRegion === region.name ? "bg-gradient-to-r from-[#FFFFFF00]  shadow-lg to-[#FFFFFFFF]" : "bg-transparent"
                }`}
              >
                <Image src={region.icon} alt={region.name} className="max-w-[60px]" />
                <p className={`text-sm font-medium ${selectedRegion === region.name ? "text-black" : "text-white"}`}>
                  {region.name}
                </p>
              </div>
              {selectedRegion === region.name && (
                <div className="bg-[#D9D9D9] p-2 rounded-full">
                  <p className="text-black text-sm">{doctorCount} Doctors</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalkinFilters;
