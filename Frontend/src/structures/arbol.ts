/* Estructura de datos para representar un árbol n-ario
se usará para la estructura de la tienda en categorías*/

class NodoArbol<T> {
	valor: T;
	hijos: NodoArbol<T>[] = [];

	constructor(valor: T) {
		this.valor = valor;
	}
}

export class ArbolNario<T> {
	private raiz: NodoArbol<T> | null = null;

	agregarRaiz(valor: T) {
		if (!this.raiz) {
			this.raiz = new NodoArbol(valor);
		}

		return this.raiz;
	}

	agregarHijo(valorPadre: T, valorHijo: T) {
		const padre = this.buscarNodo(valorPadre);

		if (!padre) {
			return null;
		}

		const existente = padre.hijos.find((hijo) => hijo.valor === valorHijo);

		if (existente) {
			return existente;
		}

		const nuevo = new NodoArbol(valorHijo);
		padre.hijos.push(nuevo);
		return nuevo;
	}

	buscar(valor: T) {
		return this.buscarNodo(valor);
	}

	obtenerHijos(valorPadre: T): T[] {
		return this.buscarNodo(valorPadre)?.hijos.map((hijo) => hijo.valor) ?? [];
	}

	recorrerPreorden(visit: (valor: T) => void) {
		const recorrer = (nodo: NodoArbol<T> | null) => {
			if (!nodo) return;

			visit(nodo.valor);
			nodo.hijos.forEach((hijo) => recorrer(hijo));
		};

		recorrer(this.raiz);
	}

	obtenerNiveles(): T[][] {
		if (!this.raiz) return [];

		const niveles: T[][] = [];
		const cola: Array<{ nodo: NodoArbol<T>; nivel: number }> = [{ nodo: this.raiz, nivel: 0 }];

		while (cola.length > 0) {
			const { nodo, nivel } = cola.shift()!;

			if (!niveles[nivel]) {
				niveles[nivel] = [];
			}

			niveles[nivel].push(nodo.valor);

			nodo.hijos.forEach((hijo) => {
				cola.push({ nodo: hijo, nivel: nivel + 1 });
			});
		}

		return niveles;
	}

	private buscarNodo(valor: T): NodoArbol<T> | null {
		const recorrer = (nodo: NodoArbol<T> | null): NodoArbol<T> | null => {
			if (!nodo) return null;

			if (nodo.valor === valor) {
				return nodo;
			}

			for (const hijo of nodo.hijos) {
				const encontrado = recorrer(hijo);

				if (encontrado) {
					return encontrado;
				}
			}

			return null;
		};

		return recorrer(this.raiz);
	}
}