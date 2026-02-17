import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { buildUploadImageUrl } from "../utils/publicUrl";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [imageIndex, setImageIndex] = useState({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await api.get("/menu");
        const items = Array.isArray(res.data?.menuItems) ? res.data.menuItems : [];
        setMenuItems(items);
      } catch (err) {
        console.error("[MENU] Fetch error:", err);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = useMemo(() => {
    const all = [...new Set(menuItems.map((item) => item.category).filter(Boolean))];
    return ["all", ...all];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const prepared = menuItems.filter((item) => {
      const itemName = (item.name || "").toLowerCase();
      const itemDescription = (item.description || "").toLowerCase();
      const q = search.toLowerCase();

      if (q && !itemName.includes(q) && !itemDescription.includes(q)) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (availabilityFilter === "available" && !item.isAvailable) return false;
      if (availabilityFilter === "unavailable" && item.isAvailable) return false;
      return true;
    });

    return prepared.sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [menuItems, search, selectedCategory, availabilityFilter, sortBy]);

  const cycleImage = (itemId, total, direction) => {
    if (total <= 1) return;
    setImageIndex((prev) => {
      const current = prev[itemId] || 0;
      const next = direction === "next" ? (current + 1) % total : (current - 1 + total) % total;
      return { ...prev, [itemId]: next };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-dark-700 text-white px-6 py-8">
        <h1 className="text-4xl font-bold">Menu</h1>
        <p className="text-white/80 mt-2 max-w-2xl">
          Explore our restaurant's menu with live availability and stunning food photography.
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a dish..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm font-medium text-gray-600 px-3 py-2.5 bg-gray-50 rounded-lg w-full text-center">
              {filteredItems.length} of {menuItems.length}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-premier-copper text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>
      </div>

      {/* No Results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No dishes match your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const images = Array.isArray(item.images) && item.images.length > 0 
              ? item.images.map(path => buildUploadImageUrl(path)).filter(Boolean)
              : item.image ? [buildUploadImageUrl(item.image)] : [];
            
            const currentImageIndex = imageIndex[item.id] || 0;
            const currentImage = images.length > 0 ? images[currentImageIndex] : "";
            const hasMultipleImages = images.length > 1;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className={currentImage ? "hidden" : "absolute inset-0 flex flex-col items-center justify-center text-gray-400"}>
                    <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">No Image</span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm">
                    <span className={item.isAvailable ? "text-emerald-700" : "text-red-700"}>
                      {item.isAvailable ? "✓ Available" : "✗ Unavailable"}
                    </span>
                  </div>

                  {/* Image Counter & Navigation */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => cycleImage(item.id, images.length, "prev")}
                        className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-semibold min-w-[40px] text-center">
                        {currentImageIndex + 1}/{images.length}
                      </div>
                      <button
                        onClick={() => cycleImage(item.id, images.length, "next")}
                        className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-premier-dark">{item.name}</h3>
                    <p className="text-xs font-semibold text-premier-copper uppercase tracking-wide mt-1">
                      {item.category || "Uncategorized"}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {item.description || "No description available"}
                  </p>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-2xl font-bold text-premier-copper">
                      ${Number(item.price || 0).toFixed(2)}
                    </div>
                    {hasMultipleImages && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                        {images.length} photos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

