# 🖼️ ImageMagicks - A Full-Stack Image Gallery

ImageMagicks is a modern, full-stack image gallery application built from the ground up. It features a secure, token-based authentication system, allows users to upload and manage their images with captions and tags, and is deployed on a scalable, cloud-native infrastructure.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

---

## 🚀 Live Demo

* **Frontend (Vercel):** `https://clone-fest-week-2.vercel.app/`
* **Backend API (Render):** `https://clonefest-week-2.onrender.com/`

---

## ✨ Key Features

* **Secure Authentication:** User signup and login system using JWT for secure sessions.
* **Image Management:** Authenticated users can upload images with captions and searchable tags.
* **Ownership & Security:** Users can only delete images that they have uploaded.
* **Dynamic Gallery:** A responsive gallery to view all images, with the ability to filter by tags.
* **Containerized Backend:** The Node.js backend is fully containerized with Docker for consistent and reliable deployments.
* **Video Demo:** The homepage features an embedded video demonstrating the application's functionality.

---

## 🛠️ Tech Stack

| Category         | Technology                                       |
| :--------------- | :----------------------------------------------- |
| **Frontend** | React, Vite, TypeScript                          |
| **Backend** | Node.js, Express.js, TypeScript                  |
| **Database** | PostgreSQL                                       |
| **ORM** | Prisma                                           |
| **Deployment** | Vercel (Frontend), Render (Backend & Database) |
| **Containerization** | Docker                                           |
| **Authentication** | JWT, bcrypt                                      |

---

## ⚙️ Local Development Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have the following software installed on your machine:
* Node.js (v18 or later)
* Git
* Docker Desktop

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Configure Environment Variables**
    Create two environment files—one for the backend and one for the frontend.

    * In the `/backend` directory, create a `.env` file:
        ```env
        # A local PostgreSQL connection string
        DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_db_name"

        # A strong secret key for signing JWTs
        JWT_SECRET="YOUR_SUPER_SECRET_KEY_FOR_LOCAL_DEVELOPMENT"
        ```
    * In the `/frontend` directory, create a `.env.local` file:
        ```env
        # The URL of your local backend server
        VITE_API_URL=http://localhost:3000
        ```

3.  **Run the Backend Server** (in one terminal window)
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create the database tables
    npx prisma migrate dev

    # Start the server
    npm run dev
    ```

4.  **Run the Frontend Application** (in a new terminal window)
    ```bash
    # Navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the development server
    npm run dev
    ```
The application should now be running on `http://localhost:5173` (or another port specified by Vite).

---

## 📖 API Endpoints

The following are the main API routes available on the backend:

| Method   | Endpoint          | Description                                |
| :------- | :---------------- | :----------------------------------------- |
| `POST`   | `/api/signup`     | Creates a new user account.                |
| `POST`   | `/api/login`      | Logs in a user and returns a JWT.          |
| `POST`   | `/api/upload`     | Uploads an image (requires auth token).    |
| `GET`    | `/api/images`     | Gets all images (can filter by `?tag=`).    |
| `GET`    | `/api/images/:id` | Gets a single image by its ID.             |
| `DELETE` | `/api/images/:id` | Deletes an image (requires auth & ownership). |

---
