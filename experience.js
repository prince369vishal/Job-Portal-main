document.addEventListener("DOMContentLoaded", function () {
  const addMoreBtn = document.querySelector(".btn-add-more");
  const experienceList = document.querySelector(".experience-list");

  // Add new experience entry
  addMoreBtn.addEventListener("click", function () {
    const newEntry = document.querySelector(".experience-entry").cloneNode(true);
    
    // Clear form values
    newEntry.querySelectorAll("input, select, textarea").forEach((input) => {
      input.value = "";
    });
    
    // Reset checkbox
    newEntry.querySelector("#currentlyWorking").checked = false;
    
    // Clear tags
    newEntry.querySelector(".tags-list").innerHTML = "";
    
    // Add remove functionality to new entry
    newEntry.querySelector(".remove-entry").addEventListener("click", function () {
      if (document.querySelectorAll(".experience-entry").length > 1) {
        newEntry.remove();
      }
    });
    
    // Initialize tags input for new entry
    initializeTagsInput(newEntry.querySelector(".tags-input"));
    
    experienceList.appendChild(newEntry);
  });

  // Remove experience entry
  document.querySelectorAll(".remove-entry").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (document.querySelectorAll(".experience-entry").length > 1) {
        this.closest(".experience-entry").remove();
      }
    });
  });

  // Handle currently working checkbox
  document.addEventListener("change", function (e) {
    if (e.target.id === "currentlyWorking") {
      const endDateInput = e.target
        .closest(".form-grid")
        .querySelector("#endDate");
      endDateInput.disabled = e.target.checked;
      if (e.target.checked) {
        endDateInput.value = "";
      }
    }
  });

  // Initialize tags input
  function initializeTagsInput(container) {
    const input = container.querySelector("input");
    const tagsList = container.querySelector(".tags-list");
    const tags = new Set();

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const tag = this.value.trim();
        if (tag && !tags.has(tag)) {
          tags.add(tag);
          const tagElement = document.createElement("span");
          tagElement.className = "tag";
          tagElement.innerHTML = `
            ${tag}
            <span class="remove-tag">×</span>
          `;
          tagElement.querySelector(".remove-tag").addEventListener("click", () => {
            tags.delete(tag);
            tagElement.remove();
          });
          tagsList.appendChild(tagElement);
          this.value = "";
        }
      }
    });
  }

  // Initialize tags input for existing entries
  document.querySelectorAll(".tags-input").forEach(initializeTagsInput);

  // Save and continue
  window.saveAndContinue = function () {
    const experienceData = [];
    const entries = document.querySelectorAll(".experience-entry");
    
    entries.forEach((entry) => {
      const tags = Array.from(entry.querySelectorAll(".tag"))
        .map(tag => tag.textContent.trim().replace("×", ""));
      
      experienceData.push({
        company: entry.querySelector("#company").value,
        position: entry.querySelector("#position").value,
        employmentType: entry.querySelector("#employmentType").value,
        location: entry.querySelector("#location").value,
        startDate: entry.querySelector("#startDate").value,
        endDate: entry.querySelector("#endDate").value,
        currentlyWorking: entry.querySelector("#currentlyWorking").checked,
        responsibilities: entry.querySelector("#responsibilities").value,
        technologies: tags
      });
    });

    // Save to localStorage
    localStorage.setItem("experienceData", JSON.stringify(experienceData));

    // Show success animation
    const submitBtn = document.querySelector(".btn-primary");
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    setTimeout(() => {
      // Redirect to skills page
      window.location.href = "skills.html";
    }, 1500);
  };
}); 