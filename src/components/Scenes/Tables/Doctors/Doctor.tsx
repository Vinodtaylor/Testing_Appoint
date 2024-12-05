"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/TableAlert";
import SelectDropDown from "../../Select/Select";
import EditDoctor from "../../Forms/DoctorDetails/EditDoctor";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const daysOfWeek: string[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
}

const tableHeader = [
  "SL NO", "Name", "ID", "Email", "Phone", "Experience", "Edit", "Schedule", "Delete"
];

const doctorsData: Doctor[] = [
  { id: 1, name: "Dr. John Doe", email: "johndoe@example.com", phone: "+1234567890", experience: 5 },
  { id: 2, name: "Dr. Jane Smith", email: "janesmith@example.com", phone: "+9876543210", experience: 10 },
  { id: 3, name: "Dr. Alice Johnson", email: "alicej@example.com", phone: "+1234509876", experience: 8 },
  { id: 4, name: "Dr. Robert Brown", email: "robertb@example.com", phone: "+2345678901", experience: 12 },
  { id: 5, name: "Dr. Emily Davis", email: "emilyd@example.com", phone: "+3456789012", experience: 7 },
  { id: 6, name: "Dr. Michael Wilson", email: "michaelw@example.com", phone: "+4567890123", experience: 15 },
  { id: 7, name: "Dr. Sarah Miller", email: "sarahm@example.com", phone: "+5678901234", experience: 9 },
  { id: 8, name: "Dr. David Taylor", email: "davidt@example.com", phone: "+6789012345", experience: 11 },
  { id: 9, name: "Dr. Linda Anderson", email: "lindaa@example.com", phone: "+7890123456", experience: 13 },
  { id: 10, name: "Dr. James Thomas", email: "jamest@example.com", phone: "+8901234567", experience: 6 },
  { id: 11, name: "Dr. Karen Martinez", email: "karenm@example.com", phone: "+9012345678", experience: 14 },
  { id: 12, name: "Dr. Charles Jackson", email: "charlesj@example.com", phone: "+1123456789", experience: 10 },
  { id: 13, name: "Dr. Patricia White", email: "patriciaw@example.com", phone: "+2123456789", experience: 8 },
  { id: 14, name: "Dr. Christopher Harris", email: "chrish@example.com", phone: "+3123456789", experience: 20 },
  { id: 15, name: "Dr. Nancy Martin", email: "nancym@example.com", phone: "+4123456789", experience: 7 },
  { id: 16, name: "Dr. Thomas Lee", email: "thomasl@example.com", phone: "+5123456789", experience: 18 },
  { id: 17, name: "Dr. Angela Walker", email: "angelaw@example.com", phone: "+6123456789", experience: 5 },
  { id: 18, name: "Dr. Richard Hall", email: "richardh@example.com", phone: "+7123456789", experience: 11 },
  { id: 19, name: "Dr. Barbara Young", email: "barbaray@example.com", phone: "+8123456789", experience: 9 },
  { id: 20, name: "Dr. Steven Allen", email: "stevena@example.com", phone: "+9123456789", experience: 10 },
  { id: 21, name: "Dr. Susan Hernandez", email: "susanh@example.com", phone: "+1023456789", experience: 6 },
  { id: 22, name: "Dr. Joseph King", email: "josephk@example.com", phone: "+2023456789", experience: 13 },
  { id: 23, name: "Dr. Lisa Wright", email: "lisaw@example.com", phone: "+3023456789", experience: 12 },
  { id: 24, name: "Dr. Brian Scott", email: "brians@example.com", phone: "+4023456789", experience: 8 },
  { id: 25, name: "Dr. Sandra Green", email: "sandrag@example.com", phone: "+5023456789", experience: 15 },
];

const Doctor: React.FC = () => {
  const [dropdownValues, setDropdownValues] = useState({
    startYear: '',
    EndYear: '',
    StartTime: '',
    EndTime: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleCheckboxChange = (day: string) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((d) => d !== day);
      } else {
        return [...prevSelectedDays, day];
      }
    });
  };

  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const openScheduleDialog = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setScheduleDialogOpen(true);
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const closeDialogs = () => {
    setEditDialogOpen(false);
    setScheduleDialogOpen(false);
    setDeleteDialogOpen(false);
    setCurrentDoctor(null);
  };

  const handleDelete = () => {
    if (currentDoctor) {
      console.log(editDialogOpen,deleteDialogOpen,scheduleDialogOpen)
      // Handle delete action here, e.g., API call to delete doctor
      console.log(`Deleting doctor: ${currentDoctor.name}`);
    }
    closeDialogs();
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader className="bg-blue-100">
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableHead
                className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2"
                key={index}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctorsData.map((doctor, index) => (
            <TableRow key={doctor.id} className="hover:bg-gray-50 text-center transition-all ease-in-out">
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{index + 1}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor.name}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor.id}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor.email}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor.phone}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor.experience}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">
                <EditDoctor />
              </TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button onClick={() => openScheduleDialog(doctor)}>
                      <Calendar size={20} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-full  max-h-full overflow-scroll  max-w-lg sm:max-w-xl lg:max-w-3xl rounded-lg ">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Schedule</AlertDialogTitle>
                    </AlertDialogHeader>

                    <form action="">
                      <div className="flex flex-col md:flex-row lg:flex-row  gap-8 mb-6">
                        <SelectDropDown
                          value={dropdownValues.startYear}
                          onChange={(value) => handleSelectChange('startYear', value)}
                          options={['Year 1', 'Year 2']}
                          icon={[<Calendar key="down" size={20}/>, <Calendar key="up" size={20} />]}
                          placeholder="Select Start year"
                          label="Start Year"
                          id="start-year"
                          inputClassName="outline-none    text-sm rounded-lg bg-transparent h-[48px] shadow-md"
                          containerClassName=" text-sm "
                          dropdownClassName="text-[#000000] bg-transparent"
                        />
                        <SelectDropDown
                          value={dropdownValues.EndYear}
                          onChange={(value) => handleSelectChange('EndYear', value)}
                          options={['Year 1', 'Year 2']}
                          icon={[<Calendar key="down"  size={20} />, <Calendar key="up"  size={20}/>]}
                          placeholder="Select End year"
                          label="End Year"
                          id="end-year"
                          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md"
                          containerClassName="  text-sm"
                          dropdownClassName="text-[#000000] bg-transparent"
                        />
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-2 text-sm ">Select Days</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={day}
                                checked={selectedDays.includes(day)}
                                onChange={() => handleCheckboxChange(day)}
                                className="form-checkbox"
                              />
                              <label htmlFor={day} className="text-sm">
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row lg:flex-row gap-8">
                        <SelectDropDown
                          value={dropdownValues.StartTime}
                          onChange={(value) => handleSelectChange('StartTime', value)}
                          options={['Slot 1', 'Slot 2','Slot 3','Slot 4']}
                          placeholder="Select Start time"
                          label="Start time"
                          icon={[<Clock key="up"  size={20} />, <Clock key="down"   size={20}/>]}
                          id="start-time"
                          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md"
                          containerClassName="w-full text-sm"
                          dropdownClassName="text-[#000000] bg-transparent"
                        />
                        <SelectDropDown
                          value={dropdownValues.EndTime}
                          onChange={(value) => handleSelectChange('EndTime', value)}
                          options={['Slot 1', 'Slot 2','Slot 3','Slot 4']}
                          placeholder="Select EndTime"
                          label="End Time"
                          icon={[<Clock key="up"  size={20} />, <Clock key="down"  size={20} />]}
                          id="end-time"
                          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md"
                          containerClassName="w-full text-sm"
                          dropdownClassName="text-[#000000] bg-transparent"
                        />
                      </div>
                    </form>

                    <AlertDialogFooter className="">
                      <div className="flex items-center gap-4">
                      <AlertDialogCancel onClick={closeDialogs} className="w-full rounded-full">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className=" rounded-full w-full bg-blue-500"
                        onClick={() => {
                          closeDialogs();
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                      </div>
                      
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button onClick={() => openDeleteDialog(doctor)} className="text-red-500">
                      <Trash size={20} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-full   max-w-lg sm:max-w-xl lg:max-w-3xl rounded-lg ">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this data
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>

                      <div className="flex gap-4 items-center">
                      <AlertDialogCancel onClick={closeDialogs} className="w-full rounded-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-blue-500 w-full rounded-full"
                      >
                        Delete
                      </AlertDialogAction>
                      </div>
              
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Doctor;
