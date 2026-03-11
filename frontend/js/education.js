document.addEventListener("DOMContentLoaded", function () {
  const addMoreBtn = document.querySelector(".btn-add-more");
  const educationList = document.querySelector(".education-list");

  // Add new education entry
  addMoreBtn.addEventListener("click", function () {
    const newEntry = document.querySelector(".education-entry").cloneNode(true);
    
    // Clear form values
    newEntry.querySelectorAll("input, select, textarea").forEach((input) => {
      input.value = "";
    });
    
    // Reset checkbox
    newEntry.querySelector("#currentlyStudying").checked = false;
    
    // Add remove functionality to new entry
    newEntry.querySelector(".remove-entry").addEventListener("click", function () {
      if (document.querySelectorAll(".education-entry").length > 1) {
        newEntry.remove();
      }
    });
    
    educationList.appendChild(newEntry);
  });

  // Remove education entry
  document.querySelectorAll(".remove-entry").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (document.querySelectorAll(".education-entry").length > 1) {
        this.closest(".education-entry").remove();
      }
    });
  });

  // Handle currently studying checkbox
  document.addEventListener("change", function (e) {
    if (e.target.id === "currentlyStudying") {
      const endDateInput = e.target
        .closest(".form-grid")
        .querySelector("#endDate");
      endDateInput.disabled = e.target.checked;
      if (e.target.checked) {
        endDateInput.value = "";
      }
    }
  });

  // Save and continue
  window.saveAndContinue = async function () {
    const entries = document.querySelectorAll(".education-entry");
    const educationData = [];
    
    entries.forEach((entry) => {
      educationData.push({
        institution: entry.querySelector("#institution").value,
        degree: entry.querySelector("#degree").value,
        fieldOfStudy: entry.querySelector("#field").value,
        startDate: entry.querySelector("#startDate").value,
        endDate: entry.querySelector("#endDate").value,
        currentlyStudying: entry.querySelector("#currentlyStudying").checked,
        achievements: entry.querySelector("#achievements").value,
      });
    });

    const submitBtn = document.querySelector(".btn-primary");
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      if (typeof profileApi !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.USE_API) {
        const profileId = localStorage.getItem("profileId");
        if (profileId) {
          for (const edu of educationData) {
            await profileApi.addEducation(profileId, edu);
          }
        }
      } else {
        localStorage.setItem("educationData", JSON.stringify(educationData));
      }
      window.location.href = "experience.html";
    } catch (err) {
      submitBtn.innerHTML = 'Continue to Experience <i class="fa-solid fa-arrow-right"></i>';
      alert(err.message || 'Failed to save');
    }
  };
}); 