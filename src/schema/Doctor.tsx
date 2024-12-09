import { z } from "zod";

const QualificationSchema = z.object({
  degree: z.string().nonempty("Degree is required"),
  year: z.number().min(1900, "Year must be after 1900").max(new Date().getFullYear(), "Year can't be in the future"),
});

const DoctorSchema = z.object({
  name: z.string().nonempty("Name is required"),
  gender: z.string().nonempty("Gender is required"),
  speciality: z.array(z.string().nonempty("Speciality cannot be empty")),
  experience: z.number().min(0, "Experience must be non-negative"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().nonempty("Phone number is required"),
  isDoctorVisit: z.boolean(),
  isWalkin: z.boolean(),
  age: z.number().min(0, "Age must be non-negative"),
  region: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    doctorCount: z.number(),
  }),
  meta_name: z.string().nonempty("Meta name is required"),
  meta_tag: z.array(z.string().nonempty("Meta tag cannot be empty")),
  meta_description: z.string().nonempty("Meta description is required"),
  doctor_expert: z.array(z.string()),
  top_treatments: z.array(z.string()),
  doctor_best_known: z.array(z.string()),
  doctor_image: z.string(),
  doctor_cover_image: z.string(),
  doctor_experience: z.string(),
  registration: z.string(),
  price: z.number().min(0, "Price must be non-negative"),
  about_doctor: z.string(),
  doctor_video: z.array(z.string()),
  qualification: z.array(QualificationSchema),
});





export default DoctorSchema


export type DoctorFormValues = z.infer<typeof DoctorSchema>;
