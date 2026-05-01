import { useLocation } from "wouter";

interface NavProps {
  scrollTo?: (section: string) => void;
}

export default function Nav({ scrollTo }: NavProps) {
  const [location, navigate] = useLocation();
  const isHome = location === "/";

  const handleSection = (section: string) => {
    if (isHome && scrollTo) {
      scrollTo(section);
    } else {
      navigate("/");
      setTimeout(() => scrollTo?.(section), 600);
    }
  };

  return (
    <nav className="nav">
      <a href="/" className="nav-logo">✦ STRAWBERRY</a>
      <div className="nav-links">
        <button className="nav-link" onClick={() => handleSection("story")}>Story</button>
        <button className="nav-link" onClick={() => handleSection("craft")}>Craft</button>
        <a href="/menu" className="nav-link">Menu</a>
        <button className="nav-link" onClick={() => handleSection("taste")}>Taste</button>
      </div>
      <a href="/order" className="nav-cta">Order Now</a>
    </nav>
  );
}
