// ============================================
// LITTERA v5 - Gamificacion
// XP, niveles, racha, ruta, celebraciones
// ============================================
(function () {
    "use strict";

    var CLAVE = {
        xp: "littera.gam.xp",
        nivel: "littera.gam.nivel",
        racha: "littera.gam.racha",
        ultima: "littera.gam.ultima",
        meta: "littera.gam.meta",
        hoyXP: "littera.gam.hoyXP",
        fichas: "littera.fichas.estado",
        completadas: "littera.gam.nodosCompletados"
    };

    // Umbrales de nivel (XP acumulados)
    var UMBRALES = [0, 100, 250, 500, 900, 1500, 2400, 3600, 5200, 7500, 10000, 14000, 20000, 30000, 50000];

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }
    function hoy() { return new Date().toISOString().slice(0,10); }

    var Gam = {
        xp: 0,
        nivel: 1,
        racha: 0,
        ultima: null,
        metaXP: 40,
        hoyXP: 0,
        nodosCompletados: {},

        init: function () {
            this.xp = leer(CLAVE.xp, 0);
            this.nivel = leer(CLAVE.nivel, 1);
            this.racha = leer(CLAVE.racha, 0);
            this.ultima = leer(CLAVE.ultima, null);
            this.metaXP = leer(CLAVE.meta, 40);
            this.hoyXP = leer(CLAVE.hoyXP, 0);
            this.nodosCompletados = leer(CLAVE.completadas, {});
            this.verificarDia();
            this.recalcularNivel();
            this.render();
        },

        verificarDia: function () {
            var h = hoy();
            if (this.ultima !== h) {
                var ayer = new Date();
                ayer.setDate(ayer.getDate() - 1);
                var ayerStr = ayer.toISOString().slice(0,10);
                if (this.ultima === ayerStr) {
                    // Racha continua (aunque hoyXP se resetea)
                    this.hoyXP = 0;
                } else if (this.ultima) {
                    // Racha rota
                    this.racha = 0;
                    this.hoyXP = 0;
                } else {
                    this.hoyXP = 0;
                }
                this.escribirTodo();
            }
        },

        escribirTodo: function () {
            escribir(CLAVE.xp, this.xp);
            escribir(CLAVE.nivel, this.nivel);
            escribir(CLAVE.racha, this.racha);
            escribir(CLAVE.ultima, this.ultima);
            escribir(CLAVE.meta, this.metaXP);
            escribir(CLAVE.hoyXP, this.hoyXP);
            escribir(CLAVE.completadas, this.nodosCompletados);
        },

        recalcularNivel: function () {
            var n = 1;
            for (var i = 0; i < UMBRALES.length; i++) {
                if (this.xp >= UMBRALES[i]) n = i + 1;
            }
            if (n !== this.nivel) {
                var subio = n > this.nivel;
                this.nivel = n;
                if (subio) setTimeout(this.celebrarNivel.bind(this), 400);
            }
        },

        xpParaNivel: function (n) {
            if (n < 1) n = 1;
            if (n > UMBRALES.length) n = UMBRALES.length;
            return UMBRALES[n - 1] || 0;
        },

        xpSiguiente: function () {
            if (this.nivel >= UMBRALES.length) return this.xpParaNivel(this.nivel);
            return UMBRALES[this.nivel];
        },

        progresoNivel: function () {
            var actual = this.xpParaNivel(this.nivel);
            var sig = this.xpSiguiente();
            var rango = sig - actual;
            if (rango <= 0) return 1;
            return Math.min(1, (this.xp - actual) / rango);
        },

        sumarXP: function (n, mensaje) {
            this.xp += n;
            this.hoyXP += n;

            var h = hoy();
            if (this.ultima !== h) {
                var ayer = new Date();
                ayer.setDate(ayer.getDate() - 1);
                var ayerStr = ayer.toISOString().slice(0,10);
                if (this.ultima === ayerStr) {
                    this.racha = (this.racha || 0) + 1;
                } else if (!this.ultima) {
                    this.racha = 1;
                } else {
                    this.racha = 1;
                }
                this.ultima = h;
                if (this.racha > 1) setTimeout(this.celebrarRacha.bind(this), 800);
            }

            this.recalcularNivel();
            this.escribirTodo();
            this.render();
            this.mostrarXPFloat(n, mensaje || "XP");
        },

        mostrarXPFloat: function (n, texto) {
            var el = document.getElementById("xp-float");
            if (!el) {
                el = document.createElement("div");
                el.id = "xp-float";
                el.className = "xp-flotante";
                document.body.appendChild(el);
            }
            el.innerHTML = '<strong>+' + n + '</strong> XP · ' + texto;
            el.classList.add("visible");
            clearTimeout(this._xpTimer);
            var self = this;
            this._xpTimer = setTimeout(function () { el.classList.remove("visible"); }, 2200);
        },

        celebrarNivel: function () {
            var emojis = ["🏆","⭐","✨","🎯","📚","🖋️","🌟","🎉"];
            var emoji = emojis[Math.floor(Math.random() * emojis.length)];
            var overlay = document.createElement("div");
            overlay.className = "celebracion-overlay";
            overlay.style.setProperty("--nivel-color", "#B8860B");
            overlay.innerHTML =
                '<div class="celebracion">' +
                    '<div class="celebracion-emoji">' + emoji + '</div>' +
                    '<div class="celebracion-titulo">Nivel ' + this.nivel + '</div>' +
                    '<div class="celebracion-sub">Has subido de nivel en tu camino literario. ' + this.mensajeNivel() + '</div>' +
                    '<div class="celebracion-xp"><span class="cx-num">+' + this.xp + '</span> XP TOTALES</div>' +
                    '<button class="btn btn-primario btn-grande" id="celebracion-cerrar">Seguir</button>' +
                '</div>';
            document.body.appendChild(overlay);
            var self = this;
            overlay.querySelector("#celebracion-cerrar").addEventListener("click", function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });
            overlay.addEventListener("click", function (e) {
                if (e.target === overlay) overlay.parentNode.removeChild(overlay);
            });
        },

        celebrarRacha: function () {
            var emojis = ["🔥","🔥","🔥","💪","🌟"];
            var emoji = emojis[Math.floor(Math.random() * emojis.length)];
            var overlay = document.createElement("div");
            overlay.className = "celebracion-overlay";
            overlay.style.setProperty("--nivel-color", "#8B2E2E");
            overlay.innerHTML =
                '<div class="celebracion">' +
                    '<div class="celebracion-emoji">' + emoji + '</div>' +
                    '<div class="celebracion-titulo">' + this.racha + ' dias</div>' +
                    '<div class="celebracion-sub">' + this.mensajeRacha() + '</div>' +
                    '<button class="btn btn-primario btn-grande" id="celebracion-cerrar">Seguir</button>' +
                '</div>';
            document.body.appendChild(overlay);
            overlay.querySelector("#celebracion-cerrar").addEventListener("click", function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });
        },

        mensajeNivel: function () {
            var m = {
                1: "Apenas comienzas. Hay un mundo por leer.",
                2: "Ya tienes vocabulario. La retorica empieza a sonar.",
                3: "Reconoces figuras con soltura.",
                4: "Lees como critico, escribes como aprendiz.",
                5: "El analisis se ha vuelto instinto.",
                6: "Empiezas a ver lo que otros no ven.",
                7: "Tu oido retorico esta afinado.",
                8: "La teoria es tu aliada.",
                9: "Escribes con conciencia estructural.",
                10: "Estas en terreno de maestros.",
                11: "Pocos llegan hasta aqui.",
                12: "Tu nombre merece un anaquel.",
                13: "El canon te reconoce.",
                14: "Ya no aprendes: ensenas sin saberlo.",
                15: "La literatura te habita."
            };
            return m[this.nivel] || "Sigue escribiendo.";
        },

        mensajeRacha: function () {
            if (this.racha === 1) return "Has comenzado. El primer paso es el mas dificil.";
            if (this.racha < 3) return "Dos dias. El habito empieza a formarse.";
            if (this.racha < 7) return "Varios dias seguidos. Tu mente lo recuerda.";
            if (this.racha < 14) return "Una semana o mas. Esto ya es disciplina.";
            if (this.racha < 30) return "Semanas enteras. Pocos llegan aqui.";
            if (this.racha < 60) return "Mas de un mes. La constancia te distingue.";
            if (this.racha < 100) return "Dos meses. La literatura te reconoce.";
            return "Cien dias o mas. Eres de otra especie.";
        },

        // ---------- Ruta de nodos (Duolingo style) ----------
        ruta: function () {
            // Agrupa las fichas por categoria
            var CONT = window.LITTERA_CONTENIDO;
            if (!CONT) return [];

            var categorias = CONT.categorias.map(function (c) { return c.id; });

            var secciones = categorias.map(function (catId, idx) {
                var cat = CONT.categorias.find(function (c) { return c.id === catId; });
                var fichas = CONT.fichas.filter(function (f) { return f.categoria === catId; });
                // Partir en nodos de 4-6 fichas
                var nodos = [];
                var tam = 5;
                for (var i = 0; i < fichas.length; i += tam) {
                    nodos.push({
                        id: catId + "-" + Math.floor(i / tam),
                        categoria: catId,
                        titulo: cat.nombre + " · Parte " + (Math.floor(i / tam) + 1),
                        fichas: fichas.slice(i, i + tam),
                        xp: fichas.slice(i, i + tam).reduce(function (a, f) { return a + (window.LITTERA_NIVELES[f.nivel] || {xp: 20}).xp; }, 0)
                    });
                }
                return { categoria: cat, color: cat.color, nodos: nodos };
            });
            return secciones;
        },

        // Nodo completado = todas sus fichas tienen estado "dominada"
        estaCompletado: function (nodo) {
            var estado = leer(CLAVE.fichas, {});
            for (var i = 0; i < nodo.fichas.length; i++) {
                var e = estado[nodo.fichas[i].id];
                if (!e || e.repeticiones < 2) return false;
            }
            return true;
        },

        estaDisponible: function (nodo, seccionIdx, nodoIdx, secciones) {
            if (seccionIdx === 0 && nodoIdx === 0) return true;
            if (nodoIdx > 0) {
                var anterior = secciones[seccionIdx].nodos[nodoIdx - 1];
                return this.estaCompletado(anterior);
            }
            if (seccionIdx > 0) {
                var ultNodo = secciones[seccionIdx - 1].nodos[secciones[seccionIdx - 1].nodos.length - 1];
                return this.estaCompletado(ultNodo);
            }
            return false;
        },

        // ---------- Render ----------
        render: function () {
            var header = document.getElementById("bib-gam-header");
            if (!header) return;

            var progreso = this.progresoNivel();
            var actual = this.xpParaNivel(this.nivel);
            var sig = this.xpSiguiente();
            var xpEnNivel = this.xp - actual;
            var rangoNivel = sig - actual;

            var completadas = Object.keys(leer(CLAVE.fichas, {})).length;
            var totalFichas = window.LITTERA_CONTENIDO ? window.LITTERA_CONTENIDO.fichas.length : 0;

            header.innerHTML =
                '<div class="bib-nivel-info">' +
                    '<div class="nivel-badge">' +
                        '<div class="nb-num">' + this.nivel + '</div>' +
                        '<div class="nb-label">Nivel</div>' +
                    '</div>' +
                    '<div class="bib-xp-info">' +
                        '<div class="bib-xp-titulo"><strong>' + this.xp + ' XP</strong> en total</div>' +
                        '<div class="bib-xp-barra"><div class="xb-fill" style="width:' + (progreso*100) + '%"></div></div>' +
                        '<div class="bib-xp-texto"><span>' + xpEnNivel + '/' + rangoNivel + ' XP</span><span>Siguiente: Nivel ' + (this.nivel + 1) + '</span></div>' +
                    '</div>' +
                '</div>' +
                '<div class="bib-stats-mini">' +
                    '<div class="stat-mini" title="Dias consecutivos de estudio">' +
                        '<span class="sm-icono">🔥</span>' +
                        '<span class="sm-valor">' + this.racha + '</span>' +
                        '<span class="sm-label">Racha</span>' +
                    '</div>' +
                    '<div class="stat-mini" title="XP ganado hoy">' +
                        '<span class="sm-icono">⚡</span>' +
                        '<span class="sm-valor">' + this.hoyXP + '</span>' +
                        '<span class="sm-label">Hoy XP</span>' +
                    '</div>' +
                    '<div class="stat-mini" title="Fichas estudiadas">' +
                        '<span class="sm-icono">📚</span>' +
                        '<span class="sm-valor">' + completadas + '/' + totalFichas + '</span>' +
                        '<span class="sm-label">Fichas</span>' +
                    '</div>' +
                '</div>';

            this.renderRuta();
        },

        renderRuta: function () {
            var cont = document.getElementById("bib-ruta-niveles");
            if (!cont) return;
            var secciones = this.ruta();
            var self = this;

            var html = '';
            secciones.forEach(function (sec, sIdx) {
                html += '<div class="ruta-seccion">';
                html += '<div class="ruta-seccion-cabecera" style="--ruta-color:' + sec.color + '">';
                html += '<div class="ruta-seccion-num">' + (sIdx + 1) + '</div>';
                html += '<div class="ruta-seccion-texto">';
                html += '<div class="ruta-seccion-titulo">' + sec.categoria.nombre + '</div>';
                html += '<div class="ruta-seccion-sub">' + sec.nodos.length + ' etapas · ' + sec.nodos.reduce(function (a, n) { return a + n.fichas.length; }, 0) + ' fichas</div>';
                html += '</div>';
                var completados = sec.nodos.filter(function (n) { return self.estaCompletado(n); }).length;
                html += '<div class="ruta-seccion-progreso">' + completados + '/' + sec.nodos.length + '</div>';
                html += '</div>';
                html += '<div class="ruta-nodos">';

                sec.nodos.forEach(function (nodo, nIdx) {
                    var completado = self.estaCompletado(nodo);
                    var disponible = self.estaDisponible(nodo, sIdx, nIdx, secciones);
                    var clase = "nodo";
                    if (completado) clase += " completado";
                    else if (disponible) clase += " disponible";
                    else clase += " bloqueado";

                    html += '<div class="' + clase + '" data-nodo="' + nodo.id + '" data-cat="' + nodo.categoria + '" style="--nivel-color:' + sec.color + '">';
                    html += '<div class="nodo-icono">' + (completado ? "✓" : nIdx + 1) + '</div>';
                    html += '<div class="nodo-titulo">' + nodo.titulo.replace(sec.categoria.nombre + " · ", "") + '</div>';
                    html += '<div class="nodo-xp">+' + nodo.xp + ' XP</div>';
                    html += '</div>';
                });

                html += '</div></div>';
            });

            cont.innerHTML = html;

            cont.querySelectorAll(".nodo:not(.bloqueado)").forEach(function (el) {
                el.addEventListener("click", function () {
                    var catId = el.dataset.cat;
                    if (window.LitteraAprendizaje && window.LitteraAprendizaje.iniciarEstudioCategoria) {
                        window.LitteraAprendizaje.iniciarEstudioCategoria(catId);
                    } else {
                        // Fallback: ir a la pestana estudiar
                        var tab = document.querySelector('.bib-tab[data-panel="estudiar"]');
                        if (tab) tab.click();
                    }
                });
            });
        }
    };

    window.LitteraGam = Gam;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("bib-gam-header")) {
            Gam.init();
        }
    });
})();
