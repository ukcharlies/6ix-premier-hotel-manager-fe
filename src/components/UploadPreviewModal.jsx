import React, { useState } from "react";
import api from "../services/api";
import { extractErrorMessage } from "../utils/apiNormalizer";

export default function UploadPreviewModal({ open, upload, onClose, onLinked }) {
  const [entityType, setEntityType] = useState(upload?.type || "general");
  const [entityId, setEntityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open || !upload) return null;

  const imageSrc = upload.url || `${import.meta.env.VITE_API_URL?.replace("/api", "")}${upload.path}`;

  const handleLink = async () => {
    if (!entityType || !entityId) {
      setError("Please select an entity type and provide an entity ID to link.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/uploads/${upload.id}/link`, { entityType, entityId });
      if (res?.data?.success) {
        if (onLinked) onLinked(res.data.upload || upload);
        onClose();
      }
    } catch (err) {
      console.error("[UPLOAD PREVIEW] Link failed:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-hidden">
        <div className="flex items-start justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Preview Upload</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">×</button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <img src={imageSrc} alt={upload.originalName || upload.filename} className="w-full h-80 object-contain bg-gray-100" />
            <p className="mt-2 text-sm text-gray-600">{upload.originalName || upload.filename}</p>
            <p className="text-xs text-gray-400">{upload.mimetype} — {upload.size} bytes</p>
          </div>

          <div className="md:col-span-1 space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Entity Type</label>
              <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="w-full mt-1 p-2 border rounded">
                <option value="general">General</option>
                <option value="room">Room</option>
                <option value="menu">Menu</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Entity ID</label>
              <input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="e.g. 123" className="w-full mt-1 p-2 border rounded" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-2 mt-2">
              <button onClick={handleLink} disabled={loading} className="px-4 py-2 bg-premier-copper text-white rounded disabled:opacity-60">
                {loading ? "Linking..." : "Link to Entity"}
              </button>
              <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
