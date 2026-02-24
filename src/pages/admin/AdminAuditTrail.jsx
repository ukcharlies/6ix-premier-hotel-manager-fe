import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

const ACTION_COLORS = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-rose-100 text-rose-700",
  INITIATE: "bg-amber-100 text-amber-700",
  VERIFY_SUCCESS: "bg-emerald-100 text-emerald-700",
  VERIFY_FAILED: "bg-rose-100 text-rose-700",
  LOGIN: "bg-indigo-100 text-indigo-700",
  REGISTER: "bg-purple-100 text-purple-700",
  STATUS_CHANGE: "bg-cyan-100 text-cyan-700",
};

const TABLE_ICONS = {
  payments: "💳",
  bookings: "📅",
  rooms: "🏨",
  users: "👤",
  menu_items: "🍽️",
  uploads: "📁",
  services: "🛎️",
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

function JsonViewer({ data, label }) {
  const [open, setOpen] = useState(false);
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) return null;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs text-premier-copper hover:underline font-medium"
      >
        {open ? `▾ Hide ${label}` : `▸ Show ${label}`}
      </button>
      {open && (
        <pre className="mt-1 text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-all text-gray-700">
          {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function AdminAuditTrail() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [filterOptions, setFilterOptions] = useState({ actions: [], tables: [] });

  // Filters
  const [filters, setFilters] = useState({
    action: "",
    tableName: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 25 });

      if (filters.action) params.set("action", filters.action);
      if (filters.tableName) params.set("tableName", filters.tableName);
      if (filters.search) params.set("search", filters.search);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const response = await api.get(`/admin/audit-trail?${params.toString()}`);
      setLogs(response.data.logs || []);
      setPagination(response.data.pagination || { page: 1, limit: 25, total: 0, totalPages: 0 });
      setFilterOptions(response.data.filters || { actions: [], tables: [] });
    } catch (error) {
      console.error("[AUDIT TRAIL] fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/audit-trail/stats");
      setStats(response.data.stats || null);
    } catch (error) {
      console.error("[AUDIT TRAIL] stats error:", error);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ action: "", tableName: "", search: "", startDate: "", endDate: "" });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-gray-800 text-white px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 text-premier-copper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <h1 className="text-3xl font-bold">Audit Trail</h1>
        </div>
        <p className="text-white/70">
          Complete activity log of all system actions — track every change, payment, and user interaction.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Total Logs</p>
            <p className="text-3xl font-bold text-premier-dark mt-1">{stats.totalLogs?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.todayLogs?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Last 30 Days</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.last30DaysLogs?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Top Action</p>
            <p className="text-xl font-bold text-premier-copper mt-1">
              {stats.actionBreakdown?.[0]?.action || "N/A"}
              {stats.actionBreakdown?.[0] && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({stats.actionBreakdown[0].count})
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-premier-dark">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Name, email, table..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
            >
              <option value="">All Actions</option>
              {filterOptions.actions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Table</label>
            <select
              value={filters.tableName}
              onChange={(e) => handleFilterChange("tableName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
            >
              <option value="">All Tables</option>
              {filterOptions.tables.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-premier-dark">
            Activity Log
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.total.toLocaleString()} entries)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="font-medium">No audit logs found</p>
            <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Record ID</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-xs">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {log.user ? (
                          <div>
                            <p className="font-medium text-premier-dark text-sm">
                              {log.user.firstName} {log.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">System</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <span>{TABLE_ICONS[log.tableName] || "📋"}</span>
                          {log.tableName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                        #{log.recordId}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <JsonViewer data={log.oldValues} label="Old Values" />
                        <JsonViewer data={log.newValues} label="New Values" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span>{TABLE_ICONS[log.tableName] || "📋"}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"}`}>
                        {log.action}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(log.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {log.tableName} <span className="font-mono text-xs text-gray-400">#{log.recordId}</span>
                    </span>
                    {log.user ? (
                      <span className="text-xs text-gray-500">{log.user.firstName} {log.user.lastName}</span>
                    ) : (
                      <span className="text-xs text-gray-400">System</span>
                    )}
                  </div>
                  <JsonViewer data={log.oldValues} label="Old Values" />
                  <JsonViewer data={log.newValues} label="New Values" />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchLogs(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchLogs(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium ${
                          pageNum === pagination.page
                            ? "bg-premier-copper text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => fetchLogs(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
