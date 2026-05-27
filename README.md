# Proyecto-Estructuras - FarmaciaR

### Autores
- Sharon Zuray Abella Diaz
- Alan Basante
- Yenaro Samuel Gracia Ruiz

## Alcance del sistema y tecnologías utilizadas

### Alcance del sistema
Este proyecto implementa una tienda en línea de medicamentos con funcionalidades clave:
- Navegación por categorías de productos.
- Búsqueda con autocompletado y historial de búsquedas.
- Carrito de compras y proceso de checkout.
- Páginas de producto y detalle, perfil de usuario y autenticación.
- Panel de administración (gestión de stock, promociones, pedidos).
- Recomendaciones y relaciones entre productos.

Los componentes principales están en `Frontend/src` (UI, hooks, servicios) y la configuración de backend/DB en la carpeta `firebase`.

### Tecnologías y herramientas
- Frontend: React + TypeScript, bundler Vite.
- Estilos: CSS / SCSS y módulos CSS.
- Autenticación y base de datos: Firebase (Firestore).
- Linter: ESLint (configuración en `Frontend/eslint.config.js`).
- Gestor de paquetes: npm (`Frontend/package.json`).

---

## Estructuras de datos implementadas y por qué se eligieron

Se describen a continuación las estructuras implementadas, su propósito en el sistema, complejidad y razones de diseño.

- **Árbol n-ario — `ArbolNario<T>`**
	- Implementación: [Frontend/src/structures/arbol.ts](Frontend/src/structures/arbol.ts#L1-L105)
	- Uso: Representa la jerarquía de categorías (ver [Frontend/src/hooks/useCategorias.ts](Frontend/src/hooks/useCategorias.ts#L1-L40)).
	- Por qué: Las categorías son jerárquicas; un árbol n-ario facilita recorridos y obtención por niveles.

- **Trie — `Trie`**
	- Implementación: [Frontend/src/structures/trie.ts](Frontend/src/structures/trie.ts#L1-L65)
	- Uso: Autocompletado y búsqueda por prefijo (ver [Frontend/src/hooks/useBusqueda.ts](Frontend/src/hooks/useBusqueda.ts#L1-L60)).
	- Por qué: Consultas de prefijo eficientes (proporcionales a la longitud del prefijo), ideal para sugerencias en tiempo real.

- **Pila — `Pila<T>`**
	- Implementación: [Frontend/src/structures/pila.ts](Frontend/src/structures/pila.ts#L1-L35)
	- Uso: Historial de búsquedas recientes (ver [Frontend/src/hooks/useHistorial.ts](Frontend/src/hooks/useHistorial.ts#L1-L60)).
	- Por qué: Comportamiento LIFO apropiado para historial reciente; operaciones O(1).

- **Lista circular doble — `ListaCircularDoble<T>`**
	- Implementación: [Frontend/src/structures/listaCircular.ts](Frontend/src/structures/listaCircular.ts#L1-L52)
	- Uso: Lógica de carousel/rotador (ver [Frontend/src/hooks/useCarousel.ts](Frontend/src/hooks/useCarousel.ts#L1-L40)).
	- Por qué: Permite avanzar/retroceder de forma constante (O(1)) y mantener un elemento "actual" rotativo.

- **Grafo — `Grafo<T>` (lista de adyacencia)**
	- Implementación: [Frontend/src/structures/grafo.ts](Frontend/src/structures/grafo.ts#L1-L53)
	- Uso: Relaciones y recomendaciones entre productos (referenciado en [Frontend/src/helpers/relaciones.ts](Frontend/src/helpers/relaciones.ts#L1-L10)).
	- Por qué: Modela sustitutos/complementos y permite búsquedas por BFS para hallar vecinos y rutas alternativas.

- **Heap (montículo) — `Heap<T>`**
	- Implementación: [Frontend/src/structures/heap.ts](Frontend/src/structures/heap.ts#L1-L99)
	- Uso prevista: Gestión de prioridades (e.g., top-K por baja existencia) en panel admin.
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