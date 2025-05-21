document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("api/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "index.html";
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await fetch("api/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (data.success) {
          alert("Registration successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration");
      }
    });
  }
});

// Handle user authentication state across all pages
function initializeAuth() {
  const authLinks = document.getElementById("authLinks");
  const userMenu = document.getElementById("userMenu");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userMenuDropdown = document.getElementById("userMenuDropdown");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  // Only proceed with menu setup if the elements exist
  if (userMenuBtn && userMenuDropdown) {
    const chevronIcon = userMenuBtn.querySelector("i");
    let isMenuOpen = false;

    // Toggle menu function with smooth transitions
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;

      // Add transition classes
      userMenuDropdown.style.transition = "all 0.2s ease-in-out";
      chevronIcon.style.transition = "transform 0.2s ease-in-out";

      if (isMenuOpen) {
        // Show menu with animation
        userMenuDropdown.classList.remove("scale-95", "opacity-0", "invisible");
        userMenuDropdown.classList.add("scale-100", "opacity-100", "visible");
        chevronIcon.style.transform = "rotate(180deg)";

        // Add active state to button
        userMenuBtn.classList.add("text-orange-500");
      } else {
        // Hide menu with animation
        userMenuDropdown.classList.remove(
          "scale-100",
          "opacity-100",
          "visible"
        );
        userMenuDropdown.classList.add("scale-95", "opacity-0", "invisible");
        chevronIcon.style.transform = "rotate(0deg)";

        // Remove active state from button
        userMenuBtn.classList.remove("text-orange-500");
      }
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !userMenu.contains(e.target)) {
        toggleMenu();
      }
    });

    // Toggle menu on button click with event delegation
    userMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Handle menu item clicks
    userMenuDropdown.addEventListener("click", (e) => {
      const target = e.target.closest("a");
      if (target) {
        // Add click animation
        target.classList.add("bg-orange-50");
        setTimeout(() => {
          target.classList.remove("bg-orange-50");
        }, 200);

        // Close menu after click
        if (isMenuOpen) {
          toggleMenu();
        }
      }
    });
  }

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // User is logged in
    if (authLinks) authLinks.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
    if (userName) userName.textContent = user.name;

    // Add logout handler
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLogout();
      });
    }
  } else {
    // User is not logged in
    if (authLinks) authLinks.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
  }
}

// Separate logout function that can be called from anywhere
function handleLogout() {
  // Add fade out animation to menu before logout
  const userMenu = document.getElementById("userMenu");
  if (userMenu) {
    userMenu.style.transition = "opacity 0.2s ease-out";
    userMenu.style.opacity = "0";
  }

  // Delay logout to allow animation to complete
  setTimeout(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  }, 200);
}

// Initialize auth when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeAuth);
