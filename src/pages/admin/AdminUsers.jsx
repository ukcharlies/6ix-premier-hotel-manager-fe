import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [search, roleFilter, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);

      const res = await api.get(`/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handlePromote = async (user) => {
    if (!confirm(`Promote ${user.firstName} ${user.lastName} to ADMIN?`)) return;

    try {
      await api.patch(`/users/${user.id}/promote`);
      setSuccess(`${user.firstName} has been promoted to ADMIN`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    }
  };

  const handlePromoteToStaff = async (user) => {
    if (!confirm(`Promote ${user.firstName} ${user.lastName} to STAFF?`)) return;

    try {
      await api.patch(`/users/${user.id}/promote-staff`);
      setSuccess(`${user.firstName} has been promoted to STAFF`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (!confirm(`Change ${user.firstName} ${user.lastName}'s role to ${newRole}?`)) return;

    try {
      await api.patch(`/users/${user.id}/role`, { role: newRole });
      setSuccess(`${user.firstName}'s role has been changed to ${newRole}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change role");
    }
  };

  const handleDemote = async (user) => {
    if (!confirm(`Demote ${user.firstName} ${user.lastName} to GUEST?`)) return;

    try {
      await api.patch(`/users/${user.id}/demote`);
      setSuccess(`${user.firstName} has been demoted to GUEST`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to demote user");
    }
  };

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? "deactivate" : "activate";
    if (!confirm(`${action} ${user.firstName} ${user.lastName}'s account?`)) return;

    try {
      await api.patch(`/users/${user.id}/toggle-status`);
      setSuccess(`User account has been ${action}d`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    }
  };

  const roleColors = {
    ADMIN: "bg-purple-100 text-purple-800",
    GUEST: "bg-blue-100 text-blue-800",
    STAFF: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-premier-dark">User Management</h1>
        <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-premier-dark">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-purple-600">{stats.adminUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Staff</p>
            <p className="text-2xl font-bold text-green-600">{stats.staffUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Guests</p>
            <p className="text-2xl font-bold text-blue-600">{stats.guestUsers}</p>
          </div>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="GUEST">Guest</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Bookings</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-premier-copper rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-premier-dark">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {user._count?.bookings || 0}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role dropdown */}
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeRole(user, e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                          >
                            <option value="GUEST">GUEST</option>
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`text-sm font-medium ${
                              user.isActive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {user.isActive ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
