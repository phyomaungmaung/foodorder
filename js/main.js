document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const closeCart = document.getElementById("closeCart");
  const flyCart = document.getElementById("flyCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const menuItems = document.getElementById("menuItems");
  const authLinks = document.getElementById("authLinks");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check user login status
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // User is logged in
    authLinks.classList.add("hidden");
    userMenu.classList.remove("hidden");
    userName.textContent = user.name;

    // Add logout handler
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.location.reload();
    });
  } else {
    // User is not logged in
    authLinks.classList.remove("hidden");
    userMenu.classList.add("hidden");
  }

  // Toggle cart visibility
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    flyCart.classList.remove("translate-x-full");
  });

  closeCart.addEventListener("click", () => {
    flyCart.classList.add("translate-x-full");
  });

  // Load menu items
  // async function loadMenuItems() {
  //   try {
  //     const response = await fetch("api/get_menu.php");
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const items = await response.json();

  //     if (!items || items.length === 0) {
  //       menuItems.innerHTML = `
  //         <div class="col-span-full text-center py-8">
  //           <p class="text-gray-500 text-lg">No menu items available at the moment.</p>
  //         </div>
  //       `;
  //       return;
  //     }

  //     menuItems.innerHTML = items
  //       .map((item) => {
  //         // Convert price to number and handle potential invalid values
  //         const price = parseFloat(item.price) || 0;
  //         return `
  //               <div class="bg-white rounded-lg shadow-md overflow-hidden relative">
  //                   <img src="${item.image}" alt="${
  //           item.name
  //         }" class="w-full h-48 object-cover">
  //                   <div class="p-4">
  //                       <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
  //                       <h2 class="text-lg font-semibold mb-2 absolute top-2 left-2 bg-white px-2 py-1 rounded-md">${
  //                         item.category
  //                       }</h2>
  //                       <p class="text-gray-600 mb-4">${item.description}</p>
  //                       <div class="flex justify-between items-center">
  //                           <span class="text-xl font-bold text-orange-500">${price.toFixed(
  //                             2
  //                           )} MMK</span>
  //                           <button onclick="addToCart(${item.id})"
  //                               class="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
  //                               Add to Cart
  //                           </button>
  //                       </div>
  //                   </div>
  //               </div>
  //           `;
  //       })
  //       .join("");
  //   } catch (error) {
  //     console.error("Error loading menu items:", error);
  //     menuItems.innerHTML = `
  //       <div class="col-span-full text-center py-8">
  //         <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  //           <strong class="font-bold">Error!</strong>
  //           <span class="block sm:inline"> Failed to load menu items. Please try again later.</span>
  //         </div>
  //       </div>
  //     `;
  //   }
  // }

  let allMenuItems = [];

  async function loadMenuItems() {
    try {
      const response = await fetch("api/get_menu.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const items = await response.json();
      allMenuItems = items;

      if (!items || items.length === 0) {
        menuItems.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-gray-500 text-lg">No menu items available at the moment.</p>
        </div>
      `;
        return;
      }

      setupCategoryFilters(items);
      displayFilteredItems(allMenuItems); // Show all items by default
    } catch (error) {
      console.error("Error loading menu items:", error);
      menuItems.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> Failed to load menu items. Please try again later.</span>
        </div>
      </div>
    `;
    }
  }

  function setupCategoryFilters(items) {
    const categoryFilters = document.getElementById("categoryFilters");

    // Get unique categories
    const categories = [...new Set(items.map((item) => item.category))];

    // Add category buttons
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className =
        "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300";
      button.textContent = category;
      button.dataset.category = category;
      button.addEventListener("click", filterByCategory);
      categoryFilters.appendChild(button);
    });

    // Add click handler for the "All Items" button
    const allItemsBtn = categoryFilters.querySelector('[data-category="all"]');
    allItemsBtn.addEventListener("click", filterByCategory);
  }

  function filterByCategory(e) {
    const category = e.target.dataset.category;

    // Update active button styling
    document.querySelectorAll("#categoryFilters button").forEach((btn) => {
      btn.classList.remove("bg-orange-500", "text-white", "active-filter");
      btn.classList.add("bg-gray-200", "text-gray-800");
    });

    e.target.classList.remove("bg-gray-200", "text-gray-800");
    e.target.classList.add("bg-orange-500", "text-white", "active-filter");

    // Filter items
    const filteredItems =
      category === "all"
        ? allMenuItems
        : allMenuItems.filter((item) => item.category === category);

    displayFilteredItems(filteredItems);
  }

  function displayFilteredItems(items) {
    if (items.length === 0) {
      menuItems.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-gray-500 text-lg">No items in this category.</p>
      </div>
    `;
      return;
    }

    menuItems.innerHTML = items
      .map((item) => {
        const price = parseFloat(item.price) || 0;
        return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden relative">
        <img src="${item.image}" alt="${
          item.name
        }" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
          <h2 class="text-lg font-semibold mb-2 absolute top-2 left-2 bg-white px-2 py-1 rounded-md">
            ${item.category}
          </h2>
          <p class="text-gray-600 mb-4">${item.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-orange-500">${price.toFixed(
              2
            )} MMK</span>
            <button onclick="addToCart(${item.id})" 
              class="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
      })
      .join("");
  }

  // Initialize when page loads
  document.addEventListener("DOMContentLoaded", loadMenuItems);

  // Add to cart function
  window.addToCart = async (itemId) => {
    try {
      const response = await fetch(`api/get_item.php?id=${itemId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.success && data.message) {
        throw new Error(data.message);
      }

      const item = data;
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Ensure price is a number
        const price = parseFloat(item.price) || 0;
        cart.push({
          id: item.id,
          name: item.name,
          price: price,
          image: item.image,
          quantity: 1,
        });
      }

      updateCart();
      flyCart.classList.remove("translate-x-full");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // Update cart display
  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    cartItems.innerHTML = cart
      .map((item) => {
        // Ensure price is a number
        const price = parseFloat(item.price) || 0;
        return `
            <div class="flex items-center space-x-4">
                <img src="${item.image}" alt="${
          item.name
        }" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-orange-500">${price.toFixed(2)} MMK</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity(${item.id}, ${
          item.quantity - 1
        })" 
                        class="text-gray-500 hover:text-gray-700">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${
          item.quantity + 1
        })" 
                        class="text-gray-500 hover:text-gray-700">+</button>
                </div>
            </div>
        `;
      })
      .join("");

    // Calculate total with proper number handling
    const total = cart.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
      0
    );
    cartTotal.textContent = `${total.toFixed(2)} MMK`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Update item quantity
  window.updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      cart = cart.filter((item) => item.id !== itemId);
    } else {
      const item = cart.find((item) => item.id === itemId);
      if (item) {
        item.quantity = newQuantity;
        // Ensure price is a number when updating
        item.price = parseFloat(item.price) || 0;
      }
    }
    updateCart();
  };

  // Checkout
  checkoutBtn.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to checkout");
      window.location.href = "login.html";
      return;
    }

    try {
      const response = await fetch("api/checkout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Order placed successfully!");
        cart = [];
        updateCart();
        window.location.href = `invoice.html?orderId=${data.orderId}`;
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout");
    }
  });

  // Initial load
  loadMenuItems();
  updateCart();
});
