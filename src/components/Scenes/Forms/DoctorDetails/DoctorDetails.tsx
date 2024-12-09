"use client";

import React, { useState } from "react";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import SelectDropDown from "../../Select/Select";
import {  UploadCloudIcon } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { useForm,   FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DoctorSchema,{DoctorFormValues} from "@/schema/Doctor";
import ArrayField from "../../Fields/Array/Array";



const DoctorDetails = () => {
  const { isOpen, openModal, closeModal } = useModal(); 
  const [dropdownValues, setDropdownValues] = useState({
    department:''
  });


  const methods = useForm<DoctorFormValues>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      speciality: [],
      meta_tag: [],
      doctor_expert: [],
      top_treatments: [],
      doctor_best_known: [],
      doctor_video: [],
      qualification: [{ degree: "", year: new Date().getFullYear() }],
    },
  });

  // const { fields: qualificationFields, append, remove } = useFieldArray({
  //   control: methods.control, 
  //   name: "qualification",
  // });


  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWalkinVisitTrue, setIsWalkinVisitTrue] = useState<boolean>(false);
  const [isdoctorVisitTrue, setIsdoctorVisitTrue] = useState<boolean>(false);

  const handleWalkinToggle = () => {
    setIsWalkinVisitTrue((prevState) => !prevState);
  };

  const handleDoctorVisitToggle = () => {
    setIsdoctorVisitTrue((prevState) => !prevState);
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
        className="px-4 w-full flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg"
      >
        Doctor <FaUserDoctor/>
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Add Doctor Details">
        <FormProvider {...methods}>

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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300  outline-none rounded-lg"
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
                className="w-20 p-2 placeholder:text-sm placeholder:px-4 shadow-md border  border-gray-300 rounded-md outline-none"
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>

           
          </div>




          {/* Professional Details */}
          <div className="flex lg:flex-row sm:flex-row  lg:items-center  flex-col  lg:flex-wrap gap-4">


          <div className="flex-1  ">
              <label htmlFor="phone" className="block text-left mb-2 text-sm font-medium">
                Phone
              </label>
              <input
                type="tel"
                id="doctor-phone"
                placeholder="Phone Number"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
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
                className="  w-full placeholder:text-sm placeholder:px-4  p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
              
            </div>


<div className="flex-1 ">
<div className="flex gap-8 w-full ">
            <div className="">

<label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">Doctor Visit</label>
<div className="flex flle gap-4">
<div
      className={`w-16 h-8 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
        isdoctorVisitTrue ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={handleDoctorVisitToggle}
    >
      <div
        className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isdoctorVisitTrue ? "translate-x-8" : "translate-x-1"
        }`}
      />

      
    </div>

</div>

  </div>
  <div>

<label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">Walkin Visit</label>
<div className="flex gap-4">
<div
      className={`w-16 h-8 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
        isWalkinVisitTrue ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={handleWalkinToggle}
    >
      <div
        className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isWalkinVisitTrue ? "translate-x-8" : "translate-x-1"
        }`}
      />

      
    </div>

</div>

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
                className="w-full placeholder:text-sm placeholder:px-4   p-2 shadow-md border border-gray-300 rounded-md outline-none"
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
                className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
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
        className="pl-4 placeholder:text-sm placeholder:px-4 pr-4 py-2 w-full text-b rounded-md focus:outline-none outline-none"
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>


          <div className="">
          <div className="">
          <ArrayField name="speciality" label="Speciality" placeholder="Add Speciality"/>
            </div>


<div className="">


</div>
               
              
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
          <ArrayField name="top_treatments" label="Top Treatments" placeholder="Add Top Treatments"/>
            </div>


            <div className="">
          <ArrayField name="doctor_best_known" label="Best Known For" placeholder="Best Known For"/>
            </div>


            <div className="">
          <ArrayField name="doctor_expert" label="Expertise" placeholder="Add Expertise"/>
            </div>


            <div className="">
          <ArrayField name="doctor_video" label="Add Video Links" placeholder="Add Video Links"/>
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
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
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />


              
            </div>

            <div className="mb-4">

            <ArrayField name="meta_tag" label="Meta Tags"  placeholder="Meta tags"/>


              
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
        </FormProvider>
     
      </Modal>
    </div>
  );
};

export default DoctorDetails;
