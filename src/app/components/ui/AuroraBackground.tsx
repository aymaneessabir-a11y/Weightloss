import { motion } from 'framer-motion';

export function AuroraBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-background" />

            {/* Orb 1 - Cyan/Blue */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-accent/20 blur-[100px] opacity-40 mix-blend-screen"
            />

            {/* Orb 2 - Purple/Pink */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/20 blur-[120px] opacity-30 mix-blend-screen"
            />

            {/* Orb 3 - Emerald */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
                className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-emerald-500/10 blur-[100px] opacity-30 mix-blend-screen"
            />

            {/* Noise Texture Overlay for grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                }}
            />
        </div>
    );
}
