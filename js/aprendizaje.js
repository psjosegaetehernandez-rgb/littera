// ============================================
// LITTERA v4 - Logica del modulo de aprendizaje
// Flashcards, SM-2, ejercicios, progreso
// ============================================
(function () {
    "use strict";

    if (!window.LITTERA_CONTENIDO) {
        console.warn("Contenido no cargado");
        return;
    }

    var CONT = window.LITTERA_CONTENIDO;
    var CLAVE_ESTADO = "littera.fichas.estado";
    var CLAVE_STATS = "littera.fichas.stats";

    // ---------- Utilidades ----------
    function leer(clave, porDefecto) {
        try {
            var raw = localStorage.getItem(clave);
            if (raw === null) return porDefecto;
            return JSON.parse(raw);
        } catch (e) { return porDefecto; }
    }
    function escribir(clave, valor) {
        try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
        catch (e) { return false; }
    }
    function colorCategoria(catId) {
        var c = CONT.categorias.find(function (x) { return x.id === catId; });
        return c ? c.color : "#8B2E2E";
    }
    function nombreCategoria(catId) {
        var c = CONT.categorias.find(function (x) { return x.id === catId; });
        return c ? c.nombre : catId;
    }
    function escaparHTML(s) {
        return String(s || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // ---------- Estado SM-2 simplificado ----------
    // Cada ficha tiene un estado: {intervalo (dias), factor, proximo (ISO), repeticiones, ultima (ISO)}
    function getEstado(id) {
        var todo = leer(CLAVE_ESTADO, {});
        return todo[id] || {
            intervalo: 0,
            factor: 2.5,
            proximo: new Date().toISOString(),
            repeticiones: 0,
            ultima: null
        };
    }
    function setEstado(id, estado) {
        var todo = leer(CLAVE_ESTADO, {});
        todo[id] = estado;
        escribir(CLAVE_ESTADO, todo);
    }
    function evaluarFicha(id, calidad) {
        // calidad: 0=otra, 1=dificil, 2=bien, 3=facil
        var e = getEstado(id);
        var factor = e.factor;
        var intervalo = e.intervalo;

        // SM-2 adaptado
        if (calidad === 0) {
            intervalo = 0;
            factor = Math.max(1.3, factor - 0.20);
        } else if (calidad === 1) {
            intervalo = Math.max(1, Math.round(intervalo * 1.2)) || 1;
            factor = Math.max(1.3, factor - 0.15);
        } else if (calidad === 2) {
            intervalo = intervalo === 0 ? 1 : Math.round(intervalo * factor);
        } else {
            intervalo = intervalo === 0 ? 3 : Math.round(intervalo * factor * 1.3);
            factor = Math.min(3.0, factor + 0.15);
        }

        var proximo = new Date();
        proximo.setDate(proximo.getDate() + (calidad === 0 ? 0 : intervalo));

        var nuevo = {
            intervalo: intervalo,
            factor: factor,
            proximo: proximo.toISOString(),
            repeticiones: (e.repeticiones || 0) + 1,
            ultima: new Date().toISOString()
        };
        setEstado(id, nuevo);

        // Actualizar stats
        var stats = leer(CLAVE_STATS, { sesiones: 0, evaluaciones: 0, racha: 0, ultimaSesion: null });
        stats.evaluaciones = (stats.evaluaciones || 0) + 1;
        escribir(CLAVE_STATS, stats);
        return nuevo;
    }

    function esFichaDebida(id) {
        var e = getEstado(id);
        if (!e.ultima) return true; // nunca vista
        return new Date(e.proximo) <= new Date();
    }

    function contarEstado() {
        var estado = leer(CLAVE_ESTADO, {});
        var r = { total: CONT.fichas.length, nuevas: 0, aprendiendo: 0, dominadas: 0, debidas: 0 };
        CONT.fichas.forEach(function (f) {
            var e = estado[f.id];
            if (!e || !e.ultima) {
                r.nuevas++;
                r.debidas++;
            } else {
                if (e.repeticiones >= 5 && e.intervalo >= 21) r.dominadas++;
                else r.aprendiendo++;
                if (esFichaDebida(f.id)) r.debidas++;
            }
        });
        return r;
    }

    // ---------- Iconos ----------
    var SVG = {
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        carta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
        libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        pluma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.4V19h8.6z"/><line x1="16" y1="8" x2="2" y2="22"/></svg>',
        girar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
        grafico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        llama: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 3 3 5 3 7a3 3 0 0 1-6 0c0-2 2-4 3-7z"/><path d="M5 22h14"/><path d="M12 22v-8"/></svg>'
    };

    // ---------- Render de explorar ----------
    function renderExplorar(estadoActual) {
        var panel = document.getElementById("bib-panel-explorar");
        if (!panel) return;

        var catActiva = estadoActual.catActiva || "todas";
        var fichasFiltradas = CONT.fichas.filter(function (f) {
            return catActiva === "todas" || f.categoria === catActiva;
        });

        var cuentaPorCat = {};
        CONT.fichas.forEach(function (f) {
            cuentaPorCat[f.categoria] = (cuentaPorCat[f.categoria] || 0) + 1;
        });

        var html = '<div class="cat-filtros">';
        html += '<button class="cat-chip ' + (catActiva === "todas" ? "activo" : "") + '" data-cat="todas">Todas <span class="cat-cuenta">' + CONT.fichas.length + '</span></button>';
        CONT.categorias.forEach(function (c) {
            html += '<button class="cat-chip ' + (catActiva === c.id ? "activo" : "") + '" data-cat="' + c.id + '">' + escaparHTML(c.nombre) + ' <span class="cat-cuenta">' + (cuentaPorCat[c.id] || 0) + '</span></button>';
        });
        html += '</div>';

        html += '<div class="fichas-grid">';
        fichasFiltradas.forEach(function (f) {
            var e = getEstado(f.id);
            var claseEstado = "fm-estado";
            var iconoEstado = "";
            if (e.ultima) {
                if (e.repeticiones >= 5 && e.intervalo >= 21) {
                    claseEstado += " dominada";
                    iconoEstado = SVG.check;
                } else {
                    claseEstado += " aprendiendo";
                }
            }
            var color = colorCategoria(f.categoria);

            html += '<div class="ficha-mini" data-ficha="' + f.id + '" style="--ficha-color: ' + color + '">';
            html += '<div class="fm-top">';
            html += '<span class="fm-cat">' + escaparHTML(nombreCategoria(f.categoria)) + '</span>';
            html += '<span class="' + claseEstado + '">' + iconoEstado + '</span>';
            html += '</div>';
            html += '<div class="fm-termino">' + escaparHTML(f.termino) + '</div>';
            html += '<div class="fm-definicion">' + escaparHTML(f.definicion) + '</div>';
            html += '<div class="fm-pie"><span>' + (f.autores && f.autores[0] ? escaparHTML(f.autores[0]) : "—") + '</span><span>' + f.id.toUpperCase() + '</span></div>';
            html += '</div>';
        });
        html += '</div>';

        panel.innerHTML = html;

        panel.querySelectorAll(".cat-chip").forEach(function (b) {
            b.addEventListener("click", function () {
                estadoActual.catActiva = b.dataset.cat;
                renderExplorar(estadoActual);
            });
        });
        panel.querySelectorAll(".ficha-mini").forEach(function (el) {
            el.addEventListener("click", function () {
                abrirDetalle(el.dataset.ficha);
            });
        });
    }

    // ---------- Detalle de ficha (modal) ----------
    function abrirDetalle(id) {
        var f = CONT.fichas.find(function (x) { return x.id === id; });
        if (!f) return;
        var color = colorCategoria(f.categoria);

        var overlay = document.createElement("div");
        overlay.className = "ficha-detalle-overlay";

        var html = '<div class="ficha-detalle" style="--ficha-color: ' + color + '">';
        html += '<button class="fd-cerrar" title="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        html += '<div class="fdet-categoria">' + escaparHTML(nombreCategoria(f.categoria)) + '</div>';
        html += '<div class="fdet-termino">' + escaparHTML(f.termino) + '</div>';
        if (f.etimologia) html += '<div class="fdet-etimologia">' + escaparHTML(f.etimologia) + '</div>';

        html += '<div class="fdet-bloque"><div class="fdet-bloque-titulo">Definicion</div><div class="fdet-texto">' + escaparHTML(f.definicion) + '</div></div>';
        if (f.ejemplo) {
            html += '<div class="fdet-bloque"><div class="fdet-bloque-titulo">Ejemplo</div><div class="fdet-ejemplo">' + escaparHTML(f.ejemplo) + (f.fuente ? '<span class="fuente">— ' + escaparHTML(f.fuente) + '</span>' : '') + '</div></div>';
        }
        if (f.efecto) html += '<div class="fdet-bloque"><div class="fdet-bloque-titulo">Efecto retorico</div><div class="fdet-texto">' + escaparHTML(f.efecto) + '</div></div>';

        if (f.relacionados && f.relacionados.length) {
            html += '<div class="fdet-bloque"><div class="fdet-bloque-titulo">Terminos relacionados</div><div class="fdet-tags">';
            f.relacionados.forEach(function (r) {
                var rel = CONT.fichas.find(function (x) { return x.id === r; });
                html += '<span class="fdet-tag">' + escaparHTML(rel ? rel.termino : r) + '</span>';
            });
            html += '</div></div>';
        }
        if (f.autores && f.autores.length) {
            html += '<div class="fdet-bloque"><div class="fdet-bloque-titulo">Autores de referencia</div><div class="fdet-tags">';
            f.autores.forEach(function (a) { html += '<span class="fdet-tag">' + escaparHTML(a) + '</span>'; });
            html += '</div></div>';
        }

        html += '</div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        function cerrar() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
        overlay.querySelector(".fd-cerrar").addEventListener("click", cerrar);
        overlay.addEventListener("click", function (e) { if (e.target === overlay) cerrar(); });
        document.addEventListener("keydown", function esc(e) {
            if (e.key === "Escape") { cerrar(); document.removeEventListener("keydown", esc); }
        });
    }

    // ---------- Estudio con flashcards ----------
    var estudioEstado = {
        cola: [],
        indice: 0,
        volteada: false,
        sesion: 0
    };

    function iniciarEstudio() {
        var catActiva = estudioEstado.catActiva || "todas";
        var fichas = CONT.fichas.filter(function (f) {
            return catActiva === "todas" || f.categoria === catActiva;
        });
        // Ordenar: primero las debidas, luego las nuevas
        var debidas = fichas.filter(function (f) { return esFichaDebida(f.id); });
        // Barajar
        debidas = debidas.sort(function () { return Math.random() - 0.5; });
        estudioEstado.cola = debidas;
        estudioEstado.indice = 0;
        estudioEstado.volteada = false;
        estudioEstado.sesion = debidas.length;
        renderEstudio();
    }

    function renderEstudio() {
        var panel = document.getElementById("bib-panel-estudiar");
        if (!panel) return;

        if (estudioEstado.cola.length === 0 || estudioEstado.indice >= estudioEstado.cola.length) {
            // Sesion terminada o vacia
            if (estudioEstado.cola.length === 0) {
                panel.innerHTML =
                    '<div class="estudio-vacio">' +
                        '<div class="ev-icono">' + SVG.check + '</div>' +
                        '<div class="ev-titulo">Nada que estudiar por ahora</div>' +
                        '<div class="ev-desc">Has repasado todas las fichas debidas. Vuelve mañana o explora la seccion de explorar para descubrir nuevas.</div>' +
                        '<button class="btn btn-primario" data-reiniciar style="margin-top:var(--e-4);">' + SVG.girar + 'Repasar todas</button>' +
                    '</div>';
                panel.querySelector("[data-reiniciar]").addEventListener("click", function () {
                    estudioEstado.cola = CONT.fichas.slice().sort(function () { return Math.random() - 0.5; });
                    estudioEstado.indice = 0;
                    estudioEstado.volteada = false;
                    renderEstudio();
                });
            } else {
                // Fin de sesion
                panel.innerHTML =
                    '<div class="estudio-vacio">' +
                        '<div class="ev-icono">' + SVG.check + '</div>' +
                        '<div class="ev-titulo">Sesion completa</div>' +
                        '<div class="ev-desc">Has repasado ' + estudioEstado.sesion + ' fichas. El sistema ha programado la proxima revision segun lo que recordaste.</div>' +
                        '<button class="btn btn-primario" data-reiniciar style="margin-top:var(--e-4);">' + SVG.girar + 'Nueva sesion</button>' +
                    '</div>';
                panel.querySelector("[data-reiniciar]").addEventListener("click", iniciarEstudio);
            }
            return;
        }

        var f = estudioEstado.cola[estudioEstado.indice];
        var color = colorCategoria(f.categoria);
        var progreso = ((estudioEstado.indice) / estudioEstado.cola.length) * 100;

        var html = '<div class="estudio-wrap" style="--ficha-color: ' + color + '">';

        html += '<div class="estudio-info">';
        html += '<span>' + (estudioEstado.indice + 1) + ' / ' + estudioEstado.cola.length + '</span>';
        html += '<div class="ei-progreso"><div class="ei-barra" style="width:' + progreso + '%"></div></div>';
        html += '<span>' + escaparHTML(nombreCategoria(f.categoria)) + '</span>';
        html += '</div>';

        html += '<div class="flashcard" id="fc-actual">';
        html += '<div class="flashcard-inner">';

        // Frente
        html += '<div class="flashcard-cara flashcard-frente">';
        html += '<div class="ff-categoria">' + escaparHTML(nombreCategoria(f.categoria)) + '</div>';
        html += '<div class="ff-termino">' + escaparHTML(f.termino) + '</div>';
        if (f.etimologia) html += '<div class="ff-etimologia">' + escaparHTML(f.etimologia) + '</div>';
        html += '<div class="ff-hint">' + SVG.girar + 'Presiona para ver la ficha</div>';
        html += '</div>';

        // Dorso
        html += '<div class="flashcard-cara flashcard-dorso">';
        html += '<div class="fd-cabecera">';
        html += '<span class="fd-termino-mini">' + escaparHTML(f.termino) + '</span>';
        html += '<span class="fd-categoria-mini">' + escaparHTML(nombreCategoria(f.categoria)) + '</span>';
        html += '</div>';
        html += '<div class="fd-bloque"><div class="fd-bloque-titulo">Definicion</div><div class="fd-definicion">' + escaparHTML(f.definicion) + '</div></div>';
        if (f.ejemplo) {
            html += '<div class="fd-bloque"><div class="fd-bloque-titulo">Ejemplo</div><div class="fd-ejemplo">' + escaparHTML(f.ejemplo) + (f.fuente ? '<span class="fd-fuente">' + escaparHTML(f.fuente) + '</span>' : '') + '</div></div>';
        }
        if (f.efecto) {
            html += '<div class="fd-bloque"><div class="fd-bloque-titulo">Efecto</div><div class="fd-efecto">' + escaparHTML(f.efecto) + '</div></div>';
        }
        if (f.relacionados && f.relacionados.length) {
            html += '<div class="fd-bloque"><div class="fd-bloque-titulo">Ver tambien</div><div class="fd-tags">';
            f.relacionados.forEach(function (r) {
                var rel = CONT.fichas.find(function (x) { return x.id === r; });
                if (rel) html += '<span class="fd-tag">' + escaparHTML(rel.termino) + '</span>';
            });
            html += '</div></div>';
        }
        html += '</div>'; // dorso

        html += '</div></div>'; // inner, flashcard

        html += '<div class="estudio-acciones" id="ea">';
        html += '<button class="btn-eval otra" data-cal="0"><span class="be-titulo">Otra vez</span><span class="be-tiempo">en <span>1</span> min</span></button>';
        html += '<button class="btn-eval dificil" data-cal="1"><span class="be-titulo">Dificil</span><span class="be-tiempo">en <span>1</span> d</span></button>';
        html += '<button class="btn-eval bien" data-cal="2"><span class="be-titulo">Bien</span><span class="be-tiempo">en <span>3</span> d</span></button>';
        html += '<button class="btn-eval facil" data-cal="3"><span class="be-titulo">Facil</span><span class="be-tiempo">en <span>7</span> d</span></button>';
        html += '</div>';

        html += '</div>';
        panel.innerHTML = html;

        var fc = document.getElementById("fc-actual");
        var ea = document.getElementById("ea");

        fc.addEventListener("click", function (e) {
            if (e.target.closest(".btn-eval")) return;
            fc.classList.toggle("volteada");
            estudioEstado.volteada = fc.classList.contains("volteada");
            if (estudioEstado.volteada) ea.classList.add("visible");
            else ea.classList.remove("visible");
        });

        panel.querySelectorAll(".btn-eval").forEach(function (b) {
            b.addEventListener("click", function (e) {
                e.stopPropagation();
                var cal = parseInt(b.dataset.cal, 10);
                evaluarFicha(f.id, cal);
                estudioEstado.indice++;
                estudioEstado.volteada = false;
                renderEstudio();
            });
        });
    }

    // ---------- Ejercicios ----------
    var ejEstado = {
        indice: 0,
        respondido: false,
        correctas: 0,
        total: 0
    };

    function iniciarEjercicios() {
        ejEstado.indice = 0;
        ejEstado.respondido = false;
        ejEstado.correctas = 0;
        ejEstado.total = CONT.ejercicios.length;
        // Barajar
        ejEstado.orden = CONT.ejercicios.map(function (_, i) { return i; }).sort(function () { return Math.random() - 0.5; });
        renderEjercicio();
    }

    function renderEjercicio() {
        var panel = document.getElementById("bib-panel-ejercicios");
        if (!panel) return;

        if (ejEstado.indice >= ejEstado.total) {
            var pct = Math.round((ejEstado.correctas / ejEstado.total) * 100);
            panel.innerHTML =
                '<div class="estudio-vacio">' +
                    '<div class="ev-icono">' + SVG.check + '</div>' +
                    '<div class="ev-titulo">' + ejEstado.correctas + ' de ' + ejEstado.total + ' correctas</div>' +
                    '<div class="ev-desc">' + (pct >= 80 ? "Excelente. Tu oido retorico esta afinado." : pct >= 50 ? "Buen trabajo. Repasa las que fallaste y vuelve." : "Vuelve a las fichas de explorar. La practica hace al maestro.") + '</div>' +
                    '<button class="btn btn-primario" data-reiniciar style="margin-top:var(--e-4);">' + SVG.girar + 'Otra ronda</button>' +
                '</div>';
            panel.querySelector("[data-reiniciar]").addEventListener("click", iniciarEjercicios);
            return;
        }

        var idx = ejEstado.orden[ejEstado.indice];
        var ej = CONT.ejercicios[idx];
        var color = colorCategoria(ej.categoria);

        var html = '<div class="ejercicio-wrap">';
        html += '<div class="ejercicio-tipo" style="color:' + color + '">' + escaparHTML(nombreCategoria(ej.categoria)) + ' · ' + (ej.tipo === "multiple" ? "Opcion multiple" : "Completar") + '</div>';
        html += '<div class="ejercicio-card">';
        html += '<div class="ejercicio-pregunta">' + ej.pregunta + '</div>';

        if (ej.tipo === "multiple") {
            var letras = ["A", "B", "C", "D", "E"];
            html += '<div class="ejercicio-opciones">';
            ej.opciones.forEach(function (op, i) {
                html += '<button class="opcion" data-idx="' + i + '"><span class="op-letra">' + letras[i] + '</span><span>' + escaparHTML(op) + '</span></button>';
            });
            html += '</div>';
        } else {
            html += '<div class="completar-frase"><input type="text" class="completar-input" id="comp-input" placeholder="Escribe aqui" autocomplete="off" spellcheck="false"></div>';
            html += '<div style="text-align:center;margin-top:var(--e-4);"><button class="btn btn-primario" id="comp-comprobar">Comprobar</button></div>';
        }

        html += '<div id="ej-feedback"></div>';

        html += '<div class="ejercicio-pie">';
        html += '<span class="ejercicio-contador">' + (ejEstado.indice + 1) + ' / ' + ejEstado.total + ' · Correctas: ' + ejEstado.correctas + '</span>';
        html += '<button class="btn btn-secundario" id="ej-siguiente" disabled>Siguiente</button>';
        html += '</div>';
        html += '</div></div>';

        panel.innerHTML = html;

        var siguienteBtn = document.getElementById("ej-siguiente");
        var feedback = document.getElementById("ej-feedback");

        function mostrarFeedback(correcto, texto) {
            feedback.innerHTML =
                '<div class="ejercicio-feedback ' + (correcto ? "" : "error") + '">' +
                    '<div class="ef-titulo">' + (correcto ? "Correcto" : "No exactamente") + '</div>' +
                    '<div>' + escaparHTML(texto) + '</div>' +
                '</div>';
            siguienteBtn.disabled = false;
        }

        siguienteBtn.addEventListener("click", function () {
            ejEstado.indice++;
            ejEstado.respondido = false;
            renderEjercicio();
        });

        if (ej.tipo === "multiple") {
            panel.querySelectorAll(".opcion").forEach(function (b) {
                b.addEventListener("click", function () {
                    if (ejEstado.respondido) return;
                    ejEstado.respondido = true;
                    var idxOp = parseInt(b.dataset.idx, 10);
                    var correcto = idxOp === ej.correcta;
                    if (correcto) {
                        ejEstado.correctas++;
                        b.classList.add("correcta");
                    } else {
                        b.classList.add("incorrecta");
                        panel.querySelectorAll(".opcion")[ej.correcta].classList.add("correcta");
                    }
                    panel.querySelectorAll(".opcion").forEach(function (x) { x.disabled = true; });
                    mostrarFeedback(correcto, ej.feedback);
                });
            });
        } else {
            var input = document.getElementById("comp-input");
            var compBtn = document.getElementById("comp-comprobar");
            input.focus();
            function comprobar() {
                if (ejEstado.respondido) return;
                ejEstado.respondido = true;
                var valor = input.value.trim().toLowerCase();
                var correcto = false;
                if (ej.alternativas) {
                    correcto = ej.alternativas.some(function (a) { return a.toLowerCase() === valor; });
                } else {
                    correcto = valor === (ej.respuesta || "").toLowerCase();
                }
                if (correcto) {
                    ejEstado.correctas++;
                    input.classList.add("correcto");
                } else {
                    input.classList.add("incorrecto");
                }
                input.disabled = true;
                compBtn.disabled = true;
                mostrarFeedback(correcto, (correcto ? "" : "Respuesta esperada: «" + (ej.respuesta || "") + "». ") + ej.feedback);
            }
            compBtn.addEventListener("click", comprobar);
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") { e.preventDefault(); comprobar(); }
            });
        }
    }

    // ---------- Progreso ----------
    function renderProgreso() {
        var panel = document.getElementById("bib-panel-progreso");
        if (!panel) return;

        var conteo = contarEstado();
        var stats = leer(CLAVE_STATS, { sesiones: 0, evaluaciones: 0 });

        var html = '<div class="progreso-wrap">';

        html += '<div class="progreso-hero">';
        html += '<div class="stat-card" style="--stat-color:#9A7A1E"><div class="sc-valor">' + conteo.total + '</div><div class="sc-label">Fichas totales</div><div class="sc-desc">En las siete categorias del modulo</div></div>';
        html += '<div class="stat-card" style="--stat-color:#2A3F5F"><div class="sc-valor">' + conteo.aprendiendo + '</div><div class="sc-label">Aprendiendo</div><div class="sc-desc">Fichas en proceso de consolidacion</div></div>';
        html += '<div class="stat-card" style="--stat-color:#3D4D2E"><div class="sc-valor">' + conteo.dominadas + '</div><div class="sc-label">Dominadas</div><div class="sc-desc">Cinco repasos exitosos o mas</div></div>';
        html += '<div class="stat-card" style="--stat-color:#8B2E2E"><div class="sc-valor">' + conteo.debidas + '</div><div class="sc-label">Para repasar</div><div class="sc-desc">Segun el algoritmo de repeticion espaciada</div></div>';
        html += '</div>';

        html += '<div class="progreso-seccion">';
        html += '<div class="progreso-seccion-titulo">Avance por categoria</div>';
        html += '<div class="barras-categoria">';

        var estado = leer(CLAVE_ESTADO, {});
        CONT.categorias.forEach(function (c) {
            var total = CONT.fichas.filter(function (f) { return f.categoria === c.id; }).length;
            if (total === 0) return;
            var dominadas = CONT.fichas.filter(function (f) {
                if (f.categoria !== c.id) return false;
                var e = estado[f.id];
                return e && e.repeticiones >= 5 && e.intervalo >= 21;
            }).length;
            var pct = Math.round((dominadas / total) * 100);

            html += '<div class="barra-cat">';
            html += '<span class="bc-nombre">' + escaparHTML(c.nombre) + '</span>';
            html += '<div class="bc-track"><div class="bc-fill" style="width:' + pct + '%;background:' + c.color + '"></div></div>';
            html += '<span class="bc-porcentaje">' + dominadas + '/' + total + '</span>';
            html += '</div>';
        });

        html += '</div></div>';

        html += '<div class="progreso-seccion">';
        html += '<div class="racha-info">';
        html += '<div class="ri-icono">' + SVG.llama + '</div>';
        html += '<div>';
        html += '<div style="font-weight:600;color:var(--fg-strong);font-family:var(--f-titulo);font-size:16px;letter-spacing:-0.01em;">Sesion de estudio y memoria</div>';
        html += '<div style="margin-top:4px;">Has realizado ' + (stats.evaluaciones || 0) + ' evaluaciones. ';
        if (stats.ultimaSesion) {
            var d = new Date(stats.ultimaSesion);
            html += 'Ultima sesion: ' + d.getDate() + '/' + (d.getMonth() + 1) + ' a las ' + d.getHours().toString().padStart(2, "0") + ':' + d.getMinutes().toString().padStart(2, "0") + '.';
        } else {
            html += 'Aun no has comenzado.';
        }
        html += '</div></div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="progreso-seccion">';
        html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
        html += '<button class="btn btn-secundario" id="btn-reset-estudio">Reiniciar todo el progreso</button>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        panel.innerHTML = html;

        var reset = document.getElementById("btn-reset-estudio");
        if (reset) reset.addEventListener("click", function () {
            if (confirm("¿Reiniciar el progreso de todas las fichas? Esta accion no se puede deshacer.")) {
                escribir(CLAVE_ESTADO, {});
                escribir(CLAVE_STATS, { sesiones: 0, evaluaciones: 0, ultimaSesion: null });
                renderProgreso();
            }
        });
    }

    // ---------- Tabs ----------
    var estado = { catActiva: "todas" };

    function initTabs() {
        var tabs = document.querySelectorAll(".bib-tab");
        tabs.forEach(function (t) {
            t.addEventListener("click", function () {
                tabs.forEach(function (x) { x.classList.toggle("activo", x === t); });
                document.querySelectorAll(".bib-panel").forEach(function (p) {
                    p.classList.toggle("activo", p.id === "bib-panel-" + t.dataset.panel);
                });
                if (t.dataset.panel === "estudiar") iniciarEstudio();
                if (t.dataset.panel === "ejercicios") iniciarEjercicios();
                if (t.dataset.panel === "progreso") renderProgreso();
                if (t.dataset.panel === "explorar") renderExplorar(estado);
            });
        });
    }

    // ---------- Inicializar al entrar a Biblioteca ----------
    function initBiblioteca() {
        renderExplorar(estado);
        initTabs();
        // Registrar que hay actividad
        var stats = leer(CLAVE_STATS, { sesiones: 0, evaluaciones: 0 });
        stats.sesiones = (stats.sesiones || 0) + 1;
        stats.ultimaSesion = new Date().toISOString();
        escribir(CLAVE_STATS, stats);
    }

    document.addEventListener("DOMContentLoaded", function () {
        initBiblioteca();
    });

    // Exponer para uso externo
    window.LitteraAprendizaje = {
        contarEstado: contarEstado,
        getEstado: getEstado
    };
})();
