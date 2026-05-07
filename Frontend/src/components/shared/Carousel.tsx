import { useEffect, useState } from "react";
import { useCarousel } from "../../hooks/useCarousel";
import styles from "./Carousel.module.scss";

interface Props<T> {
  data: T[];
}

export default function Carousel<T extends { titulo: string; imagen: string }>({ data }: Props<T>) {
  const { actual, next, prev } = useCarousel(data);
  const [animating, setAnimating] = useState(false);

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      next();
      setAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    setAnimating(true);
    setTimeout(() => {
      prev();
      setAnimating(false);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!actual) return <p>Cargando...</p>;

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "scale(0.95)" : "scale(1)"
        }}
      >
        <img src={actual.imagen} className={styles.image} />
        <h2 className={styles.title}>{actual.titulo}</h2>
      </div>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={handlePrev}>⬅</button>
        <button className={styles.button} onClick={handleNext}>➡</button>
      </div>
    </div>
  );
}