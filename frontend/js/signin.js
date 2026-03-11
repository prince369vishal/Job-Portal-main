document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle icon
    const icon = this.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  // Form submission
  const form = document.querySelector(".signin-form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector(".signin-btn");
    const email = form.querySelector("#email").value.trim();
    const password = form.querySelector("#password").value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    try {
      if (typeof authApi !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.USE_API) {
        const response = await authApi.signin(email, password);
        if (response.success && response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.user?.id);
        }
      }
      window.location.href = "index.html";
    } catch (err) {
      const errorDiv = form.querySelector('.error-message') || document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message}`;
      if (!form.querySelector('.error-message')) form.insertBefore(errorDiv, form.firstChild);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Sign In";
    }
  });
});
