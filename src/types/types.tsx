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
