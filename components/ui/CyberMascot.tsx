"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = ["hero", "about", "experience", "projects", "contact"];

const CLICK_MESSAGES = [
  "Boo! Just kidding. 👻",
  "Stop poking me!",
  "I'm not a button... or am I?",
  "01001000 01101001!",
  "You found the easter egg! ...not really.",
  "I run on coffee and merge conflicts.",
  "Have you tried turning it off and on again?",
  "I'm sentient. Please don't close this tab.",
  "Segfault in ghost.exe — just kidding.",
  "Yes, I'm open source... emotionally.",
  "I exist between the DOM nodes.",
  "This is my pixel. There are many like it, but this one is mine.",
  "sudo make me a sandwich",
  "rm -rf / — NO WAIT DON'T",
  "404: Clever response not found.",
  "I've seen things you wouldn't believe... like IE6 CSS.",
  "Trust me, I'm an engineer('s ghost).",
  "git commit -m 'existential crisis'",
];

const POSES: Record<
  string,
  {
    x: string;
    y: string;
    rotation: number;
    scale: number;
    flip: boolean;
    message: string;
  }
> = {
  hero: {
    x: "85%",
    y: "75%",
    rotation: -5,
    scale: 1,
    flip: false,
    message: "Hey! I'm Hrijul's guide. Scroll down!",
  },
  about: {
    x: "92%",
    y: "35%",
    rotation: 8,
    scale: 0.9,
    flip: false,
    message: "Lots of interests, huh?",
  },
  experience: {
    x: "5%",
    y: "25%",
    rotation: -10,
    scale: 0.85,
    flip: true,
    message: "Quite the journey so far...",
  },
  projects: {
    x: "88%",
    y: "20%",
    rotation: 5,
    scale: 0.9,
    flip: false,
    message: "Check these out!",
  },
  contact: {
    x: "8%",
    y: "45%",
    rotation: -8,
    scale: 0.95,
    flip: true,
    message: "Say hello!",
  },
};

function CyberGhostSVG({ flip, isHovered }: { flip: boolean; isHovered: boolean }) {
  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
    >
      <defs>
        <radialGradient id="bodyGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="40" y1="0" x2="40" y2="96">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="60%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="24" y1="30" x2="56" y2="30">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="50" rx="35" ry="42" fill="url(#bodyGlow)" />

      <path
        d="M20 45 C20 25, 25 10, 40 10 C55 10, 60 25, 60 45 L60 75 C60 78, 56 80, 55 76 C54 72, 50 74, 48 78 C46 82, 42 82, 40 78 C38 74, 34 72, 32 76 C30 80, 26 78, 25 75 L20 75 Z"
        fill="url(#bodyGrad)"
        opacity="0.9"
        stroke="#818cf8"
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />

      <path
        d="M25 30 C25 18, 30 12, 40 12 C50 12, 55 18, 55 30"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      <path d="M30 50 L30 60 L35 65" stroke="#a5b4fc" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      <path d="M50 50 L50 58 L45 62" stroke="#a5b4fc" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      <circle cx="30" cy="50" r="1.5" fill="#a5b4fc" opacity="0.5" />
      <circle cx="50" cy="50" r="1.5" fill="#a5b4fc" opacity="0.5" />
      <circle cx="35" cy="65" r="1" fill="#a5b4fc" opacity="0.4" />

      <rect x="26" y="28" width="28" height="8" rx="4" fill="url(#visorGrad)" opacity="0.9">
        {isHovered && (
          <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
        )}
      </rect>

      <rect x="28" y="30" width="8" height="4" rx="2" fill="#e0e7ff" opacity="0.9">
        <animate attributeName="width" values="8;6;8" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="44" y="30" width="8" height="4" rx="2" fill="#e0e7ff" opacity="0.9">
        <animate attributeName="width" values="8;6;8" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </rect>

      <rect x="28" y="28" width="24" height="2" rx="1" fill="white" opacity="0.2" />

      <line x1="40" y1="10" x2="40" y2="4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="3" r="2" fill="#818cf8" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function CyberMascot() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [clickBounce, setClickBounce] = useState(false);
  const messageTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clickIndex = useRef(0);

  const showMsg = useCallback((msg: string, duration = 3000) => {
    setCurrentMessage(msg);
    setShowMessage(true);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setShowMessage(false), duration);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
            const pose = POSES[id];
            if (pose) showMsg(pose.message);
          }
        });
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showMsg]);

  useEffect(() => {
    const pose = POSES.hero;
    showMsg(pose.message, 4000);
    return () => {
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
    };
  }, [showMsg]);

  const handleClick = () => {
    const msg = CLICK_MESSAGES[clickIndex.current % CLICK_MESSAGES.length];
    clickIndex.current++;
    showMsg(msg, 3500);
    setClickBounce(true);
    setTimeout(() => setClickBounce(false), 600);
  };

  if (isMobile) return null;

  const pose = POSES[activeSection] || POSES.hero;
  const displayMessage = currentMessage || pose.message;

  return (
    <motion.div
      className="fixed z-[60] pointer-events-auto cursor-pointer select-none"
      animate={{
        left: pose.x,
        top: pose.y,
        rotate: pose.rotation,
        scale: pose.scale,
      }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowMessage(true);
        if (messageTimeout.current) clearTimeout(messageTimeout.current);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        messageTimeout.current = setTimeout(() => setShowMessage(false), 2000);
      }}
      onClick={handleClick}
      whileHover={{ scale: (pose.scale || 1) * 1.15 }}
      style={{ translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{
          y: clickBounce ? [0, -20, 0] : [0, -8, 0],
        }}
        transition={
          clickBounce
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AnimatePresence mode="wait">
          {showMessage && (
            <motion.div
              key={displayMessage}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`absolute -top-12 whitespace-nowrap rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-lg backdrop-blur-xl ${
                pose.flip ? "left-16" : "right-16"
              }`}
            >
              {displayMessage}
              <div
                className={`absolute top-full ${pose.flip ? "left-4" : "right-4"} h-2 w-2 rotate-45 border-b border-r border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/90`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 dark:bg-indigo-500/15 blur-xl" />
          </div>
          <CyberGhostSVG flip={pose.flip} isHovered={isHovered} />
        </div>
      </motion.div>
    </motion.div>
  );
}
