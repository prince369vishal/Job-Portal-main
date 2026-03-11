# GetJob - Job Portal

A full-stack job portal application with a professional architecture separating Frontend, Backend (Java/Spring Boot), and Database layers.

## Project Structure

```
Job-Portal-main/
├── frontend/           # Static HTML, CSS, JavaScript
│   ├── index.html
│   ├── signin.html, signup.html
│   ├── create-profile.html, education.html, experience.html, skills.html
│   ├── profile-complete.html
│   ├── css/
│   ├── js/
│   └── images/
├── backend/            # Spring Boot REST API
│   └── src/main/java/com/getjob/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       └── dto/
└── database/          # SQL schema and migrations
    └── schema.sql
```

## Quick Start

### 1. Frontend Only (No Backend)
- Open `frontend/index.html` in a browser or use a local server (e.g. Live Server)
- Set `USE_API: false` in `frontend/js/config.js` to use localStorage

### 2. Full Stack (Frontend + Backend)

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
Uses H2 in-memory DB by default (dev profile). API runs at `http://localhost:8080`

**Frontend:**
- Serve `frontend/` folder (e.g. `npx serve frontend` or open with Live Server)
- Ensure `USE_API: true` in `frontend/js/config.js`

### 3. Production (PostgreSQL)
1. Create database: `createdb getjob_db`
2. Run schema: `psql -d getjob_db -f database/schema.sql`
3. Update `backend/src/main/resources/application.properties`:
   - Remove or comment `spring.profiles.active=dev`
   - Set PostgreSQL credentials

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/signin` | Login |
| GET | `/api/profiles/user/{userId}` | Get profile |
| POST | `/api/profiles/user/{userId}/basic` | Create/update basic info |
| POST | `/api/profiles/{id}/education` | Add education |
| POST | `/api/profiles/{id}/experience` | Add experience |
| PUT | `/api/profiles/{id}/skills` | Update skills |
| GET | `/api/jobs` | List jobs |
| GET | `/api/organizations` | List organizations |

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design, database schema, and deployment notes.
