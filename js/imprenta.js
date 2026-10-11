// ============================================
// LITTERA v4.2 - Imprenta
// Conversion de texto a PDF imprimible
// ============================================
(function () {
    "use strict";

    var CLAVE_OBRAS = "littera.obras";
    var CLAVE_AUTOR = "littera.autor";
    var CLAVE_IMP_CONFIG = "littera.imprenta.config";

    // Formatos de papel: nombre, ancho, alto (en mm), clase CSS
    var PAPELES = {
        "a6":          { nombre: "A6",              ancho: 105, alto: 148, familia: "A",    nota: "Libro de bolsillo" },
        "a5":          { nombre: "A5",              ancho: 148, alto: 210, familia: "A",    nota: "Fanzine, libro pequeno" },
        "a4":          { nombre: "A4",              ancho: 210, alto: 297, familia: "A",    nota: "Estandar oficina" },
        "a3":          { nombre: "A3",              ancho: 297, alto: 420, familia: "A",    nota: "Revista grande" },
        "a2":          { nombre: "A2",              ancho: 420, alto: 594, familia: "A",    nota: "Poster, libro de arte" },
        "carta":       { nombre: "Carta",           ancho: 216, alto: 279, familia: "US",   nota: "216 x 279 mm" },
        "oficio":      { nombre: "Oficio",          ancho: 216, alto: 356, familia: "US",   nota: "216 x 356 mm" },
        "tabloide":    { nombre: "Tabloide",        ancho: 279, alto: 432, familia: "US",   nota: "11 x 17 pulgadas" },
        "libro-p":     { nombre: "Libro pequeno",   ancho: 110, alto: 180, familia: "L",    nota: "11 x 18 cm · Poesia" },
        "libro-g":     { nombre: "Libro grande",    ancho: 170, alto: 240, familia: "L",    nota: "17 x 24 cm · Novela" },
        "narrativo":   { nombre: "Narrativo",       ancho: 150, alto: 230, familia: "L",    nota: "15 x 23 cm · Cuento" },
        "revista":     { nombre: "Revista",         ancho: 210, alto: 280, familia: "L",    nota: "21 x 28 cm" }
    };

    var TIPOGRAFIAS = {
        "garamond":   { nombre: "EB Garamond",       cuerpo: "EB Garamond", titulo: "Instrument Serif", tam: 11, interlinea: 1.5 },
        "literata":   { nombre: "Literata",          cuerpo: "Literata",    titulo: "Instrument Serif", tam: 11, interlinea: 1.55 },
        "cormorant":  { nombre: "Cormorant Garamond",cuerpo: "EB Garamond", titulo: "Instrument Serif", tam: 10, interlinea: 1.5 },
        "sans":       { nombre: "Inter",             cuerpo: "Inter",       titulo: "Instrument Serif", tam: 11, interlinea: 1.6 }
    };

    var GENEROS_COLOR = {
        poesia:    "#C66B4A",
        cuento:    "#7A8B5C",
        novela:    "#6E2C3C",
        ensayo:    "#3B4A6B",
        cronica:   "#A66A3D",
        diario:    "#6B4F6E",
        aforismos: "#B8860B",
        fanzine:   "#D4A24C",
        revista:   "#4A7C7E",
        historia:  "#2A3F5F",
        prosa:     "#38302A",
        verso:     "#8B2E2E",
        visual:    "#6E2C3C"
    };

    var SVG = {
        libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        descargar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        ojos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };

    // ---------- Utilidades ----------
    function leer(k, d) {
        try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; }
        catch (e) { return d; }
    }
    function escribir(k, v) {
        try { localStorage.setItem(k, JSON.stringify(v)); return true; }
        catch (e) { return false; }
    }
    function escapar(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    function contarPalabras(t) {
        t = (t || "").replace(/<[^>]+>/g, " ").trim();
        return t ? t.split(/\s+/).length : 0;
    }
    function toast(mensaje, tipo) {
        var cont = document.getElementById("toasts");
        if (!cont) return;
        var t = document.createElement("div");
        t.className = "toast " + (tipo || "exito");
        var icono = tipo === "aviso" ? SVG.alerta : SVG.check;
        t.innerHTML = icono + "<span>" + escapar(mensaje) + "</span>";
        cont.appendChild(t);
        setTimeout(function () {
            t.classList.add("saliendo");
            setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
        }, 2600);
    }

    // ---------- Imprenta ----------
    var Imp = {
        obras: [],
        obraActual: null,
        config: null,
        paginasGeneradas: [],

        init: function () {
            if (!document.getElementById("imp-obra")) return;
            this.cargarConfig();
            this.cargarObras();
            this.bind();
            this.renderPreview();
        },

        cargarConfig: function () {
            var def = {
                papel: "a5",
                tipografia: "garamond",
                tamano: 11,
                margenes: "normales",
                portada: true,
                creditos: true,
                colofon: true,
                numeracion: true,
                encabezados: true,
                autor: leer(CLAVE_AUTOR, "José Luis Gaete Hernández"),
                tituloOverride: "",
                subtitulo: "",
                dedicatoria: "",
                editorial: ""
            };
            var guardada = leer(CLAVE_IMP_CONFIG, {});
            this.config = Object.assign(def, guardada || {});
        },
        guardarConfig: function () {
            escribir(CLAVE_IMP_CONFIG, this.config);
            escribir(CLAVE_AUTOR, this.config.autor);
        },
        cargarObras: function () {
            this.obras = leer(CLAVE_OBRAS, []);
            var sel = document.getElementById("imp-obra");
            if (!sel) return;
            sel.innerHTML = '<option value="">— Elige una obra —</option>';
            this.obras.forEach(function (o) {
                var opt = document.createElement("option");
                opt.value = o.id;
                var tipo = o.tipo || "prosa";
                var palabras = contarPalabras(o.texto || Imp.textoCompleto(o));
                opt.textContent = (o.titulo || "Sin titulo") + " · " + tipo + " · " + palabras + " pal.";
                sel.appendChild(opt);
            });
        },

        textoCompleto: function (o) {
            // Extrae el texto completo de una obra segun su tipo
            var partes = [];
            if (o.tipo === "novela" && o.capitulos) {
                o.capitulos.forEach(function (c) {
                    partes.push("## " + (c.titulo || "Sin titulo"));
                    partes.push(c.texto || "");
                });
            } else if (o.tipo === "diario" && o.entradas) {
                o.entradas.forEach(function (e) {
                    partes.push("## " + (e.fecha || "") + (e.titulo ? " · " + e.titulo : ""));
                    partes.push(e.texto || "");
                });
            } else if (o.tipo === "revista" && o.secciones) {
                o.secciones.forEach(function (s) {
                    partes.push("## " + (s.titulo || "Sin titulo"));
                    if (s.autor) partes.push("_" + s.autor + "_");
                    partes.push(s.texto || "");
                });
            } else if (o.tipo === "fanzine" && o.paginas) {
                o.paginas.forEach(function (p, i) {
                    partes.push("## Pagina " + (i + 1));
                    partes.push(p.texto || "");
                });
            } else if (o.tipo === "aforismos" && o.aforismos) {
                o.aforismos.forEach(function (a) { partes.push(a.texto || ""); });
            } else if (o.tipo === "cuento") {
                partes.push(o.texto || "");
            } else {
                partes.push(o.texto || "");
            }
            return partes.filter(Boolean).join("\n\n");
        },

        // ---------- Preview ----------
        renderPreview: function () {
            var area = document.getElementById("imp-vista");
            if (!area) return;

            if (!this.obraActual) {
                area.innerHTML =
                    '<div class="imp-vacio">' +
                        SVG.libro +
                        '<div class="imp-vacio-titulo">El texto busca su forma</div>' +
                        '<div class="imp-vacio-desc">Elige una obra a la izquierda. La veras aqui compuesta en la pagina, con su tipografia, sus margenes y su portada. Cuando este lista, presiona Exportar PDF.</div>' +
                    '</div>';
                this.actualizarToolbar();
                return;
            }

            var html = '';
            var o = this.obraActual;

            // Portada
            if (this.config.portada) {
                html += this.paginaPortadaHTML();
            }
            // Creditos
            if (this.config.creditos) {
                html += this.paginaCreditosHTML();
            }
            // Primera pagina de contenido (preview)
            html += this.paginaContenidoHTML(1, true);
            // Colofon (preview)
            if (this.config.colofon) {
                html += this.paginaColofonHTML();
            }

            area.innerHTML = '<div style="display:flex;flex-direction:column;gap:28px;align-items:center;">' + html + '</div>';
            this.actualizarToolbar();
        },

        dimsPapel: function () {
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            // Escala visual para que quepa en la pantalla (140px de ancho por 100mm)
            var escala = 1.05;
            return {
                anchoMM: p.ancho,
                altoMM: p.alto,
                anchoPx: Math.round(p.ancho * escala),
                altoPx: Math.round(p.alto * escala),
                nombre: p.nombre
            };
        },

        calcularPadding: function () {
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            var minMM;
            switch (this.config.margenes) {
                case "estrechos": minMM = Math.max(8, p.ancho * 0.06); break;
                case "amplios":   minMM = Math.max(20, p.ancho * 0.14); break;
                default:          minMM = Math.max(12, p.ancho * 0.10); // normales
            }
            var anchoMM = p.ancho;
            var escala = 1.05;
            return Math.round(minMM * escala);
        },

        escalaFuente: function () {
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            // Ajuste segun ancho: A6 mas pequeno, A2 mas grande
            var base = this.config.tamano || 11;
            var factor = p.ancho / 148; // A5 = referencia
            if (factor < 0.8) factor = 0.85;
            if (factor > 2.5) factor = 2.5;
            var px = base * factor * 1.05 * 1.333; // 1pt ≈ 1.333px
            return Math.round(px);
        },

        paginaPortadaHTML: function () {
            var dims = this.dimsPapel();
            var o = this.obraActual;
            var titulo = this.config.tituloOverride || (o && o.titulo) || "Sin titulo";
            var subtitulo = this.config.subtitulo || "";
            var genero = this.generoLegible(o ? o.tipo : "prosa");
            var anio = new Date().getFullYear();
            var color = GENEROS_COLOR[o ? o.tipo : "prosa"] || "#8B2E2E";

            return '' +
                '<div class="imp-pagina tipo-portada" style="width:' + dims.anchoPx + 'px;height:' + dims.altoPx + 'px;position:relative;">' +
                    '<div class="imp-portada-interior">' +
                        '<div class="imp-portada-kicker" style="color:' + color + '">' + escapar(genero) + '</div>' +
                        '<div class="imp-portada-titulo">' + escapar(titulo) + '</div>' +
                        (subtitulo ? '<div style="font-family:\'EB Garamond\',serif;font-style:italic;font-size:0.9em;color:#6B5E51;margin-top:1.2em;">' + escapar(subtitulo) + '</div>' : '') +
                        '<div class="imp-portada-autor">' + escapar(this.config.autor || "Anonimo") + '</div>' +
                    '</div>' +
                    '<div class="imp-portada-ano">' + anio + ' · LITTERA</div>' +
                '</div>';
        },

        paginaCreditosHTML: function () {
            var dims = this.dimsPapel();
            var o = this.obraActual;
            var titulo = this.config.tituloOverride || (o && o.titulo) || "Sin titulo";
            var anio = new Date().getFullYear();
            var editorial = this.config.editorial || "Edicion del autor";

            return '' +
                '<div class="imp-pagina" style="width:' + dims.anchoPx + 'px;height:' + dims.altoPx + 'px;">' +
                    '<div class="imp-creditos-interior">' +
                        '<div class="cr-titulo">' + escapar(titulo) + '</div>' +
                        '<p>' + escapar(this.config.autor || "Anonimo") + '</p>' +
                        '<p style="font-size:0.9em;color:#7A736A;">' + escapar(editorial) + '</p>' +
                        '<span class="cr-asterisco">*</span>' +
                        '<p style="font-size:0.85em;color:#7A736A;">Primera edicion · ' + anio + '</p>' +
                        (this.config.dedicatoria ? '<p style="margin-top:2.5em;font-style:italic;">' + escapar(this.config.dedicatoria) + '</p>' : '') +
                    '</div>' +
                '</div>';
        },

        paginaColofonHTML: function () {
            var dims = this.dimsPapel();
            var anio = new Date().getFullYear();
            var tipografia = TIPOGRAFIAS[this.config.tipografia] || TIPOGRAFIAS.garamond;
            var papel = PAPELES[this.config.papel] || PAPELES["a5"];

            return '' +
                '<div class="imp-pagina" style="width:' + dims.anchoPx + 'px;height:' + dims.altoPx + 'px;">' +
                    '<div class="imp-creditos-interior" style="font-size:0.85em;line-height:1.9;">' +
                        '<p style="margin-bottom:2em;font-style:italic;color:#7A736A;">Colofon</p>' +
                        '<p>Esta obra se termino de componer</p>' +
                        '<p>en Littera, el ano ' + anio + ',</p>' +
                        '<p>en tipografia ' + escapar(tipografia.cuerpo) + ',</p>' +
                        '<p>sobre papel ' + escapar(papel.nombre) + '.</p>' +
                        '<span class="cr-asterisco">*</span>' +
                        '<p style="color:#7A736A;font-size:0.9em;">' + escapar(this.config.autor || "Anonimo") + '</p>' +
                    '</div>' +
                '</div>';
        },

        paginaContenidoHTML: function (num, primera) {
            var dims = this.dimsPapel();
            var padding = this.calcularPadding();
            var size = this.escalaFuente();
            var tipografia = TIPOGRAFIAS[this.config.tipografia] || TIPOGRAFIAS.garamond;
            var o = this.obraActual;
            var parrafos = this.extraerParrafos(o);
            var titulo = this.config.tituloOverride || (o && o.titulo) || "";

            // Encabezado
            var encabezado = "";
            if (this.config.encabezados && !primera) {
                encabezado = '<div class="pg-encabezado" style="margin-bottom:1.5em;">' + escapar(titulo) + '</div>';
            }

            // Parrafos simulados (solo los primeros)
            var cuerpo = "";
            parrafos.slice(0, 8).forEach(function (p, i) {
                if (p.tipo === "titulo") {
                    cuerpo += '<div class="pg-parrafo-titulo">' +
                        (p.num ? '<span class="pg-cap-num">' + escapar(p.num) + '</span>' : '') +
                        '<span class="pg-cap-titulo">' + escapar(p.texto) + '</span>' +
                        '</div>';
                } else {
                    cuerpo += '<p class="pg-linea ' + (i === 0 ? "sin-sangria" : "con-sangria") + '">' + escapar(p.texto) + '</p>';
                }
            });

            // Numeracion
            var numHTML = "";
            if (this.config.numeracion) {
                numHTML = '<div class="pg-num" style="margin-top:auto;padding-top:2em;">' + num + '</div>';
            }

            return '' +
                '<div class="imp-pagina" style="width:' + dims.anchoPx + 'px;height:' + dims.altoPx + 'px;">' +
                    '<div class="pg-interior" style="padding:' + padding + 'px ' + padding + 'px ' + Math.round(padding * 1.3) + 'px ' + padding + 'px;font-family:\'' + tipografia.cuerpo + '\',Georgia,serif;font-size:' + size + 'px;line-height:' + tipografia.interlinea + ';color:#1B1712;">' +
                        encabezado +
                        cuerpo +
                        numHTML +
                    '</div>' +
                '</div>';
        },

        extraerParrafos: function (o) {
            if (!o) return [];
            var texto = Imp.textoCompleto(o);
            var lineas = texto.split(/\n\n+/);
            var out = [];
            lineas.forEach(function (bloque) {
                var b = bloque.trim();
                if (!b) return;
                if (b.indexOf("## ") === 0) {
                    out.push({ tipo: "titulo", texto: b.replace(/^##\s*/, ""), num: "Capitulo" });
                } else {
                    // Dividir parrafos largos
                    b.split(/\n/).forEach(function (ln) {
                        ln = ln.trim();
                        if (ln) out.push({ tipo: "texto", texto: ln });
                    });
                }
            });
            if (out.length === 0) {
                out.push({ tipo: "texto", texto: "(Esta obra aun no tiene contenido.)" });
            }
            return out;
        },

        actualizarToolbar: function () {
            var info = document.getElementById("imp-info");
            if (!info) return;

            if (!this.obraActual) {
                info.innerHTML = '<span style="color:var(--fg-subtle);">Sin obra seleccionada</span>';
                return;
            }

            var p = PAPELES[this.config.papel];
            var palabras = contarPalabras(Imp.textoCompleto(this.obraActual));
            var palabrasPorPagina = this.estimarPalabrasPagina();
            var paginas = Math.max(1, Math.ceil(palabras / palabrasPorPagina));
            var totalConPortada = paginas + (this.config.portada ? 1 : 0) + (this.config.creditos ? 1 : 0) + (this.config.colofon ? 1 : 0);

            info.innerHTML =
                '<span><strong>' + escapar(p.nombre) + '</strong></span>' +
                '<span class="sep">·</span>' +
                '<span>' + p.ancho + ' × ' + p.alto + ' mm</span>' +
                '<span class="sep">·</span>' +
                '<span>~' + totalConPortada + ' paginas</span>' +
                '<span class="sep">·</span>' +
                '<span>' + palabras + ' palabras</span>';
        },

        estimarPalabrasPagina: function () {
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            var areaCM2 = (p.ancho / 10) * (p.alto / 10);
            // Aproximacion: ~40 palabras por cada 100 cm²
            return Math.max(80, Math.round(areaCM2 * 0.4 * 4));
        },

        generoLegible: function (tipo) {
            var m = {
                prosa: "Prosa",
                cuento: "Cuento",
                novela: "Novela",
                historia: "Historia ilustrada",
                verso: "Poesia",
                visual: "Poesia visual",
                diario: "Diario",
                cronica: "Cronica",
                aforismos: "Aforismos",
                fanzine: "Fanzine",
                revista: "Revista"
            };
            return m[tipo] || "Literatura";
        },

        // ---------- Exportar PDF ----------
        exportarPDF: function () {
            if (!this.obraActual) {
                toast("Elige una obra primero", "aviso");
                return;
            }
            var html = this.construirHTMLLibro();
            this.imprimirHTML(html);
            toast("Preparando PDF...");
        },

        construirHTMLLibro: function () {
            var o = this.obraActual;
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            var tipografia = TIPOGRAFIAS[this.config.tipografia] || TIPOGRAFIAS.garamond;

            // Margenes en mm
            var marginMM;
            switch (this.config.margenes) {
                case "estrechos": marginMM = Math.max(10, p.ancho * 0.07); break;
                case "amplios":   marginMM = Math.max(25, p.ancho * 0.15); break;
                default:          marginMM = Math.max(15, p.ancho * 0.11);
            }
            var marginInt = Math.round(marginMM);
            var marginExt = Math.round(marginMM * 1.3);
            var marginSup = Math.round(marginMM);
            var marginInf = Math.round(marginMM * 1.4);

            // Regla @page
            var pageCSS =
                '@page {' +
                    'size: ' + p.ancho + 'mm ' + p.alto + 'mm;' +
                    'margin: 0;' +
                '}' +
                '@page :first { margin: 0; }' +
                'html, body { margin: 0; padding: 0; background: white; }' +
                'body { font-family: "' + tipografia.cuerpo + '", Georgia, serif; color: #1B1712; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
                '.pagina {' +
                    'width: ' + p.ancho + 'mm;' +
                    'height: ' + p.alto + 'mm;' +
                    'page-break-after: always;' +
                    'break-after: page;' +
                    'padding: ' + marginSup + 'mm ' + marginExt + 'mm ' + marginInf + 'mm ' + marginInt + 'mm;' +
                    'box-sizing: border-box;' +
                    'position: relative;' +
                    'overflow: hidden;' +
                    'font-size: ' + tipografia.tam + 'pt;' +
                    'line-height: ' + tipografia.interlinea + ';' +
                '}' +
                '.pagina:last-child { page-break-after: auto; break-after: auto; }' +
                '.pagina.contenido p { margin: 0 0 0 0; text-indent: 1.5em; text-align: justify; hyphens: auto; }' +
                '.pagina.contenido p.sin-sangria { text-indent: 0; }' +
                '.pagina.contenido h2, .pagina.contenido .cap-titulo {' +
                    'font-family: "EB Garamond", Georgia, serif;' +
                    'font-style: italic;' +
                    'font-weight: 500;' +
                    'font-size: 1.6em;' +
                    'line-height: 1.2;' +
                    'margin: 0 0 1.2em 0;' +
                    'text-indent: 0;' +
                    'text-align: left;' +
                '}' +
                '.pagina.contenido .cap-num {' +
                    'display: block;' +
                    'font-family: "JetBrains Mono", monospace;' +
                    'font-size: 0.7em;' +
                    'text-transform: uppercase;' +
                    'letter-spacing: 0.2em;' +
                    'color: #8B2E2E;' +
                    'margin-bottom: 0.6em;' +
                    'font-style: normal;' +
                '}' +
                '.pagina .encabezado {' +
                    'font-family: "EB Garamond", serif;' +
                    'font-size: 0.7em;' +
                    'font-variant: small-caps;' +
                    'letter-spacing: 0.08em;' +
                    'color: #7A736A;' +
                    'text-align: center;' +
                    'margin-bottom: 1.5em;' +
                '}' +
                '.pagina .num-pagina {' +
                    'position: absolute;' +
                    'bottom: ' + Math.round(marginInf * 0.6) + 'mm;' +
                    'left: 0;' +
                    'right: 0;' +
                    'text-align: center;' +
                    'font-size: 0.7em;' +
                    'color: #6B5E51;' +
                '}' +
                '.portada {' +
                    'display: flex;' +
                    'flex-direction: column;' +
                    'justify-content: center;' +
                    'align-items: center;' +
                    'text-align: center;' +
                    'padding: 15% 12%;' +
                    'background: #FCFAF4;' +
                '}' +
                '.portada .kicker {' +
                    'font-family: "JetBrains Mono", monospace;' +
                    'font-size: 9pt;' +
                    'text-transform: uppercase;' +
                    'letter-spacing: 0.24em;' +
                    'color: #8B2E2E;' +
                    'margin-bottom: 1.5em;' +
                '}' +
                '.portada h1 {' +
                    'font-family: "Instrument Serif", "EB Garamond", Georgia, serif;' +
                    'font-style: italic;' +
                    'font-weight: 400;' +
                    'font-size: 32pt;' +
                    'line-height: 1.05;' +
                    'letter-spacing: -0.02em;' +
                    'color: #0B0907;' +
                    'margin: 0 0 0.5em 0;' +
                '}' +
                '.portada .subtitulo {' +
                    'font-family: "EB Garamond", serif;' +
                    'font-style: italic;' +
                    'font-size: 14pt;' +
                    'color: #6B5E51;' +
                    'margin-top: 0.5em;' +
                '}' +
                '.portada .autor {' +
                    'font-family: "Inter", sans-serif;' +
                    'font-size: 9pt;' +
                    'text-transform: uppercase;' +
                    'letter-spacing: 0.22em;' +
                    'color: #38302A;' +
                    'margin-top: 4em;' +
                '}' +
                '.portada .ano {' +
                    'position: absolute;' +
                    'bottom: 8%;' +
                    'left: 0;' +
                    'right: 0;' +
                    'text-align: center;' +
                    'font-family: "JetBrains Mono", monospace;' +
                    'font-size: 8pt;' +
                    'color: #9A8B78;' +
                    'letter-spacing: 0.2em;' +
                '}' +
                '.creditos, .colofon {' +
                    'display: flex;' +
                    'flex-direction: column;' +
                    'justify-content: center;' +
                    'align-items: center;' +
                    'text-align: center;' +
                    'font-size: 10pt;' +
                    'line-height: 1.8;' +
                    'color: #38302A;' +
                '}' +
                '.creditos .cr-titulo {' +
                    'font-family: "Instrument Serif", serif;' +
                    'font-style: italic;' +
                    'font-size: 18pt;' +
                    'color: #0B0907;' +
                    'margin-bottom: 1.5em;' +
                '}' +
                '.creditos .asterisco, .colofon .asterisco {' +
                    'color: #8B2E2E;' +
                    'font-size: 14pt;' +
                    'margin: 1.5em 0;' +
                    'display: block;' +
                '}';

            // Construir el cuerpo
            var cuerpo = '';

            // Portada
            if (this.config.portada) {
                var titulo = this.config.tituloOverride || o.titulo || "Sin titulo";
                cuerpo += '<section class="pagina portada">';
                cuerpo += '<div class="kicker">' + escapar(this.generoLegible(o.tipo)) + '</div>';
                cuerpo += '<h1>' + escapar(titulo) + '</h1>';
                if (this.config.subtitulo) cuerpo += '<div class="subtitulo">' + escapar(this.config.subtitulo) + '</div>';
                cuerpo += '<div class="autor">' + escapar(this.config.autor || "Anonimo") + '</div>';
                cuerpo += '<div class="ano">' + new Date().getFullYear() + ' · LITTERA</div>';
                cuerpo += '</section>';
            }

            // Creditos
            if (this.config.creditos) {
                var titulo2 = this.config.tituloOverride || o.titulo || "Sin titulo";
                cuerpo += '<section class="pagina creditos">';
                cuerpo += '<div class="cr-titulo">' + escapar(titulo2) + '</div>';
                cuerpo += '<p>' + escapar(this.config.autor || "Anonimo") + '</p>';
                cuerpo += '<p>' + escapar(this.config.editorial || "Edicion del autor") + '</p>';
                cuerpo += '<span class="asterisco">*</span>';
                cuerpo += '<p style="font-size:0.9em;color:#7A736A;">Primera edicion · ' + new Date().getFullYear() + '</p>';
                if (this.config.dedicatoria) cuerpo += '<p style="margin-top:2em;font-style:italic;">' + escapar(this.config.dedicatoria) + '</p>';
                cuerpo += '</section>';
            }

            // Contenido paginado
            var parrafos = this.extraerParrafos(o);
            var paginas = this.paginarParrafos(parrafos);
            var numPagina = 1;
            var self = this;
            paginas.forEach(function (pag) {
                cuerpo += '<section class="pagina contenido">';
                if (self.config.encabezados && numPagina > 1) {
                    cuerpo += '<div class="encabezado">' + escapar(self.config.tituloOverride || o.titulo || "") + '</div>';
                }
                pag.forEach(function (p) {
                    if (p.tipo === "titulo") {
                        cuerpo += '<div class="cap-titulo">' +
                            (p.num ? '<span class="cap-num">' + escapar(p.num) + '</span>' : '') +
                            escapar(p.texto) +
                        '</div>';
                    } else {
                        cuerpo += '<p' + (p.sinSangria ? ' class="sin-sangria"' : '') + '>' + escapar(p.texto) + '</p>';
                    }
                });
                if (self.config.numeracion) {
                    cuerpo += '<div class="num-pagina">' + numPagina + '</div>';
                }
                cuerpo += '</section>';
                numPagina++;
            });

            // Colofon
            if (this.config.colofon) {
                cuerpo += '<section class="pagina colofon">';
                cuerpo += '<p style="font-style:italic;color:#7A736A;margin-bottom:2em;">Colofon</p>';
                cuerpo += '<p>Esta obra se termino de componer</p>';
                cuerpo += '<p>en Littera, el ano ' + new Date().getFullYear() + ',</p>';
                cuerpo += '<p>en tipografia ' + escapar(tipografia.cuerpo) + ',</p>';
                cuerpo += '<p>sobre papel ' + escapar(p.nombre) + '.</p>';
                cuerpo += '<span class="asterisco">*</span>';
                cuerpo += '<p style="color:#7A736A;font-size:0.9em;">' + escapar(this.config.autor || "Anonimo") + '</p>';
                cuerpo += '</section>';
            }

            var html = '<!DOCTYPE html><html lang="es"><head>' +
                '<meta charset="UTF-8">' +
                '<title>' + escapar(this.config.tituloOverride || o.titulo || "Sin titulo") + '</title>' +
                '<link rel="preconnect" href="https://fonts.googleapis.com">' +
                '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
                '<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&family=Literata:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">' +
                '<style>' + pageCSS + '</style>' +
                '</head><body>' + cuerpo + '</body></html>';

            return html;
        },

        paginarParrafos: function (parrafos) {
            // Estima cuantos parrafos caben por pagina segun el papel
            var p = PAPELES[this.config.papel] || PAPELES["a5"];
            var areaCM2 = (p.ancho / 10) * (p.alto / 10);
            // Cuantos "bloques" caben (heuristica)
            var porPagina = Math.max(6, Math.round(areaCM2 * 0.5));

            var paginas = [];
            var actual = [];
            var cuenta = 0;
            var primero = true;

            parrafos.forEach(function (par) {
                var peso = par.tipo === "titulo" ? 2 : Math.max(1, Math.ceil((par.texto || "").length / 400));
                if (cuenta + peso > porPagina && actual.length > 0) {
                    paginas.push(actual);
                    actual = [];
                    cuenta = 0;
                    primero = false;
                }
                if (par.tipo === "texto" && primero) {
                    actual.push({ tipo: "texto", texto: par.texto, sinSangria: true });
                    primero = false;
                } else {
                    actual.push(par);
                }
                cuenta += peso;
            });
            if (actual.length > 0) paginas.push(actual);
            if (paginas.length === 0) paginas.push([{ tipo: "texto", texto: "(vacio)", sinSangria: true }]);
            return paginas;
        },

        imprimirHTML: function (html) {
            // Crear iframe oculto
            var iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            iframe.style.opacity = "0";
            iframe.setAttribute("aria-hidden", "true");
            document.body.appendChild(iframe);

            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();

            // Esperar a que carguen las fuentes
            setTimeout(function () {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (e) {
                    toast("El navegador bloqueo la impresion. Permite ventanas emergentes.", "aviso");
                }
                // Limpiar despues de un rato
                setTimeout(function () {
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                }, 60000);
            }, 900);
        },

        // ---------- Binds ----------
        bind: function () {
            var self = this;
            var sel = document.getElementById("imp-obra");
            if (sel) sel.addEventListener("change", function () {
                var id = sel.value;
                var obra = self.obras.find(function (o) { return o.id === id; });
                self.obraActual = obra || null;
                if (obra) {
                    if (!self.config.tituloOverride) {
                        // Nada, se toma de obra
                    }
                }
                self.renderPreview();
            });

            // Cambios de configuracion
            function onConfig(id, campo, transform) {
                var el = document.getElementById(id);
                if (!el) return;
                var handler = function () {
                    var v = el.type === "checkbox" ? el.checked : el.value;
                    if (transform) v = transform(v);
                    self.config[campo] = v;
                    self.guardarConfig();
                    self.renderPreview();
                };
                el.addEventListener("input", handler);
                el.addEventListener("change", handler);
            }

            onConfig("imp-papel", "papel");
            onConfig("imp-tipografia", "tipografia");
            onConfig("imp-tamano", "tamano", function (v) { return parseInt(v, 10) || 11; });
            onConfig("imp-margenes", "margenes");
            onConfig("imp-portada", "portada");
            onConfig("imp-creditos", "creditos");
            onConfig("imp-colofon", "colofon");
            onConfig("imp-numeracion", "numeracion");
            onConfig("imp-encabezados", "encabezados");
            onConfig("imp-autor", "autor");
            onConfig("imp-titulo-override", "tituloOverride");
            onConfig("imp-subtitulo", "subtitulo");
            onConfig("imp-dedicatoria", "dedicatoria");
            onConfig("imp-editorial", "editorial");

            // Boton exportar
            var exp = document.getElementById("imp-exportar");
            if (exp) exp.addEventListener("click", function () { self.exportarPDF(); });

            // Boton recargar obras
            var rec = document.getElementById("imp-recargar");
            if (rec) rec.addEventListener("click", function () {
                self.cargarObras();
                toast("Obras actualizadas");
            });

            // Sincronizar valores iniciales de la UI
            this.sincronizarUI();
        },

        sincronizarUI: function () {
            var c = this.config;
            function set(id, v) {
                var el = document.getElementById(id);
                if (!el) return;
                if (el.type === "checkbox") el.checked = !!v;
                else el.value = v == null ? "" : v;
            }
            set("imp-papel", c.papel);
            set("imp-tipografia", c.tipografia);
            set("imp-tamano", c.tamano);
            set("imp-margenes", c.margenes);
            set("imp-portada", c.portada);
            set("imp-creditos", c.creditos);
            set("imp-colofon", c.colofon);
            set("imp-numeracion", c.numeracion);
            set("imp-encabezados", c.encabezados);
            set("imp-autor", c.autor);
            set("imp-titulo-override", c.tituloOverride);
            set("imp-subtitulo", c.subtitulo);
            set("imp-dedicatoria", c.dedicatoria);
            set("imp-editorial", c.editorial);
        }
    };

    window.LitteraImprenta = Imp;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("imp-obra")) {
            Imp.init();
        }
    });
})();
