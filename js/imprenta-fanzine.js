// ============================================
// LITTERA v5.1 - Imposicion de fanzine en A4
// Coloca 4 paginas A5 por hoja A4 (saddle stitch)
// ============================================
(function () {
    "use strict";

    function esc(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // Calcula el orden de imposicion saddle stitch
    // Para N paginas (multiplo de 4):
    // Hoja 1 frente: [N, 1]
    // Hoja 1 dorso:  [2, N-1]
    // Hoja 2 frente: [N-2, 3]
    // Hoja 2 dorso:  [4, N-3]
    // ...
    function calcularImposicion(totalPaginas) {
        // Asegurar multiplo de 4
        var total = Math.ceil(totalPaginas / 4) * 4;
        var hojas = [];
        var mitad = total / 2;

        for (var i = 0; i < total / 4; i++) {
            var izqFrente = total - i * 2;
            var derFrente = 1 + i * 2;
            var izqDorso = 2 + i * 2;
            var derDorso = total - 1 - i * 2;
            hojas.push({
                frente: [izqFrente, derFrente],
                dorso: [izqDorso, derDorso]
            });
        }
        return hojas;
    }

    function construirHTMLFanzine(obra, config) {
        var paginasTexto = [];
        if (obra.paginas && obra.paginas.length) {
            obra.paginas.forEach(function(p) {
                paginasTexto.push(p.texto || "");
            });
        } else {
            paginasTexto.push("(Sin contenido)");
        }

        // Ajustar al multiplo de 4
        var totalPag = Math.ceil(paginasTexto.length / 4) * 4;
        while (paginasTexto.length < totalPag) paginasTexto.push("");

        var imposicion = calcularImposicion(totalPag);

        var css =
            '@page { size: 210mm 297mm; margin: 0; }' +
            'html, body { margin: 0; padding: 0; background: white; font-family: "EB Garamond", Georgia, serif; color: #1B1712; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
            '.hoja { width: 210mm; height: 297mm; page-break-after: always; break-after: page; position: relative; display: flex; }' +
            '.hoja:last-child { page-break-after: auto; break-after: auto; }' +
            '.carilla { width: 105mm; height: 148.5mm; padding: 10mm 8mm; box-sizing: border-box; position: relative; overflow: hidden; display: flex; flex-direction: column; }' +
            '.carilla.frente-izq { border-right: 1px dashed #ccc; }' +
            '.carilla.frente-der { border-left: 1px dashed #ccc; }' +
            '.carilla.dorso-izq { border-right: 1px dashed #ccc; }' +
            '.carilla.dorso-der { border-left: 1px dashed #ccc; }' +
            '.par-impar { display: flex; align-items: center; justify-content: center; }' +
            '.num-pag { position: absolute; bottom: 4mm; left: 0; right: 0; text-align: center; font-family: "JetBrains Mono", monospace; font-size: 8pt; color: #7A736A; letter-spacing: 0.1em; }' +
            '.contenido { font-family: "EB Garamond", Georgia, serif; font-size: 11pt; line-height: 1.5; text-align: justify; hyphens: auto; }' +
            '.portada-cont { font-family: "Instrument Serif", "EB Garamond", Georgia, serif; font-style: italic; font-size: 20pt; text-align: center; line-height: 1.2; letter-spacing: -0.02em; }' +
            /* Marcas de corte y doblez */
            '.marca-doblez { position: absolute; left: 50%; top: 0; bottom: 0; width: 0; border-left: 1px dashed #999; pointer-events: none; }' +
            '.marca-corte { position: absolute; width: 4mm; height: 1px; background: #000; }' +
            '.marca-corte.top-left { top: 0; left: 0; }' +
            '.marca-corte.top-right { top: 0; right: 0; }' +
            '.marca-corte.bottom-left { bottom: 0; left: 0; }' +
            '.marca-corte.bottom-right { bottom: 0; right: 0; }';

        var cuerpo = '';

        // Si hay portada, sale como la primera pagina del frente de la hoja externa.
        // Imposicion saddle stitch: la primera carilla es la ultima pagina (contratapa), la segunda es la portada.
        imposicion.forEach(function(hoja, idx) {
            // Frente
            cuerpo += '<section class="hoja">';
            cuerpo += construirCarilla(paginasTexto, hoja.frente[0], "frente-izq", idx === 0 && hoja.frente[0] === 1);
            cuerpo += construirCarilla(paginasTexto, hoja.frente[1], "frente-der", idx === 0 && hoja.frente[1] === 1);
            cuerpo += '<div class="marca-doblez"></div>';
            cuerpo += '<div class="marca-corte top-left"></div>';
            cuerpo += '<div class="marca-corte top-right"></div>';
            cuerpo += '<div class="marca-corte bottom-left"></div>';
            cuerpo += '<div class="marca-corte bottom-right"></div>';
            cuerpo += '</section>';

            // Dorso
            cuerpo += '<section class="hoja">';
            cuerpo += construirCarilla(paginasTexto, hoja.dorso[0], "dorso-izq", false);
            cuerpo += construirCarilla(paginasTexto, hoja.dorso[1], "dorso-der", false);
            cuerpo += '<div class="marca-doblez"></div>';
            cuerpo += '<div class="marca-corte top-left"></div>';
            cuerpo += '<div class="marca-corte top-right"></div>';
            cuerpo += '<div class="marca-corte bottom-left"></div>';
            cuerpo += '<div class="marca-corte bottom-right"></div>';
            cuerpo += '</section>';
        });

        return '<!DOCTYPE html><html lang="es"><head>' +
            '<meta charset="UTF-8">' +
            '<title>Fanzine - ' + esc(obra.titulo || "Sin titulo") + '</title>' +
            '<link rel="preconnect" href="https://fonts.googleapis.com">' +
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
            '<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">' +
            '<style>' + css + '</style>' +
            '</head><body>' + cuerpo + '</body></html>';
    }

    function construirCarilla(paginas, numPagina, clase, esPortada) {
        if (numPagina < 1 || numPagina > paginas.length) {
            return '<div class="carilla ' + clase + '"></div>';
        }
        var texto = paginas[numPagina - 1] || "";
        var claseCont = esPortada ? "portada-cont" : "contenido";
        var textoHTML = esc(texto).replace(/\n/g, "<br>");
        return '<div class="carilla ' + clase + '">' +
            '<div class="' + claseCont + '">' + textoHTML + '</div>' +
            '<div class="num-pag">' + numPagina + '</div>' +
        '</div>';
    }

    // Hook: interceptar la exportacion
    function instalar() {
        if (!window.LitteraImprenta) return;
        var Imp = window.LitteraImprenta;
        if (Imp._fanzineInstalado) return;

        var original = Imp.construirHTMLLibro;
        Imp.construirHTMLLibro = function () {
            var o = this.obraActual;
            if (o && o.tipo === "fanzine" && (this.config.papel === "a4" || this.config.papel === "carta")) {
                return construirHTMLFanzine(o, this.config);
            }
            return original.call(this);
        };

        Imp._fanzineInstalado = true;
        console.log("Imposicion de fanzine instalada");
    }

    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(instalar, 500);
    });

    window.LitteraFanzine = {
        construirHTML: construirHTMLFanzine,
        calcularImposicion: calcularImposicion
    };
})();
