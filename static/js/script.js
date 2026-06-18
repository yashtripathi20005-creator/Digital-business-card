// Digital Business Card - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/card/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    showFormMessage('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage('Network error. Please check your connection.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Helper: Validate Email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper: Show Form Message
    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Save Contact (vCard download)
    window.saveContact = function() {
        const card = window.cardData || {
            name: 'Alexandra Chen',
            title: 'Full Stack Developer & UI/UX Designer',
            company: 'TechVista Solutions',
            email: 'alexandra@techvista.com',
            phone: '+1 (555) 234-5678',
            website: 'https://alexandrachen.dev'
        };

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
N:${card.name.split(' ').reverse().join(';')}
ORG:${card.company}
TITLE:${card.title}
EMAIL:${card.email}
TEL:${card.phone}
URL:${card.website}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${card.name.replace(/\s/g, '_')}_contact.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    // Share Card
    window.shareCard = function() {
        const url = window.location.href;
        const text = `Check out my digital business card! 🚀\n\n${url}`;

        if (navigator.share) {
            navigator.share({
                title: 'Digital Business Card',
                text: text,
                url: url
            }).catch(err => {
                if (err.name !== 'AbortError') {
                    fallbackShare(text);
                }
            });
        } else {
            fallbackShare(text);
        }
    };

    function fallbackShare(text) {
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            showFormMessage('✓ Link copied to clipboard! Share it with others.', 'success');
        }).catch(() => {
            // Fallback: prompt user to copy manually
            prompt('Copy this link to share:', text);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save contact
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            window.saveContact();
        }
        
        // Ctrl+P to print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Allow default print behavior
        }
    });

    // Animate elements on scroll (using Intersection Observer)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.contact-item, .social-link, .tag').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });

        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.contact-item, .social-link, .tag').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    // Fetch card data from API (for dynamic updates)
    async function loadCardData() {
        try {
            const response = await fetch('/api/card');
            if (response.ok) {
                const data = await response.json();
                window.cardData = data;
            }
        } catch (error) {
            console.log('API not available, using static data');
            // Use static data from template if available
            window.cardData = window.cardData || {
                name: 'Alexandra Chen',
                title: 'Full Stack Developer & UI/UX Designer',
                company: 'TechVista Solutions',
                email: 'alexandra@techvista.com',
                phone: '+1 (555) 234-5678',
                website: 'https://alexandrachen.dev'
            };
        }
    }

    // Load card data
    loadCardData();

    console.log('%c🚀 Digital Business Card', 'font-size: 20px; font-weight: bold; color: #6C63FF;');
    console.log('%cBuilt with ❤️ using Flask', 'font-size: 14px; color: #6b6b7a;');
});

// Error handling for fetch
window.addEventListener('unhandledrejection', function(e) {
    console.warn('Unhandled Promise Rejection:', e.reason);
});
