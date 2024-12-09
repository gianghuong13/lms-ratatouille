import connection from "../../database/dbConnect.js";

const materialManageController = {
    createMaterial: async (req, res) => {
        const { uploaderId, moduleId, title, materialType, files } = req.body;
    
        if (!uploaderId || !moduleId || !title || !materialType || !files || files.length === 0) {
          return res.status(400).send('Missing required fields');
        }
    
        // Insert material info into the "materials" table
        const materialQuery = `INSERT INTO materials (uploader_id, module_id, title, material_type) VALUES (?, ?, ?, ?)`;
        connection.query(materialQuery, [uploaderId, moduleId, title, materialType], async (err, result) => {
          if (err) {
            console.error('Error inserting material into database:', err);
            return res.status(500).json({ error: 'Database query error' });
          }
    
          const materialId = result.insertId;
    
          // Map files to be inserted into the "materials_files" table
          try {
            // Use async/await with Promise.all for better handling of multiple file inserts
            const fileQueries = files.map(async (file) => {
              const fileQuery = `INSERT INTO materials_files (material_id, file_name, file_path) VALUES (?, ?, ?)`;
              return new Promise((resolve, reject) => {
                connection.query(fileQuery, [materialId, file.fileName, file.key], (err) => {
                  if (err) {
                    console.error('Error inserting file into materials_files table:', err);
                    reject(err);
                  }
                  resolve();
                });
              });
            });
    
            await Promise.all(fileQueries); // Wait for all file insertions to complete
    
            return res.status(201).json({ message: 'Material added successfully' });
          } catch (error) {
            console.error('Error handling files:', error);
            return res.status(500).json({ error: 'Database query error' });
          }
        });
    },

  // Fetch materials of all modules in a course: file json gồm các đối tượng module, mỗi module chứa module_id, module_name, descriptioon,
  // mảng materials, mỗi material chứa material_id, title, material_type, mảng files gồm các file: file_id, file_name, file_path
  getMaterialsByCourse: async (req, res) => { 
    const course_id = req.params.course_id;
    if (!course_id) {
      return res.status(400).send('Missing required fields');
    }
    const query = `
        SELECT 
            m.module_id,
            m.course_id,
            m.module_name,
            m.description,
            mat.material_id,
            mat.title,
            mat.material_type,
            mf.file_id,
            mf.file_name,
            mf.file_path
        FROM modules m
        LEFT JOIN materials mat ON m.module_id = mat.module_id
        LEFT JOIN materials_files mf ON mat.material_id = mf.material_id
        WHERE m.course_id = ?;
    `;

    connection.query(query, [course_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: `Database query error: ${err.message} ` });
        }

        if (results.length === 0) {
            return res.status(200).json([]);
        }
        
        const groupedMaterials = results.reduce((acc, row) => {
            const { module_id, module_name, description, material_id, title, material_type, file_id, file_name, file_path } = row;

            if (!acc[module_id]) {
                acc[module_id] = {
                    module_id,
                    module_name,
                    description,
                    materials: [],
                };
            }

            let material = acc[module_id].materials.find(m => m.material_id === material_id);

            if (!material) {
                material = {
                    material_id,
                    title,
                    material_type,
                    files: [],
                };
                acc[module_id].materials.push(material);
            }

            if (file_name && file_path) {
                material.files.push({ file_id, file_name, file_path });
            }

            return acc;
        }, {});

        const response = Object.values(groupedMaterials);

        return res.status(200).json(response);
    });
  },

  getMaterialsByModule: async (req, res) => {
    const { module_id } = req.params;
    if (!module_id) {
      return res.status(400).send('Missing module_id fields');
    }
    const query = `
        SELECT
            mat.module_id,
            mat.material_id,
            mat.title,
            mat.material_type,
            mf.file_id,
            mf.file_name,
            mf.file_path
        FROM materials mat
        LEFT JOIN materials_files mf ON mat.material_id = mf.material_id
        WHERE mat.module_id = ?;
    `;

    connection.query(query, [module_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: `Database query error: ${err.message} ` });
        }

        if (results.length === 0) {
            return res.status(200).json([]);
        }

        const groupedMaterials = results.reduce((acc, row) => {
            const { module_id, material_id, title, material_type, file_id, file_name, file_path } = row;

            let material = acc.find(m => m.material_id === material_id);

            if (!material) {
                material = {
                    module_id,
                    material_id,
                    title,
                    material_type,
                    files: [],
                };
                acc.push(material);
            }

            if (file_name && file_path) {
                material.files.push({ file_id, file_name, file_path });
            }

            return acc;
        }, []);

        const response = Object.values(groupedMaterials);

        return res.status(200).json(response);
    });
  },

};

export default materialManageController;
