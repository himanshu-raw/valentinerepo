"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

const images = [
  "/game-photos/1.avif",
  "/game-photos/2.avif",
  "/game-photos/3.avif",
  "/game-photos/4.avif",
  "/game-photos/5.avif",
  "/game-photos/6.avif",
  "/game-photos/7.avif",
  "/game-photos/8.avif",
  "/game-photos/9.avif",
  "/game-photos/10.avif",
  "/game-photos/11.avif",
  "/game-photos/12.avif",
  "/game-photos/13.avif",
  "/game-photos/14.avif",
  "/game-photos/15.avif",
  "/game-photos/16.avif",
  "/game-photos/17.avif",
  "/game-photos/18.avif",
  "/game-photos/19.avif",
  "/game-photos/20.avif",
  "/game-photos/21.avif",
  "/game-photos/22.avif",
  "/game-photos/23.avif",

];

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [showFireworks, setShowFireworks] = useState(false);

  // For keeping No button inside viewport
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  const getRandomPosition = () => {
    const btnW = noBtnRef.current?.offsetWidth ?? 160;
    const btnH = noBtnRef.current?.offsetHeight ?? 48;

    const padding = 12;
    const maxLeft = Math.max(padding, window.innerWidth - btnW - padding);
    const maxTop = Math.max(padding, window.innerHeight - btnH - padding);

    const left = Math.floor(Math.random() * (maxLeft - padding + 1) + padding);
    const top = Math.floor(Math.random() * (maxTop - padding + 1) + padding);

    return { top, left };
  };

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => setStep((p) => p + 1), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleYesClick = () => {
    setShowFireworks(true);
    setStep(3);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gridAutoRows: "180px",
          }}
        >
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="relative w-full h-full">
              <Image
                src={images[i % images.length]}
                alt=""
                fill
                className="object-cover"
                priority={i < 12}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-black/60" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 text-white">

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="step-0"
              className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Congratulations! You have completed the game.
            </motion.h2>
          )}

          {step === 1 && (
            <motion.h2
              key="step-1"
              className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              I have a surprise for you!
            </motion.h2>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h2 className={`text-5xl font-semibold mb-8 ${playfairDisplay.className}`}>
                Will you be my Valentine?
              </h2>

              <Image
                src="/sad_hamster.png"
                alt="Sad Hamster"
                width={220}
                height={220}
                priority
              />

              {/* Buttons row (Yes stays here) */}
              <div className="flex gap-4 mt-10 relative">
                <button
                  className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:scale-105 transition shadow-lg"
                  onClick={handleYesClick}
                >
                  Yes, I will! 🥰
                </button>
              </div>

              {/* No button floats anywhere on screen */}
              <button
                ref={noBtnRef}
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:scale-95 transition shadow-lg"
                style={
                  position
                    ? {
                        position: "fixed",
                        top: position.top,
                        left: position.left,
                        zIndex: 30,
                      }
                    : { position: "fixed", zIndex: 30 }
                }
                onMouseEnter={() => setPosition(getRandomPosition())}
                onClick={() => setPosition(getRandomPosition())}
              >
                No, I won&apos;t 😢
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              className={`text-4xl font-semibold mb-4 flex flex-col items-center ${playfairDisplay.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Thank you for accepting 💕!!
              <Image
                src="/hamster_jumping.gif"
                alt="Hamster Happy"
                width={220}
                height={220}
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fireworks */}
      {showFireworks && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Fireworks options={{ autoresize: true }} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
    </div>
  );
}
