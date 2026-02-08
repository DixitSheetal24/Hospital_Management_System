const API_URL = "http://localhost:3000/doctors";

// Load doctors on page load
window.onload = fetchDoctors;

function fetchDoctors(){
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    doctorsData = data;
    renderTable();
  });
}


let currentPage = 1;
const rowsPerPage = 5;
let doctorsData = []; // store API response

function renderTable() {
  const tbody = document.getElementById("doctorsTable");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = doctorsData.slice(start, end);

  paginatedItems.forEach(d => {
    tbody.innerHTML += `
       <tr>
          <td>${d.id}</td>

          <td>
            <input type="text" id="name-${d.id}" value="${d.name}">
          </td>
           <td>
            <input type="text" id="specialization-${d.id}" value="${d.specialization}">
          </td>
          <td>
            <input type="email" id="email-${d.id}" value="${d.email}">
          </td>

          <td>
            <input type="text" id="phone-${d.id}" value="${d.phone}">
          </td>

          <td>
            <button class="btn btn-sm btn-primary me-2" onclick="updateDoctor(${d.id})">Update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Delete</button>
          </td>
        </tr>
      `;
  });
}


// function fetchDoctors() {
//  fetch(API_URL)
//   .then(res => res.json())
//   .then(data => {
//     const table = document.getElementById("doctorsTable");
//     table.innerHTML = "";

//     data.forEach(d => {
//       table.innerHTML += `
//         <tr>
//           <td>${d.id}</td>

//           <td>
//             <input type="text" id="name-${d.id}" value="${d.name}">
//           </td>
//            <td>
//             <input type="text" id="specialization-${d.id}" value="${d.specialization}">
//           </td>
//           <td>
//             <input type="email" id="email-${d.id}" value="${d.email}">
//           </td>

//           <td>
//             <input type="text" id="phone-${d.id}" value="${d.phone}">
//           </td>

//           <td>
//             <button class="btn btn-sm btn-primary me-2" onclick="updateDoctor(${d.id})">Update</button>
//             <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Delete</button>
//           </td>
//         </tr>
//       `;
//     });
//   });
// }

function addDoctor() {
  const name = document.getElementById("name").value;
  const specialization = document.getElementById("specialization").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

   if (!validateDoctorForm(name, email,specialization, phone)) return;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name,email,specialization, phone })
  })
  .then(res => res.json())
  .then(() => {
    fetchDoctors();
    document.getElementById("name").value = "";
    document.getElementById("specialization").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
  });
}

function deleteDoctor(id) {
  if (!confirm("Are you sure you want to delete this doctor?")) return;

  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    fetchDoctors(); // refresh table
  })
  .catch(err => console.error(err));
}

function updateDoctor(id) {
  const name = document.getElementById(`name-${id}`).value;
  const specialization = document.getElementById(`specialization-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;
  const phone = document.getElementById(`phone-${id}`).value;
  console.log(phone)
  
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, specialization, phone })
  })
  .then(res => {
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  })
  .then(() => {
    alert("Doctor updated successfully");
  })
  .catch(err => {
    console.error(err);
    alert("Error updating doctor");
  });
}

function validateDoctorForm(name, email,specialization, phone) {
  let isValid = true;

  // clear old errors
  document.getElementById("nameError").innerText = "";
  document.getElementById("emailError").innerText = "";
  document.getElementById("specializationError").innerText = "";
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

  // Specialization
  const specializationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!specialization || specialization.trim().length < 3) {
    document.getElementById("specializationError").innerText =
      "specialization must be at least 3 characters";
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


function nextPage() {
  if (currentPage * rowsPerPage < doctorsData.length) {
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
