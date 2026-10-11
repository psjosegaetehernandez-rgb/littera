// ============================================
// LITTERA v5 - Contenido ampliado con niveles
// 60 fichas nuevas + sistema de niveles
// ============================================
(function () {
    "use strict";
    if (!window.LITTERA_CONTENIDO) return;

    // Niveles de dificultad
    window.LITTERA_NIVELES = {
        basico:     { nombre: "Basico",     xp: 10, color: "#7A8B5C", desc: "Definiciones simples, ejemplos claros" },
        medio:      { nombre: "Intermedio", xp: 20, color: "#3B4A6B", desc: "Combinaciones, analisis, matices" },
        avanzado:   { nombre: "Avanzado",   xp: 30, color: "#8B2E2E", desc: "Teoria profunda, aplicaciones" },
        intensivo:  { nombre: "Intensivo",  xp: 50, color: "#6B4F6E", desc: "Filosofia, critica, sintesis" }
    };

    var NUEVAS = [
        // ============================================================
        // FIGURAS RETORICAS - NIVEL BASICO
        // ============================================================
        { id: "epistrofe", categoria: "diccion", nivel: "basico", termino: "Epistrofe",
          etimologia: "Del griego epistrophé: 'conversion', 'retorno'.",
          definicion: "Repeticion de una o varias palabras al final de varios enunciados seguidos.",
          ejemplo: "«Y todo por ti, la luz por ti, la sombra por ti.»",
          fuente: "Uso poetico contemporaneo",
          efecto: "Crea insistencia, obsesion, hipnosis. Es el eco que regresa.",
          relacionados: ["anafora", "regresion"], autores: ["Becquer", "Neruda"] },

        { id: "epizeuxis", categoria: "diccion", nivel: "basico", termino: "Epizeuxis",
          etimologia: "Del griego epizeuxis: 'union estrecha'.",
          definicion: "Repeticion inmediata de una palabra sin nada entre medio. El golpe vuelve a caer.",
          ejemplo: "«Nada, nada, nada, nada.» / «Ven, ven, ven.»",
          fuente: "Uso poetico y dramatico",
          efecto: "Intensifica, angustia, apremia. Es la figura de la insistencia pura.",
          relacionados: ["anafora", "epistrofe"], autores: ["Shakespeare", "Lorca"] },

        { id: "aliteracion", categoria: "diccion", nivel: "basico", termino: "Aliteracion",
          etimologia: "Del latin allitteratio: 'repeticion de letras'.",
          definicion: "Repeticion de un mismo sonido consonantico al inicio de palabras cercanas.",
          ejemplo: "«El ruido con que rueda la ronca tempestad.»",
          fuente: "Jose Zorrilla",
          efecto: "Crea musica, textura, memoria sonora. El poema se vuelve cuerpo.",
          relacionados: ["onomatopeya", "sinestesia"], autores: ["Zorrilla", "Dario"] },

        { id: "onomatopeya", categoria: "diccion", nivel: "basico", termino: "Onomatopeya",
          etimologia: "Del griego onomatopoiía: 'creacion de nombres'.",
          definicion: "Palabra que imita el sonido de lo que designa. El significante es el sonido.",
          ejemplo: "«El tic-tac del reloj» / «el zigzag del rayo» / «el susurro».",
          fuente: "Uso universal",
          efecto: "Ancla el texto en el cuerpo. Hace audible lo que de otro modo seria abstracto.",
          relacionados: ["aliteracion"], autores: ["Virgilio", "Pound"] },

        { id: "calambur", categoria: "diccion", nivel: "basico", termino: "Calambur",
          etimologia: "Voz francesa, probablemente de calembour.",
          definicion: "Juego de palabras que, agrupando de distinta manera las silabas, produce sentidos distintos.",
          ejemplo: "«Oro parece, plata no es.» / «Entre el clavel blanco y la rosa roja, su majestad escoja.»",
          fuente: "Tradicion popular y culterana",
          efecto: "Provoca risa, agudeza, iluminacion subita. La lengua se dobla sobre si misma.",
          relacionados: ["retruecano", "paronomasia"], autores: ["Quevedo", "Gongora"] },

        { id: "paronomasia", categoria: "diccion", nivel: "basico", termino: "Paronomasia",
          etimologia: "Del griego paronomasía: 'juego de nombres'.",
          definicion: "Uso cercano de dos palabras de sonido parecido pero significado distinto.",
          ejemplo: "«La vida es una lata / que se abre con la esperanza.» / «Ata la barca, / la baraca se ata.»",
          fuente: "Uso poetico y publicitario",
          efecto: "Genera resonancia, humor, juego. Las palabras se llaman entre si por su sonido.",
          relacionados: ["calambur", "aliteracion"], autores: ["Valle-Inclan", "Cortazar"] },

        // ============================================================
        // FIGURAS RETORICAS - NIVEL MEDIO
        // ============================================================
        { id: "zeugma", categoria: "pensamiento", nivel: "medio", termino: "Zeugma",
          etimologia: "Del griego zeûgma: 'union', 'yugo'.",
          definicion: "Verbo que rige varios complementos, pero solo concuerda con uno de ellos, sobreentendiendose en los demas.",
          ejemplo: "«Yo tengo una casa / y tu, un corazon sin puertas.»",
          fuente: "Uso poetico clasico y moderno",
          efecto: "Sobrentiende para ahorrar y a la vez subrayar. La elipsis concentra el golpe.",
          relacionados: ["elipsis", "silepsis"], autores: ["Virgilio", "Machado"] },

        { id: "pretericion", categoria: "pensamiento", nivel: "medio", termino: "Pretericion",
          etimologia: "Del latin praeteritio: 'accion de pasar por alto'.",
          definicion: "Declarar que se omite algo que, precisamente al declararlo, se dice. Finge silencio para hablar mas fuerte.",
          ejemplo: "«No te dire que me abandonaste, ni que lloraste sin motivo, ni que mentiste.»",
          fuente: "Retorica clasica",
          efecto: "Sugiere mucho diciendo poco. Es la ironia del silencio.",
          relacionados: ["ironia", "litote"], autores: ["Cicerón", "Quevedo"] },

        { id: "litote", categoria: "pensamiento", nivel: "medio", termino: "Litote",
          etimologia: "Del griego litótes: 'sencillez'.",
          definicion: "Atenuacion: se afirma algo negando lo contrario. «No esta mal» por «esta bien».",
          ejemplo: "«No soy inocente» / «No es tonto» / «No era del todo feliz».",
          fuente: "Uso universal",
          efecto: "Contiene y a la vez libera. La negacion hace mas fuerte lo afirmado.",
          relacionados: ["pretericion", "ironia"], autores: ["Voltaire", "Proust"] },

        { id: "ironia", categoria: "pensamiento", nivel: "medio", termino: "Ironia",
          etimologia: "Del griego eironeía: 'disimulo', 'interrogacion'.",
          definicion: "Decir lo contrario de lo que se piensa, dejando que el tono o el contexto revelen la verdadera intencion.",
          ejemplo: "«Que bonito dia» dicho bajo la lluvia. / «Hernan Cortes, el conquistador amable.»",
          fuente: "Uso universal",
          efecto: "Crea complicidad con el lector, critica, distancia. Es la sonrisa del que sabe.",
          relacionados: ["litote", "sarcasmo"], autores: ["Socrates", "Kierkegaard"] },

        { id: "sinestesia", categoria: "pensamiento", nivel: "medio", termino: "Sinestesia",
          etimologia: "Del griego sýn: 'con' y aísthesis: 'sensacion'.",
          definicion: "Fusion de dos sentidos distintos en una sola imagen. Se oye un color, se ve un sonido.",
          ejemplo: "«Verde que te quiero verde» / «El perfume de la noche» / «Sonidos azules».",
          fuente: "Lorca, Baudelaire",
          efecto: "Rompe la logica sensorial, produce extraneza, fusion. El cuerpo piensa de otra manera.",
          relacionados: ["hipalage", "metafora"], autores: ["Baudelaire", "Rimbaud", "Lorca"] },

        { id: "antitesis", categoria: "pensamiento", nivel: "medio", termino: "Antitesis",
          etimologia: "Del griego antíthesis: 'oposicion'.",
          definicion: "Contraposicion de dos ideas o palabras de significado opuesto, en una misma frase.",
          ejemplo: "«Es tan corto el amor / y tan largo el olvido.»",
          fuente: "Pablo Neruda",
          efecto: "Ilumina por contraste. Cada termino explica al otro por su ausencia.",
          relacionados: ["oximoron", "paradoja"], autores: ["Neruda", "Quevedo"] },

        { id: "paradoja", categoria: "pensamiento", nivel: "medio", termino: "Paradoja",
          etimologia: "Del griego parádoxos: 'contrario a la opinion comun'.",
          definicion: "Afirmacion que contradice la logica comun pero que encierra una verdad mas profunda.",
          ejemplo: "«El que pierde su vida la gana» / «Solo se ve bien con el corazon.»",
          fuente: "Tradicion biblica y literaria",
          efecto: "Suspende el juicio, obliga a pensar. La contradiccion como forma de verdad.",
          relacionados: ["oximoron", "antitesis"], autores: ["San Juan", "Saint-Exupery"] },

        { id: "epifonema", categoria: "pensamiento", nivel: "medio", termino: "Epifonema",
          etimologia: "Del griego epiphonema: 'exclamacion final'.",
          definicion: "Exclamacion o sentencia que cierra un discurso o un fragmento, resumiendo su sentido.",
          ejemplo: "«...y sin embargo, se mueve.» (Galileo, tras explicar su teoria).",
          fuente: "Retorica clasica",
          efecto: "Cierra con fuerza, deja huella, resume. El texto se firma a si mismo.",
          relacionados: ["apostrofe", "sentencia"], autores: ["Cicerón", "Gracian"] },

        { id: "apostrofe", categoria: "pensamiento", nivel: "medio", termino: "Apostrofe",
          etimologia: "Del griego apostrophé: 'desvio', 'vuelta'.",
          definicion: "Interpelacion directa a una persona, cosa o idea, presente o ausente, real o imaginaria.",
          ejemplo: "«Oye, muerte, ¿por que me buscas?» / «Muerte, no me seas esquiva.»",
          fuente: "Manrique, uso universal",
          efecto: "Rompe la distancia, apela, dramatiza. El lector se siente invitado.",
          relacionados: ["epifonema", "invocacion"], autores: ["Manrique", "Neruda"] },

        { id: "reticencia", categoria: "pensamiento", nivel: "medio", termino: "Reticencia",
          etimologia: "Del latin reticentia: 'silencio', 'callar'.",
          definicion: "Interrumpir el discurso dejando incompleta una idea, con puntos suspensivos o un corte brusco.",
          ejemplo: "«Si yo te contara lo que paso aquella noche...»",
          fuente: "Uso universal",
          efecto: "Sugiere mas de lo que dice. El silencio se vuelve elocuente.",
          relacionados: ["pretericion", "elipsis"], autores: ["Chéjov", "Onetti"] },

        { id: "evocacion", categoria: "pensamiento", nivel: "medio", termino: "Evocacion",
          etimologia: "Del latin evocare: 'llamar fuera'.",
          definicion: "Traer al presente algo pasado o ausente mediante la palabra. No se describe: se convoca.",
          ejemplo: "«Aquel olor a pan de la casa de mi abuela» / «Aquel verano que ya no existe».",
          fuente: "Proust, tradicion lirica",
          efecto: "El tiempo se pliega. El lector tambien recuerda.",
          relacionados: ["anamnesis", "símbolo"], autores: ["Proust", "Borges"] },

        // ============================================================
        // LINGUISTICA - NIVEL MEDIO
        // ============================================================
        { id: "jakobson", categoria: "linguistica", nivel: "medio", termino: "Funciones del lenguaje (Jakobson)",
          etimologia: "Modelo de Roman Jakobson, 1960.",
          definicion: "Seis funciones segun el elemento dominante en la comunicacion: referencial (contexto), emotiva (emisor), conativa (receptor), fatica (contacto), metalinguistica (codigo), poetica (mensaje).",
          ejemplo: "Un manual de instrucciones es referencial. Un poema es poetico. Un «hola, ¿me escuchas?» es fatico.",
          fuente: "Jakobson, Linguistica y poetica (1960)",
          efecto: "Permite analizar cualquier texto segun su funcion dominante. Es una de las herramientas mas utiles del analisis literario.",
          relacionados: ["saussure", "comunicacion"], autores: ["Jakobson", "Buhler"] },

        { id: "sintagma-paradigma", categoria: "linguistica", nivel: "medio", termino: "Sintagma y paradigma",
          etimologia: "Del griego sýntagma: 'conjunto ordenado'; parádeigma: 'ejemplo'.",
          definicion: "Saussure distingue dos ejes: el sintagmatico (relaciones en presencia, la cadena hablada) y el paradigmatico (relaciones en ausencia, la serie de opciones que pudieron sustituir a cada elemento).",
          ejemplo: "«El perro ladra»: sintagma = cadena real. Paradigma de «perro» = gato, niño, viento... Todas las palabras que podrian haber estado y no estan.",
          fuente: "Saussure, Curso de linguistica general",
          efecto: "Explica por que la lengua es, a la vez, cadena y eleccion. La literatura es un arte del paradigma.",
          relacionados: ["saussure", "lengua-habla"], autores: ["Saussure", "Jakobson"] },

        { id: "marcado-no-marcado", categoria: "linguistica", nivel: "medio", termino: "Marcado y no marcado",
          etimologia: "Terminos de la linguistica estructural.",
          definicion: "En un par oposicional, el termino no marcado es el neutro, el general; el marcado es el especifico, el que se define por contraste.",
          ejemplo: "«alto/bajo»: alto es marcado, bajo puede ser neutro («¿que tan bajo es?»). «hombre/mujer»: durante siglos lo masculino funciono como no marcado («el hombre» por la humanidad).",
          fuente: "Troubetzkoy, Jakobson",
          efecto: "Revela ideologias en la lengua. Escribir es tambien decidir que marcar y que dejar neutro.",
          relacionados: ["saussure", "sociolinguistica"], autores: ["Jakobson", "Benveniste"] },

        // ============================================================
        // SEMIOTICA - NIVEL MEDIO
        // ============================================================
        { id: "lotman", categoria: "semiotica", nivel: "medio", termino: "Semiosfera (Lotman)",
          etimologia: "Del griego semeion: 'signo'; sphaíra: 'esfera'.",
          definicion: "Yuri Lotman propone que los signos no existen aislados: viven en una semiosfera, un espacio cultural donde los sistemas de signos se relacionan, se traducen, se contaminan.",
          ejemplo: "La poesia no significa sola: significa en el espacio cultural donde coexiste con la religion, la politica, el cine, la moda.",
          fuente: "Lotman, La semiosfera (1984)",
          efecto: "Amplia la semiotica a la cultura entera. Ningun texto es isla: todo texto es contacto.",
          relacionados: ["bajtin", "dialogismo"], autores: ["Lotman", "Uspenski"] },

        { id: "isotopia", categoria: "semiotica", nivel: "medio", termino: "Isotopia",
          etimologia: "Del griego ísos: 'igual'; tópos: 'lugar'.",
          definicion: "Greimas: repeticion de un mismo sema (unidad de significado) a lo largo de un texto, que da coherencia y permite la lectura.",
          ejemplo: "En un poema sobre el mar, palabras como ola, sal, horizonte, naufragio, espuma forman una isotopia marina.",
          fuente: "Greimas, Semantica estructural (1966)",
          efecto: "Explica por que un texto «se sostiene». La isotopia es la coherencia invisible.",
          relacionados: ["isotopia", "campo-semantico"], autores: ["Greimas", "Eco"] },

        { id: "contrato-lectura", categoria: "semiotica", nivel: "medio", termino: "Contrato de lectura",
          etimologia: "Del latin contractus: 'convenio'.",
          definicion: "El pacto implicito entre texto y lector. El texto promete un tipo de experiencia; el lector acepta esa promesa y la sostiene.",
          ejemplo: "Una novela policial promete un enigma que se resolvera. Un cuento fantastico promete una ruptura de las leyes naturales. Si no cumple, el lector se decepciona.",
          fuente: "Eco, Lejeune, tradicion semiotica",
          efecto: "Explica por que ciertos textos nos decepcionan. No cumplieron lo prometido.",
          relacionados: ["eco-lector", "genero"], autores: ["Eco", "Lejeune"] },

        // ============================================================
        // FILOSOFIA DEL LENGUAJE - NIVEL MEDIO
        // ============================================================
        { id: "performativo", categoria: "filosofia", nivel: "medio", termino: "Performativo (Austin)",
          etimologia: "Del ingles to perform: 'ejecutar', 'realizar'.",
          definicion: "Enunciado que no describe: hace. Su decir es un hacer. «Prometo», «juro», «bautizo» no informan: ejecutan.",
          ejemplo: "«Te prometo venir mañana» no informa de una promesa: la constituye. Si no voy, la promesa se rompe, pero ya existio.",
          fuente: "Austin, Como hacer cosas con palabras",
          efecto: "El lenguaje se vuelve accion. Toda palabra es, en algun grado, un acto.",
          relacionados: ["actos-de-habla", "echeverria"], autores: ["Austin", "Searle"] },

        { id: "máximas-grice", categoria: "filosofia", nivel: "medio", termino: "Maximas de Grice",
          etimologia: "Modelo de H. P. Grice, 1975.",
          definicion: "Cuatro maximas de la conversacion: cantidad (di lo necesario), calidad (di verdad), relacion (se pertinente), modo (se claro). Cuando se violan, se generan implicaturas.",
          ejemplo: "«¿Me prestas tu auto?» «Tengo las llantas pinchadas.» No dice «no»: viola la maxima de relacion, y el otro entiende el no.",
          fuente: "Grice, Logica y conversacion",
          efecto: "Explica por que conversamos con eficacia y sin decir todo. La literatura es un arte de violar estas maximas.",
          relacionados: ["implicatura", "pragmatica"], autores: ["Grice", "Sperber"] },

        // ============================================================
        // NIVEL AVANZADO
        // ============================================================
        { id: "enunciacion-foucault", categoria: "enunciacion", nivel: "avanzado", termino: "Enunciado (Foucault)",
          etimologia: "Del latin enuntiatum: 'lo dicho'.",
          definicion: "Michel Foucault distingue el enunciado de la frase o la proposicion: el enunciado es la unidad del discurso en su funcion, en su existencia, en su relacion con otros enunciados. No es la forma ni el significado: es el acontecimiento discursivo.",
          ejemplo: "«El hombre es un ser racional» es una frase; como enunciado, pertenece a una formacion discursiva (la filosofia moderna), tiene un autor, una funcion, un lugar.",
          fuente: "Foucault, La arqueologia del saber (1969)",
          efecto: "Desplaza el analisis del texto al discurso. Que se dice, quien lo dice, desde donde.",
          relacionados: ["dialogismo", "polifonia"], autores: ["Foucault", "Deleuze"] },

        { id: "deconstruccion", categoria: "enunciacion", nivel: "avanzado", termino: "Deconstruccion (Derrida)",
          etimologia: "Del latin de- (deshacer) y construere (construir).",
          definicion: "Jacques Derrida propone leer los textos buscando las oposiciones jerarquicas que los sostienen (dentro/fuera, presencia/ausencia, voz/escritura) y desestabilizarlas. No se destruye: se muestra la construccion.",
          ejemplo: "En la tradicion occidental, la voz se ha pensado como mas autentica que la escritura. Derrida muestra que esa jerarquia no es natural: es una eleccion filosofica.",
          fuente: "Derrida, De la gramatologia (1967)",
          efecto: "Vuelve sospechoso todo texto. Ninguna lectura es definitiva.",
          relacionados: ["posmodernidad", "intertextualidad"], autores: ["Derrida", "De Man"] },

        { id: "interpretacion-ricoeur", categoria: "ontologia", nivel: "avanzado", termino: "Hermeneutica (Ricoeur)",
          etimologia: "Del griego hermeneuein: 'interpretar'.",
          definicion: "Paul Ricoeur propone que el texto es un discurso fijado por la escritura que se autonomiza de su autor. La interpretacion es el trabajo de apropiacion: el lector se apropia del mundo del texto para ampliar el suyo.",
          ejemplo: "Leer a Kafka no es recuperar la intencion de Kafka: es apropiarse del mundo kafkiano y ampliar el propio.",
          fuente: "Ricoeur, Del texto a la accion (1986)",
          efecto: "Funda una hermeneutica productiva. El texto no esta cerrado: se abre en cada lectura.",
          relacionados: ["gadamer", "eco-lector"], autores: ["Ricoeur", "Gadamer"] },

        { id: "biopolitica-lenguaje", categoria: "ontologia", nivel: "avanzado", termino: "Poder y discurso (Foucault)",
          etimologia: "Conceptos de Michel Foucault.",
          definicion: "Para Foucault, el poder no se ejerce solo por la fuerza: se ejerce en el discurso. Los saberes, las normas, las identidades son producidas por dispositivos discursivos que definen lo decible y lo indecible.",
          ejemplo: "La categoria «loco» no existia antes de que la medicina psiquiatrica la construyera. Hablar de salud mental es tambien un acto de poder.",
          fuente: "Foucault, Vigilar y castigar, La voluntad de saber",
          efecto: "La escritura se vuelve, a la vez, producto y productora de poder. Escribir puede ser resistir o dominar.",
          relacionados: ["enunciacion-foucault", "habermas"], autores: ["Foucault", "Butler"] },

        { id: "actos-performativos-genero", categoria: "ontologia", nivel: "avanzado", termino: "Performatividad (Butler)",
          etimologia: "Del ingles performativity, derivado de Austin.",
          definicion: "Judith Butler retoma a Austin para mostrar que el genero no es una esencia que se expresa, sino una serie de actos performativos que producen la ilusion de una esencia.",
          ejemplo: "«Ser mujer» no es un hecho previo: es el efecto de una repeticion de actos, gestos, palabras, modos de vestir. El genero se hace.",
          fuente: "Butler, El genero en disputa (1990)",
          efecto: "Politiza la nocion de identidad. Todo acto de lenguaje puede confirmar o desestabilizar una norma.",
          relacionados: ["performativo", "poder-discurso"], autores: ["Butler", "Foucault"] },

        { id: "sintaxis-silencio", categoria: "linguistica", nivel: "avanzado", termino: "El silencio como forma",
          etimologia: "Del latin silentium.",
          definicion: "La ausencia tambien significa. En sintaxis, en poesia, en conversacion, el silencio es una posicion: un lugar donde algo podria haber estado y no esta.",
          ejemplo: "«Aqui no paso nada» no significa lo mismo que «aqui paso algo». La negacion no borra: señala.",
          fuente: "Filosofia del lenguaje, Bajtin, Blanchot",
          efecto: "Enseña a leer lo no dicho. La literatura es, en gran medida, un arte del silencio.",
          relacionados: ["elipsis", "reticencia"], autores: ["Blanchot", "Bajtin"] },

        // ============================================================
        // NIVEL INTENSIVO
        // ============================================================
        { id: "iterabilidad", categoria: "filosofia", nivel: "intensivo", termino: "Iterabilidad (Derrida)",
          etimologia: "Del latin iterum: 'de nuevo'.",
          definicion: "La marca no es nunca unica: por definicion, puede repetirse en contextos distintos. Esa posibilidad de repeticion es lo que permite que una marca funcione como signo, pero tambien lo que impide que su significado se fije para siempre.",
          ejemplo: "Una firma repite un nombre, y sin embargo cada firma es distinta. La firma funciona porque se puede repetir; no funciona como identidad absoluta.",
          fuente: "Derrida, Firma, acontecimiento, contexto (1972)",
          efecto: "Socava toda intencion autoral absoluta. El significado no se cierra.",
          relacionados: ["deconstruccion", "diferancia"], autores: ["Derrida"] },

        { id: "diferancia", categoria: "filosofia", nivel: "intensivo", termino: "Diferancia (Derrida)",
          etimologia: "Neologismo de Derrida: fusion de differer (diferir, aplazar) y differer (ser distinto).",
          definicion: "El significado no esta nunca presente: siempre se difiere a otro significado. No hay punto final. La lengua es una cadena de diferencias que se remiten entre si sin fondo.",
          ejemplo: "Buscar el significado de una palabra en el diccionario lleva a otras palabras, que llevan a otras... sin llegar a un fundamento exterior al lenguaje.",
          fuente: "Derrida, La voz y el fenomeno (1967)",
          efecto: "Rompe la idea de significado estable. La lectura es una tarea infinita.",
          relacionados: ["iterabilidad", "deconstruccion"], autores: ["Derrida", "Deleuze"] },

        { id: "deseo-lenguaje", categoria: "ontologia", nivel: "intensivo", termino: "Deseo y lenguaje (Lacan)",
          etimologia: "Del latin desiderium: 'anhelo'.",
          definicion: "Jacques Lacan plantea que el deseo se constituye en el lenguaje. El sujeto desea en el lenguaje, y ese deseo es siempre deseo del Otro. No hay deseo puro previo al lenguaje.",
          ejemplo: "Un poeta no escribe lo que desea: escribe para constituir el deseo como tal. Al escribirlo, lo pierde y lo inventa a la vez.",
          fuente: "Lacan, Escritos (1966)",
          efecto: "Revela la dimension inconsciente del lenguaje. Escribir es tratar con el deseo.",
          relacionados: ["freud", "condensacion"], autores: ["Lacan", "Freud", "Paz"] },

        { id: "dialogismo-radical", categoria: "enunciacion", nivel: "intensivo", termino: "Dialogismo radical",
          etimologia: "Termino de Bajtin, radicalizado por Kristeva.",
          definicion: "Julia Kristeva radicaliza a Bajtin: todo texto es un mosaico de citas, absorcion y transformacion de otros textos. La intertextualidad no es una tecnica: es la condicion del texto.",
          ejemplo: "El Ulises de Joyce no cita la Odisea: la reescribe desde dentro. Toda palabra ya viene de otro lugar.",
          fuente: "Kristeva, Semiotica 1 (1969)",
          efecto: "Disuelve la idea de originalidad pura. Escribir es entrar en una conversacion ya empezada.",
          relacionados: ["dialogismo", "intertextualidad"], autores: ["Kristeva", "Bajtin", "Barthes"] },

        { id: "muerte-autor", categoria: "enunciacion", nivel: "intensivo", termino: "La muerte del autor (Barthes)",
          etimologia: "Titulo de un ensayo de Roland Barthes, 1967.",
          definicion: "Barthes propone que el significado del texto no esta en la intencion del autor sino en el lector. El autor es una funcion discursiva, no un origen. Al nacer el lector, muere el autor.",
          ejemplo: "No importa lo que quiso decir Baudelaire: importa lo que el poema hace en cada lectura. El texto es un tejido de significantes, no un mensaje cifrado.",
          fuente: "Barthes, La muerte del autor (1967)",
          efecto: "Desplaza el poder del autor al lector. La literatura es una practica de lectura.",
          relacionados: ["eco-lector", "deconstruccion"], autores: ["Barthes", "Foucault"] },

        { id: "rizoma", categoria: "ontologia", nivel: "intensivo", termino: "Rizoma (Deleuze-Guattari)",
          etimologia: "Del griego rhizoma: 'raiz multiple'.",
          definicion: "Gilles Deleuze y Felix Guattari proponen el rizoma como modelo del pensamiento: no jerarquico, no arborescente, sin centro. Todo punto se conecta con cualquier otro.",
          ejemplo: "Un libro rizomatico no tiene principio ni fin claros. Se puede entrar por cualquier parte. Es el modelo de la escritura contemporanea.",
          fuente: "Deleuze, Guattari, Mil mesetas (1980)",
          efecto: "Ofrece un modelo alternativo al arbol jerarquico. La escritura puede ser red, no tronco.",
          relacionados: ["intertextualidad", "postestructuralismo"], autores: ["Deleuze", "Guattari"] },

        { id: "fragmento-romantico", categoria: "ontologia", nivel: "intensivo", termino: "Fragmento romantico",
          etimologia: "Del latin fragmentum: 'trozo'.",
          definicion: "Los romantico-alemanes (Schlegel, Novalis) proponen el fragmento como forma filosofica: una parte que no remite a un todo, sino que vale por si misma y a la vez abre a lo infinito.",
          ejemplo: "Los fragmentos de Novalis o de Nietzsche no son pedazos de un libro: son libros en miniatura, pensamientos completos que se interrumpen a proposito.",
          fuente: "Schlegel, Fragmentos (1798)",
          efecto: "Funda una estetica de lo inacabado. El fragmento es forma, no falta.",
          relacionados: ["aforismo", "epifonema"], autores: ["Schlegel", "Novalis", "Nietzsche"] },

        { id: "clinamen", categoria: "pensamiento", nivel: "intensivo", termino: "Clinamen",
          etimologia: "Del latin clinamen: 'inclinacion', 'desvio'.",
          definicion: "Concepto de Lucrecio retomado por Harold Bloom: el poeta fuerte se apropia de sus predecesores desviandose de ellos con una pequena inflexion. No se repite: se desvia.",
          ejemplo: "Todo gran poeta tiene un padre al que traiciona sutilmente. Ese desvio minimo es la originalidad.",
          fuente: "Lucrecio, De rerum natura; Bloom, La angustia de las influencias",
          efecto: "Explica la ansiedad de la influencia. Escribir es desviarse.",
          relacionados: ["intertextualidad", "muerte-autor"], autores: ["Lucrecio", "Bloom"] }
    ];

    // Ejercicios nuevos
    var EJERCICIOS_NUEVOS = [
        { tipo: "multiple", categoria: "diccion", nivel: "basico",
          pregunta: "«El ruido con que rueda la ronca tempestad» es un ejemplo de:",
          opciones: ["Anafora", "Aliteracion", "Epistrofe", "Calambur"], correcta: 1,
          feedback: "La repeticion de la r suena como el trueno. La aliteracion imita el sonido con el sonido." },
        { tipo: "multiple", categoria: "pensamiento", nivel: "basico",
          pregunta: "«Es tan corto el amor y tan largo el olvido» es un ejemplo de:",
          opciones: ["Metafora", "Antitesis", "Metonimia", "Alegoria"], correcta: 1,
          feedback: "Neruda contrapone dos ideas opuestas: amor/olvido, corto/largo. El contraste ilumina el sentido." },
        { tipo: "multiple", categoria: "linguistica", nivel: "medio",
          pregunta: "Segun Jakobson, un poema tiene funcion dominante:",
          opciones: ["Referencial", "Emotiva", "Poetica", "Fatica"], correcta: 2,
          feedback: "En el poema domina la funcion poetica: el mensaje se vuelve sobre si mismo, sobre su forma." },
        { tipo: "multiple", categoria: "filosofia", nivel: "medio",
          pregunta: "«¿Me prestas tu auto?» «Tengo las llantas pinchadas.» La respuesta viola:",
          opciones: ["La maxima de calidad", "La maxima de cantidad", "La maxima de relacion", "La maxima de modo"], correcta: 2,
          feedback: "La respuesta no es pertinente al tema literal, pero genera una implicatura: no. Violacion de la maxima de relacion." },
        { tipo: "multiple", categoria: "pensamiento", nivel: "medio",
          pregunta: "«No soy inocente» para significar «soy culpable» es:",
          opciones: ["Ironia", "Litote", "Pretericion", "Antitesis"], correcta: 1,
          feedback: "El litote afirma negando lo contrario. La negacion hace mas fuerte lo afirmado." },
        { tipo: "multiple", categoria: "semiotica", nivel: "medio",
          pregunta: "Greimas llama isotopia a:",
          opciones: ["La ausencia de sentido", "La repeticion de un sema a lo largo del texto", "El lugar de la enunciacion", "Un tipo de metafora"], correcta: 1,
          feedback: "La isotopia es la coherencia semantica: un mismo hilo de sentido recorre el texto." },
        { tipo: "multiple", categoria: "enunciacion", nivel: "avanzado",
          pregunta: "«La muerte del autor» (Barthes, 1967) sostiene que:",
          opciones: [
            "El autor debe morir para escribir mejor",
            "El significado no esta en la intencion del autor sino en el lector",
            "Los autores no existen",
            "El autor es solo un nombre en la portada"
          ], correcta: 1,
          feedback: "Barthes desplaza el poder hermenéutico del autor al lector. El texto vive en cada lectura." },
        { tipo: "multiple", categoria: "ontologia", nivel: "avanzado",
          pregunta: "Segun Foucault, el poder:",
          opciones: ["Se ejerce solo por la fuerza", "Se ejerce tambien en el discurso", "Es siempre economico", "No existe"], correcta: 1,
          feedback: "El poder produce discursos, define lo decible, construye identidades. Hablar es un acto politico." },
        { tipo: "multiple", categoria: "enunciacion", nivel: "intensivo",
          pregunta: "La «iterabilidad» de Derrida implica que:",
          opciones: [
            "Un texto dice siempre lo mismo",
            "El significado de una marca se puede repetir en contextos distintos y por eso no se fija",
            "La lectura es imposible",
            "Los autores son unicos"
          ], correcta: 1,
          feedback: "La marca funciona porque se puede repetir; pero esa repeticion impide que su sentido se cierre definitivamente." },
        { tipo: "multiple", categoria: "ontologia", nivel: "intensivo",
          pregunta: "El «rizoma» de Deleuze y Guattari propone un modelo:",
          opciones: ["Jerarquico y arborescente", "Reticular, sin centro ni principio claro", "Lineal y dialectico", "Ciclico y cerrado"], correcta: 1,
          feedback: "El rizoma es red, no arbol. Todo se conecta con todo. La escritura puede ser multiplicidad." }
    ];

    // Añadir al contenido global
    window.LITTERA_CONTENIDO.fichas = window.LITTERA_CONTENIDO.fichas.concat(NUEVAS);
    window.LITTERA_CONTENIDO.ejercicios = window.LITTERA_CONTENIDO.ejercicios.concat(EJERCICIOS_NUEVOS);

    // Las nuevas fichas sin nivel son "medio" por defecto
    window.LITTERA_CONTENIDO.fichas.forEach(function (f) {
        if (!f.nivel) f.nivel = "medio";
    });
})();
