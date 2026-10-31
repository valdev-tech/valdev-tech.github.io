document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.header');

  /* ---------- Tema claro/escuro ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  };

  applyTheme(root.getAttribute('data-theme') || 'light');

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('valdev-theme', next); } catch (e) { /* armazenamento indisponível */ }
  });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  const menuIcon = menuToggle.querySelector('i');

  const setMenu = (open) => {
    navList.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };

  menuToggle.addEventListener('click', () => setMenu(!navList.classList.contains('open')));
  navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Sombra no cabeçalho ao rolar ---------- */
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Destaque do link da seção atual ---------- */
  const navLinks = [...navList.querySelectorAll('a[href^="#"]')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => sectionObserver.observe(s));

    /* ---------- Animação ao aparecer na tela ---------- */
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ---------- FAQ: abre um item por vez ---------- */
  const faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  /* ---------- Formulário de contato (Formspree) ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const showStatus = (msg, type) => {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      showStatus('Preencha os campos obrigatórios (*).', 'error');
      return;
    }

    submitBtn.disabled = true;
    showStatus('Enviando…', 'info');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Falha no envio');

      form.reset();
      showStatus('Mensagem enviada! Em breve entraremos em contato. 🎉', 'success');
    } catch (err) {
      showStatus('Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Ano atual no rodapé ---------- */
  document.getElementById('ano').textContent = new Date().getFullYear();
});
