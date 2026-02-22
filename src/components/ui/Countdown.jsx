import { useState, useEffect } from 'react';

export default function Countdown({ endDate }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        if (!endDate) return null;

        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        if (!endDate) return;

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) return null;

    const TimeUnit = ({ label, value }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 107, 53, 0.1)',
            padding: '0.4rem 0.6rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 53, 0.3)'
        }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)', lineHeight: 1 }}>
                {value.toString().padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.8 }}>
                {label}
            </span>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <TimeUnit label="Days" value={timeLeft.days} />
            <span style={{ opacity: 0.5, fontWeight: 'bold' }}>:</span>
            <TimeUnit label="Hrs" value={timeLeft.hours} />
            <span style={{ opacity: 0.5, fontWeight: 'bold' }}>:</span>
            <TimeUnit label="Min" value={timeLeft.minutes} />
            <span style={{ opacity: 0.5, fontWeight: 'bold' }}>:</span>
            <TimeUnit label="Sec" value={timeLeft.seconds} />
        </div>
    );
}
