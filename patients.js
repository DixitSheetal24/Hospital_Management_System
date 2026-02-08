const API_URL = "http://localhost:3000/patients";

// Load patients on page load
window.onload = fetchPatients;

function fetchPatients() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      patientsData = data;
      renderTable();
    });
 }


function addPatient() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  if (!validatePatientForm(name, email, phone)) return;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone })
  })
    .then(res => res.json())
    .then(() => {
      fetchPatients();
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";
    });
}

function deletePatient(id) {
  if (!confirm("Are you sure you want to delete this Patient?")) return;
  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchPatients(); // refresh table
    })
    .catch(err => console.error(err));
}

function updatePatient(id) {
  const name = document.getElementById(`name-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;
  const phone = document.getElementById(`phone-${id}`).value;
  console.log(phone)

  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone })
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(() => {
      alert("Patient updated successfully");
    })
    .catch(err => {
      console.error(err);
      alert("Error updating Patients");
    });
}

function validatePatientForm(name, email, phone) {
  let isValid = true;

  // clear old errors
  document.getElementById("nameError").innerText = "";
  document.getElementById("emailError").innerText = "";
  document.getElementById("phoneError").innerText = "";

  // Name
  if (!name || name.trim().length < 3) {
    document.getElementById("nameError").innerText =
      "Name must be at least 3 characters";
    isValid = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").innerText =
      "Enter valid email address";
    isValid = false;
  }

  // Phone
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").innerText =
      "Phone must be 10 digits";
    isValid = false;
  }

  return isValid;
}

//================pagination================

let currentPage = 1;
const rowsPerPage = 5;
let doctorsData = []; // store API response

function renderTable() {
  const tbody = document.getElementById("patientsTable");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = patientsData.slice(start, end);

  paginatedItems.forEach(p => {
    tbody.innerHTML += `
       <tr>
             <td>${p.id}</td>
             <td>
               <input type="text" id="name-${p.id}" value="${p.name}">
             </td>  
             <td>
                <input type="email" id="email-${p.id}" value="${p.email}">
             </td>
             <td>
               <input type="text" id="phone-${p.id}" value="${p.phone}">
             </td>
             <td>
               <button class="btn btn-sm btn-primary me-2" onclick="updatePatient(${p.id})">Update</button>
               <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Delete</button>
             </td>
           </tr>
         `;
  });
}

function nextPage() {
  if (currentPage * rowsPerPage < patientsData.length) {
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


