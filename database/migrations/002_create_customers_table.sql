-- Migration: Create customers table
-- Created: 2025-10-05
<<<<<<< HEAD
-- Descriotion: Customer information with vehicle details

CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    car_name VARCHAR(100) NOT NULL,
    car_plate VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_customer_plate ON customers(car_plate);
=======
-- Description: Customer information with vehicle details

CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  car_name VARCHAR(100) NOT NULL,
  car_plate VARCHAR(20) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_email ON customers (email);
CREATE INDEX idx_customer_plate ON customers (car_plate);
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
