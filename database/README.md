# GetJob Database

## Setup Instructions

### PostgreSQL

1. Install PostgreSQL
2. Create database:
   ```bash
   createdb getjob_db
   ```
3. Run schema:
   ```bash
   psql -d getjob_db -f schema.sql
   ```

### MySQL

1. Install MySQL
2. Create database:
   ```sql
   CREATE DATABASE getjob_db;
   USE getjob_db;
   ```
3. Note: Replace `BIGSERIAL` with `BIGINT AUTO_INCREMENT` and `REFERENCES` syntax for MySQL compatibility. Consider using Hibernate's `ddl-auto=create` for initial setup.

## Entity Mapping

| Table | JPA Entity |
|-------|------------|
| users | User |
| profiles | Profile |
| educations | Education |
| experiences | Experience |
| skills | Skill |
| certifications | Certification |
| organizations | Organization |
| jobs | Job |
| internships | Internship |
| job_applications | JobApplication |
| saved_jobs | SavedJob |
