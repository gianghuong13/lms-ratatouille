-- Xóa database nếu đã tồn tại và tạo lại
DROP DATABASE IF EXISTS educationsystem;
CREATE DATABASE educationsystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educationsystem;

-- Bảng users
CREATE TABLE users (
    user_id VARCHAR(8) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name NVARCHAR(255),
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    email NVARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng terms
CREATE TABLE terms (
    term_id VARCHAR(5) PRIMARY KEY,
    term_name NVARCHAR(255)
);

-- Bảng classes
CREATE TABLE classes (
    class_id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
    class_name NVARCHAR(255) NOT NULL,
    classroom NVARCHAR(255),
    term_id VARCHAR(5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (term_id) REFERENCES terms(term_id) ON DELETE CASCADE
);

-- Bảng class_teachers
CREATE TABLE class_teachers (
    class_teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) NOT NULL,
    teacher_id VARCHAR(8) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng class_members
CREATE TABLE class_members (
    class_member_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(8) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng modules
CREATE TABLE modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) NOT NULL,
    module_name NVARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Bảng materials
CREATE TABLE materials (
    material_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) NOT NULL,
    uploader_id VARCHAR(8),
    module_id INT DEFAULT NULL,
    material_type ENUM('document', 'video', 'link', 'zip') NOT NULL,
    title NVARCHAR(255) NOT NULL,
    s3_file_url VARCHAR(255), 
    description TEXT,
    file_path VARCHAR(255),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE SET NULL
);

-- Bảng assignments
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) NOT NULL,
    creator_id VARCHAR(8),
    title NVARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Bảng assignment_allowed_formats
CREATE TABLE assignment_allowed_formats (
    format_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    format VARCHAR(50) NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

-- Bảng file_storage dùng chung cho các loại file
CREATE TABLE file_storage (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    reference_id INT NOT NULL,
    reference_type ENUM('assignment', 'post', 'submission', 'announcement') NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng posts
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id VARCHAR(8),
    class_id VARCHAR(50) DEFAULT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Bảng comments
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    creator_id VARCHAR(8),
    content TEXT NOT NULL,
    root_of_cmt INT DEFAULT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (root_of_cmt) REFERENCES comments(comment_id) ON DELETE SET NULL
);

-- Bảng submissions
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id VARCHAR(8) NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(5, 2),
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng announcements
CREATE TABLE announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id VARCHAR(8),
    content TEXT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Bảng announcement_classes
CREATE TABLE announcement_classes (
    announcement_id INT NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (announcement_id, class_id),
    FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);


insert into users (user_id,username,password,full_name,role,email) values ('admin001','tvaexe','va100704','Thân Việt Anh','admin','vietanh.vadc.2004@gmail.com'), 
('admin002','ntq','ntqexe','Nguyễn Thúy Quỳnh','admin','22026559@vnu.edu.vn'),
('admin003','hple','hpleexe','Lê Thị Hà Phương','admin','22026563@vnu.edu.vn'),
('admin004','gianghuong','gianghuongexe','Nguyễn Hương Giang','admin','22026566@vnu.edu.vn');


