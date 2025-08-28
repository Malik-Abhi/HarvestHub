import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchProduct } from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const { product, setProduct } = useStore(state => ({
        product: state.product,
        setProduct: state.setProduct
    }));

    useEffect(() => {
        const getProduct = async () => {
            const fetchedProduct = await fetchProduct(id);
            setProduct(fetchedProduct);
        };

        getProduct();
    }, [id, setProduct]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default ProductDetail;