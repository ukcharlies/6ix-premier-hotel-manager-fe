import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { extractArrayData, extractStatsData, extractErrorMessage } from "../../utils/apiNormalizer";
import UploadPreviewModal from "../../components/UploadPreviewModal";

export default function StaffUploads() {
  const [uploads, setUploads] = useState([]);
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

  const handleDelete = async (upload) => {
    if (!window.confirm(`Delete "${upload.originalName || upload.filename}"?`)) {
      return;
    }

    try {
      console.log("[STAFF UPLOADS] Deleting upload ID:", upload.id);
      
      // Use ID in URL path, not in body
      await api.delete(`/uploads/${upload.id}`);
      
      setSuccess("File deleted successfully!");
      fetchUploads();
      fetchStats();
    } catch (err) {
      console.error("[STAFF UPLOADS] Delete failed:", err);
      setError(extractErrorMessage(err));
    }
  };

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
        
        {uploads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No files uploaded yet. Use the form above to upload your first file.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={upload.url || `${import.meta.env.VITE_API_URL?.replace('/api', '')}${upload.path}`}
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
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(upload.url || `${import.meta.env.VITE_API_URL?.replace('/api', '')}${upload.path}`)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(upload)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
