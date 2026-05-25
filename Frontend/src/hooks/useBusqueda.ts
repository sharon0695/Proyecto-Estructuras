import { useMemo, useState } from "react";
import { Trie } from "../structures/trie";

export function useBusqueda(data: any[]) {
    const trie = useMemo(() => {
        const nuevoTrie = new Trie();

        data.forEach(item => {
            if (item?.nombre) {
                nuevoTrie.insertar(item.nombre);
            }
        });

        return nuevoTrie;
    }, [data]);

    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<string[]>([]);
    const [dropdown, setDropdown] = useState(false);

    const buscar = (texto: string) => {
        setQuery(texto);

        if (texto.length === 0) {
            setResultados([]);
            setDropdown(false);
            return;
        }

        const res = trie.buscarPrefijo(texto);
        setResultados(res);
        setDropdown(true);
    }

    const seleccionar = (texto: string) => {
        setQuery(texto)
        setResultados([])
        setDropdown(false)
    }

    const submit = () => {
        setDropdown(false)
    }
    const limpiar = () => {
        setQuery("");
        setResultados([]);
        setDropdown(false);
    };

    return {
        query,
        resultados,
        buscar,
        seleccionar,
        submit,
        dropdown,
        limpiar, 
    };
}