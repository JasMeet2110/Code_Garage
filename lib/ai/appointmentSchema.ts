import { z } from "zod";

export const appointmentSchema = z.object({
  customer_name: z.string().min(1),
  email: z.string().email(),

  // OPTIONAL CONTACT INFO
  phone: z.string().min(5).optional().nullable(),

  // OPTIONAL VEHICLE INFO
  car_make: z.string().optional().nullable(),
  car_model: z.string().optional().nullable(),
  car_year: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  fuel_type: z.string().optional().nullable(),

  // OPTIONAL APPOINTMENT INFO (AI may not create full appointment)
  service_type: z.string().optional().nullable(),
  appointment_date: z.string().optional().nullable(),
  appointment_time: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  // SYSTEM FIELDS
  status: z
    .enum(["Pending", "In Progress", "Completed", "Cancelled"])
    .optional(),
  completed_at: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;
