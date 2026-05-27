class NodoTrie {
    valor: string | null
    hijos: Map<string, NodoTrie> 
    isEndOfWord: boolean 
    constructor(valor: string | null) {{
        this.valor = valor
        this.hijos = new Map<string, NodoTrie>()
        this.isEndOfWord = false
    }}
}

function normalizarTexto(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

export class Trie {
    root: NodoTrie
    constructor() {
        this.root = new NodoTrie(null)
    }

    insertar(palabra: string) {
        let nodo = this.root;
        const texto = normalizarTexto(palabra);

        for (const letra of texto) {
            if (!nodo.hijos.has(letra)) {
                nodo.hijos.set(letra, new NodoTrie(letra));
            }
            nodo = nodo.hijos.get(letra)!;
        }

        nodo.isEndOfWord = true;
    }

    buscarPrefijo(prefijo: string): string[] {
        let nodo = this.root;
        const texto = normalizarTexto(prefijo);

        for (const letra of texto) {
            if (!nodo.hijos.has(letra)) return [];
            nodo = nodo.hijos.get(letra)!;
        }

        return Array.from(new Set(this.obtenerPalabras(nodo, texto)));
    }

    private obtenerPalabras(nodo: NodoTrie, prefijo: string): string[] {
        let resultados: string[] = [];

        if (nodo.isEndOfWord) resultados.push(prefijo);

        for (const [letra, hijo] of nodo.hijos) {
            resultados = resultados.concat(
                this.obtenerPalabras(hijo, prefijo + letra)
            );
        }

        return resultados;
    }
}