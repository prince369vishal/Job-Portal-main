document.addEventListener("DOMContentLoaded", function () {
  // Initialize skill inputs
  initializeSkillInput("technicalInput", "technicalSkills");
  initializeSkillInput("softInput", "softSkills");

  // Initialize language section
  initializeLanguageSection();

  // Initialize certification section
  initializeCertificationSection();
});

function initializeSkillInput(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const skills = new Set();

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkillFromInput(this, list, skills);
    }
  });

  input.addEventListener("blur", function () {
    addSkillFromInput(this, list, skills);
  });
}

function addSkillFromInput(input, list, skills) {
  const skill = input.value.trim().replace(/,/g, '');
  if (skill && !skills.has(skill)) {
    addSkillTag(skill, list, skills);
    input.value = "";
  }
}

function addSkillTag(skill, list, skills) {
  skills.add(skill);
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `
    ${skill}
    <span class="remove-tag">×</span>
  `;
  
  tag.querySelector(".remove-tag").addEventListener("click", () => {
    skills.delete(skill);
    tag.remove();
  });
  
  list.appendChild(tag);
}

function initializeLanguageSection() {
  const addButton = document.querySelector(".btn-add-language");
  const languagesList = document.getElementById("languagesList");

  addButton.addEventListener("click", () => {
    const newEntry = document.querySelector(".language-entry").cloneNode(true);
    newEntry.querySelector(".language-name").value = "";
    newEntry.querySelector(".proficiency-level").value = "";
    
    newEntry.querySelector(".remove-language").addEventListener("click", function() {
      if (document.querySelectorAll(".language-entry").length > 1) {
        newEntry.remove();
      }
    });
    
    languagesList.appendChild(newEntry);
  });

  // Initialize remove buttons for existing entries
  document.querySelectorAll(".remove-language").forEach(btn => {
    btn.addEventListener("click", function() {
      if (document.querySelectorAll(".language-entry").length > 1) {
        this.closest(".language-entry").remove();
      }
    });
  });
}

function initializeCertificationSection() {
  const addButton = document.querySelector(".btn-add-cert");
  const certList = document.getElementById("certificationsList");

  addButton.addEventListener("click", () => {
    const newEntry = document.querySelector(".certification-entry").cloneNode(true);
    newEntry.querySelectorAll("input").forEach(input => input.value = "");
    
    newEntry.querySelector(".remove-cert").addEventListener("click", function() {
      if (document.querySelectorAll(".certification-entry").length > 1) {
        newEntry.remove();
      }
    });
    
    certList.appendChild(newEntry);
  });

  // Initialize remove buttons for existing entries
  document.querySelectorAll(".remove-cert").forEach(btn => {
    btn.addEventListener("click", function() {
      if (document.querySelectorAll(".certification-entry").length > 1) {
        this.closest(".certification-entry").remove();
      }
    });
  });
}

window.saveAndFinish = function() {
  const technicalSkills = document.querySelectorAll("#technicalSkills .tag").length;
  const softSkills = document.querySelectorAll("#softSkills .tag").length;
  const languages = document.querySelectorAll(".language-entry");
  let isValid = true;
  
  // Basic validation
  if (technicalSkills === 0) {
    document.getElementById("technicalInput").classList.add("error");
    isValid = false;
  }
  
  if (softSkills === 0) {
    document.getElementById("softInput").classList.add("error");
    isValid = false;
  }
  
  languages.forEach(entry => {
    const langName = entry.querySelector(".language-name");
    const proficiency = entry.querySelector(".proficiency-level");
    
    if (!langName.value.trim()) {
      langName.classList.add("error");
      isValid = false;
    }
    
    if (!proficiency.value) {
      proficiency.classList.add("error");
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  const skillsData = {
    technical: Array.from(document.querySelectorAll("#technicalSkills .tag"))
      .map(tag => tag.textContent.trim().replace("×", "")),
    soft: Array.from(document.querySelectorAll("#softSkills .tag"))
      .map(tag => tag.textContent.trim().replace("×", "")),
    languages: Array.from(document.querySelectorAll(".language-entry"))
      .filter(entry => entry.querySelector(".language-name").value.trim())
      .map(entry => ({
        language: entry.querySelector(".language-name").value,
        proficiency: entry.querySelector(".proficiency-level").value
      })),
    certifications: Array.from(document.querySelectorAll(".certification-entry"))
      .filter(entry => entry.querySelector(".cert-name").value.trim())
      .map(entry => ({
        name: entry.querySelector(".cert-name").value,
        organization: entry.querySelector(".cert-org").value,
        date: entry.querySelector(".cert-date").value,
        credentialId: entry.querySelector(".cert-id").value
      }))
  };

  const submitBtn = document.querySelector(".btn-primary");
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  try {
    if (typeof profileApi !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.USE_API) {
      const profileId = localStorage.getItem("profileId");
      if (profileId) {
        await profileApi.updateSkills(profileId, skillsData);
      }
    } else {
      localStorage.setItem("skillsData", JSON.stringify(skillsData));
    }
    window.location.href = "profile-complete.html";
  } catch (err) {
    submitBtn.innerHTML = 'Complete Profile <i class="fa-solid fa-check"></i>';
    alert(err.message || 'Failed to save');
  }
}; 