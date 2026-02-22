import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Plus, Minus, ShoppingBag, Edit2, User, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import ProductCard from './ProductCard';

export default function ProductDetailModal({ product, onClose, onProductSelect }) {
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { addReview, updateReview, products } = useProducts();
    const { orders } = useOrders();
    const [quantity, setQuantity] = useState(1);

    // Review State
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isWritingReview, setIsWritingReview] = useState(false);

    // Edit Mode State
    const [editingReviewId, setEditingReviewId] = useState(null);

    // Simulate current user ID for this session (to allow editing own reviews)
    const [currentUserId] = useState(() => localStorage.getItem('temp_user_id') || `user_${Date.now()}`);
    if (!localStorage.getItem('temp_user_id')) localStorage.setItem('temp_user_id', currentUserId);

    if (!product) return null;

    const originalPrice = parseFloat(product.price);
    const discount = parseInt(product.discount) || 0;
    const discountedPrice = discount > 0 ? (originalPrice - (originalPrice * discount / 100)) : originalPrice;

    // derived state
    const reviews = product.reviews || [];
    const myReview = reviews.find(r => r.userId === currentUserId);
    const otherReviews = reviews.filter(r => r.userId !== currentUserId);

    // Check if current user has ordered this item (Simulated Verification)
    const hasOrdered = orders.some(o => o.items && o.items.some(i => i.id === product.id));

    // Recommendations Logic
    const relatedProducts = products
        .filter(p => p.type === product.type && p.id !== product.id)
        .sort(() => 0.5 - Math.random()) // Simple shuffle
        .slice(0, 3);

    const handleStarClick = (rating) => {
        if (myReview && !editingReviewId) return; // Already rated, must edit to change
        setUserRating(rating);
        if (!isWritingReview && !myReview) setIsWritingReview(true);
    };

    const handleSubmitReview = () => {
        if (userRating === 0) {
            addToast("Please select a star rating!", "error");
            return;
        }

        if (editingReviewId) {
            updateReview(product.id, editingReviewId, reviewComment, userRating);
            addToast("Review updated successfully!", "success");
            setEditingReviewId(null);
        } else {
            addReview(product.id, {
                userId: currentUserId,
                userName: "Me", // consistent for now
                rating: userRating,
                comment: reviewComment
            });
            addToast("Thanks for your review! ⭐", "success");
        }

        setIsWritingReview(false);
        setReviewComment('');
    };

    const startEdit = (review) => {
        setEditingReviewId(review.id);
        setUserRating(review.rating);
        setReviewComment(review.comment);
        setIsWritingReview(true);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        addToast(`Added ${quantity} x ${product.name} to bag`);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="glass-panel"
                    style={{
                        width: '100%',
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        padding: 0
                    }}
                >
                    <style>{`
                        @media (max-width: 900px) {
                            .glass-panel {
                                grid-template-columns: 1fr !important;
                                max-height: 85vh !important;
                            }
                            .modal-img-section {
                                padding: 1.5rem !important;
                                min-height: 200px !important;
                            }
                            .modal-details-section {
                                padding: 1.2rem !important;
                                gap: 1rem !important;
                            }
                            .modal-title {
                                font-size: 1.8rem !important;
                            }
                            .modal-price {
                                font-size: 2rem !important;
                            }
                        }
                    `}</style>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Image Section */}
                    <div className="modal-img-section" style={{
                        position: 'relative',
                        background: `linear-gradient(135deg, ${product.color}20, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                        minHeight: '300px'
                    }}>
                        <div style={{
                            position: 'absolute',
                            width: '70%',
                            height: '70%',
                            background: product.color,
                            filter: 'blur(60px)',
                            opacity: 0.3,
                            borderRadius: '50%',
                            zIndex: 0
                        }} />
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: '100%',
                                maxHeight: '350px',
                                objectFit: 'contain',
                                dropShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                zIndex: 1
                            }}
                        />
                        {discount > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '2rem',
                                left: '2rem',
                                background: 'var(--color-secondary)',
                                color: 'black',
                                fontWeight: 'bold',
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                boxShadow: '0 5px 15px rgba(255, 143, 171, 0.4)',
                                zIndex: 2
                            }}>
                                {discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="modal-details-section" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', maxHeight: '90vh' }}>

                        {/* Header info */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                <span style={{
                                    textTransform: 'uppercase',
                                    background: product.color,
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px'
                                }}>
                                    {product.type}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', opacity: 0.8 }}>
                                    <Star size={14} fill="#FFD700" color="#FFD700" /> {product.rating || 'New'} ({reviews.length} reviews)
                                </span>
                            </div>
                            <h2 className="modal-title" style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem', fontFamily: 'var(--font-main)' }}>{product.name}</h2>
                            <p style={{ opacity: 0.7, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{product.description || "No description available for this delicious item."}</p>
                        </div>

                        {/* Price & Cart Actions */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    {discount > 0 && <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9rem', display: 'block' }}>₹{originalPrice}</span>}
                                    <span className="modal-price" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{discountedPrice.toFixed(0)}</span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '16px',
                                    padding: '0.5rem'
                                }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}><Minus size={18} /></button>
                                    <span style={{ margin: '0 1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}><Plus size={18} /></button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                style={{
                                    width: '100%',
                                    padding: '1.2rem',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem',
                                    boxShadow: '0 10px 30px rgba(255,107,53,0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <ShoppingBag size={24} /> Add to Order — ₹{(discountedPrice * quantity).toFixed(0)}
                            </button>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                        {/* Reviews Section */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Customer Reviews
                                {!isWritingReview && !myReview && (
                                    <button
                                        onClick={() => setIsWritingReview(true)}
                                        style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </h3>

                            {/* Render Review Form (Add or Edit) */}
                            {(isWritingReview || editingReviewId) && (
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => handleStarClick(star)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    transform: (hoverRating >= star || userRating >= star) ? 'scale(1.2)' : 'scale(1)',
                                                    transition: 'transform 0.2s'
                                                }}
                                            >
                                                <Star
                                                    size={24}
                                                    fill={(hoverRating >= star || userRating >= star) ? "#FFD700" : "none"}
                                                    color={(hoverRating >= star || userRating >= star) ? "#FFD700" : "rgba(255,255,255,0.2)"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Tell us what you think..."
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '0.8rem',
                                            color: 'white',
                                            minHeight: '80px',
                                            marginBottom: '1rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => { setIsWritingReview(false); setEditingReviewId(null); setReviewComment(''); setUserRating(0); }}
                                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmitReview}
                                            style={{ background: 'var(--color-primary)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            {editingReviewId ? 'Update Review' : 'Submit Review'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* My Review Display */}
                            {myReview && !editingReviewId && (
                                <div style={{ background: 'rgba(255, 107, 53, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255, 107, 53, 0.3)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>Your Review</span>
                                            {/* Show Verified Badge for current user if ordered */}
                                            {hasOrdered && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#2ec4b6', fontSize: '0.7rem', border: '1px solid #2ec4b6', padding: '0 0.4rem', borderRadius: '10px' }}>
                                                    <CheckCircle size={10} /> Verified Purchase
                                                </span>
                                            )}
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < myReview.rating ? "#FFD700" : "none"} color={i < myReview.rating ? "#FFD700" : "rgba(255,255,255,0.3)"} />
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => startEdit(myReview)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    </div>
                                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{myReview.comment}</p>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '0.5rem', display: 'block' }}>{new Date(myReview.date).toLocaleDateString()}</span>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {otherReviews.length === 0 && !myReview && <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>No reviews yet. Be the first to try it!</p>}
                                {otherReviews.map(review => (
                                    <div key={review.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={14} style={{ opacity: 0.5 }} /> {review.userName}
                                                {/* Fake Verification for seeded users */}
                                                {(['u1', 'u3', 'u5'].includes(review.userId) || review.rating === 5) && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#2ec4b6', fontSize: '0.7rem', border: '1px solid #2ec4b6', padding: '0 0.4rem', borderRadius: '10px', height: 'fit-content' }}>
                                                        <CheckCircle size={10} /> Verified
                                                    </span>
                                                )}
                                            </span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < review.rating ? "#FFD700" : "none"} color={i < review.rating ? "#FFD700" : "rgba(255,255,255,0.3)"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.4 }}>{review.comment}</p>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.3, marginTop: '0.3rem', display: 'block' }}>{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                        {/* Recommendation Logic */}
                        {relatedProducts.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>You Might Also Like</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    {relatedProducts.map(rp => (
                                        <ProductCard
                                            key={rp.id}
                                            product={rp}
                                            imageHeight="150px"
                                            onClick={() => onProductSelect && onProductSelect(rp)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
