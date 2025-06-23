document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle current question
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('show');
            
            // Close other open questions
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('show');
                }
            });
        });
    });
    
    // FAQ Category Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active category button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category
            const category = this.dataset.category;
            faqCategories.forEach(cat => {
                cat.style.display = cat.dataset.category === category ? 'block' : 'none';
            });
        });
    });
});