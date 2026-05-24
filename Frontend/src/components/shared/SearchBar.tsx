import { useBusqueda } from "../../hooks/useBusqueda";
import styles from "./SearchBar.module.scss";

interface Props {
  data: any[];
  onSearch: (query: string) => void; // ← nuevo
}

export default function SearchBar({ data, onSearch }: Props) {
  const { query, resultados, buscar, seleccionar, submit, dropdown } = useBusqueda(data);

  const handleSumit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query); 
    submit();
  };

  const handleSeleccionar = (res: string) => {
    seleccionar(res);
    onSearch(res); 
  };

  const handleBuscar = (texto: string) => {
    buscar(texto);
    onSearch(texto); 
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSumit}>
        <div className="search">
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={query}
            onChange={(e) => handleBuscar(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Buscar</button>
        </div>
      </form>

      {dropdown && resultados.length > 0 && (
        <div className={styles.dropdown}>
          {resultados.map((res, index) => (
            <div
              key={index}
              className={styles.item}
              onClick={() => handleSeleccionar(res)} // ← actualizado
            >
              {res}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}