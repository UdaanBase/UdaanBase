document.addEventListener('DOMContentLoaded', function() {
    // ================= MOBILE MENU ELEMENTS =================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const html = document.documentElement;
    
    // Track menu and scroll state
    let isMenuOpen = false;
    let scrollPosition = 0; // Stores page scroll position before opening menu

    // ================= MENU TOGGLE FUNCTIONS =================
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Store current scroll position when opening menu
            scrollPosition = window.scrollY;
            // Lock scroll position but don't jump to top
            html.style.top = `-${scrollPosition}px`;
            html.classList.add('no-scroll');
        } else {
            // Restore scroll position when closing menu
            html.classList.remove('no-scroll');
            window.scrollTo(0, scrollPosition);
            html.style.top = '';
        }
        
        // Toggle menu visibility
        mobileMenuToggle.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
    }

    function closeMenu() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        // Restore scroll position
        html.classList.remove('no-scroll');
        window.scrollTo(0, scrollPosition);
        html.style.top = '';
        
        // Close menu elements
        mobileMenuToggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
    }

    // ================= EVENT LISTENERS =================
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu on close button click
    mobileNavClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
    });

    // Close menu when clicking on nav links (except submenu toggles)
    document.querySelectorAll('.mobile-nav-list > li > a:not(.submenu-toggle)').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ================= SUBMENU HANDLING =================
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const submenu = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close all other submenus first
            document.querySelectorAll('.submenu').forEach(otherSubmenu => {
                if (otherSubmenu !== submenu) {
                    otherSubmenu.style.display = 'none';
                    const otherIcon = otherSubmenu.previousElementSibling.querySelector('i');
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            // Toggle current submenu
            if (submenu.style.display === 'block') {
                submenu.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                submenu.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });

    // ================= CLICK OUTSIDE HANDLING =================
    document.addEventListener('click', function(event) {
        if (!isMenuOpen) return;
        
        const isClickInsideMenu = mobileNav.contains(event.target) || 
                                event.target.closest('.mobile-nav') ||
                                event.target.closest('.submenu-toggle');
        
        if (!isClickInsideMenu) {
            closeMenu();
        }
    });

    // ================= RESIZE HANDLER =================
    // Maintain scroll position on window resize while menu is open
    window.addEventListener('resize', function() {
        if (isMenuOpen) {
            html.style.top = `-${scrollPosition}px`;
        }
    });
    

    // =============== REST OF YOUR CODE ==============
    // Header scroll effect
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > headerHeight);
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.offsetTop - header.offsetHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
});


//contact submission 
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // NEW: Set +91 as default value in phone field
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput && !phoneInput.value) {
            phoneInput.value = '+91';
            // Move cursor to end
            phoneInput.addEventListener('focus', function() {
                if (this.value === '+91') {
                    this.setSelectionRange(3, 3);
                }
            });
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page reload
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Validation
            if (!name || !email || !phone || !message) {
                showAlert('Please fill all fields', 'error');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert('Please enter valid email', 'error');
                return;
            }
            
            // Phone validation (exactly 10 digits after +91)
            if (!/^\+91\d{10}$/.test(phone)) {
                showAlert('Please enter valid Indian phone number (10 digits after +91)', 'error');
                return;
            }
            
            // WhatsApp integration
            const whatsappNumber = '917061570522'; // REPLACE WITH YOUR NUMBER
            const whatsappMessage = 
                `*New Contact Request*%0A%0A` +
                `*Name:* ${name}%0A` +
                `*Email:* ${email}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Message:* ${message}`;
            
            try {
                // Open WhatsApp
                window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
                
                // Show success
                showAlert('Message ready to send! Please complete in WhatsApp', 'success');
                
                // Reset form (but keep +91 in phone field)
                this.reset();
                phoneInput.value = '+91';
            } catch (error) {
                showAlert('Failed to open WhatsApp', 'error');
            }
        });
    }
    
    // Show alert message (unchanged)
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) existingAlert.remove();
        
        // Create alert
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to page
        contactForm.parentNode.insertBefore(alert, contactForm);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
});