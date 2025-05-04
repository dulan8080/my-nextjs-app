-- Offset Print Jobs Schema
-- This schema defines tables related to offset printing jobs

-- Main offset_print_jobs table
CREATE TABLE IF NOT EXISTS offset_print_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  customer_id INT NOT NULL,
  job_number VARCHAR(50),
  job_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  delivery_date DATETIME NOT NULL,
  notes TEXT,
  
  -- Paper Supply Information
  paper_supply_by_customer BOOLEAN NOT NULL DEFAULT FALSE,
  paper_cutting_by_customer BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Paper Type Information
  paper_type VARCHAR(100),
  paper_size VARCHAR(100),
  paper_weight VARCHAR(50),
  paper_finish VARCHAR(50),
  paper_grain VARCHAR(50),
  
  -- Job Status and Timestamps
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Selected Colors for the job
CREATE TABLE IF NOT EXISTS offset_job_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  color_name VARCHAR(50) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  custom_color_value VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Paper Items for the job
CREATE TABLE IF NOT EXISTS offset_job_paper_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  qty INT NOT NULL,
  cut_size VARCHAR(100),
  cut_per_sheet INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Printing Methods for the job
CREATE TABLE IF NOT EXISTS offset_job_printing_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  paper_size VARCHAR(100),
  qty INT,
  printing_system VARCHAR(100),
  impression_value1 INT,
  impression_value2 INT,
  impression_result INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Laminating Details for the job
CREATE TABLE IF NOT EXISTS offset_job_laminating (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  type ENUM('glossy', 'matt', 'none') NOT NULL DEFAULT 'none',
  height INT,
  width INT,
  qty INT,
  unit_price DECIMAL(10, 2),
  result DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Die Cut Details for the job
CREATE TABLE IF NOT EXISTS offset_job_die_cut (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  new_cutter BOOLEAN DEFAULT FALSE,
  old_cutter BOOLEAN DEFAULT FALSE,
  creasing BOOLEAN DEFAULT FALSE,
  perforating BOOLEAN DEFAULT FALSE,
  embossing BOOLEAN DEFAULT FALSE,
  debossing BOOLEAN DEFAULT FALSE,
  impression_qty INT,
  impression_unit_price DECIMAL(10, 2),
  impression_result DECIMAL(10, 2),
  manual_override DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bill Book Details for the job
CREATE TABLE IF NOT EXISTS offset_job_bill_books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  number_of_papers INT NOT NULL DEFAULT 1,
  bill_numbers VARCHAR(100),
  book_numbers VARCHAR(100),
  sets INT,
  qty INT,
  unit_price DECIMAL(10, 2),
  result DECIMAL(10, 2),
  gathering_selected BOOLEAN DEFAULT FALSE,
  gathering_qty INT,
  gathering_unit_price DECIMAL(10, 2),
  gathering_result DECIMAL(10, 2),
  binding_selected BOOLEAN DEFAULT FALSE,
  binding_type ENUM('topPad', 'sidePad', 'sideBinding', 'topBinding'),
  binding_template VARCHAR(100),
  binding_qty INT,
  binding_unit_price DECIMAL(10, 2),
  binding_result DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bill Book Papers for the job
CREATE TABLE IF NOT EXISTS offset_job_bill_book_papers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_book_id INT NOT NULL,
  paper_index INT NOT NULL,
  paper_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_book_id) REFERENCES offset_job_bill_books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bill Book Paper Colors
CREATE TABLE IF NOT EXISTS offset_job_bill_book_paper_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_book_paper_id INT NOT NULL,
  color_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_book_paper_id) REFERENCES offset_job_bill_book_papers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Material Supply Details for the job
CREATE TABLE IF NOT EXISTS offset_job_material_supply (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offset_job_id INT NOT NULL,
  default_supplier ENUM('customer', 'supplier') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offset_job_id) REFERENCES offset_print_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Material Supply Items for the job
CREATE TABLE IF NOT EXISTS offset_job_material_supply_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_supply_id INT NOT NULL,
  material_name VARCHAR(50) NOT NULL,
  supplier ENUM('customer', 'supplier') NOT NULL DEFAULT 'customer',
  supplier_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_supply_id) REFERENCES offset_job_material_supply(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for performance
CREATE INDEX idx_offset_job_customer_id ON offset_print_jobs(customer_id);
CREATE INDEX idx_offset_job_job_id ON offset_print_jobs(job_id);
CREATE INDEX idx_offset_job_delivery_date ON offset_print_jobs(delivery_date);
CREATE INDEX idx_offset_job_status ON offset_print_jobs(status); 