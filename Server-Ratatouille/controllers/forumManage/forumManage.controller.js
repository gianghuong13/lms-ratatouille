import connection from '../../database/dbConnect.js'; // Assuming you have a database connection module

const forumManageController = {
    getAllPostsByCourseId: (req, res) => {
        const courseId = req.params.course_id;
        const query = `SELECT * FROM posts WHERE course_id = ?`;
        connection.query(query, [courseId], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send(result);
            }
        });
    },

    getPostById: (req, res) => {
        const postId = req.params.post_id;
        const query = `SELECT * FROM posts WHERE post_id = ?`;
        connection.query(query, [postId], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send(result);
            }
        });
    },

    createPost: (req, res) => {
        const { creator_id, course_id, title, content } = req.body;
        const query = `INSERT INTO posts (creator_id, course_id, title, content) VALUES (?, ?, ?, ?)`;
        connection.query(query, [creator_id, course_id, title, content], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                res.status(201).send('Post created successfully');
            }
        });
    },

    updatePost: (req, res) => {
        const postId = req.params.post_id;
        const { title, content } = req.body;
        const query = `UPDATE posts SET title = ?, content = ?, last_modified = CURRENT_TIMESTAMP WHERE post_id = ?`;
        connection.query(query, [title, content, postId], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send('Post updated successfully');
            }
        });
    },

    deletePost: (req, res) => {
        const postId = req.params.post_id;
        const query = `DELETE FROM posts WHERE post_id = ?`;
        connection.query(query, [postId], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send('Post deleted successfully');
            }
        });
    },

    getAllCommentsByPostId: (req, res) => {
      const postId = req.params.post_id;
      const query = `SELECT * FROM comments WHERE post_id = ?`;
      connection.query(query, [postId], (err, result) => {
          if (err) {
              res.status(500).send('Internal server error');
          } else {
              const comments = result;
              const commentMap = {};

              // Create a map of comments by their ID
              comments.forEach(comment => {
                  comment.children = [];
                  commentMap[comment.comment_id] = comment;
              });

              // Organize comments into a tree structure
              const tree = [];
              comments.forEach(comment => {
                  if (comment.root_of_cmt) {
                      commentMap[comment.root_of_cmt].children.push(comment);
                  } else {
                      tree.push(comment);
                  }
              });

              res.status(200).send(tree);
          }
      });
  },

  createComment: (req, res) => {
      const { post_id, creator_id, content, root_of_cmt } = req.body;
      const query = `INSERT INTO comments (post_id, creator_id, content, root_of_cmt) VALUES (?, ?, ?, ?)`;
      connection.query(query, [post_id, creator_id, content, root_of_cmt], (err, result) => {
          if (err) {
              res.status(500).send('Internal server error');
          } else {
              res.status(201).send('Comment created successfully');
          }
      });
  },

  updateComment: (req, res) => {
      const commentId = req.params.comment_id;
      const { content } = req.body;
      const query = `UPDATE comments SET content = ?, last_modified = CURRENT_TIMESTAMP WHERE comment_id = ?`;
      connection.query(query, [content, commentId], (err, result) => {
          if (err) {
              res.status(500).send('Internal server error');
          } else {
              res.status(200).send('Comment updated successfully');
          }
      });
  },

  deleteComment: (req, res) => {
      const commentId = req.params.comment_id;
      const query = `DELETE FROM comments WHERE comment_id = ?`;
      connection.query(query, [commentId], (err, result) => {
          if (err) {
              res.status(500).send('Internal server error');
          } else {
              res.status(200).send('Comment deleted successfully');
          }
      });
  }
};

export default forumManageController;