(function () {
    "use strict";
    var K_ENV = "littera.plaza.envios";
    var K_CON = "littera.plaza.contactos";
    var K_CAL = "littera.plaza.convocatorias";
    var K_OBRAS = "littera.obras";

    var SVG = {
        papelera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
        lapiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
    };

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
    function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function fecha(iso) { if(!iso) return "—"; var d = new Date(iso); return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear(); }
    function toast(m, tipo) {
        var c = document.getElementById("toasts"); if (!c) return;
        var t = document.createElement("div"); t.className = "toast " + (tipo || "exito");
        t.innerHTML = "<span>" + esc(m) + "</span>";
        c.appendChild(t);
        setTimeout(function(){ t.classList.add("saliendo"); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 260); }, 2200);
    }

    var Plaza = {
        init: function () {
            if (!document.getElementById("plaza-tabs")) return;
            this.bindTabs();
            this.pintarEnvios();
            this.pintarContactos();
            this.pintarConvocatorias();
        },
        bindTabs: function () {
            var tabs = document.querySelectorAll(".plaza-tab");
            tabs.forEach(function (t) {
                t.addEventListener("click", function () {
                    tabs.forEach(function (x) { x.classList.toggle("activo", x === t); });
                    document.querySelectorAll(".plaza-panel").forEach(function (p) {
                        p.classList.toggle("activo", p.id === "plaza-" + t.dataset.tab);
                    });
                });
            });
        },
        // ---------- ENVIOS ----------
        pintarEnvios: function () {
            var lista = document.getElementById("envios-lista"); if (!lista) return;
            var datos = leer(K_ENV, []);
            lista.innerHTML = "";
            if (!datos.length) {
                lista.innerHTML = '<div class="estado-vacio"><div class="ev-titulo">Sin envios registrados</div><div class="ev-desc">Registra cada texto que envies a una editorial, revista o concurso. Con el tiempo veras tu historial completo.</div></div>';
                return;
            }
            var self = this;
            datos.slice().reverse().forEach(function (e) {
                var div = document.createElement("div");
                div.className = "envio-item";
                var estado = e.estado || "enviado";
                div.innerHTML =
                    '<div class="envio-estado ' + estado + '"></div>' +
                    '<div><div class="envio-titulo">' + esc(e.destino || "Sin destino") + '</div>' +
                    '<div class="envio-meta">' + estado.toUpperCase() + ' · ' + fecha(e.fecha) + '</div></div>' +
                    '<div class="envio-obra">' + esc(e.obra || "") + '</div>' +
                    '<div class="envio-acciones">' +
                        '<button class="plaza-btn-mini editar" title="Editar">' + SVG.lapiz + '</button>' +
                        '<button class="plaza-btn-mini borrar" title="Borrar">' + SVG.papelera + '</button>' +
                    '</div>';
                div.querySelector(".borrar").addEventListener("click", function () {
                    if (!confirm("Borrar este envio?")) return;
                    var d = leer(K_ENV, []).filter(function(x){ return x.id !== e.id; });
                    escribir(K_ENV, d); self.pintarEnvios();
                });
                div.querySelector(".editar").addEventListener("click", function () {
                    var estados = ["enviado","revision","aceptado","rechazado","publicado"];
                    var idx = estados.indexOf(e.estado);
                    var nuevo = estados[(idx + 1) % estados.length];
                    var d = leer(K_ENV, []);
                    var item = d.find(function(x){ return x.id === e.id; });
                    if (item) { item.estado = nuevo; escribir(K_ENV, d); self.pintarEnvios(); toast("Estado: " + nuevo); }
                });
                lista.appendChild(div);
            });
        },
        // ---------- CONTACTOS ----------
        pintarContactos: function () {
            var lista = document.getElementById("contactos-lista"); if (!lista) return;
            var datos = leer(K_CON, []);
            lista.innerHTML = "";
            if (!datos.length) {
                lista.innerHTML = '<div class="estado-vacio"><div class="ev-titulo">Sin editoriales ni revistas</div><div class="ev-desc">Guarda los datos de editoriales, revistas y concursos donde quieras enviar tu obra.</div></div>';
                return;
            }
            var self = this;
            datos.slice().reverse().forEach(function (c) {
                var div = document.createElement("div");
                div.className = "contacto-item";
                div.innerHTML =
                    '<div style="width:10px;height:10px;border-radius:50%;background:' + (c.tipo === "revista" ? "#4A7C7E" : c.tipo === "concurso" ? "#9A7A1E" : "#2A3F5F") + '"></div>' +
                    '<div><div class="contacto-titulo">' + esc(c.nombre || "Sin nombre") + '</div>' +
                    '<div class="contacto-meta">' + esc((c.tipo||"editorial").toUpperCase()) + (c.web ? " · " + esc(c.web) : "") + '</div></div>' +
                    '<div></div>' +
                    '<div class="contacto-acciones">' +
                        '<button class="plaza-btn-mini borrar" title="Borrar">' + SVG.papelera + '</button>' +
                    '</div>';
                div.querySelector(".borrar").addEventListener("click", function () {
                    if (!confirm("Borrar " + c.nombre + "?")) return;
                    var d = leer(K_CON, []).filter(function(x){ return x.id !== c.id; });
                    escribir(K_CON, d); self.pintarContactos();
                });
                lista.appendChild(div);
            });
        },
        // ---------- CONVOCATORIAS ----------
        pintarConvocatorias: function () {
            var lista = document.getElementById("convocatorias-lista"); if (!lista) return;
            var datos = leer(K_CAL, []);
            lista.innerHTML = "";
            if (!datos.length) {
                lista.innerHTML = '<div class="estado-vacio"><div class="ev-titulo">Sin convocatorias</div><div class="ev-desc">Anota los concursos y revistas con fecha de cierre. La Plaza te recordara cuando se acerquen.</div></div>';
                return;
            }
            var self = this;
            var hoy = new Date().getTime();
            datos.slice().sort(function(a,b){ return (a.fecha||"").localeCompare(b.fecha||""); }).forEach(function (c) {
                var dias = c.fecha ? Math.ceil((new Date(c.fecha).getTime() - hoy) / (1000*60*60*24)) : null;
                var urgencia = dias !== null && dias <= 7 ? "#8B2E2E" : dias !== null && dias <= 30 ? "#9A7A1E" : "#2A3F5F";
                var div = document.createElement("div");
                div.className = "convocatoria-item";
                div.innerHTML =
                    '<div style="width:10px;height:10px;border-radius:50%;background:' + urgencia + '"></div>' +
                    '<div><div class="convocatoria-titulo">' + esc(c.nombre || "Convocatoria") + '</div>' +
                    '<div class="convocatoria-meta">' + fecha(c.fecha) + (dias !== null ? " · " + (dias > 0 ? dias + " dias" : "cerrada") : "") + '</div></div>' +
                    '<div class="envio-obra">' + esc(c.medio || "") + '</div>' +
                    '<div class="convocatoria-acciones">' +
                        '<button class="plaza-btn-mini borrar" title="Borrar">' + SVG.papelera + '</button>' +
                    '</div>';
                div.querySelector(".borrar").addEventListener("click", function () {
                    if (!confirm("Borrar convocatoria?")) return;
                    var d = leer(K_CAL, []).filter(function(x){ return x.id !== c.id; });
                    escribir(K_CAL, d); self.pintarConvocatorias();
                });
                lista.appendChild(div);
            });
        },
        // ---------- ALTAS ----------
        nuevoEnvio: function () {
            var obras = leer(K_OBRAS, []);
            var destino = prompt("Editorial / revista / concurso:");
            if (!destino) return;
            var opciones = obras.map(function(o,i){ return (i+1) + ". " + (o.titulo||"Sin titulo"); }).join("\n");
            var obraIdx = prompt("¿Que obra envias? Escribe el numero:\n" + opciones);
            if (!obraIdx) return;
            var idx = parseInt(obraIdx, 10) - 1;
            var obraTitulo = obras[idx] ? (obras[idx].titulo || "Sin titulo") : "";
            var d = leer(K_ENV, []);
            d.push({ id: uid(), destino: destino, obra: obraTitulo, obraId: obras[idx] ? obras[idx].id : null, estado: "enviado", fecha: new Date().toISOString() });
            escribir(K_ENV, d);
            this.pintarEnvios();
            toast("Envio registrado");
        },
        nuevoContacto: function () {
            var nombre = prompt("Nombre de la editorial / revista / concurso:");
            if (!nombre) return;
            var tipo = prompt("Tipo: editorial / revista / concurso", "editorial") || "editorial";
            var web = prompt("Web (opcional):") || "";
            var d = leer(K_CON, []);
            d.push({ id: uid(), nombre: nombre, tipo: tipo, web: web });
            escribir(K_CON, d);
            this.pintarContactos();
            toast("Contacto guardado");
        },
        nuevaConvocatoria: function () {
            var nombre = prompt("Nombre de la convocatoria:");
            if (!nombre) return;
            var fecha = prompt("Fecha limite (YYYY-MM-DD):");
            if (!fecha) return;
            var medio = prompt("Medio / editorial (opcional):") || "";
            var d = leer(K_CAL, []);
            d.push({ id: uid(), nombre: nombre, fecha: fecha, medio: medio });
            escribir(K_CAL, d);
            this.pintarConvocatorias();
            toast("Convocatoria anadida");
        }
    };

    window.LitteraPlaza = Plaza;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("plaza-tabs")) Plaza.init();
    });
})();
