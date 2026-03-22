import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import logoUrl from './src/assets/logo.png';
import heroBgVideo from './src/assets/hero-video.mp4';
import heroBgVideo2 from './src/assets/hero-video-2.mp4';
import heroBgVideo3 from './src/assets/hero-video-3.mp4';
import crispyPrawnsImg from './src/assets/crispy-prawns.jpg';
import muttonBiryaniImg from './src/assets/mutton-biryani.jpg';
import preloaderVideo from './src/assets/preloader.mp4';

// --- GLOBAL STYLES ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,600&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@600&display=swap');

  :root {
    --bg-dark: #0a1128;
    --primary-gold: #f59e0b;
    --primary-gold-hover: #fbbf24;
    --text-light: #f8fafc;
    --text-muted: #94a3b8;
    --overlay-dark: rgba(10, 17, 40, 0.7);
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--bg-dark);
    color: var(--text-light);
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
  }

  .accent-font {
    font-family: 'Dancing Script', cursive;
    color: var(--primary-gold);
  }

  /* --- PRELOADER --- */
  .preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #060b19;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
  }

  .preloader.hidden {
    opacity: 0;
    visibility: hidden;
  }

  .preloader-food-texture {
    position: absolute;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: url('https://images.unsplash.com/photo-1596649283733-a3d24cae42ff?q=80&w=2076&auto=format&fit=crop') no-repeat center center/cover;
    opacity: 0.15;
    z-index: 0;
    pointer-events: none;
    filter: contrast(120%) brightness(50%);
  }

  .preloader-bg-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 70vh;
    opacity: 1;
    z-index: 1;
    pointer-events: none;
    filter: none;
  }

  .preloader-video {
    width: 325px;
    height: 325px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.4);
    filter: none; /* explicitly removes feather/blur */
    border: 4px solid var(--primary-gold);
    -webkit-mask-image: -webkit-radial-gradient(white, black); /* precise crisp edge control */
    z-index: 2;
    position: relative;
  }

  /* --- NAVBAR --- */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    transition: all 0.4s ease;
  }

  .navbar.scrolled {
    background: rgba(10, 17, 40, 0.9);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    padding: 15px 5%;
    border-bottom: 1px solid var(--glass-border);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 15px;
    text-decoration: none;
    color: var(--text-light);
  }

  .nav-brand img {
    height: 50px;
    transition: transform 0.3s;
  }
  
  .nav-brand:hover img {
    transform: scale(1.05);
  }

  .nav-brand span {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .nav-links {
    display: flex;
    gap: 40px;
    align-items: center;
  }

  .nav-links a {
    color: var(--text-light);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-gold);
    transition: width 0.3s ease;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-links a:hover {
    color: var(--primary-gold);
  }

  .btn-primary {
    background: var(--primary-gold);
    color: var(--bg-dark);
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: inline-block;
  }

  .btn-primary:hover {
    background: var(--primary-gold-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  }

  /* --- HERO SECTION --- */
  .hero {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: 1;
    object-fit: cover;
    opacity: 0;
    filter: blur(8px);
    transition: opacity 2.5s ease-in-out, filter 2.5s ease-in-out;
  }

  .hero-video.active-video {
    opacity: 1;
    filter: blur(0);
    z-index: 2;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg, 
      rgba(10, 17, 40, 0.8) 0%, 
      rgba(10, 17, 40, 0.4) 50%, 
      rgba(10, 17, 40, 0.8) 100%
    );
    z-index: 3;
    pointer-events: none;
  }

  .hero-content {
    text-align: center;
    position: relative;
    z-index: 10;
    max-width: 900px;
    padding: 0 20px;
    animation: fadeIn 1.5s ease-out;
  }

  /* --- BLUR ANIMATION --- */
  .bg-video {
    filter: blur(4px);
    animation: clear 2s ease forwards;
  }

  @keyframes clear {
    to {
      filter: blur(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-subtitle {
    display: block;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 25px;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
    background: linear-gradient(to right, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .hero-desc {
    font-size: 1.2rem;
    color: var(--text-light);
    opacity: 0.9;
    margin-bottom: 40px;
    font-weight: 300;
    line-height: 1.6;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  }

  /* --- MENU SHOWCASE --- */
  .section {
    padding: 100px 5%;
    position: relative;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .section-subtitle {
    font-size: 1.8rem;
    display: block;
    margin-bottom: 5px;
  }

  .section-title {
    font-size: 3rem;
    position: relative;
    display: inline-block;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--primary-gold);
    border-radius: 2px;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .menu-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    text-align: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .menu-card-img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .menu-card:hover .menu-card-img {
    transform: scale(1.05);
  }

  .menu-card-content {
    padding: 25px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .menu-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
    z-index: -1;
    pointer-events: none;
  }

  .menu-card:hover {
    transform: translateY(-10px);
    border-color: rgba(245, 158, 11, 0.4);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  .menu-card h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--primary-gold);
    position: relative;
    z-index: 1;
  }

  .menu-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-light);
    position: relative;
    z-index: 1;
    margin-top: auto;
  }

  /* --- ABOUT --- */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .about-img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    position: relative;
  }

  /* --- INSTAGRAM SECTION --- */
  .instagram-section {
    padding: 100px 5%;
    text-align: center;
    background: var(--bg-dark);
    position: relative;
    overflow: hidden;
  }

  .instagram-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center, rgba(225, 48, 108, 0.05) 0%, transparent 70%);
    z-index: 0;
  }

  .insta-container {
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  .insta-info {
    flex: 1;
    min-width: 300px;
    text-align: left;
  }

  .map-embed {
    border-radius: 20px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 10px;
    width: 350px;
    height: 600px;
  }

  .insta-handle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-decoration: none;
  }

  .insta-embed {
    border-radius: 20px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 10px;
  }

  /* --- FOOTER --- */
  .footer {
    background: #060b19;
    padding: 80px 5% 40px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .footer-logo {
    height: 195px;
    max-width: 100%;
    object-fit: contain;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
  }

  .social-links a {
    color: var(--text-light);
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s;
    font-size: 1.2rem;
  }

  .social-links a:hover {
    background: var(--primary-gold);
    color: var(--bg-dark);
    transform: translateY(-3px);
  }

  .copyright {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .about-grid { grid-template-columns: 1fr; }
    .hero-title { font-size: 3rem; }
    .hero-subtitle { font-size: 2rem; }
  }
`;

const DoraRestaurant = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoList = [heroBgVideo, heroBgVideo2, heroBgVideo3];
  const videoRefs = useRef([]);

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Preloader Fallback & Transition Cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      
      if (idx === currentVideoIndex) {
        // Only reset currentTime if video has loaded its metadata
        if (vid.readyState > 0) {
          try {
            vid.currentTime = 0;
          } catch(e) { }
        }
        
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay was prevented.", error);
          });
        }
      } else {
        // Pause inactive videos securely
        setTimeout(() => {
          if (vid && vid.readyState > 0) {
            vid.pause();
          }
        }, 2500);
      }
    });
  }, [currentVideoIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>

      {/* PRELOADER */}
      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}>
        <div className="preloader-food-texture" />
        <img src={logoUrl} alt="Dora Brand Watermark" className="preloader-bg-logo" />
        <video 
          ref={(el) => { if(el) el.playbackRate = 2.5 }}
          className="preloader-video" 
          autoPlay 
          muted 
          playsInline
          onEnded={() => setIsLoading(false)}
          src={preloaderVideo}
        />
      </div>
      
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-brand">
          <img src={logoUrl} alt="DORA Logo" />
          <span>DORA</span>
        </a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#about">Our Story</a>
          <a href="#contact">Contact</a>
          <a href="#reservation" className="btn-primary" style={{color: '#0a1128'}}>Book a Table</a>
        </div>
      </nav>

      {/* HERO SECTION WITH VIDEO */}
      <header id="home" className="hero" style={{ backgroundColor: '#000' }}>
        {videoList.map((src, idx) => (
          <video 
            key={src}
            ref={el => videoRefs.current[idx] = el}
            className={`hero-video ${idx === currentVideoIndex ? 'active-video' : ''}`}
            autoPlay={idx === 0}
            muted 
            playsInline
            onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videoList.length)}
            src={src}
            poster={idx === 0 ? "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop" : ""}
          >
            Your browser does not support the video tag.
          </video>
        ))}
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <span className="accent-font hero-subtitle">Crispy & Delicious</span>
          <h1 className="hero-title">Experience True Flavor.</h1>
          <p className="hero-desc">
            Indulge in perfectly seasoned, golden-fried perfection. At Dora Family Restaurant, every bite is a celebration of taste, crafted with love and the finest ingredients.
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
            <a href="#menu" className="btn-primary">View Full Menu</a>
            <a href="#about" className="btn-primary" style={{background: 'transparent', border: '2px solid #fff', color: '#fff'}}>Our Story</a>
          </div>
        </div>
      </header>

      {/* SIGNATURE DISHES */}
      <section id="menu" className="section">
        <div className="section-header">
          <span className="accent-font section-subtitle">Taste the Magic</span>
          <h2 className="section-title">Signature Dishes</h2>
        </div>
        
        <div className="menu-grid">
          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop" alt="Golden Fried Chicken" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Golden Fried Chicken</h3>
              <p>Our world-famous recipe. Crispy on the outside, incredibly juicy on the inside, seasoned with our secret blend of 12 herbs and spices.</p>
            </div>
          </div>
          
          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop" alt="Chettinad Curry" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Chettinad Curry</h3>
              <p>A rich, aromatic South Indian classic packed with roasted spices, tender meat, and an unforgettable depth of flavor.</p>
            </div>
          </div>
          
          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src={crispyPrawnsImg} alt="Crispy Prawns" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Crispy Prawns</h3>
              <p>Fresh catch, marinated in zesty flavors and fried to golden perfection. Served with our signature dip.</p>
            </div>
          </div>
          
          {/* AUTHENTIC JUSTDIAL ITEMS */}
          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src={muttonBiryaniImg} alt="Traditional Mutton Biryani Feast" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Traditional Mutton Biryani</h3>
              <p>An authentic mutton biryani served in a traditional metal handi, accompanied by succulent pieces of spicy tandoori chicken for a complete meal.</p>
            </div>
          </div>

          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://images.jdmagicbox.com/comp/kanyakumari/h8/9999p4653.4653.210630110451.g9h8/catalogue/dora-family-restaurant-karungal-kanyakumari-restaurants-TaulYhczHU.jpg" alt="Spicy Grilled Tandoori Chicken" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Spicy Grilled Tandoori</h3>
              <p>A platter of smoky, char-grilled chicken pieces served with fresh carrot slices, a spicy green chili, and a creamy dipping sauce.</p>
            </div>
          </div>

          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://images.jdmagicbox.com/comp/kanyakumari/h8/9999p4653.4653.210630110451.g9h8/catalogue/dora-family-restaurant-karungal-kanyakumari-restaurants-dLELlEchKo.jpg" alt="Chocolate Fudge Brownie Shake" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Chocolate Brownie Shake</h3>
              <p>A decadent chocolate milk shake topped with a rich scoop of ice cream, chocolate drizzle, festive sprinkles, and a classic maraschino cherry.</p>
            </div>
          </div>

          {/* CUSTOMER FAVORITES (Google Maps) */}
          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwepK1bQ3TSdCRNg_Cgzw5iVlVImolQhqe8iJfZ61xfUbJiTjgbF0te0d8cqh_kSXXMLDmu3vFLu6aW9StXg71jg5u5plVzNW5ZH3GzHs_EF8EAsU4M2MZnDqelPpn0-utlz4ee0L2f_ZS6bf=s1024-v1" alt="Strawberry Vanilla Dream Shake" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Strawberry Vanilla Dream</h3>
              <p>A creamy vanilla milkshake elegantly drizzled with strawberry syrup, topped with fluffy whipped cream and a classic maraschino cherry.</p>
            </div>
          </div>

          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwerXoEC_Onm5qENjd8TvGtGYBqcy_tnwQZLL0pgTIVxV3gIb2vWLt-WARvjRkW6bH0-AXTIlo0WE1D6s4L5Fj-XDcSQmTuplMlib9HK5SBorP4lknVaBVF-rJQxZfxK_MKLWDQhj=s1024-v1" alt="Golden Spiced Tandoori Chicken Platter" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Golden Spiced Tandoori</h3>
              <p>Succulent pieces of tandoori chicken marinated in house spices, served alongside a creamy cooling dip and fresh carrot garnishes.</p>
            </div>
          </div>

          <div className="menu-card">
            <div style={{overflow: 'hidden', width: '100%', height: '220px'}}>
              <img src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwepzYWUOJmy9As-TXDmiIvclSplUuKhxgEuMIXu0u6hBPZEuJunSFRj9WcCobc1rYj7r0J5GqDoLNkD88y-JKRFRv5uote3c8H12XFA8M92cXeQUwjeJgs5kuii19xQZX0PVG8bs=s1024-v1" alt="Royal Egg Biryani Delight" className="menu-card-img" />
            </div>
            <div className="menu-card-content">
              <h3>Royal Egg Biryani</h3>
              <p>Fragrant basmati rice gently cooked with our signature aromatic spices and served with a perfectly boiled egg, creating a wholesome traditional meal.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="section" style={{background: '#0d1530'}}>
        <div className="about-grid">
          <div>
            <span className="accent-font section-subtitle">Est. 2019</span>
            <h2 className="section-title" style={{marginBottom: '30px', textAlign: 'left'}}>Our Family <br/>Tradition</h2>
            <br/><br/>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.8', margin: '20px 0', fontSize: '1.1rem'}}>
              What started as a small dream in Karungal has blossomed into a beloved local destination. We believe that great food brings people together.
            </p>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '30px', fontSize: '1.1rem'}}>
              Every dish that leaves our kitchen is a testament to our commitment to quality, flavor, and the warmth of genuine family hospitality.
            </p>
            <a href="#contact" className="btn-primary">Visit Us Today</a>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
              alt="Restaurant Interior" 
              className="about-img"
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM REEL */}
      <section className="instagram-section">
        <div className="insta-container">
          <div className="insta-info">
            <span className="accent-font section-subtitle">Follow The Sizzle</span>
            <h2 className="section-title" style={{textAlign: 'left', marginBottom: '20px'}}>Join Our <br/>Community</h2>
            <br/><br/>
            <a href="https://www.instagram.com/_dora_family_resturant_" target="_blank" rel="noopener noreferrer" className="insta-handle">
              @_dora_family_resturant_
            </a>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '30px', fontSize: '1.1rem'}}>
              Get a behind-the-scenes look at our kitchen, catch our latest sizzling reels, and tag us in your family moments! Your smiles fuel our fire.
            </p>
            <a href="https://www.instagram.com/_dora_family_resturant_/reel/DDH8HCtTf72/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', color: '#fff', border: 'none'}}>
              Watch on Instagram
            </a>
          </div>
          <div className="insta-embed">
            {/* Embedded specific requested reel */}
            <iframe 
               src="https://www.instagram.com/reel/DDH8HCtTf72/embed/" 
               width="340" 
               height="600" 
               frameBorder="0" 
               scrolling="no" 
               allowtransparency="true"
               style={{borderRadius: '12px', background: 'transparent'}}
               title="Dora Restaurant Instagram Reel"
            ></iframe>
          </div>

          <div className="map-embed" style={{display: 'flex', flexDirection: 'column'}}>
             <div style={{marginBottom: '10px', padding: '5px 10px'}}>
               <h3 style={{color: 'var(--primary-gold)', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '5px'}}>Locate Us</h3>
               <p style={{color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600'}}>
                 <span style={{color: '#e6683c'}}>📍 Heart of Karungal</span> • Family Dine-In • Easy Parking
               </p>
             </div>
             <iframe 
               src="https://maps.google.com/maps?q=Dora%20Family%20Restaurant%20Karungal&t=&z=17&ie=UTF8&iwloc=&output=embed" 
               width="100%" 
               style={{borderRadius: '12px', background: '#ccc', flexGrow: 1, minHeight: '480px'}}
               frameBorder="0"
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="Dora Restaurant Google Maps Location"
             ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <img src={logoUrl} alt="Dora Logo" className="footer-logo" />
        <h3 style={{marginBottom: '20px', fontSize: '1.8rem'}}>DORA Family Restaurant</h3>
        <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>
          Karungal, Tamil Nadu, India<br/>
          +91 98765 43210
        </p>
        
        <div className="social-links">
          <a href="#" aria-label="Facebook">ⓕ</a>
          <a href="https://www.instagram.com/_dora_family_resturant_" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
          <a href="#" aria-label="Twitter">𝕏</a>
        </div>
        
        <p className="copyright">
          &copy; {new Date().getFullYear()} DORA Family Restaurant. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default DoraRestaurant;
