"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// 18 images (we will loop them if we need more pairs)
const imagePaths = [
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
];

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ✅ 46 playable tiles: ids 0..45
// null = empty spacer
// "B" = pink border (not clickable, no image)
// number = playable tile id
const heartLayout: (number | "B" | null)[][] = [
  [null, null, null, "B", "B", null, null, null, "B", "B", null, null, null],

  [null, null, "B", 0, 1, "B", null, "B", 2, 3, "B", null, null],

  [null, "B", 4, 5, 6, 7, "B", 8, 9, 10, 11, "B", null],

  ["B", 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, "B"],

  [null, "B", 23, 24, 25, 26, 27, 28, 29, 30, 31, "B", null],

  [null, null, "B", 32, 33, 34, 35, 36, 37, 38, "B", null, null],

  [null, null, null, "B", 39, 40, 41, 42, 43, "B", null, null, null],

  // ⚠️ your layout includes 46 and 47; we keep them but treat only 0..45 as playable
  [null, null, null, null, "B", 45, 44, 45, "B", null, null, null, null],

  [null, null, null, null, null, "B", 44, "B", null, null, null, null, null],

  [null, null, null, null, null, null, "B", null, null, null, null, null, null],
];

type Props = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({ handleShowProposal }: Props) {
  // ✅ create 23 pairs (46 cards) from 18 images by looping
const [tileImages, setTileImages] = useState<string[]>([]);

useEffect(() => {
  const pairsNeeded = 23;
  const chosen = Array.from(
    { length: pairsNeeded },
    (_, i) => imagePaths[i % imagePaths.length]
  );
  const pairs = chosen.flatMap((img) => [img, img]); // 46 tiles
  setTileImages(shuffle(pairs));
}, []);

  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);

  const isPlayable = (id: number) => id >= 0 && id <= 45;

  // ✅ TEST button: instantly solve everything
  // const handleSolveAll = () => {
  //   setSelected([]);
  //   setIncorrect([]);
  //   setMatched(Array.from({ length: 46 }, (_, i) => i)); // 0..45 all matched
  // };

  const handleClick = async (id: number) => {
    if (!isPlayable(id)) return;
    if (selected.length === 2 || selected.includes(id) || matched.includes(id)) return;

    if (selected.length === 1) {
      const first = selected[0];
      setSelected([first, id]);

      if (tileImages[first] === tileImages[id]) {
        setMatched((p) => [...p, first, id]);
        setSelected([]);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        setIncorrect([first, id]);
        setTimeout(() => setIncorrect([]), 500);
        setTimeout(() => setSelected([]), 500);
      }
    } else {
      setSelected([id]);
    }
  };

  // ✅ Win when all 46 tiles matched
  useEffect(() => {
    if (matched.length === 46) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal]);

  return (
    <div className="relative">
      {/* ✅ Solve button (testing) */}
      {/* <button
        type="button"
        onClick={handleSolveAll}
        className="absolute -top-14 right-0 px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 active:scale-95 transition"
      >
        Solve all (test)
      </button> */}

      <div className="grid grid-cols-13 gap-2 max-w-[95vw] mx-auto place-items-center">
        
        {heartLayout.flat().map((cell, i) => {
          if (cell === null) {
            return <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />;
          }

          if (cell === "B") {
            return (
              <div
                key={i}
                className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 rounded-md bg-pink-500/80"
              />
            );
          }

          const id = cell;
          const isFlipped = selected.includes(id) || matched.includes(id);

          return (
            <motion.div
              key={i}
              className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
              whileHover={{ scale: 1.06 }}
              onClick={() => handleClick(id)}
              style={{ perspective: "1000px" }}
            >
              {!isFlipped && (
                <motion.div
                  className="absolute inset-0 bg-gray-300 rounded-md z-10"
                  style={{ backfaceVisibility: "hidden" }}
                />
              )}

              {isFlipped && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src={tileImages[id]}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                  />
                </motion.div>
              )}

              {incorrect.includes(id) && (
                <motion.div
                  className="absolute inset-0 bg-red-500 rounded-md"
                  animate={{ opacity: [0.6, 0] }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
