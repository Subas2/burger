import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Sparkles, Stars } from '@react-three/drei';
import { Burger, Donut } from './FloatingFood';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function Rig() {
    useFrame((state) => {
        state.camera.position.lerp(new THREE.Vector3(state.mouse.x * 2, state.mouse.y * 2, 8), 0.05)
    })
}

export default function Experience() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
            dpr={[1, 2]} // Quality for high-DPI screens
        >
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#ff6b35" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00f5d4" />

            <Suspense fallback={null}>
                {/* Custom Environment for reflections */}
                <Environment preset="city" blur={0.8} />

                {/* Floating Particles - "God Rays" feel */}
                <Sparkles count={150} scale={12} size={4} speed={0.4} opacity={0.5} color="#ff9f1c" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <group position={[0, -0.5, 0]}>
                    <Float speed={2} rotationIntensity={1} floatIntensity={1.5} floatingRange={[-0.2, 0.2]}>
                        <Burger position={[-2.2, 0, 0]} scale={1.2} />
                    </Float>

                    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.3, 0.3]}>
                        <Donut position={[2.2, 0.8, -1]} scale={1.1} />
                    </Float>

                    <Float speed={1.5} rotationIntensity={2} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
                        <Burger position={[0, -2.5, -2]} scale={0.7} />
                    </Float>
                </group>

                {/* Interactive Camera Movement */}
                <Rig />

                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.4} far={10} color="#0a0a0a" />
            </Suspense>
        </Canvas>
    );
}
