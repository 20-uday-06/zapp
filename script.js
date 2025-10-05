// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const fab = document.getElementById('fab');
const waitlistModal = document.getElementById('waitlistModal');
const businessModal = document.getElementById('businessModal');

// Navigation functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // FAB is always visible - no need to show/hide based on scroll
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add click handlers to navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        scrollToSection(sectionId);
    });
});

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, observerOptions);

// Observe all counters
document.querySelectorAll('.counter, .stat-number[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Modal functionality
function openWaitlistModal() {
    waitlistModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    const modalContent = waitlistModal.querySelector('.modal-content');
    modalContent.style.animation = 'slideIn 0.3s ease';
}

function closeWaitlistModal() {
    const modalContent = waitlistModal.querySelector('.modal-content');
    modalContent.style.animation = 'slideOut 0.3s ease';
    
    setTimeout(() => {
        waitlistModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function openBusinessModal() {
    businessModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    const modalContent = businessModal.querySelector('.modal-content');
    modalContent.style.animation = 'slideIn 0.3s ease';
}

function closeBusinessModal() {
    const modalContent = businessModal.querySelector('.modal-content');
    modalContent.style.animation = 'slideOut 0.3s ease';
    
    setTimeout(() => {
        businessModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === waitlistModal) {
        closeWaitlistModal();
    }
    if (e.target === businessModal) {
        closeBusinessModal();
    }
});

// Form submissions
document.querySelector('.waitlist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.type = 'user'; // Mark as user waitlist
    
    // Get submit button
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Joining...';
    submitButton.disabled = true;
    
    try {
        // Send data to backend
        const response = await fetch('/.netlify/functions/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            submitButton.textContent = '✓ Welcome to Zapp!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                closeWaitlistModal();
                showNotification('Successfully joined the waitlist! We\'ll be in touch soon.', 'success');
                e.target.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                // Refresh counts after successful submission
                updateHeroStats();
            }, 1500);
        } else {
            throw new Error(result.message || 'Failed to join waitlist');
        }
    } catch (error) {
        console.error('Error submitting waitlist:', error);
        submitButton.textContent = '❌ Error';
        submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 2000);
        
        showNotification('Failed to join waitlist. Please try again.', 'error');
    }
});

document.querySelector('.business-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.type = 'business'; // Mark as business waitlist
    
    // Get submit button
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    try {
        // Send data to backend
        const response = await fetch('/.netlify/functions/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            submitButton.textContent = '✓ Welcome Partner!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                closeBusinessModal();
                showNotification('Thank you for your interest! Our team will contact you within 24 hours.', 'success');
                e.target.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                // Refresh counts after successful submission
                updateHeroStats();
            }, 1500);
        } else {
            throw new Error(result.message || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Error submitting business form:', error);
        submitButton.textContent = '❌ Error';
        submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 2000);
        
        showNotification('Failed to submit application. Please try again.', 'error');
    }
});

// Newsletter subscription
document.querySelector('.newsletter').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const input = e.target.querySelector('input');
    const button = e.target.querySelector('button');
    const email = input.value;
    
    if (!email) return;
    
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Subscribed!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            showNotification('Successfully subscribed to updates!', 'success');
            input.value = '';
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 1000);
    }, 800);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const bgColor = type === 'success' ? 
        'linear-gradient(135deg, #10b981, #059669)' : 
        type === 'error' ? 
        'linear-gradient(135deg, #ef4444, #dc2626)' : 
        'linear-gradient(135deg, #00d4ff, #8b5cf6)';
        
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        z-index: 2001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Parallax effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.service-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Service category interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        showServiceDetails(category);
    });
});

function showServiceDetails(category) {
    const details = {
        healthcare: {
            title: 'Healthcare Services',
            description: 'Book appointments with doctors, dentists, specialists, and medical facilities.',
            features: ['Real-time availability', 'Insurance integration', 'Medical records sync', 'Telemedicine options']
        },
        beauty: {
            title: 'Beauty & Wellness',
            description: 'Schedule services at salons, spas, massage therapy, and wellness centers.',
            features: ['Service customization', 'Therapist preferences', 'Package deals', 'Loyalty rewards']
        },
        restaurants: {
            title: 'Restaurants',
            description: 'Reserve tables at fine dining, casual restaurants, and food experiences.',
            features: ['Table reservations', 'Menu previews', 'Special requests', 'Group bookings']
        },
        fitness: {
            title: 'Fitness',
            description: 'Book sessions at gyms, with personal trainers, yoga studios, and sports facilities.',
            features: ['Class schedules', 'Equipment booking', 'Trainer matching', 'Progress tracking']
        },
        professional: {
            title: 'Professional Services',
            description: 'Schedule consultations with experts, lawyers, financial advisors, and consultants.',
            features: ['Video consultations', 'Document sharing', 'Secure payments', 'Follow-up scheduling']
        },
        home: {
            title: 'Home Services',
            description: 'Book cleaning, repairs, maintenance, and home improvement services.',
            features: ['Service history', 'Professional ratings', 'Emergency bookings', 'Quality guarantee']
        }
    };
    
    const detail = details[category];
    if (detail) {
        showNotification(`${detail.title}: ${detail.description}`, 'info');
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (waitlistModal.style.display === 'block') {
            closeWaitlistModal();
        }
        if (businessModal.style.display === 'block') {
            closeBusinessModal();
        }
    }
});

// Function to fetch real waitlist counts
async function fetchWaitlistCounts() {
    try {
        const response = await fetch('/.netlify/functions/waitlist-count');
        const result = await response.json();
        
        if (response.ok && result.success) {
            return result.data;
        } else {
            console.warn('Failed to fetch waitlist counts, using defaults');
            return null;
        }
    } catch (error) {
        console.warn('Error fetching waitlist counts:', error);
        return null;
    }
}

// Function to update hero stats with real or default values
async function updateHeroStats() {
    const counts = await fetchWaitlistCounts();
    
    // Find stat elements
    const usersStat = document.querySelector('[data-stat="users"]');
    const businessesStat = document.querySelector('[data-stat="businesses"]');
    const totalStat = document.querySelector('[data-stat="total"]');
    
    if (counts) {
        // Use real counts from database
        if (usersStat) {
            usersStat.setAttribute('data-target', counts.totalUsers);
            animateCounter(usersStat, counts.totalUsers, 1500);
        }
        if (businessesStat) {
            businessesStat.setAttribute('data-target', counts.totalBusinesses);
            animateCounter(businessesStat, counts.totalBusinesses, 1500);
        }
        if (totalStat) {
            totalStat.setAttribute('data-target', counts.totalWaitlist);
            animateCounter(totalStat, counts.totalWaitlist, 1500);
        }
        console.log('Updated stats with real counts:', counts);
    } else {
        // Use default values if API fails
        const heroStats = document.querySelectorAll('.stat-number[data-target]');
        heroStats.forEach((stat, index) => {
            setTimeout(() => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target, 1500);
            }, index * 200);
        });
        console.log('Using default stat values');
    }
}

// Initialize hero stats animation on page load
window.addEventListener('load', () => {
    // Update stats with real counts
    updateHeroStats();
    
    // Add entrance animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        heroContent.style.animation = 'slideInLeft 1s ease-out';
    }
    
    if (heroVisual) {
        heroVisual.style.animation = 'slideInRight 1s ease-out 0.3s both';
    }
});

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-50px); }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
    
    .notification-close:hover {
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// Add loading state management
document.addEventListener('DOMContentLoaded', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Initialize intersection observers for animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature, .step, .benefit').forEach(el => {
        animationObserver.observe(el);
    });
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
            // Swipe up - could trigger some action
        } else {
            // Swipe down - could trigger some action
        }
    }
}

// Performance optimization: Lazy load background images
const lazyBackgrounds = document.querySelectorAll('[data-bg]');
const backgroundObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bg = entry.target.getAttribute('data-bg');
            entry.target.style.backgroundImage = `url(${bg})`;
            entry.target.removeAttribute('data-bg');
            backgroundObserver.unobserve(entry.target);
        }
    });
});

lazyBackgrounds.forEach(bg => backgroundObserver.observe(bg));

// Export functions for global access
window.scrollToSection = scrollToSection;
window.openWaitlistModal = openWaitlistModal;
window.closeWaitlistModal = closeWaitlistModal;
window.openBusinessModal = openBusinessModal;
window.closeBusinessModal = closeBusinessModal;