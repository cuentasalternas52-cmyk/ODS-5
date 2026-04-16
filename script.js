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

        input.addEventListener("keypress", async function(e) {
            if (e.key === "Enter" && !esperando) {

                let msg = input.value.trim();
                if (msg === "") return;

                esperando = true;

                // mensaje usuario
                messages.innerHTML += `<div class="user-msg">${msg}</div>`;
                input.value = "";

                // escribiendo
                messages.innerHTML += `<div id="loading" class="bot-msg">Escribiendo...</div>`;
                scrollChat();

                try {
                    let res = await fetch("http://localhost:3000/chat", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ message: msg })
                    });

                    let data = await res.json();

                    document.getElementById("loading")?.remove();

                    messages.innerHTML += `<div class="bot-msg">${data.reply}</div>`;

                } catch (error) {
                    document.getElementById("loading")?.remove();
                    messages.innerHTML += `<div class="bot-msg">Error al conectar con la IA</div>`;
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

    cargarSeccion("dashboard1.php");

});


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