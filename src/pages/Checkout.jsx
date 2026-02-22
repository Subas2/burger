import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePromoCode } from '../context/PromoCodeContext';
import { useShipping } from '../context/ShippingContext';
import { useOrders } from '../context/OrderContext';
import PageTransition from '../components/layout/PageTransition';
import { ArrowLeft, CreditCard, Banknote, Truck, Smartphone, User, Mail, MapPin, Building, Hash, Receipt, ChevronRight, Phone, Locate, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCart();
    const { addToast } = useToast();
    const { validatePromoCode } = usePromoCode();
    const { getShippingCost } = useShipping();
    const { addOrder } = useOrders();
    const [, setLocation] = useLocation();

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [appliedCode, setAppliedCode] = useState(null);
    const [discount, setDiscount] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'card'
    });

    const [location, setLocationCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to New Delhi or generic

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if user has placed an order before (simulated)
    const isFirstOrder = !localStorage.getItem('first_order_placed');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyPromo = () => {
        if (!promoCode) return;

        const result = validatePromoCode(promoCode, {
            cartTotal: totalPrice,
            isFirstOrder
        });

        if (result && result.valid) {
            const validPromo = result.promo;
            let discountAmount = 0;
            if (validPromo.type === 'percent') {
                discountAmount = (totalPrice * validPromo.value) / 100;
            } else {
                discountAmount = validPromo.value;
            }
            // Cap discount at total price
            if (discountAmount > totalPrice) discountAmount = totalPrice;

            setDiscount(discountAmount);
            setAppliedCode(validPromo.code);
            addToast(`Code ${validPromo.code} applied!`, 'success');
        } else {
            addToast(result ? result.message : 'Invalid code', 'error');
            setDiscount(0);
            setAppliedCode(null);
        }
    };

    const shippingCost = getShippingCost(totalPrice - discount);
    const finalTotal = Math.max(0, totalPrice - discount + shippingCost);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic Validation
        if (!formData.name || !formData.address || !formData.city || !formData.zip || !formData.phone) {
            addToast('Please fill in all shipping details.', 'error');
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            // Generate random Order ID
            const orderId = Math.floor(100000 + Math.random() * 900000);

            // Save Order
            const newOrder = {
                id: orderId,
                date: new Date().toISOString(),
                items: [...items],
                total: finalTotal,
                status: 'preparing',
                shippingDetails: { ...formData }, // includes phone
                location: location,
                appliedPromo: appliedCode,
                discount: discount
            };
            addOrder(newOrder);

            // Update Promo Usage
            if (appliedCode) {
                incrementPromoUsage(appliedCode);
            }

            // Mark as existing customer
            localStorage.setItem('first_order_placed', 'true');

            clearCart();
            addToast(`Order #${orderId} placed successfully! 🍔`, 'success');
            setLocation(`/track-order/${orderId}`);
        }, 1500);
    };

    if (items.length === 0) {
        return (
            <PageTransition>
                <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Receipt size={64} style={{ opacity: 0.5 }} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Cart is Empty</h1>
                    <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Looks like you haven't added any delicious items yet.</p>
                    <button onClick={() => setLocation('/')} className="admin-btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                        Go Shopping
                    </button>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="checkout-container" style={{ paddingTop: '120px', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <button onClick={() => setLocation('/')} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>
                    <ArrowLeft size={20} /> Back to Shop
                </button>

                <h1 style={{ fontSize: '3rem', marginBottom: '3rem', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    Checkout <span style={{ fontSize: '1.2rem', opacity: 0.5, fontWeight: 'normal', marginTop: '1rem' }}>({items.length} items)</span>
                </h1>

                <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem' }}>
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ background: 'var(--color-primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>1</span>
                                Shipping Details
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} />
                                        <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} />
                                        <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone size={18} />
                                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ marginBottom: 0 }}>Delivery Location (Tap on map to select)</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (navigator.geolocation) {
                                                    addToast("Detecting precise location...", "info");
                                                    navigator.geolocation.getCurrentPosition(async (position) => {
                                                        const { latitude, longitude } = position.coords;
                                                        setLocationCoords({ lat: latitude, lng: longitude });

                                                        try {
                                                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                                            const data = await response.json();

                                                            if (data && data.address) {
                                                                const addr = data.address;
                                                                const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
                                                                const city = addr.city || addr.town || addr.village || addr.state_district || '';
                                                                const zip = addr.postcode || '';

                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    address: street || prev.address,
                                                                    city: city || prev.city,
                                                                    zip: zip || prev.zip
                                                                }));
                                                                addToast("Address autofilled!", "success");
                                                            } else {
                                                                addToast("Location found, but address not found.", "warning");
                                                            }
                                                        } catch (error) {
                                                            console.error("Geocoding error:", error);
                                                        }
                                                    }, (error) => {
                                                        console.error(error);
                                                        let msg = "Unable to retrieve location.";
                                                        if (error.code === 1) msg = "Location permission denied. Please allow access.";
                                                        if (error.code === 2) msg = "Location unavailable. Check your GPS.";
                                                        if (error.code === 3) msg = "Location request timed out.";
                                                        addToast(msg, "error");
                                                    }, {
                                                        enableHighAccuracy: true,
                                                        timeout: 10000,
                                                        maximumAge: 0
                                                    });
                                                } else {
                                                    addToast("Geolocation is not supported by your browser.", "error");
                                                }
                                            }}
                                            style={{
                                                background: 'rgba(76, 201, 240, 0.1)',
                                                color: '#4cc9f0',
                                                border: '1px solid rgba(76, 201, 240, 0.2)',
                                                borderRadius: '4px',
                                                padding: '0.3rem 0.6rem',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            <Locate size={14} /> Use My Location
                                        </button>
                                    </div>
                                    <div style={{ height: '250px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <MapUpdater center={location} />
                                            <LocationMarker position={location} setPosition={setLocationCoords} />
                                        </MapContainer>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Delivery Address</label>
                                    <div className="input-wrapper">
                                        <MapPin size={18} />
                                        <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Tasty St, Apt 4B" />
                                    </div>
                                </div>
                                <div className="city-zip-grid">
                                    <div className="input-group">
                                        <label>City</label>
                                        <div className="input-wrapper">
                                            <Building size={18} />
                                            <input name="city" value={formData.city} onChange={handleChange} required placeholder="New York" />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Zip Code</label>
                                        <div className="input-wrapper">
                                            <Hash size={18} />
                                            <input name="zip" value={formData.zip} onChange={handleChange} required placeholder="10001" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ background: 'var(--color-primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>2</span>
                                Payment Method
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                <PaymentOption
                                    id="card"
                                    icon={<CreditCard size={28} />}
                                    label="Credit Card"
                                    subLabel="Visa, Mastercard"
                                    selected={formData.paymentMethod === 'card'}
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                                />
                                <PaymentOption
                                    id="cod"
                                    icon={<Banknote size={28} />}
                                    label="Cash"
                                    subLabel="Pay on Delivery"
                                    selected={formData.paymentMethod === 'cod'}
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                />
                                <PaymentOption
                                    id="gpay"
                                    icon={<Smartphone size={28} color="#4285F4" />}
                                    label="Google Pay"
                                    subLabel="Fast & Secure"
                                    selected={formData.paymentMethod === 'gpay'}
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'gpay' })}
                                />
                                <PaymentOption
                                    id="apple"
                                    icon={<Smartphone size={28} color="white" />}
                                    label="Apple Pay"
                                    subLabel="Fast & Secure"
                                    selected={formData.paymentMethod === 'apple'}
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'apple' })}
                                />
                            </div>
                        </section>
                    </motion.div>

                    {/* Right Column: Receipt Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div style={{
                            background: '#fff',
                            color: '#1a1a1a',
                            padding: '0',
                            borderRadius: '2px', // Receipt jagged edge effect simulated with simple border for now
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            position: 'sticky',
                            top: '120px',
                            overflow: 'hidden'
                        }}>
                            {/* Receipt Header */}
                            <div style={{ background: '#f8f8f8', padding: '1.5rem', borderBottom: '2px dashed #ddd', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-main)', marginBottom: '0.2rem', color: '#1a1a1a' }}>BURGER & BAKERY</h2>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '1px' }}>OFFICIAL RECEIPT</p>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                                    {items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '2px dashed #ddd', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {/* Promo Code Input */}
                                    {appliedCode ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(46, 196, 182, 0.1)', padding: '0.8rem', borderRadius: '4px', border: '1px dashed #2ec4b6' }}>
                                            <span style={{ color: '#2ec4b6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Tag size={16} /> {appliedCode} Applied
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAppliedCode(null);
                                                    setDiscount(0);
                                                    setPromoCode('');
                                                    addToast('Promo code removed', 'info');
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#e71d36', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <input
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: '#f8f8f8',
                                                    color: '#1a1a1a',
                                                    fontFamily: 'monospace'
                                                }}
                                                placeholder="PROMO CODE"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                style={{
                                                    background: '#1a1a1a',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0 1rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                APPLY
                                            </button>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ opacity: 0.7 }}>Subtotal</span>
                                        <span style={{ fontWeight: 500 }}>₹{totalPrice.toFixed(2)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e71d36', fontSize: '0.9rem' }}>
                                            <span>Discount ({appliedCode})</span>
                                            <span>-₹{discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ opacity: 0.7 }}>Shipping</span>
                                        <span style={{ fontWeight: 500 }}>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                                    </div>

                                    <div style={{ borderTop: '2px solid #1a1a1a', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 800, color: '#1a1a1a' }}>
                                        <span>TOTAL</span>
                                        <span>₹{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Receipt Footer */}
                            <div style={{ background: '#f8f8f8', padding: '1.5rem', borderTop: '2px dashed #ddd', textAlign: 'center' }}>
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: isSubmitting ? '#999' : 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        transition: 'transform 0.2s',
                                        boxShadow: '0 4px 10px rgba(255,107,53,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                    onMouseDown={e => !isSubmitting && (e.currentTarget.style.transform = 'scale(0.98)')}
                                    onMouseUp={e => !isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {isSubmitting ? 'Processing...' : <>Place Order <ChevronRight size={20} /></>}
                                </button>
                                <p style={{ marginTop: '1rem', fontSize: '0.7rem', opacity: 0.5 }}>Thank you for dining with us!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Styles */}
                <style>{`
                  .input-group label {
                      display: block;
                      margin-bottom: 0.5rem;
                      opacity: 0.8;
                      font-size: 0.9rem;
                      font-weight: 500;
                  }
                  .input-wrapper {
                      display: flex;
                      align-items: center;
                      gap: 0.8rem;
                      background: rgba(255,255,255,0.05);
                      border: 1px solid rgba(255,255,255,0.1);
                      padding: 0 1rem;
                      border-radius: 12px;
                      transition: border-color 0.3s;
                  }
                  .input-wrapper:focus-within {
                      border-color: var(--color-primary);
                      background: rgba(255,255,255,0.08);
                  }
                  .input-wrapper svg {
                      opacity: 0.5;
                  }
                  .input-wrapper input {
                      flex: 1;
                      background: none;
                      border: none;
                      padding: 1rem 0;
                      color: white;
                      font-size: 1rem;
                      outline: none;
                  }

                  @media (max-width: 968px) {
                    .checkout-grid {
                      grid-template-columns: 1fr !important;
                      gap: 3rem !important;
                    }
                    div[style*="padding-top: 120px"] {
                        padding-top: 100px !important;
                    }
                    h1 {
                        font-size: 2.2rem !important;
                    }
                  }

                  .city-zip-grid {
                      display: grid;
                      grid-template-columns: 1fr 1fr;
                      gap: 1.2rem;
                  }

                  @media (max-width: 480px) {
                      .city-zip-grid {
                          grid-template-columns: 1fr;
                      }
                  }
                `}</style>
            </div>
        </PageTransition >
    );
}

function PaymentOption({ id, icon, label, subLabel, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                border: selected ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                background: selected ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)',
                padding: '1.5rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={e => !selected && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => !selected && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        >
            <div style={{
                background: selected ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                padding: '0.8rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selected ? 'white' : 'white',
                marginBottom: '0.2rem'
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: selected ? 'var(--color-primary)' : 'white' }}>{label}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem' }}>{subLabel}</p>
            </div>
            {selected && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)'
                }} />
            )}
        </div>
    );
}

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function MapUpdater({ center }) {
    const map = useMap();
    // Update map view when center changes
    map.setView([center.lat, center.lng], map.getZoom());
    return null;
}
