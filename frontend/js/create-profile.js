document.addEventListener("DOMContentLoaded", function () {
  // Profile photo upload
  const photoUpload = document.querySelector(".photo-upload");
  const photoInput = document.getElementById("photo-input");
  const photoPreview = document.getElementById("profile-preview");

  photoUpload.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", function (e) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Form validation and navigation
  function validateBasicInfo() {
    const required = ["firstName", "lastName", "email", "location"];
    let isValid = true;

    required.forEach((field) => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    return isValid;
  }

  window.nextSection = async function () {
    if (!validateBasicInfo()) return;
    
    const submitBtn = document.querySelector(".btn-primary");
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const basicInfo = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      headline: document.getElementById("headline").value,
      bio: document.getElementById("bio").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      location: document.getElementById("location").value,
      website: document.getElementById("website").value,
    };

    try {
      if (typeof profileApi !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.USE_API) {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await profileApi.updateBasicInfo(userId, basicInfo);
          if (response.success && response.data?.id) {
            localStorage.setItem("profileId", response.data.id);
          }
        }
      } else {
        localStorage.setItem("basicInfo", JSON.stringify(basicInfo));
      }
      window.location.href = "education.html";
    } catch (err) {
      submitBtn.innerHTML = 'Continue to Education <i class="fa-solid fa-arrow-right"></i>';
      alert(err.message || 'Failed to save');
    }
  };
});
