import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { extractArrayData, extractErrorMessage } from "../../utils/apiNormalizer";

export default function RoomImageManager({ roomId, roomNumber }) {
  const [uploads, setUploads] = useState([]);
  const [roomImages, setRoomImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUploadId, setSelectedUploadId] = useState("");

  useEffect(() => {
    fetchData();
  }, [roomId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch available uploads and room images in parallel
      const [uploadsRes, imagesRes] = await Promise.all([
        api.get("/images/available"),
        api.get(`/images/rooms/${roomId}`),
      ]);

      const uploadData = extractArrayData(uploadsRes, "data");
      const imageData = extractArrayData(imagesRes, "data");

      setUploads(uploadData);
      setRoomImages(imageData);
    } catch (err) {
      console.error("[ROOM IMAGE] fetchData error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAssignImage = async (e) => {
    e.preventDefault();
    if (!selectedUploadId) {
      setError("Please select an image to assign");
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      setSuccess(null);

      await api.post(`/images/rooms/${roomId}`, {
        uploadId: parseInt(selectedUploadId),
      });

      setSuccess(`Image assigned to room ${roomNumber} successfully`);
      setSelectedUploadId("");
      
      // Refresh the room images
      await fetchData();
    } catch (err) {
      console.error("[ROOM IMAGE] handleAssignImage error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveImage = async (uploadId) => {
    if (!confirm("Remove this image from the room?")) return;

    try {
      setError(null);
      setSuccess(null);

      await api.delete(`/images/rooms/${roomId}/${uploadId}`);

      setSuccess("Image removed from room successfully");
      await fetchData();
    } catch (err) {
      console.error("[ROOM IMAGE] handleRemoveImage error:", err);
      setError(extractErrorMessage(err));
    }
  };

  const getImageUrl = (path) => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  if (loading) {
    return <div className="text-center py-4">Loading images...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {/* Assign Image Form */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-3">Assign Image to Room {roomNumber}</h3>
        <form onSubmit={handleAssignImage} className="flex gap-2">
          <select
            value={selectedUploadId}
            onChange={(e) => setSelectedUploadId(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            disabled={uploads.length === 0}
          >
            <option value="">
              {uploads.length === 0
                ? "No images available"
                : "Select an image to assign"}
            </option>
            {uploads.map((upload) => (
              <option key={upload.id} value={upload.id}>
                {upload.originalName} ({upload.assignedToRooms} rooms,{" "}
                {upload.assignedToMenuItems} menu items)
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={assigning || !selectedUploadId}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </form>
      </div>

      {/* Room Images Gallery */}
      <div>
        <h3 className="font-semibold mb-3">
          Images for Room {roomNumber} ({roomImages.length})
        </h3>
        {roomImages.length === 0 ? (
          <p className="text-gray-500">No images assigned yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roomImages.map((roomImage) => (
              <div
                key={roomImage.id}
                className="relative group border rounded overflow-hidden"
              >
                <img
                  src={getImageUrl(roomImage.upload.path)}
                  alt={roomImage.upload.originalName}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleRemoveImage(roomImage.upload.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-gray-600 p-1 truncate">
                  {roomImage.upload.originalName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
