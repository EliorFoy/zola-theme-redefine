const wrapElement = (element, wrapper) => {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

const attachTools = (container, getText) => {
  container.insertAdjacentHTML(
    "beforeend",
    '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>',
  );
  container.insertAdjacentHTML(
    "beforeend",
    '<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>',
  );

  const copyButton = container.querySelector(".copy-button");
  const foldButton = container.querySelector(".fold-button");

  copyButton.addEventListener("click", () => {
    const code = getText();

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }

    copyButton.querySelector("i").className = "fa-regular fa-check";

    setTimeout(() => {
      copyButton.querySelector("i").className = "fa-regular fa-copy";
    }, 1000);
  });

  foldButton.addEventListener("click", () => {
    container.classList.toggle("folded");
    foldButton.querySelector("i").className = container.classList.contains(
      "folded",
    )
      ? "fa-solid fa-chevron-up"
      : "fa-solid fa-chevron-down";
  });
};

const initCopyCode = () => {
  // Zola (giallo) 代码块：<pre class="giallo ..."><code data-lang="...">…
  // 转换为与 hexo 版一致的 .code-container > figure.highlight 结构
  document.querySelectorAll("pre.giallo").forEach((pre) => {
    if (pre.dataset.codeBlockReady || pre.closest(".code-container")) {
      return;
    }

    pre.dataset.codeBlockReady = "true";

    const code = pre.querySelector("code");
    const lang = code?.dataset.lang || "code";
    const label = lang.charAt(0).toUpperCase() + lang.slice(1);

    const container = document.createElement("div");
    container.classList.add("code-container");
    container.dataset.rel = label;
    wrapElement(pre, container);

    const figure = document.createElement("figure");
    figure.classList.add("highlight");
    wrapElement(pre, figure);

    attachTools(container, () => {
      const clone = pre.cloneNode(true);
      clone.querySelectorAll(".giallo-ln").forEach((lineNo) => lineNo.remove());
      return clone.textContent.trim();
    });
  });

  // 兼容 hexo 生成的 figure.highlight 结构
  document.querySelectorAll("figure.highlight").forEach((element) => {
    if (element.dataset.codeBlockReady || element.parentElement?.classList.contains("highlight-container")) {
      return;
    }

    element.dataset.codeBlockReady = "true";

    const container = document.createElement("div");
    container.classList.add("highlight-container");
    wrapElement(element, container);

    attachTools(container, () => {
      const codeLines = [...container.querySelectorAll(".code .line")];
      return codeLines.map((line) => line.innerText).join("\n");
    });
  });
};

export default initCopyCode;
