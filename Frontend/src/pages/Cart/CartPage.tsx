import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    placeOrder,
    totalItems,
    totalPrice,
  } = useCart();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPrice = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return `$${numeric.toFixed(2)}`;
  };

  const formatCategory = (cat: string[] | string | undefined) => {
    if (!cat) return "General";
    if (Array.isArray(cat)) return cat.join(" / ");
    return cat;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      alert("Por favor, completa todos los campos del formulario.");
      return;
    }

    setLoading(true);
    try {
      await placeOrder({
        nombre,
        direccion,
        telefono,
        metodoPago,
      });
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert("Ocurrió un error al procesar tu orden. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const pageBackgroundStyle = {
    background: "linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%)",
    minHeight: "100vh",
    color: "#16324f",
  };

  if (orderPlaced) {
    return (
      <div style={pageBackgroundStyle}>
        <header className="navbar navbar-light bg-white border-bottom sticky-top py-2 px-4 shadow-sm">
          <button
            className="navbar-brand fw-bold d-inline-flex align-items-center gap-2 border-0 bg-transparent"
            onClick={() => navigate("/")}
            style={{ color: "#1773a3" }}
          >
            <span>🍃</span>
            <span>FarmaciaR</span>
          </button>
        </header>

        <main className="container py-5">
          <div
            className="card border-0 shadow-lg p-5 rounded-4 text-center mx-auto"
            style={{ maxWidth: "580px" }}
          >
            <div className="display-1 text-success mb-4">🎉</div>
            <h2 className="fw-bold mb-3" style={{ color: "#17324c" }}>
              ¡Tu pedido ha sido realizado con éxito!
            </h2>
            <p className="text-muted mb-4 fs-5">
              Gracias por tu compra. Hemos registrado tu orden y nos pondremos en contacto contigo pronto para realizar la entrega.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg rounded-3 px-5 py-3 fw-bold"
              onClick={() => navigate("/Home")}
              style={{
                backgroundColor: "#2a79a1",
                borderColor: "#2a79a1",
                transition: "all 0.2s",
              }}
            >
              Volver a la tienda
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={pageBackgroundStyle}>
      <header className="navbar navbar-light bg-white border-bottom sticky-top py-2 px-4 shadow-sm">
        <button
          className="navbar-brand fw-bold d-inline-flex align-items-center gap-2 border-0 bg-transparent"
          onClick={() => navigate("/")}
          style={{ color: "#1773a3" }}
        >
          <span>🍃</span>
          <span>FarmaciaR</span>
        </button>

        <nav className="nav gap-3">
          <button
            type="button"
            className="btn btn-link text-decoration-none fw-bold text-muted"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>
          <button
            type="button"
            className="btn btn-link text-decoration-none fw-bold text-muted"
            onClick={() => navigate("/Home")}
          >
            Productos
          </button>
        </nav>

        <div className="d-flex gap-2">
          <button
            type="button"
            aria-label="Carrito"
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 position-relative shadow-sm"
            onClick={() => navigate("/carrito")}
            style={{ width: "40px", height: "40px", fontSize: "1.1rem" }}
          >
            🛒
            {totalItems > 0 && (
              <span className="badge bg-success rounded-pill border border-white position-absolute top-0 start-100 translate-middle">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none fw-bold"
                onClick={() => navigate("/Home")}
                style={{ color: "#2c79a3" }}
              >
                Productos
              </button>
            </li>
            <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">
              Carrito
            </li>
          </ol>
        </nav>

        <h1 className="fw-bold mb-4" style={{ color: "#17324c" }}>
          Tu Carrito de Compras
        </h1>

        {cartItems.length === 0 ? (
          <div
            className="card border-0 shadow-sm p-5 rounded-4 text-center mx-auto"
            style={{ maxWidth: "580px" }}
          >
            <div className="display-2 text-muted mb-4">🛒</div>
            <h2 className="fw-bold mb-2" style={{ color: "#17324c" }}>
              Tu carrito está vacío
            </h2>
            <p className="text-muted mb-4 fs-6">
              Aún no has agregado ningún producto a tu carrito de compras.
            </p>
            <button
              type="button"
              className="btn btn-success btn-lg rounded-3 px-4 py-2.5 fw-bold"
              onClick={() => navigate("/Home")}
              style={{
                backgroundColor: "#6ea03c",
                borderColor: "#6ea03c",
              }}
            >
              Ver productos disponibles
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                {cartItems.map((item, index) => (
                  <div
                    key={item.product.id}
                    className={`row align-items-center py-3 ${
                      index < cartItems.length - 1 ? "border-bottom" : ""
                    } g-3`}
                  >
                    <div className="col-auto">
                      <img
                        src={item.product.imagen}
                        alt={item.product.nombre}
                        className="rounded-3 border"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          backgroundColor: "#f7f9fb",
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-5">
                      <span className="badge bg-light text-secondary mb-1 border">
                        {formatCategory(item.product.categoria)}
                      </span>
                      <h3 className="h6 fw-bold mb-1" style={{ color: "#17324c" }}>
                        {item.product.nombre}
                      </h3>
                      <div className="small text-muted">
                        {formatPrice(item.product.precio)} c/u
                      </div>
                    </div>

                    <div className="col-auto col-md-3">
                      <div className="d-inline-flex align-items-center bg-light p-1.5 rounded-3 border">
                        <button
                          type="button"
                          className="btn btn-white btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ width: "26px", height: "26px", border: "1px solid #dee2e6" }}
                        >
                          −
                        </button>
                        <strong className="px-3" style={{ minWidth: "30px", textAlign: "center" }}>
                          {item.quantity}
                        </strong>
                        <button
                          type="button"
                          className="btn btn-white btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                          disabled={item.product.stock <= 0}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ width: "26px", height: "26px", border: "1px solid #dee2e6" }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col col-md-2 text-end d-flex flex-column align-items-end">
                      <strong className="fs-6" style={{ color: "#16324f" }}>
                        {formatPrice(Number(item.product.precio) * item.quantity)}
                      </strong>
                      <button
                        type="button"
                        className="btn btn-link text-danger text-decoration-none p-0 small fw-bold mt-1"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Delivery Details Form */}
            <div className="col-lg-4">
              {/* Summary Card */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
                <h2 className="h5 fw-bold pb-2 border-bottom mb-3" style={{ color: "#17324c" }}>
                  Resumen de Compra
                </h2>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Productos ({totalItems}):</span>
                  <strong className="text-dark">{formatPrice(totalPrice)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Envío:</span>
                  <strong className="text-dark">
                    {totalPrice >= 50 ? "Gratis" : formatPrice(5)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between pt-3 border-top mt-3">
                  <span className="h5 fw-bold mb-0" style={{ color: "#16324f" }}>
                    Total:
                  </span>
                  <span className="h5 fw-bold mb-0" style={{ color: "#5f9d2f" }}>
                    {formatPrice(totalPrice + (totalPrice >= 50 ? 0 : 5))}
                  </span>
                </div>
              </div>

              {/* Form Card */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h2 className="h5 fw-bold pb-2 border-bottom mb-3" style={{ color: "#17324c" }}>
                  Datos del Envío
                </h2>

                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label small fw-bold text-secondary mb-1">
                      Nombre Completo
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className="form-control rounded-3"
                      required
                      placeholder="Ej. Ana Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label small fw-bold text-secondary mb-1">
                      Dirección de Entrega
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      className="form-control rounded-3"
                      required
                      placeholder="Ej. Calle 10 # 5-20, Apto 302"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label small fw-bold text-secondary mb-1">
                      Teléfono / Celular
                    </label>
                    <input
                      id="telefono"
                      type="text"
                      className="form-control rounded-3"
                      required
                      placeholder="Ej. 3001234567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="metodoPago" className="form-label small fw-bold text-secondary mb-1">
                      Método de Pago
                    </label>
                    <select
                      id="metodoPago"
                      className="form-select rounded-3"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    >
                      <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                      <option value="Efectivo contra entrega">Efectivo contra entrega</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria (PSE)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 btn-lg rounded-3 fw-bold py-2.5 shadow-sm"
                    disabled={loading}
                    style={{
                      backgroundColor: "#6ea03c",
                      borderColor: "#6ea03c",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {loading ? "Procesando..." : "Confirmar Pedido"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-top py-4 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-8">
              <h4 className="fw-bold mb-2" style={{ color: "#17324c", fontSize: "1.1rem" }}>
                🛡 FarmaciaR
              </h4>
              <p className="text-muted mb-0 small">
                Tu salud es nuestra prioridad. Productos de calidad con entrega a domicilio.
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <h5 className="fw-bold mb-2" style={{ color: "#17324c", fontSize: "0.95rem" }}>
                Contacto
              </h5>
              <p className="text-muted mb-0 small">Email: contacto@farmaciar.com</p>
              <p className="text-muted mb-0 small">Teléfono: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
