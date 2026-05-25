/* Archivo para la estructura de datos de una pila
se usará para el historial de búsquedas recientes*/

export class Pila<T> {
	private elementos: T[] = [];

	apilar(valor: T) {
		this.elementos.push(valor);
	}

	desapilar(): T | undefined {
		return this.elementos.pop();
	}

	verTope(): T | undefined {
		return this.elementos[this.elementos.length - 1];
	}

	estaVacia(): boolean {
		return this.elementos.length === 0;
	}

	obtenerElementos(): T[] {
		return [...this.elementos].reverse();
	}

	limpiar() {
		this.elementos = [];
	}

	obtenerLongitud(): number {
		return this.elementos.length;
	}
}
