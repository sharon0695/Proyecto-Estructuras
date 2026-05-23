import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Navbar from '../../components/shared/Navbar';
import { CheckCircle, Package, Truck, MapPin, Download } from 'lucide-react';
import type { Medicamento } from '../../types/Medicamento';
import "./OrderConfirmation.scss"

interface CartItem extends Medicamento {
    quantity: number;
}
export function OrderConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            navigate('/home');
        }
    }, [order, navigate]);

    if (!order) {
        return null;
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div className="order-confirmation-page">
            <Navbar />

            <div className="order-confirmation-container">

                {/* Success Message */}
                <div className="success-card">
                    <div className="success-icon-wrapper">
                        <CheckCircle className="success-icon" size={48} />
                    </div>

                    <h1 className="success-title">
                        ¡Pedido confirmado!
                    </h1>

                    <p className="success-description">
                        Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                    </p>

                    <div className="order-number-box">
                        <p className="order-number-label">
                            Número de orden
                        </p>

                        <p className="order-number">
                            #{order.id}
                        </p>
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="timeline-card">

                    <h2 className="section-title">
                        Estado del pedido
                    </h2>

                    <div className="timeline">

                        <div className="timeline-item completed">
                            <div className="timeline-icon">
                                <CheckCircle size={24} />
                            </div>

                            <div className="timeline-content">
                                <p className="timeline-title">
                                    Pedido confirmado
                                </p>

                                <p className="timeline-date">
                                    {new Date(order.date).toLocaleString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-icon">
                                <Package size={24} />
                            </div>

                            <div className="timeline-content">
                                <p className="timeline-title">
                                    Preparando pedido
                                </p>

                                <p className="timeline-date">
                                    Estimado: En las próximas 24 horas
                                </p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-icon">
                                <Truck size={24} />
                            </div>

                            <div className="timeline-content">
                                <p className="timeline-title">
                                    En camino
                                </p>

                                <p className="timeline-date">
                                    Estimado: 2-3 días hábiles
                                </p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-icon">
                                <MapPin size={24} />
                            </div>

                            <div className="timeline-content">
                                <p className="timeline-title">
                                    Entregado
                                </p>

                                <p className="timeline-date">
                                    Estimado: {estimatedDelivery.toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Order Details */}
                <div className="details-card">

                    <h2 className="section-title">
                        Detalles del pedido
                    </h2>

                    {/* Products */}
                    <div className="products-section">

                        <h3 className="subsection-title">
                            Productos
                        </h3>

                        <div className="products-list">

                            {order.items.map((item: CartItem) => (
                                <div
                                    key={item.id}
                                    className="product-item"
                                >
                                    <img
                                        src={item.imagen}
                                        alt={item.nombre}
                                        className="product-image"
                                    />

                                    <div className="product-info">
                                        <p className="product-name">
                                            {item.nombre}
                                        </p>

                                        <p className="product-quantity">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="product-price">
                                        ${(item.precio * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="shipping-section">

                        <h3 className="subsection-title">
                            Dirección de envío
                        </h3>

                        <div className="shipping-info">

                            <p className="shipping-name">
                                {order.shippingInfo.fullName}
                            </p>

                            <p>{order.shippingInfo.address}</p>

                            <p>
                                {order.shippingInfo.city},
                                {' '}
                                {order.shippingInfo.state}
                                {' '}
                                {order.shippingInfo.zipCode}
                            </p>

                            <p>{order.shippingInfo.country}</p>

                            <p className="shipping-contact">
                                {order.shippingInfo.phone}
                            </p>

                            <p>{order.shippingInfo.email}</p>

                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="payment-section">

                        <h3 className="subsection-title">
                            Resumen de pago
                        </h3>

                        <div className="payment-summary">

                            <div className="payment-row">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="payment-row">
                                <span>Envío</span>
                                <span>
                                    {order.shipping === 0
                                        ? 'GRATIS'
                                        : `$${order.shipping.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="payment-row">
                                <span>Impuestos</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>

                            <div className="payment-total">
                                <span>Total</span>

                                <span className="total-price">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="actions">

                    <button
                        className="custom-btn outline-btn full-width"
                        onClick={() => window.print()}
                    >
                        <Download size={20} />
                        Descargar recibo
                    </button>

                    <button
                        className="custom-btn primary-btn full-width"
                        onClick={() => navigate('/home')}
                    >
                        Seguir comprando
                    </button>

                </div>

                {/* Email Notice */}
                <div className="email-notice">

                    <p>
                        📧 Te hemos enviado un correo de confirmación a{' '}
                        <strong>{order.shippingInfo.email}</strong>
                        {' '}con los detalles de tu pedido.
                    </p>

                </div>

            </div>
        </div>
    );
}
