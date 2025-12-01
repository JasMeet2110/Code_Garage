USE code_garage_db;

CREATE TABLE IF NOT EXISTS shifts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  role_assigned VARCHAR(50) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_shift_date (start_time),
  INDEX idx_employee_shifts (employee_id, start_time)
);