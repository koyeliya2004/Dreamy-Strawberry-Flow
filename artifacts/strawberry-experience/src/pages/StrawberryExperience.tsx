import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 5400; // total scroll height (300px per second × ~18s)
const VIDEO_TOTAL = 18; // assumed video length in seconds

const ingredients = [
  { icon: "🍓", label: "Fresh Strawberry", detail: "Sun-ripened, hand-picked" },
  { icon: "🧊", label: "Crushed Ice", detail: "Crystal clear, pure cold" },
  { icon: "🌿", label: "Fresh Mint", detail: "Aromatic, garden-fresh" },
  { icon: "🫧", label: "Sparkling Water", detail: "Effervescent, light" },
];

const products = [
  { name: "Classic Rose", price: "$8.50", gradient: "linear-gradient(135deg,#ffb3c6,#ff6b9d)", glow: "rgba(255,107,157,0.45)" },
  { name: "Berry Dream", price: "$9.50", gradient: "linear-gradient(135deg,#e8b4f8,#c44dff)", glow: "rgba(196,77,255,0.45)" },
  { name: "Sakura Frost", price: "$10.00", gradient: "linear-gradient(135deg,#fde2e4,#ff8fab)", glow: "rgba(255,143,171,0.45)" },
];

export default function StrawberryExperience() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // phase visibility state
  const [phase, setPhase] = useState(0); // 0–5 driven by scroll
  const phaseRef = useRef(0);

  useEffect(() => {
    // ── LOADER ──────────────────────────────────────────────────
    const loaderTl = gsap.timeline();
    loaderTl.to(loaderRef.current, {
      opacity: 0,
      duration: 1.1,
      delay: 1.4,
      ease: "power2.inOut",
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = "none";
      },
    });

    // ── VIDEO SCROLL CONTROL ─────────────────────────────────────
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    // wait for metadata so we know real duration
    const onMeta = () => {
      const realDuration = isFinite(video.duration) ? video.duration : VIDEO_TOTAL;

      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: `+=${SCROLL_DURATION}`,
        scrub: 0.5,
        pin: stickyRef.current,
        onUpdate: (self) => {
          const t = self.progress * realDuration;
          video.currentTime = Math.min(t, realDuration - 0.05);

          // progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }

          // phase detection
          let p = 0;
          if (t >= 2) p = 1;
          if (t >= 5) p = 2;
          if (t >= 8) p = 3;
          if (t >= 11) p = 4;
          if (t >= 14) p = 5;

          if (p !== phaseRef.current) {
            phaseRef.current = p;
            setPhase(p);
            // animate transition
            gsap.fromTo(
              `.phase-${p}`,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
            // hide previous phases
            for (let i = 0; i < 6; i++) {
              if (i !== p) {
                gsap.to(`.phase-${i}`, { opacity: 0, y: -30, duration: 0.5 });
              }
            }
          }

          // zoom video with scroll
          const zoom = 1 + self.progress * 0.18;
          gsap.set(video, { scale: zoom });
        },
      });
    };

    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    // ── PARTICLE CANVAS ──────────────────────────────────────────
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animId: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string };
    const colors = ["#ff6b9d", "#ffb3c6", "#c44dff", "#ff8fab", "#e8b4f8", "#fff"];
    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.7 + 0.1),
      alpha: Math.random() * 0.6 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animParticles = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const visible = phaseRef.current >= 1;
      if (visible) {
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 14;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        }
      }
      animId = requestAnimationFrame(animParticles);
    };
    animParticles();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  return (
    <>
      {/* LOADER */}
      <div ref={loaderRef} className="loader-overlay">
        <div className="loader-ring" />
        <p className="loader-text">Loading Experience</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-track">
        <div ref={progressBarRef} className="progress-fill" />
      </div>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">✦ STRAWBERRY</span>
        <div className="nav-links">
          {["Story", "Menu", "Taste"].map((item) => (
            <a key={item} href="#" className="nav-link">{item}</a>
          ))}
        </div>
      </nav>

      {/* SCROLL WRAPPER */}
      <div ref={scrollRef} style={{ height: `calc(100vh + ${SCROLL_DURATION}px)` }}>
        {/* STICKY SCENE */}
        <div ref={stickyRef} className="sticky-scene">
          {/* VIDEO */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="hero-video"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* GRADIENT OVERLAY */}
          <div className={`video-overlay ${phase >= 5 ? "overlay-dark" : ""}`} />

          {/* PARTICLE CANVAS */}
          <canvas ref={canvasRef} className="particle-canvas" />

          {/* ── PHASE 0: 0–2s — Hero ──────────────────────────── */}
          <div className="phase-layer phase-0" style={{ opacity: phase === 0 ? 1 : 0 }}>
            <div className="hero-center">
              <p className="eyebrow">A Cinematic Taste Journey</p>
              <h1 className="hero-title">
                Strawberry<br />
                <em>Bliss</em>
              </h1>
              <a href="#" className="glass-btn">Explore</a>
            </div>
            <div className="scroll-hint">
              <div className="scroll-line" />
              <span className="scroll-label">SCROLL TO EXPERIENCE</span>
            </div>
          </div>

          {/* ── PHASE 1: 2–5s — Zoom + particles ─────────────── */}
          <div className="phase-layer phase-1" style={{ opacity: phase === 1 ? 1 : 0 }}>
            <div className="hero-center" style={{ paddingTop: "10vh" }}>
              <p className="tag-label">The Journey Begins</p>
              <h2 className="phase-title">Nature's<br />Finest Drop</h2>
              <p className="phase-sub">Watch as the moment unfolds in real time</p>
            </div>
          </div>

          {/* ── PHASE 2: 5–8s — Splash moment ────────────────── */}
          <div className="phase-layer phase-2" style={{ opacity: phase === 2 ? 1 : 0 }}>
            <div className="splash-text-left">
              <span className="impact-tag">IMPACT</span>
              <h2 className="splash-title">Fresh<br />Sweet<br />Refreshing</h2>
            </div>
            <div className="splash-right">
              <p className="phase-sub" style={{ textAlign: "right" }}>The perfect moment captured</p>
            </div>
          </div>

          {/* ── PHASE 3: 8–11s — Ingredient cards ───────────── */}
          <div className="phase-layer phase-3" style={{ opacity: phase === 3 ? 1 : 0 }}>
            <div className="cards-container">
              <p className="eyebrow" style={{ textAlign: "center", marginBottom: "2rem" }}>What's Inside</p>
              <div className="ingredient-grid">
                {ingredients.map((ing, i) => (
                  <div key={ing.label} className="glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="card-icon">{ing.icon}</span>
                    <span className="card-label">{ing.label}</span>
                    <span className="card-detail">{ing.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PHASE 4: 11–14s — Product showcase ───────────── */}
          <div className="phase-layer phase-4" style={{ opacity: phase === 4 ? 1 : 0 }}>
            <div className="cards-container">
              <p className="eyebrow" style={{ textAlign: "center", marginBottom: "0.5rem" }}>Our Collection</p>
              <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2.5rem" }}>Choose Your Blend</h2>
              <div className="product-grid">
                {products.map((p) => (
                  <div
                    key={p.name}
                    className="product-card"
                    style={{ "--card-glow": p.glow } as React.CSSProperties}
                  >
                    <div className="product-visual" style={{ background: p.gradient }}>
                      <span style={{ fontSize: "3rem" }}>🍓</span>
                    </div>
                    <div className="product-info">
                      <span className="product-name">{p.name}</span>
                      <span className="product-price">{p.price}</span>
                    </div>
                    <button className="product-btn">Order</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PHASE 5: 14–18s — CTA ────────────────────────── */}
          <div className="phase-layer phase-5" style={{ opacity: phase === 5 ? 1 : 0 }}>
            <div className="cta-center">
              <p className="eyebrow" style={{ color: "#c44dff" }}>The Experience Awaits</p>
              <h2 className="cta-title">
                Experience<br />
                <span className="gradient-text">the Taste</span>
              </h2>
              <p className="cta-sub">Where every sip is an event. Crafted for those who demand the extraordinary.</p>
              <div className="cta-buttons">
                <a href="#" className="glass-btn glow-purple">Order Now</a>
                <a href="#" className="glass-btn-outline">Learn More</a>
              </div>
              <div className="cta-stats">
                {[["100%", "Natural"], ["12+", "Blends"], ["∞", "Moments"]].map(([n, l]) => (
                  <div key={l} className="stat">
                    <span className="stat-num">{n}</span>
                    <span className="stat-label">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AFTER SCROLL FOOTER */}
      <footer className="footer">
        <p className="footer-brand">✦ STRAWBERRY</p>
        <p className="footer-copy">Crafted with love &amp; science · 2026</p>
      </footer>
    </>
  );
}
