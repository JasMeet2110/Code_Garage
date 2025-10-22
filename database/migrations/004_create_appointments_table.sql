-- Migration: Create unified appointments table
-- Created: 2025-10-21
-- Description: Appointments data from client booking form and admin management

CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,                 
  service_type VARCHAR(255) NOT NULL,         
  car_make VARCHAR(100) NOT NULL,
  car_model VARCHAR(100) NOT NULL,
  car_year VARCHAR(10) NOT NULL,
  plate_number VARCHAR(20) NOT NULL,
  fuel_type VARCHAR(50),
  appointment_date DATETIME NOT NULL,
  slot VARCHAR(50),                           
  message TEXT,                                
  request_towing BOOLEAN DEFAULT FALSE,        
  status ENUM('Pending','In Progress','Completed','Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointment_date ON appointments(appointment_date);
