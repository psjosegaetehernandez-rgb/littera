(function () {
    "use strict";
    var K = "littera.timeline";
    function leer(k,d){ try{var r=localStorage.getItem(k); return r?JSON.parse(r):d;}catch(e){return d;} }
    function escribir(k,v){ try{localStorage.setItem(k,JSON.stringify(v)); return true;}catch(e){return false;} }
    function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
    function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function formatearFecha(iso){
        if (!iso) return "—";
        var partes = iso.split("-");
        if (partes.length === 3) return partes[2] + "/" + partes[1] + "/" + partes[0];
        return iso;
    }

    var T = {
        eventos: [],
        init: function(){
            if (!document.getElementById("tl-eventos")) return;
            this.eventos = leer(K, []);
            this.bind();
            this.pintar();
        },
        bind: function(){
            var self = this;
            var btn = document.getElementById("tl-nuevo");
            if (btn) btn.addEventListener("click", function(){
                var titulo = prompt("Titulo del evento:");
                if (!titulo) return;
                var fInterna = prompt("Fecha interna de la historia (YYYY-MM-DD, o año):", "");
                var fNarr = prompt("Aparece en el capitulo / pagina:", "");
                var desc = prompt("Descripcion breve:", "") || "";
                self.eventos.push({
                    id: uid(),
                    titulo: titulo,
                    fechaInterna: fInterna || "",
                    ubicacionNarrativa: fNarr || "",
                    descripcion: desc
                });
                escribir(K, self.eventos);
                self.pintar();
            });
            var orden = document.getElementById("tl-orden");
            if (orden) orden.addEventListener("change", function(){ self.pintar(); });
        },
        pintar: function(){
            var cont = document.getElementById("tl-eventos");
            if (!cont) return;
            if (!this.eventos.length) {
                cont.innerHTML = '<div class="tl-vacio">' +
                    '<p style="font-family:var(--f-display);font-style:italic;font-size:26px;color:var(--fg-strong);letter-spacing:-0.02em;margin-bottom:10px;">Sin eventos aun</p>' +
                    '<p style="font-size:13.5px;line-height:1.55;max-width:44ch;margin:0 auto;">Anade eventos de tu historia para ver como se ordenan en el tiempo interno y como se presentan al lector.</p>' +
                '</div>';
                return;
            }
            var orden = (document.getElementById("tl-orden") || {}).value || "cronologico";
            var lista = this.eventos.slice();
            if (orden === "cronologico") {
                lista.sort(function(a, b) { return (a.fechaInterna || "").localeCompare(b.fechaInterna || ""); });
            } else if (orden === "narrativo") {
                lista.sort(function(a, b) { return (a.ubicacionNarrativa || "").localeCompare(b.ubicacionNarrativa || ""); });
            } else if (orden === "reciente") {
                lista.reverse();
            }
            cont.innerHTML = "";
            var self = this;
            lista.forEach(function(e){
                var div = document.createElement("div");
                div.className = "tl-evento";
                div.innerHTML =
                    '<div class="tl-evento-datos">' +
                        '<div class="tl-evento-titulo">' + esc(e.titulo) + '</div>' +
                        '<div class="tl-evento-fecha">' + esc(formatearFecha(e.fechaInterna)) + '</div>' +
                    '</div>' +
                    (e.descripcion ? '<p style="font-family:var(--f-cuerpo);font-size:13.5px;line-height:1.55;color:var(--fg-muted);margin:6px 0 0;">' + esc(e.descripcion) + '</p>' : '') +
                    '<div class="tl-evento-meta">' +
                        (e.ubicacionNarrativa ? '<span><strong>Aparicion narrativa:</strong> ' + esc(e.ubicacionNarrativa) + '</span>' : '') +
                        '<button class="plaza-btn-mini borrar" style="margin-left:auto;">Borrar</button>' +
                    '</div>';
                div.querySelector(".borrar").addEventListener("click", function(){
                    if (!confirm("Borrar evento?")) return;
                    self.eventos = self.eventos.filter(function(x){ return x.id !== e.id; });
                    escribir(K, self.eventos);
                    self.pintar();
                });
                cont.appendChild(div);
            });
        }
    };

    window.LitteraTimeline = T;
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("tl-eventos")) T.init();
    });
})();
