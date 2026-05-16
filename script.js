document.addEventListener("DOMContentLoaded", () => {
  // Application State Variable
  let cart = [];

  // Select DOM nodes
  const cartCountBadge = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalDisplay = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  // Click listener registration on products
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));

      addItemToCart(id, name, price);
    });
  });

  // Append items or increase quantities
  function addItemToCart(id, name, price) {
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    updateCartUI();
  }

  // Recalculates total cost and items layout
  function updateCartUI() {
    // 1. Refresh global badge counter
    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountBadge.textContent = totalItemsCount;

    // 2. Refresh target itemized lists layout mapping
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-muted text-center my-5 empty-msg">Your shopping cart is currently empty.</p>`;
      checkoutBtn.disabled = true;
      cartTotalDisplay.textContent = "$0.00";
      return;
    }

    checkoutBtn.disabled = false;
    cartItemsContainer.innerHTML = ""; // Wipe container clean before re-evaluation

    let aggregatedTotal = 0;

    cart.forEach((item) => {
      const rowCost = item.price * item.quantity;
      aggregatedTotal += rowCost;

      const cartItemDiv = document.createElement("div");
      cartItemDiv.className =
        "d-flex justify-content-between align-items-center mb-3 border-bottom pb-2";
      cartItemDiv.innerHTML = `
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-primary">$${rowCost.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger px-2 py-1 remove-btn" data-id="${item.id}">
                        <i class="fa-solid fa-trash-can fa-xs"></i>
                    </button>
                </div>
            `;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalDisplay.textContent = `$${aggregatedTotal.toFixed(2)}`;

    // Attach listeners dynamically to fresh remove elements
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-btn");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-id");
        removeItemFromCart(targetId);
      });
    });
  }

  // Handles item eviction from state
  function removeItemFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
  }

  // Simulated Checkout Actions
  checkoutBtn.addEventListener("click", () => {
    alert(
      "Thank you for your order! Processing your structural checkout mockup scenario...",
    );
    cart = [];
    updateCartUI();

    // programmatically dismiss the opened offcanvas cart modal overlay
    const openCanvasNode = document.getElementById("cartSidebar");
    const instance = bootstrap.Offcanvas.getInstance(openCanvasNode);
    if (instance) instance.hide();
  });
});
