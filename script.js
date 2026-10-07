/**
 * Mithun Shetty - Software Engineer Portfolio
 * Interactive Scripts:
 * - Night/Dark mode toggling with CSS media query detection (prefers-color-scheme)
 * - Hero pixel toggle button and navbar toggle synchronization
 * - Dynamic system theme change listener
 * - Mobile navigation menu
 * - Active nav link scrollspy
 * - Retro 8-bit sound effects for pixel buttons
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // NIGHT / DARK MODE THEME SYSTEM
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-theme-toggle');
  const htmlElement = document.documentElement;
  
  // Media query for system / browser color scheme
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // 1. Check for stored user preference in localStorage
  const storedTheme = localStorage.getItem('theme');

  // Helper to determine the effective theme
  function getEffectiveTheme() {
    const explicitTheme = htmlElement.getAttribute('data-theme');
    if (explicitTheme) return explicitTheme;
    if (storedTheme) return storedTheme;
    return darkModeMediaQuery.matches ? 'dark' : 'light';
  }

  // Set up initial theme state
  if (storedTheme) {
    // If user explicitly saved preference, apply it
    setTheme(storedTheme, false);
  } else {
    // If no preference saved, allow CSS media queries to style the page naturally.
    // Sync toggle button icons & aria attributes to match browser default.
    updateToggleUI(darkModeMediaQuery.matches ? 'dark' : 'light');
  }

  // Update theme function
  function setTheme(theme, saveToStorage = true) {
    htmlElement.setAttribute('data-theme', theme);
    if (saveToStorage) {
      localStorage.setItem('theme', theme);
    }
    updateToggleUI(theme);
  }

  // Update button visual states, icons, and ARIA labels
  function updateToggleUI(theme) {
    const isDark = theme === 'dark';

    // 1. Header toggle button
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute(
        'title', 
        isDark ? 'Switch to day/light mode' : 'Switch to night/dark mode'
      );
    }

    // 2. Hero pixel toggle button
    if (heroThemeToggleBtn) {
      const toggleText = heroThemeToggleBtn.querySelector('.pixel-toggle-text');
      const toggleIcon = heroThemeToggleBtn.querySelector('.pixel-toggle-icon');
      if (toggleText) {
        toggleText.textContent = isDark ? 'NIGHT MODE' : 'DAY MODE';
      }
      if (toggleIcon) {
        toggleIcon.textContent = isDark ? '🌙' : '☀️';
      }
      heroThemeToggleBtn.setAttribute(
        'title',
        isDark ? 'Current: Night Mode (Click for Day Mode)' : 'Current: Day Mode (Click for Night Mode)'
      );
    }
  }

  // Toggle button click handler
  function handleToggleClick() {
    playRetroBeep();
    const current = getEffectiveTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', handleToggleClick);
  }

  if (heroThemeToggleBtn) {
    heroThemeToggleBtn.addEventListener('click', handleToggleClick);
  }

  // Listen for browser/system preference changes dynamically
  darkModeMediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't chosen an explicit override in localStorage
    if (!localStorage.getItem('theme')) {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      updateToggleUI(newSystemTheme);
    }
  });

  // ----------------------------------------------------
  // RETRO 8-BIT SOUND EFFECT (Web Audio API)
  // ----------------------------------------------------
  function playRetroBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Authentic 8-bit square wave
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio not permitted or not supported
    }
  }

  // Optional click sound for pixel action buttons
  const pixelButtons = document.querySelectorAll('.pixel-btn');
  pixelButtons.forEach(btn => {
    if (btn !== heroThemeToggleBtn) {
      btn.addEventListener('click', () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch {
          // ignore
        }
      });
    }
  });

  // ----------------------------------------------------
  // MOBILE MENU TOGGLE
  // ----------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const siteNav = document.getElementById('site-nav');

  if (mobileMenuBtn && siteNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('active');
    });

    // Close mobile nav when clicking a nav link
    const navLinks = siteNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------
  // ACTIVE NAV LINK HIGHLIGHT ON SCROLL
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ----------------------------------------------------
  // DYNAMIC CURRENT YEAR
  // ----------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
