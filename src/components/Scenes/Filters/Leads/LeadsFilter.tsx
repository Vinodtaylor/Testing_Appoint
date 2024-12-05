"use client";

import React, { useState } from "react";
import { Calendar1Icon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { LeadtableData, Pagesdata } from "@/constants/data";
import { SiMicrosoftexcel } from "react-icons/si";
import SelectDropDown from "../../Select/Select"; 
import * as XLSX from "xlsx";

const LeadsFilters: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [dropdownValues, setDropdownValues] = useState({
    gender: '',
    city: '',
    pages:'',

  });
  
  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(LeadtableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "Leads_Data.xlsx");
  };

  return (
    <div className="p-8 mb-8  text-white rounded-tl-lg rounded-tr-lg space-y-4 bg-[#1A91FF]">
      <div className="flex lg:flex-row gap-4  flex-col lg:items-center lg:justify-between">
        <h1 className="text-lg font-bold border-b-2 border-white">Filters</h1>
        <button
          className="p-3 whitespace-nowrap bg-[#1A91FF] shadow-md border rounded-full flex items-center gap-2"
          onClick={exportToExcel}
        >
          Export as Excel <SiMicrosoftexcel size={20} />
        </button>
      </div>

      <div className="flex p-4  sm:gap-4 md:gap-8 lg:gap-20 items-center">
        {/* Pages */}
        <div className="flex  w-full lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Pages:</label>
          <SelectDropDown
          
          value={dropdownValues.pages}
          onChange={(value) => handleSelectChange('pages', value)}
            options={Pagesdata.map((page) => page.name)}
            placeholder="Select Page Type"
            id="page-type"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>

        {/* Gender */}
        <div className="flex w-full lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Gender:</label>
          <SelectDropDown
          value={dropdownValues.gender}
          onChange={(value) => handleSelectChange('gender', value)}
        
            options={["Male", "Female", "Others"]}
            placeholder="Select Gender"
            id="gender"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>


        <div className="flex  w-full lg:flex-row flex-col lg:items-center gap-2 mb-4">
          <label className="font-medium mb-1">Gender:</label>
          <SelectDropDown
          value={dropdownValues.city}

          onChange={(value) => handleSelectChange('city', value)}
          options={['Chennai', 'Bangalore']}            placeholder="Select City"
          id="city"
            inputClassName="outline-none rounded-lg h-[48px] shadow-md bg-transparent"
            containerClassName="w-full"
            dropdownClassName="bg-white text-black"
          />
        </div>

        {/* Date Filters */}
        
      </div>

      <div className="flex w-full lg:flex-row flex-col lg:items-center gap-4 space-y-2 lg:w-1/2  mb-4">
          <p>Date:</p>
          <div className="flex lg:flex-row flex-col items-center gap-4 w-full">
            {/* Start Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
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
                <div className="relative w-full">
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
  );
};

export default LeadsFilters;
