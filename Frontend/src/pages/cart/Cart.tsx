import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext';
import type { Medicamento } from '../../types/Medicamento';
import Navbar from '../../components/shared/Navbar';
import { ArrowLeft, Plus, Minus, Trash2, Lock, CreditCard, Tag } from 'lucide-react';
import './Cart.scss';

interface CartItem extends Medicamento {
    quantity: number;
}

export function Cart() {
    const navigate = useNavigate();
    const { cart, updateQuantity: updateCartQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const updateQuantity = (id: string, delta: number) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            updateCartQuantity(id, item.quantity + delta);
        }
    };

    const removeItem = (id: string) => {
        removeFromCart(id);
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'DESCUENTO10') {
            setDiscount(0.10);
            alert('¡Cupón aplicado! 10% de descuento');
        } else {
            alert('Cupón inválido');
        }
    };

    const subtotal = getCartTotal();
    const discountAmount = subtotal * discount;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal - discountAmount + shipping;

    return (
        <div className="cart-page">
            <Navbar />
            <div className="cart-container">
                <button onClick={() => navigate('/home')} className="back-button">
                    <ArrowLeft size={20} />
                    Continuar comprando
                </button>
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart__icon">
                            <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h2 className="empty-cart__title">
                            Tu carrito está vacío
                        </h2>
                        <p className="empty-cart__text">
                            Agrega productos para comenzar tu compra
                        </p>
                        <button className="custom-btn primary-btn" onClick={() => navigate('/home')} >
                            Ver productos
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <section className="cart-items">
                            <div className="cart-card">
                                <h1 className="cart-title">
                                    Tu carrito ({getCartCount()} items)
                                </h1>
                                <div className="items-list">
                                    {cart.map((item:CartItem) => (
                                        <div
                                            key={item.id}
                                            className="cart-item"
                                        >
                                            <img
                                                src={item.imagen}
                                                alt={item.nombre}
                                                className="cart-item__image"
                                            />
                                            <div className="cart-item__content">
                                                <h3 className="cart-item__name">
                                                    {item.nombre}
                                                </h3>
                                                <p className="cart-item__category">
                                                    {item.categoria}
                                                </p>
                                                <div className="cart-item__actions">
                                                    <div className="quantity-control">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="quantity-btn"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="quantity-value">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="quantity-btn"
                                                            disabled={item.quantity >= item.stock}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <span className="item-price">
                                                        ${item.precio.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="cart-item__summary">
                                                <button onClick={() => removeItem(item.id)} className="remove-btn" >
                                                    <Trash2 size={20} />
                                                </button>
                                                <span className="item-total">
                                                    ${(item.precio * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <aside className="order-summary">
                            <div className="summary-card">
                                <h2 className="summary-title">
                                    Resumen del pedido
                                </h2>
                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="summary-row discount-row">
                                            <span>
                                                Descuento ({(discount * 100).toFixed(0)}%)
                                            </span>
                                            <span>
                                                -${discountAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="summary-row">
                                        <span>Envío estimado</span>
                                        <span>
                                            {shipping === 0
                                                ? 'GRATIS'
                                                : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {subtotal < 50 && (
                                        <p className="free-shipping-message">
                                            Agrega ${(50 - subtotal).toFixed(2)}
                                            {' '}más para envío gratis
                                        </p>
                                    )}
                                    <div className="total-section">
                                        <div className="summary-row total-row">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="coupon-section">
                                    <div className="coupon-container">
                                        <div className="coupon-input-wrapper">
                                            <Tag
                                                className="coupon-icon"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Cupón de descuento"
                                                value={couponCode}
                                                onChange={(e) =>
                                                    setCouponCode(e.target.value)
                                                }
                                                className="coupon-input"
                                            />
                                        </div>
                                        <button
                                            className="custom-btn secondary-btn sm-btn"
                                            onClick={applyCoupon}
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="custom-btn primary-btn lg-btn full-width payment-btn"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceder al pago
                                </button>
                                <div className="secure-purchase">
                                    <Lock size={16} />
                                    <span>
                                        Compra 100% segura
                                    </span>
                                </div>
                                <div className="payment-methods">
                                    <CreditCard
                                        size={32}
                                        className="payment-icon"
                                    />
                                    <svg
                                        className="card-logo"
                                        viewBox="0 0 38 24"
                                        fill="none"
                                    >
                                        <rect width="38" height="24" rx="4" fill="#00457C" />
                                        <circle cx="14" cy="12" r="7" fill="#EB001B" />
                                        <circle cx="24" cy="12" r="7" fill="#F79E1B" />
                                    </svg>
                                    <svg className="card-logo" viewBox="0 0 38 24" fill="none">
                                        <rect width="38" height="24" rx="4" fill="#016FD0" />
                                    </svg>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
