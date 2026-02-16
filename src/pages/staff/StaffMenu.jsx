import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { extractArrayData, extractErrorMessage } from "../../utils/apiNormalizer";

export default function StaffMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MAIN",
    image: "",
    available: true,
  });

  const categories = ["APPETIZER", "MAIN", "DESSERT", "BEVERAGE", "BREAKFAST", "LUNCH", "DINNER"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[STAFF MENU] Fetching menu items");
      
      const response = await api.get("/menu");
      console.log("[STAFF MENU] API Response:", response.data);
      
      // Use apiNormalizer for consistent extraction + fallback
      const items = extractArrayData(response, "data");
      console.log("[STAFF MENU] Extracted items:", items);
      
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("[STAFF MENU] Fetch error:", err);
      setError(extractErrorMessage(err));
      setMenuItems([]); // ← Explicit fallback: always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await api.put(`/menu/${editingItem.id}`, payload);
      } else {
        await api.post("/menu", payload);
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category,
      image: item.image || "",
      available: item.available,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "MAIN",
      image: "",
      available: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group items by category (defensive: ensure menuItems is always array)
  const groupedItems = (Array.isArray(menuItems) ? menuItems : []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">Menu Management</h1>
          <p className="text-gray-500 mt-1">Create and manage restaurant menu items</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            resetForm();
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700">
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">
                Available
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {editingItem ? "Update Item" : "Create Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items by Category */}
      {Object.entries(groupedItems).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No menu items found. Click "Add Item" to create your first menu item.
        </div>
      )}
      
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-premier-dark mb-4 pb-2 border-b">
            {category} <span className="text-gray-400 text-sm font-normal">({items.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.image}`}
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center text-gray-400"><svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span class="text-xs mt-2">No Image</span></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs mt-2">No Image</span>
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded ${
                    item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-premier-dark">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-emerald-600">${Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
