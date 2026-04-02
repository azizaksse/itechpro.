import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language, languageNames, languageFlags } from "@/contexts/LanguageContext";

const languages: Language[] = ["ar", "fr", "en"];

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-secondary group relative overflow-hidden"
      >
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), transparent)" }} />
        <Globe size={16} className="relative z-10 group-hover:text-primary transition-colors duration-200" />
        <span className="text-xs font-medium relative z-10 hidden sm:inline">{languageFlags[lang]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 min-w-[160px] rounded-xl border border-secondary bg-card p-1.5 shadow-[0_10px_40px_-10px_hsl(0_0%_0%/0.5)]"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="absolute inset-0 rounded-xl opacity-50" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.06), transparent 70%)" }} />
            {languages.map((l) => {
              const isActive = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setOpen(false);
                  }}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="text-base">{languageFlags[l]}</span>
                  <span className="flex-1 text-right">{languageNames[l]}</span>
                  {isActive && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
