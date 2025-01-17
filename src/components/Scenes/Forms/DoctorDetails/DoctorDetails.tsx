"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import SelectDropDown from "../../Select/Select";
import {  UploadCloudIcon } from "lucide-react";
import { FaTrash, FaUserDoctor } from "react-icons/fa6";
import { useForm,   FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DoctorSchema,{CreateDoctorData} from "@/schema/Doctor";
import ArrayField from "../../Fields/Array/Array";
import { CreateDoctor, getAllDept, getAllHospital, getAllRegion } from "@/routes/routes";
import toast from "react-hot-toast";
import Image from "next/image";
import { Department, Hospital, RegionsType } from "@/types/types";
import { IoMdArrowDropdown } from "react-icons/io";
// import compressImage from "@/utilis/compressImage";

const DoctorDetails = () => {
  const { isOpen, openModal, closeModal } = useModal(); 
  const methods = useForm<CreateDoctorData>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      main_speciality: [],
      meta_tag: [],
      doctor_expert: [],
      top_treatments: [],
      doctor_best_known: [],
      doctor_video: [],
      qualification: [],
     doctor_type:[],
     speciality:[],
     region:"",
     department:"",
  hospital:""
    },

  });


  // const formValues = methods.watch(); // Watches the entire form

// useEffect(() => {
//   console.log("Form values updated:", formValues);
// }, [formValues]);




  const [isWalkinVisitTrue, setIsWalkinVisitTrue] = useState<boolean>(false);
  const [isdoctorVisitTrue, setIsdoctorVisitTrue] = useState<boolean>(false);
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */



  const [homedocImage, sethomedocImage] = useState<File | null>(null);
  const [homedocImageUrl, sethomedocImageUrl] = useState<string | null>(null);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const [regiondata, setRegionData] = useState<RegionsType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState<Department[]>([]);
  const [hospitaldata, sethospitalData] = useState<Hospital[]>([]);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
const [selectedHospital, setSelectedHospital] = useState<string | null>(null);


  useEffect(() => {
    const getData = async () => {
      try {
        // Using Promise.all to make multiple API calls concurrently
        const [regionRes, deptRes, hospitalRes] = await Promise.all([
          getAllRegion(),
          getAllDept(),
          getAllHospital(),
        ]);

        // Updating the state with the responses
        setRegionData(regionRes.data);
        setData(deptRes.data);
        sethospitalData(hospitalRes.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    getData();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  
  


    const DeptOptions = data.map(dept => ({
      label: dept.department_name, 
      value: dept._id, 
      key:dept._id         
    }));


    const HospitalOptions = hospitaldata.map(hospital => ({
      label: hospital.hospital_name,
      value: hospital._id, 
      key:hospital._id        
    }));


    const handleHospitalChange = (value:string) => {
      setSelectedRegion(value); 
      setIsDropdownOpen(false)
      methods.setValue('hospital', value); 
    };



    const handleDeptChange = (value:string) => {
      setSelectedRegion(value); 
      setIsDropdownOpen(false)

      methods.setValue('department', value); 
    };

  const regionOptions = regiondata.map(region => ({
    label: region.region_name,
    value: region._id, 
    key:region._id        
  }));


  const handleRegionChange = (value:string) => {
    setSelectedRegion(value); 
    setIsDropdownOpen(false)
    methods.setValue('region', value); 

  };
 


  const handleProfileImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
  
    if (file) {
      // const compressedFile = await compressImage(file, 1, 800);

      setProfileImage(file);
      const objectUrl = URL.createObjectURL(file);  
      setProfileImageUrl(objectUrl); 
      methods.setValue("doctor_image", objectUrl); 
    } else {
      console.error("No file selected.");
    }
  };

  


  const handleHomeDocImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      sethomedocImage(file); 
      const fileUrl = URL.createObjectURL(file); 
      sethomedocImageUrl(fileUrl); 
      methods.setValue("home_doc_profile", fileUrl);
    } else {
      console.error("No file selected.");
    }
  };
  
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setCoverImage(file); 
      const fileUrl = URL.createObjectURL(file);
      setCoverImageUrl(fileUrl); 
      methods.setValue("doctor_cover_image", fileUrl);
    } else {
      console.error("No file selected.");
    }
  };
  

  const handleCloseModal = () => {
    methods.reset(); // Reset the form state when closing the modal
    closeModal(); 
  };
  
 
  
  
  const handleRemoveProfileImage = () => {
    setProfileImage(null); 
    setProfileImageUrl(null);  
  };
  
  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImageUrl(null);  
  };

    
  const handleRemoveHomeDocImage = () => {
    sethomedocImage(null);
    sethomedocImageUrl(null);  
  };
  


  const renderImagePreview = (imageUrl: string | null, removeImage: () => void) => {
    if (!imageUrl) return null;
  
    return (
      <div className="relative">
        <Image
          src={imageUrl}
          alt="Image preview"
          className="border w-full h-[200px] rounded-xl object-cover cursor-pointer"
          width={100}
          height={100}
        />
        <div
          onClick={removeImage}
          className="absolute top-2 right-2 p-1 bg-white rounded-full cursor-pointer hover:bg-gray-200"
        >
          <FaTrash size={20} className="text-red-500" />
        </div>
      </div>
    );
  };
  
 
  const handleWalkinToggle = () => {
    const newValue = !isWalkinVisitTrue;
    setIsWalkinVisitTrue(newValue);
  
    const currentDoctorType = methods.getValues("doctor_type") || [];
  
    if (newValue) {
      // Add "Walkin" if it's not already in the array
      if (!currentDoctorType.includes("Walkin")) {
        methods.setValue("doctor_type", [...currentDoctorType, "Walkin"]);
      }
    } else {
      // Remove "Walkin" if toggled off
      methods.setValue("doctor_type", currentDoctorType.filter(type => type !== "Walkin"));
    }
  };
  
  const handleDoctorVisitToggle = () => {
    const newValue = !isdoctorVisitTrue;
    setIsdoctorVisitTrue(newValue);
  
    const currentDoctorType = methods.getValues("doctor_type") || [];
  
    if (newValue) {
      // Add "Home" if it's not already in the array
      if (!currentDoctorType.includes("Home")) {
        methods.setValue("doctor_type", [...currentDoctorType, "Home"]);
      }
    } else {
      // Remove "Home" if toggled off
      methods.setValue("doctor_type", currentDoctorType.filter(type => type !== "Home"));
    }
  };
  
  








  const SubmitDoctor = async (data: CreateDoctorData) => {
    try {
      const formData = new FormData();
    
 
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              formData.append(key, String(item));  
            });
          } else {
            formData.append(key, String(value));
          }
        }
      });
    
      // Append images separately (you need to manage images outside this function)
      if (profileImage) {
        formData.append("doctor_image", profileImage); 
      }
      if (homedocImage) {
        formData.append("home_doc_profile", homedocImage);
      }


      if (coverImage) {
        formData.append("doctor_cover_image", coverImage);
      }
    
      // Call the API
      const res = await CreateDoctor(formData);
    
      // Handle response
      if (res && res.data) {
    
        if (res.message === "Success") {
          toast.success("Doctor Created Successfully", res.data);
          methods.reset();
          closeModal();
          window.location.reload();
        } else {
          console.error("API Error:", res.message);
          toast.error("Failed to create doctor", res.message || "Unknown error");
        }
      } else {
        console.error("Unexpected API response format", res);
        toast.error("Failed to create doctor. No valid response data.");
      }
    } catch (e) {
      console.error("Error occurred during doctor creation:", e);
      toast.error("An error occurred while creating the doctor");
    }
  };
  
  
  
  
  
  

  // console.log(methods.formState.errors);


  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 w-full flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg"
      >
        Doctor <FaUserDoctor/>
      </button>

      <Modal isOpen={isOpen}  onClose={closeModal} title="Add Doctor Details">
        <FormProvider {...methods} >

        <form
  className="space-y-6 max-h-full overflow-scroll"
  onSubmit={methods.handleSubmit(SubmitDoctor)} // Corrected form submission
>

          {/* Personal Details */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] max-w-sm">




              <label htmlFor="name" className="block text-left mb-2 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"

                {...methods.register("name")}
                placeholder="Doctor's Name"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300  outline-none rounded-lg"
              />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.name?.message}</p>

            </div>


            <div className="flex-1 ">
            <Controller
  name="gender"
  control={methods.control}
  render={({ field }) => (
    <SelectDropDown
      {...field} 
      value={field.value!} 
      onChange={(value) => {
        field.onChange(value); 
      }}
      options={["Male", "Female","Others"]}
      placeholder="Select Gender"
      inputClassName="outline-none rounded-lg bg-white shadow-md px-4"
      containerClassName="w-full text-left"
      dropdownClassName="text-black bg-white"
      id="gender"
      label="Gender"
    />
  )}
/>
<p className="text-red-500 text-left text-sm">{methods.formState.errors.gender?.message}</p>


           
            </div>

            <div className="">
              <label htmlFor="age" className="block mb-2 text-left text-sm font-medium">
                Age
              </label>
              <input
    type="number"
    id="age"
    {...methods.register("age")}
    placeholder="Age"
    className="w-20 p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
  />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.age?.message}</p>

            </div>

         

         
          </div>

          {/* Contact and Location */}
          <div className="flex  flex-wrap gap-4">
          <div className="flex-1">
                <Controller
                  name="region"
                  control={methods.control}
                  render={() => (
                    <div className="relative">
                                              <label htmlFor="region" className="block mb-2 text-left text-sm font-medium">Region</label>

                      <div
                        className="px-6 flex justify-between items-center  cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                      >
                        <span className="text-sm">
                          {selectedRegion
                            ? regionOptions.find(option => option.value === selectedRegion)?.label
                            : "Select Region"}
                        </span>

                        <IoMdArrowDropdown size={20}/>

                      </div>

                      {isDropdownOpen && (
                        <div className="absolute h-[150px] overflow-scroll z-10 mt-2 bg-white shadow-lg  rounded-lg w-full mx-auto">
                          {regionOptions.map(option => (
                            <div
                              key={option.key}
                              className="cursor-pointer text-sm p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                              onClick={() => handleRegionChange(option.value!)}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                <p className="text-red-500 text-sm">{methods.formState.errors.region?.message}</p>
              </div>

              <div className="flex-1 ">
              <label htmlFor="email" className="block text-left mb-2 text-sm font-medium">
                Email*
              </label>
              <input
                type="email"
                id="email"
                {...methods.register("email")}

                placeholder="Email"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />

<p className="text-red-500 text-left text-sm mt-2">{methods.formState.errors.email?.message}</p>

            </div>


            </div>
         

           

   
          <div className="">
              <label htmlFor="experience" className="block mb-2 text-left text-sm font-medium">
                Experience  in Years
              </label>
              <input
    type="number"
    id="experience"
    {...methods.register("experience", {
      setValueAs: (value) => (value === "" ? "" : Number(value)),
    })}
    placeholder="Experience  in years"
    className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
  />
            </div>

            <div className="">
          <ArrayField  name="doctor_experience" label="Experience" placeholder="Add Experience"/>

          <p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_experience?.message}</p>

            </div>


          {/* Professional Details */}
          <div className="flex lg:flex-row sm:flex-row  lg:items-center  flex-col  lg:flex-wrap gap-4">


          <div className="flex-1  ">
              <label htmlFor="phone" className="block text-left mb-2 text-sm font-medium">
                Phone*
              </label>
              <input
                type="tel"
                id="doctor-phone"
                {...methods.register("phone_number")}
                placeholder="Phone Number"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.phone_number?.message}</p>

            </div>
    
<div className="flex-1 ">
<div className="flex gap-8 w-full ">
            <div className="">

<label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">Home Visit</label>
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


            <p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_type?.message}</p>

</div>          
          </div>

          <div className="flex  flex-nowrap gap-4">
          <div className="flex-1 ">
              <label htmlFor="registration" className="block text-left mb-2 text-sm font-medium">
               Regsitration
              </label>
              <input
                type="number"
                id="registration"
                {...methods.register("registration")}
                placeholder="Registration"
                className="w-full placeholder:text-sm placeholder:px-4   p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.registration?.message}</p>

            </div>


            <div className="flex-1 ">
              <label htmlFor="fees" className="block mb-2 text-left text-sm font-medium">
              Fees
              </label>
              <input
                type="number"
                id="price"
                {...methods.register("price", {
                  setValueAs: (value) => (value === "" ? "" : Number(value)),
                })}
                placeholder="Fees"
                className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
              />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.price?.message}</p>

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
                id="about_doctor"
                {...methods.register("about_doctor")}
                placeholder="About"
                className="w-full placeholder:px-4 placeholder:text-sm p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
              <p className="text-red-500 text-left text-sm">{methods.formState.errors.about_doctor?.message}</p>

            </div>


            
          <div className="flex-1 min-w-[200px]">
              <label htmlFor="membership" className="block mb-2 text-left text-sm font-medium">
             Membership
              </label>
              <textarea
              rows={5}
                id="membership"
                {...methods.register("membership")}
                placeholder="Membership"
                className="w-full placeholder:px-4 placeholder:text-sm p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.membership?.message}</p>

            </div>



{/* Department searcbar */}
            <div className="">
            <div className="">
  <div className="relative text-left mb-4">

    {/* Department Dropdown */}
  
  <Controller
    name="department"
    control={methods.control}
    render={({ field }) => (
      <div className="relative mb-4">
        <label htmlFor="department" className="block mb-2 text-left text-sm font-medium">
          Department
        </label>
        <div
          className="px-6 flex justify-between items-center cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
          onClick={() => setIsDeptDropdownOpen(prev => !prev)}
        >
          <span className="text-sm">
            {selectedDept
              ? DeptOptions.find(option => option.value === selectedDept)?.label
              : "Select Department"}
          </span>
          <IoMdArrowDropdown size={20} />
        </div>
  
        {isDeptDropdownOpen && (
          <div className="absolute text-sm h-[150px] overflow-scroll text-left capitalize z-10 mt-2 bg-white shadow-lg rounded-lg w-full mx-auto">
            {DeptOptions.map(option => (
              <div
                key={option.key}
                className="cursor-pointer p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  setSelectedDept(option.value!);
                  field.onChange(option.value); // Correctly update react-hook-form value
                  setIsDeptDropdownOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  />
  
  <p className="text-red-500 text-left text-sm">{methods.formState.errors.department?.message}</p>

  
  
  
  <Controller
    name="hospital"
    control={methods.control}
    render={({ field }) => (
      <div className="relative">
        <label htmlFor="hospital" className="block mb-2 text-left text-sm font-medium">
          Hospital
        </label>
        <div
          className="px-6 flex   justify-between items-center cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
          onClick={() => setIsHospitalDropdownOpen((prev) => !prev)}
        >
          <span className="text-sm">
            {selectedHospital
              ? HospitalOptions.find((option) => option.value === selectedHospital)?.label
              : "Select Hospital"}
          </span>
          <IoMdArrowDropdown size={20} />
        </div>
  
        {isHospitalDropdownOpen && (
          <div className="absolute h-[150px] overflow-scroll text-left capitalize z-10 mt-2 bg-white shadow-lg rounded-lg w-full mx-auto">
            {HospitalOptions.map((option) => (
              <div
                key={option.key}
                className="cursor-pointer text-sm p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  setSelectedHospital(option.value!);
                  field.onChange(option.value); // Correctly update react-hook-form value
                  setIsHospitalDropdownOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.hospital?.message}</p>




  </div>
</div>







            </div>


           
            <div className="flex flex-wrap gap-4">
        
            <div className="w-full">
          <ArrayField name="qualification" label="Qualification" placeholder="Add Qualification"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.qualification?.message}</p>

            </div>  
            
            </div>


          <div className="">
          <div className="mb-4">
          <ArrayField name="main_speciality" label="Main Speciality" placeholder="Add Speciality"/>

          <p className="text-red-500 text-left text-sm">{methods.formState.errors.main_speciality?.message}</p>

            </div>

            <div className="">
          <ArrayField name="speciality" label="Speciality" placeholder="Add Speciality"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.speciality
          ?.message}</p>

            </div>
<div className="">


</div>
               
              
          </div>


          {/* Images */}
          <div className="flex flex-col gap-4">
  {/* Profile Image Upload */}
  <div className="w-full">
   
    <label
      htmlFor="doctor_image"
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
      id="doctor_image"
      className="hidden"
      onChange={handleProfileImageChange}

    />

<p className="text-left mt-1 text-red-600 font-medium text-sm">Width:300px ; height:300px</p>

  </div>


  <div className="w-full">
   
   <label
     htmlFor="home_doc_profile"
     className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none outline-none"
   >

       <div className="flex justify-between w-full items-center">
       <p className="text-sm">Home Visit Profile Pic</p>
     <div className="flex border-black border p-3 rounded-full gap-2 items-center">
     <p className="text-sm text-black ">Click to upload</p>

<UploadCloudIcon size={30}/>
     </div>
       </div>

    
   </label>
   <input
     type="file"
     id="home_doc_profile"
     className="hidden"
     onChange={handleHomeDocImageChange}

   />

<p className="text-left mt-1 text-red-600 font-medium text-sm">Width:650px ; height:980px</p>

 </div>


  {/* Cover Image Upload */}
  <div className="w-full">
   
    <label
      htmlFor="doctor_cover_image"
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
      id="doctor_cover_image"
      className="hidden"
      onChange={handleCoverImageChange}
    />
  </div>
</div>


<div className="flex flex-col gap-4">
            <div className="">
          <ArrayField name="top_treatments" label="Top Treatments" placeholder="Add Top Treatments"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.top_treatments?.message}</p>

            </div>
            <div className="">
          <ArrayField name="doctor_best_known" label="Best Known For" placeholder="Best Known For"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_best_known?.message}</p>

            </div>
            <div className="">
          <ArrayField name="doctor_expert" label="Expertise" placeholder="Add Expertise"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_expert?.message}</p>

            </div>
            <div className="">
          <ArrayField name="doctor_video" label="Add Video Links" placeholder="Add Video Links"/>
          <p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_video?.message}</p>

            </div>           
          </div>


          <div className="">
              <label htmlFor="age" className="block mb-2 text-left text-sm font-medium">
                Like Count
              </label>
              <input
    type="number"
    id="like_cout"
    {...methods.register("like_cout", {
      setValueAs: (value) => (value === "" ? "" : Number(value)),
    })}    placeholder="Like count"
    className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
  />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.like_cout?.message}</p>

            </div>

          
<div className="">
<div className="mb-4">
              <label htmlFor="doctor-email" className="block mb-1 text-sm text-left font-medium">
               Meta Name
              </label>
              <input
                type="text"
                id="meta_name"
                {...methods.register("meta_name")}
                placeholder="Meta Name"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              />
                          <p className="text-red-500 text-left text-sm">{methods.formState.errors.meta_name?.message}</p>

            </div>

            <div className="mb-4">
              <label htmlFor="doctor-email" className="block mb-1 text-sm  text-left font-medium">
               Meta Description
              </label>
              <textarea
              rows={5}
                id="meta_description"
                {...methods.register("meta_description")}
                placeholder="Meta Description"
                className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
              /> 
                          <p className="text-red-500 text-left text-sm">{methods.formState.errors.meta_description?.message}</p>

            </div>

            <div className="mb-4">
            <ArrayField name="meta_tag" label="Meta Tags"  placeholder="Meta tags"/>  
            <p className="text-red-500 text-left text-sm">{methods.formState.errors.meta_tag?.message}</p>
            
            </div>
</div>


<div className="grid grid-cols-3 gap-4">

{profileImageUrl && renderImagePreview(profileImageUrl,handleRemoveProfileImage)}
{homedocImageUrl && renderImagePreview(homedocImageUrl,handleRemoveHomeDocImage)}
{coverImageUrl && renderImagePreview(coverImageUrl,handleRemoveCoverImage)}
</div>



          {/* Submit Button */}
          <div className="flex gap-4 ">
            <button type="button" className="px-4 rounded-full py-2 w-full border-blue-500 border  text-blue-500 " onClick={handleCloseModal}>
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
