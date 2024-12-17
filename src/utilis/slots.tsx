"use client"


// // Utility function: Convert time string to total minutes


// // React hook: Generate schedules dynamically with user-defined periods
// export const useGenerateSchedule = (
//   doctor_id: string,
//   startDate: Date,
//   endDate: Date,
//   days: string[],
//   morningStartTime: string,
//   morningEndTime: string,
//   afternoonStartTime: string,
//   afternoonEndTime: string,
//   eveningStartTime: string,
//   eveningEndTime: string,
//   gap: number = 20
// ): Schedule => {
//   // Memoized function to generate time slots for a given period


//   // Check if a date is within the specified days
//   const isDateInDays = (date: Date, days: string[]): boolean => {
//     const dayOfWeek = date.getDay();
//     const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     return days.includes(dayNames[dayOfWeek]);
//   };

//   // Memoized calculation of schedules
//   const dailySchedules = useMemo(() => {
//     const schedules: DailySchedule[] = [];
//     const currentDate = new Date(startDate);
//     const end = new Date(endDate);

//     while (currentDate <= end) {
//       if (isDateInDays(currentDate, days)) {
//         const morningSlots = generateTimeSlotsForPeriod(morningStartTime, morningEndTime, gap);
//         const afternoonSlots = generateTimeSlotsForPeriod(afternoonStartTime, afternoonEndTime, gap);
//         const eveningSlots = generateTimeSlotsForPeriod(eveningStartTime, eveningEndTime, gap);

//         const dailySchedule: DailySchedule = {
//           date: currentDate.toLocaleDateString('en-US'),
//           morning: morningSlots,
//           afternoon: afternoonSlots,
//           evening: eveningSlots,
//         };

//         schedules.push(dailySchedule);
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     return schedules;
//   }, [startDate, endDate, days, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, eveningStartTime, eveningEndTime, gap]);

//   // Return the final schedule object, also memoized
//   return useMemo(
//     () => ({
//       doctor_id,
//       start_year: startDate.getFullYear().toString(),
//       end_year: endDate.getFullYear().toString(),
//       schedules: dailySchedules,
//     }),
//     [doctor_id, startDate, endDate, dailySchedules]
//   );
// };


function convertTimeStringToMinutes(timeString: string): number {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  const adjustedHours =
    period === 'PM' && hours !== 12
      ? hours + 12
      : period === 'AM' && hours === 12
      ? 0
      : hours;
  return adjustedHours * 60 + minutes;
}

// Utility function: Convert total minutes back to a 12-hour formatted time string
function convertMinutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${adjustedHours}:${mins < 10 ? '0' : ''}${mins} ${period}`;
}



export  const generateTimeSlotsForPeriod = (start: string, end: string, gap: number) => {
    const timeSlots = [];
    let currentTime = convertTimeStringToMinutes(start);
    const endTime = convertTimeStringToMinutes(end);

    while (currentTime < endTime) {
      timeSlots.push({ time: convertMinutesToTimeString(currentTime), isBooked: false });
      currentTime += gap;
    }

    return timeSlots;
  };