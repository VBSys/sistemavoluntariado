document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const userId = Number(prompt("Informe seu ID de usuário:"));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "pt-br",
    height: "auto",
    dateClick: (info) => {
      const data = info.dateStr;
      const hora = prompt("Hora (HH:mm):");
      const descricao = prompt("Descrição do encontro:");

      fetch("/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voluntarioId: userId,
          beneficiarioId: userId,
          data,
          hora,
          descricao,
        }),
      })
        .then((res) => res.json())
        .then((evento) => {
          calendar.addEvent({
            id: String(evento.id),
            title: `${evento.hora} – ${evento.descricao}`,
            start: evento.data,
          });
        });
    },
  });

  fetch(`/agenda/${userId}`)
    .then((res) => res.json())
    .then((events) => {
      events.forEach((e) =>
        calendar.addEvent({
          id: String(e.id),
          title: `${e.hora} – ${e.descricao}`,
          start: e.data,
        })
      );
    });

  calendar.render();
});
