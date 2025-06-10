/* ===================================
   CREDIT REPAIR WEBSITE - JAVASCRIPT
   Interactive Functionality & Animations
   =================================== */

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const elementPosition = element.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Add CSS class with animation
 */
function addClassWithDelay(element, className, delay = 0) {
  setTimeout(() => {
    element.classList.add(className);
  }, delay);
}

/**
 * Format phone number
 */
function formatPhoneNumber(value) {
  const phone = value.replace(/\D/g, '');
  const match = phone.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return !match[2] ? match[1] : !match[3] ? `(${match[1]}) ${match[2]}` : `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===================================
// MOBILE NAVIGATION
// ===================================

class MobileNavigation {
  constructor() {
    this.hamburger = document.getElementById('mobileToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // Create mobile menu if it doesn't exist
    this.createMobileMenu();
    
    // Bind events
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }
    
    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => this.handleResize(), 250));
  }
  
  createMobileMenu() {
    // Add mobile menu classes for better styling
    if (this.navMenu) {
      this.navMenu.classList.add('mobile-nav-menu');
    }
  }
  
  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.updateMenuState();
  }
  
  openMenu() {
    this.isOpen = true;
    this.updateMenuState();
  }
  
  closeMenu() {
    this.isOpen = false;
    this.updateMenuState();
  }
  
  updateMenuState() {
    if (this.hamburger) {
      this.hamburger.classList.toggle('active', this.isOpen);
    }
    
    if (this.navMenu) {
      this.navMenu.classList.toggle('active', this.isOpen);
      
      // Animate menu items
      if (this.isOpen) {
        this.navMenu.style.display = 'flex';
        setTimeout(() => {
          this.navMenu.style.opacity = '1';
          this.navMenu.style.transform = 'translateY(0)';
        }, 10);
      } else {
        this.navMenu.style.opacity = '0';
        this.navMenu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          this.navMenu.style.display = 'none';
        }, 300);
      }
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }
  
  handleOutsideClick(e) {
    if (this.isOpen && !e.target.closest('.nav-container')) {
      this.closeMenu();
    }
  }
  
  handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth >= 1024) {
      this.closeMenu();
      document.body.style.overflow = '';
    }
  }
}

// ===================================
// HEADER SCROLL EFFECTS
// ===================================

class HeaderEffects {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 100;
    
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
    this.handleScroll(); // Initial call
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// ===================================
// FAQ ACCORDION
// ===================================

class FAQAccordion {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.init();
  }
  
  init() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => this.toggleItem(item));
      }
    });
  }
  
  toggleItem(item) {
    const isActive = item.classList.contains('active');
    
    // Close all other items (optional: remove this for multiple open items)
    this.faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active', !isActive);
    
    // Smooth scroll to item if opening
    if (!isActive) {
      setTimeout(() => {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  }
}

// ===================================
// FLOATING ACTION BUTTON
// ===================================

class FloatingActionButton {
  constructor() {
    this.fab = document.getElementById('floatingBtn');
    this.fabMain = this.fab?.querySelector('.fab-main');
    this.fabMenu = this.fab?.querySelector('.fab-menu');
    this.isOpen = false;
    this.scrollThreshold = 300;
    
    this.init();
  }
  
  init() {
    if (!this.fab) return;
    
    // Toggle menu on click
    if (this.fabMain) {
      this.fabMain.addEventListener('click', () => this.toggleMenu());
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Show/hide FAB based on scroll position
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    
    this.handleScroll(); // Initial call
  }
  
  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.fab.classList.toggle('active', this.isOpen);
    
    // Rotate main button
    if (this.fabMain) {
      this.fabMain.style.transform = this.isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    }
  }
  
  closeMenu() {
    this.isOpen = false;
    this.fab.classList.remove('active');
    if (this.fabMain) {
      this.fabMain.style.transform = 'rotate(0deg)';
    }
  }
  
  handleOutsideClick(e) {
    if (this.isOpen && !e.target.closest('.floating-action-btn')) {
      this.closeMenu();
    }
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > this.scrollThreshold) {
      this.fab.style.opacity = '1';
      this.fab.style.visibility = 'visible';
      this.fab.style.transform = 'scale(1)';
    } else {
      this.fab.style.opacity = '0';
      this.fab.style.visibility = 'hidden';
      this.fab.style.transform = 'scale(0.8)';
      this.closeMenu();
    }
  }
}

// ===================================
// FORM HANDLING
// ===================================

class FormHandler {
  constructor() {
    this.form = document.getElementById('creditAnalysisForm');
    this.submitButton = this.form?.querySelector('.form-submit-btn');
    this.originalButtonText = this.submitButton?.innerHTML;
    
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.setupValidation();
    
    // Phone number formatting
    this.setupPhoneFormatting();
  }
  
  setupValidation() {
    const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  setupPhoneFormatting() {
    const phoneInput = this.form.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhoneNumber(e.target.value);
      });
    }
  }
  
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    this.clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }
    
    return isValid;
  }
  
  showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message
    field.parentNode.appendChild(errorElement);
  }
  
  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  validateForm() {
    const requiredFields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.validateForm()) {
      this.showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Collect checkbox values
      const checkboxes = this.form.querySelectorAll('input[type="checkbox"]:checked');
      const creditIssues = Array.from(checkboxes).map(cb => cb.value);
      data.creditIssues = creditIssues;
      
      // Simulate API call (replace with actual endpoint)
      await this.submitToAPI(data);
      
      // Show success
      this.showSuccessModal();
      this.form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('Something went wrong. Please try again.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }
  
  async submitToAPI(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would normally send to your actual API
    console.log('Form data:', data);
    
    // For demo purposes, we'll just log the data
    // In production, replace with:
    // const response = await fetch('/api/submit-form', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
  }
  
  setLoadingState(isLoading) {
    if (!this.submitButton) return;
    
    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3"/>
          <path fill="currentColor" d="M12 2v4a8 8 0 0 1 0 16v4c6.627 0 12-5.373 12-12S18.627 2 12 2z"/>
        </svg>
        <span>Processing...</span>
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = this.originalButtonText;
    }
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => this.removeNotification(notification), 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.removeNotification(notification);
    });
  }
  
  removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('active');
    }
  }
}

// ===================================
// MODAL MANAGEMENT
// ===================================

class ModalManager {
  constructor() {
    this.modals = document.querySelectorAll('.modal');
    this.init();
  }
  
  init() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.closeModal(modal);
      });
    });
    
    // Overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.closeModal(modal);
      });
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          this.closeModal(activeModal);
        }
      }
    });
  }
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }
  
  closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.observer = null;
    
    this.init();
  }
  
  init() {
    if (!window.IntersectionObserver) {
      // Fallback for older browsers
      this.elements.forEach(el => el.classList.add('animated'));
      return;
    }
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => {
      el.classList.add('animate-on-scroll');
      this.observer.observe(el);
    });
  }
  
  animateElement(element) {
    const animationType = element.dataset.animate;
    const delay = parseInt(element.dataset.delay) || 0;
    
    setTimeout(() => {
      element.classList.add('animated');
      
      // Add specific animation class if specified
      if (animationType) {
        element.classList.add(`animate-${animationType}`);
      }
    }, delay);
  }
}

// ===================================
// SMOOTH SCROLLING
// ===================================

class SmoothScrolling {
  constructor() {
    this.init();
  }
  
  init() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }
  
  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    const targetId = href.slice(1);
    
    if (targetId) {
      e.preventDefault();
      scrollToSection(targetId);
    }
  }
}

// ===================================
// CREDIT SCORE ANIMATION
// ===================================

class CreditScoreAnimation {
  constructor() {
    this.scoreElement = document.querySelector('.current-score');
    this.changeElement = document.querySelector('.score-change');
    this.gaugeElement = document.querySelector('.gauge-fill');
    
    this.init();
  }
  
  init() {
    if (!this.scoreElement) return;
    
    // Animate when in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateScore();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(this.scoreElement);
  }
  
  animateScore() {
    const finalScore = 742;
    const finalChange = 187;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = this.easeOutCubic(progress);
      
      // Animate score
      const currentScore = Math.round(555 + (finalScore - 555) * easeProgress);
      this.scoreElement.textContent = currentScore;
      
      // Animate change
      const currentChange = Math.round(finalChange * easeProgress);
      if (this.changeElement) {
        this.changeElement.textContent = `+${currentChange}`;
      }
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

// ===================================
// GLOBAL FUNCTIONS
// ===================================

/**
 * Global function to scroll to section (called from HTML)
 */
window.scrollToSection = scrollToSection;

/**
 * Global function to open WhatsApp modal
 */
window.openWhatsAppChat = function() {
  // Direct WhatsApp link
  const whatsappUrl = 'https://wa.me/15551234567?text=Hi!%20I\'m%20interested%20in%20credit%20repair%20services.%20Can%20you%20help%20me%20get%20started?';
  window.open(whatsappUrl, '_blank');
};

/**
 * Global function to close modal
 */
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/**
 * Global function to toggle FAB
 */
window.toggleFAB = function() {
  const fab = window.floatingActionButton;
  if (fab) {
    fab.toggleMenu();
  }
};

// ===================================
// PERFORMANCE MONITORING
// ===================================

class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Log page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
    });
    
    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
}

// ===================================
// INITIALIZATION
// ===================================

class App {
  constructor() {
    this.components = {};
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize all components
      this.components.mobileNav = new MobileNavigation();
      this.components.headerEffects = new HeaderEffects();
      this.components.faqAccordion = new FAQAccordion();
      this.components.floatingActionButton = new FloatingActionButton();
      this.components.formHandler = new FormHandler();
      this.components.modalManager = new ModalManager();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.smoothScrolling = new SmoothScrolling();
      this.components.creditScoreAnimation = new CreditScoreAnimation();
      this.components.performanceMonitor = new PerformanceMonitor();
      
      // Make some components globally accessible
      window.modalManager = this.components.modalManager;
      window.floatingActionButton = this.components.floatingActionButton;
      
      console.log('All components initialized successfully');
      
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }
}

// ===================================
// CSS INJECTION FOR DYNAMIC STYLES
// ===================================

function injectDynamicStyles() {
  const styles = `
    /* Form Error Styles */
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .field-error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .field-error::before {
      content: '⚠';
      font-size: 0.875rem;
    }
    
    /* Loading Animation */
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Notification Styles */
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    
    .notification-error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-success {
      border-left: 4px solid #10b981;
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Mobile Menu Styles */
    @media (max-width: 1023px) {
      .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        transform: translateY(-20px);
        opacity: 0;
        display: none;
        z-index: 1000;
      }
      
      .nav-menu.active {
        display: flex;
      }
      
      .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }
      
      .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
    
    /* Header Scroll Effects */
    .header.scrolled {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      transition: transform 0.3s ease-out, background 0.3s ease-out, box-shadow 0.3s ease-out;
    }
    
    /* Floating Action Button */
    .floating-action-btn {
      transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ===================================
// START APPLICATION
// ===================================

// Inject dynamic styles
injectDynamicStyles();

// Initialize application
const app = new App();

// ===================================
// ADDITIONAL INTERACTIVE FEATURES
// ===================================

/**
 * Pricing Card Interactions
 */
class PricingInteractions {
  constructor() {
    this.pricingCards = document.querySelectorAll('.pricing-card');
    this.init();
  }
  
  init() {
    this.pricingCards.forEach(card => {
      const button = card.querySelector('.pricing-btn');
      if (button) {
        button.addEventListener('click', () => this.handlePricingClick(card));
      }
    });
  }
  
  handlePricingClick(card) {
    const planName = card.querySelector('h3')?.textContent || 'Selected Plan';
    
    // Scroll to contact form
    scrollToSection('contact');
    
    // Pre-fill form if possible
    setTimeout(() => {
      const goalTextarea = document.querySelector('textarea[name="goals"]');
      if (goalTextarea && !goalTextarea.value) {
        goalTextarea.value = `I'm interested in the ${planName} credit repair package. Please contact me with more details.`;
      }
    }, 500);
    
    // Show notification
    this.showPlanSelection(planName);
  }
  
  showPlanSelection(planName) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${planName} selected! Please fill out the form below.</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }
}

/**
 * Testimonial Visibility Fix
 */
class TestimonialVisibilityFix {
  constructor() {
    this.init();
  }
  
  init() {
    // Ensure testimonials are always visible
    this.forceShowTestimonials();
    
    // Check visibility periodically
    setInterval(() => {
      this.forceShowTestimonials();
    }, 1000);
    
    // Also check on scroll
    window.addEventListener('scroll', debounce(() => {
      this.forceShowTestimonials();
    }, 100));
  }
  
  forceShowTestimonials() {
    const testimonialCards = document.querySelectorAll('.result-card');
    const resultsSection = document.querySelector('.results');
    
    // Ensure results section is visible
    if (resultsSection) {
      resultsSection.style.opacity = '1';
      resultsSection.style.visibility = 'visible';
      resultsSection.style.display = 'block';
    }
    
    // Ensure all testimonial cards are visible
    testimonialCards.forEach((card, index) => {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.transform = 'translateY(0)';
      card.style.display = 'block';
      
      // Remove any animation classes that might be hiding them
      card.classList.remove('animate-on-scroll');
      card.classList.add('animated');
      
      // Ensure all child elements are visible
      const allChildren = card.querySelectorAll('*');
      allChildren.forEach(child => {
        child.style.opacity = '1';
        child.style.visibility = 'visible';
      });
    });
    
    // Ensure the grid is visible
    const resultsGrid = document.querySelector('.results-grid');
    if (resultsGrid) {
      resultsGrid.style.opacity = '1';
      resultsGrid.style.visibility = 'visible';
      resultsGrid.style.display = 'grid';
    }
  }
}

/**
 * Testimonial Card Animations
 */
class TestimonialAnimations {
  constructor() {
    this.testimonialCards = document.querySelectorAll('.result-card');
    this.init();
  }
  
  init() {
    this.testimonialCards.forEach((card, index) => {
      // Ensure card is visible first
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      
      // Add hover effects
      card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
      card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
      
      // Simple fade-in animation on load (no viewport detection issues)
      setTimeout(() => {
        card.classList.add('animate-in');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }
  
  handleCardHover(card, isHovering) {
    const improvementScore = card.querySelector('.improvement-score');
    if (improvementScore) {
      if (isHovering) {
        improvementScore.style.transform = 'scale(1.1) rotate(5deg)';
      } else {
        improvementScore.style.transform = 'scale(1) rotate(0deg)';
      }
    }
  }
}

/**
 * Service Card Interactions
 */
class ServiceCardInteractions {
  constructor() {
    this.serviceCards = document.querySelectorAll('.service-card');
    this.init();
  }
  
  init() {
    this.serviceCards.forEach(card => {
      card.addEventListener('click', () => this.handleServiceClick(card));
    });
  }
  
  handleServiceClick(card) {
    const serviceName = card.querySelector('h3')?.textContent || 'Service';
    
    // Add click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
    
    // Scroll to contact form
    scrollToSection('contact');
    
    // Pre-fill form
    setTimeout(() => {
      const goalTextarea = document.querySelector('textarea[name="goals"]');
      if (goalTextarea) {
        const currentValue = goalTextarea.value;
        const serviceText = `I'm interested in ${serviceName}. `;
        if (!currentValue.includes(serviceText)) {
          goalTextarea.value = serviceText + currentValue;
        }
      }
    }, 500);
  }
}

/**
 * Progress Bar Animations
 */
class ProgressBarAnimations {
  constructor() {
    this.progressBars = document.querySelectorAll('.progress-fill');
    this.init();
  }
  
  init() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    this.progressBars.forEach(bar => {
      // Store original width
      const width = bar.style.width;
      bar.style.width = '0%';
      bar.dataset.targetWidth = width;
      
      observer.observe(bar);
    });
  }
  
  animateProgressBar(bar) {
    const targetWidth = bar.dataset.targetWidth;
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const targetValue = parseInt(targetWidth);
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = this.easeOutCubic(progress);
      const currentWidth = targetValue * easeProgress;
      
      bar.style.width = `${currentWidth}%`;
      
      if (currentStep >= steps) {
        clearInterval(interval);
        bar.style.width = targetWidth;
      }
    }, stepDuration);
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

/**
 * Contact Method Tracking
 */
class ContactTracking {
  constructor() {
    this.init();
  }
  
  init() {
    // Track WhatsApp clicks
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('whatsapp_click', {
          phone_number: '+15551234567',
          source: 'website'
        });
      });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('email_click', {
          email: link.getAttribute('href').replace('mailto:', '')
        });
      });
    });
    
    // Track form submissions
    const form = document.getElementById('creditAnalysisForm');
    if (form) {
      form.addEventListener('submit', () => {
        this.trackEvent('form_submission', {
          form_type: 'credit_analysis'
        });
      });
    }
  }
  
  trackEvent(eventName, properties = {}) {
    // Analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // Integration with Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, properties);
    }
  }
}

/**
 * Scroll Progress Indicator
 */
class ScrollProgress {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }
  
  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #2563eb, #10b981);
      z-index: 10000;
      transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
  }
  
  init() {
    window.addEventListener('scroll', throttle(() => this.updateProgress(), 16));
  }
  
  updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    
    this.progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
  }
}

/**
 * Lazy Loading for Images
 */
class LazyImageLoading {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }
  
  init() {
    if (!window.IntersectionObserver) {
      // Fallback for older browsers
      this.images.forEach(img => this.loadImage(img));
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    this.images.forEach(img => observer.observe(img));
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }
}

/**
 * Keyboard Navigation Enhancement
 */
class KeyboardNavigation {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  
  handleKeydown(e) {
    // Skip link functionality
    if (e.key === 'Tab' && e.shiftKey && e.target === document.body) {
      this.createSkipLink();
    }
    
    // Navigate FAQ with arrow keys
    if (e.target.closest('.faq-question')) {
      this.handleFAQNavigation(e);
    }
  }
  
  createSkipLink() {
    if (document.querySelector('.skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  handleFAQNavigation(e) {
    const faqItems = Array.from(document.querySelectorAll('.faq-question'));
    const currentIndex = faqItems.indexOf(e.target);
    
    let nextIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % faqItems.length;
        faqItems[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : faqItems.length - 1;
        faqItems[nextIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        faqItems[0].focus();
        break;
      case 'End':
        e.preventDefault();
        faqItems[faqItems.length - 1].focus();
        break;
    }
  }
}

/**
 * Error Boundary for JavaScript
 */
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    window.addEventListener('error', (e) => this.handleError(e));
    window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
  }
  
  handleError(e) {
    console.error('JavaScript Error:', e.error);
    
    // Log to external service in production
    this.logError({
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack
    });
  }
  
  handlePromiseRejection(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    this.logError({
      type: 'promise_rejection',
      reason: e.reason
    });
  }
  
  logError(errorInfo) {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, etc.
    console.log('Error logged:', errorInfo);
  }
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

/**
 * Resource Preloader
 */
class ResourcePreloader {
  constructor() {
    this.init();
  }
  
  init() {
    // Preload critical resources
    this.preloadCriticalImages();
    this.preloadFonts();
  }
  
  preloadCriticalImages() {
    const criticalImages = [
      // Add paths to critical images
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  preloadFonts() {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
    ];
    
    fonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        this.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }
}

/**
 * Memory Management
 */
class MemoryManager {
  constructor() {
    this.listeners = new Map();
    this.init();
  }
  
  init() {
    // Track memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) {
          console.warn('High memory usage detected');
          this.cleanup();
        }
      }, 30000);
    }
  }
  
  addListener(element, event, handler) {
    const key = `${element}-${event}`;
    this.listeners.set(key, { element, event, handler });
    element.addEventListener(event, handler);
  }
  
  cleanup() {
    // Clean up event listeners for removed elements
    this.listeners.forEach((listener, key) => {
      if (!document.contains(listener.element)) {
        listener.element.removeEventListener(listener.event, listener.handler);
        this.listeners.delete(key);
      }
    });
  }
}

// ===================================
// INITIALIZE ADDITIONAL COMPONENTS
// ===================================

// Initialize additional interactive features
document.addEventListener('DOMContentLoaded', () => {
  try {
    new TestimonialVisibilityFix(); // Add this first to ensure visibility
    new PricingInteractions();
    new TestimonialAnimations();
    new ServiceCardInteractions();
    new ProgressBarAnimations();
    new ContactTracking();
    new ScrollProgress();
    new LazyImageLoading();
    new KeyboardNavigation();
    new ErrorHandler();
    new ResourcePreloader();
    new MemoryManager();
    
    console.log('All additional components initialized successfully');
    
  } catch (error) {
    console.error('Error initializing additional components:', error);
  }
});

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.log('ServiceWorker registration failed');
      });
  });
}

// ===================================
// FINAL INITIALIZATION COMPLETE
// ===================================

console.log('🚀 Credit Repair Website JavaScript fully loaded and initialized!');
console.log('Features included:');
console.log('✅ Mobile Navigation');
console.log('✅ Header Scroll Effects');
console.log('✅ FAQ Accordion');
console.log('✅ Floating Action Button');
console.log('✅ Form Handling & Validation');
console.log('✅ Modal Management');
console.log('✅ Scroll Animations');
console.log('✅ Smooth Scrolling');
console.log('✅ Credit Score Animation');
console.log('✅ Performance Monitoring');
console.log('✅ Accessibility Enhancements');
console.log('✅ Error Handling');
console.log('✅ Memory Management');
console.log('✅ Progressive Web App Features');