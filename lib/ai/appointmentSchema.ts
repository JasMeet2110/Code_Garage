import { z } from "zod";

export const appointmentSchema = z.object({
  customer_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),

  service_type: z.string().min(1),
  fuel_type: z.string().optional(),

  car_make: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.string().min(2),
  plate_number: z.string().min(3),

  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().min(1),
  description: z.string().min(5),

  status: z
    .enum(["Pending", "In Progress", "Completed", "Cancelled"])
    .optional(),
  completed_at: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;
