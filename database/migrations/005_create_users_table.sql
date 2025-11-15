CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin account (password: admin123)
-- NOTE: In production, use bcrypt hashed passwords!
INSERT INTO users (email, password, name, role) VALUES
('admin@tracksidegarage.com', 'admin123', 'Admin User', 'admin'),
('client@example.com', 'client123', 'Test Client', 'client');