'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X, Trash2, Phone } from 'lucide-react';
import { products } from '@/data/product';
import Image from 'next/image';
import wigImage from '@/app/wig.jpg'; // Ensure this path is correct in your project
import Link from 'next/link';

// --- HELPER: WHATSAPP FORMATTER ---
const sendToWhatsApp = (cart) => {
  const phoneNumber = '2349018065008';

  if (cart.length === 0) return;

  let message = 'Hello, I would like to order the following wigs:\n\n';
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    // Format: 1x Color Name - #Price
    message += `${item.quantity}x ${item.color} ${
      item.name
    } - #${item.price.toLocaleString()}\n`;
  });

  message += `\n*Total Amount: #${total.toLocaleString()}*`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, '_blank');
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // --- LOCAL STORAGE LOGIC ---
  useEffect(() => {
    const savedCart = localStorage.getItem('wigCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wigCart', JSON.stringify(cart));
  }, [cart]);

  // --- CART FUNCTIONS ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='min-h-screen bg-gray-50 text-gray-800 font-sans relative'>
      {/* --- NAVBAR --- */}
      <nav className='bg-white shadow-sm sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <h1 className='text-xl sm:text-2xl font-bold text-pink-600 tracking-tight truncate'>
            Teees Beauty💅
          </h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className='relative p-2 hover:bg-gray-100 rounded-full transition'>
            <ShoppingBag className='w-6 h-6' />
            {cart.length > 0 && (
              <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-600 rounded-full'>
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- CART SIDEBAR & BLUR OVERLAY --- */}
      {isCartOpen && (
        <>
          {/* UPDATED OVERLAY:
            - bg-black/20: lighter dark tint
            - backdrop-blur-sm: adds the blur effect to the background content 
          */}
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300'
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className='fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform transform duration-300 animate-in slide-in-from-right'>
            <div className='p-4 flex justify-between items-center border-b'>
              <h2 className='text-lg font-bold'>Your Bag</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className='p-2 hover:bg-gray-100 rounded-full'>
                <X className='w-6 h-6 text-gray-500 hover:text-red-500' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {cart.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-4'>
                  <ShoppingBag className='w-12 h-12 opacity-20' />
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm'>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-sm line-clamp-1'>
                        {item.name}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {item.color}
                      </span>
                      <span className='text-pink-600 font-bold text-sm'>
                        #{item.price.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-bold bg-white px-2 py-1 rounded border'>
                        x{item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className='text-gray-400 hover:text-red-500 p-1 hover:bg-gray-200 rounded transition'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='p-4 border-t bg-gray-50 safe-area-bottom'>
              <div className='flex justify-between mb-4 font-bold text-lg'>
                <span>Total:</span>
                <span>#{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => sendToWhatsApp(cart)}
                disabled={cart.length === 0}
                className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-[0.98]'>
                <Phone className='w-5 h-5' />
                Pay on WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- HERO SECTION --- */}
      {/* Updated height to min-h-[500px] for better mobile responsiveness */}
      <section className='relative bg-pink-100 min-h-[500px] flex items-center justify-center text-center px-4 py-12'>
        <div className='max-w-3xl w-full'>
          <h2 className='text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight'>
            Crown Yourself with{' '}
            <span className='text-pink-600'>Confidence</span>
          </h2>
          <p className='text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto'>
            Premium quality wigs for every shade of you. Shop our latest
            collection today.
          </p>
          <Link
            href='#shop'
            className='inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-pink-600 hover:shadow-lg transition transform hover:-translate-y-1'>
            Shop Now
          </Link>
        </div>
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section
        id='shop'
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h3 className='text-3xl font-bold text-gray-900 mb-10 text-center'>
          Our Collection
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col'>
              <div className='h-64 bg-gray-200 relative group'>
                <Image
                  src={wigImage}
                  alt={product.name}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
              <div className='p-6 flex flex-col flex-1'>
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex-1 mr-2'>
                    <h4 className='text-lg font-bold text-gray-900 line-clamp-1'>
                      {product.name}
                    </h4>
                    <p className='text-sm text-gray-500'>{product.color}</p>
                  </div>
                  <span className='text-lg font-bold text-pink-600 whitespace-nowrap'>
                    #{product.price.toLocaleString()}
                  </span>
                </div>
                <p className='text-gray-600 text-sm mb-4 line-clamp-2 flex-1'>
                  {product.desc}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition text-sm font-bold shadow-sm'>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- PAGINATION --- */}
        <div className='flex justify-center mt-12 space-x-2'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border font-medium transition ${
                currentPage === i + 1
                  ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <footer className='bg-gray-900 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h3 className='text-2xl font-bold mb-6'>Contact Us</h3>
          <p className='text-gray-400 mb-8 max-w-md mx-auto'>
            Have questions about an order or customization? Reach out to us
            directly.
          </p>
          <div className='flex justify-center items-center gap-4'>
            <div className='bg-gray-800 p-4 rounded-lg flex items-center gap-3 shadow-lg border border-gray-700'>
              <Phone className='text-green-400 w-6 h-6' />
              <span className='text-lg sm:text-xl font-mono tracking-wider'>
                0916 486 1760
              </span>
            </div>
          </div>
          <div className='mt-12 text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} Teees Beauty. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
