import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PX = 6000; // total scroll distance in px

const ingredients = [
  { icon: "🍓", label: "Fresh Strawberry", detail: "Sun-ripened, hand-picked" },
  { icon: "🧊", label: "Crushed Ice", detail: "Crystal clear, pure cold" },
  { icon: "🌿", label: "Fresh Mint", detail: "Aromatic, garden-fresh" },
  { icon: "🫧", label: "Sparkling Water", detail: "Effervescent, light" },
];

const products = [
  { name: "Classic Rose", price: "$8.50", gradient: "linear-gradient(135deg,#ffb3c6,#ff6b9d)", glow: "rgba(255,107,157,0.5)" },
  { name: "Berry Dream", price: "$9.50", gradient: "linear-gradient(135deg,#e8b4f8,#c44dff)", glow: "rgba(196,77,255,0.5)" },
  { name: "Sakura Frost", price: "$10.00", gradient: "linear-gradient(135deg,#fde2e4,#ff8fab)", glow: "rgba(255,143,171,0.5)" },
];

export default function StrawberryExperience() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // phase refs (DOM elements, not React state)
  const p0Ref = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const p4Ref = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ── LOADER ────────────────────────────────────────────────
    gsap.set(loaderRef.current, { opacity: 1 });
    gsap.to(loaderRef.current, {
      opacity: 0, duration: 1.2, delay: 1.5, ease: "power2.inOut",
      onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = "none"; },
    });

    // ── INIT VIDEO ────────────────────────────────────────────
    video.pause();
    video.currentTime = 0;
    // start all overlay phases hidden except p0
    gsap.set([p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { opacity: 0, y: 0 });
    gsap.set(p0Ref.current, { opacity: 0 });

    // hero entrance (after loader)
    gsap.to(p0Ref.current, { opacity: 1, y: 0, duration: 1.1, delay: 2.2, ease: "power3.out" });

    // ── MASTER SCROLL TIMELINE ────────────────────────────────
    // Proxy object for smooth video scrubbing
    const proxy = { t: 0 };

    const st = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: `+=${SCROLL_PX}`,
      pin: stickyRef.current,
      scrub: 1.2,           // ← the "smoothness" — higher = more buttery lag
      onUpdate(self) {
        const p = self.progress;

        // video time sync
        const dur = isFinite(video.duration) ? video.duration : 18;
        video.currentTime = Math.min(p * dur, dur - 0.01);

        // progress bar
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;

        // video zoom (gentle)
        if (videoWrapRef.current) {
          gsap.set(videoWrapRef.current, { scale: 1 + p * 0.12 });
        }

        // overlay darkening
        if (overlayRef.current) {
          const dark = p > 0.78 ? 0.6 + (p - 0.78) * 1.5 : 0.35;
          overlayRef.current.style.opacity = `${Math.min(dark, 0.88)}`;
        }
      },
    });

    // ── OVERLAY TIMELINE (scrubbed with scroll) ───────────────
    // Each "second" of video = SCROLL_PX/18 px of scroll
    // We express positions as fractions of total scroll (0–1)
    // Video seconds → scroll fraction: s / 18
    // Phases: 0→2s (0–0.11), 2→5s (0.11–0.28), 5→8s (0.28–0.44),
    //         8→11s (0.44–0.61), 11→14s (0.61–0.78), 14→18s (0.78–1)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current,
        start: "top top",
        end: `+=${SCROLL_PX}`,
        scrub: 1.2,
      },
    });

    // PHASE 0: visible 0→0.09, fade out 0.09→0.13
    tl.to(p0Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.09)

    // PHASE 1: fade in 0.10→0.14, hold, fade out 0.24→0.28
    .fromTo(p1Ref.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, ease: "power3.out", duration: 0.04 }, 0.10)
    .to(p1Ref.current, { opacity: 0, y: -40, ease: "power2.in", duration: 0.04 }, 0.25)

    // PHASE 2: fade in 0.27→0.31, hold, fade out 0.41→0.45
    .fromTo(p2Ref.current,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, ease: "power3.out", duration: 0.04 }, 0.27)
    .to(p2Ref.current, { opacity: 0, x: -40, ease: "power2.in", duration: 0.04 }, 0.42)

    // PHASE 3 (cards): fade in 0.44→0.49, hold, fade out 0.58→0.62
    .fromTo(p3Ref.current,
      { opacity: 0, y: 80, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, ease: "back.out(1.2)", duration: 0.05 }, 0.44)
    .to(p3Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.59)

    // PHASE 4 (products): fade in 0.61→0.66, hold, fade out 0.75→0.79
    .fromTo(p4Ref.current,
      { opacity: 0, y: 80, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, ease: "back.out(1.2)", duration: 0.05 }, 0.61)
    .to(p4Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.76)

    // PHASE 5 (CTA): fade in 0.78→0.84, hold to end
    .fromTo(p5Ref.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.06 }, 0.78);

    // ── PARTICLE CANVAS ────────────────────────────────────────
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animId: number;

    const resize = () => {
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; c: string; drift: number };
    const cols = ["#ff6b9d", "#ffb3c6", "#c44dff", "#ff8fab", "#e8b4f8", "rgba(255,255,255,0.8)"];
    const parts: P[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.15),
      a: Math.random() * 0.55 + 0.25,
      c: cols[Math.floor(Math.random() * cols.length)],
      drift: (Math.random() - 0.5) * 0.008,
    }));

    let scrollProgress = 0;
    ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: `+=${SCROLL_PX}`,
      onUpdate: (s) => { scrollProgress = s.progress; },
    });

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const opacity = Math.max(0, (scrollProgress - 0.08) / 0.06);
      if (opacity > 0) {
        for (const p of parts) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = p.a * opacity;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.c;
          ctx.fill();
          p.x += p.vx + Math.sin(Date.now() * p.drift) * 0.3;
          p.y += p.vy;
          if (p.y < -6) { p.y = canvas.height + 6; p.x = Math.random() * canvas.width; }
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      st.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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
        <div ref={progressRef} className="progress-fill" />
      </div>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">✦ STRAWBERRY</span>
        <div className="nav-links">
          {["Story", "Menu", "Taste"].map((n) => (
            <a key={n} href="#" className="nav-link">{n}</a>
          ))}
        </div>
      </nav>

      {/* SCROLL WRAPPER */}
      <div ref={scrollRef} style={{ height: `calc(100vh + ${SCROLL_PX}px)` }}>

        {/* STICKY SCENE */}
        <div ref={stickyRef} className="sticky-scene">

          {/* VIDEO WRAPPER (zoom is applied here) */}
          <div ref={videoWrapRef} className="video-wrap">
            <video
              ref={videoRef}
              muted playsInline preload="auto"
              className="hero-video"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          {/* OVERLAY */}
          <div ref={overlayRef} className="video-overlay" />

          {/* PARTICLES */}
          <canvas ref={canvasRef} className="particle-canvas" />

          {/* AMBIENT GLOW ORBS */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          {/* ── P0: HERO ── */}
          <div ref={p0Ref} className="phase-layer">
            <div className="hero-center">
              <p className="eyebrow">A Cinematic Taste Journey</p>
              <h1 className="hero-title">
                Strawberry<br />
                <em>Bliss</em>
              </h1>
              <a href="#" className="glass-btn">Explore</a>
            </div>
            <div className="scroll-hint">
              <div className="scroll-mouse">
                <div className="scroll-dot" />
              </div>
              <span className="scroll-label">Scroll to Experience</span>
            </div>
          </div>

          {/* ── P1: NATURE'S DROP ── */}
          <div ref={p1Ref} className="phase-layer">
            <div className="hero-center">
              <span className="tag-pill">The Journey Begins</span>
              <h2 className="phase-title">Nature's<br />Finest Drop</h2>
              <p className="phase-sub">Watch the moment unfold</p>
            </div>
          </div>

          {/* ── P2: SPLASH ── */}
          <div ref={p2Ref} className="phase-layer phase-splash">
            <div className="splash-block">
              <span className="splash-tag">— IMPACT —</span>
              <h2 className="splash-title">
                Fresh<br />Sweet<br />Refreshing
              </h2>
            </div>
          </div>

          {/* ── P3: INGREDIENTS ── */}
          <div ref={p3Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="eyebrow" style={{ textAlign: "center", marginBottom: "1.5rem" }}>What's Inside</p>
              <div className="ingredient-grid">
                {ingredients.map((ing) => (
                  <div key={ing.label} className="glass-card">
                    <span className="card-icon">{ing.icon}</span>
                    <span className="card-label">{ing.label}</span>
                    <span className="card-detail">{ing.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── P4: PRODUCTS ── */}
          <div ref={p4Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="eyebrow" style={{ textAlign: "center", marginBottom: "0.4rem" }}>Our Collection</p>
              <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Choose Your Blend</h2>
              <div className="product-grid">
                {products.map((p) => (
                  <div key={p.name} className="product-card" style={{ "--glow": p.glow } as React.CSSProperties}>
                    <div className="product-visual" style={{ background: p.gradient }}>
                      <span className="product-emoji">🍓</span>
                    </div>
                    <div className="product-body">
                      <div className="product-info">
                        <span className="product-name">{p.name}</span>
                        <span className="product-price">{p.price}</span>
                      </div>
                      <button className="product-btn">Order Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── P5: CTA ── */}
          <div ref={p5Ref} className="phase-layer">
            <div className="cta-wrap">
              <p className="eyebrow" style={{ color: "#d580ff" }}>The Experience Awaits</p>
              <h2 className="cta-title">
                Experience<br />
                <span className="gradient-text">the Taste</span>
              </h2>
              <p className="cta-sub">
                Where every sip is an event. Crafted for those<br />who demand the extraordinary.
              </p>
              <div className="cta-btns">
                <a href="#" className="glass-btn glow-purple">Order Now</a>
                <a href="#" className="ghost-btn">Learn More</a>
              </div>
              <div className="cta-stats">
                {[["100%", "Natural"], ["12+", "Blends"], ["∞", "Moments"]].map(([n, l]) => (
                  <div key={l} className="stat">
                    <span className="stat-num">{n}</span>
                    <span className="stat-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-brand">✦ STRAWBERRY</p>
        <p className="footer-copy">Crafted with love &amp; science · 2026</p>
      </footer>
    </>
  );
}
