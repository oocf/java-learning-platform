export interface Lesson {
    id: string;
    title: string;
    objective: string;
    description: string;
    module: string;
}

export type StudentLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Module {
    id: string;
    title: string;
    level: StudentLevel;
    lessons: Lesson[];
}

const LEVEL_ORDER: StudentLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function isModuleUnlocked(moduleLevel: StudentLevel, studentLevel: StudentLevel | null | undefined): boolean {
    if (!studentLevel) return false;
    return LEVEL_ORDER.indexOf(studentLevel) >= LEVEL_ORDER.indexOf(moduleLevel);
}

export const curriculum: Module[] = [
    {
        id: "foundations",
        title: "Fundamentos de Java",
        level: "BEGINNER",
        lessons: [
            {
                id: "part0-intro",
                title: "Introducción a Java",
                objective: "Comprender qué es Java y por qué es útil.",
                description: "¡Bienvenido al mundo de Java! Aprenderás todo lo que necesitas sobre este poderoso lenguaje de programación.",
                module: "foundations"
            },
            {
                id: "syntax-basics",
                title: "¡Hola Java!",
                objective: "Comprender la estructura de una clase básica en Java y el método main.",
                description: "¡Bienvenido a Java! Todo programa comienza con una clase y un método especial 'main'. Veamos cómo saludar al mundo.",
                module: "foundations"
            },
            {
                id: "comments-and-style",
                title: "Notas para Humanos",
                objective: "Usar comentarios de línea y de bloque para documentar el código.",
                description: "El código lo lee una computadora, pero también otras personas (¡y tú mismo en el futuro!). Los comentarios // y /* */ explican el porqué.",
                module: "foundations"
            },
            {
                id: "variables-1",
                title: "La Metáfora de la Caja",
                objective: "Aprender a declarar e inicializar variables de tipo entero y cadena.",
                description: "Piensa en las variables como cajas con nombre donde guardas datos. En Java, debemos decir qué TIPO de dato guarda la caja.",
                module: "foundations"
            },
            {
                id: "arithmetic",
                title: "Haciendo Matemáticas",
                objective: "Dominar los operadores aritméticos básicos (+, -, *, /).",
                description: "Dejemos que Java haga el trabajo pesado. Las computadoras son excelentes con las matemáticas, pero debes conocer las reglas.",
                module: "foundations"
            },
            {
                id: "type-casting",
                title: "Cambiando de Caja",
                objective: "Convertir valores entre tipos numéricos (int, double) de forma segura.",
                description: "A veces una caja de enteros necesita convertirse en una caja de decimales, o viceversa. Aprende cuándo Java lo hace solo y cuándo debes pedirlo tú.",
                module: "foundations"
            },
            {
                id: "constants-final",
                title: "Cajas Selladas",
                objective: "Declarar constantes con la palabra clave 'final'.",
                description: "Algunos valores nunca deben cambiar, como el número de días en una semana. 'final' sella la caja para siempre.",
                module: "foundations"
            },
            {
                id: "boolean-logic",
                title: "Verdadero o Falso",
                objective: "Usar el tipo boolean y los operadores lógicos &&, || y !.",
                description: "Las computadoras toman decisiones con solo dos respuestas: verdadero o falso. Combínalas para crear condiciones más inteligentes.",
                module: "foundations"
            },
            {
                id: "scanner-input",
                title: "Escuchando al Usuario",
                objective: "Leer texto y números desde el teclado usando la clase Scanner.",
                description: "Un programa que solo habla y nunca escucha es aburrido. Usa Scanner para que tu programa converse con quien lo usa.",
                module: "foundations"
            }
        ]
    },
    {
        id: "strings-basics",
        title: "Trabajando con Texto",
        level: "BEGINNER",
        lessons: [
            {
                id: "string-concatenation",
                title: "Pegando Palabras",
                objective: "Unir cadenas de texto y variables usando el operador +.",
                description: "Construye frases combinando texto fijo con el contenido de tus variables, como armar una oración con piezas de Lego.",
                module: "strings-basics"
            },
            {
                id: "string-methods",
                title: "Herramientas para el Texto",
                objective: "Usar métodos comunes de String: length(), substring() e indexOf().",
                description: "Cada String trae consigo una caja de herramientas. Aprende a medir, cortar y buscar dentro de un texto.",
                module: "strings-basics"
            },
            {
                id: "string-comparison",
                title: "¿Son Iguales de Verdad?",
                objective: "Comparar cadenas correctamente con .equals() en vez de ==.",
                description: "Uno de los errores más comunes en Java: == compara cajas, .equals() compara el contenido. Aprende a no confundirlos.",
                module: "strings-basics"
            }
        ]
    },
    {
        id: "control-flow",
        title: "Toma de Decisiones",
        level: "BEGINNER",
        lessons: [
            {
                id: "if-else",
                title: "La Bifurcación en el Camino",
                objective: "Explicar cómo las sentencias if-else controlan el flujo del programa.",
                description: "Los programas no son solo líneas rectas. A veces necesitan elegir entre el Camino A y el Camino B.",
                module: "control-flow"
            },
            {
                id: "switch-statement",
                title: "El Menú de Opciones",
                objective: "Reemplazar cadenas largas de if-else con una sentencia switch.",
                description: "Cuando tienes muchas opciones posibles para una sola variable, switch ordena tu código como un menú de restaurante.",
                module: "control-flow"
            },
            {
                id: "loops-for",
                title: "Repite Conmigo",
                objective: "Explicar la estructura de un bucle 'for' para tareas repetitivas.",
                description: "Hacer las cosas una vez está bien, pero hacerlas 100 veces es donde brillan las computadoras. ¡Aprendamos a usar bucles!",
                module: "control-flow"
            },
            {
                id: "while-loop",
                title: "Repite Mientras Puedas",
                objective: "Usar un bucle 'while' cuando no se sabe de antemano cuántas repeticiones habrá.",
                description: "A veces no sabes cuántas vueltas necesitas hasta que algo cambie. 'while' repite mientras la condición siga siendo verdadera.",
                module: "control-flow"
            },
            {
                id: "do-while-loop",
                title: "Hazlo Primero, Pregunta Después",
                objective: "Usar un bucle 'do-while' que se ejecuta al menos una vez.",
                description: "A diferencia de 'while', 'do-while' garantiza que el bloque se ejecute una primera vez antes de comprobar la condición.",
                module: "control-flow"
            },
            {
                id: "nested-loops",
                title: "Bucles Dentro de Bucles",
                objective: "Combinar bucles anidados para recorrer estructuras de dos dimensiones.",
                description: "Un bucle dentro de otro bucle te permite dibujar patrones, tableros y tablas. Es como contar filas y columnas a la vez.",
                module: "control-flow"
            },
            {
                id: "break-continue",
                title: "Frenos de Emergencia",
                objective: "Controlar bucles con las palabras clave 'break' y 'continue'.",
                description: "A veces necesitas salir de un bucle antes de tiempo (break) o saltarte una vuelta (continue). Son los frenos y desvíos de tus repeticiones.",
                module: "control-flow"
            }
        ]
    },
    {
        id: "oop-intro",
        title: "Java Orientado a Objetos",
        level: "INTERMEDIATE",
        lessons: [
            {
                id: "classes-objects",
                title: "Planos y Casas",
                objective: "Comprender la diferencia entre una Clase y un Objeto.",
                description: "La POO es el corazón de Java. Aprende a crear tus propios tipos y objetos.",
                module: "oop-intro"
            },
            {
                id: "constructors",
                title: "Naciendo Listo",
                objective: "Escribir constructores para inicializar objetos al momento de crearlos.",
                description: "Un constructor es la receta que se ejecuta en el instante en que nace un objeto, dejándolo listo para usarse.",
                module: "oop-intro"
            },
            {
                id: "methods",
                title: "Dando Comportamiento a los Objetos",
                objective: "Aprender a definir y llamar métodos con parámetros.",
                description: "Los objetos no son solo datos; pueden HACER cosas. Vamos a escribir algunos métodos.",
                module: "oop-intro"
            },
            {
                id: "encapsulation",
                title: "Cajas Fuertes",
                objective: "Proteger los atributos de una clase con 'private' y exponerlos con getters y setters.",
                description: "No todo el mundo debería poder tocar los datos internos de un objeto directamente. Encapsular es guardar tus valores en una caja fuerte con una puerta controlada.",
                module: "oop-intro"
            },
            {
                id: "static-vs-instance",
                title: "Compartido vs. Personal",
                objective: "Distinguir entre miembros 'static' (de la clase) y miembros de instancia (de cada objeto).",
                description: "Algunos valores pertenecen a cada objeto individualmente; otros son compartidos por todos. 'static' marca lo que es de la clase entera.",
                module: "oop-intro"
            },
            {
                id: "this-keyword",
                title: "Hablando de Mí Mismo",
                objective: "Usar la palabra clave 'this' para referirse al objeto actual.",
                description: "Cuando un parámetro y un atributo se llaman igual, 'this' aclara: 'me refiero a MI propia variable, no al parámetro'.",
                module: "oop-intro"
            }
        ]
    },
    {
        id: "inheritance-polymorphism",
        title: "Herencia y Polimorfismo",
        level: "INTERMEDIATE",
        lessons: [
            {
                id: "inheritance-basics",
                title: "De Tal Padre, Tal Clase",
                objective: "Crear subclases que hereden atributos y métodos con 'extends'.",
                description: "Así como heredas rasgos de tus padres, una clase puede heredar comportamiento de otra clase usando 'extends'.",
                module: "inheritance-polymorphism"
            },
            {
                id: "method-overriding",
                title: "Reescribiendo la Herencia",
                objective: "Sobrescribir un método heredado con @Override para darle un comportamiento propio.",
                description: "Una subclase puede quedarse con el comportamiento del padre... o reescribirlo a su manera. @Override le avisa a Java que lo hiciste a propósito.",
                module: "inheritance-polymorphism"
            },
            {
                id: "method-overloading",
                title: "El Mismo Nombre, Distintas Formas",
                objective: "Definir múltiples métodos con el mismo nombre pero diferentes parámetros.",
                description: "Java permite que varios métodos compartan nombre si reciben cosas distintas, como una palabra que cambia de significado según el contexto.",
                module: "inheritance-polymorphism"
            },
            {
                id: "polymorphism",
                title: "Muchas Formas, Un Nombre",
                objective: "Comprender el polimorfismo: tratar objetos de distintas subclases a través de un tipo común.",
                description: "Polimorfismo significa 'muchas formas'. Un mismo tipo de referencia puede comportarse distinto según el objeto real que contenga.",
                module: "inheritance-polymorphism"
            },
            {
                id: "abstract-classes",
                title: "Planos Incompletos a Propósito",
                objective: "Crear clases abstractas que definen una estructura sin implementar todo el comportamiento.",
                description: "Una clase abstracta es un plano a medio terminar: obliga a las subclases a completar las partes que faltan.",
                module: "inheritance-polymorphism"
            },
            {
                id: "interfaces",
                title: "Contratos de Comportamiento",
                objective: "Definir e implementar interfaces para establecer un contrato entre clases.",
                description: "Una interfaz es una promesa: 'cualquier clase que me implemente, sabrá hacer esto'. Es un contrato de comportamiento.",
                module: "inheritance-polymorphism"
            }
        ]
    },
    {
        id: "exception-handling",
        title: "Manejo de Errores",
        level: "INTERMEDIATE",
        lessons: [
            {
                id: "try-catch",
                title: "Redes de Seguridad",
                objective: "Capturar errores en tiempo de ejecución con bloques try-catch.",
                description: "Los errores pasan. Un bloque try-catch es la red de seguridad que evita que tu programa se caiga por completo.",
                module: "exception-handling"
            },
            {
                id: "multiple-catch-finally",
                title: "Pase lo que Pase",
                objective: "Manejar distintos tipos de excepción y usar 'finally' para código que siempre se ejecuta.",
                description: "No todos los errores son iguales, así que puedes atraparlos por tipo. Y 'finally' se ejecuta pase lo que pase, haya error o no.",
                module: "exception-handling"
            },
            {
                id: "custom-exceptions",
                title: "Creando tus Propios Errores",
                objective: "Definir una excepción personalizada extendiendo la clase Exception.",
                description: "A veces los errores de Java no describen bien el problema de tu aplicación. Crea tu propia excepción con un nombre y mensaje claros.",
                module: "exception-handling"
            }
        ]
    },
    {
        id: "data-structures",
        title: "Almacenando Listas",
        level: "ADVANCED",
        lessons: [
            {
                id: "arrays-basics",
                title: "Colecciones Fijas",
                objective: "Inicializar y acceder a elementos en un array estándar de Java.",
                description: "Cuando una variable no es suficiente, usa un array para guardar un grupo de elementos del mismo tipo.",
                module: "data-structures"
            },
            {
                id: "arraylist-intro",
                title: "Listas Dinámicas",
                objective: "Usar ArrayList para colecciones que pueden crecer y encogerse.",
                description: "Los arrays estándar tienen un tamaño fijo, pero los ArrayLists son flexibles. Veamos por qué son tan populares.",
                module: "data-structures"
            },
            {
                id: "hashmap-intro",
                title: "Diccionarios de Clave y Valor",
                objective: "Guardar y recuperar datos por clave usando HashMap.",
                description: "Un HashMap es como un diccionario real: buscas una palabra (clave) y obtienes su significado (valor) al instante.",
                module: "data-structures"
            },
            {
                id: "hashset-intro",
                title: "Sin Repetidos",
                objective: "Usar HashSet para almacenar colecciones sin elementos duplicados.",
                description: "Cuando lo único que importa es que un elemento no se repita, HashSet se encarga de eso automáticamente.",
                module: "data-structures"
            },
            {
                id: "iterating-collections",
                title: "Recorriendo Colecciones",
                objective: "Recorrer listas, sets y mapas con for-each e Iterator.",
                description: "Ya tienes tus datos guardados; ahora aprende las formas más limpias de visitarlos uno por uno.",
                module: "data-structures"
            },
            {
                id: "generics-intro",
                title: "Cajas para Cualquier Tipo",
                objective: "Comprender los tipos genéricos como List<T> y por qué evitan errores de tipo.",
                description: "Los genéricos permiten que una misma clase funcione con distintos tipos de datos, manteniendo la seguridad de tipos en tiempo de compilación.",
                module: "data-structures"
            }
        ]
    },
    {
        id: "advanced-java",
        title: "Java Moderno",
        level: "ADVANCED",
        lessons: [
            {
                id: "lambda-expressions",
                title: "Funciones al Vuelo",
                objective: "Escribir expresiones lambda para representar comportamiento como un valor.",
                description: "Las lambdas te permiten pasar un pequeño bloque de comportamiento como si fuera un dato más, sin escribir una clase entera.",
                module: "advanced-java"
            },
            {
                id: "streams-intro",
                title: "Procesando Datos en Cadena",
                objective: "Filtrar, transformar y recolectar datos usando la Stream API.",
                description: "En vez de bucles manuales, los Streams te dejan describir QUÉ quieres hacer con tus datos: filtrar, transformar, sumar, en una sola cadena de pasos.",
                module: "advanced-java"
            },
            {
                id: "file-io-basics",
                title: "Leyendo y Escribiendo Archivos",
                objective: "Leer y escribir texto en archivos usando las clases del paquete java.io.",
                description: "Los programas útiles necesitan recordar cosas más allá de una ejecución. Aprende a guardar y leer datos desde archivos de texto.",
                module: "advanced-java"
            },
            {
                id: "recursion",
                title: "Funciones que se Llaman a Sí Mismas",
                objective: "Escribir métodos recursivos y comprender su caso base.",
                description: "Un método recursivo resuelve un problema llamándose a sí mismo con una versión más pequeña del problema, hasta llegar a un caso base.",
                module: "advanced-java"
            }
        ]
    }
];
