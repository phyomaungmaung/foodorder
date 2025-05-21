-- Create database
CREATE DATABASE IF NOT EXISTS fooder_db;
USE fooder_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES menu_items(id)
);

-- Insert default admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@fooder.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3'),
('Chicken Burger', 'Grilled chicken patty with lettuce, tomato, and special sauce', 8.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan', 7.99, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9'),
('Pasta Carbonara', 'Creamy pasta with bacon, egg, and parmesan cheese', 11.99, 'https://images.unsplash.com/photo-1612874742237-6526221588e3'),
('Chocolate Cake', 'Rich chocolate cake with chocolate ganache', 6.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'); 