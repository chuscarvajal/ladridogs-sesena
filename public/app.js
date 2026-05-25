/*
   Ladridogs - Interactive Client Logic
   Guardería Canina en Seseña, Toledo
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Theme Toggle
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const themeToggle = document.querySelector('.theme-toggle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================
  // 2. Before / After Image Slider
  // ==========================================
  const sliderContainer = document.querySelector('.comparison-slider');
  const afterImage = document.querySelector('.image-after');
  const handle = document.querySelector('.slider-handle');

  if (sliderContainer && afterImage && handle) {
    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      handle.style.left = `${percentage}%`;
    };

    sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; moveSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    sliderContainer.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });

    sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; if (e.touches[0]) moveSlider(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { isDragging = false; });
    sliderContainer.addEventListener('touchmove', (e) => { if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX); });
  }

  // ==========================================
  // 3. Needs Assessment Quiz
  // ==========================================
  const quizData = [
    {
      question: "¿Cuántas horas pasa tu perro solo en casa al día?",
      options: [
        { text: "Menos de 3 horas — trabajo cerca o tengo horario flexible", score: "online" },
        { text: "Entre 3 y 6 horas — puede quedarse pero le cuesta", score: "guarderia" },
        { text: "Más de 6 horas — está solo casi toda la jornada laboral", score: "guarderia" }
      ]
    },
    {
      question: "¿Cómo describirías la situación actual de tu perro?",
      options: [
        { text: "Tiene ansiedad cuando me voy — ladra, destruye cosas o no come", score: "guarderia" },
        { text: "Le cuesta relacionarse con otros perros o personas", score: "educacion" },
        { text: "Tira de la correa, no acude a la llamada o no sigue órdenes básicas", score: "educacion" },
        { text: "Está bien pero quiero enriquecerle y estimularle más", score: "online" }
      ]
    },
    {
      question: "¿Qué tipo de servicio te interesa principalmente?",
      options: [
        { text: "Cuidado diario mientras trabajo — que esté bien acompañado", score: "guarderia" },
        { text: "Sesiones de educación para mejorar nuestra convivencia", score: "educacion" },
        { text: "Aprender yo mismo a estimular y educar a mi perro desde casa", score: "online" }
      ]
    },
    {
      question: "¿Cuándo te gustaría empezar?",
      options: [
        { text: "Lo antes posible — necesito solución urgente", score: "guarderia" },
        { text: "En las próximas semanas — me lo estoy organizando", score: "educacion" },
        { text: "Quiero explorar primero, sin prisa", score: "online" }
      ]
    }
  ];

  let currentStep = 0;
  const userAnswers = [];

  const quizStep = document.getElementById('quiz-step');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const progressFill = document.getElementById('progress-fill');
  const stepCount = document.getElementById('step-count');
  const quizResult = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const recDesc = document.getElementById('rec-desc');
  const btnRestart = document.getElementById('btn-restart');
  const btnSelectResultPackage = document.getElementById('btn-select-result-package');

  function initQuiz() {
    if (!quizStep) return;
    currentStep = 0;
    userAnswers.length = 0;
    quizResult.classList.remove('active');
    quizStep.classList.add('active');
    btnPrev.style.visibility = 'hidden';
    btnNext.innerText = 'Siguiente';
    showQuestion();
  }

  function showQuestion() {
    const questionInfo = quizData[currentStep];
    quizQuestion.innerText = questionInfo.question;
    quizOptions.innerHTML = '';

    const progressPercent = (currentStep / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    stepCount.innerText = `Paso ${currentStep + 1} de ${quizData.length}`;

    questionInfo.options.forEach((option, idx) => {
      const optionEl = document.createElement('div');
      optionEl.classList.add('quiz-option');
      if (userAnswers[currentStep] === idx) optionEl.classList.add('selected');

      optionEl.innerHTML = `
        <div class="quiz-radio"></div>
        <div class="quiz-option-text">${option.text}</div>
      `;

      optionEl.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
        optionEl.classList.add('selected');
        userAnswers[currentStep] = idx;
        btnNext.disabled = false;
      });

      quizOptions.appendChild(optionEl);
    });

    btnNext.disabled = userAnswers[currentStep] === undefined;
    btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    btnNext.innerText = currentStep === quizData.length - 1 ? 'Ver Resultado' : 'Siguiente';
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < quizData.length - 1) {
        currentStep++;
        showQuestion();
      } else {
        showResults();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) { currentStep--; showQuestion(); }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', initQuiz);
  }

  function showResults() {
    quizStep.classList.remove('active');
    quizResult.classList.add('active');
    progressFill.style.width = '100%';
    stepCount.innerText = 'Resultado';

    const scores = { guarderia: 0, educacion: 0, online: 0 };
    userAnswers.forEach((ansIdx, qIdx) => {
      const scoreType = quizData[qIdx].options[ansIdx].score;
      scores[scoreType]++;
    });

    let rec = 'guarderia';
    if (scores.educacion >= scores.guarderia && scores.educacion >= scores.online) {
      rec = 'educacion';
    } else if (scores.online >= scores.guarderia && scores.online >= scores.educacion) {
      rec = 'online';
    }

    if (rec === 'guarderia') {
      resultTitle.innerText = "Guardería Canina — la mejor opción para ti";
      resultDesc.innerText = "Tu perro necesita compañía y actividad durante el día. La guardería de Ladridogs le ofrecerá paseos, socialización y cuidado profesional para que llegue a casa tranquilo y feliz.";
      recDesc.innerText = "Con paseos diarios en grupos reducidos, fotos en tiempo real y cámaras de seguridad, puedes trabajar con total tranquilidad. Disponemos de día de prueba sin compromiso.";
      btnSelectResultPackage.setAttribute('data-target-package', 'guarderia');
    } else if (rec === 'educacion') {
      resultTitle.innerText = "Educación Canina — mejora vuestra convivencia";
      resultDesc.innerText = "Las sesiones de educación personalizadas son lo que tu perro y tú necesitáis para mejorar la comunicación, el paseo y la convivencia diaria.";
      recDesc.innerText = "Trabajamos en sesiones individuales o grupales con técnicas de refuerzo positivo. Notarás resultados desde las primeras sesiones en el comportamiento de tu perro.";
      btnSelectResultPackage.setAttribute('data-target-package', 'educacion');
    } else {
      resultTitle.innerText = "Cursos Online — aprende a tu ritmo";
      resultDesc.innerText = "Si quieres enriquecer la vida de tu perro y mejorar su bienestar sin desplazarte, nuestros cursos online son perfectos para ti.";
      recDesc.innerText = "Enriquecimiento ambiental, adiestramiento en positivo y bienestar canino explicados de forma clara y práctica. Accede cuando quieras y avanza a tu propio ritmo.";
      btnSelectResultPackage.setAttribute('data-target-package', 'online');
    }
  }

  if (btnSelectResultPackage) {
    btnSelectResultPackage.addEventListener('click', () => {
      const targetPkg = btnSelectResultPackage.getAttribute('data-target-package');
      selectPackage(targetPkg);
      document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    });
  }

  initQuiz();

  // ==========================================
  // 4. Pricing Calculator
  // ==========================================
  const pkgGuarderia = document.getElementById('pkg-guarderia');
  const pkgEducacion = document.getElementById('pkg-educacion');
  const pkgOnline = document.getElementById('pkg-online');
  const rangeSessions = document.getElementById('range-sessions');
  const sessionCountVal = document.getElementById('session-count-val');
  const sessionsLabel = document.getElementById('sessions-label');

  const addonHome = document.getElementById('addon-home');
  const addonSupport = document.getElementById('addon-support');
  const addonMaterials = document.getElementById('addon-materials');

  const summaryPackageName = document.getElementById('summary-package-name');
  const summaryPackagePrice = document.getElementById('summary-package-price');
  const summarySessionsCount = document.getElementById('summary-sessions-count');
  const summarySessionsPrice = document.getElementById('summary-sessions-price');
  const summaryAddonsList = document.getElementById('summary-addons-list');
  const summaryAddonsPrice = document.getElementById('summary-addons-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const btnBookSession = document.getElementById('btn-book-session');

  const packages = {
    guarderia: { name: "Guardería Canina", unitPrice: 18, unitLabel: "días", sliderMin: 1, sliderMax: 25, sliderDefault: 5, priceLabel: "18€/día" },
    educacion: { name: "Educación Canina", unitPrice: 50, unitLabel: "sesiones", sliderMin: 1, sliderMax: 10, sliderDefault: 3, priceLabel: "50€/sesión" },
    online:    { name: "Cursos Online",    unitPrice: 35, unitLabel: "cursos",   sliderMin: 1, sliderMax: 5,  sliderDefault: 1, priceLabel: "35€/curso" }
  };

  let activePackage = 'guarderia';

  function selectPackage(pkgKey) {
    if (!packages[pkgKey]) return;
    activePackage = pkgKey;

    [pkgGuarderia, pkgEducacion, pkgOnline].forEach(el => { if (el) el.classList.remove('selected'); });
    const targetEl = document.getElementById(`pkg-${pkgKey}`);
    if (targetEl) targetEl.classList.add('selected');

    const pkg = packages[pkgKey];
    rangeSessions.min = pkg.sliderMin;
    rangeSessions.max = pkg.sliderMax;
    rangeSessions.value = pkg.sliderDefault;
    sessionCountVal.innerText = pkg.sliderDefault;

    if (sessionsLabel) {
      const labelMap = { guarderia: "2. Número de Días al Mes", educacion: "2. Número de Sesiones", online: "2. Número de Cursos" };
      sessionsLabel.innerText = labelMap[pkgKey] || "2. Cantidad";
    }

    calculateCosts();
  }

  function setupCalculatorEvents() {
    if (!pkgGuarderia) return;

    pkgGuarderia.addEventListener('click', () => selectPackage('guarderia'));
    pkgEducacion.addEventListener('click', () => selectPackage('educacion'));
    pkgOnline.addEventListener('click', () => selectPackage('online'));

    rangeSessions.addEventListener('input', (e) => {
      sessionCountVal.innerText = e.target.value;
      calculateCosts();
    });

    [addonHome, addonSupport, addonMaterials].forEach(addon => {
      if (addon) addon.addEventListener('click', () => { addon.classList.toggle('selected'); calculateCosts(); });
    });

    if (btnBookSession) {
      btnBookSession.addEventListener('click', () => {
        const pkg = packages[activePackage];
        const qty = rangeSessions.value;
        const total = summaryTotalPrice.innerText;
        const msg = `Hola, me gustaría reservar: *${pkg.name}* — ${qty} ${pkg.unitLabel}. Presupuesto estimado: *${total}*.`;
        const contactMessage = document.getElementById('message');
        if (contactMessage) contactMessage.value = msg;
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function calculateCosts() {
    if (!rangeSessions) return;

    const pkg = packages[activePackage];
    const qty = parseInt(rangeSessions.value);
    const baseCost = pkg.unitPrice * qty;

    let addonsTotal = 0;
    const activeAddonsNames = [];

    // Addon: extra walk (per-day for guardería, flat for others)
    if (addonHome && addonHome.classList.contains('selected')) {
      const walkCost = activePackage === 'guarderia' ? qty * 5 : 5;
      addonsTotal += walkCost;
      activeAddonsNames.push(`Paseo extra (+${walkCost}€)`);
    }
    if (addonSupport && addonSupport.classList.contains('selected')) {
      addonsTotal += 15;
      activeAddonsNames.push("Álbum digital (+15€)");
    }
    if (addonMaterials && addonMaterials.classList.contains('selected')) {
      addonsTotal += 20;
      activeAddonsNames.push("Kit bienvenida (+20€)");
    }

    const grandTotal = baseCost + addonsTotal;

    if (summaryPackageName) {
      summaryPackageName.innerText = pkg.name;
      summaryPackagePrice.innerText = pkg.priceLabel;
      summarySessionsCount.innerText = `${qty} ${pkg.unitLabel}`;
      summarySessionsPrice.innerText = `${baseCost}€`;
      summaryAddonsList.innerText = activeAddonsNames.length > 0 ? activeAddonsNames.join(', ') : 'Ninguno';
      summaryAddonsPrice.innerText = `+${addonsTotal}€`;

      summaryTotalPrice.classList.remove('pulse');
      void summaryTotalPrice.offsetWidth;
      summaryTotalPrice.classList.add('pulse');
      summaryTotalPrice.innerText = `${grandTotal}€`;
    }
  }

  setupCalculatorEvents();
  calculateCosts();

  // ==========================================
  // 5. Testimonial Carousel
  // ==========================================
  const track = document.querySelector('.reviews-track');
  const slides = Array.from(document.querySelectorAll('.review-slide'));
  const dotsContainer = document.querySelector('.reviews-nav');

  if (track && slides.length > 0 && dotsContainer) {
    let currentSlideIdx = 0;

    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('review-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        clearInterval(autoPlayInterval);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.review-dot'));

    function goToSlide(idx) {
      currentSlideIdx = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[idx].classList.add('active');
    }

    let autoPlayInterval = setInterval(() => {
      goToSlide((currentSlideIdx + 1) % slides.length);
    }, 5000);
  }

  // ==========================================
  // 6. FAQ Accordion
  // ==========================================
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 7. Contact Form
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.innerText = "Por favor, rellena los campos obligatorios (Nombre, Email y Mensaje).";
        formStatus.className = "form-status error";
        return;
      }

      formStatus.innerText = "¡Gracias por contactar con Ladridogs! Te responderemos lo antes posible.";
      formStatus.className = "form-status success";
      contactForm.reset();

      setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
    });
  }

});
