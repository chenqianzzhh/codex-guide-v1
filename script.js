const copyText = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Fallback copy failed.");
  }
};

const copyButtons = document.querySelectorAll("[data-copy-target]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const targetId = button.dataset.copyTarget;
    const target = document.getElementById(targetId);
    const originalText = button.innerText;

    if (!target) {
      button.innerText = "未找到内容";
      window.setTimeout(() => {
        button.innerText = originalText;
      }, 1400);
      return;
    }

    try {
      await copyText(target.innerText.trim());
      button.innerText = "已复制";
    } catch (error) {
      button.innerText = "复制失败";
    }

    window.setTimeout(() => {
      button.innerText = originalText;
    }, 1400);
  });
});

const sections = document.querySelectorAll(".section[id]");
const navLinks = document.querySelectorAll(".side-nav a");
const mobileSectionSelect = document.getElementById("mobile-section-select");

const setActiveLink = () => {
  let currentId = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 140) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });

  if (mobileSectionSelect && currentId) {
    mobileSectionSelect.value = `#${currentId}`;
  }
};

if (mobileSectionSelect) {
  mobileSectionSelect.addEventListener("change", () => {
    const target = document.querySelector(mobileSectionSelect.value);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);
