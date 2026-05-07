export class Grafo<T> {
    private adjList: Map<T, Set<T>> = new Map();

    agregarNodo(nodo: T) {
        if (!this.adjList.has(nodo)) {
            this.adjList.set(nodo, new Set());
        }
    }

    agregarArista(a: T, b: T) {
        this.agregarNodo(a);
        this.agregarNodo(b);

        this.adjList.get(a)!.add(b);
        this.adjList.get(b)!.add(a);
    }

    obtenerVecinos(nodo: T): T[] {
        return Array.from(this.adjList.get(nodo) || []);
    }

    estanConectados(a: T, b: T): boolean {
        return this.adjList.get(a)?.has(b) || false;
    }

    buscarCercanos(inicio: T, limite: number = 2): T[] {
        const visitados = new Set<T>();
        const cola: [T, number][] = [[inicio, 0]];
        const resultado: T[] = [];

        while (cola.length > 0) {
            const [actual, nivel] = cola.shift()!;

            if (nivel > limite) break;

            if (!visitados.has(actual)) {
                visitados.add(actual);

                if (nivel > 0) {
                    resultado.push(actual);
                }

                const vecinos = this.adjList.get(actual) || new Set();

                vecinos.forEach(vecino => {
                    cola.push([vecino, nivel + 1]);
                });
            }
        }

        return resultado;
    }
}