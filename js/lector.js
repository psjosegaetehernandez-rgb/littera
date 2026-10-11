(function () {
    "use strict";
    var K_TEX = "littera.lector.textos";
    var K_ANOT = "littera.lector.anotaciones";
    var K_ACT = "littera.lector.actual";

    function leer(k,d){ try{var r=localStorage.getItem(k); return r?JSON.parse(r):d;}catch(e){return d;} }
    function escribir(k,v){ try{localStorage.setItem(k,JSON.stringify(v)); return true;}catch(e){return false;} }
    function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
    function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

    var L = {
        textos: [], anotaciones: {}, actual: null,
        init: function(){
            if (!document.getElementById("lector-lista")) return;
            this.textos = leer(K_TEX, []);
            this.anotaciones = leer(K_ANOT, {});
            this.actual = leer(K_ACT, null);
            this.bind();
            if (this.textos.length && !this.actual) this.actual = this.textos[0].id;
            if (!this.textos.length) this.textos.push(this.ejemplo());
            this.pintarLista();
            if (this.actual) this.pintarLector();
        },
        ejemplo: function(){
            return {
                id: uid(),
                titulo: "Fragmento de ejemplo",
                autor: "Littera",
                texto: "Este es un texto de ejemplo.\n\nPuedes seleccionar cualquier frase para subrayarla. Se guardara como anotacion y la veras marcada cuando vuelvas.\n\nPuedes cargar tus propios textos en el boton \"Cargar texto\" de la barra superior. Aceptan archivos .txt y .md.",
                fecha: new Date().toISOString()
            };
        },
        bind: function(){
            var self = this;
            var cargar = document.getElementById("lector-cargar");
            if (cargar) cargar.addEventListener("click", function(){
                var input = document.createElement("input");
                input.type = "file";
                input.accept = ".txt,.md,text/plain";
                input.addEventListener("change", function(e){
                    var f = e.target.files[0];
                    if (!f) return;
                    var reader = new FileReader();
                    reader.onload = function(ev){
                        var titulo = prompt("Titulo del texto:", f.name.replace(/\.[^.]+$/, "")) || f.name;
                        var autor = prompt("Autor (opcional):", "") || "";
                        var t = { id: uid(), titulo: titulo, autor: autor, texto: ev.target.result, fecha: new Date().toISOString() };
                        self.textos.push(t);
                        escribir(K_TEX, self.textos);
                        self.actual = t.id;
                        escribir(K_ACT, self.actual);
                        self.pintarLista();
                        self.pintarLector();
                    };
                    reader.readAsText(f);
                });
                input.click();
            });
            var pegar = document.getElementById("lector-pegar");
            if (pegar) pegar.addEventListener("click", function(){
                var texto = prompt("Pega el texto aqui (o usa el portapapeles):");
                if (!texto) return;
                var titulo = prompt("Titulo:", "Texto pegado") || "Sin titulo";
                var t = { id: uid(), titulo: titulo, autor: "", texto: texto, fecha: new Date().toISOString() };
                self.textos.push(t);
                escribir(K_TEX, self.textos);
                self.actual = t.id;
                escribir(K_ACT, self.actual);
                self.pintarLista();
                self.pintarLector();
            });
        },
        pintarLista: function(){
            var lista = document.getElementById("lector-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            this.textos.forEach(function(t){
                var div = document.createElement("div");
                div.className = "lector-item" + (t.id === self.actual ? " activo" : "");
                div.innerHTML = '<div class="lector-item-titulo">' + esc(t.titulo) + '</div>' +
                    '<div class="lector-item-meta">' + esc(t.autor || "Anonimo") + '</div>';
                div.addEventListener("click", function(){
                    self.actual = t.id;
                    escribir(K_ACT, self.actual);
                    self.pintarLista();
                    self.pintarLector();
                });
                lista.appendChild(div);
            });
        },
        pintarLector: function(){
            var cont = document.getElementById("lector-pagina");
            var t = this.textos.find(function(x){ return x.id === L.actual; });
            if (!t) { cont.innerHTML = ""; return; }

            // Renderizar texto con marcas
            var parrafos = t.texto.split(/\n\n+/);
            var anot = this.anotaciones[t.id] || [];
            var html = '<div class="lector-toolbar">' +
                '<button class="lector-toolbar-btn" id="lector-mark" title="Subrayar seleccion"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></button>' +
                '<button class="lector-toolbar-btn" id="lector-eliminar" title="Borrar texto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
                '</div>' +
                '<div class="lector-titulo">' + esc(t.titulo) + '</div>' +
                (t.autor ? '<div class="lector-autor">' + esc(t.autor) + '</div>' : '') +
                '<div class="lector-contenido" id="lector-contenido">';
            parrafos.forEach(function(p){
                html += "<p>" + esc(p) + "</p>";
            });
            html += "</div>";
            cont.innerHTML = html;

            var self = this;
            var btnMark = document.getElementById("lector-mark");
            btnMark.addEventListener("click", function(){
                var sel = window.getSelection();
                if (!sel || sel.isCollapsed) { alert("Selecciona un fragmento primero."); return; }
                var texto = sel.toString().trim();
                if (!texto) return;
                var nota = prompt("Nota (opcional):", "") || "";
                if (!self.anotaciones[t.id]) self.anotaciones[t.id] = [];
                self.anotaciones[t.id].push({
                    id: uid(),
                    fragmento: texto,
                    nota: nota,
                    fecha: new Date().toISOString()
                });
                escribir(K_ANOT, self.anotaciones);
                // Marcar visualmente
                try {
                    var rango = sel.getRangeAt(0);
                    var span = document.createElement("mark");
                    span.appendChild(rango.extractContents());
                    if (nota) span.classList.add("con-nota");
                    rango.insertNode(span);
                } catch(e) {}
                sel.removeAllRanges();
            });
            var btnElim = document.getElementById("lector-eliminar");
            btnElim.addEventListener("click", function(){
                if (!confirm("Borrar este texto y sus anotaciones?")) return;
                self.textos = self.textos.filter(function(x){ return x.id !== t.id; });
                delete self.anotaciones[t.id];
                escribir(K_TEX, self.textos);
                escribir(K_ANOT, self.anotaciones);
                self.actual = self.textos[0] ? self.textos[0].id : null;
                self.pintarLista();
                self.pintarLector();
            });

            // Clic en marcas para ver/editar nota
            document.querySelectorAll("#lector-contenido mark").forEach(function(m){
                m.addEventListener("click", function(e){
                    e.stopPropagation();
                    var texto = m.textContent;
                    var notaObj = (self.anotaciones[t.id] || []).find(function(a){ return a.fragmento === texto; });
                    if (!notaObj) return;
                    var popup = document.createElement("div");
                    popup.className = "nota-popup";
                    popup.style.position = "fixed";
                    popup.style.left = Math.min(e.clientX, window.innerWidth - 300) + "px";
                    popup.style.top = (e.clientY + 10) + "px";
                    popup.innerHTML = '<div class="np-texto">' + esc(notaObj.nota || "(sin nota)") + '</div>' +
                        '<div class="np-acciones"><button data-accion="editar">Editar</button><button data-accion="borrar">Borrar</button></div>';
                    document.body.appendChild(popup);
                    function cerrar(){ if (popup.parentNode) popup.parentNode.removeChild(popup); }
                    popup.querySelector('[data-accion="editar"]').addEventListener("click", function(){
                        var nn = prompt("Nota:", notaObj.nota);
                        if (nn !== null) {
                            notaObj.nota = nn;
                            escribir(K_ANOT, self.anotaciones);
                        }
                        cerrar();
                    });
                    popup.querySelector('[data-accion="borrar"]').addEventListener("click", function(){
                        self.anotaciones[t.id] = self.anotaciones[t.id].filter(function(a){ return a.id !== notaObj.id; });
                        escribir(K_ANOT, self.anotaciones);
                        m.outerHTML = m.innerHTML;
                        cerrar();
                    });
                    setTimeout(function(){
                        document.addEventListener("click", function handler(ev){
                            if (!popup.contains(ev.target)) { cerrar(); document.removeEventListener("click", handler); }
                        });
                    }, 50);
                });
            });
        }
    };

    window.LitteraLector = L;
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("lector-lista")) L.init();
    });
})();
