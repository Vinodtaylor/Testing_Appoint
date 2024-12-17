import { z } from "zod";

const DoctorSchema = z.object({
  email: z.string().email("Enter Valid  email").nonempty("Email is required"),
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Enter Valid Number")
    .nonempty("Phone number is required"),
  
  // All other fields are optional
  name: z.string().optional(),
  gender: z.string().optional(),
  main_speciality: z.array(z.string().nonempty("Speciality cannot be empty")).optional(),
  speciality: z.array(z.string().nonempty("Speciality cannot be empty")).optional(),
  department: z.string().optional(),
  experience: z.preprocess(
    (value) => parseFloat(value as string), 
    z.number().min(0, "Experience must be a positive number").default(0)
  ).optional(),
  doctor_type: z.array(z.string()).optional(),
  age: z.preprocess(
    (value) => {
      if (value === "") return undefined; 
      return Number(value);
    },
    z.number().min(0, "Age must be non-negative").optional() // Age remains optional
  ),
    region: z.string().optional(),
  meta_name: z.string().optional(),
  meta_tag: z.array(z.string().optional()).optional(),
  meta_description: z.string().optional(),
  doctor_expert: z.array(z.string()).optional(),
  top_treatments: z.array(z.string()).optional(),
  doctor_best_known: z.array(z.string()).optional(),
  membership: z.string().optional(),
  doctor_image: z.string().url().optional(),
  hospital: z.string().optional(),
  doctor_cover_image: z.string().url().optional(),
  doctor_experience: z.array(z.string()).optional(),
  registration: z.string().optional(),
  price: z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() === "") return 0; // Handle empty string as default
      return parseFloat(value as string);
    },
    z.number().min(0, "Price must be a positive number")
  ),
  
  about_doctor: z.string().optional(),
  doctor_video: z.array(z.string()).optional(),
  qualification: z.array(z.string()).optional(),
});

export default DoctorSchema;

export type CreateDoctorData = z.infer<typeof DoctorSchema>;

export interface Region {
  id: string;
}
