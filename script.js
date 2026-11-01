document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.header');

  /* Troca o ícone de um <svg class="icon"><use href="#i-..."></svg> */
  const setIcon = (el, name) => {
    const use = el.querySelector('use');
    if (use) use.setAttribute('href', `#i-${name}`);
  };

  /* ---------- Tema claro/escuro ---------- */
  const themeToggle = document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    setIcon(themeToggle, theme === 'dark' ? 'sun' : 'moon');
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
  const mobileQuery = window.matchMedia('(max-width: 960px)');

  const setMenu = (open) => {
    navList.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    setIcon(menuToggle, open ? 'xmark' : 'bars');
  };

  menuToggle.addEventListener('click', () => setMenu(!navList.classList.contains('open')));
  navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('open') && !navList.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  // Fecha o menu se a tela crescer (girar o celular, redimensionar a janela)
  mobileQuery.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });

  /* ---------- Rolagem: sombra no cabeçalho e "voltar ao topo" ---------- */
  const backToTop = document.getElementById('back-to-top');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    backToTop.classList.toggle('is-visible', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Observadores (seção ativa, animações, WhatsApp) ---------- */
  const navLinks = [...navList.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const reveals = document.querySelectorAll('.reveal');
  const contactSection = document.getElementById('contato');
  const whatsappFloat = document.getElementById('whatsapp-float');

  if ('IntersectionObserver' in window) {
    // Destaca no menu a seção que está na tela
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => {
            const active = a.getAttribute('href') === `#${entry.target.id}`;
            a.classList.toggle('active', active);
            if (active) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => sectionObserver.observe(s));

    // Limpa o destaque quando a pessoa está no topo ou no contato
    const clearObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'contato'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) clearObserver.observe(el);
    });

    // Animação ao aparecer na tela
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));

    // Esconde o WhatsApp flutuante na seção de contato (lá ele já aparece)
    const contactObserver = new IntersectionObserver(([entry]) => {
      whatsappFloat.classList.toggle('is-hidden', entry.isIntersecting);
      backToTop.classList.toggle('is-low', entry.isIntersecting);
    }, { threshold: 0.15 });
    contactObserver.observe(contactSection);
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- FAQ: abre um item por vez ---------- */
  const faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  /* ---------- Formulário de contato ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');
  const againBtn = document.getElementById('form-again');
  const servicoSelect = document.getElementById('servico');
  const phone = document.getElementById('telefone');

  // "Quero este serviço": já deixa o serviço selecionado no formulário
  document.querySelectorAll('[data-servico]').forEach((link) => {
    link.addEventListener('click', () => {
      servicoSelect.value = link.dataset.servico;
      setTimeout(() => document.getElementById('nome').focus({ preventScroll: true }), 600);
    });
  });

  // Máscara de telefone: (81) 99999-9999 ou (81) 3333-3333
  const formatPhone = (value) => {
    const d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); });

  // Validação com mensagem embaixo de cada campo
  const validators = {
    nome: (v) => (v.trim().length < 2 ? 'Informe o seu nome.' : ''),
    email: (v) => {
      if (!v.trim()) return 'Informe o seu e-mail.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Confira o e-mail: parece estar incompleto.';
    },
    telefone: (v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length === 0 || digits.length >= 10 ? '' : 'Informe o DDD e o número completo.';
    },
    mensagem: (v) => (v.trim().length < 10 ? 'Conte um pouco mais sobre o que você precisa.' : ''),
  };

  const validateField = (input) => {
    const check = validators[input.id];
    if (!check) return true;
    const msg = check(input.value);
    const errorEl = document.getElementById(`${input.id}-erro`);
    if (errorEl) errorEl.textContent = msg;
    input.classList.toggle('invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  Object.keys(validators).forEach((id) => {
    const input = document.getElementById(id);
    // Valida ao sair do campo; depois do primeiro erro, revalida enquanto digita
    input.addEventListener('blur', () => { if (input.value) validateField(input); });
    input.addEventListener('input', () => { if (input.classList.contains('invalid')) validateField(input); });
  });

  const showStatus = (msg, type) => {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = Object.keys(validators).map((id) => document.getElementById(id));
    const results = inputs.map(validateField);
    const firstInvalid = inputs[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus('Confira os campos destacados.', 'error');
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
      showStatus('', '');
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      showStatus('Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  againBtn.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    document.getElementById('nome').focus();
  });

  /* ---------- Ano atual no rodapé ---------- */
  document.getElementById('ano').textContent = new Date().getFullYear();
});
