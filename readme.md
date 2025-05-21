# Food Ordering System

A web-based food ordering system that allows users to browse menu items, place orders, and track their order status. The system includes both user and admin interfaces.

## Prerequisites

Before installing the project, make sure you have the following installed on your system:

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Local Web Server ( Xampp or Laragon )

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/phyomaungmaung/foodorder
   cd foodorder
   ```

2. **Database Setup**

   - Create a new MySQL database
   - Import the database sql file:

   - The default admin credentials are:
     - Email: admin@fooder.com
     - Password: password

3. **Configure Database Connection**

   - Navigate to the `config` directory
   - Update the database configuration in `config.php` with your database credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     define('DB_NAME', 'fooder_db');
     ```

4. **Web Server Configuration**

   - Point your web server's document root to the project directory
   - Ensure the web server has write permissions for the following directories:
     - `img/` (for menu item images)
     - Any other directories that require write access

5. **Directory Structure**
   ```
   foodorder/
   ├── admin/           # Admin interface files
   ├── api/            # API endpoints
   ├── config/         # Configuration files
   ├── css/            # Stylesheets
   ├── img/            # Images and assets
   ├── js/             # JavaScript files
   ├── database.sql    # Database schema
   ├── index.html      # Main entry point
   └── other HTML files
   ```

## Usage

1. **Access the Application**

   - Open your web browser and navigate to `http://localhost/foodorder`
   - For admin access, go to `http://localhost/foodorder/admin`

2. **User Features**

   - Register/Login
   - Browse menu items
   - Place orders
   - View order history
   - Track order status

3. **Admin Features**
   - Manage menu items
   - Product create, edit, delete
   - Process orders
   - users List

## Security Considerations

- Change the default admin password after first login
- Keep your database credentials secure
- Regularly update dependencies
- Ensure proper file permissions
- Use HTTPS in production

## Troubleshooting

1. **Database Connection Issues**

   - Verify database credentials in config.php
   - Ensure MySQL service is running
   - Check database user permissions

2. **Image Upload Issues**

   - Verify directory permissions
   - Check PHP upload limits in php.ini
   - Ensure proper file type restrictions

3. **Tailwind CSS Not Working**
   - Clear browser cache
   - Check for JavaScript console errors

## Support

For any issues or questions, please [create an issue](https://github.com/phyomaungmaung/foodorder/issues) in the repository.

## License

[Your License Information]
