// ============================================
// LITTERA v6 - Modulo de IA
// Compatible con OpenAI, Anthropic, Groq
// ============================================
(function () {
    "use strict";

    var K_CONFIG = "littera.ia.config";
    var K_USO = "littera.ia.uso";

    var PROVEEDORES = {
        groq: {
            nombre: "Groq (gratis, rapido)",
            endpoint: "https://api.groq.com/openai/v1/chat/completions",
            modelos: ["llama-3.1-8b-instant", "openai/gpt-oss-20b", "openai/gpt-oss-120b", "moonshotai/kimi-k2-instruct", "qwen/qwen3-32b", "meta-llama/llama-4-scout-17b-16e-instruct"],
            modeloDefecto: "llama-3.1-8b-instant",
            urlKey: "https://console.groq.com/keys"
        },
        openai: {
            nombre: "OpenAI (ChatGPT)",
            endpoint: "https://api.openai.com/v1/chat/completions",
            modelos: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
            modeloDefecto: "gpt-4o-mini",
            urlKey: "https://platform.openai.com/api-keys"
        },
        anthropic: {
            nombre: "Anthropic (Claude)",
            endpoint: "https://api.anthropic.com/v1/messages",
            modelos: ["claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022"],
            modeloDefecto: "claude-3-5-haiku-20241022",
            urlKey: "https://console.anthropic.com/settings/keys"
        },
        custom: {
            nombre: "Personalizado (compatible OpenAI)",
            endpoint: "",
            modelos: [],
            modeloDefecto: "",
            urlKey: ""
        }
    };

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }
    function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function toast(m, tipo) {
        var c = document.getElementById("toasts"); if (!c) return;
        var t = document.createElement("div");
        t.className = "toast " + (tipo || "exito");
        t.innerHTML = "<span>" + esc(m) + "</span>";
        c.appendChild(t);
        setTimeout(function(){ t.classList.add("saliendo"); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 260); }, 2600);
    }

    var IA = {
        config: null,
        conversacion: [],
        cargando: false,

        init: function () {
            this.cargarConfig();
            this.inyectarBurbuja();
            this.inyectarTopbarBtn();
            this.inyectarAccionesModulos();
        },

        cargarConfig: function () {
            var def = {
                proveedor: "groq",
                endpoint: PROVEEDORES.groq.endpoint,
                apiKey: "",
                modelo: PROVEEDORES.groq.modeloDefecto,
                temperatura: 0.7,
                maxTokens: 1000,
                systemPrompt: "Eres un asistente literario culto, preciso y calido. Ayudas a un escritor con sugerencias, analisis, variaciones de estilo y ejercicios. Nunca escribes por el escritor: le das herramientas. Responde en español, de manera concisa. Usa ejemplos cuando ayuden."
            };
            var g = leer(K_CONFIG, {});
            this.config = Object.assign(def, g || {});
        },

        guardarConfig: function () { escribir(K_CONFIG, this.config); },
        tieneKey: function () { return !!(this.config.apiKey && this.config.apiKey.length > 10); },

        inyectarBurbuja: function () {
            if (document.getElementById("ia-burbuja")) return;
            var btn = document.createElement("button");
            btn.id = "ia-burbuja";
            btn.className = "ia-burbuja";
            btn.title = "Asistente literario";
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4 2 5v3h10v-3c.5-1 2-2.5 2-5a7 7 0 0 0-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>';
            document.body.appendChild(btn);
            var self = this;
            btn.addEventListener("click", function () { self.abrirAsistente(); });
            if (this.tieneKey()) btn.classList.add("visible");
        },

        inyectarTopbarBtn: function () {
            var topbar = document.querySelector(".acciones-topbar");
            if (!topbar) { setTimeout(this.inyectarTopbarBtn.bind(this), 500); return; }
            if (document.getElementById("ia-topbar-btn")) return;
            var btn = document.createElement("button");
            btn.id = "ia-topbar-btn";
            btn.className = "btn btn-fantasma";
            btn.title = "Configuracion de IA";
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4 2 5v3h10v-3c.5-1 2-2.5 2-5a7 7 0 0 0-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg> IA';
            topbar.insertBefore(btn, topbar.firstChild);
            var self = this;
            btn.addEventListener("click", function () { self.abrirConfig(); });
        },

        inyectarAccionesModulos: function () {
            var self = this;
            setTimeout(function () {
                var tallerBar = document.querySelector(".taller-barra");
                if (tallerBar && !document.getElementById("ia-acciones-taller")) {
                    var barra = document.createElement("div");
                    barra.id = "ia-acciones-taller";
                    barra.className = "ia-barra-acciones";
                    barra.innerHTML =
                        '<span style="font-family:var(--f-mono);font-size:9.5px;text-transform:uppercase;letter-spacing:0.16em;color:var(--fg-subtle);align-self:center;margin-right:6px;">Asistente IA</span>' +
                        '<button class="ia-accion" data-accion="continuar">Continuar</button>' +
                        '<button class="ia-accion" data-accion="variaciones">Variaciones</button>' +
                        '<button class="ia-accion" data-accion="sinonimos">Sinonimos</button>' +
                        '<button class="ia-accion" data-accion="ritmo">Ritmo</button>' +
                        '<button class="ia-accion" data-accion="cliche">Buscar cliches</button>' +
                        '<button class="ia-accion" data-accion="corregir">Corregir estilo</button>';
                    tallerBar.parentNode.insertBefore(barra, tallerBar.nextSibling);
                    barra.querySelectorAll(".ia-accion").forEach(function (b) {
                        b.addEventListener("click", function () { self.ejecutarAccion(b.dataset.accion); });
                    });
                }

                var labBarra = document.querySelector(".lab-barra");
                if (labBarra && !document.getElementById("ia-acciones-lab")) {
                    var barra2 = document.createElement("div");
                    barra2.id = "ia-acciones-lab";
                    barra2.className = "ia-barra-acciones";
                    barra2.innerHTML =
                        '<span style="font-family:var(--f-mono);font-size:9.5px;text-transform:uppercase;letter-spacing:0.16em;color:var(--fg-subtle);align-self:center;margin-right:6px;">Analisis IA</span>' +
                        '<button class="ia-accion" data-accion="lab-interpretar">Interpretar</button>' +
                        '<button class="ia-accion" data-accion="lab-temas">Temas principales</button>' +
                        '<button class="ia-accion" data-accion="lab-influencias">Influencias</button>' +
                        '<button class="ia-accion" data-accion="lab-mejorar">Sugerencias</button>';
                    labBarra.parentNode.insertBefore(barra2, labBarra.nextSibling);
                    barra2.querySelectorAll(".ia-accion").forEach(function (b) {
                        b.addEventListener("click", function () { self.ejecutarAccion(b.dataset.accion); });
                    });
                }
            }, 900);
        },

        abrirAsistente: function () {
            if (document.getElementById("ia-asistente")) {
                document.getElementById("ia-asistente").classList.add("abierto");
                return;
            }
            if (!this.tieneKey()) {
                toast("Configura tu API key primero (boton IA en el topbar)");
                this.abrirConfig();
                return;
            }
            var self = this;
            var chat = document.createElement("div");
            chat.id = "ia-asistente";
            chat.className = "ia-asistente abierto";
            chat.innerHTML =
                '<div class="ia-cabecera">' +
                    '<div class="ia-avatar">L</div>' +
                    '<div>' +
                        '<div class="ia-titulo">Asistente literario</div>' +
                        '<div class="ia-modelo">' + esc(this.config.modelo) + '</div>' +
                    '</div>' +
                    '<button class="ia-cerrar" title="Cerrar">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' +
                '</div>' +
                '<div class="ia-mensajes" id="ia-mensajes"></div>' +
                '<div class="ia-compositor">' +
                    '<div class="ia-sugerencias" id="ia-sugerencias"></div>' +
                    '<div class="ia-entrada">' +
                        '<textarea id="ia-textarea" placeholder="Pregunta, pide sugerencias, pega un parrafo..." rows="1"></textarea>' +
                        '<button class="ia-enviar" id="ia-enviar" disabled>' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
                        '</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(chat);

            chat.querySelector(".ia-cerrar").addEventListener("click", function () {
                chat.classList.remove("abierto");
            });

            var ta = document.getElementById("ia-textarea");
            var enviar = document.getElementById("ia-enviar");
            ta.addEventListener("input", function () {
                enviar.disabled = !ta.value.trim() || self.cargando;
                ta.style.height = "auto";
                ta.style.height = Math.min(140, ta.scrollHeight) + "px";
            });
            ta.addEventListener("keydown", function (e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!enviar.disabled) enviar.click();
                }
            });
            enviar.addEventListener("click", function () { self.enviar(); });

            this.actualizarSugerencias();

            if (this.conversacion.length === 0) {
                this.agregarMensaje("asistente", "Hola. Soy tu asistente literario. Puedo ayudarte a continuar un texto, buscar sinonimos, revisar el ritmo, analizar temas, o darte ejercicios. ¿Con que empezamos?");
            } else {
                this.renderHistorial();
            }
        },

        actualizarSugerencias: function () {
            var sugs = [
                "Dame 3 ideas para continuar este texto",
                "Sugiere sinonimos con matiz literario",
                "¿Que cliches hay en este parrafo?",
                "Analiza el ritmo de esta frase"
            ];
            var modo = window.LitteraTaller ? window.LitteraTaller.modo : null;
            if (modo === "verso" || modo === "poesia") {
                sugs = ["Analiza la metrica de estos versos", "Sugiere imagenes para este poema", "Dame 3 metaforas para 'soledad'"];
            } else if (modo === "cuento") {
                sugs = ["¿El conflicto esta claro?", "Sugiere un giro final", "Analiza el ritmo narrativo"];
            } else if (modo === "novela") {
                sugs = ["¿Como mantengo la tension?", "Ideas para el proximo capitulo", "Analiza la voz del narrador"];
            }
            var cont = document.getElementById("ia-sugerencias");
            if (!cont) return;
            cont.innerHTML = sugs.map(function (s) {
                return '<button class="ia-sug">' + esc(s) + '</button>';
            }).join("");
            cont.querySelectorAll(".ia-sug").forEach(function (b) {
                b.addEventListener("click", function () {
                    var ta = document.getElementById("ia-textarea");
                    ta.value = b.textContent;
                    ta.dispatchEvent(new Event("input"));
                    ta.focus();
                });
            });
        },

        agregarMensaje: function (rol, contenido) {
            var cont = document.getElementById("ia-mensajes");
            if (!cont) return null;
            var div = document.createElement("div");
            div.className = "ia-msg " + rol;
            div.textContent = contenido;
            cont.appendChild(div);
            cont.scrollTop = cont.scrollHeight;
            return div;
        },

        renderHistorial: function () {
            var cont = document.getElementById("ia-mensajes");
            if (!cont) return;
            cont.innerHTML = "";
            var self = this;
            this.conversacion.forEach(function (m) {
                self.agregarMensaje(m.role === "assistant" ? "asistente" : "usuario", m.content);
            });
        },

        enviar: function () {
            if (this.cargando) return;
            var ta = document.getElementById("ia-textarea");
            var texto = (ta.value || "").trim();
            if (!texto) return;
            ta.value = "";
            ta.style.height = "auto";
            document.getElementById("ia-enviar").disabled = true;

            this.conversacion.push({ role: "user", content: texto });
            this.agregarMensaje("usuario", texto);
            this.enviarAPI();
        },

        enviarAPI: function () {
            var self = this;
            this.cargando = true;
            var cargando = this.agregarMensaje("cargando", "");
            if (cargando) cargando.innerHTML = '<div class="punto"></div><div class="punto"></div><div class="punto"></div>';

            var endpoint = this.config.endpoint;
            if (!endpoint) {
                if (cargando && cargando.parentNode) cargando.parentNode.removeChild(cargando);
                this.cargando = false;
                this.agregarMensaje("sistema", "Falta configurar el endpoint.");
                return;
            }

            if (this.config.proveedor === "anthropic") {
                this.enviarAnthropic(endpoint, cargando);
            } else {
                this.enviarOpenAICompatible(endpoint, cargando);
            }
        },

        enviarOpenAICompatible: function (endpoint, cargando) {
            var self = this;
            var mensajes = [{ role: "system", content: this.config.systemPrompt }];
            this.conversacion.slice(-20).forEach(function (m) {
                mensajes.push({ role: m.role, content: m.content });
            });

            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.config.apiKey },
                body: JSON.stringify({
                    model: this.config.modelo,
                    messages: mensajes,
                    temperature: parseFloat(this.config.temperatura),
                    max_tokens: parseInt(this.config.maxTokens, 10)
                })
            })
            .then(function (r) {
                if (!r.ok) return r.text().then(function (t) { throw new Error("HTTP " + r.status + ": " + t.slice(0, 200)); });
                return r.json();
            })
            .then(function (data) {
                var resp = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "(vacio)";
                self.recibir(resp, cargando, data.usage);
            })
            .catch(function (err) { self.manejarError(err, cargando); });
        },

        enviarAnthropic: function (endpoint, cargando) {
            var self = this;
            var mensajes = this.conversacion.slice(-20).map(function (m) {
                return { role: m.role, content: m.content };
            });

            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.config.apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: this.config.modelo,
                    system: this.config.systemPrompt,
                    messages: mensajes,
                    temperature: parseFloat(this.config.temperatura),
                    max_tokens: parseInt(this.config.maxTokens, 10)
                })
            })
            .then(function (r) {
                if (!r.ok) return r.text().then(function (t) { throw new Error("HTTP " + r.status + ": " + t.slice(0, 200)); });
                return r.json();
            })
            .then(function (data) {
                var resp = data.content && data.content[0] && data.content[0].text ? data.content[0].text : "(vacio)";
                self.recibir(resp, cargando, data.usage);
            })
            .catch(function (err) { self.manejarError(err, cargando); });
        },

        recibir: function (respuesta, cargando, usage) {
            if (cargando && cargando.parentNode) cargando.parentNode.removeChild(cargando);
            this.cargando = false;
            this.conversacion.push({ role: "assistant", content: respuesta });
            this.agregarMensaje("asistente", respuesta);
            this.registrarUso(usage);
            var enviar = document.getElementById("ia-enviar");
            var ta = document.getElementById("ia-textarea");
            if (enviar && ta) enviar.disabled = !ta.value.trim();
        },

        manejarError: function (err, cargando) {
            if (cargando && cargando.parentNode) cargando.parentNode.removeChild(cargando);
            this.cargando = false;
            var msg = err.message || String(err);
            var ex = "";
            if (msg.indexOf("401") >= 0) ex = "API key invalida o expirada.";
            else if (msg.indexOf("429") >= 0) ex = "Limite alcanzado. Espera o cambia de proveedor.";
            else if (msg.indexOf("Failed to fetch") >= 0) ex = "Sin conexion o CORS bloqueado.";
            this.agregarMensaje("sistema", "Error: " + msg + (ex ? " — " + ex : ""));
            var enviar = document.getElementById("ia-enviar");
            var ta = document.getElementById("ia-textarea");
            if (enviar && ta) enviar.disabled = !ta.value.trim();
        },

        registrarUso: function (usage) {
            if (!usage) return;
            var uso = leer(K_USO, { tokens: 0, llamadas: 0 });
            uso.tokens += (usage.total_tokens || (usage.input_tokens || 0) + (usage.output_tokens || 0));
            uso.llamadas = (uso.llamadas || 0) + 1;
            escribir(K_USO, uso);
        },

        ejecutarAccion: function (accion) {
            if (!this.tieneKey()) {
                toast("Configura tu API key primero");
                this.abrirConfig();
                return;
            }
            var texto = this.obtenerTextoActivo();
            if (!texto) { toast("No hay texto en el editor"); return; }

            var prompts = {
                "continuar": "Aqui esta el texto que estoy escribiendo:\n\n" + texto + "\n\nDame 3 formas de continuarlo, manteniendo el tono. Explica brevemente el efecto de cada una.",
                "variaciones": "Reescribe este fragmento de 3 maneras distintas:\n\n" + texto + "\n\nUna mas sobria, una mas lirica, una mas ironica.",
                "sinonimos": "Para este texto:\n\n" + texto + "\n\nSugiere sinonimos mas precisos para las palabras repetidas o comunes. Muestra el cambio en contexto.",
                "ritmo": "Analiza el ritmo de este texto:\n\n" + texto + "\n\n¿Como suena? ¿Que cambios ritmicos sugeririas?",
                "cliche": "Busca lugares comunes y cliches en este texto:\n\n" + texto + "\n\nPara cada uno, sugiere una alternativa original.",
                "corregir": "Revisa este texto como editor literario:\n\n" + texto + "\n\nSugiere correcciones de estilo (no ortografia). Se concreto.",
                "lab-interpretar": "Analiza este texto literariamente:\n\n" + texto + "\n\nInterpreta: ¿que dice, que calla, que tensa?",
                "lab-temas": "Extrae los temas principales de este texto:\n\n" + texto + "\n\nExplica como se relacionan.",
                "lab-influencias": "¿Que tradiciones o autores resuenan en este texto?\n\n" + texto + "\n\nSe especifico.",
                "lab-mejorar": "Sugiere 3-5 mejoras concretas para este texto:\n\n" + texto + "\n\nSin reescribirlo."
            };
            var prompt = prompts[accion] || texto;

            var self = this;
            this.abrirAsistente();
            setTimeout(function () {
                var ta = document.getElementById("ia-textarea");
                ta.value = prompt;
                ta.dispatchEvent(new Event("input"));
                document.getElementById("ia-enviar").click();
            }, 150);
        },

        obtenerTextoActivo: function () {
    // 1) Preguntarle a LitteraTaller (sabe segun el modo activo)
    if (window.LitteraTaller && typeof window.LitteraTaller.textoActual === "function") {
        try {
            var t = window.LitteraTaller.textoActual();
            if (t && t.trim()) return t.trim();
        } catch (e) { /* sigue */ }
    }

    // 2) Fallback: buscar solo en el panel activo del taller
    var panelActivo = document.querySelector(".taller-panel.activo");
    if (panelActivo) {
        var els = panelActivo.querySelectorAll("textarea, [contenteditable='true']");
        for (var i = 0; i < els.length; i++) {
            var v = els[i].value || els[i].innerText || "";
            if (v && v.trim()) return v.trim();
        }
    }

    // 3) Laboratorio: la obra activa
    var lab = document.querySelector("#mundo-laboratorio.activo");
    if (lab && window.LitteraLaboratorio && window.LitteraLaboratorio.obraActual) {
        return this.textoDeObra(window.LitteraLaboratorio.obraActual);
    }

    // 4) Ultimo recurso: cualquier textarea visible con contenido
    var visibles = document.querySelectorAll("textarea");
    for (var j = 0; j < visibles.length; j++) {
        var el = visibles[j];
        if (el.offsetParent !== null && el.value && el.value.trim()) return el.value.trim();
    }

    return "";
},
        textoDeObra: function (o) {
            if (!o) return "";
            var partes = [];
            if (o.tipo === "novela" && o.capitulos) o.capitulos.forEach(function (c) { if (c.texto) partes.push(c.texto); });
            else if (o.tipo === "diario" && o.entradas) o.entradas.forEach(function (e) { if (e.texto) partes.push(e.texto); });
            else if (o.texto) partes.push(o.texto);
            return partes.join("\n\n").slice(0, 4000);
        },

        abrirConfig: function () {
            if (document.getElementById("ia-config-overlay")) return;
            var self = this;
            var overlay = document.createElement("div");
            overlay.id = "ia-config-overlay";
            overlay.className = "modal-overlay";
            overlay.style.alignItems = "flex-start";
            overlay.style.paddingTop = "60px";
            overlay.style.overflowY = "auto";

            var uso = leer(K_USO, { tokens: 0, llamadas: 0 });

            var provKeys = Object.keys(PROVEEDORES);
            var opcionesProv = provKeys.map(function (k) {
                var p = PROVEEDORES[k];
                return '<option value="' + k + '"' + (self.config.proveedor === k ? " selected" : "") + '>' + p.nombre + '</option>';
            }).join("");

            var prov = PROVEEDORES[self.config.proveedor] || PROVEEDORES.groq;
            var opcionesModelo = (prov.modelos || []).map(function (m) {
                return '<option value="' + m + '"' + (self.config.modelo === m ? " selected" : "") + '>' + m + '</option>';
            }).join("") || '<option value="">(personalizado)</option>';

            overlay.innerHTML =
                '<div class="modal" style="max-width:700px;padding:32px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">' +
                        '<h2 style="font-family:var(--f-display);font-style:italic;font-size:32px;font-weight:400;letter-spacing:-0.02em;color:var(--fg-strong);">Asistente IA</h2>' +
                        '<span class="ia-coste">Tokens usados: <span class="valor">' + uso.tokens + '</span></span>' +
                    '</div>' +
                    '<p style="font-family:var(--f-cuerpo);font-style:italic;font-size:14px;color:var(--fg-muted);margin-bottom:24px;line-height:1.6;">Configura tu proveedor de IA. La clave se guarda en tu navegador. Nunca sale de aqui excepto cuando la envias al proveedor que elijas.</p>' +

                    '<div class="ia-seccion">' +
                        '<div class="ia-seccion-titulo"><h3>Proveedor</h3><span class="badge">Paso 1</span></div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Servicio</label>' +
                            '<select class="ia-select" id="ia-prov">' + opcionesProv + '</select>' +
                        '</div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Modelo</label>' +
                            '<select class="ia-select" id="ia-modelo">' + opcionesModelo + '</select>' +
                        '</div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Endpoint (URL de la API)</label>' +
                            '<input type="text" class="ia-input" id="ia-endpoint" value="' + esc(self.config.endpoint) + '">' +
                        '</div>' +
                    '</div>' +

                    '<div class="ia-seccion">' +
                        '<div class="ia-seccion-titulo"><h3>API Key</h3><span class="badge">Paso 2</span></div>' +
                        '<div class="ia-campo">' +
                            '<input type="password" class="ia-input" id="ia-key" value="' + esc(self.config.apiKey) + '" placeholder="sk-...">' +
                            '<div class="ia-hint" id="ia-key-hint">Obten tu clave desde el sitio del proveedor.</div>' +
                        '</div>' +
                        '<div id="ia-estado-test"></div>' +
                    '</div>' +

                    '<div class="ia-seccion">' +
                        '<div class="ia-seccion-titulo"><h3>Ajustes avanzados</h3><span class="badge">Opcional</span></div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Temperatura (0 = preciso, 1 = creativo)</label>' +
                            '<input type="number" class="ia-input" id="ia-temp" min="0" max="2" step="0.1" value="' + self.config.temperatura + '">' +
                        '</div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Max tokens por respuesta</label>' +
                            '<input type="number" class="ia-input" id="ia-tokens" min="100" max="4000" step="100" value="' + self.config.maxTokens + '">' +
                        '</div>' +
                        '<div class="ia-campo">' +
                            '<label class="ia-label">Instrucciones base (system prompt)</label>' +
                            '<textarea class="ia-input" id="ia-system" rows="5" style="font-family:var(--f-cuerpo);font-size:13px;line-height:1.5;">' + esc(self.config.systemPrompt) + '</textarea>' +
                        '</div>' +
                    '</div>' +

                    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px;">' +
                        '<button class="btn btn-secundario" id="ia-cerrar-cfg">Cerrar</button>' +
                        '<button class="btn btn-primario" id="ia-guardar-cfg">Guardar</button>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(overlay);

            function cerrar() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }

            var selProv = document.getElementById("ia-prov");
            var selMod = document.getElementById("ia-modelo");
            var inputEndpoint = document.getElementById("ia-endpoint");
            var hint = document.getElementById("ia-key-hint");

            function actualizarModelos() {
                var p = PROVEEDORES[selProv.value];
                if (!p) return;
                selMod.innerHTML = (p.modelos || []).map(function (m) {
                    return '<option value="' + m + '">' + m + '</option>';
                }).join("") || '<option value="">(personalizado)</option>';
                inputEndpoint.value = p.endpoint || "";
                hint.innerHTML = p.urlKey ? 'Obten tu clave: <a href="' + p.urlKey + '" target="_blank">' + p.urlKey + '</a>' : '';
            }

            selProv.addEventListener("change", actualizarModelos);
            if (prov.urlKey) hint.innerHTML = 'Obten tu clave: <a href="' + prov.urlKey + '" target="_blank">' + prov.urlKey + '</a>';

            document.getElementById("ia-cerrar-cfg").addEventListener("click", cerrar);

            document.getElementById("ia-guardar-cfg").addEventListener("click", function () {
                self.config.proveedor = selProv.value;
                self.config.modelo = selMod.value;
                self.config.endpoint = inputEndpoint.value;
                self.config.apiKey = document.getElementById("ia-key").value.trim();
                self.config.temperatura = parseFloat(document.getElementById("ia-temp").value) || 0.7;
                self.config.maxTokens = parseInt(document.getElementById("ia-tokens").value, 10) || 1000;
                self.config.systemPrompt = document.getElementById("ia-system").value;
                self.guardarConfig();
                if (self.tieneKey()) {
                    document.getElementById("ia-burbuja").classList.add("visible");
                }
                cerrar();
                toast("Configuracion guardada");
            });

            overlay.addEventListener("click", function (e) { if (e.target === overlay) cerrar(); });
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        IA.init();
    });

    window.LitteraIa = IA;
})();


