import pool from "../Config/db.js"


 export const CreateRoute= (req, res) => {
  const { route_name, frequency, months } = req.body;
  if (!route_name || !frequency || !months) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const monthsStr = Array.isArray(months) ? months.join(",") : months;

  const sql = "INSERT INTO routes (route_name, frequency, months) VALUES (?, ?, ?)";
  pool.query(sql, [route_name, frequency, monthsStr], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Route created successfully", id: result.insertId });
  });
}

export const GetAllRoutes=(req, res) => {
  pool.query("SELECT * FROM routes", (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const routes = results.map(route => ({
      ...route,
      months: route.months.split(",")
    }));
    res.json(routes);
  });
}
export const UpdateRoutes=(req, res) => {
  const { id } = req.params;
  const { route_name, frequency, months } = req.body;

  if (!route_name || !frequency || !months) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const monthsStr = Array.isArray(months) ? months.join(",") : months;

  const sql = "UPDATE routes SET route_name = ?, frequency = ?, months = ? WHERE id = ?";
  pool.query(sql, [route_name, frequency, monthsStr, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Route not found" });
    res.json({ message: "Route updated successfully" });
  });
}





export const DeleteRoutes=(req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM routes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Route not found" });
    res.json({ message: "Route deleted successfully" });
  });
}


