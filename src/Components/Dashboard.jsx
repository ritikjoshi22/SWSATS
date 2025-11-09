import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Trash2, MapPin, TrendingUp, Activity, Bell } from 'lucide-react';

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
    address: "Pokhara City Center"
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
    address: "Mahendrapul Area"
  },
  {
    bin_id: "CHT003",
    location: { lat: 27.672, lng: 84.440 },
    metal: 20,
    plastic: 40,
    bio: 40,
    fill_level: 45,
    timestamp: "2025-11-06T10:22:00Z",
    status: "good",
    address: "Lakeside Road"
  },
  {
    bin_id: "CHT004",
    location: { lat: 27.690, lng: 84.435 },
    metal: 30,
    plastic: 45,
    bio: 25,
    fill_level: 68,
    timestamp: "2025-11-06T10:19:00Z",
    status: "warning",
    address: "Prithvi Chowk"
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
    address: "Birauta"
  }
];

const generateHistoricalData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    metal: Math.floor(Math.random() * 100) + 50,
    plastic: Math.floor(Math.random() * 150) + 100,
    bio: Math.floor(Math.random() * 120) + 80
  }));
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [bins, setBins] = useState(generateDummyBins());
  const [historicalData] = useState(generateHistoricalData());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prevBins => prevBins.map(bin => ({
        ...bin,
        fill_level: Math.min(100, bin.fill_level + Math.random() * 2),
        timestamp: new Date().toISOString()
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalBins = bins.length;
  const criticalBins = bins.filter(b => b.fill_level >= 80).length;
  const warningBins = bins.filter(b => b.fill_level >= 60 && b.fill_level < 80).length;
  const avgFillLevel = (bins.reduce((sum, b) => sum + b.fill_level, 0) / bins.length).toFixed(1);

  // Aggregate waste type data
  const wasteTypeData = [
    { name: 'Metal', value: bins.reduce((sum, b) => sum + b.metal, 0), color: '#64748b' },
    { name: 'Plastic', value: bins.reduce((sum, b) => sum + b.plastic, 0), color: '#3b82f6' },
    { name: 'Biodegradable', value: bins.reduce((sum, b) => sum + b.bio, 0), color: '#22c55e' }
  ];

  const getStatusColor = (fillLevel) => {
    if (fillLevel >= 80) return 'bg-red-500';
    if (fillLevel >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (fillLevel) => {
    if (fillLevel >= 80) return 'text-red-600 bg-red-100';
    if (fillLevel >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center gap-3">
            <Trash2 className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Smart Waste</h1>
              <p className="text-xs text-blue-200">Management System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'overview' ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-700'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveView('bins')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'bins' ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-700'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Bin Status</span>
          </button>

          <button
            onClick={() => setActiveView('map')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'map' ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-700'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Map View</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'analytics' ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>

          <button
            onClick={() => setActiveView('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'alerts' ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-700'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Alerts</span>
            {criticalBins > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {criticalBins}
              </span>
            )}
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-500">
          <div className="text-xs text-blue-200">
            <p>Last Updated:</p>
            <p className="font-medium text-white">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {activeView === 'overview' && 'Dashboard Overview'}
              {activeView === 'bins' && 'Bin Status Monitor'}
              {activeView === 'map' && 'Location Map'}
              {activeView === 'analytics' && 'Waste Analytics'}
              {activeView === 'alerts' && 'System Alerts'}
            </h2>
            <p className="text-gray-500 mt-1">Real-time waste management monitoring for Pokhara Municipality</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Bins</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{totalBins}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Trash2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Critical Bins</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{criticalBins}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Warning Level</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{warningBins}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Avg Fill Level</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{avgFillLevel}%</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waste Type Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Waste Type Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Bin Fill Levels</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bins}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bin_id" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="fill_level" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Bins Table */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-800">Recent Bin Updates</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bin ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fill Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bins.map(bin => (
                        <tr key={bin.bin_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{bin.bin_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{bin.address}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getStatusColor(bin.fill_level)}`}
                                  style={{ width: `${bin.fill_level}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{bin.fill_level.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(bin.fill_level)}`}>
                              {bin.fill_level >= 80 ? 'Critical' : bin.fill_level >= 60 ? 'Warning' : 'Good'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
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

          {activeView === 'bins' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bins.map(bin => (
                <div key={bin.bin_id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className={`h-2 ${getStatusColor(bin.fill_level)}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{bin.bin_id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(bin.fill_level)}`}>
                        {bin.fill_level >= 80 ? 'Critical' : bin.fill_level >= 60 ? 'Warning' : 'Good'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {bin.address}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Fill Level</span>
                          <span className="font-medium text-gray-800">{bin.fill_level.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${getStatusColor(bin.fill_level)}`}
                            style={{ width: `${bin.fill_level}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Metal</p>
                          <p className="text-lg font-bold text-gray-700">{bin.metal}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Plastic</p>
                          <p className="text-lg font-bold text-blue-600">{bin.plastic}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Bio</p>
                          <p className="text-lg font-bold text-green-600">{bin.bio}%</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 pt-2 border-t">
                        Updated: {new Date(bin.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === 'map' && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="h-[600px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Map View</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Interactive map showing all bin locations in Pokhara
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {bins.map(bin => (
                      <div key={bin.bin_id} className="bg-white border-2 border-gray-200 rounded-lg p-4 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-800">{bin.bin_id}</span>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(bin.fill_level)}`} />
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{bin.address}</p>
                        <p className="text-xs text-gray-400">
                          Lat: {bin.location.lat}, Lng: {bin.location.lng}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          Fill: {bin.fill_level.toFixed(0)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="space-y-6">
              {/* Weekly Trends */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Waste Collection Trends</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="metal" stroke="#64748b" strokeWidth={2} />
                    <Line type="monotone" dataKey="plastic" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="bio" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Waste Composition by Bin */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Waste Composition by Bin</h3>
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
                <div className="bg-gradient-to-br from-gray-500 to-gray-700 text-white p-6 rounded-xl shadow-md">
                  <h4 className="text-sm font-medium mb-2 opacity-90">Total Metal Collected</h4>
                  <p className="text-4xl font-bold">{bins.reduce((sum, b) => sum + b.metal, 0)} kg</p>
                  <p className="text-sm mt-2 opacity-75">Across all bins</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-md">
                  <h4 className="text-sm font-medium mb-2 opacity-90">Total Plastic Collected</h4>
                  <p className="text-4xl font-bold">{bins.reduce((sum, b) => sum + b.plastic, 0)} kg</p>
                  <p className="text-sm mt-2 opacity-75">Across all bins</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-md">
                  <h4 className="text-sm font-medium mb-2 opacity-90">Total Bio Collected</h4>
                  <p className="text-4xl font-bold">{bins.reduce((sum, b) => sum + b.bio, 0)} kg</p>
                  <p className="text-sm mt-2 opacity-75">Across all bins</p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'alerts' && (
            <div className="space-y-4">
              {bins
                .filter(bin => bin.fill_level >= 60)
                .sort((a, b) => b.fill_level - a.fill_level)
                .map(bin => (
                  <div
                    key={bin.bin_id}
                    className={`border-l-4 rounded-lg shadow-md p-6 ${
                      bin.fill_level >= 80
                        ? 'bg-red-50 border-red-500'
                        : 'bg-orange-50 border-orange-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <AlertCircle
                          className={`w-6 h-6 mt-1 ${
                            bin.fill_level >= 80 ? 'text-red-600' : 'text-orange-600'
                          }`}
                        />
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {bin.fill_level >= 80 ? 'CRITICAL: ' : 'WARNING: '}
                            Bin {bin.bin_id} Needs Collection
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Location: {bin.address} (Lat: {bin.location.lat}, Lng: {bin.location.lng})
                          </p>
                          <p className="text-gray-600 mt-1">
                            Fill Level: <span className="font-bold">{bin.fill_level.toFixed(0)}%</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Last updated: {new Date(bin.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Dispatch Team
                      </button>
                    </div>
                  </div>
                ))}

              {bins.filter(bin => bin.fill_level >= 60).length === 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No bins require immediate attention at this time.</p>
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