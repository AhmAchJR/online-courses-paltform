# Online Courses Platform

This project is a backend application designed to manage courses, users, and authentication for an online learning platform.

## Features

- **User Authentication**: Secure registration and login for users.
- **Course Management**: CRUD operations for courses, including adding new courses, updating existing ones, and deleting courses.
- **User Roles**: Different access levels for administrators and regular users.
- **Enrollment System**: Users can enroll in courses and track their progress.

## Technologies Used

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer for handling multipart/form-data

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AhmAchJR/online-courses-paltform.git
   cd online-courses-paltform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```ini
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   UPLOADS_DIR=./assets/uploads
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```
   The server should now be running on http://localhost:3000.

## API Endpoints

### User Authentication

- **Register a New User**
  - `POST /api/auth/register`: Register a new user

- **User Login**
  - `POST /api/auth/login`: User login

### Courses

- **Get All Courses**
  - `GET /api/courses`: Retrieve all courses

- **Create a New Course**
  - `POST /api/courses`: Create a new course (Instructor only)

- **Retrieve a Specific Course**
  - `GET /api/courses/:id`: Retrieve a specific course

- **Update a Course**
  - `PUT /api/courses/:id`: Update a course (Instructor only)

- **Delete a Course**
  - `DELETE /api/courses/:id`: Delete a course (Instructor only)

- **Enroll in a Course**
  - `POST /api/courses/:id/enroll`: Enroll in a course (Student only)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

