-- GetJob Database Schema
-- Database: PostgreSQL (recommended) or MySQL
-- Run this script to create the database schema

-- Create database (PostgreSQL)
-- CREATE DATABASE getjob_db;
-- \c getjob_db;

-- For MySQL, use: CREATE DATABASE getjob_db; USE getjob_db;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'JOB_SEEKER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- PROFILES (1:1 with users)
-- ============================================

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255),
    bio TEXT,
    phone VARCHAR(20),
    location VARCHAR(255),
    website VARCHAR(500),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- EDUCATION (1:N with profiles)
-- ============================================

CREATE TABLE educations (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_currently_studying BOOLEAN DEFAULT false,
    achievements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_educations_profile_id ON educations(profile_id);

-- ============================================
-- EXPERIENCES (1:N with profiles)
-- ============================================

CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50),
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_currently_working BOOLEAN DEFAULT false,
    responsibilities TEXT,
    technologies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experiences_profile_id ON experiences(profile_id);

-- ============================================
-- SKILLS
-- ============================================

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_type VARCHAR(20) NOT NULL, -- 'TECHNICAL', 'SOFT', 'LANGUAGE'
    name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20), -- For languages: native, fluent, advanced, intermediate, basic
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_profile_id ON skills(profile_id);

-- ============================================
-- CERTIFICATIONS
-- ============================================

CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    credential_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_profile_id ON certifications(profile_id);

-- ============================================
-- ORGANIZATIONS
-- ============================================

CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    org_type VARCHAR(50),
    employee_count VARCHAR(50),
    open_positions INT DEFAULT 0,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOBS
-- ============================================

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    experience_level VARCHAR(50),
    job_type VARCHAR(50), -- remote, hybrid, on-site
    skills_required TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_organization_id ON jobs(organization_id);
CREATE INDEX idx_jobs_title ON jobs(title);

-- ============================================
-- INTERNSHIPS (extends jobs or separate)
-- ============================================

CREATE TABLE internships (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    stipend VARCHAR(100),
    skills_required TEXT,
    openings INT DEFAULT 1,
    start_date VARCHAR(50),
    is_paid BOOLEAN DEFAULT true,
    is_remote BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOB APPLICATIONS
-- ============================================

CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_applications_job_id ON job_applications(job_id);

-- ============================================
-- SAVED JOBS (bookmarks)
-- ============================================

CREATE TABLE saved_jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- ============================================
-- SAMPLE DATA (Optional - for development)
-- ============================================

-- Insert sample organizations
INSERT INTO organizations (name, logo_url, org_type, employee_count, open_positions, tags) VALUES
('IBM', 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 'Enterprise Technology', '350,000+', 230, 'AI & Cloud,Consulting,Research'),
('Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', 'Software & Cloud', '180,000+', 450, 'Cloud,Software,Gaming'),
('Google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'Technology & Innovation', '156,000+', 380, 'AI/ML,Cloud,Research');
