import React, { useEffect, useState } from "react";
import api from "../../services/api";
import MenuItemImageManager from "../../components/MenuItemImageManager";

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  const defaultCategories = ["Appetizers", "Main Course", "Desserts", "Beverages", "Specials", "Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      if (res.data.success) {
        setMenuItems(res.data.menuItems);
      }
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/menu/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
      };

      if (editingItem) {
        await api.put(`/menu/${editingItem.id}`, data);
        setSuccess("Menu item updated successfully");
      } else {
        await api.post("/menu", data);
        setSuccess("Menu item created successfully");
      }

      fetchMenuItems();
      fetchCategories();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category || "",
      isAvailable: item.isAvailable,
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/menu/${item.id}`);
      setSuccess("Menu item deleted successfully");
      fetchMenuItems();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.put(`/menu/${item.id}`, { isAvailable: !item.isAvailable });
      fetchMenuItems();
    } catch (err) {
      setError("Failed to update availability");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">Menu Management</h1>
          <p className="text-gray-500 mt-1">Manage restaurant menu items</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Menu Item
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-between">
          {success}
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">×</button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-premier-copper text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:border-premier-copper"
          }`}
        >
          All Items ({menuItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.name
                ? "bg-premier-copper text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-premier-copper"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                !item.isAvailable ? "opacity-60" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-premier-dark">{item.name}</h3>
                    <span className="text-xs text-premier-copper font-medium">{item.category}</span>
                  </div>
                  <span className="text-lg font-bold text-premier-dark">${item.price?.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`text-sm font-medium ${
                      item.isAvailable ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {item.isAvailable ? "✓ Available" : "✗ Unavailable"}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMenuItem(item);
                        setShowImageManager(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Images
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-premier-copper hover:text-primary-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No menu items found. Add your first item!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-premier-dark">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  required
                >
                  <option value="">Select category</option>
                  {defaultCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-premier-copper rounded focus:ring-premier-copper"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700">
                  Available for ordering
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingItem ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Manager Modal */}
      {showImageManager && selectedMenuItem && (
        <MenuItemImageManager
          menuItemId={selectedMenuItem.id}
          menuItemName={selectedMenuItem.name}
          onClose={() => {
            setShowImageManager(false);
            setSelectedMenuItem(null);
            fetchMenuItems(); // Refresh to show updated images
          }}
        />
      )}
    </div>
  );
}
