document.addEventListener("DOMContentLoaded", function () {
  // Set initial active state based on current scroll position
  setTimeout(() => {
    window.dispatchEvent(new Event("scroll"));
  }, 100);

  // Show all cards initially with animation
  const allCards = document.querySelectorAll(".org-card");
  allCards.forEach((card) => {
    card.style.display = "flex";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100);
  });

  // Filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterCards(filter);
      updateActiveButton(button);
      updateSectionInfo(filter);
    });
  });

  function filterCards(filter) {
    const cards = document.querySelectorAll(".org-card");
    const grid = document.querySelector(".org-grid");

    // Fade out all cards
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
    });

    setTimeout(() => {
      cards.forEach((card) => {
        if (filter === "all" || card.classList.contains(filter)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.display = "none";
        }
      });

      // Update grid layout
      const visibleCards = document.querySelectorAll(
        `.org-card${filter === "all" ? "" : "." + filter}`
      );
      grid.style.gridTemplateColumns =
        visibleCards.length <= 3
          ? `repeat(${visibleCards.length}, 1fr)`
          : "repeat(auto-fit, minmax(350px, 1fr))";
    }, 300);
  }

  function updateActiveButton(clickedButton) {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    clickedButton.classList.add("active");
  }

  function updateSectionInfo(filter) {
    const title = document.querySelector(".org-title");
    const subtitle = document.querySelector(".org-subtitle");

    const content = {
      all: {
        title: "Top Organizations",
        subtitle: "Join industry leaders shaping the future of technology",
      },
      fortune500: {
        title: "Fortune 500 Companies",
        subtitle: "Join industry-leading enterprises shaping global technology",
      },
      startup: {
        title: "Innovative Startups",
        subtitle: "Be part of fast-growing companies revolutionizing tech",
      },
      remote: {
        title: "Remote-First Companies",
        subtitle: "Work from anywhere with globally distributed teams",
      },
    };

    const selected = content[filter];

    // Fade out current text
    title.style.opacity = "0";
    subtitle.style.opacity = "0";

    setTimeout(() => {
      title.textContent = selected.title;
      subtitle.textContent = selected.subtitle;

      // Fade in new text
      title.style.opacity = "1";
      subtitle.style.opacity = "1";
    }, 300);
  }

  // Add smooth scrolling
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Add active state to clicked link
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");

        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without jumping
        window.history.pushState(null, "", targetId);
      }
    });
  });

  // Highlight active section on scroll
  window.addEventListener("scroll", function () {
    let current = "";

    document.querySelectorAll("[id]").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href && href.substring(1) === current) {
        link.classList.add("active");
      }
    });
  });
});
