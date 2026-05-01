import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_HERO = "/Strawberry_Drink_In_a_cinematic_style_a_refreshing_pink_yoEQJp_1777613383841.mp4";
const VIDEO_2 = "/Strawberry_Drink_A_strawberry-infused_beverage_with_ice_and_mi_1777613383841.mp4";
const VIDEO_3 = "/Strawberry_Drink_A_chilled_pink_beverage_in_a_glass_adorned_wi_1777613383843.mp4";

const glassCards = [
  {
    icon: "🍓",
    title: "Fresh Strawberries",
    desc: "Hand-picked at peak ripeness, bursting with natural sweetness and antioxidants from the finest farms.",
  },
  {
    icon: "❄️",
    title: "Ice Cold Perfection",
    desc: "Served over crystalline ice to maintain the ideal temperature, preserving every nuance of flavor.",
  },
  {
    icon: "✨",
    title: "Dreamy Blend",
    desc: "A velvety smooth fusion crafted with precision — the perfect balance of tart and sweet.",
  },
];

const productCards = [
  {
    name: "Classic Rose",
    price: "$8.50",
    tags: ["Fresh", "Vegan"],
    gradient: "linear-gradient(135deg, #ffb3c6 0%, #ff6b9d 100%)",
    glow: "rgba(255, 107, 157, 0.4)",
    desc: "Our signature strawberry blend with a delicate rose finish.",
  },
  {
    name: "Berry Dream",
    price: "$9.50",
    tags: ["Premium", "Popular"],
    gradient: "linear-gradient(135deg, #e8b4f8 0%, #c44dff 100%)",
    glow: "rgba(196, 77, 255, 0.4)",
    desc: "Mixed berry medley with strawberry at its heart.",
  },
  {
    name: "Sakura Frost",
    price: "$10.00",
    tags: ["Limited", "Seasonal"],
    gradient: "linear-gradient(135deg, #fde2e4 0%, #ff8fab 100%)",
    glow: "rgba(255, 143, 171, 0.4)",
    desc: "Inspired by cherry blossom season — floral, delicate, unforgettable.",
  },
];

export default function StrawberryExperience() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroBtnRef = useRef<HTMLAnchorElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Loading animation
    const tl = gsap.timeline();
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 1.2,
      delay: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = "none";
      },
    });

    // Hero text entrance
    tl.from(
      heroTextRef.current,
      { opacity: 0, y: 60, duration: 1.2, ease: "power3.out" },
      "-=0.4"
    );
    tl.from(heroBtnRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6");

    // Video zoom on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        if (videoRef.current) {
          gsap.set(videoRef.current, {
            scale: 1 + progress * 0.3,
          });
        }
        if (heroTextRef.current) {
          gsap.set(heroTextRef.current, {
            opacity: 1 - progress * 2,
            y: -progress * 80,
          });
        }
      },
    });

    // Section 1 cards
    const cards = section1Ref.current?.querySelectorAll(".glass-card");
    if (cards) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 80,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });
    }

    // Section 1 heading
    gsap.from(section1Ref.current?.querySelector(".section-heading") ?? {}, {
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top 75%",
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
    });

    // Section 2 product cards
    const productEls = section2Ref.current?.querySelectorAll(".product-card");
    if (productEls) {
      gsap.from(productEls, {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.85,
        y: 60,
        stagger: 0.18,
        duration: 1,
        ease: "back.out(1.4)",
      });
    }

    gsap.from(section2Ref.current?.querySelector(".section-heading") ?? {}, {
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "top 75%",
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
    });

    // Section 3 entrance
    gsap.from(section3Ref.current?.querySelector(".s3-content") ?? {}, {
      scrollTrigger: {
        trigger: section3Ref.current,
        start: "top 65%",
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });

    // Particle canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: {
      x: number; y: number; r: number;
      vx: number; vy: number;
      opacity: number; color: string;
    }[] = [];

    const colors = ["#ff6b9d", "#c44dff", "#ffb3c6", "#e8b4f8", "#ff8fab", "#fff0f6"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.2),
        opacity: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      }
      animFrameId = requestAnimationFrame(animParticles);
    };
    animParticles();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* LOADER */}
      <div
        ref={loaderRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "linear-gradient(135deg, #1a0010 0%, #2d0030 50%, #1a000d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
        }}
      >
        <div className="loader-ring" />
        <p style={{ color: "#ffb3c6", fontSize: "1rem", letterSpacing: "0.3em", fontWeight: 300, textTransform: "uppercase" }}>
          Loading Experience
        </p>
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1.25rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(20, 0, 15, 0.35)",
        borderBottom: "1px solid rgba(255, 180, 210, 0.08)",
      }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffb3c6", letterSpacing: "0.15em" }}>
          ✦ STRAWBERRY
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Story", "Menu", "Discover"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: "rgba(255,200,220,0.75)", fontSize: "0.85rem", letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffb3c6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,200,220,0.75)")}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <source src={VIDEO_HERO} type="video/mp4" />
        </video>
        {/* gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(30,0,20,0.55) 0%, rgba(60,0,40,0.35) 50%, rgba(20,0,15,0.75) 100%)",
        }} />
        {/* hero text */}
        <div
          ref={heroTextRef}
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          <p style={{ color: "#ffb3c6", fontSize: "0.8rem", letterSpacing: "0.4em", fontWeight: 400, marginBottom: "1.5rem", textTransform: "uppercase" }}>
            A Cinematic Taste Journey
          </p>
          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
            textShadow: "0 0 60px rgba(255, 100, 150, 0.5)",
          }}>
            Strawberry<br />
            <span style={{ color: "#ffb3c6", fontStyle: "italic" }}>Experience</span>
          </h1>
          <a
            ref={heroBtnRef}
            href="#story"
            className="glass-btn"
          >
            Explore
          </a>
        </div>
        {/* scroll hint */}
        <div style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "rgba(255,180,200,0.6)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
        }}>
          <div className="scroll-line" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* SECTION 1 — Glass Cards */}
      <section
        id="story"
        ref={section1Ref}
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1a000d 0%, #2a0018 50%, #1a000d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="section-heading" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ color: "#ffb3c6", fontSize: "0.8rem", letterSpacing: "0.4em", marginBottom: "1rem", textTransform: "uppercase" }}>
            The Story
          </p>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}>
            Every sip is a <span style={{ color: "#ff8fab" }}>dream</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1100px",
          width: "100%",
        }}>
          {glassCards.map((card) => (
            <div key={card.title} className="glass-card" style={{
              background: "rgba(255, 180, 210, 0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 180, 210, 0.18)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              boxShadow: "0 8px 40px rgba(255, 100, 157, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              cursor: "default",
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-8px)";
                el.style.boxShadow = "0 20px 60px rgba(255, 100, 157, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 8px 40px rgba(255, 100, 157, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1.25rem" }}>{card.icon}</div>
              <h3 style={{ color: "#ffb3c6", fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem", letterSpacing: "0.02em" }}>
                {card.title}
              </h3>
              <p style={{ color: "rgba(255, 220, 235, 0.7)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* secondary video */}
        <div style={{ marginTop: "5rem", width: "100%", maxWidth: "900px", borderRadius: "24px", overflow: "hidden", position: "relative" }}>
          <video autoPlay loop muted playsInline style={{ width: "100%", display: "block" }}>
            <source src={VIDEO_2} type="video/mp4" />
          </video>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 60%, rgba(20,0,13,0.9) 100%)",
          }} />
        </div>
      </section>

      {/* SECTION 2 — Product Showcase */}
      <section
        id="menu"
        ref={section2Ref}
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1a000d 0%, #210012 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem",
        }}
      >
        <div className="section-heading" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ color: "#c44dff", fontSize: "0.8rem", letterSpacing: "0.4em", marginBottom: "1rem", textTransform: "uppercase" }}>
            Our Menu
          </p>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}>
            Choose your <span style={{ color: "#c44dff" }}>pleasure</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          width: "100%",
        }}>
          {productCards.map((card) => (
            <div
              key={card.name}
              className="product-card"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.04) translateY(-6px)";
                el.style.boxShadow = `0 24px 60px ${card.glow}, 0 0 0 1px rgba(255,255,255,0.1)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1) translateY(0)";
                el.style.boxShadow = `0 8px 30px ${card.glow.replace("0.4", "0.2")}`;
              }}
            >
              <div style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "rgba(30, 0, 20, 0.6)",
                border: "1px solid rgba(255,180,210,0.12)",
                boxShadow: `0 8px 30px ${card.glow.replace("0.4", "0.2")}`,
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}>
                {/* gradient visual */}
                <div style={{
                  height: "220px",
                  background: card.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "5rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.1)",
                  }} />
                  <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }}>🍓</span>
                  {/* glow orb */}
                  <div style={{
                    position: "absolute",
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    filter: "blur(40px)",
                    bottom: "-40px",
                    right: "-40px",
                  }} />
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {card.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "100px",
                        background: "rgba(255,180,210,0.1)",
                        border: "1px solid rgba(255,180,210,0.2)",
                        color: "#ffb3c6",
                        textTransform: "uppercase",
                      }}>{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.5rem" }}>{card.name}</h3>
                  <p style={{ color: "rgba(255,220,235,0.65)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{card.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#ffb3c6", fontSize: "1.3rem", fontWeight: 700 }}>{card.price}</span>
                    <button style={{
                      background: "linear-gradient(135deg, rgba(255,107,157,0.25), rgba(196,77,255,0.25))",
                      border: "1px solid rgba(255,180,210,0.25)",
                      borderRadius: "100px",
                      padding: "0.5rem 1.25rem",
                      color: "#ffb3c6",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      backdropFilter: "blur(8px)",
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,107,157,0.5), rgba(196,77,255,0.5))";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,107,157,0.25), rgba(196,77,255,0.25))";
                      }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Immersive + Particles */}
      <section
        id="discover"
        ref={section3Ref}
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0d0020 0%, #1a003a 40%, #2d0015 100%)",
        }}
      >
        {/* particle canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* neon glow orbs */}
        <div style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,77,255,0.15) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,157,0.15) 0%, transparent 70%)",
          bottom: "10%",
          right: "10%",
          filter: "blur(60px)",
        }} />

        {/* video background */}
        <video autoPlay loop muted playsInline style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.18,
        }}>
          <source src={VIDEO_3} type="video/mp4" />
        </video>

        <div
          className="s3-content"
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 2rem",
            maxWidth: "800px",
          }}
        >
          <p style={{ color: "#c44dff", fontSize: "0.8rem", letterSpacing: "0.4em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            The Experience Awaits
          </p>
          <h2 style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
            textShadow: "0 0 80px rgba(196, 77, 255, 0.5)",
          }}>
            Taste the<br />
            <span className="gradient-text">Future of Flavor</span>
          </h2>
          <p style={{
            color: "rgba(255, 220, 235, 0.7)",
            fontSize: "1.1rem",
            lineHeight: 1.8,
            marginBottom: "3rem",
            maxWidth: "560px",
            margin: "0 auto 3rem",
          }}>
            Where technology meets taste — our lab-crafted strawberry elixirs push the boundaries of what a drink can be.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#menu" className="glass-btn" style={{
              background: "linear-gradient(135deg, rgba(196,77,255,0.25), rgba(255,107,157,0.25))",
              borderColor: "rgba(196,77,255,0.4)",
            }}>
              View Menu
            </a>
            <a href="#" className="glass-btn-outline">
              Our Story
            </a>
          </div>

          {/* stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid rgba(255,180,210,0.1)",
          }}>
            {[
              { num: "100%", label: "Fresh Ingredients" },
              { num: "12+", label: "Signature Blends" },
              { num: "∞", label: "Moments of Joy" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#ffb3c6", marginBottom: "0.5rem" }}>{stat.num}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,200,220,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0d0009",
        padding: "3rem 2rem",
        textAlign: "center",
        borderTop: "1px solid rgba(255,180,210,0.08)",
      }}>
        <p style={{ color: "#ffb3c6", fontSize: "1.2rem", fontWeight: 600, letterSpacing: "0.2em", marginBottom: "0.5rem" }}>✦ STRAWBERRY</p>
        <p style={{ color: "rgba(255,200,220,0.4)", fontSize: "0.8rem" }}>Crafted with love &amp; science · 2026</p>
      </footer>
    </>
  );
}
