console.log("READING create-post.js");

async function newPostHandler(e) {
  e.preventDefault();

  const title = document.querySelector("#input-title").value.trim();
  const content = document.querySelector("#input-content").value.trim();

  const response = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .getElementById("new-post-form")
  .addEventListener("submit", newPostHandler);
