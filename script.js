const API = "/.netlify/functions/api";

// Load dữ liệu
async function loadData() {
  const res = await fetch(API);
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(user => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${user.name}
      <button onclick="deleteName(${user.id})">Xóa</button>
    `;

    list.appendChild(li);
  });
}

// Thêm tên
async function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value;

  await fetch(API, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  input.value = "";
  loadData();
}

// Xóa tên
async function deleteName(id) {
  await fetch(API, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  loadData();
}

// chạy khi mở web
loadData();
