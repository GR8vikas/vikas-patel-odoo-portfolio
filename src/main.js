const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav.classList.toggle('is-open', !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    siteNav?.classList.remove('is-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const tiltTarget = document.querySelector('[data-tilt]');
if (tiltTarget && !prefersReducedMotion) {
  const moveTilt = (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltTarget.style.setProperty('--tilt-x', `${(y * -7).toFixed(2)}deg`);
    tiltTarget.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
  };
  const resetTilt = () => {
    tiltTarget.style.setProperty('--tilt-x', '0deg');
    tiltTarget.style.setProperty('--tilt-y', '0deg');
  };
  tiltTarget.addEventListener('pointermove', moveTilt);
  tiltTarget.addEventListener('pointerleave', resetTilt);
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const moduleCard = document.querySelector('[data-module-card]');
const moduleName = moduleCard?.querySelector('.module-name');
const moduleValues = moduleCard ? [...moduleCard.querySelectorAll('.module-value')] : [];
const moduleStatus = moduleCard?.querySelector('.module-status');
const moduleHint = moduleCard?.querySelector('.module-hint');
const moduleOptions = [
  { name: 'ODOO / CRM', rows: ['crm.lead', 'res.partner', 'mail.activity'], status: '3 active models' },
  { name: 'ODOO / SALES', rows: ['sale.order', 'sale.order.line', 'account.move'], status: '3 active models' },
  { name: 'ODOO / INVENTORY', rows: ['stock.move', 'stock.picking', 'product.template'], status: '3 active models' },
  { name: 'ODOO / API', rows: ['api.connector', 'sync.queue', 'res.config'], status: '3 active models' },
];
let activeModule = 0;

const cycleModule = () => {
  if (!moduleCard) return;
  activeModule = (activeModule + 1) % moduleOptions.length;
  const next = moduleOptions[activeModule];
  moduleCard.classList.add('is-switching');
  window.setTimeout(() => {
    if (moduleName) moduleName.textContent = next.name;
    moduleValues.forEach((value, index) => { value.textContent = next.rows[index]; });
    if (moduleStatus) moduleStatus.textContent = next.status;
    moduleCard.setAttribute('aria-label', `Active module: ${next.name}. Activate to cycle.`);
    moduleCard.classList.remove('is-switching');
    if (moduleHint) moduleHint.textContent = `ACTIVE / ${String(activeModule + 1).padStart(2, '0')} OF 04`;
  }, 180);
};

moduleCard?.addEventListener('click', cycleModule);
moduleCard?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    cycleModule();
  }
});

const contactForm = document.querySelector('[data-contact-form]');
const formStatus = contactForm?.querySelector('[data-form-status]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('.form-submit');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = '…';
  }
  if (formStatus) formStatus.textContent = 'Sending…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });
    if (!response.ok) throw new Error('Request failed');
    contactForm.reset();
    if (formStatus) formStatus.textContent = 'Thanks — your message is on its way.';
  } catch {
    if (formStatus) formStatus.textContent = 'Something went wrong. Please email vikaspat371@gmail.com.';
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = '↗';
    }
  }
});

const moduleOrbit = document.querySelector('[data-module-orbit]');
const orbitModules = moduleOrbit ? [...moduleOrbit.querySelectorAll('[data-lab-module]')] : [];
const labDetail = document.querySelector('[data-lab-detail]');
const labStatus = document.querySelector('[data-lab-status]');
const labCopy = {
  crm: { label: 'CRM', detail: 'Leads, activities, and customer context moving together so the next action is always visible.' },
  inventory: { label: 'INVENTORY', detail: 'Products, moves, and replenishment rules connected into one reliable stock story.' },
  api: { label: 'API', detail: 'Third-party services bridged into Odoo with predictable sync, clear ownership, and useful errors.' },
  automation: { label: 'AUTOMATE', detail: 'Small rules that remove repetitive work while keeping the team in control of the workflow.' },
};
let activeOrbitModule = 'crm';
let orbitTimer;

const activateOrbitModule = (key, pauseAutoRotate = true) => {
  const copy = labCopy[key];
  if (!copy || !moduleOrbit) return;
  activeOrbitModule = key;
  orbitModules.forEach((module) => {
    const isActive = module.dataset.labModule === key;
    module.classList.toggle('active', isActive);
    module.setAttribute('aria-pressed', String(isActive));
  });
  moduleOrbit.dataset.activeModule = key;
  if (labDetail) labDetail.textContent = copy.detail;
  if (labStatus) labStatus.textContent = `ACTIVE / ${copy.label}`;
  if (pauseAutoRotate && orbitTimer) {
    window.clearInterval(orbitTimer);
    orbitTimer = undefined;
  }
};

orbitModules.forEach((module) => {
  module.setAttribute('aria-pressed', String(module.classList.contains('active')));
  module.addEventListener('click', () => activateOrbitModule(module.dataset.labModule));
  module.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateOrbitModule(module.dataset.labModule);
    }
  });
});

if (moduleOrbit && !prefersReducedMotion) {
  let orbitIndex = 0;
  orbitTimer = window.setInterval(() => {
    orbitIndex = (orbitIndex + 1) % orbitModules.length;
    activateOrbitModule(orbitModules[orbitIndex].dataset.labModule, false);
  }, 4200);
  moduleOrbit.addEventListener('pointermove', (event) => {
    const rect = moduleOrbit.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    moduleOrbit.style.setProperty('--lab-rotate-x', `${(y * -10).toFixed(2)}deg`);
    moduleOrbit.style.setProperty('--lab-rotate-y', `${(x * 12).toFixed(2)}deg`);
  });
  moduleOrbit.addEventListener('pointerleave', () => {
    moduleOrbit.style.setProperty('--lab-rotate-x', '0deg');
    moduleOrbit.style.setProperty('--lab-rotate-y', '0deg');
  });
}
