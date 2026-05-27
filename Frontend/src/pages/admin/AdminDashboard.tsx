import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMedicamentos } from "../../hooks/useMedicamento";
import { Heap } from "../../structures/heap";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/shared/Navbar";
import styles from "./AdminDashboard.module.scss";
import { updateMedicamentoStock } from "../../services/medicamentos.service";

function formatPrice(value: unknown) {
  const numeric = Number(value ?? 0);
  return `$${numeric.toFixed(2)}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: medicamentos, loading } = useMedicamentos();
  const [draftStocks, setDraftStocks] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setDraftStocks(
      medicamentos.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = Number(item.stock ?? 0);
        return acc;
      }, {})
    );
  }, [medicamentos]);

  const lowStock = useMemo(() => {
    const heap = new Heap<typeof medicamentos[number]>((a, b) => Number(a.stock) - Number(b.stock));
    medicamentos.forEach((item) => heap.insertar(item));

    return heap.obtenerOrdenados().slice(0, 8);
  }, [medicamentos]);

  const saveStock = async (medicamentoId: string) => {
    const nextStock = Number(draftStocks[medicamentoId] ?? 0);

    if (Number.isNaN(nextStock) || nextStock < 0) {
      alert('El stock debe ser 0 o mayor');
      return;
    }

    try {
      setSavingId(medicamentoId);
      await updateMedicamentoStock(medicamentoId, nextStock);
      alert('Stock actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el stock');
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading) {
    return <div style={{ padding: 32 }}>Cargando panel administrativo...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/Home" replace />;
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <span className={styles.kicker}>Panel administrativo</span>
            <h1>Stock de productos</h1>
            <p>Revisa todos los medicamentos y cambia su stock disponible desde una sola pantalla.</p>
          </div>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/Home')}>
            Volver al catálogo
          </button>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Productos con stock más bajo</h2>
            <span>Usando heap de prioridad</span>
          </div>

          {loading ? (
            <p>Cargando medicamentos...</p>
          ) : (
            <div className={styles.lowStockList}>
              {lowStock.map((item) => (
                <article key={item.id} className={styles.lowStockCard}>
                  <img src={item.imagen} alt={item.nombre} />
                  <div className={styles.lowStockInfo}>
                    <strong>{item.nombre}</strong>
                    <span>{item.categoria}</span>
                  </div>
                  <div className={styles.lowStockData}>
                    <strong>{item.stock}</strong>
                    <span>{formatPrice(item.precio)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Editar stock de todos los productos</h2>
            <span>Actualización directa en Firestore</span>
          </div>

          {loading ? (
            <p>Cargando medicamentos...</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.stockTable}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock actual</th>
                    <th>Editar stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentos.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.productCell}>
                          <img src={item.imagen} alt={item.nombre} />
                          <div>
                            <strong>{item.nombre}</strong>
                            <span>{formatPrice(item.precio)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.categoria}</td>
                      <td>{item.stock}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          value={draftStocks[item.id] ?? item.stock}
                          onChange={(event) =>
                            setDraftStocks((current) => ({
                              ...current,
                              [item.id]: Number(event.target.value),
                            }))
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.saveBtn}
                          onClick={() => saveStock(item.id)}
                          disabled={savingId === item.id}
                        >
                          {savingId === item.id ? 'Guardando...' : 'Guardar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}