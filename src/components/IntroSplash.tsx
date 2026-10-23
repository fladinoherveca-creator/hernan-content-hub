import { useEffect, useState } from "react";
import escudo from "@/assets/emblema-hvc.png.asset.json";
import { useSiteContent } from "@/lib/content";

const SEEN_KEY = "hvc-intro-seen";
const HOLD_MS = 2200;
const FADE_MS = 700;
const FALLBACK_NAME = "I.E.D. Hernán Venegas Carrillo";

/** Full-screen entrance that shows the school crest and name before the home page. */
export function IntroSplash() {
  const { data } = useSiteContent();
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* storage blocked */ }
    if (seen) { setPhase("gone"); return; }
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked */ }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setPhase("out"), reduced ? 300 : HOLD_MS);
    const t2 = setTimeout(() => setPhase("gone"), reduced ? 500 : HOLD_MS + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase === "gone") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  if (phase === "gone") return null;

  const name = data?.school_name || FALLBACK_NAME;

  return (
    <div
      role="presentation"
      onClick={() => setPhase("gone")}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-primary-deep px-6 text-center text-primary-foreground ${phase === "out" ? "intro-out" : ""}`}
    >
      <img
        src={escudo.url}
        alt="Escudo de la institución"
        className="intro-shield h-44 w-44 object-contain drop-shadow-lg sm:h-56 sm:w-56"
      />
      <div className="flex h-[7.5rem] items-center justify-center sm:h-[12rem]">
        <h1 className="intro-name max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">{name}</h1>
      </div>
      <span className="intro-line block h-[3px] w-40 rounded-full bg-accent" />
      <p className="intro-sub text-sm uppercase tracking-[0.2em] opacity-80">Tocaima · Cundinamarca</p>
    </div>
  );
}
