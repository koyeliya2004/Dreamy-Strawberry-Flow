import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "@/components/Nav";

gsap.registerPlugin(ScrollTrigger);

const menuItems = [
  {
    category: "🍓 Signature Blends",
    items: [
      { name: "Classic Rose", price: "$8.50", desc: "Strawberry, rose water, cream — our iconic blend.", img: "/classic-rose.png", tag: "Bestseller", cal: "220 cal" },
      { name: "Berry Dream", price: "$9.50", desc: "Mixed berries, blueberry, blackberry meets strawberry.", img: "/berry-dream.png", tag: "Popular", cal: "195 cal" },
      { name: "Sakura Frost", price: "$10.00", desc: "Cherry blossom, strawberry, lychee — seasonally rare.", img: "/sakura-frost.png", tag: "Limited", cal: "180 cal" },
    ],
  },
  {
    category: "❄️ Frozen Specials",
    items: [
      { name: "Strawberry Slush", price: "$7.00", desc: "Crushed ice, pure strawberry, a splash of lime.", img: "/classic-rose.png", tag: "Refreshing", cal: "160 cal" },
      { name: "Berry Blizzard", price: "$8.00", desc: "Frozen berry medley blended to silky perfection.", img: "/berry-dream.png", tag: "Cold", cal: "205 cal" },
      { name: "Pink Petal Freeze", price: "$9.00", desc: "Floral strawberry frozen cream, topped with petals.", img: "/sakura-frost.png", tag: "Dreamy", cal: "240 cal" },
    ],
  },
  {
    category: "✨ Premium Collection",
    items: [
      { name: "Rose Gold", price: "$12.00", desc: "24K strawberry elixir with edible gold flakes.", img: "/classic-rose.png", tag: "Luxury", cal: "260 cal" },
      { name: "Midnight Berry", price: "$11.50", desc: "Dark berry blend with a neon pink swirl finish.", img: "/berry-dream.png", tag: "Exclusive", cal: "215 cal" },
      { name: "Blossom Supreme", price: "$13.00", desc: "The pinnacle of our craft — floral, sweet, rare.", img: "/sakura-frost.png", tag: "Chef's Pick", cal: "290 cal" },
    ],
  },
];

export default function MenuPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: "back.out(1.2)",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          delay: (i % 3) * 0.1,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  let itemCount = 0;

  return (
    <div className="page-wrap">
      <Nav />

      {/* HERO */}
      <div className="menu-hero" ref={heroRef}>
        <div className="menu-hero-orb menu-orb-1" />
        <div className="menu-hero-orb menu-orb-2" />
        <p className="kicker">✦ Full Collection</p>
        <h1 className="menu-hero-title">Our <span className="gradient-text">Menu</span></h1>
        <p className="menu-hero-sub">
          Every drink is a handcrafted story. Explore our full range of<br className="hide-mobile" />
          strawberry elixirs, frozen blends, and premium collections.
        </p>
        <div className="menu-hero-badges">
          {["🍓 Fresh Daily","🌿 Natural","❄️ Ice Cold","✨ Premium"].map(b => (
            <span key={b} className="hero-tag">{b}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="menu-content">
        {menuItems.map((cat) => (
          <section key={cat.category} className="menu-category">
            <div className="cat-header">
              <h2 className="cat-title">{cat.category}</h2>
              <div className="cat-line" />
            </div>
            <div className="menu-grid">
              {cat.items.map((item) => {
                const idx = itemCount++;
                return (
                  <div
                    key={item.name}
                    className="menu-card"
                    ref={el => { itemRefs.current[idx] = el; }}
                  >
                    <div className="menu-card-img-wrap">
                      <img src={item.img} alt={item.name} className="menu-card-img" />
                      <span className="menu-card-badge">{item.tag}</span>
                    </div>
                    <div className="menu-card-body">
                      <div className="menu-card-top">
                        <h3 className="menu-card-name">{item.name}</h3>
                        <span className="menu-card-price">{item.price}</span>
                      </div>
                      <p className="menu-card-desc">{item.desc}</p>
                      <div className="menu-card-footer">
                        <span className="menu-card-cal">{item.cal}</span>
                        <a href="/order" className="menu-card-btn">Order →</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ALLERGENS NOTE */}
        <div className="menu-note">
          <p>🌿 All our drinks are made fresh daily with natural ingredients. Please inform us of any allergies.</p>
          <p>Calorie counts are approximate. Customisations available on request.</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-brand">✦ STRAWBERRY</p>
            <p className="footer-tagline">The Art of the Perfect Sip</p>
          </div>
          <div className="footer-links">
            {[["Home","/"],["Order","/order"],["About","#"]].map(([l,h])=>(
              <a key={l} href={h} className="footer-link">{l}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Strawberry Experience. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
