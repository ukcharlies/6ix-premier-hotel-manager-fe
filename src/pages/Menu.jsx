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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-dark-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Restaurant Menu</h1>
        <p className="text-white/80 mt-1">
          Explore dishes with live availability, pricing, categories, and image previews.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          >
            <option value="name">Sort: Name</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center justify-end">
            Showing {filteredItems.length} of {menuItems.length}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === category
                  ? "bg-premier-copper text-white border-premier-copper"
                  : "bg-white text-gray-600 border-gray-200 hover:border-premier-copper"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No menu items match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const imagePath =
              item.image ||
              (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null);
            const imageSrc = imagePath ? buildUploadImageUrl(imagePath) : "";
            const imageCount = Array.isArray(item.images) ? item.images.length : 0;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className={`${imageSrc ? "hidden" : "flex"} w-full h-full items-center justify-center text-gray-400`}>
                    <span>No image uploaded</span>
                  </div>
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white">
                    {imageCount} image{imageCount === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-premier-dark">{item.name}</h2>
                      <p className="text-sm text-gray-500">{item.category || "Uncategorized"}</p>
                    </div>
                    <p className="text-xl font-bold text-premier-copper">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 min-h-[42px]">
                    {item.description || "No description available for this menu item."}
                  </p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Item ID: {item.id}</span>
                    <span>{item.category || "General"}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

