# GetJob - Full Stack Architecture

## Executive Summary

This document outlines the production-grade architecture for **GetJob**, a job portal platform. The system is organized into three distinct layers: **Frontend**, **Backend (Java/Spring Boot)**, and **Database**.

---

## 1. Website Analysis Summary

### Current Functionality
- **Landing Page**: Job search, featured jobs, discover categories, internships, organizations
- **Authentication**: Sign In, Sign Up (with validation)
- **Profile Creation**: Multi-step wizard (Basic Info → Education → Experience → Skills)
- **Data Storage**: Currently uses localStorage (client-side only)

### Key Entities Identified
| Entity | Key Fields |
|--------|------------|
| User | email, password, firstName, lastName |
| Profile | headline, bio, phone, location, website, photoUrl |
| Education | institution, degree, field, startDate, endDate |
| Experience | company, position, employmentType, responsibilities |
| Skill | technical, soft, languages, certifications |
| Job | title, company, location, salary, skills |
| Organization | name, type, employeeCount, openPositions |

---

## 2. Complete Folder Structure

```
Job-Portal-main/
├── frontend/
│   ├── index.html
│   ├── signin.html
│   ├── signup.html
│   ├── create-profile.html
│   ├── education.html
│   ├── experience.html
│   ├── skills.html
│   ├── profile-complete.html
│   ├── css/
│   │   ├── styles.css          # Base/global styles
│   │   ├── signin.css
│   │   ├── signup.css
│   │   ├── create-profile.css
│   │   ├── education.css
│   │   ├── experience.css
│   │   ├── skills.css
│   │   ├── discover.css
│   │   ├── organizations.css
│   │   └── internships.css
│   ├── js/
│   │   ├── config.js           # API base URL, constants
│   │   ├── api.js              # API client (fetch/axios wrapper)
│   │   ├── auth.js             # Auth state management
│   │   ├── script.js           # Homepage logic
│   │   ├── signin.js
│   │   ├── signup.js
│   │   ├── create-profile.js
│   │   ├── education.js
│   │   ├── experience.js
│   │   └── skills.js
│   └── images/
│       └── logo.png
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/getjob/
│           │       ├── GetJobApplication.java
│           │       ├── config/
│           │       │   ├── WebConfig.java
│           │       │   └── SecurityConfig.java
│           │       ├── controller/
│           │       │   ├── AuthController.java
│           │       │   ├── UserController.java
│           │       │   ├── ProfileController.java
│           │       │   ├── JobController.java
│           │       │   └── OrganizationController.java
│           │       ├── service/
│           │       │   ├── AuthService.java
│           │       │   ├── UserService.java
│           │       │   ├── ProfileService.java
│           │       │   ├── JobService.java
│           │       │   └── OrganizationService.java
│           │       ├── repository/
│           │       │   ├── UserRepository.java
│           │       │   ├── ProfileRepository.java
│           │       │   ├── EducationRepository.java
│           │       │   ├── ExperienceRepository.java
│           │       │   ├── SkillRepository.java
│           │       │   ├── JobRepository.java
│           │       │   └── OrganizationRepository.java
│           │       ├── entity/
│           │       │   ├── User.java
│           │       │   ├── Profile.java
│           │       │   ├── Education.java
│           │       │   ├── Experience.java
│           │       │   ├── Skill.java
│           │       │   ├── Job.java
│           │       │   └── Organization.java
│           │       └── dto/
│           │           ├── LoginRequest.java
│           │           ├── SignupRequest.java
│           │           └── ApiResponse.java
│           └── resources/
│               ├── application.properties
│               └── application-dev.properties
│
└── database/
    ├── schema.sql
    └── README.md
```

---

## 3. Database Design

### Recommended: PostgreSQL
- ACID compliant, robust for production
- Excellent JSON support for flexible data
- Strong indexing for search queries

### Schema (see database/schema.sql for full SQL)

**Core Tables:**
- `users` - Authentication & basic user info
- `profiles` - Extended profile (1:1 with users)
- `educations` - User education history (1:N)
- `experiences` - Work experience (1:N)
- `skills` - User skills (technical, soft, languages)
- `certifications` - User certifications
- `jobs` - Job listings
- `organizations` - Company/organization info
- `job_applications` - Track applications

---

## 4. REST API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login, returns JWT |
| POST | `/api/auth/logout` | Logout (invalidate token) |
| GET | `/api/auth/me` | Get current user |

### Users & Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user |
| GET | `/api/profiles/{userId}` | Get full profile |
| POST | `/api/profiles` | Create profile |
| PUT | `/api/profiles/{id}` | Update profile |
| POST | `/api/profiles/{id}/education` | Add education |
| POST | `/api/profiles/{id}/experience` | Add experience |
| POST | `/api/profiles/{id}/skills` | Add/update skills |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (with filters) |
| GET | `/api/jobs/{id}` | Get job details |
| POST | `/api/jobs/{id}/apply` | Apply to job |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | List organizations |
| GET | `/api/organizations/{id}` | Get organization details |
| GET | `/api/organizations/{id}/jobs` | Jobs by organization |

---

## 5. Frontend → Backend Communication

### Using Fetch API

```javascript
// config.js
const API_BASE_URL = 'http://localhost:8080/api';

// api.js - Generic API client
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    throw new Error(await response.text() || 'Request failed');
  }
  return response.json();
}

// Example: Sign In
const login = async (email, password) => {
  const data = await apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  localStorage.setItem('token', data.token);
  return data;
};

// Example: Get Profile
const getProfile = (userId) => 
  apiRequest(`/profiles/${userId}`);
```

### Using Axios (Alternative)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Usage
const response = await api.post('/auth/signin', { email, password });
```

---

## 6. Backend → Database Connection

### Spring Boot + JPA/Hibernate

**application.properties:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/getjob_db
spring.datasource.username=getjob_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

**Entity Example:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String passwordHash;
    // ... getters/setters
}
```

**Repository:**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

---

## 7. Production Deployment Considerations

1. **CORS**: Configure allowed origins in `WebConfig.java`
2. **Security**: JWT for auth, HTTPS only, password hashing (BCrypt)
3. **Environment Variables**: Use `application-{profile}.properties`
4. **Database**: Connection pooling, migrations (Flyway/Liquibase)
5. **Frontend**: Serve static files via Nginx or CDN
6. **API Versioning**: Consider `/api/v1/` prefix

---

## 8. Refactoring Steps

1. Create folder structure
2. Move frontend files to `frontend/` with proper paths
3. Create database schema and run migrations
4. Build Spring Boot backend
5. Update frontend JS to call APIs instead of localStorage
6. Test end-to-end flow
