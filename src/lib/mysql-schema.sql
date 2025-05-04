-- Schema for ZynkPrint application using MySQL

-- Drop database if exists (USE CAREFULLY!)
-- DROP DATABASE IF EXISTS dbprint;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dbprint;

-- Use the database
USE dbprint;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  job_type ENUM('offset', 'digital', 'large_format') NOT NULL,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  due_date DATE,
  job_details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Print Queue table
CREATE TABLE IF NOT EXISTS print_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  customer_id INT NOT NULL,
  status ENUM('queued', 'printing', 'completed', 'failed') NOT NULL DEFAULT 'queued',
  priority INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL DEFAULT NULL,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  operator_notes TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table (for admin/operators)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_username (username),
  UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert an admin user (password: admin123)
INSERT IGNORE INTO users (username, password_hash, display_name, email, role)
VALUES ('admin', '$2b$10$KNygMyLHtGgw.o.5xEDT4eNiVLBfEVxJ6ZQXTcqZmh3jdEpZkZKs2', 'Administrator', 'admin@example.com', 'admin');

-- Indexes for performance
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_due_date ON jobs(due_date);
CREATE INDEX idx_print_queue_job_id ON print_queue(job_id);
CREATE INDEX idx_print_queue_status ON print_queue(status);
CREATE INDEX idx_print_queue_priority_added ON print_queue(priority, added_at); 