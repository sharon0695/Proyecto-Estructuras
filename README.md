# Proyecto-Estructuras - FarmaciaR

### Autores
- Sharon Zuray Abella Diaz
- Alan Basante
- Yenaro Samuel Gracia Ruiz

### Enlaces del proyecto
- [Figma / Propuesta grafica](https://latte-erupt-11514629.figma.site)
- [Enlace a Netlify](https://farmaciar.netlify.app/)
- Rama definitiva: main

## Descripción general del proyecto
FarmaciaR es un ecommerce de farmacia diseñado para facilitar la búsqueda, comparación y compra de medicamentos desde una interfaz clara y rápida. La plataforma organiza productos por categorías, permite consultar detalle de cada medicamento, gestionar el carrito y administrar el stock desde un panel de control.

La propuesta busca ser útil tanto para el usuario final como para la gestión interna del negocio. En comparación con otras soluciones más genéricas, esta plataforma se enfoca específicamente en el flujo de compra farmacéutico, prioriza una navegación simple y aprovecha una arquitectura ligera con actualizaciones en tiempo real para mostrar stock vigente y respuestas inmediatas en el carrito.

Por eso, la plataforma resulta una buena opción: reduce fricción en la búsqueda de productos, mejora la experiencia de compra con notificaciones claras y mantiene sincronizado el inventario, lo que ayuda a evitar errores y a tomar decisiones más rápidas.

## Alcance del sistema y tecnologías utilizadas

### Alcance del sistema
Este proyecto implementa una tienda en línea de medicamentos con funcionalidades clave:
- Navegación por categorías de productos.
- Búsqueda con autocompletado y historial de búsquedas.
- Carrito de compras y proceso de checkout.
- Páginas de producto y detalle, perfil de usuario y autenticación.
- Panel de administración (gestión de stock, promociones, pedidos).
- Recomendaciones y relaciones entre productos.

La base de datos en tiempo real se utilizó para la actualización del stock mediante Firestore y la suscripción en vivo con `onSnapshot`, lo que permite que el panel y el catálogo reflejen los cambios apenas ocurren. También se usó `toast` con `sonner` para mostrar la notificación que aparece en el carrito cada vez que se añaden productos, confirmando la acción de forma inmediata al usuario.

Los componentes principales están en `Frontend/src` (UI, hooks, servicios) y la configuración de backend/DB en la carpeta `firebase`.

### Tecnologías y herramientas
- Frontend: React + TypeScript, bundler Vite.
- Estilos: CSS / SCSS y módulos CSS.
- Autenticación y base de datos: Firebase (Firestore en tiempo real con `onSnapshot`).
- Notificaciones de interfaz: `sonner` para toasts del carrito y acciones relevantes.
- Linter: ESLint (configuración en `Frontend/eslint.config.js`).
- Gestor de paquetes: npm (`Frontend/package.json`).

### Organización del trabajo
No dividimos las ramas por integrante, sino por funcionalidades. Esa decisión hizo más cómodo el desarrollo porque cada rama se enfocó en una parte concreta del sistema, como carrito, autenticación, catálogo, stock o recomendaciones, lo que facilitó integrar cambios sin mezclar demasiadas responsabilidades en una sola rama.

---

## Estructuras de datos implementadas y por qué se eligieron

Se describen a continuación las estructuras implementadas, su propósito en el sistema, complejidad y razones de diseño.

- **Árbol n-ario — `ArbolNario<T>`**
	- Implementación: [Frontend/src/structures/arbol.ts](Frontend/src/structures/arbol.ts#L1-L105)
	- Uso: Representa la jerarquía de categorías de la farmacia, permitiendo organizar productos por ramas principales y subcategorías. Esto facilita construir menús, filtrar resultados y recorrer la tienda de forma estructurada desde los hooks de categorías (ver [Frontend/src/hooks/useCategorias.ts](Frontend/src/hooks/useCategorias.ts#L1-L40)).
	- Por qué: Las categorías son jerárquicas; un árbol n-ario facilita recorridos y obtención por niveles.

- **Trie — `Trie`**
	- Implementación: [Frontend/src/structures/trie.ts](Frontend/src/structures/trie.ts#L1-L65)
	- Uso: Soporta el autocompletado del buscador y la búsqueda por prefijo de medicamentos. Gracias a esta estructura, el sistema puede sugerir coincidencias en tiempo real mientras el usuario escribe, mejorando la experiencia de búsqueda y reduciendo el tiempo para encontrar productos (ver [Frontend/src/hooks/useBusqueda.ts](Frontend/src/hooks/useBusqueda.ts#L1-L60)).
	- Por qué: Consultas de prefijo eficientes (proporcionales a la longitud del prefijo), ideal para sugerencias en tiempo real.

- **Pila — `Pila<T>`**
	- Implementación: [Frontend/src/structures/pila.ts](Frontend/src/structures/pila.ts#L1-L35)
	- Uso: Guarda el historial de búsquedas recientes para recuperar rápidamente los últimos medicamentos consultados por el usuario. Al funcionar en orden LIFO, la búsqueda más reciente queda al inicio del historial y se puede mostrar o reutilizar fácilmente desde el hook correspondiente (ver [Frontend/src/hooks/useHistorial.ts](Frontend/src/hooks/useHistorial.ts#L1-L60)).
	- Por qué: Comportamiento LIFO apropiado para historial reciente; operaciones O(1).

- **Lista circular doble — `ListaCircularDoble<T>`**
	- Implementación: [Frontend/src/structures/listaCircular.ts](Frontend/src/structures/listaCircular.ts#L1-L52)
	- Uso: Permite administrar el carrusel de productos o elementos destacados, avanzando y retrocediendo entre tarjetas sin perder la referencia al elemento actual. Esto hace posible un rotador continuo, fluido y reutilizable dentro del hook del carrusel (ver [Frontend/src/hooks/useCarousel.ts](Frontend/src/hooks/useCarousel.ts#L1-L40)).
	- Por qué: Permite avanzar/retroceder de forma constante (O(1)) y mantener un elemento "actual" rotativo.

- **Grafo — `Grafo<T>` (lista de adyacencia)**
	- Implementación: [Frontend/src/structures/grafo.ts](Frontend/src/structures/grafo.ts#L1-L53)
	- Uso: Modela relaciones entre medicamentos para generar recomendaciones, buscar sustitutos o encontrar productos cercanos cuando un artículo no está disponible. La representación por adyacencia permite recorrer conexiones de forma natural y aplicar búsquedas en amplitud para obtener alternativas relacionadas (referenciado en [Frontend/src/helpers/relaciones.ts](Frontend/src/helpers/relaciones.ts#L1-L10)).
	- Por qué: Modela sustitutos/complementos y permite búsquedas por BFS para hallar vecinos y rutas alternativas.

- **Heap (montículo) — `Heap<T>`**
	- Implementación: [Frontend/src/structures/heap.ts](Frontend/src/structures/heap.ts#L1-L99)
	- Uso prevista: Sirve para priorizar elementos según su nivel de urgencia, por ejemplo medicamentos con poco stock o listas de atención administrativa donde importa extraer primero el elemento más relevante. Esto lo vuelve útil para paneles de control que necesiten ordenar y recuperar rápidamente prioridades.
	- Por qué: Operaciones de prioridad eficientes; insertar/extraer O(log n), peek O(1).

### Decisiones de diseño
- Se priorizó simplicidad y claridad en las implementaciones TypeScript para facilitar mantenimiento y pruebas.
- Se usaron estructuras con comportamiento O(1) o proporcional a la entrada relevante (longitud del prefijo, vecinos inmediatos) para optimizar experiencia de usuario.
- Normalización de texto en `Trie` para manejo de acentos y búsquedas case-insensitive.

---

## Referencias rápidas
- Árbol categorías: [Frontend/src/structures/arbol.ts](Frontend/src/structures/arbol.ts#L1-L105)
- Trie / Autocomplete: [Frontend/src/structures/trie.ts](Frontend/src/structures/trie.ts#L1-L65)
- Pila / Historial: [Frontend/src/structures/pila.ts](Frontend/src/structures/pila.ts#L1-L35)
- Lista circular / Carousel: [Frontend/src/structures/listaCircular.ts](Frontend/src/structures/listaCircular.ts#L1-L52)
- Grafo / Relaciones: [Frontend/src/structures/grafo.ts](Frontend/src/structures/grafo.ts#L1-L53)
- Heap / Prioridad: [Frontend/src/structures/heap.ts](Frontend/src/structures/heap.ts#L1-L99)

---