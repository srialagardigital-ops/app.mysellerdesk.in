// Vercel Web Analytics Initialization
// This script initializes Vercel Web Analytics for the MySellerDesk dashboard

// Initialize the analytics queue
(function() {
  if (window.va) return;
  window.va = function a(...params) {
    if (!window.vaq) window.vaq = [];
    window.vaq.push(params);
  };
})();

// Load the Vercel Analytics script
(function() {
  // Check if we're in production mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Set the mode
  window.vam = isDevelopment ? 'development' : 'production';
  
  // Don't inject in development to avoid console warnings
  // Analytics will automatically work when deployed to Vercel
  if (!isDevelopment) {
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    script.onerror = function() {
      console.log('[Vercel Web Analytics] Script not loaded. Analytics will be enabled after deployment to Vercel.');
    };
    document.head.appendChild(script);
  } else {
    console.log('[Vercel Web Analytics] Running in development mode. Analytics will be enabled in production.');
  }
})();
