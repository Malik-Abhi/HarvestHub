import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">Harvest Hub is Running!</h1>
    <h2 className="home-subtitle">Welcome to Our Harvest Hub Store</h2>

    <div className="home-actions">
      <h3 className="products-title">Shop Products</h3>
      <Link to="/products">
        <button className="cta-button">Explore Products</button>
      </Link>
    </div>
  </div>
);

export default Home;
