import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { extractArrayData, extractStatsData, extractErrorMessage } from "../../utils/apiNormalizer";
import UploadPreviewModal from "../../components/UploadPreviewModal";
import { buildUploadImageUrl } from "../../utils/publicUrl";

export default function StaffUploads() {
  const [uploads, setUploads] = useState([]);
  const [selectedFilePreview, setSelectedFilePreview] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeUpload, setActiveUpload] = useState(null);
  const [stats, setStats] = useState({ count: 0, totalSize: "0 KB" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [entityType, setEntityType] = useState("general");
  const [entityId, setEntityId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUsage, setFilterUsage] = useState("all"); // all | used | unused

  const entityTypes = ["general", "room", "menu", "user"];

  useEffect(() => {
    fetchUploads();
    fetchStats();
  }, []);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[STAFF UPLOADS] Fetching uploads");
      
      const response = await api.get("/uploads");
      console.log("[STAFF UPLOADS] API Response:", response.data);
      
      // Backend returns { success: true, data: [...] }
      const uploadsData = extractArrayData(response, "data");
      console.log("[STAFF UPLOADS] Extracted uploads:", uploadsData);
      
      setUploads(Array.isArray(uploadsData) ? uploadsData : []);
    } catch (err) {
      console.error("[STAFF UPLOADS] Fetch error:", err);
      setError(extractErrorMessage(err));
      setUploads([]); // Prevent undefined errors
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log("[STAFF UPLOADS] Fetching stats");
      const response = await api.get("/uploads/stats");
      console.log("[STAFF UPLOADS] Stats Response:", response.data);
      
      const statsData = extractStatsData(response);
      console.log("[STAFF UPLOADS] Extracted stats:", statsData);
      
      setStats({
        count: statsData.total || statsData.count || 0,
        totalSize: statsData.totalSizeFormatted || statsData.totalSize || "0 KB"
      });
    } catch (err) {
      console.error("[STAFF UPLOADS] Stats fetch error:", err);
      setStats({ count: 0, totalSize: "0 KB" }); // Fallback
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile); // Changed from "image" to "file"
      formData.append("type", entityType); // Changed from "entityType" to "type"
      if (entityId) {
        formData.append("entityId", entityId);
      }

      console.log("[STAFF UPLOADS] Uploading file:", selectedFile.name, "type:", entityType);

      const response = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("[STAFF UPLOADS] Upload response:", response.data);

      if (response.data.success) {
        setSuccess("File uploaded successfully!");
        setSelectedFile(null);
        setEntityType("general");
        setEntityId("");
        fetchUploads();
        fetchStats();
        // Reset file input
        document.getElementById("file-input").value = "";
      }
    } catch (err) {
      console.error("[STAFF UPLOADS] Upload failed:", err);
      setError(extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreview("");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setSelectedFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setSuccess("URL copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredUploads = uploads.filter((u) => {
    if (filterType !== "all" && u.type !== filterType) return false;
    if (filterUsage === "used" && !u.isUsed) return false;
    if (filterUsage === "unused" && u.isUsed) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">File Uploads</h1>
          <p className="text-gray-500 mt-1">Upload and manage images and files</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Files</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.count}</p>
          <p className="text-xs text-gray-400">{stats.totalSize}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">×</button>
        </div>
      )}

      {/* Upload Form */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-premier-dark mb-4">Upload New File</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {selectedFilePreview && (
                <div className="mt-3 aspect-square max-w-[140px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={selectedFilePreview}
                    alt="Selected preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {entityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity ID (optional)
              </label>
              <input
                type="text"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="e.g., room ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>

      {/* Uploads Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-premier-dark mb-4">Uploaded Files</h2>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 mr-2">Filter:</span>
          {["all", ...entityTypes].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                filterType === t
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-200 mx-1" />
          {[
            { id: "all", label: "All" },
            { id: "used", label: "Used" },
            { id: "unused", label: "Unused" },
          ].map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setFilterUsage(u.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                filterUsage === u.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {u.label}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">
            Showing {filteredUploads.length} of {uploads.length}
          </span>
        </div>
        
        {filteredUploads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No uploads match your filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredUploads.map((upload) => (
              <div key={upload.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={buildUploadImageUrl(upload)}
                    alt={upload.originalName || upload.filename}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setActiveUpload(upload);
                      setPreviewOpen(true);
                    }}
                    onError={(e) => {
                      console.error("[STAFF UPLOADS] Image load error:", upload);
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Preview%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 truncate" title={upload.originalName || upload.filename}>
                  {upload.originalName || upload.filename}
                </p>
                <p className="text-[11px] text-gray-400">
                  {upload.type || "general"} • {upload.isUsed ? "used" : "unused"}
                </p>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(buildUploadImageUrl(upload))}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UploadPreviewModal
        open={previewOpen}
        upload={activeUpload}
        onClose={() => {
          setPreviewOpen(false);
          setActiveUpload(null);
        }}
        onLinked={() => {
          fetchUploads();
          fetchStats();
        }}
      />
    </div>
  );
}
