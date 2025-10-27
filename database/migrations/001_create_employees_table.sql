-- Migration: Create employees table
-- Created: 2025-10-05
-- Description: Initial employees table with basic employee information

CREATE TABLE IF NOT EXISTS employees (
<<<<<<< HEAD
  id INT  PRIMARY KEY AUTO_INCREMENT,
=======
  id INT PRIMARY KEY AUTO_INCREMENT,
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  salary DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

<<<<<<< HEAD
CREATE INDEX idx_employee_email ON employees(email);
=======
-- Index (ignore duplicate key warning on re-runs)
CREATE INDEX idx_employee_email ON employees (email);
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
