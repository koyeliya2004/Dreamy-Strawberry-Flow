import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PX = 6000;

// ── Video source by device ────────────────────────────────────────
function getVideoSrc(): string {
  const w = window.innerWidth;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (w < 768 || (w < 1024 && isPortrait)) return "/mobile.mp4";
  if (w < 1200) return "/landscape.mp4";
  return "/hero.mp4";
}

const ingredients = [
  { icon: "🍓", label: "Fresh Strawberry", detail: "Sun-ripened, hand-picked" },
  { icon: "🧊", label: "Crystal Ice", detail: "Pure mountain-cold" },
  { icon: "🌿", label: "Fresh Mint", detail: "Aromatic, garden-fresh" },
  { icon: "🫧", label: "Sparkling Water", detail: "Light & effervescent" },
];

const products = [
  { name: "Classic Rose", sub: "Signature blend", price: "$8.50", tag: "Bestseller", gradient: "linear-gradient(135deg,#ffb3c6,#ff6b9d)", glow: "rgba(255,107,157,0.5)" },
  { name: "Berry Dream", sub: "Mixed medley", price: "$9.50", tag: "Popular", gradient: "linear-gradient(135deg,#e8b4f8,#c44dff)", glow: "rgba(196,77,255,0.5)" },
  { name: "Sakura Frost", sub: "Seasonal edition", price: "$10.00", tag: "Limited", gradient: "linear-gradient(135deg,#fde2e4,#ff8fab)", glow: "rgba(255,143,171,0.5)" },
];

const words = ["Refreshing.", "Dreamy.", "Cinematic.", "Indulgent.", "Vibrant."];

export default function StrawberryExperience() {
  const loaderRef    = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const p0Ref = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const p4Ref = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wordIdxRef = useRef(0);

  // ── Rotating words ─────────────────────────────────────────────
  const rotateWord = useCallback(() => {
    if (!wordRef.current) return;
    const next = words[(wordIdxRef.current + 1) % words.length];
    gsap.to(wordRef.current, {
      opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
      onComplete: () => {
        wordIdxRef.current = (wordIdxRef.current + 1) % words.length;
        if (wordRef.current) wordRef.current.textContent = next;
        gsap.fromTo(wordRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      },
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ── Set responsive video source ─────────────────────────────
    video.src = getVideoSrc();
    video.load();
    video.pause();
    video.currentTime = 0;

    // Re-swap on orientation change
    const onOrientationChange = () => {
      const newSrc = getVideoSrc();
      if (video.src !== window.location.origin + newSrc) {
        const t = video.currentTime;
        video.src = newSrc;
        video.load();
        video.currentTime = t;
        video.pause();
      }
    };
    window.addEventListener("orientationchange", onOrientationChange);

    // ── Loader ──────────────────────────────────────────────────
    gsap.set(loaderRef.current, { opacity: 1 });
    gsap.to(loaderRef.current, {
      opacity: 0, duration: 1.1, delay: 1.5, ease: "power2.inOut",
      onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = "none"; },
    });

    // Initial overlay states
    gsap.set([p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { opacity: 0 });
    gsap.set(p0Ref.current, { opacity: 0, y: 30 });

    // Hero entrance
    gsap.to(p0Ref.current, { opacity: 1, y: 0, duration: 1.2, delay: 2, ease: "power3.out" });

    // Rotating words timer
    const wordInterval = setInterval(rotateWord, 2800);

    // ── GSAP Master Timeline ─────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current,
        start: "top top",
        end: `+=${SCROLL_PX}`,
        pin: stickyRef.current,
        scrub: 1.2,
        onUpdate(self) {
          const p = self.progress;
          const dur = isFinite(video.duration) ? video.duration : 18;
          video.currentTime = Math.min(p * dur, dur - 0.01);
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
          if (videoWrapRef.current) gsap.set(videoWrapRef.current, { scale: 1 + p * 0.1 });
          if (overlayRef.current) {
            const d = p > 0.78 ? 0.38 + (p - 0.78) * 2.5 : 0.38;
            overlayRef.current.style.opacity = `${Math.min(d, 0.92)}`;
          }
        },
      },
    });

    // Phase transitions
    tl
      .to(p0Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.09)

      .fromTo(p1Ref.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.04 }, 0.10)
      .to(p1Ref.current, { opacity: 0, y: -40, ease: "power2.in", duration: 0.04 }, 0.25)

      .fromTo(p2Ref.current, { opacity: 0, x: -80, skewX: 4 }, { opacity: 1, x: 0, skewX: 0, ease: "power3.out", duration: 0.05 }, 0.27)
      .to(p2Ref.current, { opacity: 0, x: -50, ease: "power2.in", duration: 0.04 }, 0.42)

      .fromTo(p3Ref.current, { opacity: 0, y: 80, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, ease: "back.out(1.4)", duration: 0.05 }, 0.44)
      .to(p3Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.59)

      .fromTo(p4Ref.current, { opacity: 0, y: 80, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, ease: "back.out(1.4)", duration: 0.05 }, 0.61)
      .to(p4Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.76)

      .fromTo(p5Ref.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.06 }, 0.78);

    // ── Particles ────────────────────────────────────────────────
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animId: number;

    const resize = () => {
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; c: string; drift: number; pulse: number };
    const cols = ["#ff6b9d", "#ffb3c6", "#c44dff", "#ff8fab", "#e8b4f8", "rgba(255,255,255,0.9)"];
    const parts: P[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.65 + 0.1),
      a: Math.random() * 0.55 + 0.2,
      c: cols[Math.floor(Math.random() * cols.length)],
      drift: (Math.random() - 0.5) * 0.006,
      pulse: Math.random() * Math.PI * 2,
    }));

    let progress = 0;
    ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: `+=${SCROLL_PX}`,
      onUpdate: (s) => { progress = s.progress; },
    });

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      const visible = Math.max(0, Math.min(1, (progress - 0.08) / 0.06));
      if (visible > 0) {
        for (const p of parts) {
          const pulsed = p.a * (0.7 + 0.3 * Math.sin(t + p.pulse)) * visible;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = pulsed;
          ctx.shadowBlur = 14;
          ctx.shadowColor = p.c;
          ctx.fill();
          p.x += p.vx + Math.sin(t * 0.5 + p.drift * 100) * 0.25;
          p.y += p.vy;
          if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ScrollTrigger.getAll().forEach((s) => s.kill());
      tl.kill();
      cancelAnimationFrame(animId);
      clearInterval(wordInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, [rotateWord]);

  return (
    <>
      {/* LOADER */}
      <div ref={loaderRef} className="loader-overlay">
        <div className="loader-ring" />
        <p className="loader-text">Crafting Your Experience</p>
      </div>

      {/* PROGRESS */}
      <div className="progress-track">
        <div ref={progressRef} className="progress-fill" />
      </div>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">✦ STRAWBERRY</span>
        <div className="nav-links">
          {["Story", "Craft", "Menu", "Taste"].map((n) => (
            <a key={n} href="#" className="nav-link">{n}</a>
          ))}
        </div>
        <a href="#" className="nav-cta">Order Now</a>
      </nav>

      {/* SCROLL WRAPPER */}
      <div ref={scrollRef} style={{ height: `calc(100vh + ${SCROLL_PX}px)` }}>
        <div ref={stickyRef} className="sticky-scene">

          {/* VIDEO */}
          <div ref={videoWrapRef} className="video-wrap">
            <video ref={videoRef} muted playsInline preload="auto" className="hero-video" />
          </div>

          {/* OVERLAY */}
          <div ref={overlayRef} className="video-overlay" />

          {/* VIGNETTE */}
          <div className="vignette" />

          {/* PARTICLES */}
          <canvas ref={canvasRef} className="particle-canvas" />

          {/* AMBIENT ORBS */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          {/* SIDE LABELS */}
          <div className="side-label side-left">Scroll to Experience</div>
          <div className="side-label side-right">Strawberry Bliss — 2026</div>

          {/* ── P0: HERO ────────────────────────────── */}
          <div ref={p0Ref} className="phase-layer">
            <div className="hero-center">
              <p className="kicker">A Cinematic Taste Journey</p>
              <h1 className="hero-title">
                Strawberry<br />
                <em>Bliss</em>
              </h1>
              <p className="hero-rotating">
                <span ref={wordRef} className="rotating-word">{words[0]}</span>
              </p>
              <div className="hero-actions">
                <a href="#" className="glass-btn">Explore Now</a>
                <a href="#" className="ghost-btn">Our Story →</a>
              </div>
              <div className="hero-tags">
                {["100% Natural", "Handcrafted", "Premium"].map((t) => (
                  <span key={t} className="hero-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="scroll-hint">
              <div className="scroll-mouse"><div className="scroll-dot" /></div>
              <span className="scroll-label">Scroll to Reveal</span>
            </div>
          </div>

          {/* ── P1: NATURE'S DROP ─────────────────── */}
          <div ref={p1Ref} className="phase-layer">
            <div className="hero-center">
              <span className="tag-pill">✦ The Journey Begins</span>
              <h2 className="phase-title">
                Nature's<br />Finest <em style={{ color: "#ffb3c6" }}>Drop</em>
              </h2>
              <p className="phase-body">
                Handpicked at the peak of the season,<br />
                every berry carries the warmth of summer<br />
                and the sweetness of pure nature.
              </p>
              <div className="phase-divider" />
              <p className="phase-sub">Watch it unfold below</p>
            </div>
          </div>

          {/* ── P2: SPLASH ────────────────────────── */}
          <div ref={p2Ref} className="phase-layer phase-splash">
            <div className="splash-block">
              <span className="splash-tag">— IMPACT MOMENT —</span>
              <h2 className="splash-title">
                Fresh<br />
                Sweet<br />
                Refreshing
              </h2>
              <p className="splash-body">
                The moment of collision —<br />liquid crowns, suspended droplets,<br />pure visual poetry.
              </p>
            </div>
          </div>

          {/* ── P3: INGREDIENTS ───────────────────── */}
          <div ref={p3Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="kicker" style={{ textAlign: "center", marginBottom: "0.4rem" }}>The Formula</p>
              <h2 className="section-heading" style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                What Makes It <span className="text-pink">Perfect</span>
              </h2>
              <p className="section-sub">Four elements. One unforgettable sip.</p>
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

          {/* ── P4: PRODUCTS ──────────────────────── */}
          <div ref={p4Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="kicker" style={{ textAlign: "center", marginBottom: "0.4rem" }}>Our Collection</p>
              <h2 className="section-heading" style={{ textAlign: "center", marginBottom: "0.6rem" }}>
                Choose Your <span className="text-pink">Pleasure</span>
              </h2>
              <p className="section-sub">Every blend tells a story. Which one is yours?</p>
              <div className="product-grid">
                {products.map((p) => (
                  <div key={p.name} className="product-card" style={{ "--glow": p.glow } as React.CSSProperties}>
                    <div className="product-visual" style={{ background: p.gradient }}>
                      <span className="product-emoji">🍓</span>
                      <span className="product-tag-badge">{p.tag}</span>
                    </div>
                    <div className="product-body">
                      <div className="product-info">
                        <div>
                          <p className="product-name">{p.name}</p>
                          <p className="product-sub">{p.sub}</p>
                        </div>
                        <span className="product-price">{p.price}</span>
                      </div>
                      <button className="product-btn">Add to Order</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── P5: CTA ───────────────────────────── */}
          <div ref={p5Ref} className="phase-layer">
            <div className="cta-wrap">
              <span className="tag-pill" style={{ borderColor: "rgba(196,77,255,0.35)", color: "#d580ff", background: "rgba(196,77,255,0.06)" }}>
                ✦ The Experience Awaits
              </span>
              <h2 className="cta-title">
                Taste the<br />
                <span className="gradient-text">Future of</span><br />
                <span className="gradient-text">Flavor</span>
              </h2>
              <p className="cta-body">
                Where science meets sensation — our lab-crafted<br />
                strawberry elixirs redefine what a drink can feel like.<br />
                Bold. Beautiful. Unforgettable.
              </p>
              <div className="cta-btns">
                <a href="#" className="glass-btn glow-purple">Order Now</a>
                <a href="#" className="ghost-btn">Explore Menu →</a>
              </div>
              <div className="cta-stats">
                {[["100%", "Natural Ingredients"], ["12+", "Signature Blends"], ["50K+", "Happy Customers"], ["∞", "Moments of Joy"]].map(([n, l]) => (
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
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-brand">✦ STRAWBERRY</p>
            <p className="footer-tagline">The Art of the Perfect Sip</p>
          </div>
          <div className="footer-links">
            {["About", "Menu", "Locations", "Careers", "Press"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Strawberry Experience. Crafted with love &amp; science.</p>
          <p className="footer-copy">All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
