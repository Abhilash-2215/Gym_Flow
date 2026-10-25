# GymFlow — Gym Management System

A Java full-stack gym management project built with React, Java, Spring Boot, Spring Data JPA, and MySQL.

## Features
- Admin dashboard with member count, active memberships, plans, and monthly revenue summary
- Create, view, edit, search, and delete gym members
- Membership plan management
- Membership status and expiry date tracking
- REST API with validation and consistent error responses
- Responsive React interface with dashboard, members, and plans screens
- Demo data loaded on first backend start when the database is empty

## Technology stack
- Frontend: React, JavaScript, HTML, CSS, Vite
- Backend: Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation
- Database: MySQL 8+
- Build tool: Maven

## Prerequisites
Install:
1. Java 17 or newer
2. Node.js 18 or newer and npm
3. MySQL 8+
4. Maven (or use the included Maven wrapper if you add one)

## 1. Create the database
Open MySQL Workbench or the MySQL terminal and run:

```sql
CREATE DATABASE gymflow;
```

## 2. Configure the backend
Open `backend/src/main/resources/application.properties`.

Update `spring.datasource.username` and `spring.datasource.password` to match your local MySQL account. The sample configuration uses `root` and `password`; change these values before running.

From the `backend` folder, run:

```bash
mvn spring-boot:run
```

The backend starts at `http://localhost:8080`.

The application uses `spring.jpa.hibernate.ddl-auto=update` for this learning project. For a production application, use database migrations such as Flyway or Liquibase instead.

## 3. Run the frontend
Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Dashboard totals |
| GET | `/api/members` | List members |
| GET | `/api/members/{id}` | Get one member |
| POST | `/api/members` | Add a member |
| PUT | `/api/members/{id}` | Update a member |
| DELETE | `/api/members/{id}` | Delete a member |
| GET | `/api/plans` | List membership plans |
| POST | `/api/plans` | Add a plan |
| PUT | `/api/plans/{id}` | Update a plan |
| DELETE | `/api/plans/{id}` | Delete a plan |

## Project structure
```text
GymFlow-Gym-Management-System/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/gymflow/
│       │   ├── GymFlowApplication.java
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── exception/
│       │   ├── model/
│       │   ├── repository/
│       │   └── service/
│       └── resources/application.properties
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/gymApi.js
        ├── components/
        ├── pages/
        └── styles.css
```

## Notes before publishing to GitHub
- Change the MySQL password and never commit real credentials.
- This is a learning/demo project. It does not yet include production authentication or authorization. Before using it for a real gym, add Spring Security, secure admin login, role-based access, audit logging, backups, and proper database migrations.
- The revenue card is a simple estimate based on active members' plan prices, not a payment ledger.
