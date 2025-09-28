import React, { useState, useEffect } from 'react';
import { 
  Users, Package, DollarSign, TrendingUp, AlertTriangle, 
  Download, Settings, BarChart3, ShoppingCart, Eye,
  UserCheck, FileText, Shield, Bell, Calendar,
  ArrowUp, ArrowDown, Filter, Search, Plus,
  Edit, Trash2, LogOut, Home, Menu, X, Lock, User,
  Minus
} from 'lucide-react';

// API Service Functions
const API_BASE = 'http://localhost:5000/api';

class ApiService {
  static token = localStorage.getItem('token');

  static setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  static removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async getMe() {
    return this.request('/auth/me');
  }

  // Product methods
  static async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  static async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Cart methods
  static async getCart() {
    return this.request('/cart');
  }

  static async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  static async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Order methods
  static async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders${query ? `?${query}` : ''}`);
  }

  // User methods
  static async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  static async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

/* -------------------------
   Authentication Component
   ------------------------- */
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

    try {
      let response;
      if (isLogin) {
        response = await ApiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await ApiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }

      ApiService.setToken(response.token);
      onLogin(response.user);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
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

/* -------------------------
   Cart Component for Customers
   ------------------------- */
const CartComponent = ({ currentUser }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    notes: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await ApiService.getCart();
      setCart(response.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        await ApiService.removeFromCart(productId);
      } else {
        await ApiService.updateCartItem(productId, newQuantity);
      }
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await ApiService.removeFromCart(productId);
      await loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    try {
      await ApiService.createOrder(checkoutData);
      alert('Order placed successfully!');
      await loadCart();
      setShowCheckout(false);
      setCheckoutData({
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        notes: ''
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500">Add some products to get started!</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                      <p className="text-gray-500">${item.price.toFixed(2)} each</p>
                      <p className="text-sm text-gray-400">In stock: {item.productId.stock}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={item.quantity >= item.productId.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Items:</span>
              <span className="text-lg">{cart.totalItems}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">${cart.totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Checkout</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={checkoutData.shippingAddress.street}
                  onChange={(e) => setCheckoutData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={checkoutData.shippingAddress.city}
                    onChange={(e) => setCheckoutData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={checkoutData.shippingAddress.state}
                    onChange={(e) => setCheckoutData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={checkoutData.shippingAddress.zipCode}
                    onChange={(e) => setCheckoutData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, zipCode: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={checkoutData.shippingAddress.country}
                    onChange={(e) => setCheckoutData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, country: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={checkoutData.notes}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------
   Product Browse Component for Customers
   ------------------------- */
const ProductBrowseComponent = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await ApiService.getProducts(params);
      setProducts(response.products);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.products.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await ApiService.addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-blue-600">${product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <button
                onClick={() => addToCart(product._id)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

// Export the updated ERP component with integrated cart functionality
const EcommerceERP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      ApiService.setToken(token);
      // Verify token and get user info
      ApiService.getMe()
        .then(response => {
          setCurrentUser(response.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, remove it
          ApiService.removeToken();
        });
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    ApiService.removeToken();
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
    { id: 'products', name: 'Browse Products', icon: Package },
    { id: 'cart', name: 'Shopping Cart', icon: ShoppingCart },
    { id: 'orders', name: 'My Orders', icon: FileText }
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
        return <div className="p-6"><h2 className="text-2xl font-bold">Dashboard</h2><p>Welcome to your dashboard!</p></div>;
      case 'products':
        if (currentUser?.role === 'customer') {
          return <ProductBrowseComponent currentUser={currentUser} />;
        }
        return <div className="p-6"><h2 className="text-xl font-semibold">Access Denied</h2></div>;
      case 'cart':
        if (currentUser?.role === 'customer') {
          return <CartComponent currentUser={currentUser} />;
        }
        return <div className="p-6"><h2 className="text-xl font-semibold">Access Denied</h2></div>;
      case 'orders':
        return <div className="p-6"><h2 className="text-2xl font-bold">Orders</h2><p>Your orders will appear here.</p></div>;
      case 'inventory':
        return <div className="p-6"><h2 className="text-2xl font-bold">Inventory</h2><p>Inventory management coming soon.</p></div>;
      case 'sales':
        return <div className="p-6"><h2 className="text-2xl font-bold">Sales</h2><p>Sales data coming soon.</p></div>;
      case 'users':
        if (currentUser?.role === 'admin') {
          return <div className="p-6"><h2 className="text-2xl font-bold">User Management</h2><p>User management coming soon.</p></div>;
        }
        return <div className="p-6"><h2 className="text-xl font-semibold">Access Denied</h2></div>;
      case 'settings':
        if (currentUser?.role === 'admin') {
          return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p>Settings coming soon.</p></div>;
        }
        return <div className="p-6"><h2 className="text-xl font-semibold">Access Denied</h2></div>;
      default:
        return <div className="p-6"><h2 className="text-2xl font-bold">Dashboard</h2><p>Welcome to your dashboard!</p></div>;
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