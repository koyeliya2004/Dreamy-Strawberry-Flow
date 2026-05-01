import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Nav from "@/components/Nav";

const drinks = [
  { id: "classic-rose", name: "Classic Rose", price: 8.50, img: "/classic-rose.png" },
  { id: "berry-dream", name: "Berry Dream", price: 9.50, img: "/berry-dream.png" },
  { id: "sakura-frost", name: "Sakura Frost", price: 10.00, img: "/sakura-frost.png" },
  { id: "strawberry-slush", name: "Strawberry Slush", price: 7.00, img: "/classic-rose.png" },
  { id: "berry-blizzard", name: "Berry Blizzard", price: 8.00, img: "/berry-dream.png" },
  { id: "rose-gold", name: "Rose Gold", price: 12.00, img: "/sakura-frost.png" },
];

const sizes = [
  { id: "sm", label: "Small", oz: "12oz", mod: 0 },
  { id: "md", label: "Medium", oz: "16oz", mod: 1.50 },
  { id: "lg", label: "Large", oz: "20oz", mod: 2.50 },
];

const extras = [
  { id: "extra-berry", label: "Extra Berries", price: 1.00 },
  { id: "oat-milk", label: "Oat Milk", price: 0.80 },
  { id: "boba", label: "Boba Pearls", price: 1.20 },
  { id: "flower", label: "Edible Flowers", price: 1.50 },
];

type CartItem = { drink: typeof drinks[0]; size: typeof sizes[0]; extras: string[]; qty: number };

export default function OrderPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [selectedDrink, setSelectedDrink] = useState(drinks[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"order"|"cart"|"success">("order");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const getPrice = () => {
    const base = selectedDrink.price + selectedSize.mod;
    const extraTotal = selectedExtras.reduce((sum, id) => {
      const e = extras.find(x => x.id === id);
      return sum + (e?.price ?? 0);
    }, 0);
    return (base + extraTotal).toFixed(2);
  };

  const cartTotal = () => cart.reduce((sum, item) => {
    const base = item.drink.price + item.size.mod;
    const ex = item.extras.reduce((s, id) => { const e = extras.find(x=>x.id===id); return s+(e?.price??0); }, 0);
    return sum + (base + ex) * item.qty;
  }, 0).toFixed(2);

  const addToCart = () => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.drink.id === selectedDrink.id && i.size.id === selectedSize.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing].qty += 1;
        return updated;
      }
      return [...prev, { drink: selectedDrink, size: selectedSize, extras: selectedExtras, qty: 1 }];
    });
    // bounce animation
    gsap.fromTo(".cart-badge", { scale: 1.6 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
  };

  const placeOrder = () => {
    if (!name.trim()) return;
    setStep("success");
    gsap.fromTo(successRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 });
  }, []);

  return (
    <div className="page-wrap">
      <Nav />

      {/* HERO */}
      <div className="order-hero" ref={heroRef}>
        <div className="menu-hero-orb menu-orb-1" />
        <div className="menu-hero-orb menu-orb-2" />
        <p className="kicker">✦ Place Your Order</p>
        <h1 className="menu-hero-title">Build Your <span className="gradient-text">Dream</span></h1>
        <p className="menu-hero-sub">Customise your perfect strawberry experience, exactly how you like it.</p>
      </div>

      {step === "success" ? (
        <div ref={successRef} className="success-wrap">
          <div className="success-card">
            <div className="success-icon">🍓</div>
            <h2 className="success-title">Order Placed!</h2>
            <p className="success-msg">
              Thank you, <strong>{name}</strong>!<br />
              Your order is being crafted with love.<br />
              Estimated wait: <strong>8–12 minutes</strong> ✨
            </p>
            <div className="success-order">
              {cart.map((item, i) => (
                <div key={i} className="success-item">
                  <span>{item.qty}× {item.drink.name} ({item.size.label})</span>
                  <span>${((item.drink.price + item.size.mod) * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="success-total">
                <strong>Total</strong>
                <strong>${cartTotal()}</strong>
              </div>
            </div>
            <a href="/" className="glass-btn" style={{ display: "inline-block", marginTop: "2rem" }}>
              Back to Home
            </a>
          </div>
        </div>
      ) : step === "cart" ? (
        <div className="order-layout" ref={formRef}>
          <div className="cart-panel">
            <h2 className="cart-title">Your Cart 🛒</h2>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
                <button className="ghost-btn" onClick={() => setStep("order")}>Browse Drinks</button>
              </div>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="cart-item">
                    <img src={item.drink.img} alt={item.drink.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.drink.name}</p>
                      <p className="cart-item-meta">{item.size.label} ({item.size.oz})</p>
                      {item.extras.length > 0 && (
                        <p className="cart-item-extras">+ {item.extras.join(", ")}</p>
                      )}
                    </div>
                    <div className="cart-item-right">
                      <div className="qty-controls">
                        <button onClick={() => setCart(prev => {
                          const u = [...prev];
                          if (u[i].qty > 1) u[i] = { ...u[i], qty: u[i].qty - 1 };
                          else u.splice(i, 1);
                          return u;
                        })}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => setCart(prev => {
                          const u = [...prev];
                          u[i] = { ...u[i], qty: u[i].qty + 1 };
                          return u;
                        })}>+</button>
                      </div>
                      <p className="cart-item-price">${((item.drink.price + item.size.mod) * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div className="cart-total-row">
                  <span>Total</span>
                  <span className="cart-total-price">${cartTotal()}</span>
                </div>
                <div className="cart-checkout">
                  <div className="order-field">
                    <label className="order-label">Your Name *</label>
                    <input
                      className="order-input"
                      placeholder="e.g. Emma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="order-field">
                    <label className="order-label">Special Notes</label>
                    <textarea
                      className="order-input order-textarea"
                      placeholder="Allergies, customisations, extra sweet..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                  <button className="glass-btn glow-purple order-submit" onClick={placeOrder}>
                    Place Order — ${cartTotal()}
                  </button>
                  <button className="ghost-btn" style={{ marginTop: "0.75rem", width: "100%" }} onClick={() => setStep("order")}>
                    ← Add More
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="order-layout" ref={formRef}>
          {/* BUILDER */}
          <div className="builder-panel">
            {/* Drink selector */}
            <div className="builder-section">
              <h3 className="builder-label">1. Choose Your Drink</h3>
              <div className="drink-grid">
                {drinks.map(d => (
                  <button
                    key={d.id}
                    className={`drink-option ${selectedDrink.id === d.id ? "selected" : ""}`}
                    onClick={() => setSelectedDrink(d)}
                  >
                    <img src={d.img} alt={d.name} className="drink-option-img" />
                    <span className="drink-option-name">{d.name}</span>
                    <span className="drink-option-price">${d.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="builder-section">
              <h3 className="builder-label">2. Pick a Size</h3>
              <div className="size-grid">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    className={`size-option ${selectedSize.id === s.id ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    <span className="size-name">{s.label}</span>
                    <span className="size-oz">{s.oz}</span>
                    {s.mod > 0 && <span className="size-mod">+${s.mod.toFixed(2)}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="builder-section">
              <h3 className="builder-label">3. Add Extras <span style={{ fontWeight: 400, color: "rgba(255,200,220,0.5)", fontSize: "0.8rem" }}>(optional)</span></h3>
              <div className="extras-grid">
                {extras.map(e => (
                  <button
                    key={e.id}
                    className={`extra-option ${selectedExtras.includes(e.id) ? "selected" : ""}`}
                    onClick={() => toggleExtra(e.id)}
                  >
                    <span>{e.label}</span>
                    <span>+${e.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="preview-panel">
            <div className="preview-card">
              <div className="preview-img-wrap">
                <img src={selectedDrink.img} alt={selectedDrink.name} className="preview-img" />
                <div className="preview-glow" />
              </div>
              <h3 className="preview-name">{selectedDrink.name}</h3>
              <p className="preview-size">{selectedSize.label} — {selectedSize.oz}</p>
              {selectedExtras.length > 0 && (
                <div className="preview-extras-list">
                  {selectedExtras.map(id => {
                    const e = extras.find(x => x.id === id);
                    return <span key={id} className="preview-extra-tag">{e?.label}</span>;
                  })}
                </div>
              )}
              <div className="preview-price">${getPrice()}</div>
              <button className="glass-btn" style={{ width: "100%", marginTop: "1.25rem", textAlign: "center" }} onClick={addToCart}>
                Add to Cart 🛒
              </button>
              {cart.length > 0 && (
                <button
                  className="ghost-btn cart-view-btn"
                  onClick={() => setStep("cart")}
                >
                  View Cart
                  <span className="cart-badge">{cart.reduce((s,i)=>s+i.qty,0)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: "4rem" }}>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Strawberry Experience. Crafted with love.</p>
        </div>
      </footer>
    </div>
  );
}
