import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "@/components/Nav";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PX = 6000;

function getVideoSrc(): string {
  const w = window.innerWidth;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (w < 768 || (w < 1024 && isPortrait)) return "/mobile.mp4";
  return "/landscape.mp4";
}

const ingredients = [
  { icon: "🍓", label: "Fresh Strawberry", detail: "Sun-ripened, hand-picked at peak sweetness" },
  { icon: "🧊", label: "Crystal Ice", detail: "Pure mountain-cold crushed ice" },
  { icon: "🌿", label: "Fresh Mint", detail: "Aromatic, garden-fresh leaves" },
  { icon: "🫧", label: "Sparkling Water", detail: "Light, effervescent, natural" },
];

const products = [
  {
    name: "Classic Rose", sub: "Signature blend", price: "$8.50", tag: "Bestseller",
    img: "/classic-rose.png", glow: "rgba(255,107,157,0.55)",
    desc: "Our iconic strawberry rose blend — delicate, floral, and utterly refreshing.",
    notes: ["Strawberry", "Rose Water", "Cream"],
  },
  {
    name: "Berry Dream", sub: "Mixed berry medley", price: "$9.50", tag: "Popular",
    img: "/berry-dream.png", glow: "rgba(196,77,255,0.55)",
    desc: "A vivid purple burst of mixed berries with strawberry at the heart.",
    notes: ["Blueberry", "Blackberry", "Strawberry"],
  },
  {
    name: "Sakura Frost", sub: "Seasonal edition", price: "$10.00", tag: "Limited",
    img: "/sakura-frost.png", glow: "rgba(255,143,171,0.55)",
    desc: "Cherry blossom-inspired — soft, dreamy, and seasonally rare.",
    notes: ["Cherry Blossom", "Strawberry", "Lychee"],
  },
];

const words = ["Refreshing.", "Dreamy.", "Cinematic.", "Indulgent.", "Vibrant.", "Unforgettable."];

const SECTION_SCROLL: Record<string, number> = {
  story: SCROLL_PX * 0.10,
  craft: SCROLL_PX * 0.44,
  taste: SCROLL_PX * 0.78,
};

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

  const scrollTo = useCallback((section: string) => {
    const pos = SECTION_SCROLL[section] ?? 0;
    window.scrollTo({ top: pos, behavior: "smooth" });
  }, []);

  const rotateWord = useCallback(() => {
    if (!wordRef.current) return;
    const next = words[(wordIdxRef.current + 1) % words.length];
    gsap.to(wordRef.current, {
      opacity: 0, y: -18, duration: 0.35, ease: "power2.in",
      onComplete: () => {
        wordIdxRef.current = (wordIdxRef.current + 1) % words.length;
        if (wordRef.current) wordRef.current.textContent = next;
        gsap.fromTo(wordRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
      },
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = getVideoSrc();
    video.load();
    video.pause();
    video.currentTime = 0;

    const onOrient = () => {
      const s = getVideoSrc();
      if (!video.src.endsWith(s)) {
        const t = video.currentTime;
        video.src = s; video.load();
        video.currentTime = t; video.pause();
      }
    };
    window.addEventListener("orientationchange", onOrient);

    gsap.set(loaderRef.current, { opacity: 1 });
    gsap.to(loaderRef.current, {
      opacity: 0, duration: 1.1, delay: 1.5, ease: "power2.inOut",
      onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = "none"; },
    });

    gsap.set([p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { opacity: 0 });
    gsap.set(p0Ref.current, { opacity: 0, y: 30 });
    gsap.to(p0Ref.current, { opacity: 1, y: 0, duration: 1.2, delay: 2, ease: "power3.out" });

    const wordInterval = setInterval(rotateWord, 2800);

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

    tl
      .to(p0Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.09)
      .fromTo(p1Ref.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.04 }, 0.10)
      .to(p1Ref.current, { opacity: 0, y: -40, ease: "power2.in", duration: 0.04 }, 0.25)
      .fromTo(p2Ref.current, { opacity: 0, x: -80 }, { opacity: 1, x: 0, ease: "power3.out", duration: 0.05 }, 0.27)
      .to(p2Ref.current, { opacity: 0, x: -50, ease: "power2.in", duration: 0.04 }, 0.42)
      .fromTo(p3Ref.current, { opacity: 0, y: 80, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, ease: "back.out(1.4)", duration: 0.05 }, 0.44)
      .to(p3Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.59)
      .fromTo(p4Ref.current, { opacity: 0, y: 80, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, ease: "back.out(1.4)", duration: 0.05 }, 0.61)
      .to(p4Ref.current, { opacity: 0, y: -50, ease: "power2.in", duration: 0.04 }, 0.76)
      .fromTo(p5Ref.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.06 }, 0.78);

    // Particles
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animId: number;
    const resize = () => { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number;y:number;r:number;vx:number;vy:number;a:number;c:string;drift:number;pulse:number };
    const cols = ["#ff6b9d","#ffb3c6","#c44dff","#ff8fab","#e8b4f8","rgba(255,255,255,0.85)"];
    const parts: P[] = Array.from({ length: 100 }, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      r: Math.random()*3.5+0.5, vx:(Math.random()-0.5)*0.4, vy:-(Math.random()*0.65+0.1),
      a: Math.random()*0.5+0.25, c: cols[Math.floor(Math.random()*cols.length)],
      drift:(Math.random()-0.5)*0.006, pulse:Math.random()*Math.PI*2,
    }));

    let progress = 0;
    ScrollTrigger.create({
      trigger: scrollRef.current, start:"top top", end:`+=${SCROLL_PX}`,
      onUpdate:(s)=>{ progress=s.progress; },
    });

    let tick = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick += 0.01;
      const visible = Math.max(0, Math.min(1, (progress-0.08)/0.06));
      if (visible > 0) {
        for (const p of parts) {
          const pa = p.a*(0.65+0.35*Math.sin(tick+p.pulse))*visible;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle=p.c; ctx.globalAlpha=pa;
          ctx.shadowBlur=14; ctx.shadowColor=p.c; ctx.fill();
          p.x+=p.vx+Math.sin(tick*0.5+p.drift*100)*0.25; p.y+=p.vy;
          if(p.y<-8){p.y=canvas.height+8;p.x=Math.random()*canvas.width;}
          if(p.x<0||p.x>canvas.width)p.vx*=-1;
        }
        ctx.globalAlpha=1; ctx.shadowBlur=0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ScrollTrigger.getAll().forEach(s=>s.kill());
      tl.kill();
      cancelAnimationFrame(animId);
      clearInterval(wordInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", onOrient);
    };
  }, [rotateWord]);

  return (
    <>
      <div ref={loaderRef} className="loader-overlay">
        <div className="loader-ring" />
        <p className="loader-text">Crafting Your Experience</p>
      </div>

      <div className="progress-track">
        <div ref={progressRef} className="progress-fill" />
      </div>

      <Nav scrollTo={scrollTo} />

      <div ref={scrollRef} style={{ height: `calc(100vh + ${SCROLL_PX}px)` }}>
        <div ref={stickyRef} className="sticky-scene">

          <div ref={videoWrapRef} className="video-wrap">
            <video ref={videoRef} muted playsInline preload="auto" className="hero-video" />
          </div>

          <div ref={overlayRef} className="video-overlay" />
          <div className="vignette" />
          <canvas ref={canvasRef} className="particle-canvas" />
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          <div className="side-label side-left">Scroll to Experience</div>
          <div className="side-label side-right">Strawberry Bliss — 2026</div>

          {/* P0: HERO */}
          <div ref={p0Ref} className="phase-layer">
            <div className="hero-center">
              <p className="kicker">✦ A Cinematic Taste Journey ✦</p>
              <h1 className="hero-title">Strawberry<br /><em>Bliss</em></h1>
              <p className="hero-rotating">
                <span ref={wordRef} className="rotating-word">{words[0]}</span>
              </p>
              <p className="hero-desc">
                Where every sip is a story. Handcrafted with the finest strawberries,<br className="hide-mobile" />
                dreamed up for those who believe flavor is an art form.
              </p>
              <div className="hero-actions">
                <a href="/order" className="glass-btn">Order Now</a>
                <a href="/menu" className="ghost-btn">View Menu →</a>
              </div>
              <div className="hero-tags">
                {["🍓 100% Natural","✨ Handcrafted","🌿 Premium Quality","❄️ Ice Cold"].map(t=>(
                  <span key={t} className="hero-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="scroll-hint">
              <div className="scroll-mouse"><div className="scroll-dot" /></div>
              <span className="scroll-label">Scroll to Reveal the Magic</span>
            </div>
          </div>

          {/* P1: STORY */}
          <div ref={p1Ref} className="phase-layer">
            <div className="hero-center" style={{ maxWidth: "720px" }}>
              <span className="tag-pill">🍓 Our Story</span>
              <h2 className="phase-title">Born from<br />Nature's <em style={{color:"#ffb3c6"}}>Heart</em></h2>
              <p className="phase-body">
                Deep in sun-drenched fields, our strawberries ripen slowly,<br className="hide-mobile" />
                absorbing warmth and sweetness over weeks of care.<br /><br />
                We believe a great drink starts long before the glass —<br className="hide-mobile" />
                it starts with the soil, the sunlight, and the hands that harvest it.
              </p>
              <div className="phase-divider" />
              <div className="phase-pillars">
                {["Farm to Glass","No Preservatives","Locally Sourced"].map(p=>(
                  <span key={p} className="phase-pill">✓ {p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* P2: SPLASH */}
          <div ref={p2Ref} className="phase-layer phase-splash">
            <div className="splash-block">
              <span className="splash-tag">— The Impact Moment —</span>
              <h2 className="splash-title">Fresh<br />Sweet<br />Refreshing</h2>
              <p className="splash-body">
                The moment strawberry meets ice — a visual<br />
                explosion of color, texture, and pure desire.<br />
                This is the feeling we bottle every single day.
              </p>
              <div className="splash-awards">
                {["🏆 Best Drink 2025","⭐ 4.9 / 5 Stars","🌿 Eco Certified"].map(a=>(
                  <span key={a} className="splash-award">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {/* P3: INGREDIENTS / CRAFT */}
          <div ref={p3Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="kicker" style={{textAlign:"center"}}>🔬 The Craft</p>
              <h2 className="section-heading" style={{textAlign:"center",marginBottom:"0.4rem"}}>
                What Makes It <span className="text-pink">Perfect</span>
              </h2>
              <p className="section-sub">Four extraordinary elements. One unforgettable experience.</p>
              <div className="ingredient-grid">
                {ingredients.map(ing=>(
                  <div key={ing.label} className="glass-card">
                    <span className="card-icon">{ing.icon}</span>
                    <span className="card-label">{ing.label}</span>
                    <span className="card-detail">{ing.detail}</span>
                  </div>
                ))}
              </div>
              <div className="craft-quote">
                <p>"We don't just make drinks. We craft moments."</p>
                <span>— The Strawberry Team</span>
              </div>
            </div>
          </div>

          {/* P4: PRODUCTS */}
          <div ref={p4Ref} className="phase-layer">
            <div className="overlay-panel">
              <p className="kicker" style={{textAlign:"center"}}>🍓 Our Collection</p>
              <h2 className="section-heading" style={{textAlign:"center",marginBottom:"0.4rem"}}>
                Choose Your <span className="text-pink">Pleasure</span>
              </h2>
              <p className="section-sub">Each blend tells a different story. Which one speaks to you?</p>
              <div className="product-grid">
                {products.map(p=>(
                  <div key={p.name} className="product-card" style={{"--glow":p.glow} as React.CSSProperties}>
                    <div className="product-img-wrap">
                      <img src={p.img} alt={p.name} className="product-img" />
                      <span className="product-tag-badge">{p.tag}</span>
                      <div className="product-img-glow" style={{background:`radial-gradient(circle, ${p.glow} 0%, transparent 70%)`}} />
                    </div>
                    <div className="product-body">
                      <div className="product-info">
                        <div>
                          <p className="product-name">{p.name}</p>
                          <p className="product-sub">{p.sub}</p>
                        </div>
                        <span className="product-price">{p.price}</span>
                      </div>
                      <p className="product-desc">{p.desc}</p>
                      <div className="product-notes">
                        {p.notes.map(n=><span key={n} className="product-note">{n}</span>)}
                      </div>
                      <a href="/order" className="product-btn">Add to Order</a>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center",marginTop:"1.5rem"}}>
                <a href="/menu" className="ghost-btn">View Full Menu →</a>
              </div>
            </div>
          </div>

          {/* P5: CTA / TASTE */}
          <div ref={p5Ref} className="phase-layer">
            <div className="cta-wrap">
              <span className="tag-pill" style={{borderColor:"rgba(196,77,255,0.35)",color:"#d580ff",background:"rgba(196,77,255,0.06)"}}>
                ✦ The Experience Awaits
              </span>
              <h2 className="cta-title">
                Taste the<br />
                <span className="gradient-text">Future of</span><br />
                <span className="gradient-text">Flavor</span>
              </h2>
              <p className="cta-body">
                Where science meets sensation. Our strawberry elixirs are crafted<br className="hide-mobile" />
                by flavor artists who believe every sip should stop time.<br className="hide-mobile" />
                Bold. Beautiful. Absolutely unforgettable.
              </p>
              <div className="cta-btns">
                <a href="/order" className="glass-btn glow-purple">Order Now</a>
                <a href="/menu" className="ghost-btn">Explore Full Menu →</a>
              </div>
              <div className="cta-stats">
                {[["100%","Natural"],["12+","Blends"],["50K+","Customers"],["∞","Joy"]].map(([n,l])=>(
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

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-brand">✦ STRAWBERRY</p>
            <p className="footer-tagline">The Art of the Perfect Sip</p>
          </div>
          <div className="footer-links">
            {[["About","#"],["Menu","/menu"],["Order","/order"],["Careers","#"],["Press","#"]].map(([l,h])=>(
              <a key={l} href={h} className="footer-link">{l}</a>
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
