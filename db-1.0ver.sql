-- Xóa database nếu đã tồn tại và tạo lại
DROP DATABASE IF EXISTS educationsystem;
CREATE DATABASE educationsystem;
USE educationsystem;

-- Tạo bảng users để lưu thông tin người dùng (admin, giảng viên, sinh viên)
CREATE TABLE users (
    user_id NVARCHAR(8) PRIMARY KEY, -- 22026568/FIT10303/admin003
    username NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255),
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    email NVARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng term lưu thông tin học kì
CREATE TABLE Term (
    term_id NVARCHAR(5) PRIMARY KEY, -- 2223I/2223II/2223He
    term_name NVARCHAR(255)
);

-- Tạo bảng classes để lưu thông tin các lớp học
CREATE TABLE classes (
    class_id NVARCHAR(50) PRIMARY KEY UNIQUE NOT NULL, -- Mã lớp
    class_name NVARCHAR(255) NOT NULL, -- Tên lớp
    classroom NVARCHAR(255), -- Phòng học
    term_id NVARCHAR(5), -- Học kì
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (term_id) REFERENCES Term(term_id) ON DELETE CASCADE
);

-- Tạo bảng class_teachers để quản lý các giáo viên của mỗi lớp
CREATE TABLE class_teachers (
    class_teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50) NOT NULL,
    teacher_id NVARCHAR(8) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tạo bảng class_members để quản lý thành viên trong các lớp học (sinh viên)
CREATE TABLE class_members (
    class_member_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50) NOT NULL,
    student_id NVARCHAR(8) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tạo bảng modules để quản lý các tuần hoặc chủ đề học trong một lớp học
CREATE TABLE modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50) NOT NULL,
    module_name NVARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Tạo bảng materials để lưu trữ thông tin về tất cả học liệu (tài liệu, video, ...)
CREATE TABLE materials (
    material_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50) NOT NULL,
    uploader_id NVARCHAR(8),
    module_id INT DEFAULT NULL,
    material_type ENUM('document', 'video', 'link', 'zip') NOT NULL,
    title NVARCHAR(255) NOT NULL,
    s3_file_url NVARCHAR(255), 
    description TEXT,
    file_path NVARCHAR(255),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE SET NULL
);

-- Tạo bảng assignments để quản lý thông tin các bài tập
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50) NOT NULL,
    creator_id NVARCHAR(8),
    title NVARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Tạo bảng assignment_files để lưu thông tin các tệp đính kèm bài tập
CREATE TABLE assignment_files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(255) NOT NULL, -- Đường dẫn lưu trữ tệp tin
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

-- Tạo bảng posts để lưu thông tin các bài đăng trên diễn đàn của lớp học
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id NVARCHAR(8),
    class_id NVARCHAR(50) DEFAULT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Tạo bảng comments để quản lý các bình luận trong các bài đăng trên diễn đàn
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    creator_id NVARCHAR(8),
    content TEXT NOT NULL,
    root_of_cmt INT DEFAULT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (root_of_cmt) REFERENCES comments(comment_id) ON DELETE SET NULL
);

-- Tạo bảng submissions để lưu trữ các bài nộp của sinh viên cho các bài tập
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id NVARCHAR(8) NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(5, 2),
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tạo bảng submission_files để lưu thông tin các tệp đính kèm cho mỗi bài nộp
CREATE TABLE submission_files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(255) NOT NULL, -- Đường dẫn lưu trữ tệp tin
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE
);

-- Tạo bảng announcements để quản lý các thông báo gửi tới sinh viên
CREATE TABLE announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id NVARCHAR(50),
    creator_id NVARCHAR(8),
    content TEXT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);
