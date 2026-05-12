'use strict';

/* =============================================================
   GRAPH PORTFOLIO
   ============================================================= */

const WORLD = { w: 3000, h: 2200 };
const CX = 1500, CY = 1100;
const HEADER_H = 44;
const SCALE_MIN = 0.25, SCALE_MAX = 2.2, SCALE_STEP = 0.1;

const state = {
    pan: { x: 0, y: 0 },
    scale: 0.85,
    dragging: false,
    didDrag: false,
    dragStart: { x: 0, y: 0 },
    panStart: { x: 0, y: 0 },
    activeNodeId: null,
    lang: localStorage.getItem('lang') || 'en',
    flyAnim: null,
};

/* ── Node data ─────────────────────────────────────────────── */
const NODES = [
    {
        id: 'identity', type: 'identity',
        x: CX, y: CY,
        en: 'Mattéo Pourcine', fr: 'Mattéo Pourcine',
        sub_en: 'AI Systems Engineer', sub_fr: 'Ingénieur Systèmes IA',
        panel: {
            path: '~/whoami',
            en: `
<div class="p-section">
  <div class="p-prompt">matteo@portfolio:~$ whoami</div>
  <div class="p-name">Mattéo Pourcine</div>
  <div class="p-role">AI Systems Engineer</div>
  <div class="p-date">📍 France · open to relocation</div>
  <div class="p-seeking">Seeking internship or full-time — AI / Computer Vision</div>
</div>
<div class="p-section">
  <div class="p-label">About</div>
  <p class="p-bio">Engineering student at UTBM specializing in AI systems — computer vision, deep learning, and GPU computing. I build systems that see, understand, and act.</p>
  <p class="p-bio">International background: exchanges at UQAC (Canada) and AGH (Poland). Former CTO at AnotherBrain, a bio-inspired AI startup.</p>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">C++</span>
    <span class="p-badge">CuPy / CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Docker</span>
    <span class="p-badge">Linux</span>
  </div>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com">pourcinematteo@gmail.com</a>
  <div class="p-socials">
    <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
    <a class="p-link" href="https://linkedin.com/in/matteo-pourcine" target="_blank">→ linkedin.com/in/matteo-pourcine</a>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">matteo@portfolio:~$ whoami</div>
  <div class="p-name">Mattéo Pourcine</div>
  <div class="p-role">Ingénieur Systèmes IA</div>
  <div class="p-date">📍 France · mobilité internationale</div>
  <div class="p-seeking">Recherche stage ou CDI — IA / Vision par Ordinateur</div>
</div>
<div class="p-section">
  <div class="p-label">À propos</div>
  <p class="p-bio">Étudiant ingénieur à l'UTBM spécialisé en systèmes IA — vision par ordinateur, deep learning et calcul GPU. Je construis des systèmes qui voient, comprennent et agissent.</p>
  <p class="p-bio">Parcours international : échanges à l'UQAC (Canada) et l'AGH (Pologne). Ancien CTO chez AnotherBrain, startup d'IA bio-inspirée.</p>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">C++</span>
    <span class="p-badge">CuPy / CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Docker</span>
    <span class="p-badge">Linux</span>
  </div>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com">pourcinematteo@gmail.com</a>
  <div class="p-socials">
    <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
    <a class="p-link" href="https://linkedin.com/in/matteo-pourcine" target="_blank">→ linkedin.com/in/matteo-pourcine</a>
  </div>
</div>`
        }
    },

    /* ── Cluster hubs ──────────────────────────────────────── */
    {
        id: 'hub-exp', type: 'cluster',
        x: 1260, y: 940,
        en: 'Experience', fr: 'Expérience',
        sub_en: '4 entries', sub_fr: '4 entrées',
        panel: {
            path: '~/experience',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/experience</div>
  <div class="p-label">Academic &amp; Professional</div>
  <ul class="p-list">
    <li>AnotherBrain — AI Startup, CTO</li>
    <li>UTBM — Engineering degree (ongoing)</li>
    <li>UQAC — Exchange, Québec, Canada</li>
    <li>AGH — Exchange, Kraków, Poland</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/expérience</div>
  <div class="p-label">Académique &amp; Professionnel</div>
  <ul class="p-list">
    <li>AnotherBrain — Startup IA, CTO</li>
    <li>UTBM — Diplôme ingénieur (en cours)</li>
    <li>UQAC — Échange, Québec, Canada</li>
    <li>AGH — Échange, Cracovie, Pologne</li>
  </ul>
</div>`
        }
    },
    {
        id: 'hub-proj', type: 'cluster',
        x: 1740, y: 940,
        en: 'Projects', fr: 'Projets',
        sub_en: '3 featured', sub_fr: '3 sélectionnés',
        panel: {
            path: '~/projects',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/projects --featured</div>
  <div class="p-label">Selected Work</div>
  <ul class="p-list">
    <li>MI7 — Real-time CV pipeline</li>
    <li>Chatbot — RAG-powered assistant</li>
    <li>Hackathon — 24h AI challenge</li>
  </ul>
  <div class="p-label" style="margin-top:1rem">More on GitHub</div>
  <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/projets --sélectionnés</div>
  <div class="p-label">Travaux Sélectionnés</div>
  <ul class="p-list">
    <li>MI7 — Pipeline CV temps réel</li>
    <li>Chatbot — Assistant RAG</li>
    <li>Hackathon — Défi IA 24h</li>
  </ul>
  <div class="p-label" style="margin-top:1rem">Plus sur GitHub</div>
  <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
</div>`
        }
    },
    {
        id: 'hub-skills', type: 'cluster',
        x: 1500, y: 1360,
        en: 'Skills', fr: 'Compétences',
        sub_en: 'tech stack', sub_fr: 'stack technique',
        panel: {
            path: '~/skills',
            en: `
<div class="p-section">
  <div class="p-prompt">cat ~/skills/tech.md</div>
  <div class="p-label">Languages</div>
  <div class="p-tech">
    <span class="p-badge">Python</span><span class="p-badge">C++</span>
    <span class="p-badge">C</span><span class="p-badge">Bash</span>
  </div>
  <div class="p-label">ML / Vision</div>
  <div class="p-tech">
    <span class="p-badge">PyTorch</span><span class="p-badge">OpenCV</span>
    <span class="p-badge">scikit-learn</span><span class="p-badge">NumPy</span>
  </div>
  <div class="p-label">GPU / Perf</div>
  <div class="p-tech">
    <span class="p-badge">CuPy</span><span class="p-badge">CUDA</span>
    <span class="p-badge">TensorRT</span>
  </div>
  <div class="p-label">Tools</div>
  <div class="p-tech">
    <span class="p-badge">Docker</span><span class="p-badge">Git</span>
    <span class="p-badge">Linux</span><span class="p-badge">CMake</span>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat ~/compétences/tech.md</div>
  <div class="p-label">Langages</div>
  <div class="p-tech">
    <span class="p-badge">Python</span><span class="p-badge">C++</span>
    <span class="p-badge">C</span><span class="p-badge">Bash</span>
  </div>
  <div class="p-label">ML / Vision</div>
  <div class="p-tech">
    <span class="p-badge">PyTorch</span><span class="p-badge">OpenCV</span>
    <span class="p-badge">scikit-learn</span><span class="p-badge">NumPy</span>
  </div>
  <div class="p-label">GPU / Perf</div>
  <div class="p-tech">
    <span class="p-badge">CuPy</span><span class="p-badge">CUDA</span>
    <span class="p-badge">TensorRT</span>
  </div>
  <div class="p-label">Outils</div>
  <div class="p-tech">
    <span class="p-badge">Docker</span><span class="p-badge">Git</span>
    <span class="p-badge">Linux</span><span class="p-badge">CMake</span>
  </div>
</div>`
        }
    },
    {
        id: 'hub-interests', type: 'cluster',
        x: 1260, y: 1280,
        en: 'Interests', fr: "Centres d'intérêt",
        sub_en: 'beyond code', sub_fr: 'au-delà du code',
        panel: {
            path: '~/interests',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/interests</div>
  <div class="p-label">Creative &amp; Personal</div>
  <ul class="p-list">
    <li>Documentary filmmaking</li>
    <li>Travel &amp; cultural immersion</li>
    <li>Philosophy of mind &amp; AI ethics</li>
    <li>Rock climbing</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/centres-d-intérêt</div>
  <div class="p-label">Créatif &amp; Personnel</div>
  <ul class="p-list">
    <li>Réalisation de documentaires</li>
    <li>Voyages &amp; immersion culturelle</li>
    <li>Philosophie de l'esprit &amp; éthique IA</li>
    <li>Escalade</li>
  </ul>
</div>`
        }
    },

    /* ── Experience nodes ──────────────────────────────────── */
    {
        id: 'anotherbrain', type: 'experience',
        x: 1020, y: 820,
        en: 'AnotherBrain', fr: 'AnotherBrain',
        sub_en: 'CTO · AI Startup', sub_fr: 'CTO · Startup IA',
        panel: {
            path: '~/exp/anotherbrain',
            en: `
<div class="p-section">
  <div class="p-prompt">cat anotherbrain.md</div>
  <div class="p-name">AnotherBrain</div>
  <div class="p-meta">Chief Technology Officer</div>
  <div class="p-date">2023 — 2024 · Paris, France</div>
</div>
<div class="p-section">
  <div class="p-label">Overview</div>
  <p class="p-text">AnotherBrain develops bio-inspired "Organic Intelligence" — a novel AI paradigm that mimics the brain's unsupervised learning mechanisms. Computationally efficient and privacy-preserving by design.</p>
</div>
<div class="p-section">
  <div class="p-label">Responsibilities</div>
  <ul class="p-list">
    <li>Led the technical roadmap and engineering team</li>
    <li>Designed and deployed computer vision inference pipelines</li>
    <li>Optimized GPU inference with CuPy and custom CUDA kernels</li>
    <li>Built internal tooling for dataset management and evaluation</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">CuPy</span>
    <span class="p-badge">CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Docker</span>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat anotherbrain.md</div>
  <div class="p-name">AnotherBrain</div>
  <div class="p-meta">Directeur Technique (CTO)</div>
  <div class="p-date">2023 — 2024 · Paris, France</div>
</div>
<div class="p-section">
  <div class="p-label">Présentation</div>
  <p class="p-text">AnotherBrain développe une "Intelligence Organique" bio-inspirée — un paradigme IA imitant les mécanismes d'apprentissage non supervisé du cerveau. Efficace en calcul et respectueuse de la vie privée par conception.</p>
</div>
<div class="p-section">
  <div class="p-label">Responsabilités</div>
  <ul class="p-list">
    <li>Direction de la feuille de route technique et de l'équipe</li>
    <li>Conception et déploiement de pipelines de vision par ordinateur</li>
    <li>Optimisation de l'inférence GPU avec CuPy et CUDA</li>
    <li>Développement d'outils internes pour la gestion des datasets</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">CuPy</span>
    <span class="p-badge">CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Docker</span>
  </div>
</div>`
        }
    },
    {
        id: 'utbm', type: 'experience',
        x: 1370, y: 780,
        en: 'UTBM', fr: 'UTBM',
        sub_en: 'Engineering degree', sub_fr: 'Diplôme ingénieur',
        panel: {
            path: '~/exp/utbm',
            en: `
<div class="p-section">
  <div class="p-prompt">cat utbm.md</div>
  <div class="p-name">UTBM</div>
  <div class="p-meta">Université de Technologie de Belfort-Montbéliard</div>
  <div class="p-date">2021 — 2026 (expected) · Belfort, France</div>
</div>
<div class="p-section">
  <div class="p-label">Program</div>
  <p class="p-text">Engineering degree in Informatics &amp; Systems. Specialization in AI — computer vision, signal processing, embedded systems.</p>
</div>
<div class="p-section">
  <div class="p-label">Key Courses</div>
  <ul class="p-list">
    <li>Computer Vision &amp; Image Processing</li>
    <li>Machine Learning &amp; Neural Networks</li>
    <li>Real-time Systems &amp; Embedded C++</li>
    <li>Signal Processing</li>
    <li>Software Architecture</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat utbm.md</div>
  <div class="p-name">UTBM</div>
  <div class="p-meta">Université de Technologie de Belfort-Montbéliard</div>
  <div class="p-date">2021 — 2026 (prévu) · Belfort, France</div>
</div>
<div class="p-section">
  <div class="p-label">Formation</div>
  <p class="p-text">Diplôme d'ingénieur en Informatique et Systèmes. Spécialisation IA — vision par ordinateur, traitement du signal, systèmes embarqués.</p>
</div>
<div class="p-section">
  <div class="p-label">Cours Principaux</div>
  <ul class="p-list">
    <li>Vision par Ordinateur &amp; Traitement d'Images</li>
    <li>Machine Learning &amp; Réseaux de Neurones</li>
    <li>Systèmes Temps Réel &amp; C++ Embarqué</li>
    <li>Traitement du Signal</li>
    <li>Architecture Logicielle</li>
  </ul>
</div>`
        }
    },
    {
        id: 'uqac', type: 'experience',
        x: 980, y: 1060,
        en: 'UQAC', fr: 'UQAC',
        sub_en: 'Exchange · Canada', sub_fr: 'Échange · Canada',
        panel: {
            path: '~/exp/uqac',
            en: `
<div class="p-section">
  <div class="p-prompt">cat uqac.md</div>
  <div class="p-name">UQAC</div>
  <div class="p-meta">Université du Québec à Chicoutimi</div>
  <div class="p-date">2024 · Saguenay, Québec, Canada</div>
</div>
<div class="p-section">
  <div class="p-label">Exchange Program</div>
  <p class="p-text">Academic exchange focused on deep learning and applied AI research. Worked on PyTorch-based models for image classification and segmentation.</p>
</div>
<div class="p-section">
  <div class="p-label">Courses</div>
  <ul class="p-list">
    <li>Deep Learning &amp; Representation Learning</li>
    <li>Applied Computer Vision</li>
    <li>Research Methods in AI</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat uqac.md</div>
  <div class="p-name">UQAC</div>
  <div class="p-meta">Université du Québec à Chicoutimi</div>
  <div class="p-date">2024 · Saguenay, Québec, Canada</div>
</div>
<div class="p-section">
  <div class="p-label">Programme d'Échange</div>
  <p class="p-text">Échange académique centré sur le deep learning et la recherche IA appliquée. Travail sur des modèles PyTorch pour la classification et segmentation d'images.</p>
</div>
<div class="p-section">
  <div class="p-label">Cours</div>
  <ul class="p-list">
    <li>Deep Learning &amp; Apprentissage des Représentations</li>
    <li>Vision par Ordinateur Appliquée</li>
    <li>Méthodes de Recherche en IA</li>
  </ul>
</div>`
        }
    },
    {
        id: 'agh', type: 'experience',
        x: 1190, y: 730,
        en: 'AGH', fr: 'AGH',
        sub_en: 'Exchange · Poland', sub_fr: 'Échange · Pologne',
        panel: {
            path: '~/exp/agh',
            en: `
<div class="p-section">
  <div class="p-prompt">cat agh.md</div>
  <div class="p-name">AGH University</div>
  <div class="p-meta">AGH University of Science and Technology</div>
  <div class="p-date">2023 · Kraków, Poland</div>
</div>
<div class="p-section">
  <div class="p-label">Exchange Program</div>
  <p class="p-text">Erasmus+ exchange at one of Poland's top technical universities. Focused on robotics, computer vision, and embedded systems integration.</p>
</div>
<div class="p-section">
  <div class="p-label">Courses</div>
  <ul class="p-list">
    <li>Robotics &amp; Autonomous Systems</li>
    <li>Embedded Vision Systems</li>
    <li>Advanced Algorithms</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat agh.md</div>
  <div class="p-name">AGH University</div>
  <div class="p-meta">AGH Université des Sciences et Technologies</div>
  <div class="p-date">2023 · Cracovie, Pologne</div>
</div>
<div class="p-section">
  <div class="p-label">Programme d'Échange</div>
  <p class="p-text">Échange Erasmus+ dans l'une des meilleures universités techniques polonaises. Accent sur la robotique, la vision par ordinateur et les systèmes embarqués.</p>
</div>
<div class="p-section">
  <div class="p-label">Cours</div>
  <ul class="p-list">
    <li>Robotique &amp; Systèmes Autonomes</li>
    <li>Systèmes de Vision Embarqués</li>
    <li>Algorithmes Avancés</li>
  </ul>
</div>`
        }
    },

    /* ── Project nodes ─────────────────────────────────────── */
    {
        id: 'mi7', type: 'project',
        x: 1960, y: 800,
        en: 'MI7', fr: 'MI7',
        sub_en: 'CV pipeline · real-time', sub_fr: 'Pipeline CV · temps réel',
        panel: {
            path: '~/projects/mi7',
            en: `
<div class="p-section">
  <div class="p-prompt">cat mi7/README.md</div>
  <div class="p-name">MI7</div>
  <div class="p-meta">Real-time Computer Vision Pipeline</div>
  <span class="p-badge-green">[WIP]</span>
</div>
<div class="p-section">
  <div class="p-label">Overview</div>
  <p class="p-text">High-performance CV pipeline for real-time object detection and tracking. Optimized for edge deployment with TensorRT and custom CUDA kernels.</p>
</div>
<div class="p-section">
  <div class="p-label">Features</div>
  <ul class="p-list">
    <li>Sub-30ms inference latency on embedded GPU</li>
    <li>Multi-object tracking with Kalman filter</li>
    <li>Custom PyTorch → TensorRT export pipeline</li>
    <li>REST API for remote control and monitoring</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">TensorRT</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">C++</span>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat mi7/README.md</div>
  <div class="p-name">MI7</div>
  <div class="p-meta">Pipeline de Vision par Ordinateur Temps Réel</div>
  <span class="p-badge-green">[EN COURS]</span>
</div>
<div class="p-section">
  <div class="p-label">Présentation</div>
  <p class="p-text">Pipeline CV haute performance pour la détection et le suivi d'objets en temps réel. Optimisé pour le déploiement embarqué avec TensorRT et des kernels CUDA personnalisés.</p>
</div>
<div class="p-section">
  <div class="p-label">Fonctionnalités</div>
  <ul class="p-list">
    <li>Latence d'inférence sous 30ms sur GPU embarqué</li>
    <li>Suivi multi-objets avec filtre de Kalman</li>
    <li>Pipeline d'export PyTorch → TensorRT personnalisé</li>
    <li>API REST pour contrôle et monitoring à distance</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">TensorRT</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">C++</span>
  </div>
</div>`
        }
    },
    {
        id: 'chatbot', type: 'project',
        x: 1830, y: 730,
        en: 'Chatbot', fr: 'Chatbot',
        sub_en: 'RAG · LLM assistant', sub_fr: 'RAG · assistant LLM',
        panel: {
            path: '~/projects/chatbot',
            en: `
<div class="p-section">
  <div class="p-prompt">cat chatbot/README.md</div>
  <div class="p-name">Chatbot</div>
  <div class="p-meta">RAG-Powered LLM Assistant</div>
  <span class="p-badge-cyan">[DONE]</span>
</div>
<div class="p-section">
  <div class="p-label">Overview</div>
  <p class="p-text">Retrieval-Augmented Generation chatbot grounded in a custom knowledge base. Built with LangChain, ChromaDB, and a local LLM for fully offline operation.</p>
</div>
<div class="p-section">
  <div class="p-label">Architecture</div>
  <ul class="p-list">
    <li>Document ingestion → chunking → embedding pipeline</li>
    <li>Semantic search with ChromaDB vector store</li>
    <li>Local LLM inference via Ollama</li>
    <li>Streamlit UI with conversation history</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">LangChain</span>
    <span class="p-badge">ChromaDB</span>
    <span class="p-badge">Ollama</span>
    <span class="p-badge">Streamlit</span>
  </div>
  <a class="p-github-link" style="margin-top:0.8rem;display:inline-block" href="https://github.com/Glenrunc" target="_blank">[ View on GitHub ]</a>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat chatbot/README.md</div>
  <div class="p-name">Chatbot</div>
  <div class="p-meta">Assistant LLM RAG</div>
  <span class="p-badge-cyan">[TERMINÉ]</span>
</div>
<div class="p-section">
  <div class="p-label">Présentation</div>
  <p class="p-text">Chatbot RAG ancré dans une base de connaissances personnalisée. Construit avec LangChain, ChromaDB et un LLM local pour un fonctionnement entièrement hors ligne.</p>
</div>
<div class="p-section">
  <div class="p-label">Architecture</div>
  <ul class="p-list">
    <li>Pipeline d'ingestion → découpage → embedding</li>
    <li>Recherche sémantique avec ChromaDB</li>
    <li>Inférence LLM locale via Ollama</li>
    <li>Interface Streamlit avec historique</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">LangChain</span>
    <span class="p-badge">ChromaDB</span>
    <span class="p-badge">Ollama</span>
    <span class="p-badge">Streamlit</span>
  </div>
  <a class="p-github-link" style="margin-top:0.8rem;display:inline-block" href="https://github.com/Glenrunc" target="_blank">[ Voir sur GitHub ]</a>
</div>`
        }
    },
    {
        id: 'hackathon', type: 'project',
        x: 2030, y: 1040,
        en: 'Hackathon', fr: 'Hackathon',
        sub_en: '24h AI challenge', sub_fr: 'Défi IA 24h',
        panel: {
            path: '~/projects/hackathon',
            en: `
<div class="p-section">
  <div class="p-prompt">cat hackathon/README.md</div>
  <div class="p-name">Hackathon</div>
  <div class="p-meta">24h AI Challenge — Computer Vision</div>
  <span class="p-badge-amber">[DONE]</span>
</div>
<div class="p-section">
  <div class="p-label">Challenge</div>
  <p class="p-text">Built a real-time defect detection system for industrial quality control in 24 hours. Trained a custom CNN on a synthetic dataset and deployed it as a FastAPI service.</p>
</div>
<div class="p-section">
  <div class="p-label">Outcome</div>
  <ul class="p-list">
    <li>Finished in the top 3</li>
    <li>Full pipeline shipped in 24h — data to REST deployment</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">FastAPI</span>
    <span class="p-badge">OpenCV</span>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat hackathon/README.md</div>
  <div class="p-name">Hackathon</div>
  <div class="p-meta">Défi IA 24h — Vision par Ordinateur</div>
  <span class="p-badge-amber">[TERMINÉ]</span>
</div>
<div class="p-section">
  <div class="p-label">Challenge</div>
  <p class="p-text">Système de détection de défauts en temps réel pour contrôle qualité industriel, construit en 24h. CNN personnalisé entraîné sur dataset synthétique, déployé comme service FastAPI.</p>
</div>
<div class="p-section">
  <div class="p-label">Résultat</div>
  <ul class="p-list">
    <li>Top 3 du classement final</li>
    <li>Pipeline complet livré en 24h — données vers déploiement REST</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">FastAPI</span>
    <span class="p-badge">OpenCV</span>
  </div>
</div>`
        }
    },

    /* ── GitHub repos node ─────────────────────────────────── */
    {
        id: 'github', type: 'cluster',
        x: 2160, y: 940,
        en: 'GitHub', fr: 'GitHub',
        sub_en: 'all repos →', sub_fr: 'tous les dépôts →',
        panel: { path: '~/github', en: '', fr: '' }, // rendered dynamically
    },

    /* ── Skill nodes (non-interactive) ─────────────────────── */
    { id: 'sk-python',  type: 'skill', x: 1280, y: 1490, en: 'Python',      fr: 'Python' },
    { id: 'sk-cupy',    type: 'skill', x: 1420, y: 1560, en: 'CuPy / CUDA', fr: 'CuPy / CUDA' },
    { id: 'sk-pytorch', type: 'skill', x: 1620, y: 1530, en: 'PyTorch',     fr: 'PyTorch' },
    { id: 'sk-cv',      type: 'skill', x: 1760, y: 1455, en: 'OpenCV',      fr: 'OpenCV' },
    { id: 'sk-cpp',     type: 'skill', x: 1160, y: 1435, en: 'C++',         fr: 'C++' },

    /* ── Interest nodes ────────────────────────────────────── */
    {
        id: 'documentary', type: 'interest',
        x: 1080, y: 1370,
        en: 'Documentary', fr: 'Documentaire',
        sub_en: 'science vulgarisation', sub_fr: 'vulgarisation scientifique',
        panel: {
            path: '~/interests/film',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/film</div>
  <div class="p-name">Documentary</div>
  <div class="p-meta">Science Vulgarisation</div>
</div>
<div class="p-section">
  <div class="p-label">About</div>
  <p class="p-text">Making science accessible through video. This documentary explores a scientific concept in a visual and engaging way.</p>
</div>
<div class="p-section">
  <div class="p-label">Watch</div>
  <button class="p-video-btn" data-url="https://www.youtube.com/embed/DI0o6LZMoyY">[▶ PLAY] Science Documentary</button>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/film</div>
  <div class="p-name">Documentaire</div>
  <div class="p-meta">Vulgarisation Scientifique</div>
</div>
<div class="p-section">
  <div class="p-label">À propos</div>
  <p class="p-text">Rendre la science accessible par la vidéo. Ce documentaire explore un concept scientifique de manière visuelle et accessible.</p>
</div>
<div class="p-section">
  <div class="p-label">Voir</div>
  <button class="p-video-btn" data-url="https://www.youtube.com/embed/DI0o6LZMoyY">[▶ PLAY] Documentaire Scientifique</button>
</div>`
        }
    },
    {
        id: 'travel', type: 'interest',
        x: 1060, y: 1210,
        en: 'Travel', fr: 'Voyages',
        sub_en: 'captured on film', sub_fr: 'cristallisés en vidéo',
        panel: {
            path: '~/interests/travel',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/travel</div>
  <div class="p-name">Travel</div>
  <div class="p-meta">Captured on Film</div>
</div>
<div class="p-section">
  <div class="p-label">About</div>
  <p class="p-text">I crystallize my travels through video — each trip becomes a short film, a way to hold onto the feeling of a place and share it.</p>
</div>
<div class="p-section">
  <div class="p-label">Watch</div>
  <button class="p-video-btn" data-url="https://www.youtube.com/embed/WH9RZPyhmNg">[▶ PLAY] Travel Film</button>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/voyages</div>
  <div class="p-name">Voyages</div>
  <div class="p-meta">Cristallisés en Vidéo</div>
</div>
<div class="p-section">
  <div class="p-label">À propos</div>
  <p class="p-text">Je cristallise mes voyages à travers la vidéo — chaque trip devient un court métrage, une façon de garder l'essence d'un endroit et de la partager.</p>
</div>
<div class="p-section">
  <div class="p-label">Voir</div>
  <button class="p-video-btn" data-url="https://www.youtube.com/embed/WH9RZPyhmNg">[▶ PLAY] Film de Voyage</button>
</div>`
        }
    },
];

/* ── Edge definitions ──────────────────────────────────────── */
const EDGES = [
    { from: 'identity',      to: 'hub-exp' },
    { from: 'identity',      to: 'hub-proj' },
    { from: 'identity',      to: 'hub-skills' },
    { from: 'identity',      to: 'hub-interests' },
    { from: 'hub-exp',       to: 'anotherbrain' },
    { from: 'hub-exp',       to: 'uqac' },
    { from: 'hub-exp',       to: 'agh' },
    { from: 'hub-exp',       to: 'utbm' },
    { from: 'hub-proj',      to: 'mi7' },
    { from: 'hub-proj',      to: 'hackathon' },
    { from: 'hub-proj',      to: 'chatbot' },
    { from: 'hub-proj',      to: 'github' },
    { from: 'hub-skills',    to: 'sk-python' },
    { from: 'hub-skills',    to: 'sk-cupy' },
    { from: 'hub-skills',    to: 'sk-pytorch' },
    { from: 'hub-skills',    to: 'sk-cv' },
    { from: 'hub-skills',    to: 'sk-cpp' },
    { from: 'hub-interests', to: 'documentary' },
    { from: 'hub-interests', to: 'travel' },
    // Cross-edges
    { from: 'anotherbrain',  to: 'sk-cupy' },
    { from: 'anotherbrain',  to: 'sk-python' },
    { from: 'uqac',          to: 'sk-pytorch' },
    { from: 'mi7',           to: 'sk-pytorch' },
    { from: 'utbm',          to: 'sk-cv' },
];


/* ── EdgePackets ────────────────────────────────────────────── */
class EdgePackets {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;z-index:5;width:${WORLD.w}px;height:${WORLD.h}px`;
        this.canvas.width  = WORLD.w;
        this.canvas.height = WORLD.h;
        document.getElementById('graph-world').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.packets = EDGES.map(edge => {
            const a = getNodeById(edge.from);
            const b = getNodeById(edge.to);
            return {
                from: edge.from, to: edge.to,
                x1: a.x, y1: a.y, x2: b.x, y2: b.y,
                t: Math.random(),
                speed: 0.0012 + Math.random() * 0.0018,
            };
        });
        this.animate();
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, WORLD.w, WORLD.h);
        const active = state.activeNodeId;
        this.packets.forEach(p => {
            p.t = (p.t + p.speed) % 1;
            const connected = !active || p.from === active || p.to === active;
            const alpha = connected ? (active ? 0.85 : 0.3) : 0.03;
            const x = p.x1 + (p.x2 - p.x1) * p.t;
            const y = p.y1 + (p.y2 - p.y1) * p.t;
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.fillRect(x - 2, y - 2, 4, 4);
        });
        requestAnimationFrame(() => this.animate());
    }
}

/* ── Helpers ───────────────────────────────────────────────── */
function getNodeById(id) {
    return NODES.find(n => n.id === id);
}

function getNeighborIds(nodeId) {
    const set = new Set();
    EDGES.forEach(e => {
        if (e.from === nodeId) set.add(e.to);
        if (e.to   === nodeId) set.add(e.from);
    });
    return set;
}

/* ── Node HTML ─────────────────────────────────────────────── */
function nodeInnerHTML(node) {
    const L     = state.lang;
    const label = L === 'fr' ? node.fr : node.en;
    const sub   = L === 'fr' ? (node.sub_fr || node.sub_en || '') : (node.sub_en || '');

    if (node.type === 'identity') {
        return `
            <div class="node-prompt">matteo@portfolio:~$</div>
            <div class="node-label">${label}</div>
            <div class="node-sub">${sub}</div>
            <div class="node-seeking">${L === 'fr' ? 'Ouvert aux opportunités' : 'Open to opportunities'}</div>`;
    }
    if (node.type === 'skill') {
        return `<span>${label}</span>`;
    }
    return `
        <div class="node-label">${label}</div>
        ${sub ? `<div class="node-sub">${sub}</div>` : ''}`;
}

/* ── Render ────────────────────────────────────────────────── */
function renderNodes() {
    const world = document.getElementById('graph-world');
    world.querySelectorAll('.graph-node').forEach(el => el.remove());

    NODES.forEach((node, i) => {
        const el = document.createElement('div');
        el.className = `graph-node node-${node.type}`;
        el.id = `node-${node.id}`;
        el.style.cssText = `left:${node.x}px;top:${node.y}px;animation-delay:${i * 0.045}s`;
        el.innerHTML = nodeInnerHTML(node);

        if (node.type !== 'skill') {
            el.addEventListener('click', e => {
                if (state.didDrag) return;
                e.stopPropagation();
                selectNode(node.id);
            });
        }
        world.appendChild(el);
    });
}

function renderEdges() {
    const svg = document.getElementById('edges-layer');
    svg.innerHTML = '';
    EDGES.forEach(edge => {
        const a = getNodeById(edge.from);
        const b = getNodeById(edge.to);
        if (!a || !b) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        line.classList.add('graph-edge');
        line.dataset.from = edge.from;
        line.dataset.to   = edge.to;
        svg.appendChild(line);
    });
}

/* ── Transform ─────────────────────────────────────────────── */
function applyTransform() {
    document.getElementById('graph-world').style.transform =
        `translate(${state.pan.x}px,${state.pan.y}px) scale(${state.scale})`;
}

function centerGraph() {
    const vw = window.innerWidth;
    const vh = window.innerHeight - HEADER_H;
    state.pan.x = vw / 2 - CX * state.scale;
    state.pan.y = vh / 2 - CY * state.scale;
    applyTransform();
}

/* ── Highlight ─────────────────────────────────────────────── */
function highlightGraph(nodeId) {
    const neighbors = getNeighborIds(nodeId);
    const active    = new Set([nodeId, ...neighbors]);

    document.querySelectorAll('.graph-node').forEach(el => {
        const id = el.id.replace('node-', '');
        el.classList.toggle('node-dimmed',     !active.has(id));
        el.classList.toggle('node-highlighted', active.has(id));
    });

    document.querySelectorAll('.graph-edge').forEach(el => {
        const connected = el.dataset.from === nodeId || el.dataset.to === nodeId;
        el.classList.toggle('edge-highlighted',  connected);
        el.classList.toggle('edge-dimmed',       !connected);
    });
}

function clearHighlight() {
    document.querySelectorAll('.graph-node').forEach(el =>
        el.classList.remove('node-dimmed', 'node-highlighted'));
    document.querySelectorAll('.graph-edge').forEach(el =>
        el.classList.remove('edge-dimmed', 'edge-highlighted'));
}

/* ── Selection ─────────────────────────────────────────────── */
function selectNode(id) {
    if (state.activeNodeId === id) { closePanel(); return; }
    state.activeNodeId = id;
    const node = getNodeById(id);
    if (!node) return;
    highlightGraph(id);
    flyToNode(node);
    if (node.panel) openPanel(node);
}

/* ── Panel ─────────────────────────────────────────────────── */
function openPanel(node) {
    const L    = state.lang;
    const body = document.getElementById('panel-body');
    document.getElementById('panel-path').textContent = node.panel.path || '~/portfolio';
    document.getElementById('detail-panel').classList.add('open');

    if (node.id === 'github') {
        renderGithubPanel(body, L);
        return;
    }

    body.innerHTML = L === 'fr' ? node.panel.fr : node.panel.en;
    body.querySelectorAll('.p-video-btn').forEach(btn => {
        btn.addEventListener('click', () => openVideoModal(btn.dataset.url));
    });
}

async function renderGithubPanel(body, L) {
    const loading = L === 'fr' ? 'Chargement des dépôts…' : 'Fetching repositories…';
    body.innerHTML = `<div class="p-section"><div class="p-prompt">curl api.github.com/users/Glenrunc/repos</div><p class="p-text">${loading}</p></div>`;

    try {
        const res   = await fetch('https://api.github.com/users/Glenrunc/repos?sort=updated&per_page=30');
        const repos = await res.json();
        const own   = repos
            .filter(r => !r.fork)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        const header = L === 'fr'
            ? `<div class="p-prompt">ls ~/projets (${own.length} dépôts)</div>`
            : `<div class="p-prompt">ls ~/projects (${own.length} repos)</div>`;

        body.innerHTML = `<div class="p-section">${header}</div>` +
            own.map(r => `
<div class="p-section" style="padding:0.75rem 1.4rem">
  <a class="p-link" href="${r.html_url}" target="_blank" style="font-size:0.85rem">${r.name}</a>
  ${r.description ? `<p class="p-text" style="margin:0.2rem 0 0.35rem;font-size:0.78rem;line-height:1.5">${r.description}</p>` : ''}
  <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-top:0.25rem">
    ${r.language ? `<span class="p-badge" style="font-size:0.68rem">${r.language}</span>` : ''}
    ${r.stargazers_count > 0 ? `<span style="font-size:0.68rem;color:var(--text-muted)">★ ${r.stargazers_count}</span>` : ''}
    <span style="font-size:0.68rem;color:var(--text-muted)">${new Date(r.pushed_at).toLocaleDateString(L === 'fr' ? 'fr-FR' : 'en-GB', { year:'numeric', month:'short' })}</span>
  </div>
</div>`).join('');
    } catch {
        const fallback = L === 'fr' ? 'API GitHub indisponible.' : 'GitHub API unavailable.';
        body.innerHTML = `<div class="p-section"><p class="p-text">${fallback}</p><a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a></div>`;
    }
}

function closePanel() {
    document.getElementById('detail-panel').classList.remove('open');
    state.activeNodeId = null;
    clearHighlight();
}

/* ── Fly to node ────────────────────────────────────────────── */
function flyToNode(node) {
    const vw       = window.innerWidth;
    const vh       = window.innerHeight - HEADER_H;
    const isMobile = vw <= 768;
    const offsetX  = (node.panel && !isMobile) ? 210 : 0;
    const offsetY  = (node.panel && isMobile)  ? -(vh * 0.325) : 0;

    const targetX = vw / 2 - offsetX - node.x * state.scale;
    const targetY = vh / 2 + offsetY - node.y * state.scale;
    const startX  = state.pan.x, startY = state.pan.y;
    const duration = 600, start = performance.now();

    if (state.flyAnim) { cancelAnimationFrame(state.flyAnim); state.flyAnim = null; }

    function step(now) {
        const t    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        state.pan.x = startX + (targetX - startX) * ease;
        state.pan.y = startY + (targetY - startY) * ease;
        applyTransform();
        if (t < 1) state.flyAnim = requestAnimationFrame(step);
        else state.flyAnim = null;
    }
    state.flyAnim = requestAnimationFrame(step);
}

/* ── Zoom helper ────────────────────────────────────────────── */
function zoomBy(delta, cx, cy) {
    const vw = window.innerWidth, vh = window.innerHeight - HEADER_H;
    if (cx === undefined) cx = vw / 2;
    if (cy === undefined) cy = vh / 2;
    const newScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, state.scale + delta));
    const worldX   = (cx - state.pan.x) / state.scale;
    const worldY   = (cy - state.pan.y) / state.scale;
    state.scale    = newScale;
    state.pan.x    = cx - worldX * state.scale;
    state.pan.y    = cy - worldY * state.scale;
    applyTransform();
}

/* ── Interactions ───────────────────────────────────────────── */
function setupInteractions() {
    const container = document.getElementById('graph-container');

    /* Mouse pan */
    container.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        state.dragging  = true;
        state.didDrag   = false;
        state.dragStart = { x: e.clientX, y: e.clientY };
        state.panStart  = { x: state.pan.x, y: state.pan.y };
        container.classList.add('dragging');
    });

    window.addEventListener('mousemove', e => {
        if (state.dragging) {
            const dx = e.clientX - state.dragStart.x;
            const dy = e.clientY - state.dragStart.y;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.didDrag = true;
            state.pan.x = state.panStart.x + dx;
            state.pan.y = state.panStart.y + dy;
            applyTransform();
        } else {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            const tw = document.getElementById('tilt-wrapper');
            if (tw) tw.style.transform = `rotateX(${-ny * 2.5}deg) rotateY(${nx * 2.5}deg)`;
        }
    });

    window.addEventListener('mouseup', () => {
        state.dragging = false;
        container.classList.remove('dragging');
    });

    /* Wheel zoom */
    container.addEventListener('wheel', e => {
        e.preventDefault();
        zoomBy(e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP, e.clientX, e.clientY - HEADER_H);
    }, { passive: false });

    /* Click background → deselect */
    container.addEventListener('click', e => {
        if (state.didDrag) return;
        if (!e.target.closest('.graph-node')) closePanel();
    });

    /* Zoom buttons */
    document.getElementById('zoom-in').addEventListener('click',    () => zoomBy(SCALE_STEP));
    document.getElementById('zoom-out').addEventListener('click',   () => zoomBy(-SCALE_STEP));
    document.getElementById('zoom-reset').addEventListener('click', () => {
        state.scale = 0.85;
        centerGraph();
    });

    /* Keyboard */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
    });

    /* Touch — pan + pinch */
    let lastTouch = null, lastPinchDist = null;

    container.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            state.didDrag  = false;
            lastTouch      = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            lastPinchDist = Math.hypot(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
            );
        }
    }, { passive: true });

    container.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length === 1 && lastTouch) {
            const dx = e.touches[0].clientX - lastTouch.x;
            const dy = e.touches[0].clientY - lastTouch.y;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.didDrag = true;
            state.pan.x += dx;
            state.pan.y += dy;
            lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            applyTransform();
        } else if (e.touches.length === 2 && lastPinchDist) {
            const dist = Math.hypot(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
            );
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - HEADER_H;
            zoomBy((dist / lastPinchDist - 1) * state.scale, cx, cy);
            lastPinchDist = dist;
        }
    }, { passive: false });

    container.addEventListener('touchend', e => {
        if (e.touches.length === 0) { lastTouch = null; lastPinchDist = null; }
    }, { passive: true });

}

/* ── Language ───────────────────────────────────────────────── */
const LANG_UI = {
    en: { 'header-role': 'AI Systems Engineer',   'header-hint': 'click nodes to explore', 'visitor-label': 'visitors' },
    fr: { 'header-role': 'Ingénieur Systèmes IA', 'header-hint': 'cliquez les nœuds',      'visitor-label': 'visiteurs' },
};

function updateLangUI() {
    const L = state.lang;
    for (const [id, text] of Object.entries(LANG_UI[L])) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
    const langBtn = document.querySelector('.lang-text');
    if (langBtn) langBtn.textContent = L.toUpperCase();
    NODES.forEach(node => {
        const el = document.getElementById(`node-${node.id}`);
        if (el) el.innerHTML = nodeInnerHTML(node);
    });
}

function setLang(lang) {
    state.lang = lang;
    localStorage.setItem('lang', lang);
    updateLangUI();
    if (state.activeNodeId) {
        const node = getNodeById(state.activeNodeId);
        if (node && node.panel) openPanel(node);
    }
}

/* ── Boot sequence ──────────────────────────────────────────── */
const BOOT_LINES = [
    { text: 'PORTFOLIO  v2.0',          cls: 'boot-title' },
    { text: '─'.repeat(34),             cls: 'boot-sep'   },
    { text: '> loading kernel',         ok: '          [OK]' },
    { text: '> mounting graph',         ok: '         [OK]' },
    { text: '> connecting pathways',    ok: '    [OK]' },
    { text: '> starting matrix rain',   ok: '   [OK]' },
    { text: '─'.repeat(34),             cls: 'boot-sep'   },
];

function runBootSequence(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = 'boot-overlay';
    const term = document.createElement('div');
    term.id = 'boot-term';
    overlay.appendChild(term);
    document.body.appendChild(overlay);

    let t = 180;

    function addLine(html, cls, delay) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'boot-line' + (cls ? ' ' + cls : '');
            el.innerHTML = html;
            term.appendChild(el);
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
        }, delay);
    }

    BOOT_LINES.forEach(line => {
        if (line.ok) {
            const okId = 'boot-ok-' + t;
            addLine(`<span>${line.text}</span><span class="boot-ok" id="${okId}">${line.ok}</span>`, '', t);
            setTimeout(() => {
                const el = document.getElementById(okId);
                if (el) el.classList.add('visible');
            }, t + 130);
        } else {
            addLine(`<span>${line.text}</span>`, line.cls || '', t);
        }
        t += 185;
    });

    // Progress bar
    setTimeout(() => {
        const wrap = document.createElement('div');
        wrap.className = 'boot-line boot-progress-wrap';
        wrap.innerHTML = '<span>[<span class="boot-bar"></span>] <span class="boot-pct">0%</span></span>';
        term.appendChild(wrap);
        requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('visible')));

        const barEl = wrap.querySelector('.boot-bar');
        const pctEl = wrap.querySelector('.boot-pct');
        const total = 24;
        let n = 0;
        const iv = setInterval(() => {
            n++;
            barEl.textContent = '█'.repeat(n) + '░'.repeat(total - n);
            pctEl.textContent = Math.round((n / total) * 100) + '%';
            if (n >= total) clearInterval(iv);
        }, 480 / total);
    }, t);
    t += 580;

    // Ready line
    addLine('<span class="boot-ready">&gt; portfolio ready.</span>', '', t);
    t += 220;

    // Prompt
    addLine('<span class="boot-prompt">matteo@portfolio:~$&nbsp;<span class="boot-cursor-blink">_</span></span>', '', t);
    t += 650;

    // Fade out
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => { overlay.remove(); onComplete(); }, 560);
    }, t);
}

/* ── Visitor counter ────────────────────────────────────────── */
function initVisitorCounter() {
    fetch('https://api.countapi.xyz/hit/matteo-pourcine-portfolio/visits')
        .then(r => r.json())
        .then(d => {
            const el = document.getElementById('visitor-count');
            if (el && d.value) el.textContent = d.value.toLocaleString();
        })
        .catch(() => {});
}

/* ── Fake terminal ──────────────────────────────────────────── */
function initFakeTerm() {
    const bar     = document.getElementById('term-bar');
    const display = document.getElementById('term-display');
    const input   = document.getElementById('term-input');
    const outBox  = document.getElementById('term-output-box');
    let hideTimer = null;

    function showOutput(lines, isError) {
        clearTimeout(hideTimer);
        outBox.innerHTML = lines.map(l => `<div class="term-out-line">${l}</div>`).join('');
        outBox.className = 'visible' + (isError ? ' error' : '');
        hideTimer = setTimeout(() => { outBox.className = ''; }, 5000);
    }

    function hideOutput() {
        clearTimeout(hideTimer);
        outBox.className = '';
    }

    function execCommand(raw) {
        const parts = raw.trim().split(/\s+/);
        const cmd   = parts[0].toLowerCase();
        const args  = parts.slice(1).join(' ').toLowerCase();

        if (cmd === 'help' || cmd === '?') {
            showOutput([
                '&gt; commands:',
                '&nbsp;&nbsp;whoami        — fly to identity',
                '&nbsp;&nbsp;ls            — list all nodes',
                '&nbsp;&nbsp;ls projects   — jump to projects hub',
                '&nbsp;&nbsp;ls exp        — jump to experience hub',
                '&nbsp;&nbsp;ls skills     — jump to skills hub',
                '&nbsp;&nbsp;cd &lt;name&gt;      — navigate to node',
                '&nbsp;&nbsp;pwd           — current location',
                '&nbsp;&nbsp;clear         — reset view',
                '&nbsp;&nbsp;./contact     — open contact panel',
            ]);
        } else if (cmd === 'whoami' || cmd === './whoami') {
            selectNode('identity');
            showOutput(['&gt; Mattéo Pourcine · AI Systems Engineer · France']);
        } else if (cmd === 'ls') {
            if (args === 'projects') {
                selectNode('hub-proj');
                showOutput(['&gt; projects/', '&nbsp;&nbsp;mi7&nbsp;&nbsp;chatbot&nbsp;&nbsp;hackathon&nbsp;&nbsp;github']);
            } else if (args === 'exp' || args === 'experience') {
                selectNode('hub-exp');
                showOutput(['&gt; experience/', '&nbsp;&nbsp;anotherbrain&nbsp;&nbsp;utbm&nbsp;&nbsp;uqac&nbsp;&nbsp;agh']);
            } else if (args === 'skills') {
                selectNode('hub-skills');
                showOutput(['&gt; skills/', '&nbsp;&nbsp;python&nbsp;&nbsp;pytorch&nbsp;&nbsp;cupy&nbsp;&nbsp;opencv&nbsp;&nbsp;c++']);
            } else {
                showOutput([
                    '&gt; nodes:',
                    '&nbsp;&nbsp;identity',
                    '&nbsp;&nbsp;hub-exp &nbsp;&nbsp;anotherbrain &nbsp;&nbsp;utbm &nbsp;&nbsp;uqac &nbsp;&nbsp;agh',
                    '&nbsp;&nbsp;hub-proj &nbsp;&nbsp;mi7 &nbsp;&nbsp;chatbot &nbsp;&nbsp;hackathon &nbsp;&nbsp;github',
                    '&nbsp;&nbsp;hub-skills &nbsp;&nbsp;hub-interests &nbsp;&nbsp;documentary &nbsp;&nbsp;travel',
                ]);
            }
        } else if (cmd === 'cd') {
            if (!args) { showOutput(['&gt; cd: missing argument'], true); return; }
            const target = NODES.find(n =>
                n.id === args ||
                n.id.startsWith(args) ||
                n.en.toLowerCase().startsWith(args) ||
                n.fr.toLowerCase().startsWith(args)
            );
            if (target) {
                selectNode(target.id);
                showOutput([`&gt; → ${target.id}`]);
            } else {
                showOutput([`&gt; cd: ${args}: no such node`], true);
            }
        } else if (cmd === 'pwd') {
            const cur = state.activeNodeId ? getNodeById(state.activeNodeId) : null;
            showOutput(['&gt; ' + (cur ? (cur.panel?.path || '~/' + cur.id) : '~/portfolio')]);
        } else if (cmd === 'clear') {
            closePanel();
            state.scale = 0.85;
            centerGraph();
            hideOutput();
        } else if (cmd === './contact') {
            selectNode('identity');
            showOutput(['&gt; opening contact...']);
        } else if (cmd === 'exit' || cmd === 'quit' || cmd === 'sudo') {
            showOutput(['&gt; nice try']);
        } else if (cmd) {
            showOutput([`&gt; ${cmd}: command not found — try 'help'`], true);
        }
    }

    input.addEventListener('input', () => { display.textContent = input.value; });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val) execCommand(val);
            input.value = '';
            display.textContent = '';
        }
        if (e.key === 'Escape') {
            input.blur();
            bar.classList.remove('focused');
            hideOutput();
        }
    });

    input.addEventListener('focus', () => bar.classList.add('focused'));
    input.addEventListener('blur',  () => bar.classList.remove('focused'));
    bar.addEventListener('click', () => input.focus());

    document.addEventListener('keydown', e => {
        if (document.activeElement === input) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (document.getElementById('video-modal').classList.contains('active')) return;
        if (e.key.length === 1 && !e.repeat) input.focus();
    });
}

/* ── Video modal ────────────────────────────────────────────── */
function openVideoModal(url) {
    document.getElementById('video-iframe').src = url;
    document.getElementById('video-modal').classList.add('active');
}

function closeVideoModal() {
    document.getElementById('video-modal').classList.remove('active');
    document.getElementById('video-iframe').src = '';
}

/* ── Init ───────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    // Wire static controls before boot finishes
    document.getElementById('lang-toggle').addEventListener('click', () =>
        setLang(state.lang === 'en' ? 'fr' : 'en'));
    document.getElementById('modal-close').addEventListener('click', closeVideoModal);
    document.getElementById('video-modal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeVideoModal();
    });
    document.getElementById('panel-close').addEventListener('click', closePanel);

    initFakeTerm();

    runBootSequence(() => {
        renderNodes();
        renderEdges();
        new EdgePackets();
        centerGraph();
        setupInteractions();
        updateLangUI();
        initVisitorCounter();
    });

    console.log('%c Mattéo Pourcine / AI Systems Engineer ', 'background:#0d0f0e;color:#00ff88;font-family:monospace;padding:4px 8px;border:1px solid #00ff88');
    console.log('%c pourcinematteo@gmail.com ', 'color:#00d4ff;font-family:monospace');
});
