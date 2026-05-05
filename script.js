/**
 * Portfolio Website - JavaScript
 * Handles hamburger menu toggle, smooth scrolling, and project modals
 */

// =============================================
// DOM ELEMENTS
// =============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const projectModal = document.getElementById('project-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.project-card');

// =============================================
// PROJECT DATA STRUCTURE
// =============================================

const projectData = {
    thesis: {
        title: 'Neuromuscular Adaptation to Exoskeleton Assistance',
        date: 'Sept. 2025 - Mar. 2026',
        description: 'Multi-modal analysis of how users adapt to robotic exoskeleton assistance.',
        report: 'This master thesis investigates the complex mechanisms of neuromuscular adaptation when humans interact with robotic exoskeleton systems. Through multi-modal data acquisition and advanced signal processing, we analyze how the nervous system modulates muscle activation patterns in response to assistive forces. The research combines biomechanical modeling with electromyographic analysis to quantify adaptation dynamics.',
        techStack: ['Biomechanics', 'Signal Processing', 'EMG Analysis', 'Data Acquisition', 'Statistical Analysis']
    },
    autonomyo: {
        title: 'Rehabilitation Game & Instrumented Soles',
        date: 'Jul. 2024 - Jan. 2025',
        description: 'Designed and prototyped custom PCB boards using KiCad for sensor integration into instrumented soles. Programmed STM32 microcontrollers for real-time motion capture and data processing. Developed a comprehensive Unity-based rehabilitation game that provides real-time biofeedback to users, transforming sensor data into interactive gameplay mechanics for enhanced patient engagement during recovery sessions.',
        report: 'Developed an integrated hardware-software solution for rehabilitation. Custom PCB design in KiCad enabled seamless sensor integration with miniaturized form factor. STM32 firmware handled real-time sensor data processing and wireless transmission. The Unity application provides gamified rehabilitation exercises with real-time biofeedback, significantly improving patient motivation and compliance during recovery.',
        techStack: ['KiCad', 'STM32CubeIDE', 'Embedded C', 'Unity', 'PCB Design', 'Sensor Integration']
    },
    'robot-competition': {
        title: 'Autonomous Duplo-Collector Robot',
        date: 'Feb. 2025 - Today',
        description: 'Engineered an autonomous robot within a 1500 CHF budget to navigate and collect building blocks in an 8x8 meter arena with complex terrains including slopes and obstacles. Implemented advanced perception algorithms for block detection and localization. Developed robust motion planning strategies to optimize collection efficiency while managing hardware constraints and real-world environmental challenges.',
        report: 'Built a cost-effective autonomous system with stringent budget constraints (1500 CHF). The robot navigates an 8x8m arena with varied terrain, utilizing computer vision for block detection and sophisticated path planning algorithms for optimal collection strategies. Real-time control systems manage wheel odometry and sensor fusion for accurate self-localization.',
        techStack: ['ROS', 'Python', 'Computer Vision', 'Motion Planning', 'Embedded Systems']
    },
    crazyfly: {
        title: 'Vision-based Drone Control (Crazyfly)',
        date: 'Mar. 2025 - Today',
        description: 'Implemented computer vision algorithms for real-time gate detection and tracking. Developed cascaded PID control systems for precise drone stabilization and trajectory following. Validated control strategies using Webots simulation environment before deploying on physical quadrotor, achieving reliable autonomous navigation through complex gate sequences.',
        report: 'Designed vision-based autonomous flight controller for gate navigation. Computer vision pipeline processes live camera feed for gate detection. Cascaded control architecture ensures stable altitude and attitude control while following waypoints. Webots simulation provided safe validation environment before real-world deployment.',
        techStack: ['OpenCV', 'Python', 'Control Theory', 'Webots', 'ROS']
    },
    zebrafish: {
        title: 'Locomotion in Zebrafish',
        date: 'Mar. 2025 - Today',
        description: 'Modeled neural control mechanisms underlying undulatory swimming locomotion in zebrafish larvae. Implemented Central Pattern Generator (CPG) control systems to simulate realistic fish-like movements. Applied biomechanical principles to understand efficiency and adaptability of aquatic locomotion, bridging neuroscience and robotics for bio-inspired robot design.',
        report: 'Bio-inspired computational modeling of zebrafish swimming. Central Pattern Generator networks simulate spinal neural circuits controlling locomotion. Biomechanical analysis reveals energy efficiency of undulatory motion. Insights applied to robotic system design for aquatic environments.',
        techStack: ['Computational Modeling', 'Neural Simulation', 'Biomechanics', 'Python', 'Matlab']
    },
    legov: {
        title: 'Virtual Environment for Rehabilitation (LegoPress & FES)',
        date: 'Feb. 2024 - Jun. 2024',
        description: 'Developed a gamified VR environment targeting stroke rehabilitation using Unity. Implemented UDP socket communication for real-time data transmission between the game and external hardware controllers. Integrated Functional Electrical Stimulation (FES) systems to provide stimulation cues synchronized with gameplay, creating an immersive therapeutic experience that combines virtual engagement with neurorehabilitation principles.',
        report: 'Created VR-based rehabilitation platform for stroke patients. UDP network architecture enables real-time communication with FES hardware. Gamification elements enhance patient engagement while FES provides muscle stimulation synchronized with game events. The system seamlessly integrates virtual environment feedback with physiological stimulation.',
        techStack: ['Unity', 'C#', 'UDP Networking', 'FES Integration', 'Game Design']
    },
    olfactory: {
        title: 'Motion-based Olfactory Algorithm',
        date: 'Mar. 2024 - May. 2024',
        description: 'Adapted olfactory navigation strategies inspired by Drosophila (fruit fly) nervous system for robotic applications. Implemented the HRC (head-direction cell) computational model to simulate chemotaxis behavior. Validated the algorithm through simulations for autonomous odor-source localization, demonstrating how bio-inspired approaches can enhance robotic navigation capabilities in challenging environments.',
        report: 'Bio-inspired navigation algorithm based on Drosophila olfactory system. Head-direction cell (HRC) model implementation enables robust odor gradient following. Computational validation demonstrates effective source localization. Algorithm applicable to search-and-rescue robotics.',
        techStack: ['Neuroscience', 'Algorithm Design', 'Simulation', 'Python', 'Bio-inspired Computing']
    },
    'rocket-mpc': {
        title: 'Rocket Drone MPC Controller Design',
        date: 'Oct. 2023 - Jan. 2024',
        description: 'Designed stabilizing regulators for a rocket-shaped drone using both linear and nonlinear Model Predictive Control (NMPC) strategies. Developed controllers to track Thrust Vector Control (TVC) trajectories with precise attitude regulation. Compared linear vs. nonlinear MPC approaches to optimize computational efficiency while maintaining robust performance for complex aerial maneuvers.',
        report: 'Comprehensive control system design for rocket-shaped aerial platform. Linear MPC provides baseline controller, while NMPC offers improved tracking performance. Both approaches handle Thrust Vector Control constraints. Comparative analysis balances computational cost against performance requirements.',
        techStack: ['MPC', 'NMPC', 'Control Theory', 'Optimization', 'Matlab', 'Simulink']
    },
    'auto-nav': {
        title: 'Autonomous Navigation for a Wheeled Robot',
        date: 'Sep. 2023 - Dec. 2023',
        description: 'Implemented autonomous navigation system combining path planning and state estimation. Deployed A* algorithm for optimal obstacle avoidance in 2D grid environments. Integrated Kalman Filtering for robust state estimation combining sensor data. Applied computer vision for environment perception, achieving reliable autonomous navigation in complex settings.',
        report: 'Complete autonomous navigation stack for wheeled platform. A* algorithm plans collision-free paths in grid-based environments. Kalman Filter fuses odometry and vision data for robust state estimation. Computer vision detects and localizes obstacles in real-time.',
        techStack: ['A* Algorithm', 'Kalman Filter', 'Computer Vision', 'ROS', 'Python']
    },
    'gait-phase': {
        title: 'Gait Phase Detection for Assisted Walking',
        date: 'Feb. 2023 - Jul. 2023',
        description: 'Analyzed spinal cord injury (SCI) patient biomechanics using advanced signal processing techniques. Applied Principal Component Analysis (PCA) across 15 biomechanical parameters to identify gait phase patterns. Processed electromyography (EMG) signals to quantify neuromuscular responses. Evaluated effects of Epidural Electrical Stimulation (EES) on gait rehabilitation using OpenSim and Scone simulation frameworks for comprehensive neurorehabilitation assessment.',
        report: 'Advanced biomechanical analysis of assisted gait in SCI patients. PCA dimensionality reduction across 15 parameters reveals gait phase signatures. EMG processing quantifies neuromuscular adaptation to EES. OpenSim/Scone simulations predict therapeutic outcomes.',
        techStack: ['PCA', 'EMG Analysis', 'Signal Processing', 'OpenSim', 'Scone', 'Matlab']
    }
};

// =============================================
// HAMBURGER MENU TOGGLE
// =============================================

function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

hamburger.addEventListener('click', toggleMenu);

// =============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// =============================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            e.preventDefault();
            closeMenu();

            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            setTimeout(() => {
                window.history.pushState(null, null, `#${targetId}`);
            }, 300);
        }
    });
});

// =============================================
// MODAL FUNCTIONALITY
// =============================================

function openModal(projectId) {
    const project = projectData[projectId];
    
    if (!project) return;

    // Populate modal content
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-date').textContent = project.date;
    document.getElementById('modal-description').textContent = project.description;
    document.getElementById('modal-report').textContent = project.report;

    // Populate tech stack
    const techStackContainer = document.getElementById('modal-tech-stack');
    techStackContainer.innerHTML = project.techStack
        .map(tech => `<div class="tech-stack-item">${tech}</div>`)
        .join('');

    // Populate links
    const linksContainer = document.getElementById('modal-links');
    linksContainer.innerHTML = `
        <button class="modal-link-btn" disabled>View Report (PDF) - Coming Soon</button>
        <button class="modal-link-btn" disabled>Source Code - Coming Soon</button>
    `;

    // Set placeholder image
    document.getElementById('modal-image').src = `https://via.placeholder.com/800x300?text=${encodeURIComponent(project.title)}`;

    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on X button click
modalClose.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
    }
});

// Add click listeners to project cards
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        openModal(projectId);
    });

    // Keyboard support (Enter key)
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const projectId = card.dataset.projectId;
            openModal(projectId);
        }
    });
});

// =============================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// =============================================

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
    }
});

// =============================================
// CLOSE MENU ON ESC KEY
// =============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// =============================================
// ACTIVE LINK HIGHLIGHTING
// =============================================

function updateActiveLink() {
    let currentSection = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

window.addEventListener('scroll', updateActiveLink);

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    updateActiveLink();
});

// =============================================
// END OF SCRIPT
// =============================================
