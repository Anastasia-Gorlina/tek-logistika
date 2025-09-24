document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!contactForm.checkValidity()) {
            alert('Пожалуйста, заполните все поля корректно');
            return;
        }
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Отправляется...';
        submitButton.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };
        
        try {
            const response = await fetch('/mail.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data?.success) {
                    showSuccessModal(data?.message || 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                } else {
                    showErrorModal(data?.message || 'Произошла ошибка при отправке');
                }
            } else {
                showErrorModal(data?.message || response.statusText || 'Произошла ошибка при отправке');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showErrorModal('Произошла ошибка при отправке. Проверьте подключение к интернету и попробуйте еще раз.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorMessage');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});