const express = require("express")
const cors = require("cors")

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log("Server running on port 3000")
});

const db = require("./db")




app.post("/appointments", (req, res) => {
    const { patient_id, doctor_id, appointment_time, status } = req.body;

  
    // 1️⃣ Check doctor availability
    const checkSql = `
    SELECT * FROM appointments
    WHERE doctor_id = ? AND appointment_time = ?
  `;

    db.query(checkSql, [doctor_id, appointment_time], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res
                .status(400)
                .json({ message: "Doctor already has an appointment at this time" });
        }

        // 2️⃣ Book appointment


        const insertSql = `
      INSERT INTO appointments
      (patient_id, doctor_id, appointment_time, status)
      VALUES (?, ?, ?, ?)
    `;

        db.query(
            insertSql,
            [patient_id, doctor_id, appointment_time, status],
            err => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Appointment booked successfully" });
            }
        );
    });
});


/**====Read==== */



app.get("/appointments", (req, res) => {


    const sql = `
    SELECT a.id, p.name AS patient, d.name AS doctor,
           a.appointment_time, a.status
    FROM appointments a

    JOIN patients p ON a.patient_id = p.id

    JOIN doctors d ON a.doctor_id = d.id
    
    ORDER BY a.appointment_time 
  `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });


})

/**====update==== */

app.put("/appointments/:id", (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    // 1️⃣ Check existence
    db.query(
        "SELECT * FROM appointments WHERE id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({ message: "Appointment not found" });
            }

            // 2️⃣ Update
            db.query(
                "UPDATE appointments SET status = ? WHERE id = ?",
                [status, id],
                err => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Appointment status updated" });
                }
            );
        }
    );
});

/**====delete==== */
app.delete("/appointments/:id", (req, res) => {
    const id = req.params.id;

    // 1️⃣ Check appointment
    db.query(
        "SELECT status FROM appointments WHERE id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({ message: "Appointment not found" });
            }

            // 2️⃣ Business rule
            if (result[0].status === "Completed") {
                return res
                    .status(400)
                    .json({ message: "Completed appointment cannot be deleted" });
            }

            // 3️⃣ Delete
            db.query(
                "DELETE FROM appointments WHERE id = ?",
                [id],
                err => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Appointment deleted" });
                }
            );
        }
    );
});

/**=============
 * Patient Crud
 * =============
 */

//CREATE PATIENT

app.post("/patients", (req, res) => {
    const { name, email, phone } = req.body;

    const sql = `
    INSERT INTO patients (name, email, phone)
    VALUES (?, ?, ?)
  `;

    db.query(sql, [name, email, phone], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Patient added", id: result.insertId });
    });
});


//READ PATIENT

app.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//UPDATE PATIENT

app.put("/patients/:id", (req, res) => {
    const { name, email, phone } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE patients SET name=?, email=?, phone=? WHERE id=?",
        [name, email, phone, id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Patient updated" });
        }
    );
});


//DELETE PATIENT

app.delete("/patients/:id", (req, res) => {
    const id = req.params.id;

    // prevent deleting if patient has appointments
    db.query(
        "SELECT * FROM appointments WHERE patient_id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length > 0) {
                return res
                    .status(400)
                    .json({ message: "Patient has appointments, cannot delete" });
            }

            db.query(
                "DELETE FROM patients WHERE id = ?",
                [id],
                err => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Patient deleted" });
                }
            );
        }
    );
});

//==========================//
//==DOCTOR CRUD OPERATIONS==//
//==========================//

//CREATE DOCTOR

app.post("/doctors", (req, res) => {
    const { name, email, specialization, phone } = req.body;

    const sql = `
    INSERT INTO doctors (name, email, specialization,phone)
    VALUES (?, ?, ?, ?)
  `;

    db.query(sql, [name, email, specialization, phone], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Doctor added", id: result.insertId });
    });
});

//READ DOCTORS

app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM doctors", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//UPDATE DOCTOR

app.put("/doctors/:id", (req, res) => {
    const { name, email, specialization, phone } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE doctors SET name=?, email=?, specialization=? ,phone=? WHERE id=?",
        [name, email, specialization, phone, id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Doctor updated" });
        }
    );
});

//DELETE DOCTOR

app.delete("/doctors/:id", (req, res) => {
    const id = req.params.id;

    // prevent deleting if patient has appointments
    db.query(
        "SELECT * FROM appointments WHERE doctor_id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length > 0) {
                return res
                    .status(400)
                    .json({ message: "doctor has appointments, cannot delete" });
            }

            db.query(
                "DELETE FROM doctors WHERE id = ?",
                [id],
                err => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "doctor deleted" });
                }
            );
        }
    );
});
