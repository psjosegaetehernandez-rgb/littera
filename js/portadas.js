// ============================================
// LITTERA v5.3 - Sistema de Portadas
// ============================================
(function () {
    "use strict";

    var K_OBRAS = "littera.obras";
    var K_POSICION = "littera.portadas.posicion";

    function leer(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch(e) { return d; } }
    function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }
    function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function toast(m) {
        var c = document.getElementById("toasts"); if (!c) return;
        var t = document.createElement("div");
        t.className = "toast exito";
        t.innerHTML = "<span>" + esc(m) + "</span>";
        c.appendChild(t);
        setTimeout(function(){ t.classList.add("saliendo"); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 260); }, 2200);
    }

    // ---------- Cache de imagenes cargadas como dataURL ----------
    var cacheDataURL = {};

    function rutaPortada(archivo) {
        // Ruta relativa desde la raiz del proyecto
        return "assets/portadas/" + archivo;
    }

    // ---------- Obtener/Set portada de una obra ----------
    function getPortada(obraId) {
        var obras = leer(K_OBRAS, []);
        var o = obras.find(function(x){ return x.id === obraId; });
        return o ? (o.portada || null) : null;
    }

    function setPortada(obraId, archivo) {
        var obras = leer(K_OBRAS, []);
        var idx = obras.findIndex(function(x){ return x.id === obraId; });
        if (idx < 0) return false;
        if (archivo) obras[idx].portada = archivo;
        else delete obras[idx].portada;
        return escribir(K_OBRAS, obras);
    }

    // ---------- Cargar imagen como dataURL (para el PDF) ----------
    function cargarComoDataURL(archivo) {
        return new Promise(function(resolve) {
            if (cacheDataURL[archivo]) {
                resolve(cacheDataURL[archivo]);
                return;
            }
            var img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() {
                try {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    var dataUrl = canvas.toDataURL("image/jpeg", 0.88);
                    cacheDataURL[archivo] = dataUrl;
                    resolve(dataUrl);
                } catch (e) {
                    console.warn("No se pudo convertir la imagen:", e);
                    resolve(rutaPortada(archivo));
                }
            };
            img.onerror = function() {
                resolve(null);
            };
            img.src = rutaPortada(archivo);
        });
    }

    // ---------- Abrir galeria ----------
    function abrirGaleria() {
        var obras = leer(K_OBRAS, []);
        var obraActual = null;
        if (window.LitteraImprenta && window.LitteraImprenta.obraActual) {
            obraActual = window.LitteraImprenta.obraActual;
        }
        if (!obraActual) {
            toast("Elige una obra primero");
            return;
        }

        var portadaActual = obraActual.portada || null;
        var lista = window.LITTERA_PORTADAS || [];

        var overlay = document.createElement("div");
        overlay.className = "galeria-overlay";

        var html = '<div class="galeria-modal">';
        html += '<div class="galeria-cabecera">';
        html += '<div>';
        html += '<div class="galeria-titulo">Elige una portada</div>';
        html += '<div class="galeria-subtitulo">' + esc(obraActual.titulo || "Sin titulo") + ' &middot; ' + lista.length + ' portadas disponibles</div>';
        html += '</div>';
        html += '<button class="galeria-cerrar" title="Cerrar">';
        html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        html += '</button>';
        html += '</div>';

        html += '<div class="galeria-grid">';

        // Opcion "sin portada"
        html += '<div class="galeria-item' + (!portadaActual ? ' asignada' : '') + '" data-archivo="">';
        html += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-sunken);color:var(--fg-subtle);font-family:var(--f-titulo);font-style:italic;font-size:13px;text-align:center;padding:20px;">Portada tipografica<br><span style="font-family:var(--f-mono);font-size:10px;opacity:0.7;margin-top:6px;letter-spacing:0.05em;">Sin imagen</span></div>';
        html += '<div class="galeria-item-info"><div class="galeria-item-nombre">Sin imagen</div><div class="galeria-item-uso">Solo texto, la portada clasica de Littera</div></div>';
        html += '<div class="galeria-item-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
        html += '</div>';

        lista.forEach(function(p) {
            var asignada = (p.archivo === portadaActual) ? " asignada" : "";
            html += '<div class="galeria-item' + asignada + '" data-archivo="' + esc(p.archivo) + '">';
            html += '<img src="' + esc(rutaPortada(p.archivo)) + '" alt="' + esc(p.nombre) + '" loading="lazy">';
            html += '<div class="galeria-item-info">';
            html += '<div class="galeria-item-nombre">' + esc(p.nombre) + '</div>';
            html += '<div class="galeria-item-uso">' + esc(p.uso || "") + '</div>';
            html += '</div>';
            html += '<div class="galeria-item-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
            html += '</div>';
        });

        html += '</div></div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        function cerrar() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }

        overlay.querySelector(".galeria-cerrar").addEventListener("click", cerrar);
        overlay.addEventListener("click", function(e) {
            if (e.target === overlay) cerrar();
        });
        document.addEventListener("keydown", function esc2(e) {
            if (e.key === "Escape") { cerrar(); document.removeEventListener("keydown", esc2); }
        });

        overlay.querySelectorAll(".galeria-item").forEach(function(el) {
            el.addEventListener("click", function() {
                var archivo = el.dataset.archivo || null;
                if (setPortada(obraActual.id, archivo)) {
                    // Actualizar la obra en memoria
                    if (archivo) {
                        obraActual.portada = archivo;
                        toast("Portada asignada");
                    } else {
                        delete obraActual.portada;
                        toast("Portada quitada");
                    }
                    // Re-render
                    if (window.LitteraImprenta && window.LitteraImprenta.renderPreview) {
                        window.LitteraImprenta.renderPreview();
                    }
                    actualizarPanel();
                    cerrar();
                }
            });
        });
    }

    // ---------- Panel en la Imprenta ----------
    function inyectarPanel() {
        var impPanel = document.querySelector(".imp-panel");
        if (!impPanel) return;
        if (document.getElementById("imp-portada-panel")) return;

        var cont = document.createElement("div");
        cont.className = "imp-grupo";
        cont.id = "imp-portada-panel";
        cont.innerHTML =
            '<div class="imp-grupo-titulo">Portada</div>' +
            '<div id="imp-portada-contenido"></div>' +
            '<button class="btn btn-secundario" id="imp-elegir-portada" style="width:100%;margin-top:8px;">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
                'Elegir portada' +
            '</button>';

        // Insertar despues del grupo de "Obra"
        var primerGrupo = impPanel.querySelector(".imp-grupo");
        if (primerGrupo && primerGrupo.nextSibling) {
            impPanel.insertBefore(cont, primerGrupo.nextSibling);
        } else {
            impPanel.appendChild(cont);
        }

        document.getElementById("imp-elegir-portada").addEventListener("click", abrirGaleria);
        actualizarPanel();
    }

    function actualizarPanel() {
        var contenido = document.getElementById("imp-portada-contenido");
        if (!contenido) return;
        var obraActual = (window.LitteraImprenta && window.LitteraImprenta.obraActual) || null;
        if (!obraActual) {
            contenido.innerHTML = '<div style="font-size:12.5px;color:var(--fg-subtle);font-style:italic;">Elige una obra para asignar portada.</div>';
            return;
        }
        var archivo = obraActual.portada;
        if (!archivo) {
            contenido.innerHTML =
                '<div class="imp-portada-actual">' +
                    '<div class="imp-portada-thumb sin-imagen">SIN<br>PORTADA</div>' +
                    '<div class="imp-portada-info">' +
                        '<div class="imp-portada-nombre">Portada tipografica</div>' +
                        '<div class="imp-portada-uso">Solo texto, la portada clasica de Littera</div>' +
                    '</div>' +
                '</div>';
            return;
        }
        var p = (window.LITTERA_PORTADAS || []).find(function(x){ return x.archivo === archivo; });
        var nombre = p ? p.nombre : archivo;
        var uso = p ? p.uso : "";
        var posicion = leer(K_POSICION + "." + obraActual.id, "centro");

        contenido.innerHTML =
            '<div class="imp-portada-actual">' +
                '<div class="imp-portada-thumb" style="background-image: url(\'' + rutaPortada(archivo) + '\')"></div>' +
                '<div class="imp-portada-info">' +
                    '<div class="imp-portada-nombre">' + esc(nombre) + '</div>' +
                    '<div class="imp-portada-uso">' + esc(uso) + '</div>' +
                    '<div class="imp-portada-botones">' +
                        '<button class="quitar" id="imp-quitar-portada">Quitar</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:10px;">' +
                '<label style="font-family:var(--f-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:var(--fg-subtle);font-weight:500;display:block;margin-bottom:6px;">Posicion del titulo</label>' +
                '<div class="portada-posicion">' +
                    '<button class="portada-pos-btn' + (posicion === "arriba" ? " activo" : "") + '" data-pos="arriba">Arriba</button>' +
                    '<button class="portada-pos-btn' + (posicion === "centro" ? " activo" : "") + '" data-pos="centro">Centro</button>' +
                    '<button class="portada-pos-btn' + (posicion === "abajo" ? " activo" : "") + '" data-pos="abajo">Abajo</button>' +
                '</div>' +
            '</div>';

        var q = document.getElementById("imp-quitar-portada");
        if (q) q.addEventListener("click", function() {
            if (!confirm("Quitar la portada de esta obra?")) return;
            setPortada(obraActual.id, null);
            delete obraActual.portada;
            if (window.LitteraImprenta && window.LitteraImprenta.renderPreview) {
                window.LitteraImprenta.renderPreview();
            }
            actualizarPanel();
            toast("Portada quitada");
        });

        contenido.querySelectorAll(".portada-pos-btn").forEach(function(b) {
            b.addEventListener("click", function() {
                var pos = b.dataset.pos;
                escribir(K_POSICION + "." + obraActual.id, pos);
                contenido.querySelectorAll(".portada-pos-btn").forEach(function(x) {
                    x.classList.toggle("activo", x === b);
                });
                if (window.LitteraImprenta && window.LitteraImprenta.renderPreview) {
                    window.LitteraImprenta.renderPreview();
                }
            });
        });
    }

    function getPosicion(obraId) {
        return leer(K_POSICION + "." + obraId, "centro");
    }

    // ---------- Hook sobre la Imprenta ----------
    function instalar() {
        var Imp = window.LitteraImprenta;
        if (!Imp) {
            setTimeout(instalar, 300);
            return;
        }
        if (Imp._portadasInstaladas) return;

        // Hook sobre renderPreview para inyectar el panel la primera vez
        var originalRender = Imp.renderPreview;
        Imp.renderPreview = function() {
            originalRender.call(this);
            // Inyectar el panel si no esta
            setTimeout(inyectarPanel, 50);
            // Actualizar el panel si ya esta
            setTimeout(actualizarPanel, 60);
            // Reemplazar la portada si esta asignada
            setTimeout(reemplazarPortadaEnPreview, 100);
        };

        // Hook sobre construirHTMLLibro (exportacion)
        var originalConstruir = Imp.construirHTMLLibro;
        Imp.construirHTMLLibro = function() {
            var html = originalConstruir.call(this);
            return html; // la portada se reemplaza despues, async
        };

        // Hook sobre exportarPDF (async)
        var originalExportar = Imp.exportarPDF;
        Imp.exportarPDF = function() {
            var self = this;
            var o = self.obraActual;
            if (o && o.portada) {
                // Reemplazar portada en el HTML exportado con dataURL
                cargarComoDataURL(o.portada).then(function(dataUrl) {
                    var originalHTMLBuilder = self.construirHTMLLibro;
                    // Hack: sobrescribir temporalmente construirHTMLLibro para usar dataUrl
                    self._portadaDataUrl = dataUrl;
                    var html = self.construirHTMLLibro();
                    self._portadaDataUrl = null;
                    // Buscar la seccion portada y reemplazarla
                    var portadaOriginal = self._ultimaPortadaOriginal;
                    if (portadaOriginal && html.indexOf(portadaOriginal) >= 0) {
                        var nuevaPortada = construirPortadaConImagenHTML(self, dataUrl, getPosicion(o.id));
                        html = html.replace(portadaOriginal, nuevaPortada);
                    }
                    imprimir(html);
                });
            } else {
                originalExportar.call(self);
            }
        };

        Imp._portadasInstaladas = true;
    }

    // ---------- Reemplazar portada en el preview del DOM ----------
    function reemplazarPortadaEnPreview() {
        var Imp = window.LitteraImprenta;
        if (!Imp || !Imp.obraActual || !Imp.obraActual.portada) return;
        var archivo = Imp.obraActual.portada;
        var posicion = getPosicion(Imp.obraActual.id);
        var portadaActual = document.querySelector('#imp-vista .imp-pagina.tipo-portada');
        if (!portadaActual) return;

        var titulo = Imp.config.tituloOverride || Imp.obraActual.titulo || "Sin titulo";
        var subtitulo = Imp.config.subtitulo || "";
        var autor = Imp.config.autor || "Anonimo";

        // Reemplazar contenido del div
        portadaActual.classList.remove("tipo-portada");
        portadaActual.classList.add("tipo-portada-imagen");

        var html = '';
        html += '<div class="pt-imagen" style="background-image: url(\'' + rutaPortada(archivo) + '\')"></div>';
        html += '<div class="pt-overlay pos-' + posicion + '">';
        html += '<div class="pt-fondo-texto">';
        html += '<div class="pt-titulo">' + esc(titulo) + '</div>';
        if (subtitulo) html += '<div class="pt-subtitulo">' + esc(subtitulo) + '</div>';
        html += '<div class="pt-autor">' + esc(autor) + '</div>';
        html += '</div></div>';

        portadaActual.innerHTML = html;
    }

    // ---------- Construir HTML de portada con imagen (para el PDF) ----------
    function construirPortadaConImagenHTML(Imp, dataUrl, posicion) {
        var o = Imp.obraActual;
        var titulo = Imp.config.tituloOverride || (o && o.titulo) || "Sin titulo";
        var subtitulo = Imp.config.subtitulo || "";
        var autor = Imp.config.autor || "Anonimo";
        var genero = Imp.generoLegible ? Imp.generoLegible(o ? o.tipo : "prosa") : "";

        var justify = posicion === "arriba" ? "flex-start" : (posicion === "abajo" ? "flex-end" : "center");
        var paddingV = posicion === "centro" ? "15%" : "20%";

        var html = '';
        html += '<section class="pagina portada-imagen" style="padding: 0; position: relative; overflow: hidden; background: #000;">';
        html += '<div style="position: absolute; inset: 0; background-image: url(\'' + dataUrl + '\'); background-size: cover; background-position: center;"></div>';
        html += '<div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: ' + justify + '; align-items: center; padding: ' + paddingV + ' 12%; text-align: center; z-index: 2;">';
        html += '<div style="background: rgba(252, 250, 244, 0.92); padding: 24px 28px; border-radius: 3px; box-shadow: 0 6px 24px rgba(0,0,0,0.2); max-width: 82%;">';
        html += '<div style="font-family: \'Instrument Serif\', \'EB Garamond\', serif; font-style: italic; font-size: 30pt; line-height: 1.1; letter-spacing: -0.025em; color: #0B0907; margin-bottom: 0.4em; font-weight: 400;">' + esc(titulo) + '</div>';
        if (subtitulo) html += '<div style="font-family: \'EB Garamond\', serif; font-style: italic; font-size: 13pt; color: #38302A; margin-bottom: 1em;">' + esc(subtitulo) + '</div>';
        html += '<div style="font-family: \'Inter\', sans-serif; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.2em; color: #38302A; font-weight: 500;">' + esc(autor) + '</div>';
        html += '</div></div></section>';
        return html;
    }

    // ---------- Imprimir (reutiliza la logica de la Imprenta) ----------
    function imprimir(html) {
        var iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.style.opacity = "0";
        document.body.appendChild(iframe);

        var doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        setTimeout(function() {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } catch(e) {
                toast("Permite ventanas emergentes para imprimir");
            }
            setTimeout(function() {
                if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
            }, 60000);
        }, 1200);
    }

    // ---------- Tambien reemplazar en la exportacion normal ----------
    function parchearConstruir() {
        var Imp = window.LitteraImprenta;
        if (!Imp || Imp._portadaConstruirParcheada) return;

        var original = Imp.construirHTMLLibro;
        Imp.construirHTMLLibro = function() {
            var self = this;
            var html = original.call(self);
            var o = self.obraActual;
            if (!o || !o.portada) return html;

            // Guardar el HTML original de la seccion portada para reemplazar despues
            var match = html.match(/<section class="pagina portada">[\s\S]*?<\/section>/);
            if (match) {
                self._ultimaPortadaOriginal = match[0];
            }
            // Si tenemos dataUrl (async), reemplazar aqui
            if (self._portadaDataUrl) {
                var nuevaPortada = construirPortadaConImagenHTML(self, self._portadaDataUrl, getPosicion(o.id));
                if (match) html = html.replace(match[0], nuevaPortada);
            }
            return html;
        };
        Imp._portadaConstruirParcheada = true;
    }

    // ---------- Inicializar ----------
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(instalar, 400);
        setTimeout(parchearConstruir, 500);
    });

    window.LitteraPortadas = {
        abrir: abrirGaleria,
        getPortada: getPortada,
        setPortada: setPortada,
        getPosicion: getPosicion,
        cargarComoDataURL: cargarComoDataURL,
        rutaPortada: rutaPortada,
        construirPortadaConImagenHTML: construirPortadaConImagenHTML
    };
})();
