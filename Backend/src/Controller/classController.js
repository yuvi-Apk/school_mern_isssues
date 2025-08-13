import pool from "../Config/db.js";

export const addClass = async (req, res) => {
  const { name, sections } = req.body;
  if (!name || !Array.isArray(sections)) {
    return res.status(400).json({ error: "Class name and sections are required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [classResult] = await conn.query("INSERT INTO class (name) VALUES (?)", [name]);

    for (const section of sections) {
      await conn.query(
        "INSERT INTO section (name, class_id) VALUES (?, ?)",
        [section, classResult.insertId]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Class and sections saved", classId: classResult.insertId });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Class already exists" });
    } else {
      res.status(500).json({ error: "Database operation failed" });
    }
  } finally {
    conn.release();
  }
};

export const getClassesWithSections = async (req, res) => {
  try {
    const [classes] = await pool.query("SELECT * FROM class");
    const [sections] = await pool.query("SELECT * FROM section");

    const classMap = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      sections: sections
        .filter(sec => sec.class_id === cls.id)
        .map(sec => sec.name),
    }));

    res.status(200).json(classMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const addSection = async (req, res) => {
  const { name, classId } = req.body;

  if (!name || !classId) {
    return res.status(400).json({ error: "Section name and classId are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO section (name, class_id) VALUES (?, ?)",
      [name, classId]
    );

    res.status(201).json({
      message: "Section added",
      sectionId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding section:", error.message);
    res.status(500).json({ error: "Failed to add section" });
  }
};