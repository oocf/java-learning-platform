export interface Lesson {
    id: string;
    title: string;
    objective: string;
    description: string;
    module: string;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export const curriculum: Module[] = [
    {
        id: "foundations",
        title: "Fundamentos de Java",
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
            }
        ]
    },
    {
        id: "control-flow",
        title: "Toma de Decisiones",
        lessons: [
            {
                id: "if-else",
                title: "La Bifurcación en el Camino",
                objective: "Explicar cómo las sentencias if-else controlan el flujo del programa.",
                description: "Los programas no son solo líneas rectas. A veces necesitan elegir entre el Camino A y el Camino B.",
                module: "control-flow"
            },
            {
                id: "loops-for",
                title: "Repite Conmigo",
                objective: "Explicar la estructura de un bucle 'for' para tareas repetitivas.",
                description: "Hacer las cosas una vez está bien, pero hacerlas 100 veces es donde brillan las computadoras. ¡Aprendamos a usar bucles!",
                module: "control-flow"
            }
        ]
    },
    {
        id: "oop-intro",
        title: "Java Orientado a Objetos",
        lessons: [
            {
                id: "classes-objects",
                title: "Planos y Casas",
                objective: "Comprender la diferencia entre una Clase y un Objeto.",
                description: "La POO es el corazón de Java. Aprende a crear tus propios tipos y objetos.",
                module: "oop-intro"
            },
            {
                id: "methods",
                title: "Dando Comportamiento a los Objetos",
                objective: "Aprender a definir y llamar métodos con parámetros.",
                description: "Los objetos no son solo datos; pueden HACER cosas. Vamos a escribir algunos métodos.",
                module: "oop-intro"
            }
        ]
    },
    {
        id: "data-structures",
        title: "Almacenando Listas",
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
            }
        ]
    }
];
