import Carousel from "../../components/shared/Carousel";
import { usePromociones } from "../../hooks/usePromociones";
import { useMedicamentos } from "../../hooks/useMedicamento";
import CardMedicamento from "../../components/index/CardMedicamento";
import SearchBar from "../../components/shared/SearchBar";
import Navbar from "../../components/shared/Navbar";

import styles from "./Home.module.scss";

export default function Home() {
  const { data: promociones } = usePromociones<any>();
  const { data: medicamentos, loading } = useMedicamentos();

  return (
    <div className={styles.container}>
      <section>
        <Navbar />
      </section>
      <section>
        <SearchBar data={medicamentos} />
      </section>
      <section className={styles.carousel}>
        <Carousel data={promociones} />
      </section>

      <section className={styles.products}>
        <h2>Medicamentos disponibles</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className={styles.grid}>
            {medicamentos.map(med => (
              <CardMedicamento key={med.id} medicamento={med} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}