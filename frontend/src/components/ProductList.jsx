import { useState } from 'react';
import { addToCart } from '../utils/api';
import { useStore } from '../store/useStore';

const ProductList = ({ products }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useStore();

    const handleAddToCart = async () => {
        console.log("Adding to cart:", user);
        if (!user?.token) {
            alert("Please login to add to cart!");
            return;
        }

        try {
           const response = await addToCart({
                userId: user.userId,
                productId: selectedProduct._id,
                quantity: quantity
            }, user.token);

            alert("Added to cart successfully!");
            setSelectedProduct(null);
            setQuantity(1);
        } catch (err) {
            console.error(err);
            alert("Failed to add to cart.");
        }
    };

    return (
        <>
            <div className="product-list">
                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                        <span>No products available.</span>
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product._id} className="product-card market-card">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div className="market-price">₹{product.price}/kg</div>
                            <div className="market-yield">
                                <strong>Yield Time:</strong> {product.yieldTime || 'N/A'}
                            </div>
                            <p>{product.description}</p>
                            <button
                                className="market-btn"
                                onClick={() => setSelectedProduct(product)}
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedProduct.name}</h2>
                        <img src={selectedProduct.image} alt={selectedProduct.name}  style={{ objectFit:'cover',width: '300px', height: '200px' }} />
                        <p>{selectedProduct.description}</p>
                        <div className="modal-price">Price: ₹{selectedProduct.price}/kg</div>
                        <div style={{margin:"10px 0px"}}>
                            <label>Quantity: </label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                        </div>
                        <button onClick={handleAddToCart} className="market-btn">Add to Cart</button>
                        <button onClick={() => setSelectedProduct(null)} className="market-btn" style={{ background: 'gray' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductList;
