// ============================================
// LITTERA v4 - Contenido del modulo de aprendizaje
// Fichas de retorica, linguistica, semiotica,
// filosofia del lenguaje y ontologia
// ============================================

window.LITTERA_CONTENIDO = (function () {
    "use strict";

    var CATEGORIAS = [
        { id: "diccion",     nombre: "Figuras de diccion",     color: "#B5613F" },
        { id: "pensamiento", nombre: "Figuras de pensamiento", color: "#8B2E2E" },
        { id: "enunciacion", nombre: "Teoria de la enunciacion", color: "#2A3F5F" },
        { id: "linguistica", nombre: "Linguistica",            color: "#3D4D2E" },
        { id: "semiotica",   nombre: "Semiotica",              color: "#9A7A1E" },
        { id: "filosofia",   nombre: "Filosofia del lenguaje", color: "#6B4F6E" },
        { id: "ontologia",   nombre: "Ontologia del lenguaje", color: "#6E2C3C" }
    ];

    var FICHAS = [

        // ============================================================
        // FIGURAS DE DICCION
        // ============================================================
        {
            id: "elipsis",
            categoria: "diccion",
            termino: "Elipsis",
            etimologia: "Del griego élleipsis: 'falta', 'omision'.",
            definicion: "Omision intencional de uno o varios elementos de la oracion que el contexto permite sobreentender. La ausencia no empobrece el sentido: lo intensifica.",
            ejemplo: "«Por una mirada, un mundo; / por una sonrisa, un cielo; / por un beso... yo no se / que te diera por un beso.»",
            fuente: "Gustavo Adolfo Becquer, Rima XXIII",
            efecto: "Acelera el ritmo, concentra la emocion, exige la complicidad del lector. Es la figura del silencio elocuente.",
            relacionados: ["asindeton", "zeugma"],
            autores: ["Quintiliano", "Azorin"]
        },
        {
            id: "pleonasmo",
            categoria: "diccion",
            termino: "Pleonasmo",
            etimologia: "Del griego pleonasmós: 'exceso', 'superabundancia'.",
            definicion: "Adicion de palabras que parecen innecesarias para el sentido, pero que refuerzan la expresion. No es un error: es una eleccion estilistica que intensifica.",
            ejemplo: "«Lo vi con mis propios ojos» / «Subir para arriba» / «Te lo digo yo mismo».",
            fuente: "Uso coloquial y literario",
            efecto: "Da fuerza, claridad y a veces emocion. En poesia puede ser martillo: repite para golpear.",
            relacionados: ["epizeuxis", "anadiplosis"],
            autores: ["Cicerón", "Lope de Vega"]
        },
        {
            id: "hiperbaton",
            categoria: "diccion",
            termino: "Hiperbaton",
            etimologia: "Del griego hypérbaton: 'transposicion', 'paso por encima'.",
            definicion: "Alteracion del orden habitual de las palabras en la oracion. Es la sintaxis que se sale de su cauce para producir un efecto ritmico, expresivo o de tension.",
            ejemplo: "«Del monte en la ladera / por mi mano plantado tengo un huerto.»",
            fuente: "Fray Luis de León",
            efecto: "Produce suspenso, elegancia, extrañeza. En poesia clásica es la marca del arte: se sacrifica la claridad por la musica.",
            relacionados: ["anastrofe", "tmesis"],
            autores: ["Góngora", "Quevedo", "Fray Luis de León"]
        },
        {
            id: "silepsis",
            categoria: "diccion",
            termino: "Silepsis",
            etimologia: "Del griego sýllepsis: 'accion de tomar juntamente'.",
            definicion: "Concordancia segun el sentido y no segun la gramatica. El verbo o el adjetivo concuerda con la idea, no con la forma. Tambien se llama concordancia ad sensum.",
            ejemplo: "«La mayoria piensan que...» (concuerda en plural por el sentido colectivo). / «Su Señoria esta enojado» (masculino por el genero real del referente).",
            fuente: "Gramatica española",
            efecto: "Pone en evidencia que la lengua no es pura forma: es sentido vivo, uso, costumbre.",
            relacionados: ["zeugma"],
            autores: ["Bello", "RAE"]
        },
        {
            id: "regresion",
            categoria: "diccion",
            termino: "Regresion (epistrofe)",
            etimologia: "Del griego epistrophé: 'conversion', 'retorno'.",
            definicion: "Repeticion de una o varias palabras al final de miembros sucesivos del periodo. Es la simetria que regresa, el eco que insiste.",
            ejemplo: "«Y todo por ti, / la luz por ti, / la sombra por ti, / el mar por ti.»",
            fuente: "Uso poetico contemporaneo",
            efecto: "Produce obsesion, insistencia, hipnosis. El lector queda atrapado en el retorno.",
            relacionados: ["anafora", "epifora", "anadiplosis"],
            autores: ["Becquer", "Neruda"]
        },
        {
            id: "anafora",
            categoria: "diccion",
            termino: "Anafora",
            etimologia: "Del griego anaphorá: 'repeticion', 'referencia'.",
            definicion: "Repeticion de una o varias palabras al comienzo de varios enunciados sucesivos.",
            ejemplo: "«Verde que te quiero verde. / Verde viento. Verdes ramas.»",
            fuente: "Federico Garcia Lorca, Romancero gitano",
            efecto: "Crea ritmo, insistencia, acumulacion emocional. La palabra repetida se vuelve martillo y plegaria.",
            relacionados: ["epistrofe", "anadiplosis"],
            autores: ["Lorca", "Walt Whitman"]
        },
        {
            id: "polisindeton",
            categoria: "diccion",
            termino: "Polisindeton",
            etimologia: "Del griego polysýndeton: 'muchas conjunciones'.",
            definicion: "Uso repetido de conjunciones para enlazar palabras o clausulas. Lo que podria ir sin conjunciones se dice con ellas, y esa insistencia pesa.",
            ejemplo: "«Y vendran los dias de la vida, / y vendran los dias de la muerte, / y vendra el dolor, y vendra la calma...»",
            fuente: "Uso biblico y poetico",
            efecto: "Produce lentitud, solemnidad, acumulacion. Es la respiracion cortada del que no puede parar de decir.",
            relacionados: ["asindeton"],
            autores: ["Biblia (traduccion), Whitman"]
        },
        {
            id: "asindeton",
            categoria: "diccion",
            termino: "Asindeton",
            etimologia: "Del griego asýndeton: 'sin conjuncion'.",
            definicion: "Supresion de las conjunciones que normalmente unirian los elementos. La enumeracion avanza a saltos, desnuda.",
            ejemplo: "«Acude, corre, vuela, / traspasa la alta sierra, ocupa el llano.»",
            fuente: "Fray Luis de León",
            efecto: "Acelera, golpea, corta. El lector siente el vertigo de lo que viene en rapida sucesion.",
            relacionados: ["elipsis", "polisindeton"],
            autores: ["Fray Luis", "César Vallejo"]
        },
        {
            id: "anadiplosis",
            categoria: "diccion",
            termino: "Anadiplosis",
            etimologia: "Del griego anadíplosis: 'duplicacion'.",
            definicion: "Repeticion de la ultima palabra o grupo de una clausula al inicio de la siguiente. La cadena avanza encadenandose a si misma.",
            ejemplo: "«La muerte es una vida vivida. / La vida es una muerte que empieza.»",
            fuente: "Uso poetico y aforistico",
            efecto: "Crea continuidad, encadenamiento, logica interna. La idea se va construyendo sobre su propio eco.",
            relacionados: ["anafora", "epistrofe", "retruecano"],
            autores: ["Unamuno", "Borges"]
        },
        {
            id: "retruecano",
            categoria: "diccion",
            termino: "Retruecano (antimetabole)",
            etimologia: "Del italiano ritruccano, 'trueque', 'cambio'.",
            definicion: "Repeticion de una frase invirtiendo el orden de sus terminos en la segunda aparicion.",
            ejemplo: "«No se si es arte la vida, o si es la vida el arte.» / «Hay que comer para vivir, y no vivir para comer.»",
            fuente: "Tradicion aforistica",
            efecto: "Produce paradoja, giro conceptual, agudeza. Es la figura del pensamiento que se mira a si mismo y se contradice.",
            relacionados: ["antitesis", "paradoja", "quiasmo"],
            autores: ["Quevedo", "Gracián"]
        },

        // ============================================================
        // FIGURAS DE PENSAMIENTO
        // ============================================================
        {
            id: "metafora",
            categoria: "pensamiento",
            termino: "Metafora",
            etimologia: "Del griego metaphorá: 'transporte', 'traslado'.",
            definicion: "Sustitucion de un termino por otro con el que guarda una relacion de semejanza. Es trasladar el sentido: decir una cosa para decir otra, y que ambas resuenen.",
            ejemplo: "«Tus ojos son dos oscuros manantiales / donde la sed se hace eterna.»",
            fuente: "Uso poetico universal",
            efecto: "Ilumina lo desconocido con lo conocido. Es el corazon del lenguaje figurado y del pensamiento analogico.",
            relacionados: ["simil", "alegoria", "catacresis"],
            autores: ["Aristoteles", "Lakoff y Johnson", "Neruda"]
        },
        {
            id: "catacresis",
            categoria: "pensamiento",
            termino: "Catacresis",
            etimologia: "Del griego katáchresis: 'mal uso', 'abuso'.",
            definicion: "Metafora lexicalizada, ya integrada en la lengua, que ya no se percibe como figurada. Es la metafora que se olvido de que lo era.",
            ejemplo: "«La pata de la mesa» / «El cuello de la botella» / «Las patas del pantalon».",
            fuente: "Uso corriente del español",
            efecto: "Muestra que la lengua es metafora fosilizada. Hablar es, en gran medida, pensar con imagenes muertas que seguimos usando.",
            relacionados: ["metafora", "metonimia"],
            autores: ["Quintiliano", "Derrida"]
        },
        {
            id: "antonomasia",
            categoria: "pensamiento",
            termino: "Antonomasia",
            etimologia: "Del griego antonomasía: 'denominacion en lugar de otra'.",
            definicion: "Sustitucion de un nombre propio por un apelativo o designacion descriptiva, o al contrario: usar un nombre propio por el nombre comun.",
            ejemplo: "«Es un Quijote» (por idealista) / «El Rey Sol» (por Luis XIV) / «El Manco de Lepanto» (por Cervantes).",
            fuente: "Uso literario y periodistico",
            efecto: "Condensa un caracter, una biografia, en una imagen. Convierte lo individual en arquetipico.",
            relacionados: ["metafora", "metonimia", "epiteto"],
            autores: ["Quintiliano", "Cervantes"]
        },
        {
            id: "alegoria",
            categoria: "pensamiento",
            termino: "Alegoria",
            etimologia: "Del griego allegoría: 'hablar de otra cosa', 'decir de otro modo'.",
            definicion: "Metafora continuada: un relato, una imagen o una serie de imagenes que representan de modo sistematico un sentido abstracto. No una metafora suelta, sino una metafora que se despliega en el tiempo.",
            ejemplo: "«Caminante, no hay camino, / se hace camino al andar.»",
            fuente: "Antonio Machado, Proverbios y cantares",
            efecto: "Convierte lo abstracto en narrable, lo invisible en visible. Es la figura de la parabola, del mito, de la novela simbolica.",
            relacionados: ["metafora", "simbolo", "mito"],
            autores: ["Dante", "Kafka", "Borges"]
        },
        {
            id: "metonimia",
            categoria: "pensamiento",
            termino: "Metonimia",
            etimologia: "Del griego metonymía: 'cambio de nombre'.",
            definicion: "Sustitucion de un termino por otro con el que guarda una relacion de contiguidad (causa-efecto, continente-contenido, autor-obra, lugar-producto).",
            ejemplo: "«Tomar una copa» (por beber) / «Leer a Borges» (por leer su obra) / «Tomar un Rioja» (por el vino de la Rioja).",
            fuente: "Uso corriente y literario",
            efecto: "Es el lenguaje de la vida cotidiana y del periodismo. Conecta por cercania, por presencia, por roce.",
            relacionados: ["sinecdoque", "metafora", "antonomasia"],
            autores: ["Jakobson", "Lakoff y Johnson"]
        },
        {
            id: "sinecdoque",
            categoria: "pensamiento",
            termino: "Sinecdoque",
            etimologia: "Del griego synekdoché: 'comprension simultanea'.",
            definicion: "Sustitucion de un termino por otro con el que guarda una relacion de inclusion (parte por el todo, todo por la parte, especie por genero, materia por objeto).",
            ejemplo: "«Tener muchas primaveras» (por años) / «Cien cabezas de ganado» / «El hombre es mortal» (por la especie).",
            fuente: "Uso corriente y poetico",
            efecto: "Permite decir lo grande con lo pequeño y lo pequeno con lo grande. Es la figura del detalle significante.",
            relacionados: ["metonimia", "metafora"],
            autores: ["Dumarsais", "Jakobson"]
        },
        {
            id: "condensacion",
            categoria: "pensamiento",
            termino: "Condensacion semantica",
            etimologia: "Del latin condensare: 'espesar', 'apretar'.",
            definicion: "Concentracion de varios significados en una sola expresion. Una palabra o imagen que carga, a la vez, distintos planos de sentido. Freud la usa para el sueño; los poetas, para el verso.",
            ejemplo: "«Verde que te quiero verde» (color, deseo, libertad, erotismo, muerte, en tres palabras).",
            fuente: "Lorca, desde el psicoanalisis",
            efecto: "Produce densidad, ambiguedad, riqueza. Lo que parece simple dice lo complejo.",
            relacionados: ["simbolo", "metafora", "polisemia"],
            autores: ["Freud", "Lacan", "Lorca"]
        },
        {
            id: "aposicion",
            categoria: "pensamiento",
            termino: "Aposicion",
            etimologia: "Del latin appositio: 'yuxtaposicion'.",
            definicion: "Yuxtaposicion de dos elementos nominales sin nexo explicito, de modo que uno de ellos aclara, amplifica o modifica al otro. Va entre comas cuando se escribe.",
            ejemplo: "«Cervantes, el manco de Lepanto, escribio el Quijote.» / «Rosalia, la poeta del pueblo, cantaba al mar.»",
            fuente: "Sintaxis española",
            efecto: "Permite precisar sin subordinar. La frase respira: la aposicion es un parentesis que enriquece sin detener.",
            relacionados: ["epiteto", "inciso"],
            autores: ["Azorin", "Alfonso Reyes"]
        },
        {
            id: "hipalage",
            categoria: "pensamiento",
            termino: "Hipalage",
            etimologia: "Del griego hypallagé: 'permutacion', 'cambio'.",
            definicion: "Atribucion de un adjetivo a un sustantivo distinto del que logicamente le corresponde, por traslado del sentido.",
            ejemplo: "«El piadoso silencio de la tarde» (el silencio no es piadoso; nosotros lo sentimos asi). / «La triste mirada del otoño.»",
            fuente: "Uso poetico clasico y moderno",
            efecto: "Produce extrañeza, fusion, atmosfera. Es una de las figuras mas sutiles: mezcla sensacion y objeto.",
            relacionados: ["metafora", "sinestesia"],
            autores: ["Virgilio", "Baudelaire", "Aleixandre"]
        },
        {
            id: "oximoron",
            categoria: "pensamiento",
            termino: "Oximoron",
            etimologia: "Del griego oxýmoron: 'agudo-insensato'.",
            definicion: "Union de dos terminos contradictorios que, juntos, crean un tercer sentido. La contradiccion es la forma mas alta de la verdad literaria.",
            ejemplo: "«La musica callada, / la soledad sonora.» / «Un silencio ensordecedor» / «Una oscuridad luminosa».",
            fuente: "San Juan de la Cruz, Cántico espiritual",
            efecto: "Suspende la logica, ilumina de golpe, hace visible la paradoja del mundo. Es la figura del misterio.",
            relacionados: ["antitesis", "paradoja"],
            autores: ["San Juan de la Cruz", "Unamuno", "Aleixandre"]
        },

        // ============================================================
        // TEORIA DE LA ENUNCIACION
        // ============================================================
        {
            id: "benveniste",
            categoria: "enunciacion",
            termino: "Enunciacion (Benveniste)",
            etimologia: "Del latin enuntiatio: 'declaracion', 'exposicion'.",
            definicion: "Emile Benveniste plantea que el lenguaje no es solo un sistema de signos: es un acto por el cual un sujeto se apropia de la lengua y se constituye como yo frente a un tu. La enunciacion es el acto mismo de producir un enunciado.",
            ejemplo: "«Yo» no significa nada sin alguien que lo pronuncie. «Aqui» y «ahora» solo tienen sentido desde el lugar y el momento en que se habla.",
            fuente: "Benveniste, Problemas de linguistica general (1966)",
            efecto: "Funda la subjetividad en el lenguaje: no hablamos con el lenguaje, nos constituimos en el. El yo es un efecto del decir.",
            relacionados: ["deicticos", "subjetividad", "modalidad"],
            autores: ["Benveniste", "Ducrot", "Kerbrat-Orecchioni"]
        },
        {
            id: "deicticos",
            categoria: "enunciacion",
            termino: "Deicticos",
            etimologia: "Del griego deiktikós: 'que señala', 'que muestra'.",
            definicion: "Palabras cuyo significado depende del contexto de enunciacion: yo, tu, aqui, ahora, este, aquel, hoy, mañana. Señalan sin describir: solo funcionan en el momento del habla.",
            ejemplo: "«Yo estoy aqui, ahora, contigo.» Cada palabra cambia de sentido segun quien la diga, donde y cuando.",
            fuente: "Benveniste, Kerbrat-Orecchioni",
            efecto: "Anclan el discurso en el cuerpo y el tiempo del que habla. Sin ellos no hay relato situado, no hay yo ni tu.",
            relacionados: ["enunciacion", "subjetividad"],
            autores: ["Benveniste", "Jakobson"]
        },
        {
            id: "modalidad",
            categoria: "enunciacion",
            termino: "Modalidad",
            etimologia: "Del latin modus: 'manera', 'medida'.",
            definicion: "Actitud del hablante frente a lo que dice: afirmacion, duda, deseo, obligacion, posibilidad. No es el contenido, es el modo en que el sujeto se posiciona frente al contenido.",
            ejemplo: "«Vendra mañana» (certeza) / «Quizas venga mañana» (duda) / «Deberia venir mañana» (obligacion) / «Ojala venga mañana» (deseo).",
            fuente: "Tradicion linguistica, Benveniste, Ducrot",
            efecto: "Toda frase, ademas de decir algo, dice como el sujeto se relaciona con lo dicho. Es la huella del cuerpo en el lenguaje.",
            relacionados: ["enunciacion", "actos-de-habla"],
            autores: ["Benveniste", "Ducrot", "Palmer"]
        },
        {
            id: "polifonia",
            categoria: "enunciacion",
            termino: "Polifonia",
            etimologia: "Del griego polyphonía: 'muchas voces'.",
            definicion: "Bajtin plantea que todo enunciado es habitado por multiples voces: la del autor, la del personaje, la de la tradicion, la del genero. No hay discurso puro: hay coro.",
            ejemplo: "En una novela de Dostoievski, el narrador no impone su verdad: cada personaje tiene su voz, su vision, su derecho a la palabra.",
            fuente: "Mijail Bajtin, Problemas de la poetica de Dostoievski (1929)",
            efecto: "Rompe la ilusion de un yo unico. Todo texto es dialogico: responde a otros textos y anticipa respuestas.",
            relacionados: ["dialogismo", "intertextualidad", "heteroglosia"],
            autores: ["Bajtin", "Dostoievski"]
        },
        {
            id: "dialogismo",
            categoria: "enunciacion",
            termino: "Dialogismo",
            etimologia: "Del griego diálogos: 'conversacion'.",
            definicion: "Concepto de Bajtin: todo enunciado se construye en relacion con otros enunciados, pasados y futuros. Hablar es siempre responder, aunque nadie este enfrente.",
            ejemplo: "Una carta de respuesta implica la carta recibida. Un poema de amor implica la tradicion entera del amor cantado.",
            fuente: "Bajtin, Estetica de la creacion verbal",
            efecto: "Reemplaza la idea del lenguaje como espejo por la del lenguaje como conversacion infinita. Escribir es entrar en una conversacion ya empezada.",
            relacionados: ["polifonia", "intertextualidad"],
            autores: ["Bajtin", "Kristeva"]
        },

        // ============================================================
        // LINGUISTICA
        // ============================================================
        {
            id: "saussure",
            categoria: "linguistica",
            termino: "Signo linguistico (Saussure)",
            etimologia: "Del latin signum: 'señal', 'marca'.",
            definicion: "Ferdinand de Saussure propone que el signo linguistico une un significante (imagen acustica) y un significado (concepto). Su union es arbitraria: no hay razon natural por la que 'mesa' designe una mesa.",
            ejemplo: "En español decimos 'mesa'; en ingles 'table'; en japones 'tsukue'. El mismo objeto, tres significantes distintos, ninguno mas verdadero que otro.",
            fuente: "Saussure, Curso de linguistica general (1916)",
            efecto: "Funda la linguistica moderna como ciencia. La lengua es forma, no sustancia: un sistema de diferencias.",
            relacionados: ["lengua-habla", "sincronia", "arbitrariedad"],
            autores: ["Saussure", "Hjelmslev"]
        },
        {
            id: "lengua-habla",
            categoria: "linguistica",
            termino: "Lengua y habla",
            etimologia: "Del latin lingua y fabula.",
            definicion: "Distincion saussureana. La lengua es el sistema colectivo, social, abstracto de signos. El habla es el uso individual, concreto, irrepetible que cada hablante hace de ese sistema.",
            ejemplo: "La lengua es el español como sistema compartido. El habla es como cada persona lo usa: su acento, su vocabulario, sus giros, sus errores.",
            fuente: "Saussure, Curso de linguistica general",
            efecto: "Distingue lo social de lo individual, lo abstracto de lo concreto. Es la base para pensar la literatura como habla singular dentro de una lengua comun.",
            relacionados: ["saussure", "sincronia"],
            autores: ["Saussure"]
        },
        {
            id: "chomsky",
            categoria: "linguistica",
            termino: "Gramatica generativa (Chomsky)",
            etimologia: "Del latin generare: 'engendrar', 'producir'.",
            definicion: "Noam Chomsky propone que los seres humanos nacemos con una capacidad innata para el lenguaje: una gramatica universal que nos permite generar infinitas oraciones a partir de reglas finitas. El lenguaje no se aprende por imitacion: se desarrolla.",
            ejemplo: "Ningun niño ha escuchado todas las oraciones que va a decir. Sin embargo, las produce. ¿Como? Porque la capacidad de generar oraciones es innata.",
            fuente: "Chomsky, Estructuras sintacticas (1957), Aspectos (1965)",
            efecto: "Revoluciona la linguistica: el lenguaje pasa de ser un repertorio aprendido a una facultad biologica. La mente no es pizarra en blanco.",
            relacionados: ["competencia", "estructura-profunda", "recursion"],
            autores: ["Chomsky", "Pinker"]
        },
        {
            id: "competencia",
            categoria: "linguistica",
            termino: "Competencia y actuacion",
            etimologia: "Del latin competentia: 'capacidad', 'aptitud'.",
            definicion: "Chomsky distingue la competencia (el conocimiento interiorizado que el hablante tiene de su lengua) de la actuacion (el uso concreto y a menudo imperfecto que hace de ese saber).",
            ejemplo: "Un hablante puede equivocarse al hablar (actuacion), pero sabe cual es la forma correcta (competencia). La competencia es el saber; la actuacion, el hacer.",
            fuente: "Chomsky, Aspectos de la teoria de la sintaxis (1965)",
            efecto: "Pone el foco en la capacidad creadora del hablante, no en la norma exterior. Todo escritor es, antes que nada, competente en su lengua.",
            relacionados: ["chomsky", "gramatica-generativa"],
            autores: ["Chomsky", "Hymes"]
        },
        {
            id: "estructura-profunda",
            categoria: "linguistica",
            termino: "Estructura profunda",
            etimologia: "Terminos propios de la teoria chomskyana.",
            definicion: "Chomsky distingue una estructura profunda (el nivel abstracto donde se organiza el significado) y una estructura superficial (la forma concreta que toma la oracion al pronunciarse). Las transformaciones permiten pasar de una a otra.",
            ejemplo: "«El niño rompio el vaso» y «El vaso fue roto por el niño» tienen la misma estructura profunda, pero distinta estructura superficial. Dicen lo mismo de dos maneras.",
            fuente: "Chomsky, Estructuras sintacticas",
            efecto: "Explica por que dos oraciones distintas dicen lo mismo, y por que una misma oracion puede decir cosas distintas segun el contexto.",
            relacionados: ["chomsky", "transformaciones"],
            autores: ["Chomsky"]
        },
        {
            id: "recursion",
            categoria: "linguistica",
            termino: "Recursion",
            etimologia: "Del latin recursio: 'retorno', 'vuelta atras'.",
            definicion: "Capacidad del lenguaje humano de insertar una estructura dentro de otra del mismo tipo, indefinidamente. Es lo que permite producir oraciones infinitamente largas y complejas a partir de un sistema finito.",
            ejemplo: "«El gato que persiguio al raton que royo el libro que...» Podemos seguir indefinidamente. Solo el lenguaje humano hace esto de modo ilimitado.",
            fuente: "Chomsky, Hauser y Fitch (2002)",
            efecto: "Explica la creatividad infinita del lenguaje: con pocas reglas, decimos cosas nunca dichas antes.",
            relacionados: ["chomsky", "gramatica-generativa"],
            autores: ["Chomsky"]
        },

        // ============================================================
        // SEMIOTICA
        // ============================================================
        {
            id: "peirce",
            categoria: "semiotica",
            termino: "Semiotica triadica (Peirce)",
            etimologia: "Del griego semeiotiké: 'arte de los signos'.",
            definicion: "Charles Sanders Peirce propone que el signo es una relacion de tres terminos: el representamen (lo que representa), el objeto (lo representado) y el interpretante (el efecto que produce en quien lo interpreta). No hay signo sin interpretacion.",
            ejemplo: "El humo (representamen) remite al fuego (objeto) y produce en nosotros la idea del fuego (interpretante). Los tres, juntos, forman el signo.",
            fuente: "Peirce, Collected Papers",
            efecto: "Funda la semiotica moderna. Todo se interpreta: no hay acceso directo a la realidad, solo a traves de signos.",
            relacionados: ["icono", "indice", "simbolo"],
            autores: ["Peirce", "Eco", "Morris"]
        },
        {
            id: "icono-indice-simbolo",
            categoria: "semiotica",
            termino: "Icono, indice, simbolo",
            etimologia: "Terminos peirceanos.",
            definicion: "Tres tipos de signo segun su relacion con el objeto. Icono: se parece (un retrato). Indice: apunta por contiguidad (el humo al fuego, una huella al pie). Simbolo: la relacion es convencional (la palabra 'mesa', la bandera).",
            ejemplo: "El retrato de una persona es icono. Su firma es indice. Su nombre escrito es simbolo.",
            fuente: "Peirce, Collected Papers",
            efecto: "Permite analizar cualquier sistema de signos, desde la pintura al cine, desde la moda al lenguaje.",
            relacionados: ["peirce", "semiotica"],
            autores: ["Peirce", "Eco"]
        },
        {
            id: "barthes-mito",
            categoria: "semiotica",
            termino: "Mito (Barthes)",
            etimologia: "Del griego mythos: 'relato', 'fabulacion'.",
            definicion: "Roland Barthes muestra que la cultura burguesa produce mitos: sistemas de signos que, bajo la apariencia de naturaleza, esconden ideologia. El mito naturaliza lo historico: hace pasar por obvio lo que es construido.",
            ejemplo: "La portada de Paris-Match con un soldado negro saludando a la bandera francesa: no es una foto, es un mito. Dice: 'Francia es un imperio, todos sus hijos la aman'.",
            fuente: "Barthes, Mitologias (1957)",
            efecto: "Desmonta la inocencia de las imagenes. Toda cultura produce mitos; el criticismo los desmonta.",
            relacionados: ["denotacion", "connotacion", "significacion"],
            autores: ["Barthes", "Sontag"]
        },
        {
            id: "denotacion-connotacion",
            categoria: "semiotica",
            termino: "Denotacion y connotacion",
            etimologia: "Del latin denotare y connotare: 'señalar' y 'señalar junto con'.",
            definicion: "Denotacion: el significado literal, objetivo, descriptivo de un signo. Connotacion: el significado secundario, subjetivo, cultural, asociativo. Toda imagen y todo texto tiene ambos niveles.",
            ejemplo: "«Leon» denota un animal felino. Connota: fuerza, realeza, peligro, coraje, la tribu de Juda.",
            fuente: "Barthes, Elementos de semiologia (1964)",
            efecto: "Permite analizar como un mismo significante produce distintos significados segun el contexto y la cultura.",
            relacionados: ["barthes-mito", "polifonia"],
            autores: ["Barthes", "Hjelmslev"]
        },
        {
            id: "eco-lector",
            categoria: "semiotica",
            termino: "Lector modelo (Eco)",
            etimologia: "Del latin lector y modellus: 'el que lee' y 'modelo'.",
            definicion: "Umberto Eco propone que todo texto construye un lector modelo: un lector que el texto mismo preve, convoca, espera. No es el lector real, sino la estrategia textual que prescribe el modo en que el texto debe ser leido.",
            ejemplo: "Una novela policial construye un lector que sospecha, que arma hipotesis, que quiere saber quien es el culpable. Un poema hermetico construye un lector dispuesto a no entender del todo.",
            fuente: "Eco, Lector in fabula (1979)",
            efecto: "Revierte la idea del lector pasivo: es el texto el que produce a su lector. La lectura es una forma de colaboracion prevista.",
            relacionados: ["semiotica", "hermeneutica"],
            autores: ["Eco", "Iser"]
        },

        // ============================================================
        // FILOSOFIA DEL LENGUAJE
        // ============================================================
        {
            id: "wittgenstein-1",
            categoria: "filosofia",
            termino: "Wittgenstein I: figura del mundo",
            etimologia: "Del aleman Bild: 'imagen', 'figura'.",
            definicion: "En el Tractatus Logico-Philosophicus (1921), Wittgenstein sostiene que el lenguaje figura el mundo: las proposiciones son imagenes logicas de los hechos. El limite del lenguaje es el limite del mundo.",
            ejemplo: "«De lo que no se puede hablar, hay que callar.» Lo que no se puede decir con sentido (lo etico, lo estetico, lo mistico) no se puede decir: se muestra.",
            fuente: "Wittgenstein, Tractatus Logico-Philosophicus (1921)",
            efecto: "Funda una vision logica y a la vez mistica del lenguaje. La filosofia no es doctrina: es actividad que aclara el pensamiento.",
            relacionados: ["wittgenstein-2", "limites"],
            autores: ["Wittgenstein", "Russell"]
        },
        {
            id: "wittgenstein-2",
            categoria: "filosofia",
            termino: "Wittgenstein II: juegos del lenguaje",
            etimologia: "Del aleman Sprachspiel: 'juego de lenguaje'.",
            definicion: "En las Investigaciones filosoficas (1953), Wittgenstein cambia de rumbo: el significado de una palabra es su uso en el lenguaje. No hay esencias: hay usos, contextos, juegos distintos que se parecen entre si (parecidos de familia).",
            ejemplo: "«Juego» no tiene una definicion unica: futbol, ajedrez, solitario, hacer el tonto. Todos son juegos, pero no comparten una sola esencia. Se parecen como los miembros de una familia.",
            fuente: "Wittgenstein, Investigaciones filosoficas (1953)",
            efecto: "Disuelve la idea de que el lenguaje tiene una esencia. Hablar es hacer algo, siempre en un contexto y con reglas.",
            relacionados: ["juegos-del-lenguaje", "uso"],
            autores: ["Wittgenstein", "Austin"]
        },
        {
            id: "actos-de-habla",
            categoria: "filosofia",
            termino: "Actos de habla (Austin, Searle)",
            etimologia: "Del ingles speech acts: 'actos del habla'.",
            definicion: "J. L. Austin y John Searle muestran que decir es hacer. Al hablar no solo describimos el mundo: realizamos acciones (prometer, ordenar, bautizar, agradecer). Hay actos locutivos (lo que se dice), ilocutivos (lo que se hace al decirlo) y perlocutivos (lo que se produce en el otro).",
            ejemplo: "Cuando digo «los declaro marido y mujer» no describo: hago. Cuando digo «te prometo que vendre» no informo: me comprometo.",
            fuente: "Austin, Como hacer cosas con palabras (1962)",
            efecto: "Revoluciona la filosofia del lenguaje: el lenguaje no solo representa el mundo, tambien lo transforma. Toda palabra es, en algun grado, accion.",
            relacionados: ["wittgenstein-2", "performativo"],
            autores: ["Austin", "Searle", "Habermas"]
        },
        {
            id: "implicatura",
            categoria: "filosofia",
            termino: "Implicatura (Grice)",
            etimologia: "Del latin implicare: 'enredar', 'envolver'.",
            definicion: "H. P. Grice muestra que en la conversacion no solo decimos lo que decimos: implicamos. Las implicaturas son significados que se sugieren sin decirse, guiados por el principio de cooperacion y sus maximas (cantidad, calidad, relacion, modo).",
            ejemplo: "A: «¿Vas a venir a la fiesta?» B: «Tengo mucho trabajo.» B no dice que no vendra, pero lo implica. La respuesta es cortes y clara a la vez.",
            fuente: "Grice, Logica y conversacion (1975)",
            efecto: "Explica por que entendemos tanto de lo que no se dice. La conversacion es un arte del sobreentendido.",
            relacionados: ["actos-de-habla", "pragmatica"],
            autores: ["Grice", "Sperber y Wilson"]
        },

        // ============================================================
        // ONTOLOGIA DEL LENGUAJE
        // ============================================================
        {
            id: "echeverria",
            categoria: "ontologia",
            termino: "Ontologia del lenguaje (Echeverria)",
            etimologia: "Del griego ontos: 'ser' y logos: 'estudio', 'palabra'.",
            definicion: "Rafael Echeverria propone que los seres humanos somos seres linguisticos: nos constituimos en el lenguaje. No habitamos el lenguaje como una herramienta: el lenguaje nos habita. Cambiar nuestra forma de hablar es cambiar nuestra forma de ser.",
            ejemplo: "Un psicologo no escucha 'solo palabras': escucha la forma en que un sujeto se constituye en su decir. La queja, la promesa, la declaracion son actos que configuran mundos.",
            fuente: "Echeverria, Ontologia del lenguaje (1994)",
            efecto: "Funda una vision pragmatica y transformadora del lenguaje. Todo acto linguistico es un acto de poder y de creacion de realidad.",
            relacionados: ["actos-de-habla", "heidegger"],
            autores: ["Echeverria", "Maturana", "Flores"]
        },
        {
            id: "heidegger",
            categoria: "ontologia",
            termino: "El lenguaje como casa del ser (Heidegger)",
            etimologia: "Del aleman Sprache: 'lengua', 'habla'.",
            definicion: "Martin Heidegger plantea que el lenguaje no es un instrumento del hombre: es la casa del ser. No hablamos el lenguaje: el lenguaje nos habla. La poesia es el modo originario del decir, porque en ella el ser se manifiesta.",
            ejemplo: "«El lenguaje es la casa del ser. En su morada habita el hombre.» La poesia de Holderlin, de Trakl, de Rilke, no describe: revela.",
            fuente: "Heidegger, Carta sobre el humanismo (1947)",
            efecto: "Desplaza al sujeto del centro: no somos dueños del lenguaje, somos sus huespedes. Escribir es escuchar antes que decir.",
            relacionados: ["echeverria", "hermeneutica"],
            autores: ["Heidegger", "Holderlin"]
        },
        {
            id: "gadamer",
            categoria: "ontologia",
            termino: "Hermeneutica (Gadamer)",
            etimologia: "Del griego hermeneutiké: 'arte de interpretar'.",
            definicion: "Hans-Georg Gadamer propone que comprender no es reconstruir la intencion del autor, sino fusionar horizontes: el del texto y el del interprete. Toda comprension es historica, situada, y a la vez productiva.",
            ejemplo: "Leer el Quijote hoy es distinto a leerlo en 1605. No leemos 'peor' ni 'mejor': leemos con otro horizonte. La verdad del texto no es anterior: se produce en el encuentro.",
            fuente: "Gadamer, Verdad y metodo (1960)",
            efecto: "Funda la hermeneutica filosofica. No hay lectura neutral: todo lector trae su historia y su prejuicio productivo.",
            relacionados: ["heidegger", "eco-lector"],
            autores: ["Gadamer", "Ricoeur"]
        },
        {
            id: "habermas",
            categoria: "ontologia",
            termino: "Accion comunicativa (Habermas)",
            etimologia: "Del latin actio y communicare.",
            definicion: "Jurgen Habermas propone que el lenguaje tiene una racionalidad propia: la busqueda del entendimiento. En la accion comunicativa, los hablantes buscan validez, no solo exito. Esta es la base de la democracia y de la esfera publica.",
            ejemplo: "Una conversacion que busca entendimiento (no solo vencer) presupone que el otro puede tener razon. Esta presuposicion es la base de toda etica del lenguaje.",
            fuente: "Habermas, Teoria de la accion comunicativa (1981)",
            efecto: "Politiza el lenguaje: hablar es actuar en el espacio publico. Toda palabra que busca entendimiento es un acto politico y etico.",
            relacionados: ["actos-de-habla", "echeverria"],
            autores: ["Habermas", "Apel"]
        }
    ];

    // ============================================================
    // EJERCICIOS
    // ============================================================
    var EJERCICIOS = [
        {
            tipo: "multiple",
            categoria: "diccion",
            pregunta: "¿Que figura consiste en la omision de elementos que el contexto permite sobreentender?",
            opciones: ["Hiperbaton", "Elipsis", "Pleonasmo", "Anafora"],
            correcta: 1,
            feedback: "La elipsis suprime lo que se sobreentiende. En «Por una mirada, un mundo», se elide el verbo: «(daria) por una mirada, un mundo»."
        },
        {
            tipo: "multiple",
            categoria: "pensamiento",
            pregunta: "«El hombre es mortal» por «los hombres son mortales» es un ejemplo de:",
            opciones: ["Metafora", "Metonimia", "Sinecdoque", "Antonomasia"],
            correcta: 2,
            feedback: "La sinecdoque sustituye el todo por la parte o la especie por el genero. Aqui, el individuo por la especie."
        },
        {
            tipo: "multiple",
            categoria: "pensamiento",
            pregunta: "«El sol de la tarde acariciaba la ciudad» es un ejemplo de:",
            opciones: ["Hipalage", "Oxymoron", "Aliteracion", "Anafora"],
            correcta: 0,
            feedback: "El hipalage traslada el adjetivo o el verbo de su sujeto logico a otro: no es el sol el que acaricia, somos nosotros los que sentimos la caricia."
        },
        {
            tipo: "completar",
            categoria: "linguistica",
            pregunta: "Complete la afirmacion de Chomsky: el lenguaje humano es ________, es decir, permite insertar estructuras dentro de estructuras del mismo tipo.",
            respuesta: "recursivo",
            alternativas: ["recursivo", "recursiva", "la recursion", "recursion"],
            feedback: "La recursion es la capacidad que permite producir oraciones infinitamente largas a partir de un sistema finito de reglas."
        },
        {
            tipo: "multiple",
            categoria: "semiotica",
            pregunta: "Segun Peirce, el humo que remite al fuego es un signo de tipo:",
            opciones: ["Icono", "Indice", "Simbolo", "Metafora"],
            correcta: 1,
            feedback: "El indice remite por contiguidad: el humo esta fisicamente ligado al fuego. El icono se parece; el simbolo, por convencion."
        },
        {
            tipo: "multiple",
            categoria: "filosofia",
            pregunta: "«Los declaro marido y mujer» es, segun Austin, un ejemplo de:",
            opciones: ["Acto locutivo", "Acto ilocutivo", "Acto perlocutivo", "Acto implicito"],
            correcta: 1,
            feedback: "Es un acto ilocutivo: al decir, se hace. La enunciacion misma constituye la accion."
        },
        {
            tipo: "multiple",
            categoria: "enunciacion",
            pregunta: "Segun Benveniste, el pronombre «yo» es:",
            opciones: [
                "Una palabra con significado fijo",
                "Un nombre propio disfrazado",
                "Un deictico que solo significa en el acto de enunciacion",
                "Una metafora del sujeto"
            ],
            correcta: 2,
            feedback: "«Yo» no significa nada fuera del acto en que alguien lo pronuncia. Es el deictico por excelencia: señala al sujeto que habla."
        },
        {
            tipo: "completar",
            categoria: "diccion",
            pregunta: "La figura que invierte el orden habitual de las palabras en la oracion se llama ________.",
            respuesta: "hiperbaton",
            alternativas: ["hiperbaton", "hiperbaton", "el hiperbaton"],
            feedback: "El hiperbaton altera el orden sintactico por razones ritmicas o expresivas: «Del monte en la ladera...»."
        },
        {
            tipo: "multiple",
            categoria: "ontologia",
            pregunta: "Segun Heidegger, el lenguaje es:",
            opciones: [
                "Un instrumento del hombre para comunicar",
                "La casa del ser",
                "Un sistema de signos arbitrarios",
                "Una facultad biologica innata"
            ],
            correcta: 1,
            feedback: "«El lenguaje es la casa del ser. En su morada habita el hombre.» No somos dueños del lenguaje: lo habitamos."
        },
        {
            tipo: "multiple",
            categoria: "filosofia",
            pregunta: "En el segundo Wittgenstein, el significado de una palabra es:",
            opciones: ["Su definicion esencial", "Su uso en el lenguaje", "Su referente externo", "Su etimologia"],
            correcta: 1,
            feedback: "«El significado de una palabra es su uso en el lenguaje.» No hay esencias: hay practicas, contextos, juegos."
        },
        {
            tipo: "multiple",
            categoria: "pensamiento",
            pregunta: "«La musica callada, la soledad sonora» es un ejemplo de:",
            opciones: ["Antitesis", "Oximoron", "Paradoja", "Retruecano"],
            correcta: 1,
            feedback: "El oximoron une dos terminos contradictorios: la musica no puede ser callada, la soledad no puede ser sonora. Y sin embargo, se entiende."
        },
        {
            tipo: "multiple",
            categoria: "semiotica",
            pregunta: "Segun Barthes, el mito se caracteriza por:",
            opciones: [
                "Decir la verdad oculta de las cosas",
                "Naturalizar lo historico, hacer pasar por obvio lo construido",
                "Opinar sin fundamento",
                "Ser una forma primitiva de pensamiento"
            ],
            correcta: 1,
            feedback: "El mito, para Barthes, convierte la historia en naturaleza. La ideologia se disfraza de sentido comun."
        }
    ];

    return {
        categorias: CATEGORIAS,
        fichas: FICHAS,
        ejercicios: EJERCICIOS
    };
})();
