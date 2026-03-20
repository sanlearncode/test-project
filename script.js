const API = "/.netlify/functions/names";

async function load() {
  try {
    const r = await fetch(API).then(r => r.json());
    const list = document.getElementById("list");
    const names = r.names || [];
    if (!names.length) {
      list.innerHTML = '<li class="empty">Chưa có tên nào.</li>';
      return;
    }
    list.innerHTML = names.map(n =>
      `<li>${n.name} <button onclick="del(${n.id})">xóa</button></li>`
    ).join("");
  } catch (err) {
    console.error("load error:", err);
  }
}

async function add() {
  const inp = document.getElementById("inp");
  const name = inp.value.trim();
  if (!name) return;
  await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
  inp.value = "";
  load();
}

async function del(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  load();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inp").addEventListener("keydown", e => e.key === "Enter" && add());
  load();
});