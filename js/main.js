console.log('JavaScript файл загружен');

function animateCounter(element, target, duration, suffix = '') {
    let start = 0;
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        element.textContent = value + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target + suffix;
        }
    };
    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');

    // Модальное окно "О нас"
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const aboutModalClose = aboutModal?.querySelector('.modal__close');

    console.log('О нас:', { aboutBtn, aboutModal, aboutModalClose });

    if (aboutBtn && aboutModal && aboutModalClose) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        });

        aboutModalClose.addEventListener('click', () => {
            aboutModal.classList.remove('modal--active');
            document.body.style.overflow = '';
        });

        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('modal--active');
                document.body.style.overflow = '';
            }
        });
    }

    // Модальное окно расписания
    const scheduleBtn = document.getElementById('scheduleBtn');
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleClose = scheduleModal?.querySelector('.modal__close');

    console.log('Расписание:', { scheduleBtn, scheduleModal, scheduleClose });

    if (scheduleBtn && scheduleModal && scheduleClose) {
        scheduleBtn.addEventListener('click', () => {
            scheduleModal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        });

        scheduleClose.addEventListener('click', () => {
            scheduleModal.classList.remove('modal--active');
            document.body.style.overflow = '';
        });

        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) {
                scheduleModal.classList.remove('modal--active');
                document.body.style.overflow = '';
            }
        });
    }

    // Мобильное меню
    const mobileMenuButton = document.querySelector('.header__mobile-menu');
    const header = document.querySelector('.header');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            header.classList.toggle('header--menu-open');
        });
    }

    // Закрытие мобильного меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('header--menu-open');
        });
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами, которые нужно анимировать
    document.querySelectorAll('.feature-card, .testimonial-card, .stats__item').forEach(el => {
        observer.observe(el);
    });

    // FAQ аккордеон
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('faq-item--open');
                
                // Закрываем все открытые элементы
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('faq-item--open');
                    const otherAnswer = otherItem.querySelector('.faq-item__answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                // Открываем текущий элемент, если он был закрыт
                if (!isOpen) {
                    item.classList.add('faq-item--open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Галерея
    const galleryItems = document.querySelectorAll('.gallery__item');
    const body = document.body;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery__image');
            const fullscreenView = document.createElement('div');
            fullscreenView.className = 'fullscreen-view';
            
            const fullscreenImg = document.createElement('img');
            fullscreenImg.src = img.src;
            fullscreenImg.alt = img.alt;
            
            fullscreenView.appendChild(fullscreenImg);
            body.appendChild(fullscreenView);
            body.style.overflow = 'hidden';
            
            fullscreenView.addEventListener('click', () => {
                body.removeChild(fullscreenView);
                body.style.overflow = '';
            });
        });
    });

    // Табы с ценами
    const priceTabs = document.querySelectorAll('.prices__tab-btn');
    const priceContents = document.querySelectorAll('.prices__tab-content');

    priceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех табов
            priceTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущему табу
            tab.classList.add('active');
            
            // Скрываем все контенты
            priceContents.forEach(content => content.classList.remove('active'));
            // Показываем нужный контент
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Выпадающее окно контактов (отдельный блок)
    const contactsBtn = document.getElementById('contactsBtn');
    const contactsDropdown = document.getElementById('contactsDropdown');

    if (contactsBtn && contactsDropdown) {
        contactsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            contactsDropdown.classList.toggle('open');
        });

        // Закрытие при клике вне окна
        document.addEventListener('click', function(e) {
            if (!contactsDropdown.contains(e.target) && e.target !== contactsBtn) {
                contactsDropdown.classList.remove('open');
            }
        });
    }

    // Модальное окно бронирования
    const openBookingModalBtn = document.getElementById('openBookingModal');
    const bookingModal = document.getElementById('bookingModal');
    const bookingModalClose = bookingModal?.querySelector('.modal__close');
    const bookingForm = document.getElementById('bookingForm');
    const bookingFormMessage = document.getElementById('bookingFormMessage');

    if (openBookingModalBtn && bookingModal && bookingModalClose) {
        openBookingModalBtn.addEventListener('click', () => {
            bookingModal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        });
        bookingModalClose.addEventListener('click', () => {
            bookingModal.classList.remove('modal--active');
            document.body.style.overflow = '';
            bookingFormMessage.textContent = '';
            bookingFormMessage.className = 'form-message';
            bookingForm.reset();
        });
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('modal--active');
                document.body.style.overflow = '';
                bookingFormMessage.textContent = '';
                bookingFormMessage.className = 'form-message';
                bookingForm.reset();
            }
        });
    }

    // Валидация и отправка формы бронирования
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = bookingForm.elements['name'].value.trim();
            const phone = bookingForm.elements['phone'].value.trim();
            const center = bookingForm.elements['center'].value;

            // Проверка номера телефона
            const phoneClean = phone.replace(/[^0-9+]/g, '');
            let valid = false;
            // +375291234567, 80291234567, 291234567
            if (/^\+375(25|29|33|44|17)\d{7}$/.test(phoneClean)) valid = true;
            if (/^80(25|29|33|44|17)\d{7}$/.test(phoneClean)) valid = true;
            if (/^(25|29|33|44|17)\d{7}$/.test(phoneClean)) valid = true;

            if (!valid) {
                bookingFormMessage.textContent = 'Пожалуйста, введите корректный белорусский номер телефона.';
                bookingFormMessage.className = 'form-message form-message--error';
                return;
            }

            // Отправка данных на сервер
            fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    center: center
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('Server response:', data);
                if (data.success) {
                    // Успех: скрыть форму, заменить заголовок, убрать сообщение под формой, запустить конфетти
                    bookingForm.style.display = 'none';
                    const bookingModalTitle = bookingModal.querySelector('.modal__title');
                    if (bookingModalTitle) {
                        bookingModalTitle.textContent = 'Наши операторы свяжутся с вами в ближайшее время!';
                    }
                    bookingFormMessage.textContent = '';
                    bookingFormMessage.className = 'form-message';

                    // Яркое и продолжительное конфетти (3 секунды, с разных точек по краям экрана)
                    if (window.confetti) {
                        let confettiDuration = 3000; // 3 секунды
                        let interval = 120;
                        let elapsed = 0;
                        let confettiInterval = setInterval(() => {
                            // Левый край
                            confetti({
                                particleCount: 90,
                                spread: 120,
                                startVelocity: 60,
                                origin: {
                                    x: 0,
                                    y: Math.random() * 0.7 + 0.1 // от 0.1 до 0.8
                                },
                                angle: 60 + Math.random() * 20 // 60-80 градусов
                            });
                            // Правый край
                            confetti({
                                particleCount: 90,
                                spread: 120,
                                startVelocity: 60,
                                origin: {
                                    x: 1,
                                    y: Math.random() * 0.7 + 0.1
                                },
                                angle: 100 + Math.random() * 20 // 100-120 градусов
                            });
                            elapsed += interval;
                            if (elapsed >= confettiDuration) {
                                clearInterval(confettiInterval);
                            }
                        }, interval);
                    }
                } else {
                    bookingFormMessage.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.';
                    bookingFormMessage.className = 'form-message form-message--error';
                }
            })
            .catch(error => {
                console.error('Error sending data to server:', error);
                bookingFormMessage.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.';
                bookingFormMessage.className = 'form-message form-message--error';
            });
        });
    }

    // Анимация счетчиков статистики
    const counters = document.querySelectorAll('.stats__number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        animateCounter(counter, target, 1200, suffix); // 1200 мс = 1.2 сек
    });
}); 