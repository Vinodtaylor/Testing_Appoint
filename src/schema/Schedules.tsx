import { z } from "zod";

const scheduleSchema = z.object({
  startYear: z.string().nonempty("Start year is required"),
  endYear: z.string().nonempty("End year is required"),
  selectedDays: z.array(z.string()).min(1, "At least one day must be selected"),
  times: z.object({
    morningStart: z.string().nonempty("Morning start time is required"),
    morningEnd: z.string().nonempty("Morning end time is required"),
    afternoonStart: z.string().optional(),
    afternoonEnd: z.string().optional(),
    eveningStart: z.string().optional(),
    eveningEnd: z.string().optional(),
  }),
});


export default scheduleSchema