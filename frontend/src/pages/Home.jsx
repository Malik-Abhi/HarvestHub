import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const images = [
    "https://images.unsplash.com/photo-1615478439492-434f70dfe613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1722938905582-f11a5b394f75?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1641301547846-2cf73f58fdca?q=80&w=1481&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1722938904963-0d607622ea7a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1681722490667-fa505083f83a?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false
  };

  return (
    <div className="home-container">

      {/* Carousel */}
      <div className="carousel-container">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt={`slide-${index}`}
                className="carousel-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hero Content */}
      <div className="home-content">
        <h1 className="home-title">Harvest Hub is Running!</h1>
        <h2 className="home-subtitle">Welcome to Our Harvest Hub Store</h2>

        <div className="home-actions">
          <h3 className="products-title">Shop Products</h3>
          <Link to="/products">
            <button className="cta-button">Explore Products</button>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <h2>About Harvest Hub</h2>
        <p>
          At Harvest Hub, we bring you the freshest produce straight from farms to your home.
          Our mission is to connect local farmers with customers, ensuring quality, sustainability,
          and affordable prices for all.
        </p>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/products?category=fruits" className="category-card">🍎 Fresh Fruits</Link>
          <Link to="/products?category=vegetables" className="category-card">🥦 Organic Vegetables</Link>
          <Link to="/products?category=dairy" className="category-card">🥛 Dairy & Beverages</Link>
          <Link to="/products?category=grains" className="category-card">🌾 Grains & Pulses</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Best Sellers</h2>
        <div className="products-grid">
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Apples" />
            <h3>Fresh Apples</h3>
            <p>₹150 / Kg</p>
          </div>
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tomatoes" />
            <h3>Organic Tomatoes</h3>
            <p>₹60 / Kg</p>
          </div>
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Milk" />
            <h3>Fresh Bananas</h3>
            <p>₹50 / Kg</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-card">
          <p>"Harvest Hub delivers the freshest veggies! I don’t buy from supermarkets anymore."</p>
          <h4>- Priya, Bangalore</h4>
        </div>
        <div className="testimonial-card">
          <p>"Affordable prices and super fast delivery. Highly recommend!"</p>
          <h4>- Raj, Mumbai</h4>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for offers and fresh arrivals.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

    </div>
  );
};

export default Home;
