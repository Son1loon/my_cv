class BloodParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 3;
        this.velocityY = Math.random() * 2 + 1;
        this.velocityX = (Math.random() - 0.5) * 0.5;
        this.maxOpacity = Math.random() * 0.6 + 0.4;
        this.opacity = 0;
        this.fadeInDuration = Math.random() * 200 + 100;
        this.fadeInStartTime = Date.now();
        this.life = 1;
        this.decay = Math.random() * 0.005 + 0.002;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.life -= this.decay;

        const fadeInProgress = Math.min(1, (Date.now() - this.fadeInStartTime) / this.fadeInDuration);
        if (fadeInProgress < 1) {
            this.opacity = this.maxOpacity * fadeInProgress;
        } else {
            this.opacity *= 0.98;
        }

        this.velocityY += 0.05;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(139, 0, 0, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BloodDrip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = Math.random() * 2 + 1;
        this.height = Math.random() * 20 + 15;
        this.velocityY = Math.random() * 1.5 + 1;
        this.maxOpacity = Math.random() * 0.5 + 0.5;
        this.opacity = 0;
        this.fadeInDuration = Math.random() * 250 + 150;
        this.fadeInStartTime = Date.now();
        this.wobble = Math.random() * 0.3;
        this.wobbleAmount = 0;
    }

    update() {
        this.y += this.velocityY;
        this.wobbleAmount += this.wobble;
        this.x += Math.sin(this.wobbleAmount) * 0.1;

        const fadeInProgress = Math.min(1, (Date.now() - this.fadeInStartTime) / this.fadeInDuration);
        if (fadeInProgress < 1) {
            this.opacity = this.maxOpacity * fadeInProgress;
        } else {
            this.opacity *= 0.99;
        }
    }

    draw(ctx) {
        ctx.strokeStyle = `rgba(100, 0, 0, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.wobbleAmount * 0.5, this.y + this.height);
        ctx.stroke();
    }
}

class BloodAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.drips = [];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.init();
        window.addEventListener('resize', () => this.handleResize());
        this.animate();
    }

    init() {
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.3;
            this.particles.push(new BloodParticle(x, y));
        }
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBloodEffect(mouseX, mouseY) {
        for (let i = 0; i < 5; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 2 + 1;
            const particle = new BloodParticle(mouseX, mouseY);
            particle.velocityX = Math.cos(angle) * speed;
            particle.velocityY = Math.sin(angle) * speed;
            this.particles.push(particle);
        }

        if (Math.random() > 0.7) {
            this.drips.push(new BloodDrip(mouseX, mouseY));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0 || this.particles[i].y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.drips.length - 1; i >= 0; i--) {
            this.drips[i].update();
            if (this.drips[i].opacity <= 0 || this.drips[i].y > this.canvas.height) {
                this.drips.splice(i, 1);
            }
        }

        if (Math.random() > 0.95) {
            const randomX = Math.random() * this.canvas.width;
            const randomY = Math.random() * 100;
            this.particles.push(new BloodParticle(randomX, randomY));

            if (Math.random() > 0.7) {
                this.drips.push(new BloodDrip(randomX, randomY));
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let particle of this.particles) {
            particle.draw(this.ctx);
        }

        for (let drip of this.drips) {
            drip.draw(this.ctx);
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class TypingAnimation {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.roles = ["Developer", "Programmer", "Maker", "Moderator"];
        this.roleIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.delayBetweenRoles = 2000;
    }

    start() {
        this.type();
    }

    type() {
        const currentRole = this.roles[this.roleIndex];

        if (this.isDeleting) {
            this.element.textContent = currentRole.substring(0, this.charIndex - 1);
            this.charIndex--;

            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.roleIndex = (this.roleIndex + 1) % this.roles.length;
                setTimeout(() => this.type(), 500);
                return;
            }
            setTimeout(() => this.type(), this.deletingSpeed);
        } else {
            this.element.textContent = currentRole.substring(0, this.charIndex + 1);
            this.charIndex++;

            if (this.charIndex === currentRole.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetweenRoles);
                return;
            }
            setTimeout(() => this.type(), this.typingSpeed);
        }
    }
}

// Функция для создания мобильного меню
function createMobileMenu() {
    // Проверяем, существует ли уже кнопка
    if (document.querySelector('.menu-toggle')) {
        return;
    }

    // Создаем кнопку мобильного меню
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Меню');

    // Вставляем кнопку в начало body
    document.body.insertBefore(menuToggle, document.body.firstChild);

    // Получаем элементы меню
    const tools = document.querySelector('.tools');

    if (!tools) return;

    // Функция открытия/закрытия меню
    function toggleMenu() {
        tools.classList.toggle('active');

        if (tools.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Восстанавливаем скролл
        }
    }

    // Функция закрытия меню
    function closeMenu() {
        if (tools.classList.contains('active')) {
            tools.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }

    // Добавляем обработчик на кнопку
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Закрываем меню при клике на ссылку
    const menuLinks = document.querySelectorAll('.tools a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (tools.classList.contains('active') &&
            !tools.contains(e.target) &&
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Закрываем меню при изменении размера окна (если становится десктопным)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && tools.classList.contains('active')) {
            closeMenu();
        }
    });

    // Предотвращаем всплытие кликов внутри меню
    tools.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Функция для анимации появления элементов
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.page-section').forEach(section => {
        observer.observe(section);
    });

    const fadeElements = document.querySelectorAll('.skills-grid > div, .project-card, .education-item, .contact-form p');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);

                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

// Функция для подсветки активного меню
function setupActiveMenuHighlight() {
    const menuLinks = document.querySelectorAll('.tools a');
    const sections = document.querySelectorAll('.page-section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const viewportCenter = window.innerHeight / 2;
            const sectionCenter = sectionTop + sectionHeight / 2;

            if (window.scrollY + viewportCenter >= sectionTop &&
                window.scrollY + viewportCenter < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Функция для плавной прокрутки
function setupSmoothScroll() {
    const menuLinks = document.querySelectorAll('.tools a');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Активируем анимацию секции
                targetSection.style.animation = 'none';
                setTimeout(() => {
                    targetSection.style.animation = '';
                }, 10);
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем кровяной эффект
    new BloodAnimation('bloodCanvas');

    // Инициализируем typing анимацию
    const typingAnimation = new TypingAnimation('typingText');
    typingAnimation.start();

    // Настраиваем мобильное меню
    createMobileMenu();

    // Настраиваем анимации появления
    setupScrollAnimations();

    // Настраиваем подсветку активного меню
    setupActiveMenuHighlight();

    // Настраиваем плавную прокрутку
    setupSmoothScroll();
});

// Дополнительная проверка для динамически загружаемого контента
window.addEventListener('load', () => {
    // Убеждаемся, что мобильное меню создано
    if (!document.querySelector('.menu-toggle') && window.innerWidth <= 767) {
        createMobileMenu();
    }
});