class Nodo<T> {
  valor: T;
  siguiente: Nodo<T> | null = null;
  anterior: Nodo<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class ListaCircularDoble<T> {
  private cabeza: Nodo<T> | null = null;
  private actual: Nodo<T> | null = null;

  insertar(valor: T): void {
    const nuevo = new Nodo(valor);

    if (!this.cabeza) {
      this.cabeza = nuevo;
      nuevo.siguiente = nuevo;
      nuevo.anterior = nuevo;
      this.actual = nuevo;
      return;
    }

    const ultimo = this.cabeza.anterior!;

    ultimo.siguiente = nuevo;
    nuevo.anterior = ultimo;

    nuevo.siguiente = this.cabeza;
    this.cabeza.anterior = nuevo;
  }

  siguiente(): T | null {
    if (!this.actual) return null;

    this.actual = this.actual.siguiente;
    return this.actual?.valor || null;
  }

  anterior(): T | null {
    if (!this.actual) return null;

    this.actual = this.actual.anterior;
    return this.actual?.valor || null;
  }

  obtenerActual(): T | null {
    return this.actual?.valor || null;
  }
}