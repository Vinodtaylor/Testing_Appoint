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
import { Calendar, Trash } from "lucide-react";
import EditDoctor from "../../Forms/DoctorDetails/EditDoctor";
import { CreateSchedule, DeleteDoctor } from "@/routes/routes";
import moment from 'moment'
import {  getDoctor, Schedule } from "@/types/types";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SelectDropDown from "../../Select/Select";
import { generateTimeSlotsForPeriod } from "@/utilis/slots";




export const getDynamicYears = (endYear = new Date().getFullYear(), range = 20) => {
  return Array.from({ length: range + 1 }, (_, index) => (endYear - index).toString());
};




const tableHeader = [
  "SL NO",
  "Name",
  "ID",
  "Email",
  "Phone",
  "Experience",
  "Schedule",
  "Edit",
  "Delete",
];

interface DoctorProps {
  doctors: getDoctor[];
  currentPage: number;
  totalPages: number;
  setDoctors: React.Dispatch<React.SetStateAction<getDoctor[]>>;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Doctor: React.FC<DoctorProps> = ({
  doctors,
  currentPage,
  totalPages,
  setDoctors,
  onPrevPage,
  onNextPage,
}) => {
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isScheduleOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();

  const [currentDoctor, setCurrentDoctor] = useState<getDoctor | null>(null);
  const [dropdownValues, setDropdownValues] = useState({
    startYear: "",
    endYear: "",
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState({
    morningStart: "",
    morningEnd: "",
    afternoonStart: "",
    afternoonEnd: "",
    eveningStart: "",
    eveningEnd: "",
  });


  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];



  const openDeleteDialog = (doctor: getDoctor) => {
    setCurrentDoctor(doctor);
    openDeleteModal();
  };

  const openScheduleDialog = (doctor: getDoctor) => {
    setCurrentDoctor(doctor);
    openScheduleModal();
  };

  const closeDialogs = () => {
    closeDeleteModal();
    closeScheduleModal();
    setDropdownValues({
      startYear: "",
      endYear: "",
    });
    setSelectedDays([]); // Clear selected days
    setTimes({
      morningStart: "",
      morningEnd: "",
      afternoonStart: "",
      afternoonEnd: "",
      eveningStart: "",
      eveningEnd: "",
    }); // Reset time slots
    setCurrentDoctor(null); // Clear the current doctor data
  };

  const handleDelete = async () => {
    if (currentDoctor) {
      try {
        await DeleteDoctor(currentDoctor._id);
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor._id !== currentDoctor._id)
        );
        console.log(`Deleted doctor: ${currentDoctor.name}`);
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
    closeDialogs();
  };

  const handleSelectChange = (field: string, value: string) => {
    setDropdownValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (period: string, timeType: string, value: string) => {
    setTimes((prev) => ({
      ...prev,
      [`${period}${timeType}`]: value,
    }));
  };



  const generateTimeSlots = (startTime: string, endTime: string, intervalMinutes: number) => {
    // Convert start and end times to Date objects for comparison
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
  
    // If start time is later than end time, return an empty array
    if (start >= end) {
      console.error("Start time must be earlier than end time.");
      return [];
    }
  
    const timeSlots = [];
    let currentTime = start;
  
    // Generate time slots at specified intervals
    while (currentTime < end) {
      const timeString = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      timeSlots.push({ time: timeString, isBooked: false });
  
      // Increment by the specified interval
      currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
    }
  
    return timeSlots;
  };
  




  const generateDatesForYear = (year: number, selectedDays: string[]) => {
    const dates = [];
    const startDate = moment(`${year}-01-01`); // Start on January 1st
    const endDate = moment(`${year}-12-31`);  // End on December 31st
    
    while (startDate.isSameOrBefore(endDate)) {
      const dayOfWeek = startDate.format("dddd"); // Get the day of the week (e.g., "Monday")
      if (selectedDays.includes(dayOfWeek)) {
        dates.push(startDate.format("DD/MM/YYYY"));
      }
      startDate.add(1, "day");
    }
    
    return dates;
  };
  
  




  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate required fields
    if (!currentDoctor || !dropdownValues.startYear || !dropdownValues.endYear) {
      console.error("Missing required form data.");
      return;
    }
  
    // Generate time slots for morning, afternoon, and evening
    const morningSlots = generateTimeSlotsForPeriod(times.morningStart, times.morningEnd, 20);
    const afternoonSlots = generateTimeSlotsForPeriod(times.afternoonStart, times.afternoonEnd, 20);
    const eveningSlots = generateTimeSlotsForPeriod(times.eveningStart, times.eveningEnd, 20);
  
    // Validate generated time slots
    if (morningSlots.length === 0 || afternoonSlots.length === 0 || eveningSlots.length === 0) {
      console.error("Invalid time slots.");
      return;
    }
  
    // Get all dates for the selected year range and filter by selected days
    const startYear = parseInt(dropdownValues.startYear, 10);
    const endYear = parseInt(dropdownValues.endYear, 10);
    let allDates: string[] = [];
  
    for (let year = startYear; year <= endYear; year++) {
      allDates = allDates.concat(generateDatesForYear(year, selectedDays));
    }
  
    // Create schedule data for each date
    const scheduleData: Schedule = {
      doctor_id: currentDoctor._id,
      start_year: dropdownValues.startYear,
      end_year: dropdownValues.endYear,
      days: selectedDays, // Include selected days here
      schedules: allDates.map((date) => ({
        date,
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      })),
    };
  
    console.log("Generated Schedule Data:", scheduleData);
  
    // Submit the schedule
    try {
      const res = await CreateSchedule(scheduleData);

      console.log("Schedule created successfully:", res.data);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  
    closeDialogs(); // Close modal and reset form
  };
  



  const morningTimes = generateTimeSlots("08:00:00", "12:00:00", 20);
  const afternoonTimes = generateTimeSlots("12:00:00", "16:00:00", 20);
  const eveningTimes = generateTimeSlots("16:00:00", "20:00:00", 20);


  





  const yearOptions = getDynamicYears(new Date().getFullYear(), 20);


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
  {doctors?.length === 0 ? (
    <TableRow>
                        <TableCell colSpan={8} className="px-3 py-2 translate-x-[400px] text-gray-900 text-sm text-center p-5">
                            <h3 className="text-base">No Doctors found</h3> 
                        </TableCell>
                      </TableRow>
  ) : (
    doctors?.map((doctor, index) => (
      <TableRow key={index} className="hover:bg-gray-50 text-center transition-all ease-in-out">
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{index + 1}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor?.name}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor?.doctor_id}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor?.email}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor?.phone_number}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">{doctor?.experience}</TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">
          <button onClick={() => openScheduleDialog(doctor)}>
            <Calendar size={20} />
          </button>
        </TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">
          <EditDoctor doctor={doctor} />
        </TableCell>
        <TableCell className="px-3 py-2 text-gray-900 text-sm">
          <button onClick={() => openDeleteDialog(doctor)} className="text-red-500">
            <Trash size={20} />
          </button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

      </Table>

      {/* Pagination */}
    {/* Pagination */}
{doctors.length > 6 && (
  <div className="flex mb-8 justify-center gap-4 items-center mt-4">
    <button
      onClick={onPrevPage}
      disabled={currentPage === 1}
      className={`p-2 text-sm rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white`}
    >
      <IoIosArrowBack />
    </button>
    <p className="text-sm">
      Page {currentPage} of {totalPages}
    </p>
    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className={`p-2 text-sm rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white`}
    >
      <IoIosArrowForward />
    </button>
  </div>
)}


      {/* Modal for Schedule */}
      <Modal isOpen={isScheduleOpen} onClose={closeDialogs} title="Create Schedule">
        <form onSubmit={handleScheduleSubmit}>
          <div className="w-full bg-white rounded-lg p-6">
            <h3 className="text-center text-2xl font-semibold text-gray-800 mb-6">Schedule</h3>

            {/* Year Selection */}
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <SelectDropDown
                id="start_year"

                value={dropdownValues.startYear}
                onChange={(value) => handleSelectChange("startYear", value)}
                options={yearOptions}
                placeholder="Select Start Year"
                label="Start Year"
                inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                containerClassName="w-full"
                dropdownClassName="text-gray-700 bg-white"
      
              />
              <SelectDropDown
              id="end_year"
                value={dropdownValues.endYear}
                onChange={(value) => handleSelectChange("endYear", value)}
                options={yearOptions}
                placeholder="Select End Year"
                label="End Year"
                inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                containerClassName="w-full"
                dropdownClassName="text-gray-700 bg-white"

              />
            </div>

            {/* Days of the Week */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Days</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={day}
                      checked={selectedDays.includes(day)}
                      onChange={() => handleCheckboxChange(day)}
                    />
                    <label htmlFor={day} className="text-gray-700 text-sm">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {["Morning", "Afternoon", "Evening"].map((period) => {
  let timeOptions: string[] = [];

  if (period === "Morning") {
    timeOptions = morningTimes.map(slot => slot.time); // Extract only the time string
  }
  if (period === "Afternoon") {
    timeOptions = afternoonTimes.map(slot => slot.time); // Extract only the time string
  }
  if (period === "Evening") {
    timeOptions = eveningTimes.map(slot => slot.time); // Extract only the time string
  }

  return (
    <div key={period} className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{period}</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <SelectDropDown
          id="start_time"
          options={timeOptions}
          value={times[`${period.toLowerCase()}Start`]}
          onChange={(value) => handleTimeChange(period.toLowerCase(), "Start", value)}
          placeholder={`Select Start Time`}
          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
          containerClassName="w-full"
          dropdownClassName="text-gray-700 bg-white"
        />
        <SelectDropDown
          id="end_time"
          options={timeOptions}
          value={times[`${period.toLowerCase()}End`]}
          onChange={(value) => handleTimeChange(period.toLowerCase(), "End", value)}
          placeholder={`Select End Time`}
          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
          containerClassName="w-full"
          dropdownClassName="text-gray-700 bg-white"
        />
      </div>
    </div>
  );
})}


            {/* Buttons */}
            <div className="flex gap-4 items-center mt-8">
              <button
                type="button"
                onClick={closeDialogs}
                className="w-full p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal for Delete */}
      <Modal isOpen={isDeleteOpen} onClose={closeDialogs} title="Delete Doctor">
        <div className="flex flex-col justify-center items-center w-full rounded-lg bg-white p-6">
          <h3 className="text-center text-xl font-semibold text-gray-800 mb-2">Are you sure?</h3>
          <p className="text-center text-sm text-gray-600 mb-6">
            This action cannot be undone. This will permanently delete the doctor record.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={closeDialogs}
              className="w-full rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="w-full p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Doctor;
