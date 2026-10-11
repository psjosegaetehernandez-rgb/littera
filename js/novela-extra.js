// ============================================
// LITTERA v5.1 - Paneles de Personajes y
// Timeline vinculados a la novela activa
// ============================================
(function () {
    "use strict";

    var K_PJ = "littera.personajes";
    var K_TL = "littera.timeline";

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

    function obraIdActual() {
        if (window.LitteraTaller && window.LitteraTaller.obraId) return window.LitteraTaller.obraId;
        if (window.LitteraTaller && window.LitteraTaller.obra) return window.LitteraTaller.obra.id;
        return null;
    }

    function inyectarPaneles() {
        var novelaMain = document.querySelector(".novela-main");
        if (!novelaMain) return;
        if (document.getElementById("nv-paneles")) return;

        var cont = document.createElement("div");
        cont.className = "nv-paneles";
        cont.id = "nv-paneles";
        cont.innerHTML =
            '<div class="nv-panel">' +
                '<div class="nv-panel-header">' +
                    '<span class="nv-panel-titulo">Personajes</span>' +
                    '<button class="btn btn-secundario" id="nv-add-pj" style="font-size:11px;padding:4px 8px;">+ Anadir</button>' +
                '</div>' +
                '<div class="nv-panel-lista" id="nv-pj-lista"></div>' +
            '</div>' +
            '<div class="nv-panel">' +
                '<div class="nv-panel-header">' +
                    '<span class="nv-panel-titulo">Timeline</span>' +
                    '<button class="btn btn-secundario" id="nv-add-ev" style="font-size:11px;padding:4px 8px;">+ Evento</button>' +
                '</div>' +
                '<div class="nv-panel-lista" id="nv-ev-lista"></div>' +
            '</div>';
        novelaMain.appendChild(cont);

        document.getElementById("nv-add-pj").addEventListener("click", agregarPJ);
        document.getElementById("nv-add-ev").addEventListener("click", agregarEvento);

        pintarPJ();
        pintarEventos();
    }

    function pintarPJ() {
        var lista = document.getElementById("nv-pj-lista");
        if (!lista) return;
        var todos = leer(K_PJ, []);
        var oid = obraIdActual();
        var mios = oid ? todos.filter(function(p) { return p.obraId === oid; }) : todos;

        if (!mios.length) {
            lista.innerHTML = '<div class="nv-panel-vacio">Sin personajes aun. Anade el primero.</div>';
            return;
        }
        lista.innerHTML = "";
        mios.forEach(function(p) {
            var div = document.createElement("div");
            div.className = "nv-item";
            var inicial = (p.nombre || "?").trim().charAt(0).toUpperCase() || "?";
            div.innerHTML =
                '<span class="nv-avatar">' + esc(inicial) + '</span>' +
                '<span class="nv-titulo">' + esc(p.nombre) + '</span>' +
                '<span class="nv-meta">' + esc(p.rol || "") + '</span>';
            div.addEventListener("click", function() {
                localStorage.setItem("littera.personajes.ir", p.id);
                var b = document.querySelector('.nav-item[data-mundo="personajes"]');
                if (b) b.click();
            });
            lista.appendChild(div);
        });
    }

    function pintarEventos() {
        var lista = document.getElementById("nv-ev-lista");
        if (!lista) return;
        var todos = leer(K_TL, []);
        var oid = obraIdActual();
        var mios = oid ? todos.filter(function(e) { return e.obraId === oid; }) : todos;

        if (!mios.length) {
            lista.innerHTML = '<div class="nv-panel-vacio">Sin eventos aun. Anade el primero.</div>';
            return;
        }
        mios.sort(function(a, b) {
            return (a.fechaInterna || "").localeCompare(b.fechaInterna || "");
        });
        lista.innerHTML = "";
        mios.forEach(function(e) {
            var div = document.createElement("div");
            div.className = "nv-item";
            div.innerHTML =
                '<span class="nv-titulo">' + esc(e.titulo) + '</span>' +
                '<span class="nv-evento-fecha">' + esc(e.fechaInterna || "?") + '</span>';
            div.addEventListener("click", function() {
                var b = document.querySelector('.nav-item[data-mundo="timeline"]');
                if (b) b.click();
            });
            lista.appendChild(div);
        });
    }

    function agregarPJ() {
        var nombre = prompt("Nombre del personaje:");
        if (!nombre) return;
        var rol = prompt("Rol (protagonista / antagonista / secundario):", "secundario") || "secundario";
        var todos = leer(K_PJ, []);
        var oid = obraIdActual();
        var nuevo = {
            id: uid(),
            nombre: nombre,
            rol: rol,
            obraId: oid || null,
            edad: "", lugar: "", apariencia: "", biografia: "",
            deseo: "", miedo: "", contradiccion: "",
            arquetipo: "", voz: "", muletillas: "",
            relaciones: []
        };
        todos.push(nuevo);
        localStorage.setItem(K_PJ, JSON.stringify(todos));
        pintarPJ();
    }

    function agregarEvento() {
        var titulo = prompt("Titulo del evento:");
        if (!titulo) return;
        var fecha = prompt("Fecha interna (YYYY-MM-DD):", "") || "";
        var ubic = prompt("Aparece en el capitulo:", "") || "";
        var todos = leer(K_TL, []);
        var oid = obraIdActual();
        todos.push({
            id: uid(),
            titulo: titulo,
            fechaInterna: fecha,
            ubicacionNarrativa: ubic,
            descripcion: "",
            obraId: oid || null
        });
        localStorage.setItem(K_TL, JSON.stringify(todos));
        pintarEventos();
    }

    // Observar cuando el panel de novela se activa
    function vigilar() {
        var panelNovela = document.querySelector('[data-panel="novela"]');
        if (!panelNovela) return;
        var obs = new MutationObserver(function() {
            if (panelNovela.classList.contains("activo")) {
                setTimeout(inyectarPaneles, 150);
            }
        });
        obs.observe(panelNovela, { attributes: true, attributeFilter: ["class"] });
        if (panelNovela.classList.contains("activo")) {
            setTimeout(inyectarPaneles, 300);
        }
    }

    document.addEventListener("DOMContentLoaded", vigilar);

    window.LitteraNovelaExtra = {
        pintarPJ: pintarPJ,
        pintarEventos: pintarEventos,
        inyectar: inyectarPaneles
    };
})();
