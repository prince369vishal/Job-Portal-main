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
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector(".signin-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    // Simulate API call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Sign In";
      // Redirect to home page after successful login
      window.location.href = "index.html";
    }, 2000);
  });
});
