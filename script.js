/**
 * Portfolio Website - JavaScript
 * Handles hamburger menu toggle and smooth scrolling
 */

// =============================================
// DOM ELEMENTS
// =============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// =============================================
// HAMBURGER MENU TOGGLE
// =============================================

/**
 * Toggle the mobile navigation menu
 */
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

/**
 * Close the mobile navigation menu
 */
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Event listener for hamburger button
hamburger.addEventListener('click', toggleMenu);

// =============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// =============================================

/**
 * Smooth scroll to target section when nav link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Get the target section
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        // Only prevent default if target exists
        if (targetSection) {
            e.preventDefault();

            // Close mobile menu if open
            closeMenu();

            // Scroll to the target section smoothly
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Add a slight delay and update URL (for bookmarking)
            setTimeout(() => {
                window.history.pushState(null, null, `#${targetId}`);
            }, 300);
        }
    });
});

// =============================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// =============================================

/**
 * Close menu when clicking outside of it
 */
document.addEventListener('click', (e) => {
    // Check if click is outside hamburger and nav menu
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
    }
});

// =============================================
// CLOSE MENU ON ESC KEY
// =============================================

/**
 * Close menu when pressing Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// =============================================
// ACTIVE LINK HIGHLIGHTING
// =============================================

/**
 * Update active nav link based on current scroll position
 */
function updateActiveLink() {
    let currentSection = '';

    // Get all sections
    const sections = document.querySelectorAll('section');

    // Check which section is in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // If section is in viewport, mark it as current
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveLink);

// =============================================
// SCROLL TO TOP BUTTON (OPTIONAL)
// =============================================

/**
 * Optional: Show/hide "scroll to top" button based on scroll position
 * Uncomment this section if you want to add a scroll-to-top button to your HTML
 */

/*
const scrollTopButton = document.getElementById('scroll-top-button');

if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
*/

// =============================================
// INITIALIZATION
// =============================================

/**
 * Run initialization tasks when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    // Handle hash from URL (for direct links)
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Update active link on page load
    updateActiveLink();
});

// =============================================
// END OF SCRIPT
// =============================================
