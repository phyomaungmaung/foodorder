document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Update user name in navigation
  document.getElementById("userName").textContent = user.name;

  // Load user profile
  loadUserProfile();
  // Load order history
  loadOrderHistory();

  // Profile form submission
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await updateProfile();
    });

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  // Cart functionality (reused from main.js)
  const cartBtn = document.getElementById("cartBtn");
  const closeCart = document.getElementById("closeCart");
  const flyCart = document.getElementById("flyCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    flyCart.classList.remove("translate-x-full");
  });

  closeCart.addEventListener("click", () => {
    flyCart.classList.add("translate-x-full");
  });

  // Load user profile
  async function loadUserProfile() {
    try {
      const response = await fetch(`api/get_user.php?id=${user.id}`);
      if (!response.ok) throw new Error("Failed to load profile");

      const profile = await response.json();
      if (profile.success === false) throw new Error(profile.message);

      // Fill form with user data
      document.getElementById("name").value = profile.name;
      document.getElementById("email").value = profile.email;
      document.getElementById("phone").value = profile.phone || "";
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Failed to load profile information");
    }
  }

  // Update user profile
  async function updateProfile() {
    const formData = {
      id: user.id,
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
    };

    try {
      const response = await fetch("api/update_profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        // Update local storage
        user.name = formData.name;
        localStorage.setItem("user", JSON.stringify(user));

        // Update displayed name
        document.getElementById("userName").textContent = user.name;

        alert("Profile updated successfully!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  // Load order history
  async function loadOrderHistory() {
    try {
      const response = await fetch(`api/get_orders.php?userId=${user.id}`);
      console.log("API".response);
      if (!response.ok) throw new Error("Failed to load orders");

      const orders = await response.json();
      if (orders.success === false) throw new Error(orders.message);

      const orderList = document.getElementById("orderList");
      if (orders.length === 0) {
        orderList.innerHTML = `
                    <p class="text-gray-500 text-center py-4">No orders found</p>
                `;
        return;
      }

      orderList.innerHTML = orders
        .map(
          (order) => `
                <div class="border rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-semibold">Order #${order.id}</h3>
                            <p class="text-sm text-gray-500">${new Date(
                              order.created_at
                            ).toLocaleString()}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }">${order.status}</span>
                    </div>
                    <div class="space-y-2">
                        ${order.items
                          .map(
                            (item) => `
                            <div class="flex justify-between text-sm">
                                <span>${item.name} x${item.quantity} - (${
                              item.category
                            })</span>
                                <span>${(item.price * item.quantity).toFixed(
                                  2
                                )} MMK</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="mt-2 pt-2 border-t flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)} MMK</span>
                    </div>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Error loading orders:", error);
      document.getElementById("orderList").innerHTML = `
                <div class="text-red-500 text-center py-4">
                    Failed to load order history
                </div>
            `;
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  }

  // Update cart display (reused from main.js)
  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    cartItems.innerHTML = cart
      .map(
        (item) => `
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${
          item.name
        }" class="w-16 h-16 object-cover rounded">
                        <div class="flex-1">
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-orange-500">${item.price.toFixed(
                              2
                            )} MMK</p>
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
                `
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Update item quantity (reused from main.js)
  window.updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      cart = cart.filter((item) => item.id !== itemId);
    } else {
      const item = cart.find((item) => item.id === itemId);
      if (item) {
        item.quantity = newQuantity;
      }
    }
    updateCart();
  };

  // Initial cart update
  updateCart();
});
