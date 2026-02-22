import { Float } from '@react-three/drei';

export const Burger = (props) => {
    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1} {...props}>
            <group scale={0.5}>
                {/* Bottom Bun */}
                <mesh position={[0, -0.7, 0]}>
                    <cylinderGeometry args={[1.1, 1, 0.4, 32]} />
                    <meshStandardMaterial color="#e6a15c" />
                </mesh>
                {/* Patty */}
                <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[1.15, 1.15, 0.3, 32]} />
                    <meshStandardMaterial color="#5c3c21" />
                </mesh>
                {/* Cheese */}
                <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0.05]}>
                    <boxGeometry args={[1.6, 0.1, 1.6]} />
                    <meshStandardMaterial color="#f4d03f" />
                </mesh>
                {/* Lettuce */}
                <mesh position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.1, 7]} />
                    <meshStandardMaterial color="#82e0aa" />
                </mesh>
                {/* Top Bun */}
                <mesh position={[0, 0.7, 0]}>
                    <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#e6a15c" />
                </mesh>
            </group>
        </Float>
    );
};

export const Donut = (props) => {
    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={1} {...props}>
            <group scale={0.6} rotation={[Math.PI / 3, 0, 0]}>
                <mesh>
                    <torusGeometry args={[1, 0.5, 16, 32]} />
                    <meshStandardMaterial color="#f1948a" />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1.05, 1.05, 1.05]}>
                    <torusGeometry args={[1, 0.45, 16, 32]} />
                    <meshStandardMaterial color="#e6b0aa" /> // Icing
                </mesh>
            </group>
        </Float>
    );
};
