/* ============================================
   MINIMALIST PORTFOLIO - SCRIPT.JS
   Game of Life, Smooth scrolling, GitHub API, Video modal, Visitor Counter
   ============================================ */

// ============================================
// VISITOR COUNTER
// ============================================
async function initVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    
    if (!counterElement) {
        console.log('Counter element not found');
        return;
    }
    
    try {
        // Using a more reliable counter API - countapi.xyz with correct endpoint
        const apiUrl = 'https://api.countapi.xyz/hit/glenrunc.github.io/portfolio';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('API response not OK');
        }
        
        const data = await response.json();
        
        console.log('Counter data:', data); // Debug
        
        if (data && data.value !== undefined) {
            // Animate the counter
            animateCounter(counterElement, data.value);
        } else {
            counterElement.textContent = '—';
        }
    } catch (error) {
        console.error('Visitor counter error:', error);
        counterElement.textContent = '—';
    }
}

function animateCounter(element, targetValue) {
    let currentValue = 0;
    const duration = 1500; // 1.5 seconds
    const increment = targetValue / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 16);
}

// ============================================
// CONWAY'S GAME OF LIFE BACKGROUND
// ============================================
class GameOfLife {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 15;
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
        this.animationId = null;
        this.frameCount = 0;
        this.frameRate = 8; // Update every 8 frames
        
        this.setupCanvas();
        this.initializeGrid();
        this.animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.initializeGrid();
        });
    }
    
    setupCanvas() {
        // Set canvas size to match hero section
        const heroSection = document.querySelector('.hero');
        this.canvas.width = heroSection.offsetWidth;
        this.canvas.height = heroSection.offsetHeight;
        
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
    }
    
    initializeGrid() {
        // Create 2D array with random initial state
        this.grid = [];
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // 20% chance of cell being alive
                this.grid[i][j] = Math.random() < 0.2 ? 1 : 0;
            }
        }
    }
    
    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const row = (x + i + this.rows) % this.rows;
                const col = (y + j + this.cols) % this.cols;
                count += this.grid[row][col];
            }
        }
        return count;
    }
    
    updateGrid() {
        const newGrid = [];
        
        for (let i = 0; i < this.rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                const neighbors = this.countNeighbors(i, j);
                const currentState = this.grid[i][j];
                
                // Conway's Game of Life rules
                if (currentState === 1) {
                    // Cell is alive
                    newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    // Cell is dead
                    newGrid[i][j] = (neighbors === 3) ? 1 : 0;
                }
            }
        }
        
        this.grid = newGrid;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f9f9f9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] === 1) {
                    this.ctx.fillStyle = '#1a1a1a';
                    this.ctx.fillRect(
                        j * this.cellSize,
                        i * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }
    
    animate() {
        this.frameCount++;
        
        // Update grid at specified frame rate
        if (this.frameCount % this.frameRate === 0) {
            this.updateGrid();
        }
        
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize Game of Life when DOM is ready
let gameOfLife;
document.addEventListener('DOMContentLoaded', () => {
    gameOfLife = new GameOfLife('game-of-life');
    initVisitorCounter();
});

// ============================================
// SMOOTH SCROLLING
// ============================================
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

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// FADE-IN ANIMATION ON SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ============================================
// GITHUB API - FETCH REPOSITORIES
// ============================================
const GITHUB_USERNAME = 'Glenrunc'; // Your GitHub username
const projectsGrid = document.getElementById('projects-grid');

// ============================================
// CONFIGURE YOUR PROJECTS HERE
// Add the exact repository names you want to display with their metadata
// ============================================
const SELECTED_REPOS = [

    {
        name: "Hackathon_CTI_UQAC",
        status: "finished",     // Options: "in-progress" or "finished"
        type: "personal",            // Options: "school" or "personal"
        image: null                // Optional: URL to project image or null
    },
    {
        name: "Hack-Compiler-Suite",
        status: "in-progress",     // Options: "in-progress" or "finished"
        type: "personal",            // Options: "school" or "personal"
        image: null                // Optional: URL to project image or null
    },
    // Add more projects here
    {
        name: 'Rasende_Roboter',
        status: 'finished',
        type: 'school',
        image: 'assets/arbre.png'
    },
    {
        name: 'ConwayGame',
        status: 'finished',
        type: 'personnal',
        image: 'assets/conway.png'
    },
];

/**
 * Fetch specific repositories from GitHub API
 * Only displays the repositories listed in SELECTED_REPOS
 */
async function fetchGitHubProjects() {
    try {
        // Show loading state
        projectsGrid.innerHTML = '<div class="loading">Loading projects...</div>';
        
        // Clear loading message
        projectsGrid.innerHTML = '';
        
        // Fetch each selected repository
        for (const project of SELECTED_REPOS) {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${GITHUB_USERNAME}/${project.name}`
                );
                
                if (response.ok) {
                    const repo = await response.json();
                    const projectCard = await createProjectCard(repo, project.status, project.type, project.image);
                    projectsGrid.appendChild(projectCard);
                } else {
                    console.warn(`Repository "${project.name}" not found or not accessible`);
                }
            } catch (error) {
                console.error(`Error fetching repository "${project.name}":`, error);
            }
        }
        
        // If no projects were loaded, show a message
        if (projectsGrid.children.length === 0) {
            projectsGrid.innerHTML = `
                <div class="loading">
                    No projects configured. Add repository names to SELECTED_REPOS in script.js
                </div>
            `;
        }
        
        // Re-initialize scroll reveal for newly added project cards
        if (typeof initScrollReveal === 'function') {
            setTimeout(() => {
                initScrollReveal();
            }, 100);
        }
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = `
            <div class="loading" style="color: #ff4444;">
                Error loading projects. Please try again later.
            </div>
        `;
    }
}

/**
 * Create a project card element from repository data
 * Fetches and displays the README content with Markdown rendering
 * @param {Object} repo - Repository object from GitHub API
 * @param {string} status - Project status: "in-progress" or "finished"
 * @param {string} type - Project type: "school" or "personal"
 * @param {string|null} image - Optional project image URL
 * @returns {HTMLElement} - Project card element
 */
async function createProjectCard(repo, status, type, image) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Extract topics/languages (GitHub topics)
    const topics = repo.topics || [];
    const topicsHTML = topics.slice(0, 3).map(topic => 
        `<span class="topic-tag">${topic}</span>`
    ).join('');
    
    // Create status badge
    const statusBadge = status === 'finished' 
        ? '<span class="status-badge status-finished">✓ Finished</span>'
        : '<span class="status-badge status-in-progress">⚙ In Progress</span>';
    
    // Create type badge
    const typeBadge = type === 'school'
        ? '<span class="type-badge type-school">🎓 School Project</span>'
        : '<span class="type-badge type-personal">💡 Personal Project</span>';
    
    // Create image HTML if image is provided
    const imageHTML = image 
        ? `<div class="project-image">
               <img src="${image}" alt="${repo.name}" />
           </div>`
        : '';
    
    // Fetch README content
    let readmeContent = 'No README available for this project.';
    let readmeHTML = '';
    
    try {
        const readmeResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            }
        );
        
        if (readmeResponse.ok) {
            readmeContent = await readmeResponse.text();
            
            // Convert Markdown to HTML (pass repo name for image URL conversion)
            const htmlContent = convertMarkdownToHTML(readmeContent, repo.name);
            
            // Check if README is long (more than 500 characters)
            const isLongReadme = readmeContent.length > 500;
            const previewHTML = isLongReadme 
                ? convertMarkdownToHTML(readmeContent.substring(0, 500) + '...', repo.name)
                : htmlContent;
            
            if (isLongReadme) {
                readmeHTML = `
                    <div class="readme-content">
                        <div class="readme-preview">
                            ${previewHTML}
                        </div>
                        <div class="readme-full" style="display: none;">
                            ${htmlContent}
                        </div>
                        <button class="readme-toggle" onclick="toggleReadme(this)">
                            Show More
                        </button>
                    </div>
                `;
            } else {
                readmeHTML = `
                    <div class="readme-content">
                        ${htmlContent}
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error(`Error fetching README for ${repo.name}:`, error);
        readmeHTML = `<p class="readme-error">Unable to load README.</p>`;
    }
    
    // Create the card HTML
    card.innerHTML = `
        ${imageHTML}
        <div class="project-header">
            <div class="project-title-row">
                <h3 class="project-name">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                        ${repo.name}
                    </a>
                </h3>
                <div class="project-badges">
                    ${statusBadge}
                    ${typeBadge}
                </div>
            </div>
            <p class="project-description">
                ${repo.description || 'No description available.'}
            </p>
            ${topicsHTML ? `<div class="project-topics">${topicsHTML}</div>` : ''}
        </div>
        
        <div class="project-abstract">
            <h4>About This Project</h4>
            ${readmeHTML}
        </div>
    `;
    
    return card;
}

/**
 * Convert Markdown to HTML
 * Basic Markdown parser for common formatting
 * @param {string} markdown - Markdown text
 * @returns {string} - HTML text
 */
function convertMarkdownToHTML(markdown, repoName = null) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Images - Convert Markdown images to HTML with proper URL handling
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        let imageSrc = src;
        
        // Si c'est un chemin relatif, le convertir en URL GitHub raw
        if (repoName && !src.startsWith('http')) {
            // Enlever les ./ ou ../ du début
            const cleanSrc = src.replace(/^\.\//, '').replace(/^\.\.\//, '');
            imageSrc = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/${cleanSrc}`;
        }
        // Si c'est déjà une URL GitHub (blob), la convertir en raw
        else if (src.includes('github.com') && src.includes('/blob/')) {
            imageSrc = src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        
        return `<img src="${imageSrc}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`;
    });
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }
    
    return html;
}

/**
 * Helper function to escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Toggle README expand/collapse
 * @param {HTMLElement} button - The toggle button element
 */
function toggleReadme(button) {
    const readmeContent = button.closest('.readme-content');
    const preview = readmeContent.querySelector('.readme-preview');
    const full = readmeContent.querySelector('.readme-full');
    
    if (full.style.display === 'none') {
        preview.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Show Less';
    } else {
        preview.style.display = 'block';
        full.style.display = 'none';
        button.textContent = 'Show More';
    }
}

// Fetch projects when page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// ============================================
// VIDEO MODAL FUNCTIONALITY
// ============================================
const modal = document.getElementById('video-modal');
const modalClose = document.querySelector('.modal-close');
const videoIframe = document.getElementById('video-iframe');
const videoCards = document.querySelectorAll('.video-card');

/**
 * Open video modal with specified video URL
 * @param {string} videoUrl - YouTube/Vimeo watch or embed URL
 */
function openVideoModal(videoUrl) {
    // Convert YouTube watch URL to embed URL
    let embedUrl = videoUrl;
    
    // Handle YouTube URLs
    if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle Vimeo URLs
    else if (videoUrl.includes('vimeo.com/') && !videoUrl.includes('/video/')) {
        const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    
    videoIframe.src = embedUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Close video modal and stop video playback
 */
function closeVideoModal() {
    videoIframe.src = ''; // Stop video playback
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Add click event to each video card
videoCards.forEach(card => {
    card.addEventListener('click', () => {
        const videoUrl = card.getAttribute('data-video');
        openVideoModal(videoUrl);
    });
});

// Close modal when clicking the X button
modalClose.addEventListener('click', closeVideoModal);

// Close modal when clicking outside the video
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeVideoModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeVideoModal();
    }
});

// ============================================
// LANGUAGE TOGGLE (FR / EN)
// ============================================
const langToggle = document.getElementById('lang-toggle');
const langText = langToggle.querySelector('.lang-text');

// Check for saved language preference or default to English
let currentLang = localStorage.getItem('language') || 'en';
if (currentLang === 'fr') {
    langText.textContent = 'FR';
    updateLanguage('fr');
}

langToggle.addEventListener('click', () => {
    // Toggle between EN and FR
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    langText.textContent = currentLang.toUpperCase();
    localStorage.setItem('language', currentLang);
    updateLanguage(currentLang);
});

function updateLanguage(lang) {
    // Update all elements with data-en and data-fr attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
}

// ============================================
// MORE PROJECTS - HORIZONTAL SCROLL
// ============================================
async function fetchMoreProjects() {
    const moreProjectsList = document.getElementById('more-projects-list');
    
    if (!moreProjectsList) return;
    
    try {
        // Fetch all public repos
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        // Clear loading message
        moreProjectsList.innerHTML = '';
        
        // Filter out the selected repos that are already displayed in main projects
        const selectedRepoNames = SELECTED_REPOS.map(r => r.name.toLowerCase());
        const otherRepos = repos.filter(repo => 
            !selectedRepoNames.includes(repo.name.toLowerCase()) &&
            !repo.fork // Exclude forked repositories
        );
        
        // Create mini cards for each repo
        otherRepos.slice(0, 12).forEach(repo => {
            const miniCard = createMiniProjectCard(repo);
            moreProjectsList.appendChild(miniCard);
        });
        
        // If no projects found
        if (otherRepos.length === 0) {
            moreProjectsList.innerHTML = '<div class="loading-small">No additional projects found</div>';
        }
        
    } catch (error) {
        console.error('Error fetching more projects:', error);
        moreProjectsList.innerHTML = '<div class="loading-small">Error loading projects</div>';
    }
}

function createMiniProjectCard(repo) {
    const card = document.createElement('a');
    card.className = 'project-mini-card';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    
    // Truncate description if too long
    const description = repo.description || 'No description available';
    const truncatedDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
    
    // Get primary language color
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Rust': '#dea584',
        'Go': '#00ADD8',
        'Ruby': '#701516',
        'PHP': '#4F5D95',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33'
    };
    
    const languageColor = languageColors[repo.language] || 'var(--text-tertiary)';
    
    card.innerHTML = `
        <div class="project-mini-header">
            <h3 class="project-mini-title">${repo.name}</h3>
            <span class="project-mini-icon">→</span>
        </div>
        <p class="project-mini-description">${truncatedDesc}</p>
        <div class="project-mini-footer">
            ${repo.language ? `
                <span class="project-mini-language">
                    <span class="language-dot" style="background: ${languageColor}"></span>
                    ${repo.language}
                </span>
            ` : ''}
            ${repo.stargazers_count > 0 ? `
                <span class="project-mini-stars">
                    ★ ${repo.stargazers_count}
                </span>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Load more projects when DOM is ready
document.addEventListener('DOMContentLoaded', fetchMoreProjects);

// ============================================
// WOW EFFECTS - SUBTLE MOUSE PARTICLE TRAIL
// ============================================
class ParticleTrail {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.addEventListeners();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '50';
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create only 1 particle on mouse move
            this.particles.push(new Particle(this.mouse.x, this.mouse.y));
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.decay = 0.02;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.96;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particle trail on desktop only
if (window.innerWidth > 768) {
    window.addEventListener('load', () => {
        new ParticleTrail();
    });
}

// ============================================
// WOW EFFECTS - ANIMATED GRADIENT TITLE
// ============================================
function initTitleEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    // Split text into individual letters
    const text = title.textContent;
    title.innerHTML = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'title-letter';
        span.style.animationDelay = `${index * 0.05}s`;
        if (char === ' ') {
            span.style.marginRight = '0.5em';
        }
        title.appendChild(span);
    });
}

// Initialize on load
window.addEventListener('load', initTitleEffect);

// ============================================
// WOW EFFECTS - CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dotX = e.clientX;
        dotY = e.clientY;
    });
    
    // Smooth cursor follow
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        cursorDot.style.transform = `translate(${dotX - 2}px, ${dotY - 2}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .topic-card, .project-mini-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
}

// ============================================
// WOW EFFECTS - SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all cards and experience items
    document.querySelectorAll('.project-card, .experience-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// WOW EFFECTS - MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-button, .lang-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize all wow effects
window.addEventListener('load', () => {
    // Custom cursor only on desktop
    if (window.innerWidth > 768) {
        initCustomCursor();
        initMagneticButtons();
    }
    // Scroll reveal on all devices
    setTimeout(() => {
        initScrollReveal();
    }, 500);
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold;');
console.log('%cWelcome to my portfolio. Feel free to explore the code!', 'font-size: 14px;');
