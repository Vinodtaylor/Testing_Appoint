/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import SelectDropDown from "../../Select/Select";
import {  UploadCloudIcon } from "lucide-react";
import { FaTrash, FaUserDoctor } from "react-icons/fa6";
import { useForm,   FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DoctorSchema from "@/schema/Doctor";
import ArrayField from "../../Fields/Array/Array";
import {  getAllDept, getAllHospital, getAllRegion, UpdateCoverImage, UpdateDoctor, UpdateProfileImage } from "@/routes/routes";
import toast from "react-hot-toast";
import Image from "next/image";
import { Department, getDoctor, Hospital, RegionsType } from "@/types/types";
import { IoMdArrowDropdown } from "react-icons/io";


interface Region{
  _id:string
  region_name:string,
  region_image:string
}

interface Doctor {
  _id?:string
  name: string;
  gender: string;
  age: number;
  region: Region;
  email: string;
  membership:string
  experience: number;
  phone_number: string;
  doctor_type:string[];
  registration: string;
  price: number;
  about_doctor: string;
  department: string;
  hospital:string;
 speciality: string[];
  main_speciality: string[];
  qualification: string[];
  doctor_experience: string[];
  top_treatments: string[];
  doctor_best_known: string[];
  doctor_expert: string[];
  doctor_video: string[];
  meta_name: string;
  meta_description: string;
  meta_tag: string[];
  doctor_image:  string; 
  doctor_cover_image:string; 
}



interface EditDoctorProps {
  doctor: Doctor;
}

const EditDoctor:React.FC<EditDoctorProps> = ({doctor}) => {
  const { isOpen, openModal, closeModal } = useModal(); 
  
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [data, setData] = useState<Department[]>([]);
    const [hospitaldata, sethospitalData] = useState<Hospital[]>([]);
    const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);

  

  const methods = useForm<getDoctor>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      main_speciality: [],
       speciality: [],

      meta_tag: [],
      doctor_expert: [],
      top_treatments: [],
      doctor_best_known: [],
      doctor_video: [],
      qualification: [],
      doctor_type:[],
      hospital:"",
      department:""
    },

  });




  // const { fields: qualificationFields, append, remove } = useFieldArray({
  //   control: methods.control, 
  //   name: "qualification",
  // });


  const [isWalkinVisitTrue, setIsWalkinVisitTrue] = useState<boolean>(false);
  const [isdoctorVisitTrue, setIsdoctorVisitTrue] = useState<boolean>(false);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  
  const [regiondata, setRegionData] = useState<RegionsType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);


  console.log(doctor,"Current Doctor")


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
      label: dept?.department_name, 
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
      console.log("Selected Hospital:", value);

    };



    const handleDeptChange = (value:string) => {
      setSelectedRegion(value); 
      setIsDropdownOpen(false)
      console.log("department",value)

      methods.setValue('department', value); 
    };




 

  const regionOptions = regiondata.map(region => ({
    label: region?.region_name,
    value: region, 
    key:region?._id         
  }));


  const handleRegionChange = (value: Region) => {

    console.log("Selected Region ID:", value._id);  // Debug log

    setSelectedRegion(value._id); 

    setIsDropdownOpen(false);
    methods.setValue('region', value._id as any);

  };
  
  


 
  useEffect(() => {

    console.log(doctor.region, "Doctor object"); 

    methods.reset({
      _id:doctor._id,
      name: doctor.name,
      gender: doctor.gender,
      age: doctor.age,
      email: doctor.email,
      experience: doctor.experience,
      membership:doctor.membership,
      phone_number: doctor.phone_number,
      registration: doctor.registration,
      region:doctor.region?._id,
      price: doctor.price,
      about_doctor: doctor.about_doctor,
      department: doctor.department?._id || '', // Safe access
      hospital: doctor.hospital?._id || '', 
      qualification: doctor.qualification,
      doctor_experience: doctor.doctor_experience,
      top_treatments: doctor.top_treatments,
      doctor_best_known: doctor.doctor_best_known,
      doctor_expert: doctor.doctor_expert,
      doctor_video: doctor.doctor_video,
      meta_name: doctor.meta_name,
      meta_description: doctor.meta_description,
      meta_tag: doctor.meta_tag,
      doctor_image: doctor.doctor_image , // Replace string with File (if available)
      doctor_cover_image: doctor.doctor_cover_image , // Replace string with File (if available)
      main_speciality: doctor.main_speciality || [],
      speciality: doctor.speciality || [],
      doctor_type: doctor.doctor_type || [],


    });

    setIsWalkinVisitTrue(doctor.doctor_type.includes("Walkin"));
    setIsdoctorVisitTrue(doctor.doctor_type.includes("Home"));  
    setSelectedRegion(doctor?.region?._id || null); 
    setProfileImageUrl(doctor.doctor_image);
    setCoverImageUrl(doctor.doctor_cover_image);
  
  }, [doctor]);
  



  useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log("Form values:", value);  // Log the entire form values
    });
    return () => subscription.unsubscribe();
  }, [methods]);
  
  
  
  
  

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
    const updatedDoctorType = isWalkinVisitTrue
      ? doctor.doctor_type.filter((type) => type !== "Walkin")  // Remove 'Walkin'
      : [...new Set([...doctor.doctor_type, "Walkin"])]  // Add 'Walkin' only if it's not already in the array
    
    // Update both the state and the form value
    setIsWalkinVisitTrue(!isWalkinVisitTrue);
    methods.setValue("doctor_type", updatedDoctorType);  // Update the form value
  };
  
  const handleDoctorVisitToggle = () => {
    const updatedDoctorType = isdoctorVisitTrue
      ? doctor.doctor_type.filter((type) => type !== "Home")  // Remove 'Home'
      : [...new Set([...doctor.doctor_type, "Home"])]  // Add 'Home' only if it's not already in the array
    
    // Update both the state and the form value
    setIsdoctorVisitTrue(!isdoctorVisitTrue);
    methods.setValue("doctor_type", updatedDoctorType);  // Update the form value
  };
  
  








  



 

const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files ? event.target.files[0] : null;

  if (file) {
    setProfileImage(file);  // Save the file object
    const objectUrl = URL.createObjectURL(file);  // Create a URL for the file for preview
    setProfileImageUrl(objectUrl);  // Preview the image
    methods.setValue("doctor_image", objectUrl);  // Set the URL for preview in the form (not the file object)
  } else {
    console.error("No file selected.");
  }
};

const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files ? event.target.files[0] : null;

  if (file) {
    setCoverImage(file);  // Save the file object
    const objectUrl = URL.createObjectURL(file);  // Create a URL for the file for preview
    setCoverImageUrl(objectUrl);  // Preview the image
    methods.setValue("doctor_cover_image", objectUrl);  // Set the URL for preview in the form (not the file object)
  } else {
    console.error("No file selected.");
  }
};

// Function to submit the doctor data and upload images
const SubmitDoctor = async (data: Doctor) => {
  console.log("Form data before submission:", data);

  // Ensure the doctor ID and region ID are included if not already set
  if (!data._id) {
    data._id = doctor._id;  // Set doctor ID from the prop if it's missing
  }
  
  // Ensure data.region is an object (it could be a string, i.e., just the region ID)
  if (typeof data.region === 'string') {
    data.region = { _id: data.region };  // Create the region object if it's a string
  }

  if (!data.region?._id) {
    data.region._id = doctor.region._id;  // Set region ID from the prop if it's missing
  }

  // Check if data has the necessary values now
  if (!data._id || !data.region?._id) {
    console.error("Doctor ID or Region ID is missing:", data);
    return;
  }

  try {
    console.log("Doctor data before processing:", data);

    // Prepare the doctor data (excluding images)
    const doctorData = {
      ...data,
      region: data.region._id,
    };
    console.log("Prepared doctor data:", doctorData);

    // First, update the doctor details (excluding images)
    const resDoctor = await UpdateDoctor(data._id, doctorData);
    console.log("Doctor update response:", resDoctor);

    // Upload images in parallel (if they exist)
    const updateCoverImagePromise = coverImage
      ? UpdateCoverImage(data._id, coverImage)
      : Promise.resolve({ status: 200, data: { doctor_cover_image: '' } });

    const updateProfileImagePromise = profileImage
      ? UpdateProfileImage(data._id, profileImage)
      : Promise.resolve({ status: 200, data: { doctor_image: '' } });

    // Wait for both image uploads to complete
    const [resCoverImage, resProfileImage] = await Promise.all([updateCoverImagePromise, updateProfileImagePromise]);

    console.log("Cover image upload response:", resCoverImage);
    console.log("Profile image upload response:", resProfileImage);

    // If images were uploaded, update the URLs in doctor data
    if (resCoverImage.status === 200 && resCoverImage.data?.doctor_cover_image) {
      doctorData.doctor_cover_image = resCoverImage.data.doctor_cover_image;
    }

    if (resProfileImage.status === 200 && resProfileImage.data?.doctor_image) {
      doctorData.doctor_image = resProfileImage.data.doctor_image;
    }

    // Now, update the doctor details with the image URLs
    const resDoctorWithImages = await UpdateDoctor(data._id, doctorData);
    console.log("Doctor details with image URLs response:", resDoctorWithImages);

    methods.reset();
    closeModal();
    toast.success("Doctor updated successfully!");
    window.location.reload();

  } catch (e) {
    console.error("Error occurred while submitting doctor data:", e);
    toast.error("An error occurred while updating doctor details");
  }
};




  
  

  console.log(methods.formState.errors);


  console.log(doctor._id, "Passed Doctor Prop");

  console.log("Doctor ID:", doctor?._id);
console.log("Doctor Object at Execution:", doctor);

  return (

    <div>

      <div className="flex  justify-center">
      <button
        onClick={openModal}
        className="px-4 max-w-full flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg"
      >
        Doctor <FaUserDoctor/>
      </button>
      </div>
  

      <Modal isOpen={isOpen}  onClose={closeModal} title="Add Doctor Details">
        <FormProvider {...methods} >

        <form
  className="space-y-6 max-h-full  overflow-hidden "
  onSubmit={methods.handleSubmit(SubmitDoctor)} 
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
                          <p className="text-red-500 text-sm text-left">{methods.formState.errors.name?.message}</p>

            </div>


            <div className="flex-1 ">
            <Controller
  name="gender"
  control={methods.control}
  render={({ field }) => (
    <SelectDropDown
      {...field} 
      value={field.value} 
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

<p className="text-red-500 text-sm text-left">{methods.formState.errors.gender?.message}</p>


           
            </div>

            <div className="  lg:max-w-xs w-full  ">
              <label htmlFor="age" className="block mb-2 text-left text-sm font-medium">
                Age
              </label>
              <input
    type="number"
    id="age"
    {...methods.register("age", {
      setValueAs: (value) => (value === "" ? "" : Number(value)),
    })}
    placeholder="Age"
    className="w-full  p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
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
  render={({ field }) => (
    <div className="relative">
      <label htmlFor="region" className="block mb-2 text-left text-sm font-medium">
        Region
      </label>

      <div
        className="px-6 flex justify-between items-center cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span className="text-sm">
          {selectedRegion
            ? regionOptions.find(option => option.value._id === selectedRegion)?.label
            : "Select Region"}
        </span>

        <IoMdArrowDropdown size={20} />
      </div>

      {isDropdownOpen && (
        <div className="absolute h-[150px] overflow-scroll z-10 mt-2 bg-white shadow-lg rounded-lg w-full mx-auto">
          {regionOptions.map((option) => (
            <div
              key={option.key}
              className="cursor-pointer text-sm text-left p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                // Set the selected region ID when a region is clicked
                setSelectedRegion(option.value._id!);
                field.onChange(option.value._id); // Set the value for react-hook-form
                setIsDropdownOpen(false);
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

                <p className="text-red-500 text-left text-sm">{methods.formState.errors.region?.message}</p>
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

<p className="text-red-500 text-left text-sm">{methods.formState.errors.email?.message}</p>

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
              <p className="text-red-500 text-left text-sm">{methods.formState.errors.experience?.message}</p>

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
<div className="flex gap-8 w-full">
      <div>
        <label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">
          Doctor Visit
        </label>
        <div className="flex gap-4">
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
        <label htmlFor="doctor-type" className="block mb-2 text-left text-sm font-medium">
          Walkin Visit
        </label>
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
              <label htmlFor="fees" className="block text-left mb-2 text-sm font-medium">
               Regsitration
              </label>
              <input
                type="number"
                id="registration"
                {...methods.register("registration")}
                placeholder="Fees"
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
              <label htmlFor="about" className="block mb-2 text-left text-sm font-medium">
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

<Controller
  name="department"
  control={methods.control}
  render={({ field }) => (
    <div className="relative">
      <label htmlFor="department" className="block mb-2 text-left text-sm font-medium">
        Department
      </label>
      <div
        className="px-6 flex justify-between items-center cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
        onClick={() => setIsDeptDropdownOpen(prev => !prev)}
      >
        <span className="text-sm">
          {field.value
            ? DeptOptions.find(option => option.value === field.value)?.label
            : "Select Department"}
        </span>
        <IoMdArrowDropdown size={20} />
      </div>

      {isDeptDropdownOpen && (
        <div className="absolute h-[150px] overflow-scroll text-left capitalize z-10 mt-2 bg-white shadow-lg rounded-lg w-full mx-auto">
          {DeptOptions.map(option => (
            <div
              key={option.key}
              className="cursor-pointer p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                field.onChange(option.value); // Set the department value in the form state
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

<Controller
  name="hospital"
  control={methods.control}
  render={({ field }) => (
    <div className="relative">
      <label htmlFor="hospital" className="block mb-2 text-left text-sm font-medium">
        Hospital
      </label>
      <div
        className="px-6 flex justify-between items-center cursor-pointer p-2 h-10 text-gray-800 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
        onClick={() => setIsHospitalDropdownOpen((prev) => !prev)}
      >
        <span className="text-sm">
          {field.value
            ? HospitalOptions.find((option) => option.value === field.value)?.label
            : "Select Hospital"}
        </span>
        <IoMdArrowDropdown size={20} />
      </div>

      {isHospitalDropdownOpen && (
        <div className="absolute h-[150px] overflow-scroll text-left capitalize z-10 mt-2 bg-white shadow-lg rounded-lg w-full mx-auto">
          {HospitalOptions.map((option) => (
            <div
              key={option.key}
              className="cursor-pointer p-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                field.onChange(option.value); 
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


                   
            <div className="flex flex-wrap gap-4">
          
          

            <div className="w-full">
          <ArrayField  name="qualification" label="Qualification" placeholder="Add Qualification"/>

          <p className="text-red-500 text-left text-sm">{methods.formState.errors.qualification?.message}</p>

            </div>


          
          </div>


          <div className="">
          <div className=" mb-4">

          <ArrayField name="main_speciality" label="Main Speciality" placeholder="Add Main Speciality"/>

          <p className="text-red-500 text-left text-sm">{methods.formState.errors.main_speciality?.message}</p>

            </div>

            <div className="">

<ArrayField name="speciality" label="Speciality" placeholder="Add Speciality"/>

<p className="text-red-500 text-left text-sm">{methods.formState.errors.speciality?.message}</p>

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
      onChange={handleProfileImageChange}

    />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_image?.message}</p>

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
      onChange={handleCoverImageChange}
    />

<p className="text-red-500 text-left text-sm">{methods.formState.errors.doctor_cover_image?.message}</p>

  </div>
</div>


<div className="flex flex-col gap-4">
            <div className="">
          <ArrayField name="top_treatments" label="Top Treatments" placeholder="Add Top Treatments"/>
          <p className="text-red-500  text-left text-sm">{methods.formState.errors.top_treatments?.message}</p>

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
<div className="mb-4">
              <label htmlFor="meta_name" className="block mb-1 text-sm text-left font-medium">
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
              <label htmlFor="meta_description" className="block mb-1 text-sm  text-left font-medium">
               Meta Description
              </label>
              <textarea
              rows={8}
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


<div className="grid grid-cols-2 gap-4">

{ profileImageUrl && renderImagePreview(profileImageUrl,handleRemoveProfileImage)}
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
}

export default EditDoctor
