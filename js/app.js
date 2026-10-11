// ============================================
// LITTERA v2 - Aplicacion principal
// ============================================
(function () {
    "use strict";

    var CLAVES = {
        notas: "littera.notas",
        obras: "littera.obras",
        tema: "littera.tema",
        mundo: "littera.mundo",
        colapsado: "littera.colapsado"
    };

    var MUNDOS = {
        escritorio:   { num: "",        titulo: "Escritorio" },
        scriptorium:  { num: "Mundo I",   titulo: "Scriptorium" },
        taller:       { num: "Mundo II",  titulo: "Taller" },
        biblioteca:   { num: "Mundo III", titulo: "Biblioteca" },
        laboratorio:  { num: "Mundo IV",  titulo: "Laboratorio" },
        imprenta:     { num: "Mundo V",   titulo: "Imprenta" },
        archivo:      { num: "Mundo VI",  titulo: "Archivo" },
        plaza:        { num: "Mundo VII", titulo: "Plaza" },
        ritual:       { num: "Mundo VIII",titulo: "Ritual" }
    };

    // ---------- Utilidades ----------
    function leer(clave, porDefecto) {
        try {
            var raw = localStorage.getItem(clave);
            if (raw === null) return porDefecto;
            return JSON.parse(raw);
        } catch (e) { return porDefecto; }
    }
    function escribir(clave, valor) {
        try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) {}
    }
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }
    function fechaCorta(iso) {
        var d = new Date(iso);
        var meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
        return d.getDate() + " " + meses[d.getMonth()] + " " + d.getFullYear();
    }
    function escaparHTML(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // Iconos SVG para empty states y listas
    var SVG_VACIO_NOTA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.4V19h8.6z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>';
    var SVG_VACIO_OBRA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>';
    var SVG_BORRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
    var SVG_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    // ---------- Navegacion ----------
    function irA(id) {
        if (!MUNDOS[id]) id = "escritorio";

        document.querySelectorAll(".mundo").forEach(function (m) {
            m.classList.toggle("activo", m.id === "mundo-" + id);
        });
        document.querySelectorAll(".nav-item").forEach(function (b) {
            b.classList.toggle("activo", b.dataset.mundo === id);
        });

        var miga = document.getElementById("miga-actual");
        if (miga && MUNDOS[id]) miga.textContent = MUNDOS[id].titulo;

        document.title = MUNDOS[id].titulo + " - Littera";

        try { localStorage.setItem(CLAVES.mundo, id); } catch (e) {}
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function initNav() {
        document.querySelectorAll(".nav-item").forEach(function (b) {
            b.addEventListener("click", function () { irA(b.dataset.mundo); });
        });

        // Cards del home con data-ir
        document.querySelectorAll("[data-ir]").forEach(function (card) {
            card.addEventListener("click", function () { irA(card.dataset.ir); });
        });

        var ultimo = "escritorio";
        try { ultimo = localStorage.getItem(CLAVES.mundo) || "escritorio"; } catch (e) {}
        irA(ultimo);
    }

    // ---------- Atajos de teclado 1-9 ----------
    function initAtajos() {
        var orden = ["escritorio","scriptorium","taller","biblioteca","laboratorio","imprenta","archivo","plaza","ritual"];
        document.addEventListener("keydown", function (e) {
            var tag = (e.target.tagName || "").toLowerCase();
            if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            var n = parseInt(e.key, 10);
            if (n >= 1 && n <= 9) {
                e.preventDefault();
                irA(orden[n - 1]);
            }
        });
    }

    // ---------- Colapsar sidebar ----------
    function initColapso() {
        var app = document.getElementById("app");
        var btn = document.getElementById("btn-colapsar");
        if (!app || !btn) return;

        var colapsado = leer(CLAVES.colapsado, false);
        if (colapsado) app.classList.add("colapsado");

        btn.addEventListener("click", function () {
            app.classList.toggle("colapsado");
            escribir(CLAVES.colapsado, app.classList.contains("colapsado"));
        });
    }

    // ---------- Tema ----------
    function initTema() {
        var guardado = leer(CLAVES.tema, "dia");
        document.documentElement.setAttribute("data-tema", guardado);
        document.querySelectorAll(".tema-btn").forEach(function (b) {
            b.classList.toggle("activo", b.dataset.tema === guardado);
            b.addEventListener("click", function () {
                var t = b.dataset.tema;
                document.documentElement.setAttribute("data-tema", t);
                escribir(CLAVES.tema, t);
                document.querySelectorAll(".tema-btn").forEach(function (x) {
                    x.classList.toggle("activo", x.dataset.tema === t);
                });
            });
        });
    }

    // ---------- Scriptorium ----------
    function initScriptorium() {
        var ta = document.getElementById("nota-input");
        var btn = document.getElementById("nota-guardar");
        var lista = document.getElementById("lista-notas");
        var contador = document.getElementById("contador-notas");
        if (!ta || !btn || !lista) return;

        function pintar() {
            var notas = leer(CLAVES.notas, []);
            lista.innerHTML = "";
            if (contador) contador.textContent = notas.length + (notas.length === 1 ? " nota" : " notas");

            if (notas.length === 0) {
                lista.innerHTML =
                    '<div class="estado-vacio">' +
                        '<div class="ev-icono">' + SVG_VACIO_NOTA + '</div>' +
                        '<div class="ev-titulo">Sin notas todavia</div>' +
                        '<div class="ev-desc">Captura la primera. Una imagen del mercado, una frase oida en el bus, un sueno de esta noche.</div>' +
                    '</div>';
                return;
            }

            notas.slice().reverse().forEach(function (n) {
                var div = document.createElement("div");
                div.className = "nota";
                div.innerHTML =
                    '<button class="nota-borrar" data-id="' + n.id + '" title="Borrar">' + SVG_BORRAR + '</button>' +
                    '<div class="nota-texto">' + escaparHTML(n.texto) + '</div>' +
                    '<div class="nota-meta">' +
                        '<span>' + fechaCorta(n.fecha) + '</span>' +
                        '<span>' + n.texto.length + ' car.</span>' +
                    '</div>';
                lista.appendChild(div);
            });

            lista.querySelectorAll(".nota-borrar").forEach(function (b) {
                b.addEventListener("click", function () {
                    var id = b.dataset.id;
                    var actuales = leer(CLAVES.notas, []);
                    escribir(CLAVES.notas, actuales.filter(function (x) { return x.id !== id; }));
                    pintar();
                });
            });
        }

        btn.addEventListener("click", function () {
            var texto = ta.value.trim();
            if (!texto) return;
            var actuales = leer(CLAVES.notas, []);
            actuales.push({ id: uid(), texto: texto, fecha: new Date().toISOString() });
            escribir(CLAVES.notas, actuales);
            ta.value = "";
            ta.focus();
            pintar();
        });

        ta.addEventListener("keydown", function (e) {
            if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); btn.click(); }
        });

        pintar();
    }

    // ---------- Taller ----------
    function initTaller() {
        var titulo = document.getElementById("titulo-obra");
        var lienzo = document.getElementById("lienzo-obra");
        var guardar = document.getElementById("guardar-obra");
        var contador = document.getElementById("contador-palabras");
        if (!titulo || !lienzo) return;

        var obraId = null;

        function contar() {
            var t = lienzo.value.trim();
            var palabras = t ? t.split(/\s+/).length : 0;
            var caracteres = lienzo.value.length;
            if (contador) contador.textContent = palabras + " palabras - " + caracteres + " caracteres";
        }

        function guardarObra() {
            var obras = leer(CLAVES.obras, []);
            var existente = obras.find(function (o) { return o.id === obraId; });
            var datos = {
                id: obraId || uid(),
                titulo: titulo.value.trim() || "Sin titulo",
                texto: lienzo.value,
                fecha: new Date().toISOString()
            };
            if (existente) Object.assign(existente, datos);
            else { obras.push(datos); obraId = datos.id; }
            escribir(CLAVES.obras, obras);

            var estado = document.getElementById("estado-guardado");
            if (estado) {
                var ahora = new Date();
                estado.textContent = "Guardado " + ahora.getHours().toString().padStart(2, "0") + ":" + ahora.getMinutes().toString().padStart(2, "0");
            }
        }

        var t = null;
        function autoguardar() {
            clearTimeout(t);
            t = setTimeout(guardarObra, 1500);
        }
        titulo.addEventListener("input", autoguardar);
        lienzo.addEventListener("input", function () { contar(); autoguardar(); });
        if (guardar) guardar.addEventListener("click", guardarObra);

        window.LitteraTaller = {
            cargar: function (id) {
                var obras = leer(CLAVES.obras, []);
                var o = obras.find(function (x) { return x.id === id; });
                if (!o) return;
                obraId = o.id;
                titulo.value = o.titulo;
                lienzo.value = o.texto;
                contar();
                irA("taller");
            },
            nueva: function () {
                obraId = null;
                titulo.value = "";
                lienzo.value = "";
                contar();
                irA("taller");
                setTimeout(function () { titulo.focus(); }, 100);
            }
        };

        contar();
    }

    // ---------- Archivo ----------
    function initArchivo() {
        var lista = document.getElementById("lista-obras");
        if (!lista) return;

        function pintar() {
            var obras = leer(CLAVES.obras, []);
            lista.innerHTML = "";

            if (obras.length === 0) {
                lista.innerHTML =
                    '<div class="estado-vacio">' +
                        '<div class="ev-icono">' + SVG_VACIO_OBRA + '</div>' +
                        '<div class="ev-titulo">El archivo esta vacio</div>' +
                        '<div class="ev-desc">Cuando escribas algo en el Taller, aparecera aqui. Todo se guarda automaticamente en este navegador.</div>' +
                    '</div>';
                return;
            }

            obras.slice().reverse().forEach(function (o) {
                var palabras = o.texto ? o.texto.trim().split(/\s+/).length : 0;
                var div = document.createElement("div");
                div.className = "obra-item";
                div.innerHTML =
                    '<div class="oi-marca">' + SVG_VACIO_OBRA + '</div>' +
                    '<div class="oi-cuerpo">' +
                        '<div class="oi-titulo">' + escaparHTML(o.titulo) + '</div>' +
                        '<div class="oi-meta">' + fechaCorta(o.fecha) + ' - ' + palabras + ' palabras</div>' +
                    '</div>' +
                    '<button class="btn btn-secundario" data-id="' + o.id + '">Abrir en Taller</button>';
                lista.appendChild(div);
            });

            lista.querySelectorAll("button[data-id]").forEach(function (b) {
                b.addEventListener("click", function () {
                    if (window.LitteraTaller) window.LitteraTaller.cargar(b.dataset.id);
                });
            });
        }

        document.querySelectorAll('.nav-item[data-mundo="archivo"]').forEach(function (b) {
            b.addEventListener("click", pintar);
        });

        pintar();
    }

    // ---------- Ritual ----------
    function initRitual() {
        var reloj = document.getElementById("temporizador");
        var btnIni = document.getElementById("ritual-iniciar");
        var btnPau = document.getElementById("ritual-pausar");
        var btnRei = document.getElementById("ritual-reiniciar");
        var frase = document.getElementById("ritual-frase");
        if (!reloj) return;

        var frases = [
            "Escribe sin miedo. La primera version es solo tuya.",
            "La pagina en blanco no es un enemigo: es una promesa.",
            "Un parrafo hoy vale mas que un libro manana.",
            "No corrijas mientras escribes. Ya habra tiempo.",
            "Si no sabes como seguir, cambia de escena.",
            "El ritmo se encuentra caminando, no sentado.",
            "Toda obra empieza siendo un desastre necesario.",
            "Escribe como si nadie fuera a leerte. Solo asi alguien te leera.",
            "El silencio tambien es material de escritura."
        ];

        var segundos = 25 * 60;
        var corriendo = false;
        var intervalo = null;

        function pintar() {
            var m = Math.floor(segundos / 60);
            var s = segundos % 60;
            reloj.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        }
        function tick() {
            if (segundos > 0) { segundos--; pintar(); }
            else {
                detener();
                if (frase) frase.textContent = "Sesion terminada. Descansa, camina, respira.";
            }
        }
        function iniciar() {
            if (corriendo) return;
            corriendo = true;
            intervalo = setInterval(tick, 1000);
        }
        function detener() {
            corriendo = false;
            clearInterval(intervalo);
        }
        function reiniciar() {
            detener();
            segundos = 25 * 60;
            pintar();
        }

        if (btnIni) btnIni.addEventListener("click", iniciar);
        if (btnPau) btnPau.addEventListener("click", detener);
        if (btnRei) btnRei.addEventListener("click", reiniciar);

        if (frase) frase.textContent = frases[Math.floor(Math.random() * frases.length)];
        pintar();
    }

    // ---------- Init ----------
    document.addEventListener("DOMContentLoaded", function () {
        initNav();
        initAtajos();
        initColapso();
        initTema();
        initScriptorium();
        // initTaller(); // desactivado - reemplazado por js/taller.js
        initArchivo();
        initRitual();
    });
})();

