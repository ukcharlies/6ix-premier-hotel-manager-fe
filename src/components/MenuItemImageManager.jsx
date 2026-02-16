import React, { useState, useEffect } from "react";
import api from "../services/api";
import { extractArrayData, extractErrorMessage } from "../utils/apiNormalizer";

export default function MenuItemImageManager({
  menuItemId,
  menuItemName,
  onClose,
}) {
  const [uploads, setUploads] = useState([]);
  const [menuImages, setMenuImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (menuItemId) {
      fetchData();
    }
  }, [menuItemId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [uploadsRes, imagesRes] = await Promise.all([
        api.get("/images/available"),
        api.get(`/images/menu-items/${menuItemId}`),
      ]);

      const uploadData = extractArrayData(uploadsRes, "data");
      const imageData = extractArrayData(imagesRes, "data");

      setUploads(Array.isArray(uploadData) ? uploadData : []);
      setMenuImages(Array.isArray(imageData) ? imageData : []);
    } catch (err) {
      console.error("[MENU IMAGE] fetchData error:", err);
      setError(extractErrorMessage(err));
      setUploads([]);
      setMenuImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignImage = async (uploadId) => {
    try {
      setAssigning(true);
      setError(null);
      setSuccess(null);

      await api.post(`/images/menu-items/${menuItemId}`, {
        uploadId: parseInt(uploadId),
      });

      setSuccess("Image assigned successfully");
      await fetchData();
    } catch (err) {
      console.error("[MENU IMAGE] handleAssignImage error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveImage = async (uploadId) => {
    if (!confirm("Remove this image from the menu item?")) return;

    try {
      setError(null);
      setSuccess(null);

      await api.delete(`/images/menu-items/${menuItemId}/${uploadId}`);

      setSuccess("Image removed successfully");
      await fetchData();
    } catch (err) {
      console.error("[MENU IMAGE] handleRemoveImage error:", err);
      setError(extractErrorMessage(err));
    }
  };

  const getImageUrl = (path) => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  const assignedImageIds = menuImages.map(
    (img) => img.upload?.id || img.uploadId,
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl">
          <div className="w-8 h-8 border-4 border-premier-copper border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-3">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-amber-50">
          <div>
            <h2 className="text-xl font-bold text-premier-dark">
              Manage Menu Item Images
            </h2>
            <p className="text-sm text-gray-600 mt-1">Item: {menuItemName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alerts */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
              <span>{success}</span>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Currently Assigned Images */}
          <div>
            <h3 className="text-lg font-semibold text-premier-dark mb-4">
              Assigned Images ({menuImages.length})
            </h3>
            {menuImages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">No images assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select images from the available uploads below
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {menuImages.map((menuImage) => {
                  const upload = menuImage.upload || menuImage;
                  return (
                    <div key={menuImage.id} className="relative group">
                      <img
                        src={getImageUrl(upload.path)}
                        alt={upload.originalName}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => handleRemoveImage(upload.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {upload.originalName}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Uploads to Assign */}
          <div>
            <h3 className="text-lg font-semibold text-premier-dark mb-4">
              Available Uploads (
              {uploads.filter((u) => !assignedImageIds.includes(u.id)).length})
            </h3>
            {uploads.filter((u) => !assignedImageIds.includes(u.id)).length ===
            0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No available uploads</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload new images first or all images are already assigned
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploads
                  .filter((upload) => !assignedImageIds.includes(upload.id))
                  .map((upload) => (
                    <div key={upload.id} className="relative group">
                      <img
                        src={getImageUrl(upload.path)}
                        alt={upload.originalName}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => handleAssignImage(upload.id)}
                          disabled={assigning}
                          className="bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 text-sm font-medium disabled:bg-gray-400"
                        >
                          {assigning ? "Assigning..." : "Assign"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {upload.originalName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(upload.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
