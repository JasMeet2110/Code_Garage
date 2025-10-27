-- Migration: Create inventory table
-- Created: 2025-10-05
<<<<<<< HEAD
-- Description: PArts inventory management

CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (quantity >=0),
    CHECK (price >=0)

);

CREATE INDEX idx_inventory_part_number ON inventory(part_number);
=======
-- Description: Parts inventory management

CREATE TABLE IF NOT EXISTS inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  part_number VARCHAR(50) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_part_number ON inventory (part_number);
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
