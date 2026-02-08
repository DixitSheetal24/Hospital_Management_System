const PATIENT_API = "http://localhost:3000/patients";
const DOCTOR_API = "http://localhost:3000/doctors";
const APPOINTMENT_API = "http://localhost:3000/appointments";

window.onload = () => {
  loadPatients();
  loadDoctors();
  loadAppointments();
};


function loadPatients() {
  fetch(PATIENT_API)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("patient");
      select.innerHTML = "<option value=''>Select Patient</option>";
      data.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      });
    });
}

function loadDoctors() {
  fetch(DOCTOR_API)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("doctor");
      select.innerHTML = "<option value=''>Select Doctor</option>";
      data.forEach(d => {
        select.innerHTML += `<option value="${d.id}">${d.name}</option>`;
      });
    });
}

function bookAppointment() {
  const patient_id = document.getElementById("patient").value;
  const doctor_id = document.getElementById("doctor").value;
  const appointment_time = document.getElementById("time").value;



  // fetch("APPOINTMENT_API", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data)
  // });


  fetch(APPOINTMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_id,
      doctor_id,
      appointment_time,
      status: "scheduled"
    })
  })
    .then(res => res.json())
    .then(() => {
      alert("Appointment booked");
      loadAppointments();
    });
}

//========================================================
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

function  loadAppointments() {
  fetch(APPOINTMENT_API)
    .then(res => res.json())
    .then(data => {
      appointmentData = data;
      renderTable();
    });
}

let currentPage = 1;
const rowsPerPage = 5;
let appointmentData = []; // store API response

function renderTable() {
  const tbody = document.getElementById("appointmentsTable");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = appointmentData.slice(start, end);

  paginatedItems.forEach(a => {

    const time = formatDate(a.appointment_time)
    tbody.innerHTML += `
         <tr>
           <td>${a.id}</td>
             <td>${a.patient}</td>
             <td>${a.doctor}</td>
             <td>${time}</td>
           <td>
           <select onchange="updateStatus(${a.id}, this.value); changeStatusColor(this)">
             <option value="scheduled" ${a.status === "scheduled" ? "selected" : ""}>Scheduled</option>
             <option value="completed" ${a.status === "completed" ? "selected" : ""}>Completed</option>
             <option value="cancelled" ${a.status === "cancelled" ? "selected" : ""}>Cancelled</option>
           </select>
             </td>
           </tr>
         `;

  });
}

function changeStatusColor(select) {
  select.classList.remove(
    "status-scheduled",
    "status-completed",
    "status-cancelled"
  );

  if (select.value === "scheduled") {
    select.classList.add("status-scheduled");
  } else if (select.value === "completed") {
    select.classList.add("status-completed");
  } else if (select.value === "cancelled") {
    select.classList.add("status-cancelled");
  }
}

//==============================================================

function updateStatus(id, status) {
  fetch(`${APPOINTMENT_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(() => loadAppointments());
}
//==============================================================

function nextPage() {
  if (currentPage * rowsPerPage < appointmentData.length) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}


