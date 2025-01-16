// cartStorage.js
export const saveCartToLocalStorage = (email, cart) => {
    try {
      const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
      allCarts[email] = cart;
      localStorage.setItem('userCarts', JSON.stringify(allCarts));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };
  
  export const getCartFromLocalStorage = (email) => {
    try {
      const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
      return allCarts[email] || [];
    } catch (error) {
      console.error('Error getting cart from localStorage:', error);
      return [];
    }
  };
  
  export const addItemToCart = (email, productId, quantity) => {
    try {
      const cart = getCartFromLocalStorage(email);
      const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }
  
      saveCartToLocalStorage(email, cart);
      return cart;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return [];
    }
  };
  
  export const removeItemFromCart = (email, productId) => {
    try {
      const cart = getCartFromLocalStorage(email);
      const updatedCart = cart.filter(item => item.productId !== productId);
      saveCartToLocalStorage(email, updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return [];
    }
  };
  
  export const updateItemQuantity = (email, productId, quantity) => {
    try {
      const cart = getCartFromLocalStorage(email);
      const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = quantity;
        saveCartToLocalStorage(email, cart);
      }
  
      return cart;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return [];
    }
  };