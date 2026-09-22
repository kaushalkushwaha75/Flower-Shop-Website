/**
 * Happy Petals - Unified E-Commerce & Cart Engine
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'hp_cart';
  const USER_STORAGE_KEY = 'hp_user';

  // --- Cart Operations ---
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id || (i.name === item.name && i.price === item.price));

    if (existingIndex > -1) {
      cart[existingIndex].qty += item.qty || 1;
    } else {
      cart.push({
        id: item.id || 'item_' + Date.now(),
        name: item.name,
        price: Number(item.price),
        img: item.img || 'images/featured1.png',
        qty: item.qty || 1
      });
    }

    saveCart(cart);
    showToast(`Added <strong>${item.name}</strong> to your basket!`, 'glyphicon-ok');
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter((i) => i.id !== id);
    saveCart(cart);
  }

  function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart);
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartUI();
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  function getCartTotal() {
    return getCart().reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
  }

  // --- Toast Notification ---
  function ensureToastElement() {
    let toast = document.getElementById('flowerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'flowerToast';
      toast.className = 'flower-toast';
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(messageHtml, iconClass = 'glyphicon-heart') {
    const toast = ensureToastElement();
    toast.innerHTML = `
      <span class="glyphicon ${iconClass}" style="color: var(--primary-color); font-size: 18px;"></span>
      <div style="flex-grow:1; font-size:14px;">${messageHtml}</div>
      <a href="checkout.html" class="btn btn-xs btn-primary-gradient" style="margin-left:8px;">View Cart</a>
    `;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // --- UI Synchronizer ---
  function updateCartUI() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach((el) => {
      el.textContent = count;
    });

    // If popovers are used, update their content attribute
    document.querySelectorAll('[data-cart-popover]').forEach((el) => {
      el.setAttribute('data-content', count === 0 ? 'Basket is empty' : `${count} item(s) in basket`);
    });
  }

  // --- Authentication State Sync ---
  function updateAuthUI() {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    } catch (e) {}

    const authContainer = document.querySelector('.top-auth-container');
    if (!authContainer) return;

    if (user && user.email) {
      const displayName = user.name || user.email.split('@')[0];
      authContainer.innerHTML = `
        <span class="user-auth-badge">
          <i class="fa fa-user-circle" style="color: var(--primary-color);"></i>
          <span>Hello, <strong>${displayName}</strong></span>
          <a class="logout-link" href="#" id="hpLogoutBtn">(Sign Out)</a>
        </span>
      `;
      const logoutBtn = document.getElementById('hpLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem(USER_STORAGE_KEY);
          updateAuthUI();
          showToast('You have signed out', 'glyphicon-info-sign');
        });
      }
    } else {
      authContainer.innerHTML = `
        <a href="registration.html"><i class="fa fa-user-plus"></i> Register</a>
        <span style="color:#d5d0cb">|</span>
        <a href="login.html"><i class="fa fa-sign-in"></i> Sign In</a>
      `;
    }
  }

  // --- Global Event Listener Binding ---
  function bindAddToCartButtons() {
    document.querySelectorAll('.btn-add-cart, .btn-local').forEach((btn) => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('data-id') || 'item_' + Date.now();
        const name = this.getAttribute('data-name') || this.closest('.products-detail, .featured-detail')?.querySelector('h3, a')?.textContent?.trim() || 'Flower Bouquet';
        const price = Number(this.getAttribute('data-price')) || 49;
        const img = this.getAttribute('data-img') || this.closest('.products-detail, .featured-detail')?.querySelector('img')?.getAttribute('src') || 'images/featured1.png';

        addToCart({ id, name, price, img, qty: 1 });
      });
    });
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateAuthUI();
    bindAddToCartButtons();

    // Global search handler
    const searchForm = document.querySelector('.form-search-header');
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = (this.querySelector('input')?.value || '').trim().toLowerCase();
        if (!q) return;

        // If on homepage or special page, filter products live
        const productCards = document.querySelectorAll('.products-detail, .featured-detail');
        if (productCards.length > 0) {
          let foundCount = 0;
          productCards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            if (text.includes(q)) {
              card.parentElement.style.display = '';
              foundCount++;
            } else {
              card.parentElement.style.display = 'none';
            }
          });
          showToast(`Found ${foundCount} item(s) matching "${q}"`, 'glyphicon-search');
        } else {
          // Redirect to index with query
          window.location.href = 'index.html?search=' + encodeURIComponent(q);
        }
      });
    }

    // Check URL params for search filter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      const q = searchParam.toLowerCase();
      const productCards = document.querySelectorAll('.products-detail, .featured-detail');
      productCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(q)) {
          card.parentElement.style.display = '';
        } else {
          card.parentElement.style.display = 'none';
        }
      });
    }
  });

  // Expose API globally
  window.FlowerShop = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartCount,
    getCartTotal,
    showToast,
    updateCartUI,
    updateAuthUI,
    bindAddToCartButtons
  };
})();
