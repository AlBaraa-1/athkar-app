// common.js - يحتوي على الوظائف المشتركة لجميع الصفحات (الوضع الليلي، القائمة الجانبية، القبلة والأوقات)
(function() {
  "use strict";

  /*** Profile sidebar toggle logic ***/
  const profileBtn = document.getElementById('profile-slider-btn');
  const sidebar = document.getElementById('profile-sidebar');
  const closeSidebarBtn = document.getElementById('close-profile-sidebar');
  let sidebarOpen = false;
  if (profileBtn && sidebar && closeSidebarBtn) {
    profileBtn.onclick = function(e) {
      sidebar.style.left = '0';
      sidebarOpen = true;
      e.stopPropagation();
    };
    closeSidebarBtn.onclick = function(e) {
      sidebar.style.left = '-260px';
      sidebarOpen = false;
      e.stopPropagation();
    };
    // Click outside sidebar closes it
    document.addEventListener('click', function(e) {
      if (sidebarOpen && !sidebar.contains(e.target) && e.target !== profileBtn) {
        sidebar.style.left = '-260px';
        sidebarOpen = false;
      }
    });
    // Prevent clicks inside sidebar from closing it
    sidebar.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  /*** Dark mode toggle logic ***/
  const darkToggleBtn = document.getElementById('darkmode-toggle');
  const darkKnob = document.getElementById('darkmode-knob');
  const sunEmoji = document.getElementById('darkmode-emoji-sun');
  const moonEmoji = document.getElementById('darkmode-emoji-moon');
  let darkOn = false;
  function setDarkMode(on) {
    document.body.classList.toggle('darkmode', on);
    // Move knob
    darkKnob.style.left = on ? '25px' : '3px';
    // Toggle sun/moon icons
    if (sunEmoji && moonEmoji) {
      if (on) {
        sunEmoji.style.opacity = '0';  sunEmoji.style.zIndex = '1';
        moonEmoji.style.opacity = '1'; moonEmoji.style.zIndex = '3';
      } else {
        sunEmoji.style.opacity = '1';  sunEmoji.style.zIndex = '3';
        moonEmoji.style.opacity = '0'; moonEmoji.style.zIndex = '1';
      }
    }
    // Toggle background color of button
    if (darkToggleBtn) {
      darkToggleBtn.style.background = on ? '#7c5c1e' : '#e0c97f';
    }
    darkOn = on;
  }
  if (darkToggleBtn) {
    darkToggleBtn.onclick = function() {
      setDarkMode(!darkOn);
    };
  }
  // Initialize in light mode by default
  setDarkMode(false);

  /*** Qibla Compass & Prayer Times (only on index page) ***/
  const qiblaArrow = document.getElementById('qibla-arrow');
  const prayerList = document.getElementById('prayer-times-list');
  // Check if Qibla/prayer section exists (to run only on main page)
  if (qiblaArrow && prayerList) {
    // Coordinates of Kaaba in Mecca
    const KAABA_LAT = 21.4225;
    const KAABA_LON = 39.8262;
    let qiblaBearing = null;

    // Calculate Qibla direction (bearing from current location to Kaaba)
    function calculateQiblaDirection(lat, lon) {
      const phi = lat * Math.PI / 180.0;
      const lambda = lon * Math.PI / 180.0;
      const phiK = KAABA_LAT * Math.PI / 180.0;
      const lambdaK = KAABA_LON * Math.PI / 180.0;
      // Formula for initial bearing (degrees)
      const psi = (180.0/Math.PI) * Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
      return psi;
    }

    // Handle device orientation event to rotate Qibla arrow
    function handleOrientation(e) {
      if (qiblaBearing === null) return;
      const heading = e.webkitCompassHeading ?? ((typeof e.alpha === 'number') ? Math.abs(e.alpha - 360) : 0);
      const rotation = qiblaBearing - heading;
      // Rotate the arrow element (pivot at base center)
      qiblaArrow.style.transform = `rotate(${rotation}deg)`;
    }

    // Start listening to compass events (with permission for iOS if needed)
    function startCompass() {
      // Hide the start button after starting
      const btn = document.getElementById('qibla-start');
      if (btn) btn.style.display = 'none';
      // iOS 13+ requires permission prompt
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            alert('لم يتم منح إذن استخدام البوصلة.');
          }
        }).catch(console.error);
      } else {
        // Other devices: start directly
        if ('ondeviceorientationabsolute' in window) {
          window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      }
    }

    // Geolocation to get current coordinates and then fetch prayer times + compute Qibla
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Calculate Qibla bearing from current location
        let bearing = calculateQiblaDirection(lat, lon);
        if (bearing < 0) bearing += 360; // normalize to 0-360
        qiblaBearing = bearing;
        // Initialize arrow orientation (no rotation needed here, will update on device orientation events)

        // Fetch prayer times via Aladhan API
        const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`;
        fetch(apiUrl)
          .then(res => res.json())
          .then(data => {
            if (!data || !data.data || !data.data.timings) return;
            const timings = data.data.timings;
            // Map English names to Arabic for display
            const prayerNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
            const order = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
            prayerList.innerHTML = ''; // clear list
            order.forEach(key => {
              if (timings[key]) {
                const time = timings[key];
                const nameAr = prayerNames[key] || key;
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${nameAr}:</strong> ${time}`;
                prayerList.appendChild(listItem);
              }
            });
          })
          .catch(err => {
            console.error('Prayer times fetch error:', err);
            prayerList.innerHTML = "<li style='color:red;'>تعذّر جلب مواقيت الصلاة</li>";
          });
      }, error => {
        console.warn('Geolocation error:', error);
        prayerList.innerHTML = "<li style='color:red;'>لم يتم تحديد الموقع</li>";
      });
    } else {
      prayerList.innerHTML = "<li>الموقع غير مدعوم</li>";
    }

    // Set up compass activation button logic
    const qiblaBtn = document.getElementById('qibla-start');
    if (qiblaBtn) {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS – show button to activate compass
        qiblaBtn.style.display = 'inline-block';
        qiblaBtn.onclick = startCompass;
      } else {
        // Other devices – start compass immediately, no button needed
        startCompass();
        // (Button remains hidden)
      }
    }
  }
})();
