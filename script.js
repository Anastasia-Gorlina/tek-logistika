// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Настройка плавной навигации
    function setupNavigation() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        console.log('Найдено якорных ссылок:', anchors.length);
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                console.log('Клик по ссылке:', href);
                const target = document.querySelector(href);
                if (target) {
                    console.log('Целевая секция найдена, прокручиваем...');
                    // Получаем позицию элемента с учетом фиксированной навигации
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    // Плавная прокрутка
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.log('Целевая секция НЕ найдена для:', href);
                }
            });
        });
    }

    // Запускаем навигацию
    setupNavigation();

    // Обработка формы контактов
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

    // CTA кнопка
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Мобильное меню
    function toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    }

    // Активная навигация при скролле
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

    // Функции модальных окон
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

    // Обработчики модальных окон
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

    // Делаем функции глобальными для использования в HTML
    window.showSuccessModal = showSuccessModal;
    window.showErrorModal = showErrorModal;
    window.closeModal = closeModal;
    window.toggleMobileMenu = toggleMobileMenu;
});