/*Archivo para la estructura de datos de un heap
se puede usar en la página del administrador para
abastecimiento de stock, arriba sección de medicamentos 
sin stock o cerca de acabarse*/

export class Heap<T> {
	private elementos: T[] = [];
	private comparar: (a: T, b: T) => number;

	constructor(comparar: (a: T, b: T) => number) {
		this.comparar = comparar;
	}

	insertar(valor: T) {
		this.elementos.push(valor);
		this.subir(this.elementos.length - 1);
	}

	extraer(): T | undefined {
		if (this.elementos.length === 0) return undefined;

		const raiz = this.elementos[0];
		const ultimo = this.elementos.pop();

		if (this.elementos.length > 0 && ultimo !== undefined) {
			this.elementos[0] = ultimo;
			this.bajar(0);
		}

		return raiz;
	}

	verTope(): T | undefined {
		return this.elementos[0];
	}

	obtenerElementos(): T[] {
		return [...this.elementos];
	}

	obtenerOrdenados(): T[] {
		const copia = new Heap<T>(this.comparar);
		this.elementos.forEach((elemento) => copia.insertar(elemento));

		const resultado: T[] = [];
		let actual = copia.extraer();

		while (actual !== undefined) {
			resultado.push(actual);
			actual = copia.extraer();
		}

		return resultado;
	}

	estaVacio(): boolean {
		return this.elementos.length === 0;
	}

	private subir(indice: number) {
		let actual = indice;

		while (actual > 0) {
			const padre = Math.floor((actual - 1) / 2);

			if (this.comparar(this.elementos[actual], this.elementos[padre]) >= 0) {
				break;
			}

			[this.elementos[actual], this.elementos[padre]] = [this.elementos[padre], this.elementos[actual]];
			actual = padre;
		}
	}

	private bajar(indice: number) {
		let actual = indice;

		while (true) {
			const izquierda = actual * 2 + 1;
			const derecha = actual * 2 + 2;
			let menor = actual;

			if (izquierda < this.elementos.length && this.comparar(this.elementos[izquierda], this.elementos[menor]) < 0) {
				menor = izquierda;
			}

			if (derecha < this.elementos.length && this.comparar(this.elementos[derecha], this.elementos[menor]) < 0) {
				menor = derecha;
			}

			if (menor === actual) {
				break;
			}

			[this.elementos[actual], this.elementos[menor]] = [this.elementos[menor], this.elementos[actual]];
			actual = menor;
		}
	}
}