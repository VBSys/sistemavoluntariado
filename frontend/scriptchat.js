const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const username = prompt("Digite seu nome:");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value) return;
  socket.emit("chat message", { user: username, text: input.value });
  input.value = "";
});

socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = `${msg.user}: ${msg.text}`;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});
