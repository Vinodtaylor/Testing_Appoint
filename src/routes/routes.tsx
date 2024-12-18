"use client";

import { Department, Doctor,   DoctorPrice,   Schedule} from "@/types/types";
import { axiosInstance } from "./api";





// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error:any, defaultMessage: string): never => {
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const CreateDoctor = async (data:FormData) => {
  try {
    const res = await axiosInstance.post(`/doctor/add_doctor`,data,
      {
        headers: { "Content-Type": "multipart/form-data" }}
    );
    return res.data;
  } catch (e) {
    handleError(e, "Failed to create doctor");
  }
};


export const GetDoctorbyId = async (id:string) => {
  try {
    const res = await axiosInstance.get(`/doctor/get_doctor/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to delete doctor");
  }
};





export const GetSchedulebydoctor = async (id:string) => {
  try {
    const res = await axiosInstance.get(`/doctorschedule/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Schedule details");
  }
};

export const DeleteDoctor = async (id:string) => {
  try {
    const res = await axiosInstance.delete(`/doctor/delete_doctor/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to create doctor");
  }
};


export const UpdateDoctor = async (id: string, doctorData: Doctor) => {
  try {
    // Send the doctor data as JSON (excluding images)
    const res = await axiosInstance.put(`/doctor/update_doctor/${id}`, doctorData, {
      headers: {
        "Content-Type": "application/json", 
      },
    });
    return res.data;
  } catch (e) {
    handleError(e, "Failed to update doctor");
    throw e;  
  }
};



// Update profile image
export const UpdateProfileImage = async (id: string, doctor_image: File) => {
  try {
    const formData = new FormData();
    formData.append("doctor_image", doctor_image);  // Append the actual file here

    const res = await axiosInstance.put(
      `/doctor/update_doctorimage/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    return res.data;  // This should return the response with the URL
  } catch (e) {
    handleError(e, "Failed to update Profile Image");
  }
};

// Update cover image
export const UpdateCoverImage = async (id: string, doctor_cover_image: File) => {
  try {
    const formData = new FormData();
    formData.append("doctor_cover_image", doctor_cover_image);  // Append the actual file here

    const res = await axiosInstance.put(
      `/doctor/update_doctorcoverimage/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    return res.data;  // This should return the response with the URL
  } catch (e) {
    handleError(e, "Failed to update Cover Image");
  }
};


export const GetAllDoctorwithPagination = async (currentPage:number,limit:number) => {
  try {
    const res = await axiosInstance.get(`/doctor/get_doctor?page=${currentPage}&limit=${limit}
`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to fetch  Doctors");
  }
};


export const GetAllDoctor = async () => {
  try {
    const res = await axiosInstance.get(`/doctor/get_doctor`);
    console.log(res,"All Doctors")
    return res.data;
  } catch (e) {
    handleError(e, "Failed to fetch  Doctors");
  }
};


export const GetAllDoctorNames = async () => {
  try {
    const res = await axiosInstance.get(`/getalldoctors`);
    console.log(res,"All Doctors")
    return res.data;
  } catch (e) {
    handleError(e, "Failed to fetch  Doctors");
  }
};




export interface Regiondata{
  region_name:string,
  region_image:string
}



export const createRegion =async(data:FormData)=>{
  try {
    const res = await axiosInstance.post(`/region/create_region`,data,
      {headers: { "Content-Type": "multipart/form-data" }}
    );
    console.log(res,"Response")
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}



export const getAllRegion =async()=>{
  try {
    const res = await axiosInstance.get(`/region/get_region`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}

export const DeleteRegion =async(id:string)=>{
  try {
    const res = await axiosInstance.delete(`/region/delete_region/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}




export const UpdateRegion =async(id:string,data: FormData | Regiondata)=>{
  try {
    const res = await axiosInstance.put(`/region/update_region/${id}`,data,
      {headers: { "Content-Type": "multipart/form-data" }}

    );
    console.log(res,"Response")

    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}







export const createDept =async(data:Department)=>{
  try {
    const res = await axiosInstance.post(`/department/add_department`,data);
    console.log(res,"Response")
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}



export const getAllDept=async()=>{
  try {
    const res = await axiosInstance.get(`/department/get_department`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}

export const DeleteDept=async(id:string)=>{
  try {
    const res = await axiosInstance.delete(`/department/delete_department/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}




export const UpdateDept =async(id:string,data: Department)=>{
  try {
    const res = await axiosInstance.put(`/department/update_department/${id}`,data
    );
    console.log(res,"Response")

    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}



export const CreateSchedule = async (data:Schedule) => {
  try {
    const res = await axiosInstance.post(`/schedule/add_schedule`,data
    );
    return res.data;
  } catch (e) {
    handleError(e, "Failed to create doctor");
  }
};


export const UpdateSchedule = async (id:string,data:Schedule) => {
  try {
    const res = await axiosInstance.put(`/schedule/update_schedule/${id}`,data
    );
    return res.data;
  } catch (e) {
    handleError(e, "Failed to create doctor");
  }
};


export const DeleteSchedule = async (id:string) => {
  try {
    const res = await axiosInstance.put(`/schedule/delete_schedule/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to create doctor");
  }
};


export const getWalkinData = async () => {
  try {
    const res = await axiosInstance.get(`/get_appointment`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Walkin data");
  }
};



export const getHomeVisitData = async () => {
  try {
    const res = await axiosInstance.get(`/homeappointment/get_homeappointment`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Home Visit data");
  }
};




export const DeleteWalkinAppointment =async(id:string)=>{
  try {
    const res = await axiosInstance.delete(`/appointment/delete_appointment/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}



export const createHospital=async(data:FormData)=>{
  try {
    const res = await axiosInstance.post(`/hospital/add_hospital`,data,
      {headers: { "Content-Type": "multipart/form-data" }}
    );
    console.log(res,"Response")
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}



export const getAllHospital =async()=>{
  try {
    const res = await axiosInstance.get(`/hospital/get_hospital `);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}

export const DeleteHospital =async(id:string)=>{
  try {
    const res = await axiosInstance.delete(`/hospital/delete_hospital/${id}`);
    return res.data;
  } catch (e) {
    handleError(e, "Failed to get Regions");
  }
}

export interface HospitalSubmission {
  hospital_name: string;
  hospital_address: string;
  hospital_icon?: File | string; 
}



export const UpdateHospital = async (id: string, data: HospitalSubmission | FormData) => {
  try {
    const jsonHeaders = { "Content-Type": "application/json" };
    const formHeaders = { "Content-Type": "multipart/form-data" };

    let formData = new FormData();
    let jsonData: { hospital_name: string; hospital_address: string } = {
      hospital_name: '',
      hospital_address: ''
    };

    if (data instanceof FormData) {
      // If data is FormData, just use it as is
      formData = data;
    } else {
      // If data is an object with hospital_name and hospital_address, send as JSON
      jsonData = {
        hospital_name: data.hospital_name,
        hospital_address: data.hospital_address,
      };

      formData.append("hospital_name", data.hospital_name);
      formData.append("hospital_address", data.hospital_address);

      if (data.hospital_icon) {
        formData.append("hospital_icon", data.hospital_icon); // If image exists
      }
    }

    // Send JSON data (if any) for non-image fields
    if (jsonData.hospital_name && jsonData.hospital_address) {
      await axiosInstance.put(`/hospital/update_hospital/${id}`, jsonData, { headers: jsonHeaders });
    }

    // Send FormData for image and other fields
    if (formData.has("hospital_icon") || formData.has("hospital_name") || formData.has("hospital_address")) {
      await axiosInstance.put(`/hospital/update_hospital/${id}`, formData, { headers: formHeaders });
    }

  } catch (e) {
    handleError(e, "Failed to update hospital");
  }
};



export const CreatePrice=async(data:DoctorPrice)=>{
  try {
    const res = await axiosInstance.post(`/price/create_price`,data
    );
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}


export const getPrice=async()=>{
  try {
    const res = await axiosInstance.get(`/price/get_price`);
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}


export const UpdatePrice=async(id:string,data:DoctorPrice)=>{
  try {
    const res = await axiosInstance.put(`/price/update_price/${id}`,data
    );
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}




export const deletePrice=async(id:string)=>{
  try {
    const res = await axiosInstance.delete(`/price/delete_price/${id}` );
    return res.data;
    
  } catch (e) {
    handleError(e, "Failed to create Region");
  }
}