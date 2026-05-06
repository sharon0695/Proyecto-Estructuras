import { useBusqueda } from "../../hooks/useBusqueda";
import styles from "./SearchBar.module.scss";

interface Props {
  data: any[];
}

export default function SearchBar({ data }: Props) {
  const { query, resultados, buscar, seleccionar, submit, dropdown } = useBusqueda(data);

  const handleSumit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSumit}>
        <div className="search">
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={query}
            onChange={(e) => buscar(e.target.value)}
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
              onClick={() => seleccionar(res)}
            >
              {res}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}