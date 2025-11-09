import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Trash2,
  MapPin,
  TrendingUp,
  Activity,
  Bell,
} from "lucide-react";


// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon function
const createCustomIcon = (fillLevel) => {
  const color =
    fillLevel >= 80 ? "#ef4444" : fillLevel >= 60 ? "#f59e0b" : "#10b981";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Component to center map on bins
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

// Dummy data for bins
const generateDummyBins = () => [
  {
    bin_id: "CHT001",
    location: { lat: 27.678, lng: 84.432 },
    metal: 35,
    plastic: 55,
    bio: 20,
    fill_level: 75,
    timestamp: "2025-11-06T10:20:00Z",
    status: "warning",
    address: "Pokhara City Center",
  },
  {
    bin_id: "CHT002",
    location: { lat: 27.685, lng: 84.425 },
    metal: 45,
    plastic: 30,
    bio: 25,
    fill_level: 92,
    timestamp: "2025-11-06T10:18:00Z",
    status: "critical",
    address: "Mahendrapul Area",
  },
  {
    bin_id: "CHT003",
    location: { lat: 27.672, lng: 84.44 },
    metal: 20,
    plastic: 40,
    bio: 40,
    fill_level: 45,
    timestamp: "2025-11-06T10:22:00Z",
    status: "good",
    address: "Lakeside Road",
  },
  {
    bin_id: "CHT004",
    location: { lat: 27.69, lng: 84.435 },
    metal: 30,
    plastic: 45,
    bio: 25,
    fill_level: 68,
    timestamp: "2025-11-06T10:19:00Z",
    status: "warning",
    address: "Prithvi Chowk",
  },
  {
    bin_id: "CHT005",
    location: { lat: 27.665, lng: 84.428 },
    metal: 15,
    plastic: 35,
    bio: 50,
    fill_level: 30,
    timestamp: "2025-11-06T10:21:00Z",
    status: "good",
    address: "Birauta",
  },
];

const generateHistoricalData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    metal: Math.floor(Math.random() * 100) + 50,
    plastic: Math.floor(Math.random() * 150) + 100,
    bio: Math.floor(Math.random() * 120) + 80,
  }));
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [bins, setBins] = useState(generateDummyBins());
  const [historicalData] = useState(generateHistoricalData());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prevBins) =>
        prevBins.map((bin) => ({
          ...bin,
          fill_level: Math.min(100, bin.fill_level + Math.random() * 2),
          timestamp: new Date().toISOString(),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalBins = bins.length;
  const criticalBins = bins.filter((b) => b.fill_level >= 80).length;
  const warningBins = bins.filter(
    (b) => b.fill_level >= 60 && b.fill_level < 80
  ).length;
  const avgFillLevel = (
    bins.reduce((sum, b) => sum + b.fill_level, 0) / bins.length
  ).toFixed(1);

  // Aggregate waste type data
  const wasteTypeData = [
    {
      name: "Metal",
      value: bins.reduce((sum, b) => sum + b.metal, 0),
      color: "#64748b",
    },
    {
      name: "Plastic",
      value: bins.reduce((sum, b) => sum + b.plastic, 0),
      color: "#3b82f6",
    },
    {
      name: "Biodegradable",
      value: bins.reduce((sum, b) => sum + b.bio, 0),
      color: "#22c55e",
    },
  ];

  const getStatusColor = (fillLevel) => {
    if (fillLevel >= 80) return "bg-red-500";
    if (fillLevel >= 60) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusBadge = (fillLevel) => {
    if (fillLevel >= 80) return "text-red-600 bg-red-100";
    if (fillLevel >= 60) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Smart Waste
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Management System
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveView("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === "overview"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveView("bins")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === "bins"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Bin Status</span>
          </button>

          <button
            onClick={() => setActiveView("map")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === "map"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Map View</span>
          </button>

          <button
            onClick={() => setActiveView("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === "analytics"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>

          <button
            onClick={() => setActiveView("alerts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === "alerts"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Alerts</span>
            {criticalBins > 0 && (
              <span className="ml-auto bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg">
                {criticalBins}
              </span>
            )}
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-400">
            <p>Last Updated:</p>
            <p className="font-medium text-white">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {activeView === "overview" && "Dashboard Overview"}
              {activeView === "bins" && "Bin Status Monitor"}
              {activeView === "map" && "Location Map"}
              {activeView === "analytics" && "Waste Analytics"}
              {activeView === "alerts" && "System Alerts"}
            </h2>
            <p className="text-slate-600 mt-1 font-medium">
              Real-time waste management monitoring for Pokhara Municipality
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeView === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">
                        Total Bins
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-2">
                        {totalBins}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">
                        Critical Bins
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-2">
                        {criticalBins}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">
                        Warning Level
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-2">
                        {warningBins}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">
                        Avg Fill Level
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                        {avgFillLevel}%
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waste Type Distribution */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Waste Type Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Fill Levels Chart */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Bin Fill Levels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bins}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bin_id" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="fill_level"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Bins Table */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-lg font-bold text-slate-800">
                    Recent Bin Updates
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Bin ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Fill Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Last Update
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      {bins.map((bin) => (
                        <tr
                          key={bin.bin_id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {bin.bin_id}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {bin.address}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-slate-200 rounded-full h-2.5 shadow-inner">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-300 ${getStatusColor(
                                    bin.fill_level
                                  )}`}
                                  style={{ width: `${bin.fill_level}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {bin.fill_level.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(
                                bin.fill_level
                              )} shadow-sm`}
                            >
                              {bin.fill_level >= 80
                                ? "Critical"
                                : bin.fill_level >= 60
                                ? "Warning"
                                : "Good"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {new Date(bin.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === "bins" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bins.map((bin) => (
                <div
                  key={bin.bin_id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-1.5 ${getStatusColor(bin.fill_level)}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900">
                        {bin.bin_id}
                      </h3>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(
                          bin.fill_level
                        )} shadow-sm`}
                      >
                        {bin.fill_level >= 80
                          ? "Critical"
                          : bin.fill_level >= 60
                          ? "Warning"
                          : "Good"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {bin.address}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600 font-semibold">
                            Fill Level
                          </span>
                          <span className="font-bold text-slate-900">
                            {bin.fill_level.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(
                              bin.fill_level
                            )}`}
                            style={{ width: `${bin.fill_level}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                        <div className="text-center bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-600 font-semibold mb-1">
                            Metal
                          </p>
                          <p className="text-lg font-bold text-slate-800">
                            {bin.metal}%
                          </p>
                        </div>
                        <div className="text-center bg-blue-50 rounded-lg p-2">
                          <p className="text-xs text-slate-600 font-semibold mb-1">
                            Plastic
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {bin.plastic}%
                          </p>
                        </div>
                        <div className="text-center bg-emerald-50 rounded-lg p-2">
                          <p className="text-xs text-slate-600 font-semibold mb-1">
                            Bio
                          </p>
                          <p className="text-lg font-bold text-emerald-600">
                            {bin.bio}%
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 font-medium">
                        Updated: {new Date(bin.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === "map" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="h-[600px] rounded-xl overflow-hidden shadow-xl border border-slate-200">
                <MapContainer
                  center={[27.678, 84.432]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {bins.map((bin) => (
                    <Marker
                      key={bin.bin_id}
                      position={[bin.location.lat, bin.location.lng]}
                      icon={createCustomIcon(bin.fill_level)}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">
                              {bin.bin_id}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                bin.fill_level
                              )}`}
                            >
                              {bin.fill_level >= 80
                                ? "Critical"
                                : bin.fill_level >= 60
                                ? "Warning"
                                : "Good"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {bin.address}
                          </p>
                          <div className="space-y-1 mb-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">
                                Fill Level:
                              </span>
                              <span className="font-semibold text-slate-700">
                                {bin.fill_level.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getStatusColor(
                                  bin.fill_level
                                )}`}
                                style={{ width: `${bin.fill_level}%` }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Metal</p>
                              <p className="text-sm font-bold text-slate-700">
                                {bin.metal}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Plastic</p>
                              <p className="text-sm font-bold text-blue-600">
                                {bin.plastic}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Bio</p>
                              <p className="text-sm font-bold text-emerald-600">
                                {bin.bio}%
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-200">
                            Updated: {new Date(bin.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {activeView === "analytics" && (
            <div className="space-y-6">
              {/* Weekly Trends */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Weekly Waste Collection Trends
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="metal"
                      stroke="#64748b"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="plastic"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="bio"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Waste Composition by Bin */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Waste Composition by Bin
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="metal" fill="#64748b" />
                    <Bar dataKey="plastic" fill="#3b82f6" />
                    <Bar dataKey="bio" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-600 to-slate-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <h4 className="text-sm font-semibold mb-2 opacity-90">
                    Total Metal Collected
                  </h4>
                  <p className="text-4xl font-bold">
                    {bins.reduce((sum, b) => sum + b.metal, 0)} kg
                  </p>
                  <p className="text-sm mt-2 opacity-75 font-medium">
                    Across all bins
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <h4 className="text-sm font-semibold mb-2 opacity-90">
                    Total Plastic Collected
                  </h4>
                  <p className="text-4xl font-bold">
                    {bins.reduce((sum, b) => sum + b.plastic, 0)} kg
                  </p>
                  <p className="text-sm mt-2 opacity-75 font-medium">
                    Across all bins
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <h4 className="text-sm font-semibold mb-2 opacity-90">
                    Total Bio Collected
                  </h4>
                  <p className="text-4xl font-bold">
                    {bins.reduce((sum, b) => sum + b.bio, 0)} kg
                  </p>
                  <p className="text-sm mt-2 opacity-75 font-medium">
                    Across all bins
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === "alerts" && (
            <div className="space-y-4">
              {bins
                .filter((bin) => bin.fill_level >= 60)
                .sort((a, b) => b.fill_level - a.fill_level)
                .map((bin) => (
                  <div
                    key={bin.bin_id}
                    className={`border-l-4 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                      bin.fill_level >= 80
                        ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-500"
                        : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-xl ${
                            bin.fill_level >= 80 ? "bg-red-100" : "bg-amber-100"
                          }`}
                        >
                          <AlertCircle
                            className={`w-6 h-6 ${
                              bin.fill_level >= 80
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {bin.fill_level >= 80 ? "CRITICAL: " : "WARNING: "}
                            Bin {bin.bin_id} Needs Collection
                          </h3>
                          <p className="text-slate-700 mt-1 font-medium">
                            Location: {bin.address} (Lat: {bin.location.lat},
                            Lng: {bin.location.lng})
                          </p>
                          <p className="text-slate-700 mt-1">
                            Fill Level:{" "}
                            <span className="font-bold text-slate-900">
                              {bin.fill_level.toFixed(0)}%
                            </span>
                          </p>
                          <p className="text-sm text-slate-600 mt-2 font-medium">
                            Last updated:{" "}
                            {new Date(bin.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm hover:shadow-md">
                        Dispatch Team
                      </button>
                    </div>
                  </div>
                ))}

              {bins.filter((bin) => bin.fill_level >= 60).length === 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-12 text-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Activity className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    All Clear!
                  </h3>
                  <p className="text-slate-600 font-medium">
                    No bins require immediate attention at this time.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
