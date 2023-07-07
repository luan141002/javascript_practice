//show toast funciton
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");
    // tự động xóa
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);
    //xóa tay
    toast.onclick = function (e) {
      e.target.closest(".toast__close").onclick = function () {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      };
    };
    const icons = {
      success: "fa-solid fa-check",
      info: "fa-solid fa-info",
      warning: "fa-solid fa-exclamation-circle",
      error: "fa-solid fa-exclamation-circle",
    };
    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideFromLeft ease 0.3s, fadeOut linear 1s ${
      duration / 1000
    }s forwards`;
    toast.innerHTML = `
            <div class="toast__icon">
              <i class="${icons[type]}"></i>
            </div>
            <div class="toast__body">
              <h3 class="toast__title">${title}</h3>
              <p class="toast__msg">
                ${message}
              </p>
            </div>
            <div class="toast__close">
              <i class="fa-solid fa-circle-xmark"></i>
            </div>`;
    main.appendChild(toast);
  }
}

function showSuccessToast() {
  toast({
    title: "success",
    message: "yeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    type: "success",
    duration: 1000,
  });
}
function showErrorToast() {
  toast({
    title: "Error",
    message: "yeeeeeeeeeeeeeeeeeee",
    type: "warning",
    duration: 3000,
  });
}
