import connection from "../../database/dbConnect.js";

const courseManageController = {
    getAllCourses: (req, res) => {
        const query = `
            SELECT c.course_id, c.course_name, c.classroom, t.term_name
            FROM courses c
            LEFT JOIN terms t ON c.term_id = t.term_id
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
            SELECT user_id, username, full_name, email
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
            SELECT user_id, username, full_name, email
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
        const { course_id, course_name, classroom, term_id} = req.body;
        const query = `INSERT INTO courses (course_id, course_name, classroom, term_id) VALUES (?, ?, ?, ?)`;
        connection.query(query, [course_id, course_name, classroom, term_id], (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query create course');
            }
            res.status(201).send('Course created successfully');
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

    getCourseTeachers: (req, res) => {
        const { course_id } = req.params;
        const query = `
            SELECT u.user_id, u.username, u.full_name, u.email
            FROM course_teachers ct
            JOIN users u ON ct.teacher_id = u.user_id
            WHERE ct.course_id = ?
        `;
        connection.query(query, [course_id], (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query course teachers');
            }
            res.status(200).json(results);
        });
    },

    getCourseStudents: (req, res) => {
        const { course_id } = req.params;
        const query = `
            SELECT u.user_id, u.username, u.full_name, u.email
            FROM course_students cs
            JOIN users u ON cs.student_id = u.user_id
            WHERE cs.course_id = ?
        `;
        connection.query(query, [course_id], (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).send('Error executing query course students');
            }
            res.status(200).json(results);
        });
    },
};

export default courseManageController;