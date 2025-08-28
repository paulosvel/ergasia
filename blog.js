document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-posts-container");

  fetch("http://localhost:5000/api/blog")
    .then(res => res.json())
    .then(posts => {
      if (!posts.length) {
        container.innerHTML = "<p>No posts yet.</p>";
        return;
      }

      posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");

        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p><em>by ${post.author} on ${new Date(post.createdAt).toLocaleDateString()}</em></p>
          ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image">` : ""}
          <p>${post.content}</p>
        `;

        container.appendChild(postElement);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Failed to load posts.</p>";
    });
});
