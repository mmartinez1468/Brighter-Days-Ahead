// =====================================================================
// NAVIGATION SYSTEM
// =====================================================================

/**
 * Initialize all navigation functionality including:
 * - Hamburger menu toggle
 * - Mobile dropdown handling
 * - Smooth scroll for anchor links
 * - Click outside to close menu
 */
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownLinks = document.querySelectorAll('.dropdown-item a');
    
    let lastScroll = 0;

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Handle dropdown toggle on mobile
            if (window.innerWidth <= 768 && this.classList.contains('has-dropdown')) {
                e.preventDefault();
                
                const dropdown = this.nextElementSibling;
                const parentItem = this.parentElement;
                
                // Toggle active class
                this.classList.toggle('active');
                dropdown.classList.toggle('active');
                parentItem.classList.toggle('active');
                
                // Close other dropdowns
                navLinks.forEach(otherLink => {
                    if (otherLink !== this && otherLink.classList.contains('has-dropdown')) {
                        otherLink.classList.remove('active');
                        otherLink.nextElementSibling.classList.remove('active');
                        otherLink.parentElement.classList.remove('active');
                    }
                });
            } else if (!this.classList.contains('has-dropdown')) {
                // Close mobile menu for non-dropdown links
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking on dropdown items
    dropdownLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            closeMobileMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /**
     * Helper function to close mobile menu
     */
    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
}

// =====================================================================
// NAVBAR LOGO SHRINK EFFECT
// =====================================================================

/**
 * Initialize logo shrink effect on scroll
 * Only applies to desktop screens (>= 1024px)
 */
function initializeLogoShrink() {
    const heroSection = document.getElementById("heroLanding");
    const navbar = document.querySelector(".navbar");
    const navLogo = document.querySelector(".nav-logo");

    if (!heroSection || !navbar || !navLogo) return;

    document.addEventListener("scroll", function() {
        if (window.innerWidth >= 1024) {
            if (window.scrollY > heroSection.offsetHeight - navbar.offsetHeight) {
                navLogo.classList.add("shrink");
            } else {
                navLogo.classList.remove("shrink");
            }
        } else {
            // Reset logo if resizing back to mobile
            navLogo.classList.remove("shrink");
        }
    });
}

// =====================================================================
// NAVBAR SCROLL EFFECT
// =====================================================================

/**
 * Add scrolled class to navbar when user scrolls past 50% of hero section
 * Creates blur/background effect on navbar
 */
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const landing = document.getElementById('heroLanding');

    if (!navbar || !landing) return;

    window.addEventListener('scroll', () => {
        const landingHeight = landing.offsetHeight;
        const triggerPoint = landingHeight * 0.5; // 50% of landing

        if (window.scrollY > triggerPoint) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// =====================================================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// =====================================================================

/**
 * Dual Intersection Observer to handle both one-time and repeating animations
 * Supports responsive animation classes (animate, md-animate, lg-animate, xl-animate)
 */
function initializeScrollAnimations() {
    // Get elements with different animation classes (including responsive ones)
    const oneTimeElements = document.querySelectorAll('.animate, .md-animate, .lg-animate, .xl-animate');
    const repeatingElements = document.querySelectorAll('.animate-repeat, .md-animate-repeat, .lg-animate-repeat, .xl-animate-repeat');
    
    // Observer for one-time animations (original behavior)
    const oneTimeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to prevent repeat
                oneTimeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observer for repeating animations
    const repeatingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class when entering viewport
                entry.target.classList.add('visible');
            } else {
                // Instantly remove visible class and temporarily remove delay
                if (entry.intersectionRatio === 0) {
                    // Store original delay classes
                    const delayClasses = [];
                    entry.target.classList.forEach(className => {
                        if (className.includes('delay-')) {
                            delayClasses.push(className);
                        }
                    });
                    
                    // Remove delay classes temporarily for instant reset
                    delayClasses.forEach(delayClass => {
                        entry.target.classList.remove(delayClass);
                    });
                    
                    // Remove visible class instantly
                    entry.target.classList.remove('visible');
                    
                    // Restore delay classes after a brief moment for next animation
                    setTimeout(() => {
                        delayClasses.forEach(delayClass => {
                            entry.target.classList.add(delayClass);
                        });
                    }, 50);
                }
            }
        });
    }, {
        threshold: [0, 0.1], // Multiple thresholds for better mobile detection
        rootMargin: '0px 0px -5% 0px' // Reduced margin for mobile
    });
    
    // Observe one-time animation elements
    oneTimeElements.forEach(element => {
        oneTimeObserver.observe(element);
    });
    
    // Observe repeating animation elements
    repeatingElements.forEach(element => {
        repeatingObserver.observe(element);
    });
    
    // Handle elements already in viewport on page load
    setTimeout(() => {
        // One-time elements
        oneTimeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            ) {
                element.classList.add('visible');
            }
        });
        
        // Repeating elements
        repeatingElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            ) {
                element.classList.add('visible');
            }
        });
    }, 100);
}

// =====================================================================
// HERO SCROLL INDICATOR
// =====================================================================

/**
 * Initialize hero scroll indicator functionality
 * - Click to scroll to next section
 * - Fade out when user scrolls down
 */
function initializeHeroScrollIndicator() {
    const heroScrollIndicator = document.getElementById('heroScrollIndicator');
    const scrollExpandSection = document.getElementById('scrollExpandSection');

    if (!heroScrollIndicator || !scrollExpandSection) return;

    // Click to scroll to next section
    heroScrollIndicator.addEventListener('click', function() {
        scrollExpandSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Fade out on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            heroScrollIndicator.style.opacity = '0';
            heroScrollIndicator.style.pointerEvents = 'none';
        } else {
            heroScrollIndicator.style.opacity = '1';
            heroScrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// =====================================================================
// SCROLL EXPAND VIDEO EFFECT
// =====================================================================

/**
 * Initialize scroll-based video expand effect
 * Video scales from 10% to 100% as user scrolls through section
 * Overlay rises from bottom at 50% progress
 */
function initializeScrollExpandEffect() {
    const section = document.getElementById('scrollExpandSection');
    const videoBg = document.getElementById('scrollExpandVideoBg');
    const overlay = document.getElementById('scrollExpandOverlay');
    const video = document.getElementById('bgVideo');

    if (!section || !videoBg || !video) return;

    // Ensure video stays muted and plays
    video.muted = true;
    video.play().catch(e => console.log('Video autoplay failed:', e));

    function updateScrollExpandEffect() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        let progress = 0;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrolledIntoSection = windowHeight - rect.top;
            const totalScrollDistance = rect.height;
            progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollDistance));
        } else if (rect.bottom <= 0) {
            progress = 1;
        }
        
        // Scale from 0.1 (10%) to 1 (100%)
        const minScale = 0.1;
        const maxScale = 1;
        const scale = minScale + (progress * (maxScale - minScale));
        
        videoBg.style.transform = `scale(${scale})`;
        
        // Start rising the bottom div at 50% progress
        if (overlay) {
            if (progress >= 0.5) {
                const divProgress = (progress - 0.5) / 0.5;
                const divHeight = divProgress * 30;
                overlay.style.height = `${divHeight}%`;
            } else {
                overlay.style.height = '0%';
            }
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateScrollExpandEffect);

    // Initial update
    updateScrollExpandEffect();
}

// =====================================================================
// INITIALIZE ALL ON DOM LOADED
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Navigation
    initializeNavigation();
    initializeLogoShrink();
    initializeNavbarScroll();
    
    // Animations
    initializeScrollAnimations();
    
    // Hero Section
    initializeHeroScrollIndicator();
    
    // Video Effects
    initializeScrollExpandEffect();
});