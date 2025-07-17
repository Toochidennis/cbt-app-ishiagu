PRAGMA foreign_keys = ON;

-- USERS TABLE
CREATE TABLE
    IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        display_id INTEGER,
        reg_number TEXT,
        role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'student')),
        surname TEXT NOT NULL,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        class_id TEXT,
        gender TEXT CHECK (gender IN ('male', 'female')),
        date_of_birth TEXT,
        contact TEXT,
        state TEXT,
        lga TEXT,
        address TEXT,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (class_id, username),
        FOREIGN KEY (class_id) REFERENCES classes (id)
    );

-- CLASSES TABLE
CREATE TABLE
    IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        form_teacher TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        FOREIGN KEY (form_teacher) REFERENCES users (id)
    );

-- SUBJECTS TABLE
CREATE TABLE
    IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

-- COURSE ASSIGNMENTS
CREATE TABLE
    IF NOT EXISTS course_assignments (
        id TEXT PRIMARY KEY,
        staff_id TEXT,
        subject_id TEXT,
        class_id TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (staff_id, subject_id, class_id),
        FOREIGN KEY (staff_id) REFERENCES users (id),
        FOREIGN KEY (subject_id) REFERENCES subjects (id),
        FOREIGN KEY (class_id) REFERENCES classes (id)
    );

-- COURSE REGISTRATIONS
CREATE TABLE
    IF NOT EXISTS course_registrations (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        subject_id TEXT,
        term INTEGER NOT NULL,
        year INTEGER NOT NULL,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (student_id, subject_id, term, year),
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (subject_id) REFERENCES subjects (id)
    );

-- EXAM SCHEDULES
CREATE TABLE
    IF NOT EXISTS exam_schedules (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        subject_id TEXT,
        class_id TEXT,
        exam_date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        year INTEGER NOT NULL,
        term INTEGER NOT NULL,
        created_by TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (subject_id, class_id, term, year),
        FOREIGN KEY (subject_id) REFERENCES subjects (id),
        FOREIGN KEY (class_id) REFERENCES classes (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    );

-- QUESTIONS TABLE
CREATE TABLE
    IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        exam_schedule_id TEXT,
        question_text TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        marks INTEGER DEFAULT 1,
        created_by TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    );

-- GRADES TABLE
CREATE TABLE
    IF NOT EXISTS grades (
        id TEXT PRIMARY KEY,
        min_score NUMERIC NOT NULL,
        max_score NUMERIC NOT NULL,
        grade TEXT NOT NULL,
        remark TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

-- RESULTS TABLE
CREATE TABLE
    IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        subject_id TEXT,
        class_id TEXT,
        term INTEGER NOT NULL,
        year INTEGER NOT NULL,
        ca1 NUMERIC,
        ca2 NUMERIC,
        exam NUMERIC,
        total_score NUMERIC,
        grade TEXT,
        remarks TEXT,
        approved INTEGER DEFAULT 0,
        approved_at TEXT,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (student_id, subject_id, class_id, term, year),
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (subject_id) REFERENCES subjects (id),
        FOREIGN KEY (class_id) REFERENCES classes (id)
    );

-- ASSESSMENTS TABLE
CREATE TABLE
    IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        subject_id TEXT,
        class_id TEXT,
        assessment_name TEXT NOT NULL,
        max_score NUMERIC NOT NULL,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (subject_id, class_id, assessment_name),
        FOREIGN KEY (subject_id) REFERENCES subjects (id),
        FOREIGN KEY (class_id) REFERENCES classes (id)
    );

-- SETTINGS TABLE
CREATE TABLE
    IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        school_name TEXT,
        logo TEXT,
        term INTEGER NOT NULL,
        year INTEGER NOT NULL,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

-- EXAM ATTEMPTS
CREATE TABLE
    IF NOT EXISTS exam_attempts (
        id TEXT PRIMARY KEY,
        exam_schedule_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        status INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (exam_schedule_id, student_id),
        FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules (id),
        FOREIGN KEY (student_id) REFERENCES users (id)
    );

-- SYNC META
CREATE TABLE
    IF NOT EXISTS sync_meta (
        table_name TEXT PRIMARY KEY,
        last_synced TEXT,
        last_synced_to_server TEXT
    );