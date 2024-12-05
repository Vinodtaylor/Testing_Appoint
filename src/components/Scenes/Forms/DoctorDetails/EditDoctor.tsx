"use client";

import React, { useState } from "react";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import SelectDropDown from "../../Select/Select";
import { Edit, Plus, UploadCloudIcon } from "lucide-react";
import { FaSearch } from "react-icons/fa";




const EditDoctor = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState<string>('');


 

  
  const [dropdownValues, setDropdownValues] = useState({
    department:''
  });

  const [isTrue, setIsTrue] = useState<boolean>(false);

  const handleToggle = () => {
    setIsTrue((prevState) => !prevState);
  };


  const Depts = [
    "ENT", 
    "Cardiology", 
    "Dermatology", 
    "Orthopedics", 
    "Neurology", 
    "Pediatrics", 
    "Gastroenterology", 
    "Oncology", 
    "Psychiatry", 
    "Rheumatology", 
    "Pulmonology", 
    "Urology", 
    "Obstetrics & Gynecology", 
    "Ophthalmology", 
    "Endocrinology", 
    "Nephrology", 
    "General Surgery", 
    "Hematology", 
    "Infectious Diseases", 
    "Radiology", 
    "Pathology", 
    "Plastic Surgery", 
    "Anesthesia", 
    "Internal Medicine"
  ];

  const filteredDepts = Depts.filter(dept =>
    dept.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  return (
    <div>
      <button
        onClick={openModal}
      >
       <Edit size={20}/>
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Edit Doctor Details">
        <form className="space-y-6 max-h-full overflow-scroll ">
          {/* Personal Details */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <label htmlFor="name" className="block text-left mb-2 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Doctor's Name"
                className="w-full p-2 shadow-md border border-gray-300  outline-none rounded-lg"
              />
            </div>

            <div className="flex-1 ">
             <SelectDropDown
             value={dropdownValues.department}
             onChange={(value) => handleSelectChange("gender", value)}
             options={["Male", "Female"]}
             placeholder="Select Gender"
             inputClassName="outline-none rounded-lg bg-white  shadow-md px-4"
             containerClassName="w-full text-left"
             dropdownClassName="text-black bg-white"
             id="gender"
             label="Gender"

             />
            </div>

            <div className="">
              <label htmlFor="age" className="block mb-2 text-left text-sm font-medium">
                Age
              </label>
              <input
                type="number"
                id="age"
                placeholder="Age"
                className="w-20 p-2 shadow-md border  border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>

          {/* Contact and Location */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 ">
              <label htmlFor="region" className="block text-left mb-2 text-sm font-medium">
                Region
              </label>
              <input
                type="text"
                id="region"
                placeholder="Region"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div className="flex-1 ">
              <label htmlFor="email" className="block text-left mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

           
          </div>




          {/* Professional Details */}
          <div className="flex lg:flex-row sm:flex-row  flex-col  lg:flex-wrap gap-4">


          <div className="flex-1  ">
              <label htmlFor="phone" className="block text-left mb-2 text-sm font-medium">
                Phone
              </label>
              <input
                type="tel"
                id="doctor-phone"
                placeholder="Phone Number"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex-1 ">
              <label htmlFor="experience" className="block text-left mb-2 text-sm font-medium">
                Experience (Years)
              </label>
              <input
                type="number"
                id="experience"
                placeholder="Experience"
                className="  w-full  p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div className="flex-1">
            <div className=" gap-4">

<label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">Doctor  Type</label>
<div className="flex gap-4">
<div
      className={`w-16 h-8 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
        isTrue ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={handleToggle}
    >
      <div
        className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isTrue ? "translate-x-8" : "translate-x-1"
        }`}
      />

      
    </div>
    <span className="text-base font-normal">{isTrue ? "Walkin" : "Doctor Visit"}</span>

</div>

  </div>
            </div>

           
          </div>

          <div className="flex  flex-nowrap gap-4">
          <div className="flex-1 ">
              <label htmlFor="fees" className="block text-left mb-2 text-sm font-medium">
               Regsitration
              </label>
              <input
                type="number"
                id="fees"
                placeholder="Fees"
                className="w-full   p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>


            <div className="flex-1 ">
              <label htmlFor="fees" className="block mb-2 text-left text-sm font-medium">
              Fees
              </label>
              <input
                type="number"
                id="doctor-fees"
                placeholder="Fees"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>


          <div>
         




           
          </div>





          <div className="flex-1 min-w-[200px]">
              <label htmlFor="about" className="block mb-2 text-left text-sm font-medium">
               About Doctor
              </label>
              <textarea
              rows={5}
                id="about"
                placeholder="About"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>



{/* Department searcbar */}
            <div className="">
            <div className="relaltive  text-left  mb-4">
  <label htmlFor="Departments" className=" mb-2">Departments</label>

    <div className="flex items-center p-1 mt-2 border  rounded-md">
      <FaSearch size={20} className=" left-3  text-black" />
      <input
        type="text"
        id="Departments"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Name"
        className="pl-4 pr-4 py-2 w-full text-b rounded-md focus:outline-none outline-none"
      />
    </div>
</div>


<div className="max-h-48 p-4 overflow-scroll flex gap-4 flex-wrap">
        {filteredDepts.length > 0 ? (
          filteredDepts.map((d, index) => (
            <div key={index}>
              <button
                className="rounded-full px-6 py-2 text-sm font-normal hover:bg-blue-500 hover:text-white border border-blue-500 transition-all duration-300 ease-in-out"
              >
                {d}
              </button>
            </div>
          ))
        ) : (
          <p>No departments found</p> 
        )}
      </div>




            </div>


           
            <div className="flex flex-wrap gap-4">
          <div className="flex-1 ">
              <label htmlFor="degree" className="block mb-2 text-sm font-medium text-left">
            Degree
              </label>
              <input
                type="text"
                id="degree"
                placeholder="Degree"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>


            <div className="flex-1">
              <label htmlFor="year" className="block mb-2 text-sm font-medium text-left">
              Year
              </label>
              <input
                type="number"
                id="year"
                placeholder="Year"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>


          <div className="">
          <div className="flex mb-2 justify-between items-center ">
                <label htmlFor="speciality" className="block mb-2 text-sm font-medium">
               Speciality
              </label>

              <button  type="button"  className="bg-blue-500  text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
  <Plus/>
</button>
                </div>

<div className="">


</div>
                <input
                type="text"
                id="Speciality"
                placeholder="Speciality"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />

              
          </div>


          {/* Images */}
          <div className="flex lg:flex-row  sm:flex-row flex-col gap-4">
  {/* Profile Image Upload */}
  <div className="w-full">
   
    <label
      htmlFor="profile-image"
      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none outline-none"
    >

        <div className="flex justify-between w-full items-center">
        <p className="text-sm">Profile Image</p>
      <div className="flex border-black border p-3 rounded-full gap-2 items-center">
      <p className="text-sm text-black ">Click to upload</p>

<UploadCloudIcon size={30}/>
      </div>
        </div>

     
    </label>
    <input
      type="file"
      id="profile-image"
      className="hidden"
    />
  </div>

  {/* Cover Image Upload */}
  <div className="w-full">
   
    <label
      htmlFor="cover-image"
      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none outline-none"
    >

        <div className="flex justify-between w-full items-center">
        <p className="text-sm">Cover Image</p>
      <div className="flex border-black border p-3 rounded-full gap-2 items-center">
      <p className="text-sm text-black ">Click to upload</p>

<UploadCloudIcon size={30}/>
      </div>
        </div>

     
    </label>
    <input
      type="file"
      id="cover-image"
      className="hidden"
    />
  </div>
</div>


<div className="flex flex-col gap-4">
            <div className="">
            <div className="flex mb-1 justify-between items-center ">
                <label htmlFor="doctor-email" className="block mb-2 text-sm font-medium">
               Top Treatments
              </label>

              <button  type="button"  className="bg-blue-500  text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
  <Plus/>
</button>
                </div>
              <input
                type="text"
                id="top-treatments"
                placeholder="Top Treatments"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div className="">
            <div className="flex mb-2 justify-between items-center ">
                <label htmlFor="best-known" className="block mb-2 text-sm font-medium">
               Best Known For
              </label>

              <button  type="button"  className="bg-blue-500  text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
  <Plus/>
</button>
                </div>
              <input
                type="text"
                id="best-known"
                placeholder="Best Known for "
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>



            <div className="">
            <div className="flex mb-2 justify-between items-center ">
                <label htmlFor="expertise" className="block mb-2 text-sm font-medium">
               Expertise
              </label>

              <button  type="button"  className="bg-blue-500  text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
  <Plus/>
</button>
                </div>
              <input
                type="text"
                id="expertise"
                placeholder="Expertise"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>


            <div className="">
            <div className="flex mb-2 justify-between items-center ">
                <label htmlFor="video-link" className="block mb-2 text-sm font-medium">
              Video Link
              </label>

              <button  type="button"  className="bg-blue-500  text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
  <Plus/>
</button>
                </div>
              <input
                type="text"
                id="video-link"
                placeholder="Video Link"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>
           
          </div>





<div className="">
<div className="mb-4">
              <label htmlFor="doctor-email" className="block mb-1 text-sm text-left font-medium">
               Meta Name
              </label>
              <input
                type="text"
                id="meta name"
                placeholder="Meta Name"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="doctor-email" className="block mb-1 text-sm  text-left font-medium">
               Meta Description
              </label>
              <input
                type="text"
                id="meta-description"
                placeholder="Meta Description"
                className="w-full p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />


              
            </div>

            <div className="mb-4">

                <div className="flex mb-2 justify-between items-center ">
                <label htmlFor="meta-tags" className="block mb-2 text-sm  font-medium">
               Meta Tag
              </label>

              <button  type="button" className="bg-blue-500 flex items-center gap-2 text-white rounded-md px-1 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200">
<Plus/>
</button>
                </div>
          
              <input
                type="text"
                id="meta-tags"
                placeholder="Meta Tag"
                className="w-full  p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />


              
            </div>
</div>





          {/* Submit Button */}
          <div className="flex gap-4 ">
            <button type="submit" className="px-4 rounded-full py-2 w-full border-blue-500 border  text-blue-500 " onClick={closeModal}>
              Cancel
            </button>

            <button type="submit" className="px-4 rounded-full py-2 w-full bg-blue-500 text-white ">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditDoctor;
