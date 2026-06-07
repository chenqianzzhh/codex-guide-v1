const sectionSelect = document.getElementById("sectionSelect");
const sections = document.querySelectorAll(".mobile-section[id]");

if (sectionSelect) {
  sectionSelect.addEventListener("change", () => {
    const target = document.querySelector(sectionSelect.value);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const syncCurrentSection = () => {
  if (!sectionSelect) {
    return;
  }

  let currentId = sectionSelect.value.replace("#", "");

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 90) {
      currentId = section.id;
    }
  });

  sectionSelect.value = `#${currentId}`;
};

window.addEventListener("scroll", syncCurrentSection);
window.addEventListener("load", syncCurrentSection);

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

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
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
