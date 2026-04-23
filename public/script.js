document.addEventListener("DOMContentLoaded", () => {

    // ================= CHAT =================

    const chatBtn = document.getElementById("chatBtn");
    const chatBox = document.getElementById("chatBox");
    const input = document.getElementById("input");
    const messages = document.querySelector(".chat-box");

    // Abrir / cerrar chat
    if (chatBtn) {
        chatBtn.addEventListener("click", () => {
            chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
        });
    }


    // Enviar mensaje
    if (input && messages) {

        let esperando = false;

       input.addEventListener("keydown", async function(e) {
    if (e.key === "Enter" && !esperando) {

        let msg = input.value.trim();
        if (msg === "") return;

        esperando = true;

        const userDiv = document.createElement("div");
        userDiv.className = "user-msg";
        userDiv.textContent = msg;
        messages.appendChild(userDiv);

        input.value = "";

        const loading = document.createElement("div");
        loading.id = "loading";
        loading.className = "bot-msg";
        loading.textContent = "Escribiendo...";
        messages.appendChild(loading);

        scrollChat();

        try {
            let res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: msg })
            });

            if (!res.ok) throw new Error("Error API");

            let data = await res.json();

            loading.remove();

            const botDiv = document.createElement("div");
            botDiv.className = "bot-msg";
            botDiv.textContent = data.reply;
            messages.appendChild(botDiv);

        } catch (error) {
            loading.remove();

            const errDiv = document.createElement("div");
            errDiv.className = "bot-msg";
            errDiv.textContent = "Error al conectar con la IA";
            messages.appendChild(errDiv);

            console.error(error);
        }

        esperando = false;
        scrollChat();
    }
});
    }

    function scrollChat() {
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    // ================= SIDEBAR ACTIVO =================

    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function() {
            document.querySelectorAll(".sidebar ul li").forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ================= CARGAR INICIO =================

    cargarSeccion("inicio.html");

});

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


// ================= CARGAR SECCIONES =================

async function cargarSeccion(pagina) {

    const contenido = document.getElementById("contenido");

    if (!contenido) return;

    try {
        let res = await fetch(pagina);

        if (!res.ok) throw new Error("No carga");

        let html = await res.text();

        // animación salida
        contenido.style.opacity = 0;
        contenido.style.transform = "translateY(10px)";

        setTimeout(() => {
            contenido.innerHTML = html;

            // animación entrada
            contenido.style.opacity = 1;
            contenido.style.transform = "translateY(0)";
        }, 200);

    } catch (error) {
        contenido.innerHTML = "<p class='error'>Error cargando sección</p>";
        console.error(error);
    }
}