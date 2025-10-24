-- Migration: Create unified appointments table
-- Updated: 2025-10-23
-- Description: Unified appointments table for client and admin CRUD with customer, vehicle, and appointment details

CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,

  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,

  -- Vehicle Information
  service_type VARCHAR(255) NOT NULL,
  fuel_type VARCHAR(50),
  car_make VARCHAR(100) NOT NULL,
  car_model VARCHAR(100) NOT NULL,
  car_year VARCHAR(10) NOT NULL,
  plate_number VARCHAR(20) NOT NULL,

  -- Appointment Details
  appointment_date DATE NOT NULL,
  description TEXT NOT NULL,

  -- Status Tracking
  status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  completed_at DATETIME NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointment_date ON appointments (appointment_date);
