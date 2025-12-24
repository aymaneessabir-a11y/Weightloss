import { motion } from 'framer-motion';

export function AppleMeshBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#000000]">
            {/* Mesh Gradient Container */}
            <div className="absolute inset-0 opacity-60">
                {/* Orb 1: Deep Blue/Purple (Top Left) */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_70%)] blur-[120px] mix-blend-screen"
                />

                {/* Orb 2: Teal/Cyan (Bottom Right) */}
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute -bottom-[20%] -right-[20%] w-[90vw] h-[90vw] rounded-full bg-[radial-gradient(circle_at_center,_#0891b2_0%,_transparent_70%)] blur-[140px] mix-blend-screen"
                />

                {/* Orb 3: Pink/Accent (Center-ish moving) */}
                <motion.div
                    animate={{
                        x: [-20, 80, -20],
                        y: [-20, 20, -20],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5
                    }}
                    className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle_at_center,_#be185d_0%,_transparent_70%)] blur-[130px] mix-blend-screen"
                />

                {/* Orb 4: Subtle White/Blue Highlight (Top Right) */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,_#2563eb_0%,_transparent_70%)] blur-[100px] mix-blend-screen"
                />
            </div>

            {/* Grain Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                }}
            />
        </div>
    );
}
