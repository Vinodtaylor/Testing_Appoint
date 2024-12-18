import { z } from "zod";

const scheduleSchema = z.object({
  startYear: z.string().nonempty("Start Year is required"),
  endYear: z.string().nonempty("End Year is required"),
  selectedDays: z.array(z.string()).nonempty("At least one day must be selected"),
  times: z.object({
    morningStart: z.string().nonempty("Morning Start Time is required"),
    morningEnd: z.string().nonempty("Morning End Time is required"),
    afternoonStart: z.string().nonempty("Afternoon Start Time is required"),
    afternoonEnd: z.string().nonempty("Afternoon End Time is required"),
    eveningStart: z.string().nonempty("Evening Start Time is required"),
    eveningEnd: z.string().nonempty("Evening End Time is required"),
  }),
});

export default scheduleSchema