# Library Management System

## Description

The Library Management System is a robust and user-friendly software application designed to streamline the management of library resources. This system handles various tasks such as managing book inventories, member registrations, borrowing and returning of books, and calculating overdue fines. It provides an efficient solution for libraries to enhance their operations and deliver better services to their members.

---

## Features

- **Book Inventory Management**: Add, update, and delete book records, including details like title, author, ISBN, and availability status.
- **Member Management**: Register new members, update member information, and maintain a database of active and inactive members.
- **Borrowing and Returning**: Record book borrow and return transactions with timestamps for accurate tracking.
- **Overdue Fine Calculation**: Automatically calculate overdue fines based on the library's policies.
- **Search and Filters**: Search for books and members using various filters (e.g., title, author, member ID).
- **User Roles**: Differentiate between administrator and member functionalities for enhanced security and usability.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (in the `public` folder)
- **Backend**: Node.js with Express
- **Database**: MySQL

---

## Project Structure

```
library-management-system/
├── public/
│   ├── ui.js           # Frontend logic
│   ├── index.html      # Main UI page
│   ├── styles.css      # Styling for the frontend
├── src/
│   ├── api.js          # API endpoints
│   ├── database.js     # Database connection and queries
│   ├── index.js        # Main entry point for the server
├── db/
│   ├── schema.sql      # SQL file for database schema
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
```

---

## Database Design

### Tables

#### 1. `books`
| Column         | Type          | Constraints         |
|----------------|---------------|---------------------|
| `book_id`      | INT           | PRIMARY KEY, AUTO_INCREMENT |
| `title`        | VARCHAR(255)  | NOT NULL            |
| `author`       | VARCHAR(255)  | NOT NULL            |
| `isbn`         | VARCHAR(13)   | UNIQUE              |
| `status`       | ENUM('available', 'borrowed') | DEFAULT 'available' |

#### 2. `members`
| Column         | Type          | Constraints         |
|----------------|---------------|---------------------|
| `member_id`    | INT           | PRIMARY KEY, AUTO_INCREMENT |
| `name`         | VARCHAR(255)  | NOT NULL            |
| `email`        | VARCHAR(255)  | UNIQUE              |
| `phone`        | VARCHAR(15)   |                     |
| `joined_date`  | DATE          | DEFAULT CURRENT_DATE |

#### 3. `transactions`
| Column         | Type          | Constraints         |
|----------------|---------------|---------------------|
| `transaction_id` | INT         | PRIMARY KEY, AUTO_INCREMENT |
| `member_id`    | INT           | FOREIGN KEY REFERENCES `members`(`member_id`) |
| `book_id`      | INT           | FOREIGN KEY REFERENCES `books`(`book_id`) |
| `borrow_date`  | DATE          | DEFAULT CURRENT_DATE |
| `return_date`  | DATE          |                     |
| `fine`         | DECIMAL(5,2)  | DEFAULT 0.00        |

---

## Setting Up the Project

1. **Initialize the Project**:
   ```bash
   mkdir library-management-system
   cd library-management-system
   npm init -y
   npm install express mysql dotenv
   ```

2. **Database Setup**:
   - Create the MySQL database using the `schema.sql` file:
     ```sql
     CREATE DATABASE library_management;
     USE library_management;

     CREATE TABLE books (
         book_id INT AUTO_INCREMENT PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         author VARCHAR(255) NOT NULL,
         isbn VARCHAR(13) UNIQUE,
         status ENUM('available', 'borrowed') DEFAULT 'available'
     );

     CREATE TABLE members (
         member_id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) UNIQUE,
         phone VARCHAR(15),
         joined_date DATE DEFAULT CURRENT_DATE
     );

     CREATE TABLE transactions (
         transaction_id INT AUTO_INCREMENT PRIMARY KEY,
         member_id INT,
         book_id INT,
         borrow_date DATE DEFAULT CURRENT_DATE,
         return_date DATE,
         fine DECIMAL(5,2) DEFAULT 0.00,
         FOREIGN KEY (member_id) REFERENCES members(member_id),
         FOREIGN KEY (book_id) REFERENCES books(book_id)
     );
     ```

3. **Environment Variables**:
   Create a `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=library_management
   PORT=3000
   ```

4. **Backend Development**:
   - `src/database.js`:
     ```javascript
     const mysql = require('mysql');
     const dotenv = require('dotenv');

     dotenv.config();

     const connection = mysql.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME
     });

     connection.connect(err => {
         if (err) throw err;
         console.log('Connected to the database');
     });

     module.exports = connection;
     ```

   - `src/api.js`:
     ```javascript
     const express = require('express');
     const router = express.Router();
     const db = require('./database');

     // Get all books
     router.get('/books', (req, res) => {
         db.query('SELECT * FROM books', (err, results) => {
             if (err) throw err;
             res.json(results);
         });
     });

     // Add a new book
     router.post('/books', (req, res) => {
         const { title, author, isbn } = req.body;
         const query = 'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)';
         db.query(query, [title, author, isbn], (err, results) => {
             if (err) throw err;
             res.json({ message: 'Book added successfully', bookId: results.insertId });
         });
     });

     module.exports = router;
     ```

   - `src/index.js`:
     ```javascript
     const express = require('express');
     const dotenv = require('dotenv');
     const apiRoutes = require('./api');

     dotenv.config();

     const app = express();
     const PORT = process.env.PORT || 3000;

     app.use(express.json());
     app.use('/api', apiRoutes);
     app.use(express.static('public'));

     app.listen(PORT, () => {
         console.log(`Server running on http://localhost:${PORT}`);
     });
     ```

5. **Frontend Development**:
   - `public/index.html`:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Library Management System</title>
         <link rel="stylesheet" href="styles.css">
     </head>
     <body>
         <h1>Welcome to the Library Management System</h1>
         <script src="ui.js"></script>
     </body>
     </html>
     ```

This setup provides a foundation for your Library Management System. Let me know if you need further assistance!

