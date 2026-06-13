import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee, ShoppingCart, Plus, Minus, CreditCard, Clock,
  X, Download, CheckCircle, Wallet, AlertCircle, FileText, Loader2,
  PlusCircle, Zap, Smartphone, Globe
} from 'lucide-react';

const API = 'http://localhost:5000/api';

// Fallback menu in case backend is empty
const FALLBACK_MENU = [
  { _id: '1', name: 'Veg Thali', price: 80, category: 'Lunch', isVeg: true, description: 'Complete veg meal with dal, sabzi, rice & roti' },
  { _id: '2', name: 'Chicken Biryani', price: 120, category: 'Lunch', isVeg: false, description: 'Aromatic Hyderabadi style biryani' },
  { _id: '3', name: 'Paneer Sandwich', price: 50, category: 'Snacks', isVeg: true, description: 'Grilled sandwich with paneer filling' },
  { _id: '4', name: 'Samosa', price: 15, category: 'Snacks', isVeg: true, description: 'Crispy potato samosa' },
  { _id: '5', name: 'Coffee', price: 20, category: 'Beverages', isVeg: true, description: 'Filter coffee' },
  { _id: '6', name: 'Tea', price: 10, category: 'Beverages', isVeg: true, description: 'Masala chai' },
  { _id: '7', name: 'Masala Dosa', price: 40, category: 'Breakfast', isVeg: true, description: 'Crispy dosa with potato filling' },
  { _id: '8', name: 'Poha', price: 30, category: 'Breakfast', isVeg: true, description: 'Flattened rice with vegetables' },
];

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  description?: string;
  rating?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  _id: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  date: string;
  status: string;
  paymentMode: string;
  mealType?: string;
}

export const CanteenPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [balance, setBalance] = useState<number>(1000);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  // Recharge wallet state
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeMethod, setRechargeMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [rechargeSuccess, setRechargeSuccess] = useState(false);
  const [rechargedAmt, setRechargedAmt] = useState(0); // capture amount before clearing
  const [isRecharging, setIsRecharging] = useState(false);
  // Payment method specific fields
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [methodError, setMethodError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loadingMenu, setLoadingMenu] = useState(true);

  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    // Load wallet balance from localStorage
    const saved = localStorage.getItem('canteenBalance');
    if (saved !== null) setBalance(parseFloat(saved));

    // Fetch menu
    setLoadingMenu(true);
    fetch(`${API}/canteen/menu`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(FALLBACK_MENU);
        }
      })
      .catch(() => setMenuItems(FALLBACK_MENU))
      .finally(() => setLoadingMenu(false));

    // Fetch recent orders for the user
    if (userId) {
      fetch(`${API}/canteen/orders/${userId}`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setRecentOrders(data); })
        .catch(() => {});
    }
  }, [userId]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c._id === item._id);
      if (existing) {
        return prev.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c._id === itemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(c => c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c._id !== itemId);
    });
  };

  const getQty = (itemId: string) => cart.find(c => c._id === itemId)?.quantity || 0;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  const total = parseFloat((subtotal + gst).toFixed(2));

  const handleRecharge = () => {
    const amt = parseFloat(rechargeAmount);
    if (!amt || amt <= 0 || amt > 10000) return;
    setMethodError('');

    // Validate payment method fields
    if (rechargeMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setMethodError('Please enter a valid UPI ID (e.g. name@upi)');
        return;
      }
    } else if (rechargeMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 16) { setMethodError('Please enter a valid 16-digit card number'); return; }
      if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) { setMethodError('Expiry must be MM/YY format'); return; }
      if (cardCvv.length < 3) { setMethodError('Please enter a valid CVV'); return; }
      if (!cardName.trim()) { setMethodError('Please enter the cardholder name'); return; }
    } else if (rechargeMethod === 'netbanking') {
      if (!selectedBank) { setMethodError('Please select your bank'); return; }
    }

    setIsRecharging(true);
    setRechargedAmt(amt);
    // Simulate processing delay
    setTimeout(() => {
      const newBal = parseFloat((balance + amt).toFixed(2));
      setBalance(newBal);
      localStorage.setItem('canteenBalance', newBal.toString());
      setIsRecharging(false);
      setRechargeSuccess(true);
      // Reset after 2.5 seconds
      setTimeout(() => {
        setRechargeSuccess(false);
        setShowRecharge(false);
        setRechargeAmount('');
        setRechargeMethod('upi');
        setUpiId('');
        setCardNumber(''); setCardExpiry(''); setCardCvv(''); setCardName('');
        setSelectedBank('');
        setMethodError('');
      }, 2500);
    }, 1800);
  };

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) return raw.slice(0, 2) + '/' + raw.slice(2);
    return raw;
  };

  const handlePlaceOrder = async () => {
    setErrorMsg('');
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before placing an order.');
      return;
    }
    if (total > balance) {
      setErrorMsg(`Insufficient wallet balance. Your balance is ₹${balance.toFixed(2)} but total is ₹${total}.`);
      return;
    }
    if (!userId) {
      setErrorMsg('User session not found. Please login again.');
      return;
    }

    setIsPlacingOrder(true);

    // Detect meal type from categories
    const categories = [...new Set(cart.map(i => i.category))];
    let mealType = 'Snacks';
    if (categories.includes('Lunch')) mealType = 'Lunch';
    else if (categories.includes('Breakfast')) mealType = 'Breakfast';
    else if (categories.includes('Dinner')) mealType = 'Dinner';

    const orderPayload = {
      user: userId,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalAmount: total,
      mealType,
      paymentMode: 'Wallet',
      status: 'Placed',
    };

    try {
      const res = await fetch(`${API}/canteen/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();

      if (res.ok) {
        // Deduct wallet
        const newBalance = parseFloat((balance - total).toFixed(2));
        setBalance(newBalance);
        localStorage.setItem('canteenBalance', newBalance.toString());

        // Clear cart and show receipt
        setCart([]);
        setSuccessOrder(data);

        // Refresh recent orders
        if (userId) {
          fetch(`${API}/canteen/orders/${userId}`)
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setRecentOrders(d); })
            .catch(() => {});
        }
      } else {
        setErrorMsg(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Could not connect to server. Please check your connection.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];
  const filteredMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === selectedCategory);

  const statusColor: Record<string, string> = {
    Placed: 'bg-blue-50 text-blue-700',
    Preparing: 'bg-yellow-50 text-yellow-700',
    Ready: 'bg-purple-50 text-purple-700',
    Delivered: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2 flex items-center gap-3">
              <Coffee size={32} /> Canteen Service
            </h1>
            <p className="text-[#87CEEB] opacity-90">Order your meals and snacks online</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 flex items-center gap-3">
              <Wallet size={24} className="text-[#87CEEB]" />
              <div>
                <p className="text-sm text-[#87CEEB] mb-0.5">Wallet Balance</p>
                <p className="text-2xl font-bold">₹{balance.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => setShowRecharge(true)}
              className="bg-green-400 hover:bg-green-300 text-green-900 font-bold px-5 py-4 rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-green-500/20 whitespace-nowrap"
            >
              <PlusCircle size={20} /> Recharge
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0B4DA2] text-white shadow-lg shadow-blue-200'
                : 'bg-white text-[#1B254B] border border-gray-200 hover:border-[#0B4DA2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          {loadingMenu ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-[#0B4DA2]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map(item => {
                const qty = getQty(item._id);
                return (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(11,77,162,0.1)' }}
                    className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-[#0B4DA2]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${item.isVeg !== false ? 'border-green-600 bg-green-500' : 'border-red-600 bg-red-500'}`} />
                          <h4 className="text-[#1B254B] font-bold text-sm">{item.name}</h4>
                        </div>
                        {item.description && (
                          <p className="text-xs text-[#A3AED0] leading-snug">{item.description}</p>
                        )}
                      </div>
                      <p className="font-bold text-[#0B4DA2] text-base flex-shrink-0">₹{item.price}</p>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full mt-3 bg-[#0B4DA2] text-white py-2.5 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between mt-3 bg-[#F4F7FE] rounded-xl p-1">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all text-[#0B4DA2]"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-[#1B254B] text-base">{qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-9 h-9 bg-[#0B4DA2] text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-fit sticky top-6">
          <h3 className="text-[#1B254B] mb-4 flex items-center gap-2 font-bold">
            <ShoppingCart size={20} /> Your Order
            {cart.length > 0 && (
              <span className="ml-auto bg-[#0B4DA2] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </h3>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#A3AED0]">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
              <p className="text-xs mt-1">Add items from the menu</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#1B254B] truncate">{item.name}</p>
                      <p className="text-xs text-[#A3AED0]">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-[#1B254B] w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 bg-[#0B4DA2] text-white rounded-lg flex items-center justify-center hover:bg-[#042A5B] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3AED0]">Subtotal</span>
                  <span className="font-semibold text-[#1B254B]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3AED0]">GST (5%)</span>
                  <span className="font-semibold text-[#1B254B]">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-bold text-[#1B254B]">Total</span>
                  <span className="font-bold text-[#0B4DA2] text-lg">₹{total.toFixed(2)}</span>
                </div>

                {total > balance && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-2">
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-600">Insufficient wallet balance (₹{balance.toFixed(2)})</p>
                  </div>
                )}

                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                    >
                      <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">{errorMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || total > balance}
                  className="w-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
                  ) : (
                    <><CreditCard size={18} /> Place Order</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4 flex items-center gap-2 font-bold">
          <Clock size={20} /> Recent Orders
        </h3>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-[#A3AED0]">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet. Place your first order!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 10).map(order => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#1B254B] text-sm">{order._id.slice(-8).toUpperCase()}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#A3AED0] truncate">
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </p>
                  <p className="text-xs text-[#A3AED0] mt-0.5">{new Date(order.date).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-[#1B254B]">₹{order.totalAmount.toFixed(2)}</p>
                  <button
                    onClick={() => window.open(`${API}/pdf/canteen/${order._id}`, '_blank')}
                    className="mt-1 flex items-center gap-1 text-xs text-[#0B4DA2] hover:text-[#042A5B] font-semibold transition-colors"
                  >
                    <Download size={12} /> Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Recharge Wallet Modal ─── */}
      <AnimatePresence>
        {showRecharge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isRecharging) { setShowRecharge(false); setRechargeAmount(''); setMethodError(''); } }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative sticky top-0 z-10">
                {!isRecharging && !rechargeSuccess && (
                  <button
                    onClick={() => { setShowRecharge(false); setRechargeAmount(''); setMethodError(''); }}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-xl p-1.5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Wallet size={26} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Recharge Wallet</h2>
                    <p className="text-green-100 text-sm">Current Balance: ₹{balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {rechargeSuccess ? (
                    /* ── SUCCESS SCREEN ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                      >
                        <CheckCircle size={52} className="text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#1B254B] mb-1">Recharge Successful! 🎉</h3>
                      <p className="text-[#A3AED0] text-sm mb-3">₹{rechargedAmt.toFixed(2)} added to your wallet via {rechargeMethod.toUpperCase()}</p>
                      <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-4 inline-block">
                        <p className="text-xs text-green-600 mb-1">New Wallet Balance</p>
                        <p className="text-3xl font-bold text-green-600">₹{balance.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── FORM ── */
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {/* Quick Amount Presets */}
                      <p className="text-sm font-semibold text-[#1B254B] mb-2">Quick Add</p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[100, 200, 500, 1000].map(amt => (
                          <button
                            key={amt}
                            onClick={() => setRechargeAmount(amt.toString())}
                            className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                              rechargeAmount === amt.toString()
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-[#1B254B] hover:border-green-400'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <p className="text-sm font-semibold text-[#1B254B] mb-2">Or Enter Amount</p>
                      <div className="relative mb-5">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] font-bold text-lg">₹</span>
                        <input
                          type="number"
                          min={10}
                          max={10000}
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          placeholder="Enter amount (₹10 – ₹10,000)"
                          className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] font-semibold text-lg transition-all"
                        />
                      </div>

                      {/* Payment Method Tabs */}
                      <p className="text-sm font-semibold text-[#1B254B] mb-2">Payment Method</p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { id: 'upi' as const, label: 'UPI', icon: Smartphone },
                          { id: 'card' as const, label: 'Debit/Credit Card', icon: CreditCard },
                          { id: 'netbanking' as const, label: 'Net Banking', icon: Globe },
                        ].map(m => (
                          <button
                            key={m.id}
                            onClick={() => { setRechargeMethod(m.id); setMethodError(''); }}
                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                              rechargeMethod === m.id
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 text-[#A3AED0] hover:border-green-300'
                            }`}
                          >
                            <m.icon size={18} />
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* ── UPI Fields ── */}
                      <AnimatePresence mode="wait">
                        {rechargeMethod === 'upi' && (
                          <motion.div key="upi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 mb-4">
                            <div>
                              <label className="text-xs font-semibold text-[#1B254B] mb-1 block">UPI ID</label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="yourname@upi"
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] text-sm transition-all"
                              />
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                              📱 Supported: GPay, PhonePe, Paytm, BHIM, Amazon Pay UPI
                            </div>
                          </motion.div>
                        )}

                        {/* ── Card Fields ── */}
                        {rechargeMethod === 'card' && (
                          <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 mb-4">
                            <div>
                              <label className="text-xs font-semibold text-[#1B254B] mb-1 block">Card Number</label>
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] text-sm font-mono tracking-wider transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-[#1B254B] mb-1 block">Cardholder Name</label>
                              <input
                                type="text"
                                value={cardName}
                                onChange={e => setCardName(e.target.value)}
                                placeholder="Name on card"
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] text-sm transition-all"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-semibold text-[#1B254B] mb-1 block">Expiry (MM/YY)</label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] text-sm font-mono transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-[#1B254B] mb-1 block">CVV</label>
                                <input
                                  type="password"
                                  value={cardCvv}
                                  onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                                  placeholder="•••"
                                  maxLength={4}
                                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl outline-none text-[#1B254B] text-sm font-mono transition-all"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Net Banking ── */}
                        {rechargeMethod === 'netbanking' && (
                          <motion.div key="netbanking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 mb-4">
                            <div>
                              <label className="text-xs font-semibold text-[#1B254B] mb-1 block">Select Your Bank</label>
                              <div className="grid grid-cols-3 gap-2">
                                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                                  <button
                                    key={bank}
                                    onClick={() => setSelectedBank(bank)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                                      selectedBank === bank
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-[#1B254B] hover:border-green-400'
                                    }`}
                                  >
                                    {bank}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {selectedBank && (
                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                                🏦 You will be redirected to {selectedBank} Net Banking portal to complete payment
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error */}
                      {methodError && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-3">
                          <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-red-600">{methodError}</p>
                        </div>
                      )}

                      {/* Recharge Button */}
                      <button
                        onClick={handleRecharge}
                        disabled={isRecharging || !rechargeAmount || parseFloat(rechargeAmount) <= 0 || parseFloat(rechargeAmount) > 10000}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRecharging ? (
                          <><Loader2 size={18} className="animate-spin" /> Processing Payment...</>
                        ) : (
                          <><Zap size={18} /> Recharge ₹{rechargeAmount ? parseFloat(rechargeAmount).toFixed(2) : '0.00'}</>
                        )}
                      </button>
                      <p className="text-xs text-center text-[#A3AED0] mt-3">🔒 256-bit encrypted · Instant wallet credit</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Success Receipt Modal ─── */}
      <AnimatePresence>
        {successOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSuccessOrder(null); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] p-6 text-white relative">
                <button
                  onClick={() => setSuccessOrder(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-xl p-1.5 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Order Placed!</h2>
                    <p className="text-[#87CEEB] text-sm">Your order has been received</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 mt-3 text-sm">
                  <span className="text-[#87CEEB]">Order ID:</span>
                  <span className="font-mono font-bold ml-2">{successOrder._id.slice(-10).toUpperCase()}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="space-y-2 mb-5">
                  {successOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#1B254B]">{item.name} <span className="text-[#A3AED0]">×{item.quantity}</span></span>
                      <span className="font-semibold text-[#1B254B]">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3AED0]">Subtotal</span>
                    <span className="text-[#1B254B]">₹{(successOrder.totalAmount / 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3AED0]">GST (5%)</span>
                    <span className="text-[#1B254B]">₹{(successOrder.totalAmount - successOrder.totalAmount / 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold text-[#1B254B]">Total Paid</span>
                    <span className="font-bold text-[#0B4DA2] text-lg">₹{successOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3AED0]">Payment</span>
                    <span className="font-semibold text-[#1B254B]">{successOrder.paymentMode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3AED0]">Wallet After</span>
                    <span className="font-semibold text-green-600">₹{balance.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => window.open(`${API}/pdf/canteen/${successOrder._id}`, '_blank')}
                    className="flex-1 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download PDF Bill
                  </button>
                  <button
                    onClick={() => setSuccessOrder(null)}
                    className="px-5 py-3 bg-gray-100 text-[#1B254B] rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
