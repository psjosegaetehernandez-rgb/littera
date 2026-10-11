(function () {
    "use strict";
    var K = "littera.personajes";
    function leer(k,d){ try{var r=localStorage.getItem(k); return r?JSON.parse(r):d;}catch(e){return d;} }
    function escribir(k,v){ try{localStorage.setItem(k,JSON.stringify(v)); return true;}catch(e){return false;} }
    function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
    function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function inicial(n){ return (n||"?").trim().charAt(0).toUpperCase() || "?"; }

    var P = {
        personajes: [], actual: null,
        init: function(){
            if (!document.getElementById("pj-lista")) return;
            this.personajes = leer(K, []);
            if (!this.personajes.length) {
                this.personajes.push(this.vacio());
                escribir(K, this.personajes);
            }
            this.actual = this.personajes[0].id;
            this.bind();
            this.pintarLista();
            this.pintarDetalle();
        },
        vacio: function(){
            return {
                id: uid(),
                nombre: "Nuevo personaje",
                rol: "secundario",
                edad: "", lugar: "", apariencia: "", biografia: "",
                deseo: "", miedo: "", contradiccion: "",
                arquetipo: "", voz: "", muletillas: "",
                relaciones: []
            };
        },
        guardar: function(){
            if (!this.actual) return;
            var p = this.personajes.find(function(x){ return x.id === P.actual; });
            if (!p) return;
            var v = function(id){ var el=document.getElementById(id); return el ? el.value : ""; };
            p.nombre = v("pj-nombre") || "Sin nombre";
            p.rol = v("pj-rol");
            p.edad = v("pj-edad");
            p.lugar = v("pj-lugar");
            p.apariencia = v("pj-apariencia");
            p.biografia = v("pj-biografia");
            p.deseo = v("pj-deseo");
            p.miedo = v("pj-miedo");
            p.contradiccion = v("pj-contradiccion");
            p.arquetipo = v("pj-arquetipo");
            p.voz = v("pj-voz");
            p.muletillas = v("pj-muletillas");
            escribir(K, this.personajes);
        },
        pintarLista: function(){
            var lista = document.getElementById("pj-lista");
            lista.innerHTML = "";
            var self = this;
            this.personajes.forEach(function(p){
                var li = document.createElement("li");
                li.className = "pj-item" + (p.id === self.actual ? " activo" : "");
                li.innerHTML = '<div class="pj-avatar">' + esc(inicial(p.nombre)) + '</div>' +
                    '<div class="pj-item-texto"><div class="pj-item-nombre">' + esc(p.nombre) + '</div>' +
                    '<div class="pj-item-rol">' + esc(p.rol || "secundario") + '</div></div>';
                li.addEventListener("click", function(){
                    self.guardar();
                    self.actual = p.id;
                    self.pintarLista();
                    self.pintarDetalle();
                });
                lista.appendChild(li);
            });
        },
        pintarDetalle: function(){
            var cont = document.getElementById("pj-detalle");
            var p = this.personajes.find(function(x){ return x.id === P.actual; });
            if (!p) { cont.innerHTML = ""; return; }
            var self = this;
            cont.innerHTML =
                '<div class="pj-cabecera">' +
                    '<div class="pj-avatar-grande">' + esc(inicial(p.nombre)) + '</div>' +
                    '<div>' +
                        '<input type="text" class="pj-nombre-input" id="pj-nombre" value="' + esc(p.nombre) + '" placeholder="Nombre">' +
                        '<input type="text" class="pj-rol-input" id="pj-rol" value="' + esc(p.rol) + '" placeholder="protagonista / antagonista / secundario">' +
                    '</div>' +
                '</div>' +
                '<div class="pj-grid">' +
                    campo("Edad", "pj-edad", p.edad) +
                    campo("Lugar de origen", "pj-lugar", p.lugar) +
                    campo("Arquetipo", "pj-arquetipo", p.arquetipo, "heroe, trickster, sabio, sombra...") +
                    campo("Deseo profundo", "pj-deseo", p.deseo, "¿Que quiere mas que nada?") +
                    campo("Miedo", "pj-miedo", p.miedo, "¿Que teme perder?") +
                    campo("Contradiccion", "pj-contradiccion", p.contradiccion, "Lo que lo hace humano") +
                '</div>' +
                '<div class="pj-campo" style="margin-top:var(--e-4)"><label class="pj-label">Apariencia fisica</label>' +
                '<textarea class="pj-textarea" id="pj-apariencia" placeholder="Rasgos, gestos, ropa, cuerpo...">' + esc(p.apariencia) + '</textarea></div>' +
                '<div class="pj-campo" style="margin-top:var(--e-4)"><label class="pj-label">Biografia</label>' +
                '<textarea class="pj-textarea" id="pj-biografia" placeholder="Su historia, sus heridas, sus decisiones...">' + esc(p.biografia) + '</textarea></div>' +
                '<div class="pj-grid" style="margin-top:var(--e-4)">' +
                    campo("Voz / idiolecto", "pj-voz", p.voz, "¿Como habla?") +
                    campo("Muletillas", "pj-muletillas", p.muletillas, "Frases recurrentes") +
                '</div>' +
                '<div class="pj-relaciones">' +
                    '<div class="pj-relaciones-titulo">' +
                        '<span>Relaciones con otros personajes</span>' +
                        '<button class="btn btn-secundario" id="pj-add-rel" style="font-size:11.5px;">+ Relacion</button>' +
                    '</div>' +
                    '<div class="pj-relaciones-lista" id="pj-rel-lista"></div>' +
                '</div>';

            cont.querySelectorAll("input, textarea").forEach(function(el){
                el.addEventListener("input", function(){ self.guardar(); self.pintarLista(); });
            });
            this.pintarRelaciones(p);
            document.getElementById("pj-add-rel").addEventListener("click", function(){
                var otro = prompt("Nombre del otro personaje:");
                if (!otro) return;
                var tipo = prompt("Tipo de relacion:", "aliado") || "aliado";
                p.relaciones.push({ personaje: otro, tipo: tipo });
                self.guardar();
                self.pintarRelaciones(p);
            });
        },
        pintarRelaciones: function(p){
            var lista = document.getElementById("pj-rel-lista");
            if (!lista) return;
            lista.innerHTML = "";
            var self = this;
            if (!p.relaciones || !p.relaciones.length) {
                lista.innerHTML = '<p style="color:var(--fg-subtle);font-style:italic;font-size:13px;">Sin relaciones registradas.</p>';
                return;
            }
            p.relaciones.forEach(function(r, i){
                var div = document.createElement("div");
                div.className = "pj-relacion";
                div.innerHTML = '<span class="pj-relacion-personaje">' + esc(r.personaje) + '</span>' +
                    '<span class="pj-relacion-tipo">' + esc(r.tipo) + '</span>' +
                    '<button class="plaza-btn-mini borrar">×</button>';
                div.querySelector(".borrar").addEventListener("click", function(){
                    p.relaciones.splice(i, 1);
                    self.guardar();
                    self.pintarRelaciones(p);
                });
                lista.appendChild(div);
            });
        },
        bind: function(){
            var self = this;
            var btnNuevo = document.getElementById("pj-nuevo");
            if (btnNuevo) btnNuevo.addEventListener("click", function(){
                self.guardar();
                var p = self.vacio();
                self.personajes.push(p);
                escribir(K, self.personajes);
                self.actual = p.id;
                self.pintarLista();
                self.pintarDetalle();
                document.getElementById("pj-nombre").focus();
            });
            var btnBorrar = document.getElementById("pj-borrar");
            if (btnBorrar) btnBorrar.addEventListener("click", function(){
                if (!confirm("Borrar este personaje?")) return;
                self.personajes = self.personajes.filter(function(x){ return x.id !== self.actual; });
                if (!self.personajes.length) self.personajes.push(self.vacio());
                escribir(K, self.personajes);
                self.actual = self.personajes[0].id;
                self.pintarLista();
                self.pintarDetalle();
            });
        }
    };

    function campo(label, id, valor, ph){
        return '<div class="pj-campo"><label class="pj-label">' + label + '</label>' +
            '<input type="text" class="pj-input" id="' + id + '" value="' + esc(valor) + '" placeholder="' + (ph||"") + '"></div>';
    }

    window.LitteraPersonajes = P;
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("pj-lista")) P.init();
    });
})();
