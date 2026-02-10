const DOCTOR_API = "http://localhost:3000/doctors";
const APPOINTMENT_API = "http://localhost:3000/appointments/doctor";

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

// Format date-time
function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Get doctor by ID
function getDoctorById() {
  const id = document.getElementById("doctorId").value;
  if (!id) return;

  document.getElementById("doctorError").innerText = "";

  fetch(`${DOCTOR_API}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Doctor not found");
      return res.json();
    })
    .then(doctor => {
      const info = document.getElementById("doctorInfo");
      info.classList.remove("d-none");
      info.innerHTML = `
        <h5>Doctor Details</h5>
        <p><b>Name:</b> ${doctor.name}</p>
        <p><b>Specialization:</b> ${doctor.specialization}</p>
        <p><b>Email:</b> ${doctor.email}</p>
        <p><b>Phone:</b> ${doctor.phone}</p>
      `;

      loadDoctorAppointments(id);
    })
    .catch(() => {
      document.getElementById("doctorInfo").classList.add("d-none");
      document.getElementById("appointmentsTable").innerHTML = "";
      document.getElementById("doctorError").innerText = "Doctor not found";
    });
}

// Get appointments of doctor
function loadDoctorAppointments(doctorId) {
  fetch(`${APPOINTMENT_API}/${doctorId}`)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("appointmentsTable");
      table.innerHTML = "";

      if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="text-center">No appointments</td></tr>`;
        return;
      }

      data.forEach(a => {
        table.innerHTML += `
          <tr>
            <td>${a.id}</td>
            <td>${a.patient}</td>
            <td>${formatDate(a.appointment_time)}</td>
            <td class="status-${a.status}">${a.status}</td>
          </tr>
        `;
      });
    });
}
