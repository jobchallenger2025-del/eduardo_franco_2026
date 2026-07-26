/**
 * Eduardo Franco Photography — main.js v5.0
 * Layout: 4 Paneles Horizontales + Menú Interactivo + Slideshow + Bilingüe
 */

'use strict';

/* ══════════════════════════
   1. UTILIDADES Y TRADUCCIÓN
   ══════════════════════════ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const TRANSLATIONS = {
  es: {
    'menu-works': 'TRABAJOS',
    'menu-manifesto': 'MANIFIESTO',
    'menu-contact': 'CONTÁCTO',
    'credits-btn': 'CRÉDITOS',
    'toggle-home': 'INICIO',
    'toggle-close': 'CERRAR',
    'toggle-menu': 'MENÚ',
    'title-works': '01 — TRABAJOS',
    'filter-all': 'Todos',
    'filter-alimentos': 'Alimentos',
    'filter-hoteleria': 'Hotelería',
    'filter-lugares': 'Lugares',
    'filter-producto': 'Producto',
    'subfilter-cocinas': 'Cocinas',
    'subfilter-lifestyle': 'LifeStyle',
    'subfilter-refrigeracion': 'Refrigeración',
    'subfilter-television': 'Televisión',
    'title-manifesto': '02 — MANIFIESTO',
    'quote-manifesto': '"La fotografía no captura la realidad. La crea."',
    'desc-manifesto': 'El espacio visual de Eduardo Franco se centra en la estética de alta gama, el diseño editorial y la precisión comercial.',
    'title-contact': '03 — CONTACTO',
    'heading-contact': 'Empecemos algo.',
    'label-email': 'Email',
    'label-location': 'Ubicación',
    'label-phone': 'Cel',
    'val-location': 'Bogotá, Colombia',
    'credits-title': 'CRÉDITOS',
    'credits-p1': '© 2026 Eduardo Franco. Todos los derechos reservados.',
    'credits-p2': 'Concepto y diseño inspirado en el minimalismo editorial.',
    'credits-p3': 'Desarrollado para fotografía comercial de alta gama.'
  },
  en: {
    'menu-works': 'WORKS',
    'menu-manifesto': 'MANIFESTO',
    'menu-contact': 'CONTACT',
    'credits-btn': 'CREDITS',
    'toggle-home': 'HOME',
    'toggle-close': 'CLOSE',
    'toggle-menu': 'MENU',
    'title-works': '01 — WORKS',
    'filter-all': 'All',
    'filter-alimentos': 'Food',
    'filter-hoteleria': 'Hospitality',
    'filter-lugares': 'Places',
    'filter-producto': 'Product',
    'subfilter-cocinas': 'Kitchens',
    'subfilter-lifestyle': 'LifeStyle',
    'subfilter-refrigeracion': 'Refrigeration',
    'subfilter-television': 'Television',
    'title-manifesto': '02 — MANIFESTO',
    'quote-manifesto': '"Photography does not capture reality. It creates it."',
    'desc-manifesto': 'Eduardo Franco\'s visual space focuses on high-end aesthetics, editorial design, and commercial precision.',
    'title-contact': '03 — CONTACT',
    'heading-contact': 'Let\'s start something.',
    'label-email': 'Email',
    'label-location': 'Location',
    'label-phone': 'Cell',
    'val-location': 'Bogota, Colombia',
    'credits-title': 'CREDITS',
    'credits-p1': '© 2026 Eduardo Franco. All rights reserved.',
    'credits-p2': 'Concept and design inspired by editorial minimalism.',
    'credits-p3': 'Developed for high-end commercial photography.'
  }
};

let currentLang = 'es';

function syncToggleLabel(lang = currentLang) {
  const toggleBtn = $('#menu-toggle-btn');
  if (!toggleBtn) return;

  const isMenuOpen = !$('#hero-wrapper')?.classList.contains('menu-hidden');
  const isHome = toggleBtn.dataset.viewState === 'home';

  // INICIO siempre visible para volver al Home; en Home cerrado muestra MENÚ
  if (isHome && !isMenuOpen) {
    toggleBtn.textContent = TRANSLATIONS[lang]['toggle-menu'];
  } else {
    toggleBtn.textContent = TRANSLATIONS[lang]['toggle-home'];
  }
}

function translate(lang) {
  currentLang = lang;
  $$('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (key === 'toggle-home' || key === 'toggle-close' || key === 'toggle-menu') {
      syncToggleLabel(lang);
      return;
    }
    const text = TRANSLATIONS[lang][key];
    if (text) el.textContent = text;
  });
}

/* ══════════════════════════════════════════════════
   2. MAGNETIC CURSOR — SVG con seguimiento inercial
   ══════════════════════════════════════════════════ */
class MagneticCursor {
  constructor() {
    this.el = $('#cursor');
    if (!this.el) return;

    this.mouse = { x: -100, y: -100 };
    this.pos   = { x: -100, y: -100 };
    this.ease  = 0.15;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (this.reducedMotion || this.coarsePointer) {
      this.el.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    this._bind();
    this._loop();
  }

  _bind() {
    document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
      this.mouse.x = x;
      this.mouse.y = y;
    }, { passive: true });

    // Delegación de eventos para aplicar el cursor grande en hovers
    document.body.addEventListener('mouseenter', (e) => {
      if (e.target.matches && e.target.matches('.nav-link, .filter-btn, .top-right-btn, .bottom-link, .lang-btn, .contact-link, .credits-modal__close')) {
        this.el.classList.add('hover-large');
      }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
      if (e.target.matches && e.target.matches('.nav-link, .filter-btn, .top-right-btn, .bottom-link, .lang-btn, .contact-link, .credits-modal__close')) {
        this.el.classList.remove('hover-large');
      }
    }, true);
  }

  _loop() {
    this.pos.x += (this.mouse.x - this.pos.x) * this.ease;
    this.pos.y += (this.mouse.y - this.pos.y) * this.ease;
    this.el.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    requestAnimationFrame(() => this._loop());
  }
}

/* ══════════════════════════════════════════════════
   3. LOADER — Línea de carga
   ══════════════════════════════════════════════════ */
class Loader {
  constructor() {
    this.el = $('#loader');
    this.line = $('#loader-line');
    if (!this.el || !this.line) return;
    this.progress = 0;
  }

  start() {
    this.el.style.opacity = '1';
    this._animate();
  }

  _animate() {
    const interval = setInterval(() => {
      this.progress += Math.random() * 15;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => this._hide(), 300);
      }
      this.line.style.width = this.progress + '%';
    }, 100);
  }

  _hide() {
    this.el.style.opacity = '0';
    setTimeout(() => {
      this.el.style.display = 'none';
      if (this.onDone) this.onDone();
    }, 600);
  }
}

/* ══════════════════════════════════════════════════
   4. SLIDESHOW DE FONDO (CAROUSEL CROSS-FADE)
   ══════════════════════════════════════════════════ */
class BackgroundSlideshow {
  constructor() {
    this.container = $('#home-slideshow');
    if (!this.container) return;

    this.images = [
      'fotografia/Producto/LifeStyle/closeup-shot-retro-car-with-only-back-wheels-ground-street-night.jpg',
      'fotografia/Lugares/stock-photo-bogota-skyline-during-sunset-colombia-2560484741.jpg',
      'fotografia/Hoteleri\u0301a/airplane-sunset.jpg',
      'fotografia/Alimentos/top-view-spring-rolls-ingredients-concept.jpg'
    ];

    this.currentIndex = 0;
    this.slideInterval = null;
    this.elements = [];

    this._init();
  }

  _init() {
    // Generar elementos de imagen en el DOM
    this.container.innerHTML = this.images.map((src, index) => `
      <img src="${src}" class="slideshow-item ${index === 0 ? 'active' : ''}" alt="Background ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" />
    `).join('');

    this.elements = $$('.slideshow-item', this.container);
    this.start();
  }

  start() {
    if (this.elements.length <= 1) return;
    this.slideInterval = setInterval(() => this._next(), 5000);
  }

  stop() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  _next() {
    this.elements[this.currentIndex].classList.remove('active');
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.elements[this.currentIndex].classList.add('active');
  }
}

/* ══════════════════════════════════════════════════
   4b. LOOP DE CATEGORÍAS (HOME)
   ══════════════════════════════════════════════════ */
class CategoryLoop {
  constructor() {
    this.el = $('#category-loop');
    if (!this.el) return;

    this.words = ['hotelería', 'alimentos', 'lugares', 'producto'];
    this.index = 0;
    this.holdMs = 2200;
    this.animMs = 650;
    this.busy = false;
    this.timer = null;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    this.start();
  }

  start() {
    this.timer = setInterval(() => this._next(), this.holdMs + this.animMs);
  }

  _next() {
    if (this.busy) return;
    this.busy = true;

    // Sale hacia arriba
    this.el.classList.remove('is-in');
    this.el.classList.add('is-out');

    setTimeout(() => {
      this.index = (this.index + 1) % this.words.length;
      this.el.textContent = this.words[this.index];

      // Posiciona abajo sin transición
      this.el.style.transition = 'none';
      this.el.classList.remove('is-out');
      void this.el.offsetWidth;

      // Entra desde abajo hacia arriba
      this.el.style.removeProperty('transition');
      this.el.classList.add('is-in');
      this.busy = false;
    }, this.animMs);
  }
}

/* ══════════════════════════════════════════════════
   5. NAVEGACIÓN Y MENÚ INTERACTIVO
   ══════════════════════════════════════════════════ */
class AppNavigation {
  constructor() {
    this.container = $('#horizontalContainer');
    this.panels = $$('.panel');
    this.navLinks = $$('.nav-link');
    this.menuToggleBtn = $('#menu-toggle-btn');
    this.filterBtns = $$('.filter-btn');
    this.galleryContainer = $('#galleryContainer');
    this.heroWrapper = $('#hero-wrapper');
    this.decorDot = $('.decor-dot');
    this.slideshowOverlay = $('#slideshow-overlay');

    if (!this.container) return;

    this.currentIndex = 0;
    this.panelCount = this.panels.length;
    this.isMenuOpen = true;
    this.mobileQuery = window.matchMedia('(max-width: 768px)');
    this._onViewportChange = () => this._syncLayoutMode();

    this._bind();
    this._loadGalleryImages();
    this._syncLayoutMode();
  }

  _isMobileLayout() {
    return this.mobileQuery?.matches ?? window.innerWidth <= 768;
  }

  _syncLayoutMode() {
    if (!this.container) return;

    if (this._isMobileLayout()) {
      this.container.style.transform = 'none';
      this._updateContactStateFromScroll();
    } else {
      this.goToPanel(this.currentIndex);
    }
  }

  _bind() {
    // Navegación por enlaces del menú
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.target;
        const targetIndex = this.panels.findIndex(panel => panel.id === targetId);
        if (targetIndex >= 0) {
          this.goToPanel(targetIndex);
        }
      });
    });

    // Botón superior derecho (CERRAR / MENÚ / VOLVER AL HOME)
    this.menuToggleBtn?.addEventListener('click', () => {
      if (this.currentIndex === 0) {
        // En el Home: Toggle entre ver menú o ver fotografía completa
        this.toggleMenu();
      } else {
        // En paneles interiores: Cerrar el panel y volver al Home con menú abierto
        this.goToPanel(0);
        this.openMenu();
      }
    });

    // Filtros de galería
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        const subcategory = btn.dataset.subcategory || null;
        this._filterGallery(category, subcategory);

        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Si es subcategoría de Producto, mantener Producto marcado en el nivel principal
        if (subcategory) {
          const productoMain = this.filterBtns.find(
            b => b.dataset.category === 'producto' && !b.dataset.subcategory
          );
          productoMain?.classList.add('active');
        }
      });
    });

    // Cambiadores de idioma
    $('#lang-es')?.addEventListener('click', () => {
      $('#lang-es').classList.add('active');
      $('#lang-en').classList.remove('active');
      translate('es');
    });

    $('#lang-en')?.addEventListener('click', () => {
      $('#lang-en').classList.add('active');
      $('#lang-es').classList.remove('active');
      translate('en');
    });

    // Modal de créditos
    const creditsModal = $('#credits-modal');
    $('#credits-btn')?.addEventListener('click', () => {
      creditsModal.classList.add('active');
      creditsModal.setAttribute('aria-hidden', 'false');
    });

    $('#credits-close-btn')?.addEventListener('click', () => {
      creditsModal.classList.remove('active');
      creditsModal.setAttribute('aria-hidden', 'true');
    });

    $('#credits-modal-backdrop')?.addEventListener('click', () => {
      creditsModal.classList.remove('active');
      creditsModal.setAttribute('aria-hidden', 'true');
    });

    // Desktop ↔ móvil: quitar translateX o restaurar slide
    if (this.mobileQuery?.addEventListener) {
      this.mobileQuery.addEventListener('change', this._onViewportChange);
    } else {
      this.mobileQuery?.addListener(this._onViewportChange);
    }

    window.addEventListener('scroll', () => {
      if (!this._isMobileLayout()) return;
      this._updateContactStateFromScroll();
    }, { passive: true });
  }

  _updateContactStateFromScroll() {
    const contact = $('#panel-contacto');
    if (!contact) return;

    const rect = contact.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.45 && rect.bottom > 80;
    document.body.classList.toggle('on-contact', inView);

    // Estado del botón según el panel más visible
    let activeIndex = 0;
    let bestVisible = 0;
    this.panels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (visible > bestVisible) {
        bestVisible = visible;
        activeIndex = i;
      }
    });

    this.currentIndex = activeIndex;
    if (activeIndex === 0) {
      this.menuToggleBtn.dataset.viewState = 'home';
      if (this.isMenuOpen) {
        this.slideshowOverlay.style.opacity = '0.96';
      } else {
        this.slideshowOverlay.style.opacity = '0.25';
      }
    } else {
      this.menuToggleBtn.dataset.viewState = 'inner';
      this.slideshowOverlay.style.opacity = '0.98';
    }
    syncToggleLabel();
  }

  goToPanel(index) {
    if (index < 0 || index >= this.panelCount) return;

    this.currentIndex = index;

    // Móvil: scroll vertical nativo (sin deslizamiento lateral)
    if (this._isMobileLayout()) {
      this.container.style.transform = 'none';
      this.panels[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const isContact = this.panels[index]?.id === 'panel-contacto';
      document.body.classList.toggle('on-contact', isContact);

      if (index === 0) {
        this.menuToggleBtn.dataset.viewState = 'home';
        if (this.isMenuOpen) {
          this.slideshowOverlay.style.opacity = '0.96';
        } else {
          this.slideshowOverlay.style.opacity = '0.25';
        }
        syncToggleLabel();
      } else {
        this.menuToggleBtn.dataset.viewState = 'inner';
        syncToggleLabel();
        this.slideshowOverlay.style.opacity = '0.98';
      }
      return;
    }

    const translateX = -index * 100;
    this.container.style.transform = `translateX(${translateX}vw)`;

    // Contacto: fondo blanco → INICIO en negro
    const isContact = this.panels[index]?.id === 'panel-contacto';
    document.body.classList.toggle('on-contact', isContact);

    // Configuración del botón superior y opacidad de overlay según el panel
    if (index === 0) {
      this.menuToggleBtn.dataset.viewState = 'home';
      // Restaurar el botón según el estado del menú
      if (this.isMenuOpen) {
        this.slideshowOverlay.style.opacity = '0.96';
      } else {
        this.slideshowOverlay.style.opacity = '0.25';
      }
      syncToggleLabel();
    } else {
      this.menuToggleBtn.dataset.viewState = 'inner';
      syncToggleLabel();
      // En paneles interiores oscurecemos más el fondo del Home para máxima legibilidad
      this.slideshowOverlay.style.opacity = '0.98';
    }
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    this.heroWrapper.classList.remove('menu-hidden');
    if (this.decorDot) this.decorDot.classList.remove('menu-hidden');
    this.slideshowOverlay.style.opacity = '0.96';
    if (this.currentIndex === 0) syncToggleLabel();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.heroWrapper.classList.add('menu-hidden');
    if (this.decorDot) this.decorDot.classList.add('menu-hidden');
    this.slideshowOverlay.style.opacity = '0.25';
    if (this.currentIndex === 0) syncToggleLabel();
  }

  _loadGalleryImages() {
    if (!this.galleryContainer) return;

    // Hotelería usa tilde NFD del sistema de archivos (e + combining acute)
    const hoteleriaDir = 'fotografia/Hoteleri\u0301a';

    const imagePaths = {
      alimentos: [
        'fotografia/Alimentos/delicious-meal-vegetables-salad-table.jpg',
        'fotografia/Alimentos/flat-lay-tomatoes-with-garlic-pasta.jpg',
        'fotografia/Alimentos/pilaf-with-meet-dried-fruits-chestnut-rice-rosemary-leaves-wooden-plate.jpg',
        'fotografia/Alimentos/slices-tomatoes-with-veggies-salt.jpg',
        'fotografia/Alimentos/top-view-spring-rolls-ingredients-concept.jpg'
      ],
      hoteleria: [
        `${hoteleriaDir}/800px-Ray_Flying_Legends_2005-1.jpg`,
        `${hoteleriaDir}/airplane-sunset.jpg`,
        `${hoteleriaDir}/images%20(1).jpg`,
        `${hoteleriaDir}/images%20(2).jpg`,
        `${hoteleriaDir}/images.jpg`
      ],
      lugares: [
        'fotografia/Lugares/istockphoto-1453256961-1024x1024.jpg',
        'fotografia/Lugares/istockphoto-1499166326-1024x1024.jpg',
        'fotografia/Lugares/stock-photo-bogota-skyline-during-sunset-colombia-2560484741.jpg'
      ],
      producto: {
        cocinas: [],
        lifestyle: [
          'fotografia/Producto/LifeStyle/closeup-shot-retro-car-with-only-back-wheels-ground-street-night.jpg',
          'fotografia/Producto/LifeStyle/futuristic-sports-car.jpg',
          'fotografia/Producto/LifeStyle/sunset-coastal-drive.jpg',
          'fotografia/Producto/LifeStyle/superhero-car-vintage-style%20(1).jpg',
          'fotografia/Producto/LifeStyle/superhero-car-vintage-style.jpg',
          'fotografia/Producto/LifeStyle/view-car-running-high-speed%20(1).jpg',
          'fotografia/Producto/LifeStyle/view-car-running-high-speed-city.jpg',
          'fotografia/Producto/LifeStyle/view-car-running-high-speed.jpg',
          'fotografia/Producto/LifeStyle/view-three-dimensional-car-with-nature-landscape.jpg'
        ],
        refrigeracion: [],
        television: []
      }
    };

    let html = '';

    Object.keys(imagePaths).forEach(category => {
      const value = imagePaths[category];

      if (Array.isArray(value)) {
        value.forEach(path => {
          const fileName = decodeURIComponent(path.split('/').pop());
          const title = fileName.replace(/\.(jpe?g|png|webp)$/i, '').replace(/[-_]/g, ' ');
          html += `
            <div class="gallery-item" data-category="${category}">
              <img src="${path}" alt="${title}" loading="lazy" />
            </div>
          `;
        });
        return;
      }

      // Producto con subcategorías
      Object.keys(value).forEach(subcategory => {
        value[subcategory].forEach(path => {
          const fileName = decodeURIComponent(path.split('/').pop());
          const title = fileName.replace(/\.(jpe?g|png|webp)$/i, '').replace(/[-_]/g, ' ');
          html += `
            <div class="gallery-item" data-category="${category}" data-subcategory="${subcategory}">
              <img src="${path}" alt="${title}" loading="lazy" />
            </div>
          `;
        });
      });
    });

    this.galleryContainer.innerHTML = html;
  }

  _filterGallery(category, subcategory = null) {
    const items = $$('.gallery-item', this.galleryContainer);
    items.forEach(item => {
      let show = false;

      if (category === 'all') {
        show = true;
      } else if (subcategory) {
        show = item.dataset.category === 'producto' && item.dataset.subcategory === subcategory;
      } else if (category === 'producto') {
        show = item.dataset.category === 'producto';
      } else {
        show = item.dataset.category === category;
      }

      item.style.display = show ? 'block' : 'none';
    });

    const subfilters = $('#subfilter-buttons');
    if (subfilters) {
      const showSubs = category === 'producto';
      subfilters.hidden = !showSubs;
      if (!showSubs) {
        $$('.subfilter-btn', subfilters).forEach(btn => btn.classList.remove('active'));
      }
    }
  }
}

/* ══════════════════════════════════════════════════
   6. FAVICON + TÍTULO EN LOOP (izquierda → derecha)
   ══════════════════════════════════════════════════ */
class FaviconBrandLoop {
  constructor() {
    this.text = 'Eduardo Franco — Fotógrafo Profesional';
    this.gap = '     •     ';
    this.marquee = `${this.text}${this.gap}`;
    this.titlePos = 0;
    this.scrollX = 0;
    this.fps = 14;
    this.lastFrame = 0;

    // Lienzo ancho: icono + texto desplazándose juntos
    this.width = 256;
    this.height = 64;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      document.title = this.text;
      return;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    this.link = document.querySelector('link[rel="icon"]');
    if (!this.link) {
      this.link = document.createElement('link');
      this.link.rel = 'icon';
      document.head.appendChild(this.link);
    }

    this.icon = new Image();
    this.icon.decoding = 'async';
    this.icon.onload = () => {
      this.bandWidth = this._measureBand();
      this.scrollX = -this.bandWidth;
      this._loop(performance.now());
    };
    this.icon.onerror = () => {
      this.bandWidth = this._measureBand();
      this.scrollX = -this.bandWidth;
      this._loop(performance.now());
    };
    this.icon.src = 'css/favicon/favicon_eduardo.svg';
  }

  _measureBand() {
    const ctx = this.ctx;
    ctx.font = '600 28px Poppins, sans-serif';
    const textW = ctx.measureText(this.marquee).width;
    const iconSlot = 56;
    return iconSlot + 12 + textW;
  }

  _updateTitle() {
    const doubled = this.marquee + this.marquee;
    const windowSize = Math.min(30, this.marquee.length);
    document.title = doubled.substring(this.titlePos, this.titlePos + windowSize);
    this.titlePos = (this.titlePos + 1) % this.marquee.length;
  }

  _drawFavicon() {
    const { ctx, width, height, icon, scrollX, marquee } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const iconSlot = 56;
    const iconPad = 8;
    const drawBand = (x) => {
      if (icon && icon.complete && icon.naturalWidth) {
        const iw = iconSlot - iconPad;
        const ih = iw * (icon.naturalHeight / icon.naturalWidth);
        const iy = (height - ih) / 2;
        ctx.drawImage(icon, x + iconPad / 2, iy, iw, ih);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px Poppins, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(marquee, x + iconSlot + 10, height / 2);
    };

    // Dos bandas para loop continuo izquierda → derecha
    drawBand(scrollX);
    drawBand(scrollX + this.bandWidth);

    this.link.type = 'image/png';
    this.link.href = this.canvas.toDataURL('image/png');

    this.scrollX += 3;
    if (this.scrollX >= 0) this.scrollX -= this.bandWidth;
  }

  _loop(timestamp) {
    if (timestamp - this.lastFrame >= 1000 / this.fps) {
      this.lastFrame = timestamp;
      this._updateTitle();
      this._drawFavicon();
    }
    requestAnimationFrame((t) => this._loop(t));
  }
}

/* ══════════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Favicon + título animados (loop)
  new FaviconBrandLoop();

  // Inicializar cursor magnético
  new MagneticCursor();

  // Inicializar cargador
  const loader = new Loader();
  
  loader.onDone = () => {
    // Inicializar carrusel de fondo
    new BackgroundSlideshow();

    // Loop de categorías del Home
    new CategoryLoop();
    
    // Inicializar navegación principal de la App
    const navigation = new AppNavigation();
    
    // Mostrar el botón superior derecho de forma fluida una vez cargada la página
    const toggleBtn = $('#menu-toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.remove('hidden');
      toggleBtn.dataset.viewState = 'home';
      syncToggleLabel();
    }
  };

  loader.start();
});