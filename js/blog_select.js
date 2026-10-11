const mapRazedSimulation = new Map();
mapRazedSimulation.set("Cage & Deformation", "blog/razed-art1-cage");

const mapRazed = new Map();
mapRazed.set("Simulation", mapRazedSimulation);

const mapRoot = new Map();
mapRoot.set("Razed", mapRazed);

const map = [
  {
    display: "Razed",
    entries: [
      {
        display: "Simulation",
        entries: [
          { display: "Cage & Deformation", url: "blog/razed-art1-cage" },
        ],
      },
    ],
  },
  {
    display: "Janus",
  },
  {
    display: "Ethel",
  },
  {
    display: "Rendrs",
  },
];

const blogView = document.getElementById("blog-view");
const selectorTree = document.getElementById("selector-tree");
const pathLabel = document.getElementById("tree-path-label");

const TREE_ELEMENT_MARGIN = 2;

var currentTreePath = "";

document.addEventListener("click", (ev) => {
  const link = ev.target.closest("a.tree-link");
  if (!link) return;
  ev.preventDefault();
  loadArticle(link.href);
});

window.addEventListener("DOMContentLoaded", () => {
  loadSelectorTree();
});
async function loadSelectorTree() {
  map.forEach((e) => {
    loadSelectorSubtree(e);
  });
}

async function loadSelectorSubtree(tree, path = "", parent = selectorTree) {
  if (tree.display) {
    const el = document.createElement("div");

    el.classList.add(`ml-${TREE_ELEMENT_MARGIN}`);
    el.classList.add("inconsolata-mono-bold");
    el.innerHTML = tree.display;

    const completePath = `${path}/${tree.display}`;

    if (tree.entries) {
      tree.entries.forEach((e) => {
        loadSelectorSubtree(e, completePath, el);
        pathLabel.innerHTML = completePath;
      });
    } else if (tree.url) {
      el.innerHTML = null;
      const inner = document.createElement("a");

      inner.innerHTML = tree.display;
      inner.className =
        "tree-link {% if current_url == page.permalink %}active{% endif %}";
      inner.href = tree.url;

      inner.addEventListener(
        "click",
        () => {
          currentTreePath = completePath;
          pathLabel.innerHTML = completePath;
        },
        { capture: true },
      );

      el.appendChild(inner);
    }
    parent.appendChild(el);
  }
}

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
