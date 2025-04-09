import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductCatalog.css";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    category: "",
    price: "",
    rating: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const apiUrl = "https://localhost:7115/api/products";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          search: searchTerm,
          category,
          minPrice,
          maxPrice,
          rating,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      rating: parseInt(formData.rating),
    };

    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/${formData.id}`, { id: formData.id, ...payload });
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post(apiUrl, payload);
        setMessage("✅ Product added successfully!");
      }

      setFormData({ id: 0, name: "", category: "", price: "", rating: "" });
      setIsEditing(false);
      fetchProducts();

      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="catalog-container">
      <h1>🛍️ Product Catalog</h1>

      {message && <div className="success-message">{message}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
        <div className="form-row">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
          <input type="number" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} required />
        </div>
        <button type="submit">{isEditing ? "Update" : "Add Product"}</button>
      </form>

      <div className="filter-bar">
        <input type="text" placeholder="Search by name" onChange={(e) => setSearchTerm(e.target.value)} />
        <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
        <input type="number" placeholder="Min Price" onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" onChange={(e) => setMaxPrice(e.target.value)} />
        <input type="number" placeholder="Rating" onChange={(e) => setRating(e.target.value)} />
        <button onClick={fetchProducts}>Filter</button>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <span className="badge">{p.category}</span>
            <p>Price: ₹{p.price.toFixed(2)}</p>
            <p>Rating: {p.rating} ⭐</p>
            <div className="card-actions">
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
