import connection from "../../database/dbConnect.js";

const courseManageController = {
    getAllCourses: (req, res) => {
        const query = `
            SELECT c.course_id, c.course_name, c.classroom, t.term_name, u.full_name AS teacher,
                (SELECT COUNT(*) FROM course_members WHERE course_id = c.course_id) AS total_students
            FROM courses c
            LEFT JOIN terms t ON c.term_id = t.term_id
            LEFT JOIN course_teachers ct ON c.course_id = ct.course_id
            LEFT JOIN users u ON ct.teacher_id = u.user_id
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query all courses');
            }
            res.status(200).json(results);
        });
    },

    getAllTeachers: (req, res) => {
        const query = `
            SELECT user_id, full_name, email
            FROM users
            WHERE role = 'teacher'
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query all teachers');
            }
            res.status(200).json(results);
        });
    }, 

    getAllStudents: (req, res) => {
        const query = `
            SELECT user_id, full_name, email
            FROM users
            WHERE role = 'student'
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query all students');
            }
            res.status(200).json(results);
        });
    },

    createCourse: (req, res) => {
        const { course_id, course_name, classroom, term_id, teachers, students } = req.body;
    
        // Khởi tạo query cho bảng courses
        const courseQuery = `INSERT INTO courses (course_id, course_name, classroom, term_id) VALUES (?, ?, ?, ?)`;
    
        // Khởi tạo query cho bảng course_teachers
        const teacherQuery = `INSERT INTO course_teachers (course_id, teacher_id) VALUES (?, ?)`;
    
        // Khởi tạo query cho bảng course_members
        const studentQuery = `INSERT INTO course_members (course_id, student_id) VALUES (?, ?)`;
    
        connection.beginTransaction((err) => {
            if (err) {
                console.log('Transaction start error:', err);
                return res.status(500).send('Failed to start transaction');
            }
    
            // Thêm khóa học vào bảng courses
            connection.query(courseQuery, [course_id, course_name, classroom, term_id], (err, results) => {
                if (err) {
                    console.log('Error inserting course:', err);
                    return connection.rollback(() => {
                        res.status(500).send('Error inserting course');
                    });
                }
    
                // Thêm giáo viên vào bảng course_teachers
                const teacherPromises = teachers.map((teacherId) =>
                    new Promise((resolve, reject) => {
                        connection.query(teacherQuery, [course_id, teacherId], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    })
                );
    
                // Thêm học sinh vào bảng course_members
                const studentPromises = students.map((studentId) =>
                    new Promise((resolve, reject) => {
                        connection.query(studentQuery, [course_id, studentId], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    })
                );
    
                // Chạy tất cả các promises
                Promise.all([...teacherPromises, ...studentPromises])
                    .then(() => {
                        connection.commit((err) => {
                            if (err) {
                                console.log('Transaction commit error:', err);
                                return connection.rollback(() => {
                                    res.status(500).send('Failed to commit transaction');
                                });
                            }
                            res.status(201).send('Course created successfully');
                        });
                    })
                    .catch((err) => {
                        console.log('Error inserting teachers/students:', err);
                        connection.rollback(() => {
                            res.status(500).send('Error inserting teachers or students');
                        });
                    });
            });
        });
    },
    
    getAllTerms: (req, res) => {
        const query = `
            SELECT *
            FROM terms
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query all terms');
            }
            res.status(200).json(results);
        });
    }, 

    getCourseById: async (req, res) => {
        const { course_id } = req.params;
        try {
            const courseQuery = `
                SELECT c.course_id, c.course_name, c.classroom, c.term_id, t.term_name
                FROM courses c
                LEFT JOIN terms t ON c.term_id = t.term_id
                WHERE c.course_id = ?
            `;
            const teacherQuery = `
                SELECT u.user_id, u.full_name
                FROM course_teachers ct
                JOIN users u ON ct.teacher_id = u.user_id
                WHERE ct.course_id = ?
            `;

            const studentQuery = `
                SELECT u.user_id, u.full_name
                FROM course_members cm
                JOIN users u ON cm.student_id = u.user_id
                WHERE cm.course_id = ?
            `;

            const [courseResults] = await connection.promise().query(courseQuery, [course_id]);
            if (courseResults.length === 0) {
                return res.status(404).send('Course not found');
            }
            const course = courseResults[0];
            //fetch teachers and students in parallel
            const [teachers, students] = await Promise.all([
                connection.promise().query(teacherQuery, [course_id]),
                connection.promise().query(studentQuery, [course_id]),
            ]);

            course.teachers = teachers[0];
            course.students = students[0];
            
            res.status(200).json(course);
        } catch (err) {
            console.error('Error fetching course details', err);
            res.status(500).send('Internal server error');
        }
    },

    updateCourse: async (req, res) => {
        const { course_id } = req.params;
        const { course_name, classroom, term_id, teachers, students } = req.body;

        try {
            // Bắt đầu giao dịch
            await connection.promise().query('START TRANSACTION');

            // Cập nhật thông tin khóa học
            const updateCourseQuery = `
                UPDATE courses
                SET course_name = ?, classroom = ?, term_id = ?
                WHERE course_id = ?
            `;
            const [updateResult] = await connection.promise().query(updateCourseQuery, [course_name, classroom, term_id, course_id]);
            if (updateResult.affectedRows === 0) {
                await connection.promise().query('ROLLBACK');
                return res.status(404).send('Course not found');
            }

            // Xóa và thêm giáo viên
            await connection.promise().query(`DELETE FROM course_teachers WHERE course_id = ?`, [course_id]);
            if (teachers && teachers.length > 0) {
                const teacherValues = teachers.map((id) => [course_id, id]);
                await connection.promise().query(`INSERT INTO course_teachers (course_id, teacher_id) VALUES ?`, [teacherValues]);
            }

            // Xóa và thêm học sinh
            await connection.promise().query(`DELETE FROM course_members WHERE course_id = ?`, [course_id]);
            if (students && students.length > 0) {
                const studentValues = students.map((id) => [course_id, id]);
                await connection.promise().query(`INSERT INTO course_members (course_id, student_id) VALUES ?`, [studentValues]);
            }

            // Commit giao dịch
            await connection.promise().query('COMMIT');
            res.status(200).send('Course updated successfully');
        } catch (err) {
            console.error('Error updating course:', err);
            await connection.promise().query('ROLLBACK');
            res.status(500).send('Failed to update course');
        }
    },

    deleteCourse: async (req, res) => {
        const { course_id } = req.params;

        try {
            await connection.promise().query('START TRANSACTION');

            const checkCourseQuery = 'SELECT * FROM courses WHERE course_id = ?';
            const [courseResult] = await connection.promise().query(checkCourseQuery, [course_id]);
            if (courseResult.length === 0) {
                await connection.promise().query('ROLLBACK');
                return res.status(404).send('Course not found');
            }

            // Xóa thông tin giáo viên khỏi bảng course_teachers
            await connection.promise().query('DELETE FROM course_teachers WHERE course_id = ?', [course_id]);

            // Xóa thông tin học sinh khỏi bảng course_members
            await connection.promise().query('DELETE FROM course_members WHERE course_id = ?', [course_id]);

            // Xóa khóa học khỏi bảng courses
            await connection.promise().query('DELETE FROM courses WHERE course_id = ?', [course_id]);

            // Commit giao dịch
            await connection.promise().query('COMMIT');
            res.status(200).send('Course deleted successfully');

        } catch (error) {
            console.error('Error deleting course:', err);
            await connection.promise().query('ROLLBACK');
            res.status(500).send('Failed to delete course');
        }
    },

    getLoginedUsersCourses: (req, res) => {
        const { user_id } = req.params;
        const query = `
            SELECT 
            c.course_id,
            c.course_name,
            t.term_id,
            t.term_name,
                CASE 
                    WHEN cm.student_id IS NOT NULL THEN 'Student'
                    WHEN ct.teacher_id IS NOT NULL THEN 'Teacher'
                END AS enrolled_as
            FROM courses c
            LEFT JOIN course_members cm ON c.course_id = cm.course_id AND cm.student_id = ?
            LEFT JOIN course_teachers ct ON c.course_id = ct.course_id AND ct.teacher_id = ?
            JOIN terms t ON c.term_id = t.term_id
            WHERE cm.student_id IS NOT NULL OR ct.teacher_id IS NOT NULL;
        `;
    
        connection.query(query, [user_id, user_id], (err, results) => {
            if (err) {
                console.log('Error fetching user courses:', err);
                return res.status(500).send('Error fetching user courses');
            }
            res.status(200).json(results);
        });
    },
    
};

export default courseManageController;