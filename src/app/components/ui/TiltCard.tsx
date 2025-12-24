import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card } from './card';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'neo';
    onClick?: () => void;
}

export function TiltCard({ children, className, variant = 'default', onClick }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the tilt
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    // Map mouse position to rotation degrees
    // Range is small (±5 deg) for subtle effect
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    // Shine effect moving across card
    const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
    const shineY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Normalized coordinates (-0.5 to 0.5)
        // 0,0 is center of card
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = (mouseXPos / width) - 0.5;
        const yPct = (mouseYPos / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHover(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="h-full perspective-1000"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div style={{ transform: "translateZ(0)" }} className="h-full relative overflow-hidden rounded-xl">
                <Card variant={variant} className={`h-full transition-colors duration-300 ${className}`} onClick={onClick}>
                    {children}
                </Card>

                {/* Glossy overlay */}
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                    animate={{ opacity: hover ? 1 : 0 }}
                    style={{
                        background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.1) 0%, transparent 60%)`
                    }}
                />
            </div>
        </motion.div>
    );
}
