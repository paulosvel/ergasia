window.addEventListener("DOMContentLoaded", () => {
  // 🌗 Dark Mode Toggle
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;

  if (toggleBtn) {
    if (localStorage.getItem("darkMode") === "enabled") {
      body.classList.add("dark");
    }

    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem(
        "darkMode",
        body.classList.contains("dark") ? "enabled" : "disabled"
      );
    });
  }

  // 💬 Blog Comment System
  const commentSections = document.querySelectorAll(".comments-section");
  commentSections.forEach((section) => {
    const form = section.querySelector(".commentForm");
    const container = section.querySelector(".commentsContainer");
    const postId = section.getAttribute("data-post-id");
    const storageKey = `comments-${postId}`;
    const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
    savedComments.forEach((comment) =>
      addCommentToDOM(comment, container, storageKey)
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("input").value.trim();
      const text = form.querySelector("textarea").value.trim();
      if (name && text) {
        const comment = {
          name,
          text,
          timestamp: new Date().toISOString(),
        };
        addCommentToDOM(comment, container, storageKey);
        saveComment(comment, storageKey);
        form.reset();
      }
    });
  });

  function addCommentToDOM(comment, container, storageKey) {
    const box = document.createElement("div");
    box.className = "comment";
    box.innerHTML = `
      <strong>${comment.name}</strong>
      <small>${new Date(comment.timestamp).toLocaleString()}</small>
      <p>${comment.text}</p>
      <button class="delete-comment">Delete</button>
    `;
    box.querySelector("button").addEventListener("click", () => {
      box.remove();
      deleteComment(comment, storageKey);
    });
    container.appendChild(box);
  }

  function saveComment(comment, key) {
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(comment);
    localStorage.setItem(key, JSON.stringify(existing));
  }

  function deleteComment(commentToDelete, key) {
    let existing = JSON.parse(localStorage.getItem(key)) || [];
    existing = existing.filter(
      (c) =>
        !(
          c.name === commentToDelete.name &&
          c.text === commentToDelete.text &&
          c.timestamp === commentToDelete.timestamp
        )
    );
    localStorage.setItem(key, JSON.stringify(existing));
  }

  // 📈 Stats Count-Up Animation
  const statNumbers = document.querySelectorAll(".stat-number");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.getAttribute("data-target");
          let count = 0;
          const speed = target < 100 ? 20 : 5;
          const update = () => {
            count += 1;
            if (count <= target) {
              el.textContent = count;
              setTimeout(update, speed);
            } else {
              el.textContent = target;
            }
          };
          update();
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.6 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));

  // 🎞️ Image Slider with Autoplay
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slider-track .slide");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const slider = document.querySelector(".image-slider");
  let currentIndex = 0;

  function updateSlider() {
    if (slides.length) {
      const width = slider.clientWidth;
      sliderTrack.style.transform = `translateX(-${currentIndex * width}px)`;
    }
  }

  if (rightArrow && leftArrow && sliderTrack && slides.length) {
    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();

    let autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }, 4000);

    slider.addEventListener("mouseenter", () =>
      clearInterval(autoPlayInterval)
    );
    slider.addEventListener("mouseleave", () => {
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      }, 4000);
    });
  }

  // 🔐 Backend-based Authentication Handling
  async function checkAuthStatus() {
    try {
      const response = await fetch("http://localhost:5000/api/auth/status", {
        method: "GET",
        credentials: "include", // Include cookies for session management
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        const navLinks = document.querySelector(".nav-links");

        if (user && navLinks) {
          // Update navigation for logged-in user
          const existingLogout = document.getElementById("logoutBtn");
          if (!existingLogout) {
            const logoutItem = document.createElement("li");
            logoutItem.innerHTML = '<a href="#" id="logoutBtn">Logout</a>';
            navLinks.appendChild(logoutItem);

            const loginLink = navLinks.querySelector('a[href="login.html"]');
            if (loginLink && loginLink.parentElement) {
              loginLink.parentElement.remove();
            }

            document
              .getElementById("logoutBtn")
              .addEventListener("click", async () => {
                try {
                  await fetch("http://localhost:5000/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  window.location.reload();
                } catch (err) {
                  console.error("Logout failed:", err);
                  window.location.reload();
                }
              });
          }

          // 👑 Show Add Project link for admin users
          const addProjectLink = document.getElementById("addProjectLink");
          console.log("🔍 User data:", user);
          console.log("🔍 User role:", user.role);

          if (addProjectLink && user.role === "admin") {
            console.log("✅ Showing Add Project link for admin user");
            addProjectLink.style.display = "block";
          } else {
            console.log("❌ User is not admin or role not found");
          }
        }
      } else {
        console.log("User not authenticated");
      }
    } catch (err) {
      console.warn("Authentication check failed:", err);
    }
  }

  // Check authentication status on page load
  checkAuthStatus();
});
