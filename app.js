class PortfolioApp {
    constructor() {
        this.currentPhase = 1;
        this.menuOpen = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.wireframeMesh = null;
        this.currentSection = 'home';
        this.rubiksCube = null;
        this.rubiksScene = null;
        this.rubiksCamera = null;
        this.rubiksRenderer = null;
        this.cubeVelocity = { x: 0.012, y: 0.009 };
        this.clockInterval = null;
        this.backgroundCubes = [];
        this.cubesAnimationId = null;
        this.init();
    }

    init() {
        this.setupThreeJSWireframe();
        this.startPhase1Loading();
        this.setupContactForm();
        this.setupBouncingCubes();
    }



    // Three.js Wireframe Setup - RED+WHITE Combo Centered
    setupThreeJSWireframe() {
        const canvas = document.getElementById('wireframe-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        
        const geometry = new THREE.PlaneGeometry(20, 20, 20, 20);
        
        // Create RED material
        const redMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        
        // Create WHITE material
        const whiteMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        // Create two wireframe meshes for RED+WHITE combo
        this.wireframeMesh1 = new THREE.Mesh(geometry, redMaterial);
        this.wireframeMesh2 = new THREE.Mesh(geometry, whiteMaterial);
        
        // Center positioning - rotate for proper viewing angle
        this.wireframeMesh1.rotation.x = -Math.PI / 4;
        this.wireframeMesh2.rotation.x = -Math.PI / 4;
        this.wireframeMesh2.position.z = 0.1; // Slight offset for layered effect
        
        this.scene.add(this.wireframeMesh1);
        this.scene.add(this.wireframeMesh2);
        
        // Center camera position for perfect centering
        this.camera.position.z = 15;
        this.camera.position.y = 0; // Center vertically
        this.camera.position.x = 0; // Center horizontally
        
        this.animateWireframe();
        
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    animateWireframe() {
        requestAnimationFrame(() => this.animateWireframe());
        
        // Animate both RED and WHITE wireframes
        if (this.wireframeMesh1 && this.wireframeMesh2) {
            this.wireframeMesh1.rotation.z += 0.005;
            this.wireframeMesh1.rotation.y += 0.002;
            this.wireframeMesh2.rotation.z += 0.004;
            this.wireframeMesh2.rotation.y += 0.003;
        }
        
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Phase 1: SynthWave Loading Animation
    startPhase1Loading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingPercentage = document.getElementById('loading-percentage');
        const loadingBar = document.getElementById('loading-bar');
        
        let progress = 0;
        const duration = 3000;
        const interval = 30;
        const increment = 100 / (duration / interval);
        
        const loadingInterval = setInterval(() => {
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    this.startPhase2Transition();
                }, 800);
            }
            
            loadingPercentage.textContent = Math.floor(progress);
            loadingBar.style.width = progress + '%';
        }, interval);
    }

    // Phase 2: devdoq Geometric Transition Animation
    startPhase2Transition() {
        const loadingScreen = document.getElementById('loading-screen');
        const transitionScreen = document.getElementById('transition-screen');
        
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            transitionScreen.classList.remove('hidden');
            
            setTimeout(() => {
                this.startGeometricZoom();
            }, 2500);
        }, 800);
    }

    startGeometricZoom() {
        const transitionScreen = document.getElementById('transition-screen');
        const mainContent = document.getElementById('main-content');
        
        transitionScreen.classList.add('zoom-in');
        
        setTimeout(() => {
            transitionScreen.classList.add('fade-out');
            
            setTimeout(() => {
                transitionScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                this.setupRubiksCube();
                this.setupHoverTrigger();
                this.initializeSections();
                this.startClock();
            }, 800);
        }, 1500);
    }





    // Setup simplified navigation system
    setupHoverTrigger() {
        console.log('Setting up navigation trigger');
        
        const navTrigger = document.getElementById('nav-trigger');
        navTrigger.style.opacity = '1';
        navTrigger.classList.add('visible');
        
        this.setupNavigationTrigger();
        this.setupNavigation();
        this.setupScrollNavigation();
        
        console.log('Navigation setup complete');
    }

    setupNavigationTrigger() {
        const navTrigger = document.getElementById('nav-trigger');
        const blurOverlay = document.getElementById('blur-overlay');
        const menuBackdrop = document.getElementById('menu-backdrop');
        
        navTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navTrigger.classList.add('clicked');
            this.toggleMenu();
        });
        
        // Close menu when clicking backdrop
        blurOverlay.addEventListener('click', (e) => {
            if (this.menuOpen) {
                this.toggleMenu();
            }
        });
        
        // Close menu when clicking menu backdrop
        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', (e) => {
                if (this.menuOpen) {
                    this.toggleMenu();
                }
            });
        }
    }

    toggleMenu() {
        const verticalMenu = document.getElementById('vertical-menu');
        const blurOverlay = document.getElementById('blur-overlay');
        const menuBackdrop = document.getElementById('menu-backdrop');
        
        this.menuOpen = !this.menuOpen;
        
        if (this.menuOpen) {
            verticalMenu.classList.add('menu-open'); // Slide in from right
            blurOverlay.classList.add('active');
            if (menuBackdrop) {
                menuBackdrop.classList.add('active');
            }
        } else {
            verticalMenu.classList.remove('menu-open'); // Hide menu
            blurOverlay.classList.remove('active');
            if (menuBackdrop) {
                menuBackdrop.classList.remove('active');
            }
        }
    }

    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetSection = e.currentTarget.getAttribute('data-section');
                this.showSection(targetSection); // This now handles menu closing automatically
                this.updateActiveMenuItem(targetSection, menuItems);
            });
        });
    }

    showSection(targetSection) {
        console.log('Switching to section:', targetSection);
        
        // Hide ALL sections first - this is critical
        const allSections = [
            'home-section',
            'about-section', 
            'tech-stack-section',
            'projects-section',
            'experience-section',
            'contact-section',
            'blog-section'
        ];
        
        allSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
        
        // Show ONLY the selected section with perfect centering
        const targetElement = document.getElementById(targetSection + '-section');
        if (targetElement) {
            if (targetSection === 'home') {
                targetElement.style.display = 'flex';
            } else {
                targetElement.style.display = 'flex';
            }
            targetElement.classList.add('active');
        }
        
        this.currentSection = targetSection;
        
        // Close menu after selection
        if (this.menuOpen) {
            this.toggleMenu();
        }
    }
    
    updateActiveMenuItem(targetSection, menuItems) {
        menuItems.forEach(item => item.classList.remove('active'));
        const activeMenuItem = document.querySelector(`[data-section="${targetSection}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
        this.currentSection = targetSection;
    }
    
    setupScrollNavigation() {
        // Removed scroll-based navigation since we're using section switching
        // Each section is now a separate "page" that shows/hides completely
        console.log('Section switching navigation enabled - scroll navigation disabled');
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        const messageTextarea = document.getElementById('message');
        const characterCount = document.querySelector('.character-count');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e);
            });
        }
        
        if (messageTextarea && characterCount) {
            messageTextarea.addEventListener('input', (e) => {
                const currentLength = e.target.value.length;
                const maxLength = e.target.getAttribute('maxlength') || 300;
                characterCount.textContent = `${currentLength}/${maxLength}`;
                
                if (currentLength > maxLength * 0.9) {
                    characterCount.style.color = 'var(--red)';
                } else {
                    characterCount.style.color = 'var(--white)';
                }
            });
        }
    }

    handleContactSubmit(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simulate form submission
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                e.target.reset();
            }, 2000);
        }, 1000);
        
        // Log the form data (in a real app, you would send this to a server)
        console.log('Contact form submitted:', {
            name: name,
            email: email,
            message: message
        });
    }
    

    
    initializeSections() {
        console.log('Initializing sections - showing only Home section');
        
        // Hide all sections first, then show only home
        const allSections = [
            'home-section',
            'about-section', 
            'tech-stack-section',
            'projects-section',
            'experience-section',
            'contact-section',
            'blog-section'
        ];
        
        allSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
        
        // Show only home section
        this.showSection('home');
        
        // Set home menu item as active
        const menuItems = document.querySelectorAll('.menu-item');
        this.updateActiveMenuItem('home', menuItems);
    }
    
    startClock() {
        this.updateClock(); // Initial update
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    updateClock() {
        const now = new Date();
        const canvas = document.getElementById('clock-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw clock face and hands
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        this.drawClockFace(ctx, centerX, centerY, radius);
        this.drawClockHands(ctx, now, centerX, centerY, radius);
        
        // Update date and day display
        const dateElement = document.getElementById('current-date');
        const dayElement = document.getElementById('current-day');
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
            });
        }
        
        if (dayElement) {
            dayElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long'
            });
        }
    }

    drawClockFace(ctx, centerX, centerY, radius) {
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw hour markers and numbers
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = centerX + Math.cos(angle) * (radius - 20);
            const y = centerY + Math.sin(angle) * (radius - 20);
            ctx.fillText(i.toString(), x, y);
        }
        
        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
    }

    drawClockHands(ctx, time, centerX, centerY, radius) {
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        
        // Calculate angles (subtract 90 degrees to start from 12 o'clock)
        const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
        const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
        const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
        
        // Draw hour hand
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(hourAngle) * (radius * 0.5),
            centerY + Math.sin(hourAngle) * (radius * 0.5)
        );
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw minute hand
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(minuteAngle) * (radius * 0.7),
            centerY + Math.sin(minuteAngle) * (radius * 0.7)
        );
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw second hand
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(secondAngle) * (radius * 0.8),
            centerY + Math.sin(secondAngle) * (radius * 0.8)
        );
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    setupBouncingCubes() {
        // Create background canvas for cubes if it doesn't exist
        let cubesCanvas = document.getElementById('background-cubes-canvas');
        if (!cubesCanvas) {
            cubesCanvas = document.createElement('canvas');
            cubesCanvas.id = 'background-cubes-canvas';
            cubesCanvas.style.position = 'fixed';
            cubesCanvas.style.top = '0';
            cubesCanvas.style.left = '0';
            cubesCanvas.style.width = '100vw';
            cubesCanvas.style.height = '100vh';
            cubesCanvas.style.zIndex = '-1';
            cubesCanvas.style.pointerEvents = 'none';
            document.body.appendChild(cubesCanvas);
        }
        
        // Setup Three.js for background cubes
        this.cubesScene = new THREE.Scene();
        this.cubesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cubesRenderer = new THREE.WebGLRenderer({ canvas: cubesCanvas, alpha: true });
        this.cubesRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cubesRenderer.setClearColor(0x000000, 0); // Transparent background
        
        // Create multiple visible white Rubik's cubes
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // Larger size for visibility
        const cubeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.6 // Higher opacity for visibility
        });
        
        // Create 10 cubes with spread positions
        for (let i = 0; i < 10; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
            
            // Spread cubes across wider area
            cube.position.set(
                (Math.random() - 0.5) * 30, // Wider X spread
                (Math.random() - 0.5) * 20, // Wider Y spread  
                (Math.random() - 0.5) * 15  // Wider Z spread
            );
            
            // Random velocities
            cube.userData.velocity = {
                x: (Math.random() - 0.5) * 0.06,
                y: (Math.random() - 0.5) * 0.06,
                z: (Math.random() - 0.5) * 0.03
            };
            
            cube.userData.rotation = {
                x: Math.random() * 0.02,
                y: Math.random() * 0.02,
                z: Math.random() * 0.02
            };
            
            this.backgroundCubes.push(cube);
            this.cubesScene.add(cube);
        }
        
        this.cubesCamera.position.z = 25;
        
        // Start animation immediately
        this.animateBackgroundCubes();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.cubesCamera.aspect = window.innerWidth / window.innerHeight;
            this.cubesCamera.updateProjectionMatrix();
            this.cubesRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    // Animation loop for background cubes
    animateBackgroundCubes() {
        this.backgroundCubes.forEach(cube => {
            // Move cubes
            cube.position.x += cube.userData.velocity.x;
            cube.position.y += cube.userData.velocity.y;
            cube.position.z += cube.userData.velocity.z;
            
            // Rotate cubes
            cube.rotation.x += cube.userData.rotation.x;
            cube.rotation.y += cube.userData.rotation.y;
            cube.rotation.z += cube.userData.rotation.z;
            
            // Bounce off boundaries
            if (Math.abs(cube.position.x) > 15) cube.userData.velocity.x *= -1;
            if (Math.abs(cube.position.y) > 10) cube.userData.velocity.y *= -1;
            if (Math.abs(cube.position.z) > 7.5) cube.userData.velocity.z *= -1;
        });
        
        this.cubesRenderer.render(this.cubesScene, this.cubesCamera);
        this.cubesAnimationId = requestAnimationFrame(() => this.animateBackgroundCubes());
    }
    
    setupRubiksCube() {
        const canvas = document.getElementById('rubiks-cube-canvas');
        if (!canvas) return;
        
        // Scene setup
        this.rubiksScene = new THREE.Scene();
        this.rubiksCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.rubiksRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        this.rubiksRenderer.setSize(window.innerWidth, window.innerHeight);
        this.rubiksRenderer.setClearColor(0x000000, 0);
        
        // Create multiple medium-sized white Rubik's cubes
        this.bouncingCubes = [];
        const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Medium size
        const cubeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        // Create 6 cubes with random positions and velocities
        for (let i = 0; i < 6; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
            
            // Random initial positions
            cube.position.set(
                (Math.random() - 0.5) * 20, // Random X
                (Math.random() - 0.5) * 15, // Random Y
                (Math.random() - 0.5) * 10  // Random Z
            );
            
            // Random velocities for each cube
            cube.userData.velocity = {
                x: (Math.random() - 0.5) * 0.04,
                y: (Math.random() - 0.5) * 0.04,
                z: (Math.random() - 0.5) * 0.02
            };
            
            // Random rotation speeds
            cube.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            };
            
            this.bouncingCubes.push(cube);
            this.rubiksScene.add(cube);
        }
        
        // Position camera
        this.rubiksCamera.position.z = 25;
        
        // Start animation
        this.animateRubiksCube();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.rubiksCamera.aspect = window.innerWidth / window.innerHeight;
            this.rubiksCamera.updateProjectionMatrix();
            this.rubiksRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    animateRubiksCube() {
        requestAnimationFrame(() => this.animateRubiksCube());
        
        if (this.bouncingCubes && this.rubiksRenderer) {
            // Animate all cubes
            this.bouncingCubes.forEach(cube => {
                // Move cubes
                cube.position.x += cube.userData.velocity.x;
                cube.position.y += cube.userData.velocity.y;
                cube.position.z += cube.userData.velocity.z;
                
                // Rotate cubes with individual speeds
                cube.rotation.x += cube.userData.rotationSpeed.x;
                cube.rotation.y += cube.userData.rotationSpeed.y;
                cube.rotation.z += cube.userData.rotationSpeed.z;
                
                // Bounce off boundaries
                if (Math.abs(cube.position.x) > 10) {
                    cube.userData.velocity.x *= -1;
                }
                if (Math.abs(cube.position.y) > 7.5) {
                    cube.userData.velocity.y *= -1;
                }
                if (Math.abs(cube.position.z) > 5) {
                    cube.userData.velocity.z *= -1;
                }
            });
            
            this.rubiksRenderer.render(this.rubiksScene, this.rubiksCamera);
        }
    }

    // Utility method to add smooth scrolling to any element
    smoothScroll(element, target, duration = 300) {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, start, change, duration);
            element.scrollTop = run;
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    // Easing function for smooth animations
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Additional utility functions
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideIn(element, direction = 'up', duration = 300) {
        const directions = {
            up: { from: 'translateY(20px)', to: 'translateY(0)' },
            down: { from: 'translateY(-20px)', to: 'translateY(0)' },
            left: { from: 'translateX(20px)', to: 'translateX(0)' },
            right: { from: 'translateX(-20px)', to: 'translateX(0)' }
        };
        
        const transform = directions[direction] || directions.up;
        
        element.style.transform = transform.from;
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        
        requestAnimationFrame(() => {
            element.style.transform = transform.to;
            element.style.opacity = '1';
        });
    }
}

// Project interaction enhancements
class ProjectInteractions {
    constructor() {
        this.setupProjectCards();
    }
    
    setupProjectCards() {
        const projectCards = document.querySelectorAll('.content-box');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', this.onProjectCardHover.bind(this));
            card.addEventListener('mouseleave', this.onProjectCardLeave.bind(this));
            card.addEventListener('click', this.onProjectCardClick.bind(this));
        });
    }
    
    onProjectCardHover(e) {
        const card = e.currentTarget;
        const techTags = card.querySelectorAll('.tech-tag');
        
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
                tag.style.boxShadow = '0 2px 4px rgba(255, 0, 0, 0.2)';
                tag.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }, index * 50);
        });
    }
    
    onProjectCardLeave(e) {
        const card = e.currentTarget;
        const techTags = card.querySelectorAll('.tech-tag');
        
        techTags.forEach(tag => {
            tag.style.transform = 'translateY(0)';
            tag.style.boxShadow = 'none';
            tag.style.backgroundColor = '';
        });
    }
    
    onProjectCardClick(e) {
        const card = e.currentTarget;
        const title = card.querySelector('h3').textContent;
        
        // Add a visual feedback with devdoq style
        card.style.transform = 'scale(0.98)';
        card.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.3)';
        card.style.borderColor = '#ff0000';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.borderColor = '';
        }, 300);
        
        console.log(`Clicked on project: ${title}`);
    }
}

// Tech Stack interaction enhancements
class TechStackInteractions {
    constructor() {
        this.setupTechItems();
    }
    
    setupTechItems() {
        const techItems = document.querySelectorAll('.tech-item');
        
        techItems.forEach(item => {
            item.addEventListener('click', this.onTechClick.bind(this));
        });
    }
    
    onTechClick(e) {
        const tech = e.currentTarget;
        const techName = tech.textContent;
        
        // Add a ripple effect with v8 colors
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '0';
        ripple.style.background = 'rgba(255, 0, 0, 0.4)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        tech.style.position = 'relative';
        tech.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`Tech clicked: ${techName}`);
    }
}

// V8 Specific Interactions
class V8Interactions {
    constructor() {
        this.setupBoxHoverEffects();
        this.setupClockBoxClick();
    }
    
    setupBoxHoverEffects() {
        const boxes = document.querySelectorAll('.profile-picture-box, .name-box, .clock-container, .content-box, .about-content, .contact-links-box, .contact-form-box, .blog-status');
        
        boxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateY(-2px)';
            });
            
            box.addEventListener('mouseleave', () => {
                box.style.transform = 'translateY(0)';
            });
        });
    }
    
    setupClockBoxClick() {
        const clockContainer = document.querySelector('.clock-container');
        if (clockContainer) {
            clockContainer.addEventListener('click', () => {
                // Add click feedback
                clockContainer.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    clockContainer.style.transform = '';
                }, 150);
            });
        }
    }
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .equation-text {
        transition: opacity 0.3s ease;
    }
    
    .social-link:hover .social-icon {
        animation: bounce 0.6s ease;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Expose app globally for debugging
    window.portfolioApp = app;
    
    // Initialize additional interactions after main content is loaded (after phase 3)
    setTimeout(() => {
        new ProjectInteractions();
        new TechStackInteractions();
        new V8Interactions();
    }, 8000); // Wait for all 3 phases to complete
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close menu
        if (e.key === 'Escape' && app.menuOpen) {
            app.toggleMenu();
        }
        
        // Arrow navigation when menu is open
        if (app.menuOpen) {
            const menuItems = document.querySelectorAll('.menu-item');
            const activeMenuItem = document.querySelector('.menu-item.active');
            const currentIndex = Array.from(menuItems).indexOf(activeMenuItem);
            
            if (e.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
                e.preventDefault();
                menuItems[currentIndex + 1].click();
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                menuItems[currentIndex - 1].click();
            }
        }
    });
});