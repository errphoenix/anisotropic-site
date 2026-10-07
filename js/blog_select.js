const blogSelectorMap = new Map();
blogSelectorMap.set("razed_cage1", "blog/razed-art1-cage");

const blogView = document.getElementById("blog-view");

async function loadArticle(url, push = true) {
  const resp = await fetch(url);
  if (!resp.ok) return;

  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const article = doc.getElementById("blog-content");

  if (!article) return;

  blogView.replaceChildren(article);

  document
    .querySelectorAll(".tree-link.active")
    .forEach((e) => e.classList.remove("active"));
  const active = document.querySelector(`.tree-link[href="${url}"]`);
  active?.classList.add("active");

  if (push) history.pushState({ url }, "", url);

  blogView.scrollTop = 0;

  renderMathInElement(article, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
}

document.addEventListener("click", (ev) => {
  const link = ev.target.closest("a.tree-link");
  if (!link) return;
  ev.preventDefault();
  loadArticle(link.href);
});
