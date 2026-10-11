// ============================================
// LITTERA v4.3 - Laboratorio
// Analisis textual y estilometria
// ============================================
(function () {
    "use strict";

    var CLAVE_OBRAS = "littera.obras";

    var SVG = {
        lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    };

    // ---------- Stopwords del español (mas frecuentes) ----------
    var STOPWORDS = ("a al algo algunos ante antes aquel aquella aquellas aquellos aqui asi aun aunque " +
        "bajo bastante bien cada casi como con contra cual cuales cuando cuanto cuenta " +
        "de del desde donde dos durante " +
        "e el ella ellas ello ellos en entonces entre era eran eres es esa esas ese eso esos esta estan este esto estos " +
        "ha habia hace hacer hacia han hasta hay " +
        "la las le les lo los luego " +
        "me mi mientras mis mucho muchos muy " +
        "nada ni no nos nosotros nuestra nuestro " +
        "o otra otras otro otros " +
        "para pero poco por porque pues " +
        "que quien quienes " +
        "se sea segun ser si siempre sin sobre solo son su sus " +
        "tal tambien tan tanto te tengo ti tiene tienen todo todos tu tus " +
        "un una uno unos " +
        "y ya yo " +
        "he has ha hemos han " +
        "fue fueron soy eres es somos son era eramos eran " +
        "sera seran seria serian " +
        "esto estos esta estas " +
        "aun aunque asi tambien tampoco").split(" ");

    var STOP_SET = {};
    STOPWORDS.forEach(function (w) { STOP_SET[w] = true; });

    // ---------- Marcadores emocionales (lexico simple) ----------
    var POSITIVOS = ["amor", "luz", "vida", "alegre", "alegria", "feliz", "felicidad", "esperanza",
        "belleza", "bello", "hermoso", "hermosa", "tierno", "tierna", "dulce", "suave",
        "calido", "brillar", "brillo", "sol", "flor", "flores", "cielo", "rio", "mar",
        "abrir", "abrazar", "abrazo", "beso", "sonrisa", "reir", "risa", "juego", "canto",
        "cancion", "paz", "calma", "silencio", "bueno", "buena", "mejor", "grande", "libre"];

    var NEGATIVOS = ["muerte", "morir", "muerto", "muerta", "dolor", "sombra", "sombras",
        "miedo", "triste", "tristeza", "soledad", "solo", "sola", "llanto", "llorar", "lagrima",
        "oscuridad", "oscuro", "oscura", "noche", "frio", "herida", "herido", "herida",
        "sangre", "hueso", "polvo", "olvido", "olvidar", "ausencia", "perdida", "perder",
        "vacio", "vaciedad", "grito", "gritar", "ira", "odio", "rencor", "culpa", "culpable",
        "cansado", "cansada", "agotado", "enfermo", "enferma", "agonia", "angustia"];

    // ---------- Utilidades ----------
    function leer(k, d) {
        try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; }
        catch (e) { return d; }
    }
    function escapar(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    function normalizar(s) {
        return String(s || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }
    function quitarAcentos(s) {
        return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function formatearNumero(n) {
        return Number(n).toLocaleString("es-ES");
    }

    // ---------- Tokenizacion ----------
    function tokenizar(texto) {
        // Extrae palabras (unicode-aware)
        var t = texto.toLowerCase();
        var tokens = t.match(/[a-záéíóúüñç]+/gi);
        return tokens || [];
    }

    function oraciones(texto) {
        // Corta por signos de cierre; conserva ciertos decimales y abreviaturas simples
        var t = texto.replace(/([.?!…])\s+/g, "$1|");
        var partes = t.split("|").map(function (s) { return s.trim(); });
        return partes.filter(function (s) { return s.length > 0; });
    }

    function silabasEnPalabra(p) {
        // Cuenta grupos vocalicos en español (aproximacion)
        p = p.toLowerCase();
        var vocales = "aeiouáéíóúü";
        var cuenta = 0;
        var dentroVocal = false;
        for (var i = 0; i < p.length; i++) {
            var esVocal = vocales.indexOf(p[i]) !== -1;
            if (esVocal && !dentroVocal) { cuenta++; dentroVocal = true; }
            else if (!esVocal) { dentroVocal = false; }
        }
        return Math.max(1, cuenta);
    }

    // ---------- Analisis principal ----------
    function analizar(texto) {
        var limpio = normalizar(texto);
        var palabras = tokenizar(limpio);
        var total = palabras.length;

        // Frecuencias
        var freq = {};
        palabras.forEach(function (p) { freq[p] = (freq[p] || 0) + 1; });

        // Vocabulario unico
        var unicas = Object.keys(freq).length;

        // Riqueza lexica (type-token ratio)
        var ttr = total > 0 ? (unicas / total) * 100 : 0;

        // Longitudes de oracion
        var ors = oraciones(limpio);
        var longOraciones = ors.map(function (o) { return tokenizar(o).length; }).filter(function (n) { return n > 0; });
        var promedioLargoOracion = longOraciones.length > 0
            ? longOraciones.reduce(function (a, b) { return a + b; }, 0) / longOraciones.length
            : 0;

        // Silabas totales (para legibilidad)
        var silabasTotal = 0;
        palabras.forEach(function (p) { silabasTotal += silabasEnPalabra(p); });

        // Legibilidad Fernandez Huerta
        // L = 206.84 - 0.60 * P - 1.02 * F
        // P = silabas por 100 palabras; F = oraciones por 100 palabras
        var P = total > 0 ? (silabasTotal / total) * 100 : 0;
        var F = total > 0 ? (ors.length / total) * 100 : 0;
        var legibilidad = 206.84 - (0.60 * P) - (1.02 * F);
        if (!isFinite(legibilidad)) legibilidad = 0;

        // Top palabras (sin stopwords)
        var sinStop = Object.keys(freq).filter(function (p) { return !STOP_SET[p] && p.length > 2; });
        sinStop.sort(function (a, b) { return freq[b] - freq[a]; });
        var topPalabras = sinStop.slice(0, 20).map(function (p) { return { palabra: p, cuenta: freq[p] }; });

        // Palabras firma (aparicion >= 2 y no en stop, no en top 500)
        // Como no tenemos lista de 500, usamos: palabras con freq >= 2, longitud >= 5,
        // que no esten en stopwords y que no esten en el top 20 general
        var top20Set = {};
        topPalabras.forEach(function (t) { top20Set[t.palabra] = true; });
        var firma = sinStop.filter(function (p) {
            return freq[p] >= 2 && p.length >= 5 && !top20Set[p];
        }).slice(0, 30).map(function (p) { return { palabra: p, cuenta: freq[p] }; });
        firma.sort(function (a, b) { return b.cuenta - a.cuenta; });

        // Frases repetidas (n-gramas de 4 palabras)
        var frases = {};
        var n = 4;
        for (var i = 0; i <= palabras.length - n; i++) {
            var frase = palabras.slice(i, i + n).join(" ");
            frases[frase] = (frases[frase] || 0) + 1;
        }
        var frasesRepetidas = Object.keys(frases)
            .filter(function (f) { return frases[f] >= 3; })
            .sort(function (a, b) { return frases[b] - frases[a]; })
            .slice(0, 12)
            .map(function (f) { return { frase: f, cuenta: frases[f] }; });

        // Histograma de longitudes de oracion
        var histograma = [
            { rango: "1-5",   min: 1,  max: 5,  cuenta: 0 },
            { rango: "6-10",  min: 6,  max: 10, cuenta: 0 },
            { rango: "11-15", min: 11, max: 15, cuenta: 0 },
            { rango: "16-20", min: 16, max: 20, cuenta: 0 },
            { rango: "21-25", min: 21, max: 25, cuenta: 0 },
            { rango: "26-30", min: 26, max: 30, cuenta: 0 },
            { rango: "31-40", min: 31, max: 40, cuenta: 0 },
            { rango: "41-50", min: 41, max: 50, cuenta: 0 },
            { rango: "51+",   min: 51, max: 9999, cuenta: 0 }
        ];
        longOraciones.forEach(function (n) {
            for (var j = 0; j < histograma.length; j++) {
                if (n >= histograma[j].min && n <= histograma[j].max) {
                    histograma[j].cuenta++;
                    break;
                }
            }
        });

        // Marcadores emocionales
        var positivos = 0, negativos = 0;
        palabras.forEach(function (p) {
            if (POSITIVOS.indexOf(p) !== -1) positivos++;
            if (NEGATIVOS.indexOf(p) !== -1) negativos++;
        });
        var totalEmocional = positivos + negativos;
        var ratioPositivo = totalEmocional > 0 ? (positivos / totalEmocional) * 100 : 50;
        var ratioNegativo = 100 - ratioPositivo;

        // Puntuacion
        var puntuacion = {
            puntos: (limpio.match(/\./g) || []).length,
            comas: (limpio.match(/,/g) || []).length,
            interrogaciones: (limpio.match(/[?¿]/g) || []).length,
            exclamaciones: (limpio.match(/[!¡]/g) || []).length,
            puntosSuspensivos: (limpio.match(/…|\.\.\./g) || []).length,
            puntoComa: (limpio.match(/;/g) || []).length,
            dosPuntos: (limpio.match(/:/g) || []).length,
            guiones: (limpio.match(/[—–-]/g) || []).length,
            comillas: (limpio.match(/["“”«»]/g) || []).length,
            parentesis: (limpio.match(/[()]/g) || []).length
        };

        // Tiempos de lectura
        // Silenciosa: ~200 palabras/min
        // Voz alta: ~150 palabras/min
        var minutosSilenciosa = total / 200;
        var minutosVozAlta = total / 150;

        // Palabra mas larga
        var masLarga = palabras.slice().sort(function (a, b) { return b.length - a.length; })[0] || "";

        return {
            total: total,
            unicas: unicas,
            ttr: ttr,
            oraciones: ors.length,
            promedioLargoOracion: promedioLargoOracion,
            silabasTotal: silabasTotal,
            legibilidad: legibilidad,
            topPalabras: topPalabras,
            firma: firma,
            frasesRepetidas: frasesRepetidas,
            histograma: histograma,
            positivos: positivos,
            negativos: negativos,
            ratioPositivo: ratioPositivo,
            ratioNegativo: ratioNegativo,
            puntuacion: puntuacion,
            minutosSilenciosa: minutosSilenciosa,
            minutosVozAlta: minutosVozAlta,
            masLarga: masLarga
        };
    }

    // ---------- Rendering ----------
    var Lab = {
        obras: [],
        obraActual: null,
        analisis: null,

        init: function () {
            if (!document.getElementById("lab-obra")) return;
            this.cargarObras();
            this.bind();
            this.renderVacio();
        },

        cargarObras: function () {
            this.obras = leer(CLAVE_OBRAS, []);
            var sel = document.getElementById("lab-obra");
            if (!sel) return;
            sel.innerHTML = '<option value="">— Elige una obra —</option>';
            this.obras.forEach(function (o) {
                var opt = document.createElement("option");
                opt.value = o.id;
                var tipo = o.tipo || "prosa";
                var txt = (o.titulo || "Sin titulo") + " · " + tipo;
                opt.textContent = txt;
                sel.appendChild(opt);
            });
        },

        extraerTexto: function (o) {
            var partes = [];
            if (o.tipo === "novela" && o.capitulos) {
                o.capitulos.forEach(function (c) {
                    if (c.titulo) partes.push(c.titulo);
                    if (c.texto) partes.push(c.texto);
                });
            } else if (o.tipo === "diario" && o.entradas) {
                o.entradas.forEach(function (e) {
                    if (e.titulo) partes.push(e.titulo);
                    if (e.texto) partes.push(e.texto);
                });
            } else if (o.tipo === "revista" && o.secciones) {
                o.secciones.forEach(function (s) {
                    if (s.titulo) partes.push(s.titulo);
                    if (s.texto) partes.push(s.texto);
                });
            } else if (o.tipo === "fanzine" && o.paginas) {
                o.paginas.forEach(function (p) { if (p.texto) partes.push(p.texto); });
            } else if (o.tipo === "aforismos" && o.aforismos) {
                o.aforismos.forEach(function (a) { if (a.texto) partes.push(a.texto); });
            } else if (o.tipo === "cuento") {
                if (o.texto) partes.push(o.texto);
            } else {
                if (o.texto) partes.push(o.texto);
            }
            return partes.join("\n\n");
        },

        renderVacio: function () {
            var cont = document.getElementById("lab-resultado");
            if (!cont) return;
            cont.innerHTML =
                '<div class="lab-vacio">' +
                    SVG.lupa +
                    '<div class="lv-titulo">El texto espera su analisis</div>' +
                    '<div class="lv-desc">Elige una obra arriba. Littera contara sus palabras, medira su respiracion, encontrara sus obsesiones. No para juzgar: para ver.</div>' +
                '</div>';
        },

        bind: function () {
            var self = this;
            var sel = document.getElementById("lab-obra");
            if (sel) sel.addEventListener("change", function () {
                var id = sel.value;
                var o = self.obras.find(function (x) { return x.id === id; });
                self.obraActual = o || null;
                self.analizarYRender();
            });
            var rec = document.getElementById("lab-recargar");
            if (rec) rec.addEventListener("click", function () {
                self.cargarObras();
                if (self.obraActual) {
                    // Rebusca la obra
                    var o = self.obras.find(function (x) { return x.id === self.obraActual.id; });
                    if (o) self.obraActual = o;
                }
                self.analizarYRender();
            });
        },

        analizarYRender: function () {
            if (!this.obraActual) { this.renderVacio(); return; }
            var texto = this.extraerTexto(this.obraActual);
            if (!texto || texto.trim().length < 20) {
                document.getElementById("lab-resultado").innerHTML =
                    '<div class="lab-vacio">' +
                        SVG.lupa +
                        '<div class="lv-titulo">Esta obra apenas comienza</div>' +
                        '<div class="lv-desc">El texto tiene muy pocas palabras para un analisis significativo. Vuelve cuando hayas escrito un poco mas.</div>' +
                    '</div>';
                return;
            }
            this.analisis = analizar(texto);
            this.render();
        },

        render: function () {
            var a = this.analisis;
            var o = this.obraActual;
            var cont = document.getElementById("lab-resultado");
            if (!cont || !a) return;

            var html = '<div class="lab-wrap">';

            // ---------- Stats principales ----------
            var minutosTexto = "";
            if (a.minutosSilenciosa < 1) minutosTexto = "menos de 1 min";
            else if (a.minutosSilenciosa < 60) minutosTexto = Math.round(a.minutosSilenciosa) + " min";
            else minutosTexto = (a.minutosSilenciosa / 60).toFixed(1) + " h";

            html += '<div class="lab-stats">';

            html += statCard(formatearNumero(a.total), "Palabras totales", "#B5613F",
                "La respiracion completa del texto.");

            html += statCard(formatearNumero(a.unicas), "Vocabulario unico", "#2A3F5F",
                "Palabras distintas usadas.");

            html += statCard(a.ttr.toFixed(1) + "%", "Riqueza lexica", "#3D4D2E",
                "Palabras unicas sobre el total. Mayor = mas variado.");

            html += statCard(formatearNumero(a.oraciones), "Oraciones", "#8B2E2E",
                "Frases desde mayuscula hasta punto.");

            html += statCard(a.promedioLargoOracion.toFixed(1), "Palabras por oracion", "#9A7A1E",
                "Promedio. 15-20 es ritmo comodo.");

            html += statCard(minutosTexto, "Tiempo de lectura", "#6B4F6E",
                "Silenciosa, ~200 palabras por minuto.");

            html += '</div>';

            // ---------- Top palabras ----------
            html += '<div class="lab-bloque">';
            html += '<div class="lab-bloque-titulo"><h3>Las palabras que vuelven</h3><span class="lb-desc">' + a.topPalabras.length + ' mas frecuentes · sin articulos ni preposiciones</span></div>';
            if (a.topPalabras.length === 0) {
                html += '<p style="color:var(--fg-subtle);font-style:italic;">Sin palabras suficientes.</p>';
            } else {
                var maxFreq = a.topPalabras[0].cuenta;
                html += '<div>';
                a.topPalabras.forEach(function (t) {
                    var pct = maxFreq > 0 ? (t.cuenta / maxFreq) * 100 : 0;
                    html += '<div class="barra-h">' +
                        '<span class="bh-palabra">' + escapar(t.palabra) + '</span>' +
                        '<div class="bh-track"><div class="bh-fill" style="width:' + pct + '%"></div></div>' +
                        '<span class="bh-cuenta">' + t.cuenta + '</span>' +
                    '</div>';
                });
                html += '</div>';
            }
            html += '</div>';

            // ---------- Grid 2 columnas ----------
            html += '<div class="lab-grid-2">';

            // Histograma
            html += '<div class="lab-bloque">';
            html += '<div class="lab-bloque-titulo"><h3>Ritmo de las oraciones</h3><span class="lb-desc">palabras por oracion</span></div>';
            var maxHist = 0;
            a.histograma.forEach(function (h) { if (h.cuenta > maxHist) maxHist = h.cuenta; });
            if (maxHist === 0) maxHist = 1;
            html += '<div class="histograma">';
            a.histograma.forEach(function (h) {
                var alto = (h.cuenta / maxHist) * 100;
                html += '<div class="hist-bar" style="height:' + Math.max(2, alto) + '%" data-info="' + h.rango + ' pal · ' + h.cuenta + ' orac."></div>';
            });
            html += '</div>';
            html += '<div class="hist-eje"><span>1-5</span><span>16-20</span><span>41+</span></div>';
            html += '</div>';

            // Legibilidad
            html += '<div class="lab-bloque">';
            html += '<div class="lab-bloque-titulo"><h3>Legibilidad</h3><span class="lb-desc">Fernandez Huerta</span></div>';
            html += '<div class="legibilidad-wrap">';
            // Escala: 0-100. Marcador entre 0% y 100%
            var legPct = Math.max(0, Math.min(100, a.legibilidad));
            html += '<div class="legibilidad-barra">';
            html += '<div class="legibilidad-marcador" style="left:' + legPct + '%"></div>';
            html += '</div>';
            html += '<div class="legibilidad-escala"><span>Muy dificil</span><span>Dificil</span><span>Normal</span><span>Facil</span><span>Muy facil</span></div>';
            html += '<div class="legibilidad-veredicto">' + veredictoLegibilidad(a.legibilidad) + ' Puntaje: <span class="mono">' + a.legibilidad.toFixed(1) + '</span>.</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>'; // cierra grid-2

            // ---------- Palabras firma ----------
            if (a.firma.length > 0) {
                html += '<div class="lab-bloque">';
                html += '<div class="lab-bloque-titulo"><h3>Tu firma</h3><span class="lb-desc">palabras que te distinguen del español comun</span></div>';
                html += '<div class="palabras-firma">';
                a.firma.forEach(function (f) {
                    html += '<span class="firma-tag">' + escapar(f.palabra) + '<span class="ft-cuenta">' + f.cuenta + '</span></span>';
                });
                html += '</div>';
                html += '</div>';
            }

            // ---------- Frases repetidas ----------
            if (a.frasesRepetidas.length > 0) {
                html += '<div class="lab-bloque">';
                html += '<div class="lab-bloque-titulo"><h3>Frases que regresan</h3><span class="lb-desc">grupos de 4 palabras repetidos 3 o mas veces</span></div>';
                html += '<div class="frases-repetidas">';
                a.frasesRepetidas.forEach(function (f) {
                    html += '<div class="frase-item"><span class="fi-cuenta">' + f.cuenta + '</span><span>' + escapar(f.frase) + '</span></div>';
                });
                html += '</div>';
                html += '</div>';
            }

            // ---------- Grid 2: Emociones + Puntuacion ----------
            html += '<div class="lab-grid-2">';

            // Emociones
            html += '<div class="lab-bloque">';
            html += '<div class="lab-bloque-titulo"><h3>Clima emocional</h3><span class="lb-desc">' + (a.positivos + a.negativos) + ' marcadores</span></div>';
            if (a.positivos + a.negativos === 0) {
                html += '<p style="color:var(--fg-subtle);font-style:italic;font-size:13.5px;line-height:1.6;">No se detectaron marcadores emocionales en el lexico basico. El texto se sostiene en otras dimensiones: imagenes, ritmo, accion.</p>';
            } else {
                html += '<div class="emocion-grupo">';
                html += emocionFila("Apertura / luz", a.positivos, a.ratioPositivo, "#3D4D2E");
                html += emocionFila("Sombra / dolor", a.negativos, a.ratioNegativo, "#8B2E2E");
                html += '</div>';
                html += '<p style="margin-top:14px;font-family:var(--f-cuerpo);font-style:italic;font-size:12.5px;color:var(--fg-muted);line-height:1.55;">' + veredictoEmocional(a.ratioPositivo, a.ratioNegativo) + '</p>';
            }
            html += '</div>';

            // Puntuacion
            html += '<div class="lab-bloque">';
            html += '<div class="lab-bloque-titulo"><h3>Respiracion grafica</h3><span class="lb-desc">signos usados</span></div>';
            html += '<div class="puntuacion-grid">';
            html += puntItem(".", a.puntuacion.puntos, "puntos");
            html += puntItem(",", a.puntuacion.comas, "comas");
            html += puntItem("¿?", a.puntuacion.interrogaciones, "preguntas");
            html += puntItem("¡!", a.puntuacion.exclamaciones, "excl.");
            html += puntItem("…", a.puntuacion.puntosSuspensivos, "suspensivos");
            html += puntItem(";", a.puntuacion.puntoComa, "punto y coma");
            html += puntItem(":", a.puntuacion.dosPuntos, "dos puntos");
            html += puntItem("—", a.puntuacion.guiones, "guiones");
            html += '</div>';
            html += '</div>';

            html += '</div>'; // cierra grid-2

            // ---------- Nota final ----------
            html += '<p style="font-family:var(--f-cuerpo);font-style:italic;font-size:13px;color:var(--fg-subtle);text-align:center;line-height:1.65;max-width:60ch;margin:0 auto;">' +
                'Estos numeros no son un juicio. Son una radiografia: muestran lo que el texto hace cuando nadie lo mira. ' +
                'Lo que importa no es el valor, sino lo que revela.' +
            '</p>';

            html += '</div>'; // cierra lab-wrap

            cont.innerHTML = html;
        }
    };

    // ---------- Helpers de render ----------
    function statCard(valor, label, color, desc) {
        return '<div class="lab-stat" style="--stat-color:' + color + '">' +
            '<div class="ls-valor">' + valor + '</div>' +
            '<div class="ls-label">' + escapar(label) + '</div>' +
            '<div class="ls-desc">' + escapar(desc) + '</div>' +
        '</div>';
    }

    function emocionFila(nombre, cuenta, pct, color) {
        return '<div class="emocion-fila">' +
            '<span class="emocion-nombre">' + escapar(nombre) + '</span>' +
            '<div class="emocion-barra"><div class="eb-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<span class="emocion-valor">' + cuenta + ' · ' + Math.round(pct) + '%</span>' +
        '</div>';
    }

    function puntItem(signo, cuenta, nombre) {
        return '<div class="puntuacion-item">' +
            '<div class="puntuacion-signo">' + escapar(signo) + '</div>' +
            '<div class="puntuacion-cuenta">' + cuenta + '</div>' +
            '<div class="puntuacion-nombre">' + escapar(nombre) + '</div>' +
        '</div>';
    }

    function veredictoLegibilidad(p) {
        if (p < 30) return "Texto denso, exigente. Propio de la prosa poetica o del ensayo filosofico. El lector necesita detenerse.";
        if (p < 50) return "Texto dificil, pero no hermetico. Pide atencion sostenida y cierta cultura literaria.";
        if (p < 65) return "Legibilidad normal. Apto para un lector adulto con formacion media.";
        if (p < 80) return "Texto claro, directo, comodo de leer. Facilita la lectura larga.";
        return "Textura muy accesible. Cuidado: a veces la facilidad viene de frases cortas que fragmentan el ritmo.";
    }

    function veredictoEmocional(pos, neg) {
        if (pos >= 70) return "El texto respira apertura. Predominan la luz, el cuerpo, la afirmacion.";
        if (neg >= 70) return "El texto esta atravesado por la sombra. Dolor, perdida, intemperie emocional.";
        if (pos >= 55) return "Leve predominio de lo luminoso, con algunos pliegues oscuros.";
        if (neg >= 55) return "Leve predominio de lo oscuro, con momentos de claridad.";
        return "Equilibrio entre apertura y sombra. El texto respira en las dos direcciones.";
    }

    window.LitteraLaboratorio = Lab;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("lab-obra")) {
            Lab.init();
        }
    });
})();

// ============================================
// LITTERA v5 - Comparador de obras
// ============================================
(function () {
    "use strict";
    if (!window.LitteraLaboratorio) return;

    var K_OBRAS = "littera.obras";

    function leer(k,d){ try{var r=localStorage.getItem(k); return r?JSON.parse(r):d;}catch(e){return d;} }
    function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

    var Comp = {
        init: function(){
            if (!document.getElementById("comp-obra-a")) return;
            this.cargarSelectores();
            this.bind();
        },
        cargarSelectores: function(){
            var obras = leer(K_OBRAS, []);
            ["comp-obra-a","comp-obra-b"].forEach(function(id){
                var sel = document.getElementById(id);
                if (!sel) return;
                sel.innerHTML = '<option value="">— Elige una obra —</option>';
                obras.forEach(function(o){
                    var opt = document.createElement("option");
                    opt.value = o.id;
                    opt.textContent = (o.titulo || "Sin titulo") + " · " + (o.tipo || "prosa");
                    sel.appendChild(opt);
                });
            });
        },
        bind: function(){
            var self = this;
            ["comp-obra-a","comp-obra-b"].forEach(function(id){
                var sel = document.getElementById(id);
                if (sel) sel.addEventListener("change", function(){ self.comparar(); });
            });
        },
        comparar: function(){
            var obras = leer(K_OBRAS, []);
            var a = obras.find(function(x){ return x.id === document.getElementById("comp-obra-a").value; });
            var b = obras.find(function(x){ return x.id === document.getElementById("comp-obra-b").value; });
            var cont = document.getElementById("comp-resultado");
            if (!a || !b) { cont.innerHTML = ""; return; }

            var textoA = this.extraer(a), textoB = this.extraer(b);
            var anA = window.LitteraLaboratorio.analizarExterno ? window.LitteraLaboratorio.analizarExterno(textoA) : null;
            var anB = window.LitteraLaboratorio.analizarExterno ? window.LitteraLaboratorio.analizarExterno(textoB) : null;

            if (!anA || !anB) { cont.innerHTML = "<p>Funcion analizarExterno no disponible.</p>"; return; }

            var filas = [
                ["Palabras", anA.total, anB.total],
                ["Vocabulario unico", anA.unicas, anB.unicas],
                ["Riqueza lexica (%)", anA.ttr.toFixed(1), anB.ttr.toFixed(1)],
                ["Oraciones", anA.oraciones, anB.oraciones],
                ["Palabras por oracion", anA.promedioLargoOracion.toFixed(1), anB.promedioLargoOracion.toFixed(1)],
                ["Legibilidad", anA.legibilidad.toFixed(1), anB.legibilidad.toFixed(1)],
                ["Marcadores positivos", anA.positivos, anB.positivos],
                ["Marcadores negativos", anA.negativos, anB.negativos]
            ];

            var html = '<div class="lab-bloque" style="margin-top:var(--e-5);">';
            html += '<div class="lab-bloque-titulo"><h3>Comparacion</h3><span class="lb-desc">' + esc(a.titulo) + ' vs ' + esc(b.titulo) + '</span></div>';
            html += '<table style="width:100%;border-collapse:collapse;font-family:var(--f-mono);font-size:13px;">';
            html += '<thead><tr style="border-bottom:1px solid var(--border);">';
            html += '<th style="text-align:left;padding:10px 8px;font-weight:500;color:var(--fg-subtle);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;">Metrica</th>';
            html += '<th style="text-align:right;padding:10px 8px;font-weight:500;color:var(--fg-subtle);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;">' + esc(a.titulo) + '</th>';
            html += '<th style="text-align:right;padding:10px 8px;font-weight:500;color:var(--fg-subtle);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;">' + esc(b.titulo) + '</th>';
            html += '</tr></thead><tbody>';
            filas.forEach(function(f){
                html += '<tr style="border-bottom:1px solid var(--border);">';
                html += '<td style="padding:10px 8px;color:var(--fg-muted);">' + f[0] + '</td>';
                html += '<td style="padding:10px 8px;text-align:right;color:var(--fg-strong);font-weight:500;">' + f[1] + '</td>';
                html += '<td style="padding:10px 8px;text-align:right;color:var(--fg-strong);font-weight:500;">' + f[2] + '</td>';
                html += '</tr>';
            });
            html += '</tbody></table></div>';
            cont.innerHTML = html;
        },
        extraer: function(o){
            var partes = [];
            if (o.tipo === "novela" && o.capitulos) o.capitulos.forEach(function(c){ if (c.texto) partes.push(c.texto); });
            else if (o.tipo === "diario" && o.entradas) o.entradas.forEach(function(e){ if (e.texto) partes.push(e.texto); });
            else if (o.tipo === "revista" && o.secciones) o.secciones.forEach(function(s){ if (s.texto) partes.push(s.texto); });
            else if (o.tipo === "fanzine" && o.paginas) o.paginas.forEach(function(p){ if (p.texto) partes.push(p.texto); });
            else if (o.tipo === "aforismos" && o.aforismos) o.aforismos.forEach(function(a){ if (a.texto) partes.push(a.texto); });
            else if (o.texto) partes.push(o.texto);
            return partes.join("\n\n");
        }
    };

    window.LitteraComparador = Comp;
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("comp-obra-a")) Comp.init();
    });
})();

