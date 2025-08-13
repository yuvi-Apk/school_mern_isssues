import pool from "../Config/db.js";
export const addFeesHeading = async (req, res) => {
  // Validate request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ 
      success: false, 
      error: "Invalid request body" 
    });
  }

  const { feesHeading, groupName, frequency, accountName, months } = req.body;

  // Validate required fields
  const requiredFields = { feesHeading, groupName, frequency, accountName, months };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields",
      missingFields 
    });
  }

  // Validate months is an array
  if (!Array.isArray(months)) {
    return res.status(400).json({ 
      success: false, 
      error: "Months must be an array" 
    });
  }

  try {
    // Begin transaction
    await pool.query('START TRANSACTION');

    // Check if fees heading already exists
    const [existing] = await pool.query(
      `SELECT id FROM fees_headings WHERE feesHeading = ?`,
      [feesHeading]
    );

    if (existing.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ 
        success: false, 
        error: "Fees heading already exists" 
      });
    }

    // Insert new fees heading
    const [result] = await pool.query(
      `INSERT INTO fees_headings 
       (feesHeading, groupName, frequency, accountName, months)
       VALUES (?, ?, ?, ?, ?)`,
      [
        feesHeading.trim(),
        groupName.trim(),
        frequency,
        accountName.trim(),
        JSON.stringify(months) // Store months as JSON string
      ]
    );

    // Commit transaction
    await pool.query('COMMIT');

    // Log successful creation
    console.log(`New fees heading created: ${feesHeading}`);

    return res.status(201).json({ 
      success: true, 
      message: "Fees heading created successfully",
      data: {
        id: result.insertId,
        feesHeading,
        groupName,
        frequency,
        accountName,
        months
      }
    });

  } catch (err) {
    // Rollback on error
    await pool.query('ROLLBACK');
    
    console.error("Database error:", err);
    
    // Handle specific database errors
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        error: "Fees heading already exists" 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateFeesPlan = async (req, res) => {
  const { id } = req.params;
  const { feesHeading, value, className, category } = req.body;

  if (!feesHeading || !value || !className || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields for update",
    });
  }

  try {
    const [result] = await pool.query(
      `UPDATE fees_plan SET feesHeading = ?, value = ?, className = ?, category = ? WHERE id = ?`,
      [feesHeading, value, className, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Fee plan not found" });
    }

    res.status(200).json({ success: true, message: "Fee plan updated successfully" });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deleteFeesPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM fees_plan WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Fee plan not found" });
    }

    res.status(200).json({ success: true, message: "Fee plan deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


export const addFeesPlan = async (req, res) => {
  const { feesHeading, value, classes, categories } = req.body;

  if (!feesHeading || !value || !classes || !categories) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: feesHeading, value, classes, or categories",
    });
  }

  if (!Array.isArray(classes) || !Array.isArray(categories)) {
    return res.status(400).json({
      success: false,
      message: "Classes and categories must be arrays",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sql = `
      INSERT INTO fees_plan (feesHeading, value, className, category)
      VALUES (?, ?, ?, ?)
    `;

    for (const cls of classes) {
      for (const cat of categories) {
        await connection.execute(sql, [feesHeading, value, cls, cat]);
      }
    }

    await connection.commit();
    res.status(200).json({ success: true, message: "Fee plan saved" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error saving fee plan:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
};



export const updateFeesHeading = async (req, res) => {
  const id = req.params.id;
  const { feesHeading, groupName, frequency, accountName, months } = req.body;
  try {
    const sql = `UPDATE fees_headings SET fees_heading=?, groupName=?, frequency=?, accountName=?, months=? WHERE id=?`;
    const values = [feesHeading, groupName, frequency, accountName, months.join(","), id];
    const [result] = await pool.query(sql, values);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteFeesHeading = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `DELETE FROM fees_headings WHERE id = ?`;
    await pool.query(sql, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getAllFeesPlans = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, feesHeading, value, className, category
      FROM fees_plan
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching fee plans:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fee plans",
      error: err.message,
    });
  }
};
export const getAllFeesHeadings = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT feesHeading FROM fees_headings`);
    
    // Corrected the property name from row.fees_heading to row.feesHeading
    const headings = rows.map((row) => row.feesHeading);

    res.status(200).json({ success: true, data: headings });
  } catch (err) {
    console.error("Error fetching fees headings:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Helper - Academic Year Months
 */
const academicMonths = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March"
];

/**
 * Apply Fees for Selected Months
 */

export const feesApply = async (req, res) => {

  const { admissionNumber, className, category, selectedMonths } = req.body;

  // 🔹 1. Detailed validation
  if (!admissionNumber) {
    return res.status(400).json({ success: false, message: "admissionNumber is required" });
  }
  if (!className) {
    return res.status(400).json({ success: false, message: "className is required" });
  }

  // if (!category) {
  //   return res.status(400).json({ success: false, message: "category is required" });
  // }
  // if (!Array.isArray(selectedMonths) || selectedMonths.length === 0) {
  //   return res.status(400).json({ success: false, message: "selectedMonths must be a non-empty array" });
  // }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 🔹 2. Get student
    const [[student]] = await connection.query(
      `SELECT * FROM students WHERE admissionNumber = ?`,
      [admissionNumber]
    );

    if (!student) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Student not found for the given admission number",
      });
    }

    const studentRoute = student.routeName || null;
    const feeBreakdown = [];

    // 🔹 3. Already applied months
    const placeholders = selectedMonths.map(() => "?").join(",");

    const [alreadyApplied] = await connection.query(
      `SELECT DISTINCT months FROM fees_register 
       WHERE admissionNumber = ? AND months IN (${placeholders})`,
      [admissionNumber, ...selectedMonths]
    );
    const appliedMonths = alreadyApplied.map(row => row.months);
    const monthsToApply = selectedMonths.filter(m => !appliedMonths.includes(m));

    if (monthsToApply.length === 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "Fees already applied for all selected months",
        alreadyApplied: appliedMonths,
      });
    }

    // 🔹 4. Academic fees
    const [feePlans] = await connection.query(
      `SELECT feesHeading, value FROM fees_plan WHERE className = ? AND category = ?`,
      [className, category]
    );

    // if (feePlans.length === 0) {
    //   await connection.rollback();
    //   return res.status(404).json({
    //     success: false,
    //     message: "No academic fee plan found for the given class & category",
    //   });
    // }

    feePlans.forEach(plan => {
      monthsToApply.forEach(month => {
        feeBreakdown.push({
          feesHeading: plan.feesHeading,
          month,
          originalAmount: Number(plan.value),
          finalAmount: Number(plan.value),
        });
      });
    });

    // 🔹 5. Transport fees
    if (studentRoute) {
      const [routePriceRows] = await connection.query(
        `SELECT price FROM route_plans WHERE class_name = ? AND category_name = ? AND route_name = ?`,
        [className, category, studentRoute]
      );
      const [routeMonthsRows] = await connection.query(
        `SELECT months FROM routes WHERE route_name = ?`,
        [studentRoute]
      );

      if (routePriceRows.length && routeMonthsRows.length) {
        const transportFee = Number(routePriceRows[0].price || 0);
        const validMonths = (routeMonthsRows[0].months || "")
          .split(",")
          .map(m => m.trim().toLowerCase());

        monthsToApply.forEach(month => {
          if (validMonths.includes(month.toLowerCase())) {
            feeBreakdown.push({
              feesHeading: "Transport Fee",
              month,
              originalAmount: transportFee,
              finalAmount: transportFee,
            });
          }
        });
      }
    }

    // 🔹 6. Insert into fees_register
  const recNoBase = `REC-${Date.now()}`;
    for (const month of monthsToApply) {
      const monthItems = feeBreakdown.filter(f => f.month === month);
      const fees = monthItems.reduce((sum, f) => sum + f.finalAmount, 0);
      const feeHeads = monthItems.map(f => f.feesHeading).join(", ");

      let lateFee = 0;
      const dueDate = new Date("2025-08-05");
      if (new Date() > dueDate) lateFee = 50;

      // const [discountRows] = await connection.query(
      //   `SELECT discount_amount FROM discounts WHERE admissionNumber = ? AND month = ?`,
      //   [admissionNumber, month]
      // );
      // const discount = discountRows.length ? Number(discountRows[0].discount_amount) || 0 : 0;

    const discount=0;
      
      const total =  discount;
      const balance = total;

      await connection.query(
         `INSERT INTO fees_register (
    date, admissionNumber, studentName,
    className, category, routeName, months, fees, lateFee,
    discount, total, receiptNo, balanceAmount, feesHeading
  ) VALUES (
    CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? 
  )`,
        
        [
          `${recNoBase}-${month}`,
          admissionNumber,
          student.roll_no || null,
          `${student.firstName} ${student.lastName}`.trim(),
          className,
          category,
          studentRoute,
          month,
          fees,
          lateFee,
          discount,
          total,
          balance,
          feeHeads,
        ]
      );
    }

    // 🔹 7. Delete from student_months safely
    if (monthsToApply.length > 0) {
      const delPlaceholders = monthsToApply.map(() => "?").join(",");
      await connection.query(
        `DELETE FROM student_months WHERE admissionNumber = (${admissionNumber}) AND month IN (${delPlaceholders})`,
        [admissionNumber, ...monthsToApply]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Fees applied successfully",
      appliedMonths: monthsToApply,
      skippedMonths: appliedMonths,
      breakdown: feeBreakdown,
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Apply Fees Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
};






/**
 * Get Pending Fees
 */

export const getPendingFees = async (req, res) => {
  const admissionNumber = req.method === "GET" ? req.query.admissionNumber : req.body.admissionNumber;

  if (!admissionNumber) {
    return res.status(400).json({
      success: false,
      message: "Admission number is required"
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Student Info
    const [studentRows] = await connection.query(
      `SELECT admissionNumber, firstName, lastName, class AS className, category, routeName 
       FROM students 
       WHERE admissionNumber = ?`,
      [admissionNumber]
    );
    if (studentRows.length === 0) throw new Error("Student not found");

    const student = {
      ...studentRows[0],
      fullName: `${studentRows[0].firstName} ${studentRows[0].lastName}`.trim()
    };

    // Pending Months
    const [pendingFromTable] = await connection.query(
      `SELECT month FROM student_months 
       WHERE admissionNumber = ? 
       ORDER BY FIELD(month, ${academicMonths.map(() => "?").join(",")})`,
      [admissionNumber, ...academicMonths]
    );

    let remainingMonths = pendingFromTable.length > 0
      ? pendingFromTable.map(row => row.month)
      : academicMonths;

    res.json({
      success: true,
      admissionNumber,
      student,
      remainingMonths
    });
  } catch (error) {
    console.error("❌ Error fetching pending fees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending fees",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Get Student by Admission No + Fee Details
 */
export const getStudentByAdmission = async (req, res) => {
  const { admissionNumber } = req.params;
  let connection;

  try {
    connection = await pool.getConnection();

    // Student Info
    const [studentResult] = await connection.query(
      "SELECT * FROM students WHERE admissionNumber = ?",
      [admissionNumber]
    );
    if (studentResult.length === 0) throw new Error("Student not found");

    const student = studentResult[0];

    // Available Months
    const [monthsResult] = await connection.query(
      "SELECT month FROM student_months WHERE admissionNumber = ? ORDER BY id ASC",
      [admissionNumber]
    );
    const months = monthsResult.map(m => m.month);

    // Pending Fees
    const [pendingResult] = await connection.query(
      `SELECT feesHeading, SUM(balance) as balance, 
              GROUP_CONCAT(month ORDER BY month) as months 
       FROM fees_register 
       WHERE admissionNumber = ? AND balance > 0 
       GROUP BY feesHeading`,
      [admissionNumber]
    );

    // Academic & Transport Fees
    const [feesPlanResult] = await connection.query(
      "SELECT feesHeading, value FROM fees_plan WHERE className = ? AND category = ?",
      [student.class, student.category]
    );
    const [routePlanResult] = await connection.query(
      "SELECT price FROM route_plans WHERE class_name = ? AND category_name = ? AND route_name = ?",
      [student.class, student.category, student.routeName]
    );

    const academicFees = feesPlanResult.map(f => ({ heading: f.feesHeading, amount: parseFloat(f.value) }));
    const transportFee = routePlanResult.length ? parseFloat(routePlanResult[0].price) : 0;
    const academicTotal = academicFees.reduce((acc, item) => acc + item.amount, 0);
    const monthlyTotal = academicTotal + transportFee;

    res.json({
      success: true,
      student,
      months,
      pendingFees: pendingResult || [],
      academicFees,
      transportFee,
      monthlyTotal
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Register Fee Payment
 */
export const fees_Register = async (req, res) => {
  const {
    date,
    rec_no,
    admissionNumber,
    student_name,
    className,
    category,
    routeName,
    months,
    fees = 0,
    total,
    recd_amt,
    balance,
    feesHeading,
    late_fee = 0,
    discount = 0
  } = req.body;

  // 🔹 1. Field-by-field validation
  if (!admissionNumber) {
    return res.status(400).json({ success: false, message: "admissionNumber is required" });
  }
  if (!date) {
    return res.status(400).json({ success: false, message: "date is required" });
  }
  if (!rec_no) {
    return res.status(400).json({ success: false, message: "rec_no (receipt number) is required" });
  }
  if (recd_amt === undefined) {
    return res.status(400).json({ success: false, message: "recd_amt (received amount) is required" });
  }
  if (!months || (Array.isArray(months) && months.length === 0)) {
    return res.status(400).json({ success: false, message: "months must be provided" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 🔹 2. Fetch student name if not provided
    let studentData = student_name;
    if (!student_name) {
      const [[student]] = await connection.query(
        "SELECT firstName, lastName FROM students WHERE admissionNumber = ?",
        [admissionNumber]
      );
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
      studentData = `${student.firstName || ""} ${student.lastName || ""}`.trim();
    }

    // 🔹 3. Normalize months to string
    const monthsValue = Array.isArray(months) ? months.join(",") : String(months);

    // 🔹 4. Convert amounts safely
    const numFees = Number(fees) || 0;
    const numLateFee = Number(late_fee) || 0;
    const numDiscount = Number(discount) || 0;
    const numRecd = Number(recd_amt) || 0;

    // ledger_amt = fees + late_fee
    const ledger_amt = numFees + numLateFee;

    // If total not provided, calculate = ledger_amt - discount
    const totalAmount = total !== undefined ? Number(total) : ledger_amt - numDiscount;

    // If balance not provided, calculate = total - received
    const balanceAmount = balance !== undefined ? Number(balance) : totalAmount - numRecd;

    // 🔹 5. Insert into fees_register
    await connection.query(
      `INSERT INTO fees_register (
        date, rec_no, admissionNumber, student_name, class, category, route,
        months, fees, late_fee, ledger_amt, discount, total, recd_amt, balance, feesHeading
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        date,
        rec_no,
        admissionNumber,
        studentData,
        className || null,
        category || null,
        routeName || null,
        monthsValue,
        numFees,
        numLateFee,
        ledger_amt,
        numDiscount,
        totalAmount,
        numRecd,
        balanceAmount,
        feesHeading || null
      ]
    );

    // 🔹 6. Response
    res.status(201).json({
      success: true,
      message: "Fees recorded successfully",
      data: {
        admissionNumber,
        student_name: studentData,
        months: monthsValue,
        ledger_amt,
        totalAmount,
        recd_amt: numRecd,
        balanceAmount
      }
    });

  } catch (error) {
    console.error("❌ Error recording fees:", error);
    res.status(500).json({ success: false, message: "Failed to record fees", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};


/**
 * Get All Fee Records (Optionally filtered by admissionNumber)
 */
export const getAllFeesRecords = async (req, res) => {
  const admissionNumber = req.query.admissionNumber || null;
  let connection;

  try {
    connection = await pool.getConnection();
    let query = `
      SELECT 
        fr.id, fr.date, fr.rec_no, fr.admissionNumber, fr.student_name,
        fr.class, fr.category, fr.months, fr.feesHeading,
        fr.fees, fr.recd_amt, fr.balance,
        r.receipt_no, r.payment_mode
      FROM fees_register fr
      LEFT JOIN receipts r 
      ON fr.admissionNumber = r.admissionNumber 
         AND fr.months = r.month 
         AND fr.feesHeading = r.feesHeading
    `;
    const params = [];

    if (admissionNumber) {
      query += " WHERE fr.admissionNumber = ?";
      params.push(admissionNumber);
    }

    query += " ORDER BY fr.date DESC, fr.id DESC";

    const [rows] = await connection.query(query, params);

    res.json({ success: true, records: rows });
  } catch (err) {
    console.error("❌ getAllFeesRecords Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
};
