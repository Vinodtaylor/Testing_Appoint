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
import { CreateSchedule, DeleteDoctor,GetSchedulebydoctor,UpdateSchedule } from "@/routes/routes";
import moment from 'moment'
import {  getDoctor, Schedule } from "@/types/types";
import Modal from "../../Modal/Modal";
import { useModal } from "@/hooks/useModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SelectDropDown from "../../Select/Select";
import { generateTimeSlotsForPeriod } from "@/utilis/slots";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog"



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
 
  setDoctors: React.Dispatch<React.SetStateAction<getDoctor[]>>;
}


type Period = "morning" | "afternoon" | "evening";

interface Times {
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  eveningStart: string;
  eveningEnd: string;
}

const Doctor: React.FC<DoctorProps> = ({
  doctors,
 
  setDoctors,
 
}) => {
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isScheduleOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [currentDoctor, setCurrentDoctor] = useState<getDoctor | null>(null);
  const [dropdownValues, setDropdownValues] = useState({
    startYear: "",
    endYear: "",
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<Times>({
    morningStart: "",
    morningEnd: "",
    afternoonStart: "",
    afternoonEnd: "",
    eveningStart: "",
    eveningEnd: "",
  });


  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);



  const currentDoctors = doctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  const onNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const onPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };


  const openDeleteDialog = (doctor: getDoctor) => {
    setCurrentDoctor(doctor);
    openDeleteModal();
  };

  // const openScheduleDialog = (doctor: getDoctor) => {
  //   setCurrentDoctor(doctor);
  //   openScheduleModal();
  // };


  const openScheduleDialog = async (doctor: getDoctor) => {
    setCurrentDoctor(doctor);

    try {
        // Fetch schedule data for the doctor
        const res = await GetSchedulebydoctor(doctor._id!);
        const scheduleData = res.data[0]; // Get the first schedule data from the response

        if (scheduleData && scheduleData.schedules.length > 0) {
            setIsEditMode(true); // Set to edit mode only if schedule data exists

            // Log each part of the data that will populate the form
            console.log("Start Year:", scheduleData.start_year);
            console.log("End Year:", scheduleData.end_year);
            console.log("Days of the week:", scheduleData.days);
            console.log("Morning Schedule:", scheduleData.schedules[0].morning);
            console.log("Afternoon Schedule:", scheduleData.schedules[0].afternoon);
            console.log("Evening Schedule:", scheduleData.schedules[0].evening);

            // Prepopulate the form with existing schedule data
            setDropdownValues({
                startYear: scheduleData.start_year || "",
                endYear: scheduleData.end_year || "",
            });

            setSelectedDays(scheduleData.days || []);

            // Prepopulate times for morning, afternoon, and evening
            const morningSchedule = scheduleData.schedules[0].morning;
            const afternoonSchedule = scheduleData.schedules[0].afternoon;
            const eveningSchedule = scheduleData.schedules[0].evening;

            setTimes({
                morningStart: morningSchedule[0]?.time || "",
                morningEnd: morningSchedule[morningSchedule.length - 1]?.time || "",
                afternoonStart: afternoonSchedule[0]?.time || "",
                afternoonEnd: afternoonSchedule[afternoonSchedule.length - 1]?.time || "",
                eveningStart: eveningSchedule[0]?.time || "",
                eveningEnd: eveningSchedule[eveningSchedule.length - 1]?.time || "",
            });
        } else {
            setIsEditMode(false); // Set to non-edit mode if there's no schedule data
        }
    } catch (error) {
        console.error("Error fetching schedule:", error);
    }

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
        await DeleteDoctor(currentDoctor._id!);
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

  const handleTimeChange = (period: Period, timeType: string, value: string) => {
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
        doctor_id: currentDoctor._id!,
        start_year: dropdownValues.startYear,
        end_year: dropdownValues.endYear,
        days: selectedDays,
        schedules: allDates.map((date) => ({
            date,
            morning: morningSlots,
            afternoon: afternoonSlots,
            evening: eveningSlots,
        })),
    };

    console.log("Generated Schedule Data:", scheduleData);

    try {
        if (isEditMode) {
            // If it's in edit mode, fetch the existing schedule and update
            const existingSchedule = await GetSchedulebydoctor(currentDoctor._id!);


            
            if (existingSchedule.data.length > 0) {
                const existingScheduleData = existingSchedule.data[0]; // Assuming you are updating the first schedule
                
                const scheduleId=existingScheduleData._id

                console.log(scheduleId,"current schedule object id")

                // You can now use the existing data to pass into the update
                const updatedScheduleData = {
                    ...existingScheduleData, // Keep the existing data
                    start_year: dropdownValues.startYear, // Update with new values
                    end_year: dropdownValues.endYear,
                    days: selectedDays,
                    schedules: allDates.map((date) => ({
                        date,
                        morning: morningSlots,
                        afternoon: afternoonSlots,
                        evening: eveningSlots,
                    })),
                };

                console.log("Existing Schedule Data to Update:", updatedScheduleData);

                // Update the schedule with existing data
                const updateRes = await UpdateSchedule(scheduleId!, updatedScheduleData);
                console.log("Schedule updated successfully:", updateRes.data);
            } else {
                console.log("No existing schedule found for this doctor.");
            }
        } else {
            // If it's in create mode, create a new schedule
            console.log("Creating new schedule...");
            const createRes = await CreateSchedule(scheduleData);
            console.log("Schedule created successfully:", createRes.data);
        }

        console.log("Secondary update completed.");

    } catch (error) {
        console.error("Error processing schedule:", error);
    }

    // Close modal and reset form
    closeDialogs();
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
  {currentDoctors?.length === 0 ? (
    <TableRow>
                        <TableCell colSpan={8} className="px-3 py-2  text-gray-900 text-sm text-center p-5">
                            <h3 className="text-base">No Doctors found</h3> 
                        </TableCell>
                      </TableRow>
  ) : (
    currentDoctors?.map((doctor,index) => (
      <TableRow key={index} className="hover:bg-gray-50 text-center transition-all ease-in-out">
        <TableCell className="px-3 py-2 text-gray-900 text-sm">    {(currentPage - 1) * doctorsPerPage + (index + 1)}        </TableCell>
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
    
    {currentDoctors.length > 0 &&  (
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
      <Modal isOpen={isScheduleOpen} onClose={closeDialogs} title={isEditMode ? "Edit Schedule" : "Create Schedule"}>
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
          value={times[`${period.toLowerCase()}Start` as  `${Period}Start`] }
          onChange={(value) => handleTimeChange(period.toLowerCase() as Period, "Start", value)}
          placeholder={`Select Start Time`}
          inputClassName="outline-none text-sm rounded-lg bg-transparent h-[48px] shadow-md border-gray-300 focus:ring-2 focus:ring-blue-500"
          containerClassName="w-full"
          dropdownClassName="text-gray-700 bg-white"
        />
        <SelectDropDown
          id="end_time"
          options={timeOptions}
          value={times[`${period.toLowerCase()}End` as `${Period}End`]}
          onChange={(value) => handleTimeChange(period.toLowerCase() as Period, "End", value)}
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
          {isEditMode ? "Save Changes" : "Confirm"}
          </button>
            </div>
          </div>
        </form>
      </Modal>

      


      <AlertDialog open={isDeleteOpen } onOpenChange={closeDialogs}>
              
                  <AlertDialogContent className='lg:w-full max-w-sm rounded-lg'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you asolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this data
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full  border-blue-600  text-black hover:text-white hover:bg-blue-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction
    type="submit"
    onClick={handleDelete}
    className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
  >
    Delete
  </AlertDialogAction>

                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
    </div>
  );
};

export default Doctor;
