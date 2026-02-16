import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { extractErrorMessage } from "../utils/apiNormalizer";
import { buildUploadImageUrl } from "../utils/publicUrl";

export default function UploadPreviewModal({ open, upload, onClose, onLinked }) {
  const [entityType, setEntityType] = useState("general");
  const [entityId, setEntityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);

  useEffect(() => {
    if (!upload) return;
    setEntityType(upload?.type || "general");
    setEntityId("");
    setError(null);
  }, [upload?.id]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchEntities = async () => {
      setEntitiesLoading(true);
      try {
        const [roomsRes, menuRes] = await Promise.all([
          api.get("/rooms").catch(() => ({ data: { rooms: [] } })),
          api.get("/menu").catch(() => ({ data: { menuItems: [] } })),
        ]);

        const roomsData = roomsRes.data?.rooms || roomsRes.data?.data || [];
        const menuData = menuRes.data?.menuItems || menuRes.data?.data || [];

        if (!cancelled) {
          setRooms(Array.isArray(roomsData) ? roomsData : []);
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }
      } finally {
        if (!cancelled) setEntitiesLoading(false);
      }
    };

    fetchEntities();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const entityOptions = useMemo(() => {
    if (entityType === "room") return rooms;
    if (entityType === "menu") return menuItems;
    return [];
  }, [entityType, rooms, menuItems]);

  if (!open || !upload) return null;

  const imageSrc = buildUploadImageUrl(upload);

  const handleLink = async () => {
    if (!entityType) {
      setError("Please select an entity type.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (entityType === "general" || entityType === "user") {
        if (onLinked) onLinked(upload);
        onClose();
        return;
      }

      if (!entityId) {
        setError("Please provide a room/menu item ID.");
        return;
      }

      if (entityType === "room") {
        await api.post(`/images/rooms/${entityId}`, { uploadId: upload.id });
      } else if (entityType === "menu") {
        await api.post(`/images/menu-items/${entityId}`, { uploadId: upload.id });
      } else {
        setError("Unsupported entity type for linking.");
        return;
      }

      if (onLinked) onLinked(upload);
      onClose();
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

            {(entityType === "room" || entityType === "menu") && (
              <div>
                <label className="block text-sm text-gray-600">
                  Pick {entityType === "room" ? "Room" : "Menu Item"}
                </label>
                <select
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                  disabled={entitiesLoading}
                >
                  <option value="">
                    {entitiesLoading ? "Loading..." : "Select one"}
                  </option>
                  {entityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {entityType === "room"
                        ? `Room ${opt.roomNumber} (${opt.roomType})`
                        : `${opt.name} (${opt.category})`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {entityType === "room"
                    ? "Assigns this upload to the selected room."
                    : "Assigns this upload to the selected menu item."}
                </p>
              </div>
            )}

            {(entityType === "room" || entityType === "menu") && (
              <div>
                <label className="block text-sm text-gray-600">Or enter ID</label>
                <input
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  placeholder={entityType === "room" ? "Room ID (e.g. 12)" : "Menu item ID (e.g. 5)"}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            )}

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
