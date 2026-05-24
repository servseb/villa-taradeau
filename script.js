document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. HEADER SCROLL & ACTIVE LINK NAVIGATION
    // ==========================================
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Change header style on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. EXCLUSIVE GALLERY PHOTO CAROUSEL
    // ==========================================
    const slider = document.getElementById('gallerySlider');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    const dots = document.querySelectorAll('.gallery-dot');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    function updateSlider() {
        // Translate the slides container
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots indicators
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event listeners for prev/next buttons
    nextBtn.addEventListener('click', () => {
        showNextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        showPrevSlide();
        resetAutoSlide();
    });

    // Event listeners for dots indicator
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-dot')) {
            currentIndex = parseInt(e.target.getAttribute('data-index'));
            updateSlider();
            resetAutoSlide();
        }
    });

    // Auto sliding interval (every 5 seconds)
    function startAutoSlide() {
        autoSlideInterval = setInterval(showNextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Start auto slide on load
    startAutoSlide();

    // ==========================================
    // 3. MODAL (VISITE VIDÉO SUR DEMANDE)
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    const openModalBtns = document.querySelectorAll('.open-video-modal');
    const closeModalBtn = document.getElementById('closeVideoModal');
    const modalOverlay = document.querySelector('.modal-overlay');

    function openModal() {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    function closeModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scrolling
        
        // Reset success state after modal fades out
        setTimeout(() => {
            document.getElementById('videoForm').style.display = 'block';
            document.getElementById('videoSuccess').style.display = 'none';
            document.getElementById('videoForm').reset();
        }, 400);
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 4. ENVOI RÉEL DE FORMULAIRES (via Web3Forms)
    // ==========================================
    // OBTENEZ VOTRE CLÉ GRATUITE SUR https://web3forms.com et collez-la ci-dessous :
    const WEB3FORMS_ACCESS_KEY = '0819da69-15db-481d-a358-9548c4a8d1f2'; 

    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    
    const videoForm = document.getElementById('videoForm');
    const videoSuccess = document.getElementById('videoSuccess');

    // Gestion du formulaire de contact
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-nom').value;
        const email = document.getElementById('contact-email').value;
        const tel = document.getElementById('contact-tel').value;
        const status = document.getElementById('contact-statut').value;
        const message = document.getElementById('contact-msg').value;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        // Envoi des données en AJAX à Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: "Nouveau message de la page Villa Taradeau",
                Nom: name,
                Email: email,
                Telephone: tel,
                Statut: status,
                Message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                contactForm.style.display = 'none';
                contactSuccess.style.display = 'block';
                contactSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.innerHTML = 'Erreur. Réessayer';
            submitBtn.disabled = false;
        });
    });

    // Gestion du formulaire de visite vidéo
    videoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('video-nom').value;
        const email = document.getElementById('video-email').value;
        const tel = document.getElementById('video-tel').value;

        const submitBtn = videoForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi du lien...';
        submitBtn.disabled = true;

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: "Demande de visite vidéo - Villa Taradeau",
                Nom: name,
                Email: email,
                Telephone: tel || 'Non renseigné'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                videoForm.style.display = 'none';
                videoSuccess.style.display = 'block';
                videoSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
                
                // Fermeture automatique de la modale après 5 secondes
                setTimeout(() => {
                    if (videoModal.classList.contains('active')) {
                        closeModal();
                    }
                }, 5000);
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.innerHTML = 'Erreur. Réessayer';
            submitBtn.disabled = false;
        });
    });
});
