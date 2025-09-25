import React, { useState, useEffect } from 'react';
import { 
  Users, Package, DollarSign, TrendingUp, AlertTriangle, 
  Download, Settings, BarChart3, ShoppingCart, Eye,
  UserCheck, FileText, Shield, Bell, Calendar,
  ArrowUp, ArrowDown, Filter, Search, Plus,
  Edit, Trash2, LogOut, Home, Menu, X, Lock, User
} from 'lucide-react';

// Mock Data
const initialData = {
  users: [
    { id: 1, name: 'John Admin', email: 'admin@erp.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Vendor', email: 'vendor@erp.com', role: 'vendor', status: 'active' },
    { id: 3, name: 'Bob Customer', email: 'customer@erp.com', role: 'customer', status: 'active' }
  ],
  products: [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', stock: 25, price: 999, vendorId: 2, sold: 45 },
    { id: 2, name: 'Smartphone X', category: 'Electronics', stock: 5, price: 699, vendorId: 2, sold: 89 },
    { id: 3, name: 'Headphones', category: 'Audio', stock: 50, price: 199, vendorId: 2, sold: 23 }
  ],
  orders: [
    { id: 1, customerId: 3, vendorId: 2, productId: 1, quantity: 2, total: 1998, status: 'completed', date: '2024-09-20' },
    { id: 2, customerId: 3, vendorId: 2, productId: 2, quantity: 1, total: 699, status: 'pending', date: '2024-09-22' }
  ],
  vendors: [
    { id: 2, name: 'TechStore Inc', email: 'vendor@techstore.com', commission: 15, totalSales: 25670, productsCount: 3 }
  ]
};

// Authentication Component
const AuthenticationComponent = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Demo credentials for testing
        const demoCredentials = {
          'admin@erp.com': { role: 'admin', name: 'John Admin', id: 1 },
          'vendor@erp.com': { role: 'vendor', name: 'Jane Vendor', id: 2 },
          'customer@erp.com': { role: 'customer', name: 'Bob Customer', id: 3 }
        };
        
        const user = demoCredentials[formData.email];
        if (user && formData.password === 'demo123') {
          onLogin(user);
        } else {
          setErrors({ general: 'Invalid credentials. Try: admin@erp.com / demo123' });
        }
      } else {
        // Simulate successful signup
        const newUser = {
          id: Date.now(),
          email: formData.email,
          name: formData.name,
          role: formData.role
        };
        onLogin(newUser);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to ERP' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Welcome back! Please sign in to continue.' : 'Join our platform and start managing your business.'}
          </p>
        </div>

        {/* Demo Credentials Info */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Admin: admin@erp.com / demo123</div>
              <div>Vendor: vendor@erp.com / demo123</div>
              <div>Customer: customer@erp.com / demo123</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`appearance-none relative block w-full px-3 py-3 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose your account type based on how you'll use the platform
                </p>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLogin ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', name: '', role: 'customer' });
                setErrors({});
              }}
              className="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardComponent = ({ data }) => {
  const totalRevenue = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = data.orders.length;
  const pendingOrders = data.orders.filter(order => order.status === 'pending').length;
  const lowStockItems = data.products.filter(product => product.stock < 10).length;
  const bestSellers = [...data.products].sort((a, b) => b.sold - a.sold).slice(0, 3);

  const generateDashboardReport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
   const dashboardMetrics = {
  'Report Type': 'Executive Dashboard Report',
  'Generated Date': timestamp,
  'Reporting Period': 'All Time',
  'Total Revenue': totalRevenue.toLocaleString(),
  'Total Orders': totalOrders,
  'Pending Orders': pendingOrders,
  'Completed Orders': data.orders.filter(o => o.status === 'completed').length,
  'Total Products': data.products.length,
  'Low Stock Alerts': lowStockItems.length,
  'Total Customers': data.users.filter(u => u.role === 'customer').length,
  'Active Vendors': data.vendors.length,
  'Average Order Value': (totalRevenue / totalOrders).toFixed(2),
  'Total Stock Value': data.products.reduce((sum, p) => sum + (p.stock * p.price), 0).toLocaleString()
};


    const bestSellersData = bestSellers.map((product, index) => ({
  'Rank': index + 1,
  'Product Name': product.name,
  'Category': product.category,
  'Units Sold': product.sold,
  'Unit Price': product.price, // <- fixed
  'Total Revenue': (product.sold * product.price).toLocaleString(), // <- fixed
  'Current Stock': product.stock,
  'Stock Status': product.stock < 10 ? 'Low' : 'Good', // <- comma is correct here
}));

if (format === 'csv') {
  const csv = [
    '=== EXECUTIVE DASHBOARD REPORT ===',
    `Generated on: ${timestamp}`,
    '',
    '=== KEY BUSINESS METRICS ===',
    ...Object.entries(dashboardMetrics).map(([key, value]) => `${key},${value}`),
    '',
    '=== TOP PERFORMING PRODUCTS ===',
    Object.keys(bestSellersData[0]).join(','),
    ...bestSellersData.map(row => Object.values(row).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard_report_${timestamp}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
} else if (format === 'pdf') {
  const pdfContent = [
    'EXECUTIVE DASHBOARD REPORT',
    '========================',
    `Generated: ${timestamp}`,
    '',
    'BUSINESS OVERVIEW',
    '----------------',
    ...Object.entries(dashboardMetrics).slice(2).map(([key, value]) => `${key}: ${value}`),
    '',
    'TOP PERFORMING PRODUCTS',
    '----------------------',
    ...bestSellers.map((product, index) => 
      `${index + 1}. ${product.name} - ${product.sold} units sold (${(product.sold * product.price).toLocaleString()} revenue)`
    ),
    '',
    'ALERTS & RECOMMENDATIONS',
    '------------------------',
    lowStockItems.length > 0 ? `• ${lowStockItems.length} products need restocking` : '• All products have sufficient stock',
    pendingOrders > 0 ? `• ${pendingOrders} orders awaiting processing` : '• No pending orders',
    '• Consider promotional campaigns for slow-moving inventory',
    '• Monitor customer acquisition trends',
  ].join('\n');

  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard_report_${timestamp}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
}

  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => generateDashboardReport('csv')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => generateDashboardReport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Best Selling Products</h2>
        <div className="space-y-3">
          {bestSellers.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{product.sold} sold</p>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagementComponent = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredUsers = data.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const generateUserReport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const userReportData = data.users.map(user => {
      const userOrders = data.orders.filter(order => order.customerId === user.id);
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        'User ID': user.id,
        'Full Name': user.name,
        'Email Address': user.email,
        'User Role': user.role,
        'Account Status': user.status,
        'Total Orders': userOrders.length,
        'Total Spent ($)': totalSpent.toFixed(2),
        'Join Date': '2024-01-15',
        'Last Active': '2024-09-25',
        'Customer Tier': totalSpent > 1000 ? 'Premium' : totalSpent > 500 ? 'Gold' : 'Standard'
      };
    });
const userAnalytics = {
  'Report Type': 'User Management Report',
  'Generated Date': timestamp,
  'Total Users': data.users.length,
  'Admin Users': data.users.filter(u => u.role === 'admin').length,
  'Vendor Users': data.users.filter(u => u.role === 'vendor').length,
  'Customer Users': data.users.filter(u => u.role === 'customer').length,
  'Active Users': data.users.filter(u => u.status === 'active').length,
  'Premium Customers': userReportData.filter(u => u['Customer Tier'] === 'Premium').length,
  'Total Customer Spent': data.users
    .filter(u => u.role === 'customer')
    .reduce((sum, user) => {
      const userOrders = data.orders.filter(order => order.customerId === user.id);
      return sum + userOrders.reduce((orderSum, order) => orderSum + order.total, 0);
    }, 0)
    .toFixed(2)
};

if (format === 'csv') {
  const csv = [
    '=== USER MANAGEMENT REPORT ===',
    `Generated on: ${timestamp}`,
    '',
    '=== USER ANALYTICS ===',
    ...Object.entries(userAnalytics).map(([key, value]) => `${key},${value}`),
    '',
    '=== DETAILED USER DATA ===',
    Object.keys(userReportData[0]).join(','),
    ...userReportData.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user_management_report_${timestamp}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => generateUserReport('csv')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inventory Management Component
const InventoryManagementComponent = ({ data }) => {
  const lowStockProducts = data.products.filter(product => product.stock < 10);
  const totalStockValue = data.products.reduce((sum, product) => sum + (product.stock * product.price), 0);

  const generateInventoryReport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportData = data.products.map(product => ({
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Current Stock': product.stock,
      'Unit Price ($)': product.price,
      'Stock Value ($)': (product.stock * product.price).toFixed(2),
      'Units Sold': product.sold,
      'Revenue Generated ($)': (product.sold * product.price).toFixed(2),
      'Stock Status': product.stock < 10 ? 'Low Stock' : product.stock < 50 ? 'Medium Stock' : 'High Stock',
      'Vendor ID': product.vendorId || 'N/A'
    }));

const summaryData = {
  'Report Type': 'Inventory Management Report',
  'Generated Date': timestamp,
  'Total Products': data.products.length,
  'Low Stock Items': lowStockProducts.length,
  'Total Stock Value': totalStockValue.toLocaleString(),
  'Total Units in Stock': data.products.reduce((sum, p) => sum + p.stock, 0),
  'Total Units Sold': data.products.reduce((sum, p) => sum + p.sold, 0),
  'Total Revenue': data.products.reduce((sum, p) => sum + (p.sold * p.price), 0).toLocaleString()
};

if (format === 'csv') {
  const csv = [
    '=== INVENTORY MANAGEMENT REPORT ===',
    `Generated on: ${timestamp}`,
    '',
    '=== SUMMARY ===',
    ...Object.entries(summaryData).map(([key, value]) => `${key},${value}`),
    '',
    '=== DETAILED INVENTORY DATA ===',
    Object.keys(reportData[0]).join(','),
    ...reportData.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventory_report_${timestamp}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
} else if (format === 'json') {
  const jsonData = {
    reportInfo: summaryData,
    inventoryData: reportData,
    lowStockAlerts: lowStockProducts.map(p => ({
      id: p.id,
      name: p.name,
      currentStock: p.stock,
      alertLevel: 'LOW'
    }))
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventory_report_${timestamp}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => generateInventoryReport('csv')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => generateInventoryReport('json')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{data.products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalStockValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <p className="text-red-700 mt-1">The following products are running low on stock:</p>
          <ul className="mt-2 space-y-1">
            {lowStockProducts.map(product => (
              <li key={product.id} className="text-red-700">
                • {product.name} ({product.stock} remaining)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    product.stock < 10 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.sold}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Component
const SettingsComponent = () => {
  const [settings, setSettings] = useState({
    siteName: 'E-commerce ERP',
    currency: 'USD',
    taxRate: '8.5',
    lowStockAlert: '10',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={settings.taxRate}
              onChange={(e) => handleSettingChange('taxRate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert Threshold</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={settings.lowStockAlert}
              onChange={(e) => handleSettingChange('lowStockAlert', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive order and system notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Backup</p>
              <p className="text-sm text-gray-500">Automatically backup system data daily</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sales Component
const SalesComponent = ({ data }) => {
  const totalRevenue = data.orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = data.orders.filter(order => order.status === 'completed');
  const avgOrderValue = totalRevenue / data.orders.length;
  const monthlyRevenue = data.orders.filter(order => {
    const orderDate = new Date(order.date);
    const currentMonth = new Date().getMonth();
    return orderDate.getMonth() === currentMonth;
  }).reduce((sum, order) => sum + order.total, 0);

  const generateSalesReport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportData = data.orders.map(order => {
      const product = data.products.find(p => p.id === order.productId);
      const customer = data.users.find(u => u.id === order.customerId);
      const vendor = data.vendors.find(v => v.id === order.vendorId);
      
      return {
        'Order ID': order.id,
        'Order Date': order.date,
        'Customer Name': customer?.name || 'Unknown',
        'Customer Email': customer?.email || 'N/A',
        'Product Name': product?.name || 'Unknown',
        'Product Category': product?.category || 'N/A',
        'Vendor Name': vendor?.name || 'Unknown',
        'Quantity': order.quantity,
        'Unit Price ($)': product?.price || 0,
        'Total Amount ($)': order.total,
        'Order Status': order.status,
        'Commission Rate (%)': vendor?.commission || 0,
        'Commission Amount ($)': vendor ? ((order.total * vendor.commission) / 100).toFixed(2) : 0
      };
    });

   const analytics = {
  'Report Type': 'Sales & Revenue Report',
  'Generated Date': timestamp,
  'Total Orders': data.orders.length,
  'Completed Orders': completedOrders.length,
  'Pending Orders': data.orders.filter(o => o.status === 'pending').length,
  'Cancelled Orders': data.orders.filter(o => o.status === 'cancelled').length,
  'Total Revenue': totalRevenue.toLocaleString(),
  'Monthly Revenue': monthlyRevenue.toLocaleString(),
  'Average Order Value': avgOrderValue.toFixed(2),
  'Total Commission Paid': data.orders.reduce((sum, order) => {
    const vendor = data.vendors.find(v => v.id === order.vendorId);
    return sum + (vendor ? (order.total * vendor.commission) / 100 : 0);
  }, 0).toFixed(2),
  'Best Selling Product': data.products.reduce((max, product) => product.sold > max.sold ? product : max, data.products[0]).name
};

if (format === 'csv') {
  const csv = [
    '=== SALES & REVENUE REPORT ===',
    `Generated on: ${timestamp}`,
    '',
    '=== SALES ANALYTICS ===',
    ...Object.entries(analytics).map(([key, value]) => `${key},${value}`),
    '',
    '=== DETAILED SALES DATA ===',
    Object.keys(reportData[0]).join(','),
    ...reportData.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sales_report_${timestamp}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

} else if (format === 'excel') {
  const excelData = [
    '=== SALES DASHBOARD EXPORT ===',
    `Report Generated: ${timestamp}`,
    '',
    '=== KEY METRICS ===',
    'Metric,Value',
    ...Object.entries(analytics).slice(2).map(([key, value]) => `${key},${value}`),
    '',
    '=== REVENUE BY STATUS ===',
    'Status,Count,Revenue',
    `Completed,${completedOrders.length},${completedOrders.reduce((sum, order) => sum + order.total, 0)}`,
    `Pending,${data.orders.filter(o => o.status === 'pending').length},${data.orders.filter(o => o.status === 'pending').reduce((sum, order) => sum + order.total, 0)}`,
    '',
    '=== COMPLETE ORDER DETAILS ===',
    Object.keys(reportData[0]).join(','),
    ...reportData.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sales_report_${timestamp}.xls`;
  a.click();
  window.URL.revokeObjectURL(url);
}

  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Revenue</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => generateSalesReport('csv')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => generateSalesReport('excel')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.orders.map(order => {
              const product = data.products.find(p => p.id === order.productId);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main ERP Component
const EcommerceERP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [data] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveModule('dashboard');
  };

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return <AuthenticationComponent onLogin={handleLogin} />;
  }

  const adminModules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'sales', name: 'Sales & Revenue', icon: DollarSign },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const vendorModules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventory', name: 'My Products', icon: Package },
    { id: 'sales', name: 'My Sales', icon: DollarSign }
  ];

  const customerModules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'sales', name: 'My Orders', icon: ShoppingCart }
  ];

  const getModulesForRole = (role) => {
    switch (role) {
      case 'admin':
        return adminModules;
      case 'vendor':
        return vendorModules;
      case 'customer':
        return customerModules;
      default:
        return adminModules;
    }
  };

  const modules = getModulesForRole(currentUser?.role);

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardComponent data={data} />;
      case 'users':
        return <UserManagementComponent data={data} />;
      case 'inventory':
        return <InventoryManagementComponent data={data} />;
      case 'sales':
        return <SalesComponent data={data} />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <DashboardComponent data={data} />;
    }
  };

  return (
  <div className="flex h-screen bg-gray-100 overflow-hidden">
    {/* Sidebar */}
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col flex-shrink-0`}>
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {sidebarOpen && (
          <h1 className="text-xl font-bold text-gray-800">E-commerce ERP</h1>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {modules.map(module => {
            const IconComponent = module.icon;
            return (
              <li key={module.id}>
                <button
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{module.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          {sidebarOpen && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
            </div>
          )}
          {sidebarOpen && (
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {activeModule.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Role Display */}
            <div className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-gray-50">
              <span className="capitalize">{currentUser?.role} View</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {renderContent()}
      </main>
    </div>
  </div>
);

};

export default EcommerceERP;