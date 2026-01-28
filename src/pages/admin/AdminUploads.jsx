import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { extractArrayData, extractStatsData, extractErrorMessage } from "../../utils/apiNormalizer";

export default function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalSizeFormatted: "0 Bytes", byType: {} });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedType, setSelectedType] = useState("general");
  const fileInputRef = useRef(null);

  const fileTypes = [
    { id: "general", label: "General" },
    { id: "room", label: "Rooms" },
    { id: "menu", label: "Menu" },
  ];

  useEffect(() => {
    fetchUploads();
    fetchStats();
  }, [selectedType]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`[ADMIN UPLOADS] Fetching uploads for type: ${selectedType}`);
      
      const res = await api.get(`/uploads?type=${selectedType}`);
      console.log("[ADMIN UPLOADS] Response:", res.data);
      
      // Backend returns { success: true, uploads: [...] }
      const uploadsData = extractArrayData(res, "uploads");
      console.log("[ADMIN UPLOADS] Extracted uploads:", uploadsData);
      
      setUploads(Array.isArray(uploadsData) ? uploadsData : []);
    } catch (err) {
      console.error("[ADMIN UPLOADS] Failed to fetch uploads:", err);
      setError(extractErrorMessage(err));
      setUploads([]); // Prevent undefined issues
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log("[ADMIN UPLOADS] Fetching stats");
      const res = await api.get("/uploads/stats");
      console.log("[ADMIN UPLOADS] Stats response:", res.data);
      
      // Extract stats with fallback
      const statsData = extractStatsData(res);
      console.log("[ADMIN UPLOADS] Extracted stats:", statsData);
      
      setStats({
        total: statsData.total || 0,
        totalSizeFormatted: statsData.totalSizeFormatted || "0 Bytes",
        byType: statsData.byType || {},
      });
    } catch (err) {
      console.error("[ADMIN UPLOADS] Failed to fetch stats:", err);
      // Don't show error for stats, just set defaults
      setStats({ total: 0, totalSizeFormatted: "0 Bytes", byType: {} });
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files (JPEG, PNG, GIF, WebP) are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", selectedType);

    try {
      setUploading(true);
      setError(null);
      console.log(`[ADMIN UPLOADS] Uploading file: ${file.name}, type: ${selectedType}`);
      
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("[ADMIN UPLOADS] Upload response:", res.data);
      
      if (res.data.success) {
        setSuccess("File uploaded successfully");
        fetchUploads();
        fetchStats();
      }
    } catch (err) {
      console.error("[ADMIN UPLOADS] Upload failed:", err);
      setError(extractErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (upload) => {
    if (!confirm(`Delete "${upload.originalName || upload.filename}"?`)) return;

    try {
      console.log("[ADMIN UPLOADS] Deleting upload:", upload);
      
      await api.delete("/uploads", { 
        data: { 
          filePath: upload.path || `/uploads/${selectedType}/${upload.filename}` 
        } 
      });
      
      setSuccess("File deleted successfully");
      fetchUploads();
      fetchStats();
    } catch (err) {
      console.error("[ADMIN UPLOADS] Delete failed:", err);
      setError(extractErrorMessage(err));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">File Uploads</h1>
          <p className="text-gray-500 mt-1">Manage images and media files</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload File
              </>
            )}
          </label>
        </div>
      </div>

      {/* Stats */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Files</p>
            <p className="text-2xl font-bold text-premier-dark">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Size</p>
            <p className="text-2xl font-bold text-premier-dark">{stats.totalSizeFormatted || "0 Bytes"}</p>
          </div>
          {stats.byType && Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500 capitalize">{type} Files</p>
              <p className="text-2xl font-bold text-premier-dark">{count || 0}</p>
            </div>
          ))}
        </div>
      )}

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

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        {fileTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type.id
                ? "bg-premier-copper text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-premier-copper"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
          </div>
        ) : uploads.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="aspect-square flex items-center justify-center mb-2 overflow-hidden rounded-lg bg-white">
                  {upload.mimetype?.startsWith("image/") ? (
                    <img
                      src={upload.url || `${import.meta.env.VITE_API_URL?.replace('/api', '')}${upload.path}`}
                      alt={upload.originalName || upload.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("[ADMIN UPLOADS] Image load error:", upload);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className="hidden items-center justify-center w-full h-full">
                    {getFileIcon(upload.filename)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 truncate" title={upload.originalName || upload.filename}>
                  {upload.originalName || upload.filename}
                </p>
                <p className="text-xs text-gray-400">{formatFileSize(upload.size)}</p>

                {/* Delete button on hover */}
                <button
                  onClick={() => handleDelete(upload)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  title="Delete file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No files in this category</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
