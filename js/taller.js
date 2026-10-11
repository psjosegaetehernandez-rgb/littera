// ============================================
// LITTERA v4.1 - Taller extendido
// 11 modos: prosa, cuento, novela, historia,
// verso, visual, diario, cronica, aforismos,
// fanzine, revista
// ============================================
(function () {
    "use strict";

    var CLAVE_OBRAS = "littera.obras";
    var CLAVE_MODO = "littera.taller.modo";
    var CLAVE_OBRA_ACTUAL = "littera.taller.obra";

    var SVG = {
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };

    var Taller = {
        modo: "prosa",
        obraId: null,
        obra: null,
        capActual: null,
        entradaActual: null,
        seccionActual: null,
        timer: null,
        limpiando: false,

        // ---------- Storage ----------
        leer: function (k, d) {
            try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; }
            catch (e) { return d; }
        },
        escribir: function (k, v) {
            try { localStorage.setItem(k, JSON.stringify(v)); return true; }
            catch (e) { return false; }
        },
        uid: function () {
            return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        },

        // ---------- Init ----------
        init: function () {
            if (!document.getElementById("modo-tabs")) return;
            this.bindModoTabs();
            this.bindAccionesGlobales();
            this.bindCadaModo();

            var ultimoModo = this.leer(CLAVE_MODO, "prosa");
            this.setModo(ultimoModo);

            var ultimaObra = this.leer(CLAVE_OBRA_ACTUAL, null);
            if (ultimaObra && this.cargar(ultimaObra)) return;
            this.nuevaObra(ultimoModo);
        },

        // ---------- Modo ----------
        bindModoTabs: function () {
            var self = this;
            document.querySelectorAll("#modo-tabs .modo-btn").forEach(function (b) {
                b.addEventListener("click", function () {
                    if (b.dataset.modo === self.modo) return;
                    self.guardar(true);
                    var tipoObra = self.obra ? self.obra.tipo : null;
                    self.setModo(b.dataset.modo);
                    if (!self.obra || tipoObra !== b.dataset.modo) {
                        if (self.obra && self.tieneContenido(self.obra)) {
                            if (!confirm("La obra actual es de otro tipo. ¿Crear una nueva obra en este modo? La actual queda guardada.")) {
                                self.setModo(tipoObra || "prosa");
                                return;
                            }
                        }
                        self.nuevaObra(b.dataset.modo);
                    }
                });
            });
        },

        tieneContenido: function (o) {
            if (!o) return false;
            if (o.texto && o.texto.trim()) return true;
            if (o.titulo && o.titulo.trim()) return true;
            if (o.capitulos && o.capitulos.some(function (c) { return (c.texto || "").trim(); })) return true;
            if (o.entradas && o.entradas.some(function (e) { return (e.texto || "").trim(); })) return true;
            if (o.secciones && o.secciones.some(function (s) { return (s.texto || "").trim(); })) return true;
            if (o.paginas && o.paginas.some(function (p) { return (p.texto || "").trim(); })) return true;
            if (o.aforismos && o.aforismos.some(function (a) { return (a.texto || "").trim(); })) return true;
            return false;
        },

        setModo: function (modo) {
            this.modo = modo;
            document.querySelectorAll("#modo-tabs .modo-btn").forEach(function (b) {
                b.classList.toggle("activo", b.dataset.modo === modo);
            });
            document.querySelectorAll(".taller-panel").forEach(function (p) {
                p.classList.toggle("activo", p.dataset.panel === modo);
            });
            this.escribir(CLAVE_MODO, modo);
            this.actualizarContador();
        },

        // ---------- Obra: plantilla ----------
        plantillaObra: function (modo) {
            var base = { id: this.uid(), tipo: modo, fecha: new Date().toISOString(), titulo: "" };
            if (modo === "prosa" || modo === "verso") {
                base.texto = "";
            } else if (modo === "visual") {
                base.texto = "";
                base.meta = { tamano: 18, letra: 0, fuente: "'EB Garamond', serif" };
            } else if (modo === "cuento") {
                base.texto = "";
                base.estructura = { situacion: "", conflicto: "", desarrollo: "", climax: "", desenlace: "" };
            } else if (modo === "novela") {
                var capId = this.uid();
                base.capitulos = [{ id: capId, titulo: "Capitulo 1", texto: "" }];
                base.capActual = capId;
            } else if (modo === "historia") {
                base.texto = "";
                base.tipoContenido = "html";
            } else if (modo === "diario") {
                var entId = this.uid();
                base.entradas = [{ id: entId, fecha: new Date().toISOString().slice(0, 10), animo: "", clima: "", lugar: "", titulo: "", texto: "" }];
                base.entradaActual = entId;
            } else if (modo === "cronica") {
                base.subtitulo = "";
                base.texto = "";
                base.notas = "";
                base.fuentes = "";
            } else if (modo === "revista") {
                var secId = this.uid();
                base.secciones = [{ id: secId, tipo: "editorial", titulo: "Editorial", autor: "", texto: "" }];
                base.seccionActual = secId;
                base.subtitulo = "";
            } else if (modo === "fanzine") {
                base.paginas = [];
                base.paginasTotal = 8;
                for (var i = 0; i < 8; i++) base.paginas.push({ id: this.uid(), orden: i, texto: "" });
            } else if (modo === "aforismos") {
                base.aforismos = [{ id: this.uid(), texto: "" }];
            }
            return base;
        },

        nuevaObra: function (modo) {
            modo = modo || this.modo;
            this.obra = this.plantillaObra(modo);
            this.obraId = this.obra.id;
            this.capActual = this.obra.capActual || null;
            this.entradaActual = this.obra.entradaActual || null;
            this.seccionActual = this.obra.seccionActual || null;
            this.limpiando = true;
            this.renderTodo();
            this.limpiando = false;
            this.estadoUI("guardado");
            this.escribir(CLAVE_OBRA_ACTUAL, this.obraId);
            this.guardar(true);
        },

        // ---------- Obra: cargar ----------
        cargar: function (id) {
            var obras = this.leer(CLAVE_OBRAS, []);
            var o = obras.find(function (x) { return x.id === id; });
            if (!o) return false;

            // Migración de versiones previas
            if (o.tipo === "poesia") {
                var sub = (o.meta && o.meta.submodo) || "verso";
                o.tipo = sub === "visual" ? "visual" : "verso";
            }
            if (!o.tipo) o.tipo = "prosa";

            this.obra = o;
            this.obraId = o.id;
            this.setModo(o.tipo);

            if (o.tipo === "novela" && o.capitulos) {
                var cap = o.capitulos.find(function (c) { return c.id === o.capActual; });
                this.capActual = cap ? cap.id : (o.capitulos[0] ? o.capitulos[0].id : null);
            }
            if (o.tipo === "diario" && o.entradas) {
                var ent = o.entradas.find(function (e) { return e.id === o.entradaActual; });
                this.entradaActual = ent ? ent.id : (o.entradas[0] ? o.entradas[0].id : null);
            }
            if (o.tipo === "revista" && o.secciones) {
                var sec = o.secciones.find(function (s) { return s.id === o.seccionActual; });
                this.seccionActual = sec ? sec.id : (o.secciones[0] ? o.secciones[0].id : null);
            }

            this.limpiando = true;
            this.renderTodo();
            this.limpiando = false;
            this.estadoUI("guardado");
            this.escribir(CLAVE_OBRA_ACTUAL, this.obraId);
            return true;
        },

        // ---------- Guardar ----------
        actualizarDesdeUI: function () {
            if (!this.obra) return;
            var m = this.modo;
            var o = this.obra;
            var self = this;

            function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }

            if (m === "prosa") {
                o.titulo = val("prosa-titulo");
                o.texto = val("prosa-lienzo");
            } else if (m === "cuento") {
                o.titulo = val("cuento-titulo");
                o.texto = val("cuento-lienzo");
                o.estructura = {
                    situacion: val("cuento-situacion"),
                    conflicto: val("cuento-conflicto"),
                    desarrollo: val("cuento-desarrollo"),
                    climax: val("cuento-climax"),
                    desenlace: val("cuento-desenlace")
                };
            } else if (m === "novela") {
                o.titulo = val("novela-titulo");
                o.capActual = self.capActual;
                if (o.capitulos) {
                    var cap = o.capitulos.find(function (c) { return c.id === self.capActual; });
                    if (cap) {
                        cap.titulo = val("novela-cap-titulo");
                        cap.texto = val("novela-cap-texto");
                    }
                }
            } else if (m === "historia") {
                o.titulo = val("historia-titulo");
                var ed = document.getElementById("historia-editor");
                o.texto = ed ? ed.innerHTML : "";
            } else if (m === "verso") {
                o.titulo = val("verso-titulo");
                o.texto = val("verso-lienzo");
            } else if (m === "visual") {
                o.titulo = val("visual-titulo");
                o.texto = val("visual-lienzo");
                o.meta = { tamano: val("vis-tamano"), letra: val("vis-letra"), fuente: val("vis-fuente") };
            } else if (m === "diario") {
                o.titulo = val("diario-titulo");
                o.entradaActual = self.entradaActual;
                if (o.entradas) {
                    var ent = o.entradas.find(function (e) { return e.id === self.entradaActual; });
                    if (ent) {
                        ent.fecha = val("diario-fecha");
                        ent.animo = val("diario-animo");
                        ent.clima = val("diario-clima");
                        ent.lugar = val("diario-lugar");
                        ent.titulo = val("diario-entrada-titulo");
                        ent.texto = val("diario-entrada-texto");
                    }
                }
            } else if (m === "cronica") {
                o.titulo = val("cronica-titulo");
                o.subtitulo = val("cronica-subtitulo");
                o.texto = val("cronica-lienzo");
                o.notas = val("cronica-notas");
                o.fuentes = val("cronica-fuentes");
            } else if (m === "revista") {
                o.titulo = val("revista-titulo");
                o.subtitulo = val("revista-subtitulo");
                o.seccionActual = self.seccionActual;
                if (o.secciones) {
                    var sec = o.secciones.find(function (s) { return s.id === self.seccionActual; });
                    if (sec) {
                        sec.tipo = val("revista-seccion-tipo");
                        sec.titulo = val("revista-seccion-titulo");
                        sec.autor = val("revista-seccion-autor");
                        sec.texto = val("revista-seccion-texto");
                    }
                }
            } else if (m === "fanzine") {
                o.titulo = val("fanzine-titulo");
                var sel = document.getElementById("fanzine-paginas");
                o.paginasTotal = sel ? parseInt(sel.value, 10) : 8;
                document.querySelectorAll(".fanzine-pagina .fz-texto").forEach(function (ta, i) {
                    if (o.paginas[i]) o.paginas[i].texto = ta.value;
                });
            } else if (m === "aforismos") {
                o.titulo = val("aforismos-titulo");
                var items = document.querySelectorAll(".aforismo-item");
                o.aforismos = [];
                items.forEach(function (it) {
                    var ta = it.querySelector(".aforismo-texto");
                    o.aforismos.push({ id: it.dataset.id, texto: ta ? ta.value : "" });
                });
            }
        },

        guardar: function (silencioso) {
            if (!this.obra || this.limpiando) return;
            this.actualizarDesdeUI();
            var obras = this.leer(CLAVE_OBRAS, []);
            var idx = obras.findIndex(function (x) { return x.id === Taller.obraId; });
            var copia = JSON.parse(JSON.stringify(this.obra));
            copia.fecha = new Date().toISOString();
            if (idx >= 0) obras[idx] = copia;
            else obras.push(copia);
            if (!this.escribir(CLAVE_OBRAS, obras)) {
                this.toast("Almacenamiento lleno. Exporta tu archivo.", "aviso");
                return;
            }
            this.obra = copia;
            this.estadoUI("guardado");
            if (!silencioso) this.toast("Guardado");
        },

        programarGuardado: function () {
            if (this.limpiando) return;
            clearTimeout(this.timer);
            this.estadoUI("guardando");
            var self = this;
            this.timer = setTimeout(function () { self.guardar(true); }, 1500);
        },

        // ---------- Render ----------
        renderTodo: function () {
            var m = this.modo;
            var o = this.obra;
            if (!o) return;
            var fn = {
                prosa: "renderProsa",
                cuento: "renderCuento",
                novela: "renderNovela",
                historia: "renderHistoria",
                verso: "renderVerso",
                visual: "renderVisual",
                diario: "renderDiario",
                cronica: "renderCronica",
                revista: "renderRevista",
                fanzine: "renderFanzine",
                aforismos: "renderAforismos"
            }[m];
            if (fn && this[fn]) this[fn](o);
            this.actualizarContador();
        },

        renderProsa: function (o) {
            this.set("prosa-titulo", o.titulo);
            this.set("prosa-lienzo", o.texto);
        },
        renderCuento: function (o) {
            this.set("cuento-titulo", o.titulo);
            this.set("cuento-lienzo", o.texto);
            var e = o.estructura || {};
            this.set("cuento-situacion", e.situacion);
            this.set("cuento-conflicto", e.conflicto);
            this.set("cuento-desarrollo", e.desarrollo);
            this.set("cuento-climax", e.climax);
            this.set("cuento-desenlace", e.desenlace);
        },
        renderNovela: function (o) {
            this.set("novela-titulo", o.titulo);
            this.renderCapitulos(o);
            this.renderCapituloActual(o);
            this.actualizarTotalPalabrasNovela();
        },
        renderCapitulos: function (o) {
            var lista = document.getElementById("capitulos-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            (o.capitulos || []).forEach(function (c, i) {
                var li = document.createElement("li");
                li.className = "capitulo-item" + (c.id === self.capActual ? " activo" : "");
                li.dataset.id = c.id;
                li.innerHTML =
                    '<span class="cap-num">' + (i + 1) + '</span>' +
                    '<span class="cap-titulo">' + self.escapar(c.titulo || "Sin titulo") + '</span>' +
                    '<span class="cap-acciones"><button class="btn-cap-borrar" title="Borrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:11px;height:11px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></span>';
                li.addEventListener("click", function (ev) {
                    if (ev.target.closest(".btn-cap-borrar")) return;
                    self.guardar(true);
                    self.capActual = c.id;
                    self.renderCapitulos(o);
                    self.renderCapituloActual(o);
                });
                li.querySelector(".btn-cap-borrar").addEventListener("click", function (ev) {
                    ev.stopPropagation();
                    if ((o.capitulos || []).length <= 1) { self.toast("Debe quedar al menos un capitulo", "aviso"); return; }
                    if (!confirm('Borrar el capitulo "' + (c.titulo || "Sin titulo") + '"?')) return;
                    o.capitulos = o.capitulos.filter(function (x) { return x.id !== c.id; });
                    if (self.capActual === c.id) self.capActual = o.capitulos[0].id;
                    self.renderCapitulos(o);
                    self.renderCapituloActual(o);
                    self.programarGuardado();
                });
                lista.appendChild(li);
            });
        },
        renderCapituloActual: function (o) {
            if (!o.capitulos) return;
            var self = this;
            var cap = o.capitulos.find(function (c) { return c.id === self.capActual; }) || o.capitulos[0];
            if (!cap) return;
            this.capActual = cap.id;
            this.set("novela-cap-titulo", cap.titulo);
            this.set("novela-cap-texto", cap.texto);
        },
        actualizarTotalPalabrasNovela: function () {
            if (!this.obra || !this.obra.capitulos) return;
            var total = this.obra.capitulos.reduce(function (acc, c) {
                return acc + Taller.contarPalabras(c.texto || "");
            }, 0);
            var el = document.getElementById("novela-total-palabras");
            if (el) el.textContent = total.toLocaleString("es");
        },
        renderHistoria: function (o) {
            this.set("historia-titulo", o.titulo);
            var ed = document.getElementById("historia-editor");
            if (ed) ed.innerHTML = o.texto || "";
        },
        renderVerso: function (o) {
            this.set("verso-titulo", o.titulo);
            this.set("verso-lienzo", o.texto);
        },
        renderVisual: function (o) {
            this.set("visual-titulo", o.titulo);
            this.set("visual-lienzo", o.texto);
            var m = o.meta || {};
            this.set("vis-tamano", m.tamano || 18);
            this.set("vis-letra", m.letra || 0);
            this.set("vis-fuente", m.fuente || "'EB Garamond', serif");
            this.aplicarVisual();
        },
        renderDiario: function (o) {
            this.set("diario-titulo", o.titulo);
            this.renderEntradas(o);
            this.renderEntradaActual(o);
        },
        renderEntradas: function (o) {
            var lista = document.getElementById("entradas-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            var ordenadas = (o.entradas || []).slice().sort(function (a, b) {
                return (b.fecha || "").localeCompare(a.fecha || "");
            });
            ordenadas.forEach(function (e) {
                var li = document.createElement("li");
                li.className = "entrada-item" + (e.id === self.entradaActual ? " activo" : "");
                li.dataset.id = e.id;
                var fecha = e.fecha ? self.formatearFecha(e.fecha) : "Sin fecha";
                var preview = (e.titulo || e.texto || "").slice(0, 60).replace(/\n/g, " ");
                li.innerHTML =
                    '<span class="entrada-fecha">' + fecha + (e.animo ? " · " + e.animo : "") + '</span>' +
                    '<span class="entrada-preview">' + self.escapar(preview || "Sin contenido") + '</span>';
                li.addEventListener("click", function () {
                    self.guardar(true);
                    self.entradaActual = e.id;
                    self.renderEntradas(o);
                    self.renderEntradaActual(o);
                });
                lista.appendChild(li);
            });
        },
        renderEntradaActual: function (o) {
            if (!o.entradas) return;
            var self = this;
            var ent = o.entradas.find(function (e) { return e.id === self.entradaActual; }) || o.entradas[0];
            if (!ent) return;
            this.entradaActual = ent.id;
            this.set("diario-fecha", ent.fecha);
            this.set("diario-animo", ent.animo);
            this.set("diario-clima", ent.clima);
            this.set("diario-lugar", ent.lugar);
            this.set("diario-entrada-titulo", ent.titulo);
            this.set("diario-entrada-texto", ent.texto);
        },
        renderCronica: function (o) {
            this.set("cronica-titulo", o.titulo);
            this.set("cronica-subtitulo", o.subtitulo);
            this.set("cronica-lienzo", o.texto);
            this.set("cronica-notas", o.notas);
            this.set("cronica-fuentes", o.fuentes);
        },
        renderRevista: function (o) {
            this.set("revista-titulo", o.titulo);
            this.set("revista-subtitulo", o.subtitulo);
            this.renderSecciones(o);
            this.renderSeccionActual(o);
        },
        renderSecciones: function (o) {
            var lista = document.getElementById("secciones-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            (o.secciones || []).forEach(function (s) {
                var li = document.createElement("li");
                li.className = "seccion-item" + (s.id === self.seccionActual ? " activo" : "");
                li.dataset.id = s.id;
                li.innerHTML =
                    '<span class="seccion-tipo">' + self.escapar(s.tipo || "seccion") + '</span>' +
                    '<span class="seccion-titulo">' + self.escapar(s.titulo || "Sin titulo") + '</span>';
                li.addEventListener("click", function () {
                    self.guardar(true);
                    self.seccionActual = s.id;
                    self.renderSecciones(o);
                    self.renderSeccionActual(o);
                });
                lista.appendChild(li);
            });
        },
        renderSeccionActual: function (o) {
            if (!o.secciones) return;
            var self = this;
            var sec = o.secciones.find(function (s) { return s.id === self.seccionActual; }) || o.secciones[0];
            if (!sec) return;
            this.seccionActual = sec.id;
            this.set("revista-seccion-tipo", sec.tipo);
            this.set("revista-seccion-titulo", sec.titulo);
            this.set("revista-seccion-autor", sec.autor);
            this.set("revista-seccion-texto", sec.texto);
        },
        renderFanzine: function (o) {
            this.set("fanzine-titulo", o.titulo);
            this.set("fanzine-paginas", o.paginasTotal || 8);
            this.renderFanzineGrid(o);
            this.actualizarInfoFanzine();
        },
        renderFanzineGrid: function (o) {
            var grid = document.getElementById("fanzine-grid");
            if (!grid) return;
            grid.innerHTML = "";
            var self = this;
            var total = o.paginasTotal || 8;
            while (o.paginas.length < total) o.paginas.push({ id: self.uid(), orden: o.paginas.length, texto: "" });
            o.paginas.length = total;
            o.paginas.forEach(function (p, i) {
                var div = document.createElement("div");
                div.className = "fanzine-pagina" + (i === 0 ? " portada" : "");
                div.innerHTML =
                    '<span class="fz-num">' + (i + 1) + '</span>' +
                    '<textarea class="fz-texto" placeholder="' + (i === 0 ? "Portada..." : "Pagina " + (i + 1)) + '">' + self.escapar(p.texto || "") + '</textarea>';
                div.querySelector(".fz-texto").addEventListener("input", function () {
                    self.actualizarContador();
                    self.programarGuardado();
                });
                grid.appendChild(div);
            });
        },
        actualizarInfoFanzine: function () {
            var sel = document.getElementById("fanzine-paginas");
            if (!sel) return;
            var total = parseInt(sel.value, 10);
            var hojas = Math.ceil(total / 4);
            var info = document.getElementById("fanzine-info");
            if (info) info.textContent = "A5 doblado desde A4 · " + hojas + " " + (hojas === 1 ? "hoja" : "hojas");
        },
        renderAforismos: function (o) {
            this.set("aforismos-titulo", o.titulo);
            var lista = document.getElementById("aforismos-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            (o.aforismos || []).forEach(function (a, i) {
                var div = document.createElement("div");
                div.className = "aforismo-item";
                div.dataset.id = a.id;
                div.innerHTML =
                    '<span class="aforismo-num">' + (i + 1) + '</span>' +
                    '<textarea class="aforismo-texto" placeholder="Un pensamiento breve...">' + self.escapar(a.texto || "") + '</textarea>' +
                    '<button class="aforismo-borrar" title="Borrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:12px;height:12px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
                div.querySelector(".aforismo-texto").addEventListener("input", function () {
                    self.actualizarContador();
                    self.programarGuardado();
                });
                div.querySelector(".aforismo-borrar").addEventListener("click", function () {
                    if ((o.aforismos || []).length <= 1) { self.toast("Debe quedar al menos uno", "aviso"); return; }
                    o.aforismos = o.aforismos.filter(function (x) { return x.id !== a.id; });
                    self.renderAforismos(o);
                    self.programarGuardado();
                });
                lista.appendChild(div);
            });
        },

        // ---------- Helpers UI ----------
        set: function (id, valor) {
            var el = document.getElementById(id);
            if (!el) return;
            if (el.type === "checkbox") el.checked = !!valor;
            else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.tagName === "SELECT") el.value = valor == null ? "" : valor;
            else el.textContent = valor == null ? "" : valor;
        },
        contarPalabras: function (t) {
            t = (t || "").trim();
            return t ? t.split(/\s+/).length : 0;
        },
        escapar: function (s) {
            return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        },
        formatearFecha: function (iso) {
            var d = new Date(iso);
            if (isNaN(d.getTime())) return iso;
            var meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
            return d.getDate() + " " + meses[d.getMonth()] + " " + d.getFullYear();
        },
        toast: function (msg, tipo) {
            var cont = document.getElementById("toasts");
            if (!cont) return;
            var t = document.createElement("div");
            t.className = "toast " + (tipo || "exito");
            var icono = tipo === "aviso" ? SVG.alerta : SVG.check;
            t.innerHTML = icono + "<span>" + this.escapar(msg) + "</span>";
            cont.appendChild(t);
            setTimeout(function () {
                t.classList.add("saliendo");
                setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
            }, 2000);
        },
        estadoUI: function (estado) {
            var punto = document.getElementById("estado-punto");
            var texto = document.getElementById("estado-guardado");
            if (!punto || !texto) return;
            punto.classList.remove("guardando", "guardado");
            if (estado === "guardando") {
                punto.classList.add("guardando");
                texto.textContent = "Guardando...";
            } else if (estado === "guardado") {
                punto.classList.add("guardado");
                var d = new Date();
                texto.textContent = "Guardado " + d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
            }
        },
        actualizarContador: function () {
            if (!this.obra) return;
            var texto = this.textoActual();
            var p = this.contarPalabras(texto);
            var el = document.getElementById("contador-palabras");
            if (el) el.textContent = p + " palabras - " + texto.length + " caracteres";
        },
        textoActual: function () {
            if (!this.obra) return "";
            var o = this.obra, m = this.modo, self = this;
            if (m === "novela") {
                var cap = (o.capitulos || []).find(function (c) { return c.id === self.capActual; });
                return cap ? (cap.texto || "") : "";
            }
            if (m === "diario") {
                var ent = (o.entradas || []).find(function (e) { return e.id === self.entradaActual; });
                return ent ? (ent.texto || "") : "";
            }
            if (m === "revista") {
                var sec = (o.secciones || []).find(function (s) { return s.id === self.seccionActual; });
                return sec ? (sec.texto || "") : "";
            }
            if (m === "fanzine") return (o.paginas || []).map(function (p) { return p.texto || ""; }).join(" ");
            if (m === "aforismos") return (o.aforismos || []).map(function (a) { return a.texto || ""; }).join(" ");
            if (m === "historia") {
                var ed = document.getElementById("historia-editor");
                return ed ? (ed.innerText || "") : "";
            }
            return o.texto || "";
        },
        aplicarVisual: function () {
            var lienzo = document.getElementById("visual-lienzo");
            if (!lienzo) return;
            var t = document.getElementById("vis-tamano");
            var l = document.getElementById("vis-letra");
            var f = document.getElementById("vis-fuente");
            if (!t || !l || !f) return;
            lienzo.style.fontSize = t.value + "px";
            lienzo.style.letterSpacing = l.value + "px";
            lienzo.style.fontFamily = f.value;
            var tv = document.getElementById("vis-tamano-val");
            var lv = document.getElementById("vis-letra-val");
            if (tv) tv.textContent = t.value;
            if (lv) lv.textContent = l.value;
        },

        // ---------- Binds ----------
        bindAccionesGlobales: function () {
            var self = this;
            var g = document.getElementById("guardar-obra");
            if (g) g.addEventListener("click", function () { self.guardar(false); });
            var n = document.getElementById("btn-nueva-obra");
            if (n) n.addEventListener("click", function () {
                if (self.obra && self.tieneContenido(self.obra)) {
                    if (!confirm("Crear una nueva obra? La actual queda guardada.")) return;
                }
                self.nuevaObra();
                self.toast("Nueva obra iniciada");
            });
            var fab = document.getElementById("fab-guardar");
            if (fab) fab.addEventListener("click", function () { self.guardar(false); });
        },

        bindCadaModo: function () {
            var self = this;

            // Prosa
            ["prosa-titulo", "prosa-lienzo"].forEach(function (id) { self.bindInput(id); });

            // Cuento
            ["cuento-titulo", "cuento-lienzo", "cuento-situacion", "cuento-conflicto", "cuento-desarrollo", "cuento-climax", "cuento-desenlace"].forEach(function (id) { self.bindInput(id); });

            // Novela
            ["novela-titulo", "novela-cap-titulo", "novela-cap-texto"].forEach(function (id) { self.bindInput(id); });
            var ncap = document.getElementById("novela-nuevo-cap");
            if (ncap) ncap.addEventListener("click", function () {
                var o = self.obra;
                if (!o.capitulos) o.capitulos = [];
                var cap = { id: self.uid(), titulo: "Capitulo " + (o.capitulos.length + 1), texto: "" };
                o.capitulos.push(cap);
                self.capActual = cap.id;
                self.renderCapitulos(o);
                self.renderCapituloActual(o);
                self.programarGuardado();
            });

            // Historia
            self.bindInput("historia-titulo");
            var editorHist = document.getElementById("historia-editor");
            if (editorHist) {
                editorHist.addEventListener("input", function () { self.actualizarContador(); self.programarGuardado(); });
                editorHist.addEventListener("paste", function (e) {
                    var items = (e.clipboardData || {}).items || [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf("image") !== -1) {
                            e.preventDefault();
                            self.insertarImagen(items[i].getAsFile());
                            return;
                        }
                    }
                });
                editorHist.addEventListener("dragover", function (e) { e.preventDefault(); });
                editorHist.addEventListener("drop", function (e) {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) self.insertarImagen(e.dataTransfer.files[0]);
                });
            }
            var inputImg = document.getElementById("input-imagen");
            if (inputImg) inputImg.addEventListener("change", function (e) {
                if (e.target.files[0]) self.insertarImagen(e.target.files[0]);
                inputImg.value = "";
            });

            // Verso
            ["verso-titulo", "verso-lienzo"].forEach(function (id) { self.bindInput(id); });

            // Visual
            ["visual-titulo", "visual-lienzo"].forEach(function (id) { self.bindInput(id); });
            ["vis-tamano", "vis-letra", "vis-fuente"].forEach(function (id) {
                var el = document.getElementById(id);
                if (!el) return;
                el.addEventListener("input", function () { self.aplicarVisual(); self.programarGuardado(); });
                el.addEventListener("change", function () { self.aplicarVisual(); self.programarGuardado(); });
            });

            // Diario
            ["diario-titulo", "diario-fecha", "diario-animo", "diario-clima", "diario-lugar", "diario-entrada-titulo", "diario-entrada-texto"].forEach(function (id) { self.bindInput(id); });
            var nent = document.getElementById("diario-nueva-entrada");
            if (nent) nent.addEventListener("click", function () {
                var o = self.obra;
                if (!o.entradas) o.entradas = [];
                var ent = { id: self.uid(), fecha: new Date().toISOString().slice(0, 10), animo: "", clima: "", lugar: "", titulo: "", texto: "" };
                o.entradas.push(ent);
                self.entradaActual = ent.id;
                self.renderEntradas(o);
                self.renderEntradaActual(o);
                self.programarGuardado();
            });

            // Cronica
            ["cronica-titulo", "cronica-subtitulo", "cronica-lienzo", "cronica-notas", "cronica-fuentes"].forEach(function (id) { self.bindInput(id); });

            // Revista
            ["revista-titulo", "revista-subtitulo", "revista-seccion-tipo", "revista-seccion-titulo", "revista-seccion-autor", "revista-seccion-texto"].forEach(function (id) { self.bindInput(id); });
            var nsec = document.getElementById("revista-nueva-seccion");
            if (nsec) nsec.addEventListener("click", function () {
                var o = self.obra;
                if (!o.secciones) o.secciones = [];
                var sec = { id: self.uid(), tipo: "articulo", titulo: "Nueva seccion", autor: "", texto: "" };
                o.secciones.push(sec);
                self.seccionActual = sec.id;
                self.renderSecciones(o);
                self.renderSeccionActual(o);
                self.programarGuardado();
            });

            // Fanzine
            self.bindInput("fanzine-titulo");
            var fsel = document.getElementById("fanzine-paginas");
            if (fsel) fsel.addEventListener("change", function () {
                self.obra.paginasTotal = parseInt(this.value, 10);
                self.renderFanzineGrid(self.obra);
                self.actualizarInfoFanzine();
                self.programarGuardado();
            });

            // Aforismos
            self.bindInput("aforismos-titulo");
            var naf = document.getElementById("aforismo-nuevo");
            if (naf) naf.addEventListener("click", function () {
                var o = self.obra;
                if (!o.aforismos) o.aforismos = [];
                o.aforismos.push({ id: self.uid(), texto: "" });
                self.renderAforismos(o);
                self.programarGuardado();
            });
        },

        bindInput: function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var self = this;
            var onChange = function () {
                self.actualizarContador();
                self.programarGuardado();
            };
            el.addEventListener("input", onChange);
            if (el.tagName === "SELECT" || el.type === "date") el.addEventListener("change", onChange);
        },

        insertarImagen: function (file) {
            if (!file || file.type.indexOf("image") === -1) return;
            var self = this;
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    var maxW = 1200;
                    var w = img.width, h = img.height;
                    if (w > maxW) { h = h * maxW / w; w = maxW; }
                    var canvas = document.createElement("canvas");
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                    var dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                    var editor = document.getElementById("historia-editor");
                    if (!editor) return;
                    editor.focus();
                    var imgEl = document.createElement("img");
                    imgEl.src = dataUrl;
                    imgEl.alt = "Imagen";
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var r = sel.getRangeAt(0);
                        r.deleteContents();
                        r.insertNode(imgEl);
                        r.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(r);
                    } else {
                        editor.appendChild(imgEl);
                    }
                    self.programarGuardado();
                    self.actualizarContador();
                    self.toast("Imagen insertada");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    window.LitteraTaller = Taller;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("modo-tabs")) {
            Taller.init();
        }
    });
})();
