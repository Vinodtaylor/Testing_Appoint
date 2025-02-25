export interface Gender {
    male: string;
    female: string;
    others: string;
}

export interface Doctor {
    name: string;
}

export interface DoctorList {
    doctors: Doctor[];
}

export interface City {
    cityNames: string[];
}

export interface Region {
    _id?:string,
    regionIcon: string;
    regionName: string;
}

export interface RegionList {
    regions: Region[];
}


export interface TableHeadertype {
    name: string;
}

export interface DoctorVisitTable {
    sno: number; 
    visitType: string;
    bookingStatus: string;
    patientId: string;
    visitId: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    bookedTime: string;
    doctor: string;
    status: string;
}

export interface ServiceTable {
    name: string;
    contact: string;
    age: string;
    gender: string;
    condition: string;
    location: string;
    service: string;
    date: string;
    time: string;
    bookedTime: string;
}

export interface LeadsTable {
    name: string;
    contact: string;
    email: string;
    date: string;
    time: string;
    page: string;
    remarks: string;
    isValid: boolean;
}



// Real time data 


export interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export interface DailySchedule {
  date: string;
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
}

export interface Schedule {
  doctor_id: string;
  start_year: string;
  days:string[]
  end_year: string;
  schedules: DailySchedule[];
}




  
  export interface getDoctor {
    _id?:string
    name: string;
    gender: string;
    doctor_id:string;
    main_speciality: string[];
    speciality:string[];
    department: Department;
    hospital:Hospital;
    email: string;
    phone_number: string;
    doctor_type: string[];
    age: number;
    region: RegionsType;
    experience:number;
    membership:string,
    meta_name: string;
    meta_tag: string[];
    meta_description: string;
    doctor_expert: string[];
    top_treatments: string[];
    bookingType:string,
    doctor_best_known: string[];
    doctor_image: string;
    home_doc_profile: string;
    like_cout:number;
    doctor_cover_image: string;
    doctor_experience: string[];
    registration: string;
    createdAt:string,
    price: number;
    about_doctor: string;
    doctor_video: string[];
    qualification: string[];
  }

  export interface RegionsType {
    _id?: string;
    region_name: string;
    region_image: string;
  };
  

  // Walkin Appointments

  interface Patient {
    _id?: string;
    name: string;
    age: number;
    gender: string;
    patient_id: string;
    phone_number: string;
    email_id: string;
    createdAt: string;
    updatedAt: string;
    otpforgotPassword: string;
  }
  
  export interface Regions {
    _id?: string;
    region_image: string;
    region_name: string;
    nearby_region:Regions
    createdAt?: string;
    updatedAt?: string;
  }
  
  interface Doctors {
    _id?: string;
    name: string;
    doctor_image: string;
    age: number;
    gender: string;
    doctor_id: string;
    speciality: string[];
    experience: number;
    email: string;
    phone_number: string;
    price: number;
    rating: number;
    department:Department;
  }

  

    
  interface HomeDoctors {
    _id?: string;
    name: string;
    doctor_image: string;
    age: number;
    gender: string;
    doctor_id: Doctor;
    speciality: string[];
    experience: number;
    hospital:Hospital;
    email: string;
    phone_number: string;
    price: number;
    rating: number;
    department:Department;
  }
  
  export interface Hospital {
    _id?: string;
    hospital_name: string;
    hospital_address: string;
    hospital_icon: string;
    region:Regions
  }
  
  export interface Appointment {
    _id?: string;
    patient_id: Patient;
    visit_id: string;
    booking_type: string;
    date: string;
    time: string;
    slot: string;
    region: Regions;
    doctor_id: Doctors;
    hospital_id: Hospital;
    disease: string;
    payment_status: boolean;
    price: number;
    createdAt: string;
    updatedAt: string;
  }



  export interface HomeAppointment {
    _id?: string;
    patient_id: Patient;
    visit_id: string;
    booking_type: string;
    date: string;
    time: string;
    slot: string;
    region: Regions;
    accepted_doctor: HomeDoctors;
    // hospital_id: Hospital;
    disease: string;
    payment_status: boolean;
    price: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface Department{
    _id?:string
    department_name :string
    department_description:string
  }


  export interface NearbyRegion {
    _id?:string,
    region_image: string;
    region_name: string;
    nearby_region:Regions
}

export interface DoctorPrice{
  _id?:string
  price:number
}


export interface  LoginUser{
  email_id:string,
  password:string
}




export interface ResetOTpPassword{
  email_id:string,
  otpforgotPassword:string
}


export interface ResetNewPassword{
  password:string,
  token:string
}