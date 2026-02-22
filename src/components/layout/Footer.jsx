
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useUI } from '../../context/UIContext';

export default function Footer() {
    const { addToast } = useToast();
    const { contactInfo } = useUI();
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        // Simulating sending comment
        addToast(`Message sent to ${contactInfo?.email}! Thanks for your feedback.`, 'success');
        setComment('');
    };

    return (
        <footer style={{
            background: 'linear-gradient(to top, #000000, #0a0a0a)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '4rem 2rem',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'var(--font-main)',
            scrollSnapAlign: 'start'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem'
            }}>
                {/* Contact Details */}
                <div>
                    <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem' }}>Contact Us</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-primary)', padding: '0.8rem', borderRadius: '50%', color: 'white' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Visit Us</h4>
                                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>{contactInfo?.address || '123 Burger Lane, Foodie City'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-primary)', padding: '0.8rem', borderRadius: '50%', color: 'white' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Call Us</h4>
                                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>{contactInfo?.phone || '+1 (555) 123-4567'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-primary)', padding: '0.8rem', borderRadius: '50%', color: 'white' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Email Us</h4>
                                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>{contactInfo?.email || 'hello@burgerbakery.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        {contactInfo?.facebook && (
                            <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>
                                <Facebook size={24} />
                            </a>
                        )}
                        {contactInfo?.instagram && (
                            <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>
                                <Instagram size={24} />
                            </a>
                        )}
                        {contactInfo?.twitter && (
                            <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>
                                <Twitter size={24} />
                            </a>
                        )}
                        {contactInfo?.youtube && (
                            <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>
                                <Youtube size={24} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Comment Section */}
                <div>
                    <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem' }}>Leave a Comment</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us what you think..."
                                rows="4"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    color: 'white',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                alignSelf: 'flex-start',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 2rem',
                                borderRadius: '50px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
                            }}
                        >
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.4, fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} Burger & Bakery. All rights reserved.</p>
            </div>
        </footer>
    );
}
