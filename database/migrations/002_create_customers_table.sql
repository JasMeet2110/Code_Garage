-- Migration: Create customers table (final aligned version)
-- Created: 2025-10-24
-- Description: Customer information with vehicle details and profile tracking

CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  car_name VARCHAR(100) DEFAULT NULL,
  car_plate VARCHAR(20) DEFAULT NULL,
  year INT DEFAULT NULL,
  color VARCHAR(50) DEFAULT NULL,
  car_image VARCHAR(255) DEFAULT NULL,
  start_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_email ON customers (email);
CREATE INDEX idx_customer_plate ON customers (car_plate);
