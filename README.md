# yuvwaa-mini-rider-admin 

# 🚀 Yuvwaa Mini Rider Admin Web – Full Stack Application

A complete **Rider–Bike Management System** built with:

* **Node.js + Express**
* **PostgreSQL**
* **React.js**
* **REST APIs**

This system manages:

* Riders
* Bikes
* Assignments (one rider can have only one active bike)

---

# 📁 Project Structure

/yuvwaa-mini-rider-admin
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

---
***Ignore if already install***
# 🛢️ 1. Database Setup (PostgreSQL)

## **Step 1 — Install PostgreSQL**

Download and install PostgreSQL:

   [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

During installation:

| Item     | Value                    |
| -------- | ------------------------ |
| Username | `postgres`               |
| Password | *(choose your password)* |

---

## **Step 2 — Create Database**

Open terminal/Powershell:

```bash
psql -U postgres
```

Create database:

```sql
CREATE DATABASE yuvwaa_db;
```

Connect:

```sql
\c yuvwaa_db;
```

---

## **Step 3 — Run Schema File**

Inside `/backend/db/schema.sql` you should have:

```sql
CREATE TABLE IF NOT EXISTS riders (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  bike_code TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bike_assignments (
  id SERIAL PRIMARY KEY,
  rider_id INT REFERENCES riders(id) ON DELETE CASCADE,
  bike_id INT REFERENCES bikes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);
```

Run the SQL:

```bash
psql -U postgres -d yuvwaa_db -f backend/db/schema.sql
```

---

# 2. Backend Setup (Node.js + Express)

## **Step 1 — Go to backend folder**

bash :
cd backend

---

## **Step 2 — Install packages**

bash :
npm install

---

## **Step 3 — Create `.env` file**

Inside `/backend/.env`:

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=yuvwaa_db
DB_PORT=5432

PORT=5000
```

---

## **Step 4 — Start backend**

### Development mode (auto-restart):

bash
npm run dev

### Normal start(for confirmation):

bash :
node server.js

Backend will run at:

 **[http://localhost:5000](http://localhost:5000)**

---

# 3. Frontend Setup (React.js)

## **Step 1 — Go to frontend folder**

bash :
cd frontend

---

## **Step 2 — Install dependencies**

bash :
npm install

---

## **Step 3 — Start React development server**

bash :
npm start

Frontend will run at:

 **[http://localhost:3000](http://localhost:3000)**

---

#  API Endpoints

### **Riders**

POST /api/riders
GET  /api/riders

### **Bikes**

POST /api/bikes
GET  /api/bikes

### **Assignments**

POST   /api/assignments
GET    /api/assignments
DELETE /api/assignments/:id

---

#  Notes

* A rider can **only have one active assignment** at a time.
* When an assignment is deleted:

  * `bike.status = 'available'`
  * assignment becomes `active = false`
* Bikes that are already assigned do NOT appear in assignment dropdown.

---

#  You're Ready!

Your full system is now ready to run:

bash :
Backend → http://localhost:5000
Frontend → http://localhost:3000

---

