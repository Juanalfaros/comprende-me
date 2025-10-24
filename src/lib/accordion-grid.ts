// Declaración para extender la interfaz global Window (opcional)
declare global {
  interface Window {
    AccordionGrid: {
      activateCard: (index: number) => void;
      getCurrentCard: () => number;
      refresh: () => void;
      destroy: () => void;
    };
  }
}

(() => {
  'use strict';

  // Configuración
  const CONFIG = {
    MOBILE_BREAKPOINT: 768,
    RESIZE_DEBOUNCE: 150,
    INTERSECTION_THRESHOLD: 0.1, // Para lazy loading
    SELECTORS: {
      grid: '.accordion-grid',
      card: '.accordion-grid__card',
      openCard: '.accordion-grid__card--is-open',
      image: '.accordion-grid__panel--image img'
    },
    CLASSES: {
      open: 'accordion-grid__card--is-open',
      imageLoaded: 'image-loaded'
    },
    ATTRIBUTES: {
      ariaExpanded: 'aria-expanded',
      ariaLabel: 'aria-label',
      role: 'role',
      tabindex: 'tabindex'
    }
  };

  // Estado de la aplicación con tipos
  const state = {
    isDesktop: false,
    isInitialized: false,
    currentOpenCard: null as HTMLElement | null,
    cachedStyles: null as { totalBorderPerCard: number } | null,
    prefersReducedMotion: false,
    rafId: null as number | null
  };

  // Referencias DOM (cacheadas) con tipos
  let grid: HTMLElement | null = null;
  let cards: HTMLElement[] = [];
  let resizeObserver: ResizeObserver | null = null;
  let intersectionObserver: IntersectionObserver | null = null;

  /**
   * Detecta preferencias del usuario
   */
  function detectUserPreferences() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.prefersReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      state.prefersReducedMotion = e.matches;
    });
  }

  /**
   * Inicializa las referencias DOM
   */
  function initDOM() {
    grid = document.querySelector<HTMLElement>(CONFIG.SELECTORS.grid);
    cards = Array.from(document.querySelectorAll<HTMLElement>(CONFIG.SELECTORS.card));

    if (!grid || !cards.length) {
      console.warn('Accordion Grid: No se encontraron elementos necesarios');
      return false;
    }

    return true;
  }

  /**
   * Mejora de accesibilidad - Agrega atributos ARIA
   */
  function enhanceAccessibility() {
    if (!grid) return; // Verificación de nulidad

    grid.setAttribute(CONFIG.ATTRIBUTES.role, 'region');
    grid.setAttribute(CONFIG.ATTRIBUTES.ariaLabel, 'Acordeón de artículos del blog');

    cards.forEach((card, index) => {
      card.setAttribute(CONFIG.ATTRIBUTES.role, 'button');
      card.setAttribute(CONFIG.ATTRIBUTES.tabindex, '0');
      card.setAttribute(CONFIG.ATTRIBUTES.ariaLabel, `Artículo ${index + 1}`);
      card.setAttribute(CONFIG.ATTRIBUTES.ariaExpanded, index === 0 ? 'true' : 'false');

      card.addEventListener('keydown', handleKeyDown);
    });
  }

  /**
   * Maneja la navegación por teclado
   */
  function handleKeyDown(e: KeyboardEvent) {
    const card = e.currentTarget as HTMLElement;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateCard(card);
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = cards.indexOf(card);
      let nextIndex;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % cards.length;
      } else {
        nextIndex = (currentIndex - 1 + cards.length) % cards.length;
      }

      cards[nextIndex].focus();
      if (state.isDesktop) {
        activateCard(cards[nextIndex]);
      }
    }
  }

  /**
   * Configura Intersection Observer para lazy loading de imágenes
   */
  function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll<HTMLImageElement>(CONFIG.SELECTORS.image);

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          img.addEventListener('load', () => {
            img.classList.add(CONFIG.CLASSES.imageLoaded);
          }, { once: true });

          intersectionObserver?.unobserve(img); // Optional chaining
        }
      });
    }, {
      threshold: CONFIG.INTERSECTION_THRESHOLD,
      rootMargin: '50px'
    });

    images.forEach(img => intersectionObserver?.observe(img)); // Optional chaining
  }

  /**
   * Cachea los estilos computados que no cambian frecuentemente
   */
  function cacheStyles() {
    if (!cards.length) return;

    const cardStyles = getComputedStyle(cards[0]);
    const borderLeft = parseFloat(cardStyles.borderLeftWidth) || 0;
    const borderRight = parseFloat(cardStyles.borderRightWidth) || 0;

    state.cachedStyles = {
      totalBorderPerCard: borderLeft + borderRight
    };
  }

  /**
   * Calcula y establece las propiedades CSS personalizadas para los anchos
   */
  function calculateAndSetWidths() {
    if (!grid || !cards.length) return; // Comprobación inicial

    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }

    state.rafId = requestAnimationFrame(() => {
      // *** CORRECCIÓN ***
      // Comprobar 'grid' OTRA VEZ dentro del callback de rAF
      if (!grid) return; 
      
      const cardCount = cards.length;
      const TOTAL_FR_UNITS = cardCount + 1;

      // 'grid' está ahora "type-guarded" y no es nulo
      const gridWidth = grid.getBoundingClientRect().width;
      const gridStyles = getComputedStyle(grid);
      const paddingLeft = parseFloat(gridStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(gridStyles.paddingRight) || 0;
      const gap = parseFloat(gridStyles.gap) || 20;

      if (!state.cachedStyles) cacheStyles();
      
      const totalBordersWidth = state.cachedStyles 
        ? state.cachedStyles.totalBorderPerCard * cardCount 
        : 0;

      const availableWidth = gridWidth - paddingLeft - paddingRight;
      const totalGapsWidth = (cardCount - 1) * gap;
      const netWidth = availableWidth - totalGapsWidth - totalBordersWidth;

      const oneFrInPixels = netWidth / TOTAL_FR_UNITS;
      const twoFrInPixels = oneFrInPixels * 2;

      const newPanelWidth = `${oneFrInPixels}px`;
      const newContentWidth = `${twoFrInPixels}px`;

      if (grid.style.getPropertyValue('--panel-width-px') !== newPanelWidth) {
        grid.style.setProperty('--panel-width-px', newPanelWidth);
        grid.style.setProperty('--content-width-px', newContentWidth);
      }

      state.rafId = null;
    });
  }

  /**
   * Desactiva todas las tarjetas
   */
  function deactivateAllCards() {
    if (state.currentOpenCard) {
      state.currentOpenCard.classList.remove(CONFIG.CLASSES.open);
      state.currentOpenCard.setAttribute(CONFIG.ATTRIBUTES.ariaExpanded, 'false');
      state.currentOpenCard = null;
    }
  }

  /**
   * Activa una tarjeta específica con animación suave
   */
  function activateCard(card: HTMLElement) {
    if (state.currentOpenCard === card) return;

    deactivateAllCards();

    card.setAttribute(CONFIG.ATTRIBUTES.ariaExpanded, 'true');
    card.classList.add(CONFIG.CLASSES.open);
    state.currentOpenCard = card;

    dispatchCustomEvent('accordion:card-activated', {
      cardIndex: cards.indexOf(card)
    });
  }

  /**
   * Dispatch de eventos personalizados
   */
  function dispatchCustomEvent(eventName: string, detail: object = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    grid?.dispatchEvent(event); // Optional chaining
  }

  /**
   * Manejador del evento hover en tarjeta
   */
  function handleCardHover(e: MouseEvent) {
    activateCard(e.currentTarget as HTMLElement);
  }

  /**
   * Limpia los estilos y eventos de desktop
   */
  function cleanupDesktop() {
    // *** CORRECCIÓN ***
    // Comprobar 'grid' al inicio de la función
    if (!grid) return; 

    grid.style.removeProperty('--panel-width-px');
    grid.style.removeProperty('--content-width-px');
    deactivateAllCards();

    cards.forEach(card => {
      card.removeEventListener('mouseenter', handleCardHover);
    });

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

  /**
   * Configura el comportamiento para desktop
   */
  function setupDesktop() {
    calculateAndSetWidths();

    cards.forEach(card => {
      card.addEventListener('mouseenter', handleCardHover, { passive: true });
    });

    if (!state.currentOpenCard && cards[0]) {
      cards[0].classList.add(CONFIG.CLASSES.open);
      cards[0].setAttribute(CONFIG.ATTRIBUTES.ariaExpanded, 'true');
      state.currentOpenCard = cards[0];
    }

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(debounce(calculateAndSetWidths, 100));
      if (grid) resizeObserver.observe(grid); // Verificación
    }
  }

  /**
   * Configura el acordeón según el viewport actual
   */
  function setupAccordion() {
    const wasDesktop = state.isDesktop;
    state.isDesktop = window.innerWidth > CONFIG.MOBILE_BREAKPOINT;

    if (wasDesktop !== state.isDesktop) {
      if (state.isDesktop) {
        setupDesktop();
      } else {
        cleanupDesktop();
      }

      dispatchCustomEvent('accordion:viewport-changed', {
        isDesktop: state.isDesktop
      });
    }
    else if (state.isDesktop && !resizeObserver) {
      calculateAndSetWidths();
    }
  }

  /**
   * Función de debounce optimizada
   */
  function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: number | undefined;

    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait) as unknown as number;
    };
  }

  /**
   * Manejador del resize con debounce
   */
  const handleResize = debounce(() => {
    setupAccordion();
  }, CONFIG.RESIZE_DEBOUNCE);

  /**
   * Maneja la visibilidad de la página
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      if (resizeObserver) resizeObserver.disconnect();
    } else {
      if (state.isDesktop && !resizeObserver && 'ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(debounce(calculateAndSetWidths, 100));
        if (grid) resizeObserver.observe(grid); // Verificación
      }
    }
  }

  /**
   * Limpia recursos al desmontar
   */
  function cleanup() {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    cleanupDesktop();

    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
    if (intersectionObserver) intersectionObserver.disconnect();

    cards.forEach(card => {
      card.removeEventListener('keydown', handleKeyDown);
    });
  }

  /**
   * Inicializa el componente
   */
  function init() {
    if (state.isInitialized) return;
    if (!initDOM()) return;

    detectUserPreferences();
    enhanceAccessibility();
    setupIntersectionObserver();
    setupAccordion();

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    state.isInitialized = true;

    window.addEventListener('beforeunload', cleanup);
    
    dispatchCustomEvent('accordion:initialized');
  }

  // Auto-inicialización cuando el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer API pública para control externo (opcional)
  window.AccordionGrid = {
    activateCard: (index: number) => {
      if (cards[index]) activateCard(cards[index]);
    },
    getCurrentCard: () => cards.indexOf(state.currentOpenCard as HTMLElement),
    refresh: () => calculateAndSetWidths(),
    destroy: cleanup
  };

})();

// *** CORRECCIÓN ***
// Añadir export vacío para tratar el archivo como un módulo
export {};