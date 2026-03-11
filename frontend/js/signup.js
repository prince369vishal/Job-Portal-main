document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.querySelector('#password');

  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });

  const form = document.querySelector('.signup-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = form.querySelector('.signup-btn');
    
    // Basic validation
    const firstName = form.querySelector('#firstName').value.trim();
    const lastName = form.querySelector('#lastName').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;

    if (!firstName || !lastName || !email || !password) {
      showError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
    
    try {
      if (typeof authApi !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.USE_API) {
        const response = await authApi.signup({
          firstName, lastName, email, password
        });
        if (response.success && response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.user?.id);
        }
      }
      window.location.href = 'index.html';
    } catch (err) {
      showError(err.message || 'Registration failed');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Account';
    }
  });

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    form.insertBefore(errorDiv, form.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  }
}); 