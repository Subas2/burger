import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';

export default function Burgers() {
    const { getBurgers } = useProducts();
    const burgers = getBurgers();



    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <PageTransition>
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        fontSize: '3rem',
                        marginBottom: '2rem',
                        color: 'var(--color-primary)',
                        textAlign: 'center'
                    }}
                >
                    Gourmet Burgers
                </motion.h1>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}
                >
                    {burgers.map(burger => (
                        <motion.div key={burger.id} variants={item}>
                            <ProductCard product={burger} type="burger" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    );
}
