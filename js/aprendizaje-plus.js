// ============================================
// LITTERA v5.1 - Import/Export mazos + Examen
// ============================================
(function () {
    "use strict";

    var K_FICHAS = "littera.fichas.estado";
    var K_GAM = "littera.gam.xp";

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }
    function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function toast(m, tipo) {
        var c = document.getElementById("toasts"); if (!c) return;
        var t = document.createElement("div");
        t.className = "toast " + (tipo || "exito");
        t.innerHTML = "<span>" + esc(m) + "</span>";
        c.appendChild(t);
        setTimeout(function(){ t.classList.add("saliendo"); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 260); }, 2400);
    }

    // ============================================================
    // 1) BOTONES DE MAZO en la Biblioteca
    // ============================================================
    function inyectarBotonesMazo() {
        var header = document.getElementById("bib-gam-header");
        if (!header || document.getElementById("mazo-botones")) return;
        var cont = document.createElement("div");
        cont.className = "mazo-botones";
        cont.id = "mazo-botones";
        cont.innerHTML =
            '<button class="btn btn-secundario" id="mazo-exportar" style="font-size:11.5px;padding:6px 12px;">' +
                'Exportar mazo' +
            '</button>' +
            '<label class="btn btn-secundario" for="mazo-importar" style="font-size:11.5px;padding:6px 12px;cursor:pointer;">' +
                'Importar mazo' +
            '</label>' +
            '<input type="file" id="mazo-importar" accept=".json" style="display:none;">';
        header.appendChild(cont);

        document.getElementById("mazo-exportar").addEventListener("click", exportarMazo);
        document.getElementById("mazo-importar").addEventListener("change", importarMazo);
    }

    function exportarMazo() {
        var estado = leer(K_FICHAS, {});
        var xp = leer(K_GAM, 0);
        var totalFichas = window.LITTERA_CONTENIDO ? window.LITTERA_CONTENIDO.fichas.length : 0;
        var datos = {
            tipo: "littera-mazo",
            version: "5.1",
            fecha: new Date().toISOString(),
            totalFichas: totalFichas,
            xp: xp,
            estado: estado,
            fichasCompletadas: Object.keys(estado).length
        };
        var blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "littera-mazo-" + new Date().toISOString().slice(0,10) + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast("Mazo exportado");
    }

    function importarMazo(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            try {
                var datos = JSON.parse(ev.target.result);
                if (datos.tipo !== "littera-mazo") {
                    toast("Archivo no es un mazo de Littera", "aviso");
                    return;
                }
                var actual = leer(K_FICHAS, {});
                var importadas = 0;
                Object.keys(datos.estado || {}).forEach(function(id) {
                    if (!actual[id]) {
                        actual[id] = datos.estado[id];
                        importadas++;
                    } else {
                        // Conservar la mas avanzada
                        var a = actual[id];
                        var b = datos.estado[id];
                        if ((b.repeticiones || 0) > (a.repeticiones || 0)) {
                            actual[id] = b;
                            importadas++;
                        }
                    }
                });
                escribir(K_FICHAS, actual);
                toast("Mazo importado: " + importadas + " fichas");
                setTimeout(function() { location.reload(); }, 1200);
            } catch (err) {
                toast("Archivo invalido", "aviso");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    }

    // ============================================================
    // 2) MODO EXAMEN
    // ============================================================
    var exam = {
        preguntas: [],
        indice: 0,
        respuestas: [],
        terminado: false,
        tamano: 15
    };

    function iniciarExamen() {
        var CONT = window.LITTERA_CONTENIDO;
        if (!CONT) return;

        // Recolectar preguntas de multiples fuentes:
        // 1. Ejercicios predefinidos
        // 2. Preguntas generadas a partir de fichas (definicion -> termino)
        var candidatas = [];

        // Desde ejercicios
        (CONT.ejercicios || []).forEach(function(e) {
            if (e.tipo === "multiple" && e.opciones && e.opciones.length >= 2) {
                candidatas.push({
                    pregunta: e.pregunta,
                    opciones: e.opciones,
                    correcta: e.correcta,
                    categoria: e.categoria,
                    feedback: e.feedback || ""
                });
            }
        });

        // Desde fichas: usar el termino como respuesta correcta y 3 distractores del mismo grupo
        var grupos = {};
        CONT.fichas.forEach(function(f) {
            if (!grupos[f.categoria]) grupos[f.categoria] = [];
            grupos[f.categoria].push(f);
        });

        CONT.fichas.forEach(function(f) {
            var grupo = grupos[f.categoria] || [];
            if (grupo.length < 4) return;
            // Elegir 3 distractores
            var distractores = [];
            var intentos = 0;
            while (distractores.length < 3 && intentos < 40) {
                intentos++;
                var idx = Math.floor(Math.random() * grupo.length);
                var otro = grupo[idx];
                if (otro.id === f.id) continue;
                if (distractores.indexOf(otro.termino) !== -1) continue;
                distractores.push(otro.termino);
            }
            if (distractores.length < 3) return;
            var opciones = [f.termino].concat(distractores);
            // Barajar
            for (var i = opciones.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = opciones[i]; opciones[i] = opciones[j]; opciones[j] = tmp;
            }
            candidatas.push({
                pregunta: "¿A que figura o concepto corresponde esta definicion? «" + f.definicion + "»",
                opciones: opciones,
                correcta: opciones.indexOf(f.termino),
                categoria: f.categoria,
                feedback: f.termino + ": " + (f.efecto || "")
            });
        });

        // Barajar y tomar tamano
        for (var i = candidatas.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = candidatas[i]; candidatas[i] = candidatas[j]; candidatas[j] = tmp;
        }
        exam.preguntas = candidatas.slice(0, exam.tamano);
        exam.indice = 0;
        exam.respuestas = [];
        exam.terminado = false;
        renderExamen();
    }

    function renderExamen() {
        var cont = document.getElementById("bib-panel-examen");
        if (!cont) return;

        if (!exam.preguntas.length) {
            cont.innerHTML =
                '<div class="estudio-vacio">' +
                    '<div class="ev-titulo">Preparando examen</div>' +
                    '<div class="ev-desc">Recopilando preguntas...</div>' +
                    '<button class="btn btn-primario" id="examen-iniciar" style="margin-top:var(--e-4);">Comenzar</button>' +
                '</div>';
            document.getElementById("examen-iniciar").addEventListener("click", iniciarExamen);
            return;
        }

        if (exam.terminado) {
            renderResultadoExamen();
            return;
        }

        var p = exam.preguntas[exam.indice];
        var resp = exam.respuestas[exam.indice];
        var letras = ["A", "B", "C", "D", "E", "F"];
        var progreso = ((exam.indice) / exam.preguntas.length) * 100;

        var html = '<div class="examen-wrap">';

        html += '<div class="examen-cabecera">';
        html += '<span class="examen-contador">' + (exam.indice + 1) + ' / ' + exam.preguntas.length + '</span>';
        html += '<div class="examen-progreso"><div class="ep-fill" style="width:' + progreso + '%"></div></div>';
        html += '<span class="examen-contador">Sin pistas</span>';
        html += '</div>';

        html += '<div class="examen-card">';
        html += '<div class="examen-pregunta">' + esc(p.pregunta) + '</div>';
        html += '<div class="examen-opciones">';
        p.opciones.forEach(function(op, i) {
            var clase = "examen-opcion";
            if (resp && resp.seleccion === i) clase += " seleccionada";
            html += '<button class="' + clase + '" data-idx="' + i + '">' +
                '<span class="op-letra">' + letras[i] + '</span>' +
                '<span>' + esc(op) + '</span></button>';
        });
        html += '</div>';
        html += '<div class="examen-pie">';
        html += '<button class="btn btn-secundario" id="examen-anterior"' + (exam.indice === 0 ? " disabled" : "") + '>Anterior</button>';
        html += '<span style="font-family:var(--f-mono);font-size:11px;color:var(--fg-subtle);letter-spacing:0.05em;">' + (exam.respuestas.filter(function(r){ return r && r.seleccion !== null; }).length) + ' respondidas</span>';
        if (exam.indice === exam.preguntas.length - 1) {
            html += '<button class="btn btn-primario" id="examen-terminar">Terminar examen</button>';
        } else {
            html += '<button class="btn btn-primario" id="examen-siguiente">Siguiente</button>';
        }
        html += '</div></div></div>';
        cont.innerHTML = html;

        cont.querySelectorAll(".examen-opcion").forEach(function(b) {
            b.addEventListener("click", function() {
                var idx = parseInt(b.dataset.idx, 10);
                exam.respuestas[exam.indice] = { seleccion: idx };
                // Solo actualizar la clase
                cont.querySelectorAll(".examen-opcion").forEach(function(x) {
                    x.classList.toggle("seleccionada", x === b);
                });
            });
        });
        var sig = document.getElementById("examen-siguiente");
        if (sig) sig.addEventListener("click", function() {
            exam.indice++;
            renderExamen();
        });
        var ant = document.getElementById("examen-anterior");
        if (ant) ant.addEventListener("click", function() {
            if (exam.indice > 0) { exam.indice--; renderExamen(); }
        });
        var term = document.getElementById("examen-terminar");
        if (term) term.addEventListener("click", function() {
            exam.terminado = true;
            renderExamen();
        });
    }

    function renderResultadoExamen() {
        var cont = document.getElementById("bib-panel-examen");
        var correctas = 0;
        var revisionHTML = "";
        exam.preguntas.forEach(function(p, i) {
            var r = exam.respuestas[i];
            var sel = r ? r.seleccion : null;
            var ok = sel === p.correcta;
            if (ok) correctas++;
            revisionHTML +=
                '<div class="examen-revision-item ' + (ok ? "ok" : "") + '">' +
                    '<div class="ri-pregunta">' + (i + 1) + '. ' + esc(p.pregunta) + '</div>' +
                    (sel !== null ? '<div class="ri-tu">Tu respuesta: ' + esc(p.opciones[sel]) + '</div>' : '<div class="ri-tu">Sin responder</div>') +
                    (ok ? '' : '<div class="ri-correcta">Correcta: ' + esc(p.opciones[p.correcta]) + '</div>') +
                '</div>';
        });

        var pct = Math.round((correctas / exam.preguntas.length) * 100);
        var mensaje;
        if (pct >= 90) mensaje = "Excelente. Dominas el material.";
        else if (pct >= 75) mensaje = "Muy bien. Algunos matices por afinar.";
        else if (pct >= 50) mensaje = "Aprobado. Vuelve a las fichas para consolidar.";
        else mensaje = "Repasa las fichas de explorar. La practica hace al maestro.";

        // Dar XP
        var xpGanado = correctas * 5;
        if (window.LitteraGam && window.LitteraGam.sumarXP) {
            window.LitteraGam.sumarXP(xpGanado, "Examen");
        }

        cont.innerHTML =
            '<div class="examen-resultado">' +
                '<div class="examen-puntaje">' + correctas + '<small> / ' + exam.preguntas.length + '</small></div>' +
                '<div style="font-family:var(--f-mono);font-size:12px;color:var(--accent);letter-spacing:0.1em;margin-bottom:var(--e-5);">+' + xpGanado + ' XP</div>' +
                '<p class="examen-mensaje">' + mensaje + '</p>' +
                '<div class="examen-revision">' + revisionHTML + '</div>' +
                '<div style="display:flex;gap:8px;justify-content:center;">' +
                    '<button class="btn btn-primario" id="examen-reiniciar">Otro examen</button>' +
                '</div>' +
            '</div>';

        document.getElementById("examen-reiniciar").addEventListener("click", function() {
            exam.preguntas = [];
            renderExamen();
        });
    }

    // ============================================================
    // INICIALIZAR
    // ============================================================
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(inyectarBotonesMazo, 400);

        // Preparar el tab de examen
        var tabs = document.querySelectorAll(".bib-tab");
        tabs.forEach(function(t) {
            t.addEventListener("click", function() {
                if (t.dataset.panel === "examen") {
                    if (!exam.preguntas.length || exam.terminado) {
                        // Nada, dejar al usuario presionar "Comenzar"
                    }
                }
            });
        });
    });

    window.LitteraAprendizajePlus = {
        iniciarExamen: iniciarExamen,
        exportarMazo: exportarMazo
    };
})();
