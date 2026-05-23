import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/shared/Navbar';
import { ArrowLeft, CreditCard, Building, Wallet, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import "./checkout.scss"

type PaymentMethod = 'card' | 'bank' | 'digital';

export function Checkout() {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Info, 2: Pago, 3: Revisión
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [loading, setLoading] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Estados Unidos'
    });

    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <Navbar />
                <div className="checkout-container">
                    <div >
                        <div>
                            <CreditCard size={40} />
                        </div>
                        <h1 >No hay productos en el carrito</h1>
                        <p >Agrega productos antes de proceder al pago</p>
                        <button onClick={() => navigate('/home')} className="custom-btn secondary-btn">Ir a productos</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }
        setStep(2);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleConfirmOrder = async () => {
        setLoading(true);

        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Guardar orden en localStorage
        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cart,
            shippingInfo,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            total,
            status: 'Confirmado'
        };

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        clearCart();
        setLoading(false);
        navigate('/order-confirmation', { state: { order } });
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    return (
        <div className="checkout-page">
            <Navbar />

            <div className="checkout-container">

                <button
                    onClick={() => step === 1 ? navigate('/cart') : setStep(step - 1)}
                    className="back-button"
                >
                    <ArrowLeft size={20} />
                    {step === 1 ? 'Volver al carrito' : 'Atrás'}
                </button>

                {/* Progress Steps */}
                <div className="progress-wrapper">

                    <div className="progress-steps">

                        {[
                            { num: 1, label: 'Información' },
                            { num: 2, label: 'Pago' },
                            { num: 3, label: 'Revisión' }
                        ].map((s, i) => (

                            <div key={s.num} className="progress-step">

                                <div className="step-content">

                                    <div
                                        className={`step-circle ${step >= s.num
                                            ? 'step-active'
                                            : 'step-inactive'
                                            }`}
                                    >
                                        {step > s.num
                                            ? <CheckCircle size={20} />
                                            : s.num}
                                    </div>

                                    <span
                                        className={`step-label ${step >= s.num
                                            ? 'active'
                                            : 'inactive'
                                            }`}
                                    >
                                        {s.label}
                                    </span>

                                </div>

                                {i < 2 && (
                                    <div
                                        className={`step-line ${step > s.num
                                            ? 'active'
                                            : 'inactive'
                                            }`}
                                    />
                                )}

                            </div>

                        ))}

                    </div>

                </div>

                <div className="checkout-layout">

                    {/* Main Content */}
                    <div className="checkout-main">

                        {/* Step 1 */}
                        {step === 1 && (

                            <div className="checkout-card">

                                <h2 className="checkout-title">
                                    Información de envío
                                </h2>
                                <form
                                    onSubmit={handleShippingSubmit}
                                    className="checkout-form"
                                >

                                    <div className="form-group">

                                        <label className="form-label">
                                            Nombre completo
                                        </label>

                                        <input
                                            className="form-input"
                                            value={shippingInfo.fullName}
                                            onChange={(e) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    fullName: e.target.value
                                                })
                                            }
                                            placeholder="Juan Pérez"
                                            required
                                        />

                                    </div>

                                    <div className="form-grid-2">

                                        <div className="form-group">

                                            <label className="form-label">
                                                Correo electrónico
                                            </label>

                                            <input
                                                type="email"
                                                className="form-input"
                                                value={shippingInfo.email}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        email: e.target.value
                                                    })
                                                }
                                                placeholder="juan@email.com"
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label className="form-label">
                                                Teléfono
                                            </label>

                                            <input
                                                type="tel"
                                                className="form-input"
                                                value={shippingInfo.phone}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        phone: e.target.value
                                                    })
                                                }
                                                placeholder="+57 300 1234567"
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className="form-group">

                                        <label className="form-label">
                                            Dirección
                                        </label>

                                        <input
                                            className="form-input"
                                            value={shippingInfo.address}
                                            onChange={(e) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    address: e.target.value
                                                })
                                            }
                                            placeholder="Calle Principal 123"
                                            required
                                        />

                                    </div>

                                    <div className="form-grid-3">

                                        <div className="form-group">

                                            <label className="form-label">
                                                Ciudad
                                            </label>

                                            <input
                                                className="form-input"
                                                value={shippingInfo.city}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        city: e.target.value
                                                    })
                                                }
                                                placeholder="Cali"
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label className="form-label">
                                                Estado
                                            </label>

                                            <input
                                                className="form-input"
                                                value={shippingInfo.state}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        state: e.target.value
                                                    })
                                                }
                                                placeholder="Valle"
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label className="form-label">
                                                Código postal
                                            </label>

                                            <input
                                                className="form-input"
                                                value={shippingInfo.zipCode}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        zipCode: e.target.value
                                                    })
                                                }
                                                placeholder="760001"
                                                required
                                            />

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="custom-btn primary-btn full-width lg-btn"
                                    >
                                        Continuar al pago
                                    </button>

                                </form>
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (

                            <div className="checkout-card">

                                <h2 className="checkout-title">
                                    Método de pago
                                </h2>

                                {/* Payment Method Selection */}
                                <div className="payment-selector">

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`payment-option ${paymentMethod === 'card'
                                            ? 'active'
                                            : ''
                                            }`}
                                    >
                                        <CreditCard
                                            size={32}
                                            className="payment-option-icon"
                                        />

                                        <p className="payment-option-text">
                                            Tarjeta
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`payment-option ${paymentMethod === 'bank'
                                            ? 'active'
                                            : ''
                                            }`}
                                    >
                                        <Building
                                            size={32}
                                            className="payment-option-icon"
                                        />

                                        <p className="payment-option-text">
                                            Transferencia
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('digital')}
                                        className={`payment-option ${paymentMethod === 'digital'
                                            ? 'active'
                                            : ''
                                            }`}
                                    >
                                        <Wallet
                                            size={32}
                                            className="payment-option-icon"
                                        />

                                        <p className="payment-option-text">
                                            Billetera Digital
                                        </p>
                                    </button>

                                </div>

                                {/* Card Payment Form */}
                                {paymentMethod === 'card' && (
                                    <form
                                        onSubmit={handlePaymentSubmit}
                                        className="checkout-form"
                                    >

                                        <div className="form-group">

                                            <label className="form-label">
                                                Número de tarjeta
                                            </label>

                                            <input
                                                className="form-input"
                                                value={cardInfo.cardNumber}
                                                onChange={(e) =>
                                                    setCardInfo({
                                                        ...cardInfo,
                                                        cardNumber: formatCardNumber(e.target.value)
                                                    })
                                                }
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label className="form-label">
                                                Nombre en la tarjeta
                                            </label>

                                            <input
                                                className="form-input"
                                                value={cardInfo.cardName}
                                                onChange={(e) =>
                                                    setCardInfo({
                                                        ...cardInfo,
                                                        cardName: e.target.value
                                                    })
                                                }
                                                placeholder="JUAN PEREZ"
                                                required
                                            />

                                        </div>

                                        <div className="form-grid-2">

                                            <div className="form-group">

                                                <label className="form-label">
                                                    Fecha expiración
                                                </label>

                                                <input
                                                    className="form-input"
                                                    value={cardInfo.expiryDate}
                                                    onChange={(e) =>
                                                        setCardInfo({
                                                            ...cardInfo,
                                                            expiryDate: formatExpiryDate(e.target.value)
                                                        })
                                                    }
                                                    placeholder="MM/AA"
                                                    maxLength={5}
                                                    required
                                                />

                                            </div>

                                            <div className="form-group">

                                                <label className="form-label">
                                                    CVV
                                                </label>

                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={cardInfo.cvv}
                                                    onChange={(e) =>
                                                        setCardInfo({
                                                            ...cardInfo,
                                                            cvv: e.target.value
                                                        })
                                                    }
                                                    placeholder="123"
                                                    maxLength={4}
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <button
                                            type="submit"
                                            className="custom-btn primary-btn full-width lg-btn"
                                        >
                                            Continuar a revisión
                                        </button>

                                    </form>
                                )}

                                {/* Bank Transfer */}
                                {paymentMethod === 'bank' && (

                                    <div className="bank-box">

                                        <p className="bank-title">
                                            Datos para transferencia bancaria:
                                        </p>

                                        <div className="bank-info">
                                            <p><strong>Banco:</strong> Banco Nacional</p>
                                            <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                                            <p><strong>Titular:</strong> FarmaciaR Inc.</p>
                                            <p><strong>Concepto:</strong> Orden #{/* id.orden */}</p>
                                        </div>

                                        <button
                                            onClick={() => setStep(3)}
                                            className="custom-btn primary-btn full-width lg-btn"
                                        >
                                            He realizado la transferencia
                                        </button>

                                    </div>

                                )}

                                {/* Digital Wallet */}
                                {paymentMethod === 'digital' && (

                                    <div className="wallet-container">

                                        <div className="wallet-options">

                                            <button className="wallet-btn">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                                    alt="PayPal"
                                                    className="wallet-logo"
                                                />
                                            </button>

                                            <button className="wallet-btn">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                                    alt="Apple Pay"
                                                    className="wallet-logo"
                                                />
                                            </button>

                                            <button className="wallet-btn">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                                    alt="Google Pay"
                                                    className="wallet-logo"
                                                />
                                            </button>

                                        </div>

                                        <button
                                            onClick={() => setStep(3)}
                                            className="custom-btn primary-btn full-width lg-btn"
                                        >
                                            Pagar con billetera digital
                                        </button>

                                    </div>

                                )}

                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (

                            <div className="checkout-card">

                                <h2 className="checkout-title">
                                    Revisar pedido
                                </h2>

                                {/* Shipping Summary */}
                                <div className="review-section">

                                    <h3 className="review-title">
                                        Información de envío
                                    </h3>

                                    <div className="review-text">
                                        <p><strong>{shippingInfo.fullName}</strong></p>
                                        <p>{shippingInfo.email}</p>
                                        <p>{shippingInfo.phone}</p>
                                        <p>{shippingInfo.address}</p>
                                        <p>
                                            {shippingInfo.city},
                                            {' '}
                                            {shippingInfo.state}
                                            {' '}
                                            {shippingInfo.zipCode}
                                        </p>
                                    </div>

                                </div>

                                {/* Payment Summary */}
                                <div className="review-section">

                                    <h3 className="review-title">
                                        Método de pago
                                    </h3>

                                    <div className="payment-summary">

                                        {paymentMethod === 'card' && (
                                            <>
                                                <CreditCard size={24} className="summary-icon" />

                                                <span className="summary-text">
                                                    Tarjeta terminada en
                                                    {' '}
                                                    {cardInfo.cardNumber.slice(-4)}
                                                </span>
                                            </>
                                        )}

                                        {paymentMethod === 'bank' && (
                                            <>
                                                <Building size={24} className="summary-icon" />

                                                <span className="summary-text">
                                                    Transferencia bancaria
                                                </span>
                                            </>
                                        )}

                                        {paymentMethod === 'digital' && (
                                            <>
                                                <Wallet size={24} className="summary-icon" />

                                                <span className="summary-text">
                                                    Billetera digital
                                                </span>
                                            </>
                                        )}

                                    </div>

                                </div>

                                {/* Products */}
                                <div className="products-summary">

                                    <h3 className="review-title">
                                        Productos ({cart.length})
                                    </h3>

                                    <div className="product-list">

                                        {cart.map((item) => (

                                            <div
                                                key={item.id}
                                                className="product-item"
                                            >

                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    className="product-image"
                                                />

                                                <div className="product-content">
                                                    <p className="product-name">
                                                        {item.nombre}
                                                    </p>

                                                    <p className="product-qty">
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

                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={loading}
                                    className="custom-btn primary-btn full-width lg-btn confirm-btn"
                                >

                                    {loading ? (
                                        <>
                                            <div className="loading-spinner" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            Confirmar y pagar
                                        </>
                                    )}

                                </button>

                            </div>

                        )}

                    </div>

                    {/* SIDEBAR */}

                    <div className="checkout-sidebar">

                        <div className="summary-sidebar">

                            <h3 className="summary-title">
                                Resumen del pedido
                            </h3>

                            <div className="summary-list">

                                <div className="summary-row">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Envío</span>
                                    <span>
                                        {shipping === 0
                                            ? 'GRATIS'
                                            : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="summary-row">
                                    <span>Impuestos (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>

                                <div className="summary-total summary-row">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                            </div>

                            <div className="secure-payment">
                                <Lock size={16} />
                                <span>Pago 100% seguro</span>
                            </div>

                            <div className="card-icons">

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                    alt="Visa"
                                />

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                    alt="Mastercard"
                                />

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                                    alt="Amex"
                                />

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
