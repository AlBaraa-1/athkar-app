document.addEventListener('DOMContentLoaded', () => {
  const counterDisplay = document.getElementById('counter-display');
  const incrementBtn = document.getElementById('increment-btn');
  const resetBtn = document.getElementById('reset-btn');
  const targetInput = document.getElementById('target-input');
  const tasbeehTypeSelect = document.getElementById('tasbeeh-type-select');
  const targetSelect = document.getElementById('target-select');
  const totalTasbeehDiv = document.getElementById('total-tasbeeh');
  const statsPopup = document.getElementById('tasbeeh-stats-popup');
  const openStatsBtn = document.getElementById('open-tasbeeh-stats');
  const closeStatsBtn = document.getElementById('close-tasbeeh-stats');
  let counter = 0;
  let target = parseInt(targetInput.value, 10);
  let totalTasbeeh = parseInt(localStorage.getItem('totalTasbeeh') || '0', 10);
  let statsOpen = false;

  function hideIncrementBtn() {
    incrementBtn.style.display = 'none';
  }
  function showIncrementBtn() {
    incrementBtn.style.display = '';
  }
  function updateTotalTasbeehDisplay() {
    totalTasbeehDiv.textContent = `إجمالي التسبيحات: ${totalTasbeeh}`;
  }

  incrementBtn.addEventListener('click', () => {
    if (counter < target) {
      counter++;
      counterDisplay.textContent = counter;
      totalTasbeeh++;
      localStorage.setItem('totalTasbeeh', totalTasbeeh);
      updateTotalTasbeehDisplay();
      if (counter === target) {
        hideIncrementBtn();
      }
    }
  });

  resetBtn.addEventListener('click', () => {
    counter = 0;
    counterDisplay.textContent = counter;
    showIncrementBtn();
  });

  // Handle target select dropdown
  targetSelect.addEventListener('change', () => {
    if (targetSelect.value === 'custom') {
      targetInput.style.display = '';
      targetInput.value = '';
      target = 1;
    } else {
      targetInput.style.display = 'none';
      targetInput.value = targetSelect.value;
      target = parseInt(targetSelect.value, 10);
      if (counter >= target) {
        hideIncrementBtn();
      } else {
        showIncrementBtn();
      }
    }
  });
  // Handle custom input
  targetInput.addEventListener('input', () => {
    target = parseInt(targetInput.value, 10) || 1;
    if (counter >= target) {
      hideIncrementBtn();
    } else {
      showIncrementBtn();
    }
  });
  // Update increment button text when dropdown changes
  tasbeehTypeSelect.addEventListener('change', () => {
    incrementBtn.textContent = tasbeehTypeSelect.value;
  });
  // Set initial state
  targetInput.style.display = 'none';
  targetSelect.value = '33';
  target = 33;
  // Set initial button text
  incrementBtn.textContent = tasbeehTypeSelect.value;
  updateTotalTasbeehDisplay();

  // --- Fix: Always hide stats popup on load ---
  statsPopup.style.display = 'none';

  // Popup logic (show/hide on hold, faster response)
  openStatsBtn.addEventListener('mousedown', function(e) {
    statsPopup.style.display = 'flex';
    statsOpen = true;
    e.preventDefault();
  });
  openStatsBtn.addEventListener('touchstart', function(e) {
    statsPopup.style.display = 'flex';
    statsOpen = true;
    e.preventDefault();
  }, {passive: false});
  function hideStatsPopup() {
    statsPopup.style.display = 'none';
    statsOpen = false;
  }
  openStatsBtn.addEventListener('mouseup', hideStatsPopup);
  openStatsBtn.addEventListener('mouseleave', hideStatsPopup);
  openStatsBtn.addEventListener('touchend', hideStatsPopup);
  openStatsBtn.addEventListener('touchcancel', hideStatsPopup);
  closeStatsBtn.onclick = hideStatsPopup;
  document.addEventListener('click', function(e) {
    if (statsOpen && !statsPopup.contains(e.target) && e.target !== openStatsBtn) {
      statsPopup.style.display = 'none';
      statsOpen = false;
    }
  });
  statsPopup.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Profile sidebar logic
  const profileBtn = document.getElementById('profile-slider-btn');
  const sidebar = document.getElementById('profile-sidebar');
  const closeSidebar = document.getElementById('close-profile-sidebar');
  let sidebarOpen = false;
  profileBtn.onclick = function(e) {
    sidebar.style.left = '0';
    sidebarOpen = true;
    e.stopPropagation();
  };
  closeSidebar.onclick = function(e) {
    sidebar.style.left = '-260px';
    sidebarOpen = false;
    e.stopPropagation();
  };
  document.addEventListener('click', function(e) {
    if (sidebarOpen && !sidebar.contains(e.target) && e.target !== profileBtn) {
      sidebar.style.left = '-260px';
      sidebarOpen = false;
    }
  });
  sidebar.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // --- Add dark mode toggle logic ---
  const darkToggleBtn = document.getElementById('darkmode-toggle');
  const darkKnob = document.getElementById('darkmode-knob');
  const sunEmoji = document.getElementById('darkmode-emoji-sun');
  const moonEmoji = document.getElementById('darkmode-emoji-moon');
  let darkOn = document.body.classList.contains('darkmode');
  function setDarkMode(on) {
    document.body.classList.toggle('darkmode', on);
    darkKnob.style.left = on ? '25px' : '3px';
    if (on) {
      sunEmoji.style.opacity = '0';
      sunEmoji.style.zIndex = '1';
      moonEmoji.style.opacity = '1';
      moonEmoji.style.zIndex = '3';
    } else {
      sunEmoji.style.opacity = '1';
      sunEmoji.style.zIndex = '3';
      moonEmoji.style.opacity = '0';
      moonEmoji.style.zIndex = '1';
    }
    darkToggleBtn.style.background = on ? '#7c5c1e' : '#e0c97f';
    darkOn = on;
  }
  darkToggleBtn.onclick = function() {
    setDarkMode(!darkOn);
  };
  setDarkMode(false);
});
