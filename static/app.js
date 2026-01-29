const handleCopyButtonClick = (button) => {
  const textToCopy = button.getAttribute("data-text-copy");
  navigator.clipboard.writeText(textToCopy);

  button.classList.add("copied");
  setTimeout(() => button.classList.remove("copied"), 1000);
};

const initApp = () => {
  // Set up copy text buttons (might not be anyone)
  const copyButtons = document.querySelectorAll(".copy-button");
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => handleCopyButtonClick(button));
  });

  // Set up search form
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", () => {
      searchForm.classList.add("loading");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
