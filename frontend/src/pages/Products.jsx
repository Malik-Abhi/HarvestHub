import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import ProductList from '../components/ProductList';
import { fetchProducts } from '../utils/api';

const Products = () => {
    const { products, setProducts } = useStore();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };
        getProducts();
    }, [setProducts]);

    // Filtering + search logic
    const filteredProducts = products && products.length>0 && products
        ?.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        ?.filter(product =>
            filters?.length === 0 || filters?.includes(product.type)
        )
        ?.sort((a, b) => {
            if (sort === "priceLowHigh") return a.price - b.price;
            if (sort === "priceHighLow") return b.price - a.price;
            return 0;
        });

    const handleFilterChange = (type) => {
        setFilters(prev =>
            prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
        );
    };

    return (
        <div className="container">
            <div className="products-page">
                {/* Sidebar */}
                <aside className="products-sidebar">
                    <div style={{position:'sticky', top:'100px'}}>
                    <h3>Sort & Filter</h3>

                    <div className="filter-group">
                        <label style={{paddingRight:10}} htmlFor="sort">Sort By:</label>
                        <select
                            id="sort"
                            className="filter-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="default">Default</option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <p><strong>Filter by Type</strong></p>
                        {["Grains", "Vegetables", "Fruits", "Cash Crops"].map(type => (
                            <div key={type}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filters.includes(type)}
                                        onChange={() => handleFilterChange(type)}
                                    />
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                    </div>
                </aside>

                {/* Main Products Section */}
                <main className="products-main">
                    <div className="products-header">
                        <h2>Shop Products</h2>
                        <input
                            type="text"
                            className="products-search"
                            placeholder="Search fresh crops..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {filteredProducts?.length > 0 ? (
                        <ProductList products={filteredProducts} />
                    ) : (
                        <p style={{ color: "#888" }}>No products available.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
