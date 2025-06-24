document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the header
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', options);
    
    // Cookie settings button functionality
    const cookieSettingsBtn = document.getElementById('cookie-settings');
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function() {
            // In a real implementation, this would open a cookie preferences modal
            alert('Cookie preferences would be displayed here. On a real site, this would allow users to manage their cookie settings.');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Animation on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.privacy-card');
        
        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const privacyCards = document.querySelectorAll('.privacy-card');
    privacyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation when page loads
    window.addEventListener('load', animateOnScroll);
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
});