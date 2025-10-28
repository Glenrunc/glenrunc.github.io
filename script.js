/* ============================================
   MINIMALIST PORTFOLIO - SCRIPT.JS
   Game of Life, Smooth scrolling, GitHub API, Video modal
   ============================================ */

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
            
            // Convert Markdown to HTML
            const htmlContent = convertMarkdownToHTML(readmeContent);
            
            // Check if README is long (more than 500 characters)
            const isLongReadme = readmeContent.length > 500;
            const previewHTML = isLongReadme 
                ? convertMarkdownToHTML(readmeContent.substring(0, 500) + '...')
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
function convertMarkdownToHTML(markdown) {
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
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold;');
console.log('%cWelcome to my portfolio. Feel free to explore the code!', 'font-size: 14px;');
