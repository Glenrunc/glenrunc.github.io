'use strict';

/* =============================================================
   GLOBE PORTFOLIO — Three.js Edition
   ============================================================= */

const HEADER_H = 44;

/* ── State ─────────────────────────────────────────────────── */
const state = {
    activeNodeId: null,
    expandedHubs: new Set(),
    flyAnim: null,
    lang: localStorage.getItem('lang') || 'en',
    _camera: null,
    _controls: null,
    _arcLines: {},
};

/* ── Node data ─────────────────────────────────────────────── */
const NODES = [
    // Sun — decorative anchor with Mattéo's name. Non-clickable.
    {
        id: 'sun', type: 'sun',
        en: 'Mattéo Pourcine', fr: 'Mattéo Pourcine',
        sub_en: 'AI Systems Engineer', sub_fr: 'Ingénieur Systèmes IA',
    },
    {
        id: 'identity', type: 'identity',
        en: 'Earth', fr: 'Terre',
        sub_en: 'identity · whoami', sub_fr: 'identité · whoami',
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
  <p class="p-bio">Engineering student at UTBM specializing in AI systems — computer vision and deep learning. I build systems that see, understand, and act.</p>
  <p class="p-bio">International background: exchanges at UQAC (Canada) and AGH (Poland). R&D Intern at AnotherBrain, a bio-inspired AI startup.</p>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">C++</span>
    <span class="p-badge">CuPy / CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Linux</span>
  </div>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com">pourcinematteo@gmail.com</a>
  <div class="p-socials">
    <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
    <a class="p-link" href="https://www.linkedin.com/in/mattéo-p-129b35220/" target="_blank">→ linkedin.com/in/mattéo-p</a>
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
  <p class="p-bio">Étudiant ingénieur à l'UTBM spécialisé en systèmes IA — vision par ordinateur et deep learning. Je construis des systèmes qui voient, comprennent et agissent.</p>
  <p class="p-bio">Parcours international : échanges à l'UQAC (Canada) et l'AGH (Pologne). Stagiaire R&D chez AnotherBrain, startup d'IA bio-inspirée.</p>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">C++</span>
    <span class="p-badge">CuPy / CUDA</span>
    <span class="p-badge">OpenCV</span>
    <span class="p-badge">Linux</span>
  </div>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com">pourcinematteo@gmail.com</a>
  <div class="p-socials">
    <a class="p-github-link" href="https://github.com/Glenrunc" target="_blank">[ github.com/Glenrunc ]</a>
    <a class="p-link" href="https://www.linkedin.com/in/mattéo-p-129b35220/" target="_blank">→ linkedin.com/in/mattéo-p</a>
  </div>
</div>`
        }
    },

    /* ── Cluster hubs ──────────────────────────────────────── */
    {
        id: 'hub-exp', type: 'cluster',
        en: 'Experience', fr: 'Expérience',
        sub_en: '4 entries', sub_fr: '4 entrées',
        panel: {
            path: '~/experience',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/experience</div>
  <div class="p-label">Academic &amp; Professional</div>
  <ul class="p-list">
    <li>AnotherBrain — AI Startup, R&D Intern · Paris, France</li>
    <li>UTBM — Engineering degree (ongoing) · Belfort, France</li>
    <li>UQAC — Exchange · Saguenay, Canada</li>
    <li>AGH — Exchange · Kraków, Poland</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/expérience</div>
  <div class="p-label">Académique &amp; Professionnel</div>
  <ul class="p-list">
    <li>AnotherBrain — Startup IA, Stagiaire R&D · Paris, France</li>
    <li>UTBM — Diplôme ingénieur (en cours) · Belfort, France</li>
    <li>UQAC — Échange · Saguenay, Canada</li>
    <li>AGH — Échange · Cracovie, Pologne</li>
  </ul>
</div>`
        }
    },
    {
        id: 'hub-proj', type: 'cluster',
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
  </div>
  <div class="p-label">Tools</div>
  <div class="p-tech">
    <span class="p-badge">Git</span>
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
  </div>
  <div class="p-label">Outils</div>
  <div class="p-tech">
    <span class="p-badge">Git</span>
    <span class="p-badge">Linux</span><span class="p-badge">CMake</span>
  </div>
</div>`
        }
    },
    {
        id: 'hub-interests', type: 'cluster',
        en: 'Interests', fr: "Centres d'intérêt",
        sub_en: 'beyond code', sub_fr: 'au-delà du code',
        panel: {
            path: '~/interests',
            en: `
<div class="p-section">
  <div class="p-prompt">ls ~/interests</div>
  <div class="p-label">Creative &amp; Personal</div>
  <ul class="p-list">
    <li>Documentary filmmaking — science vulgarisation</li>
    <li>Travel &amp; filming — crystallizing journeys on film</li>
    <li>Philosophy of mind &amp; AI ethics</li>
  </ul>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">ls ~/centres-d-intérêt</div>
  <div class="p-label">Créatif &amp; Personnel</div>
  <ul class="p-list">
    <li>Réalisation de documentaires — vulgarisation scientifique</li>
    <li>Voyages &amp; filmmaking — cristalliser les voyages en vidéo</li>
    <li>Philosophie de l'esprit &amp; éthique IA</li>
  </ul>
</div>`
        }
    },

    /* ── Experience nodes — real geographic coordinates ──── */
    {
        id: 'anotherbrain', type: 'experience',
        en: 'AnotherBrain', fr: 'AnotherBrain',
        sub_en: 'R&D Intern · AI Startup', sub_fr: 'Stagiaire R&D · Startup IA',
        panel: {
            path: '~/exp/anotherbrain',
            en: `
<div class="p-section">
  <div class="p-prompt">cat anotherbrain.md</div>
  <div class="p-name">AnotherBrain</div>
  <div class="p-meta">R&D Intern</div>
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
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat anotherbrain.md</div>
  <div class="p-name">AnotherBrain</div>
  <div class="p-meta">Stagiaire R&D</div>
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
  </div>
</div>`
        }
    },
    {
        id: 'utbm', type: 'experience',
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
  <p class="p-text">Engineering degree in Virtual Worlds and Computer Vision.</p>
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
  <p class="p-text">Diplôme d'ingénieur en Mondes Virtuels et Vision par Ordinateur.</p>
</div>`
        }
    },
    {
        id: 'uqac', type: 'experience',
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
  <p class="p-text">Erasmus+ exchange at one of Poland's top technical universities. Focused on biometrics and deep learning applied to medical imaging.</p>
</div>
<div class="p-section">
  <div class="p-label">Courses</div>
  <ul class="p-list">
    <li>Biometrics</li>
    <li>Deep Learning for Medical Imaging</li>
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
  <p class="p-text">Échange Erasmus+ dans l'une des meilleures universités techniques polonaises. Accent sur la biométrie et le deep learning appliqué à l'imagerie médicale.</p>
</div>
<div class="p-section">
  <div class="p-label">Cours</div>
  <ul class="p-list">
    <li>Biométrie</li>
    <li>Deep Learning pour l'Imagerie Médicale</li>
    <li>Algorithmes Avancés</li>
  </ul>
</div>`
        }
    },

    /* ── Project nodes ─────────────────────────────────────── */
    {
        id: 'mi7', type: 'project',
        en: 'MI7', fr: 'MI7',
        sub_en: 'CV toolkit · Mission Impossible inspired', sub_fr: 'Toolkit CV · inspiré Mission Impossible',
        panel: {
            path: '~/projects/mi7',
            en: `
<div class="p-section">
  <div class="p-prompt">cat mi7/README.md</div>
  <div class="p-name">MI7</div>
  <div class="p-meta">Computer Vision Toolkit · Mission Impossible inspired</div>
  <span class="p-badge-green">[WIP]</span>
</div>
<div class="p-section">
  <div class="p-label">Overview</div>
  <p class="p-text">All-in-one software bundling several computer vision capabilities into a single interface. Inspired by the spy-tech aesthetic of the Mission Impossible films.</p>
</div>
<div class="p-section">
  <div class="p-label">Features</div>
  <ul class="p-list">
    <li>Image &amp; video segmentation</li>
    <li>Inpainting</li>
    <li>Deepfake generation</li>
    <li>Facial recognition</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">OpenCV</span>
  </div>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat mi7/README.md</div>
  <div class="p-name">MI7</div>
  <div class="p-meta">Toolkit de Vision par Ordinateur · inspiré Mission Impossible</div>
  <span class="p-badge-green">[EN COURS]</span>
</div>
<div class="p-section">
  <div class="p-label">Présentation</div>
  <p class="p-text">Logiciel tout-en-un regroupant plusieurs capacités de vision par ordinateur dans une seule interface. Inspiré de l'esthétique spy-tech des films Mission Impossible.</p>
</div>
<div class="p-section">
  <div class="p-label">Fonctionnalités</div>
  <ul class="p-list">
    <li>Segmentation d'images &amp; vidéos</li>
    <li>Inpainting</li>
    <li>Génération de deepfakes</li>
    <li>Reconnaissance faciale</li>
  </ul>
</div>
<div class="p-section">
  <div class="p-label">Stack</div>
  <div class="p-tech">
    <span class="p-badge">Python</span>
    <span class="p-badge">PyTorch</span>
    <span class="p-badge">OpenCV</span>
  </div>
</div>`
        }
    },
    {
        id: 'chatbot', type: 'project',
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
        en: 'GitHub', fr: 'GitHub',
        sub_en: 'all repos →', sub_fr: 'tous les dépôts →',
        panel: { path: '~/github', en: '', fr: '' },
    },

    /* ── Skill nodes ───────────────────────────────────────── */
    { id: 'sk-python',  type: 'skill', en: 'Python',      fr: 'Python' },
    { id: 'sk-cupy',    type: 'skill', en: 'CuPy / CUDA', fr: 'CuPy / CUDA' },
    { id: 'sk-pytorch', type: 'skill', en: 'PyTorch',     fr: 'PyTorch' },
    { id: 'sk-cv',      type: 'skill', en: 'OpenCV',      fr: 'OpenCV' },
    { id: 'sk-cpp',     type: 'skill', en: 'C++',         fr: 'C++' },

    /* ── Interest nodes ────────────────────────────────────── */
    {
        id: 'documentary', type: 'interest',
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

    // Pluto — hidden secret. Only labelable when camera distance > 1800.
    {
        id: 'pluto', type: 'secret',
        en: 'Pluto', fr: 'Pluton',
        sub_en: '~/.secrets', sub_fr: '~/.secrets',
        panel: {
            path: '~/.secrets/pluto.md',
            en: `
<div class="p-section">
  <div class="p-prompt">cat ~/.secrets/pluto.md</div>
  <div class="p-name">Pluto</div>
  <div class="p-meta">You found the hidden one.</div>
</div>
<div class="p-section">
  <div class="p-label">Note</div>
  <p class="p-text">Most visitors never make it this far out. You did.</p>
  <p class="p-text">If you're reading this, drop me an email — mention "Pluto" in the subject and I'll know you're the kind of person who actually explores.</p>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com?subject=Pluto">pourcinematteo@gmail.com</a>
</div>`,
            fr: `
<div class="p-section">
  <div class="p-prompt">cat ~/.secrets/pluto.md</div>
  <div class="p-name">Pluton</div>
  <div class="p-meta">Tu as trouvé la cachée.</div>
</div>
<div class="p-section">
  <div class="p-label">Note</div>
  <p class="p-text">Très peu de visiteurs vont aussi loin. Toi si.</p>
  <p class="p-text">Si tu lis ça, écris-moi — mets "Pluton" en objet, je saurai que tu es du genre à vraiment explorer.</p>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com?subject=Pluton">pourcinematteo@gmail.com</a>
</div>`,
        },
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

/* ── Hub / leaf maps ───────────────────────────────────────── */
const HUB_CHILDREN = {
    'hub-exp':       ['anotherbrain', 'utbm', 'uqac', 'agh'],
    'hub-proj':      ['mi7', 'chatbot', 'hackathon', 'github'],
    'hub-skills':    ['sk-python', 'sk-cpp', 'sk-cupy', 'sk-pytorch', 'sk-cv'],
    'hub-interests': ['documentary', 'travel'],
};
const ALL_LEAVES = new Set(Object.values(HUB_CHILDREN).flat());

function getParentHub(id) {
    return Object.keys(HUB_CHILDREN).find(h => HUB_CHILDREN[h].includes(id)) || null;
}
function isNodeVisible(id) {
    if (!ALL_LEAVES.has(id)) return true;
    const ph = getParentHub(id);
    return ph ? state.expandedHubs.has(ph) : true;
}
function updateHubExpanded() {
    Object.keys(HUB_CHILDREN).forEach(hubId => {
        const el = document.getElementById(`node-${hubId}`);
        if (el) el.classList.toggle('hub-expanded', state.expandedHubs.has(hubId));
    });
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

/* ── Three.js spatial helpers ──────────────────────────────── */

// lat/lon → 3D on sphere: lon=0,lat=0 → (0,0,r) faces initial camera
function latLonToXYZ(lat, lon, r) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = lon * (Math.PI / 180);
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.cos(theta)
    );
}

// Ring point tilted toward camera (tiltDeg rotates ring toward viewer)
function ringPoint(angleDeg, radius, tiltDeg) {
    const a    = angleDeg * (Math.PI / 180);
    const tilt = tiltDeg  * (Math.PI / 180);
    const x     = radius * Math.cos(a);
    const yFlat = radius * Math.sin(a);
    return new THREE.Vector3(
        x * 0.9,
        yFlat * Math.cos(tilt) + 80,
        yFlat * Math.sin(tilt) + 55
    );
}

// Smooth great-circle arc between two 3D positions at radius r
function greatCirclePoints(v1, v2, r, n) {
    n = n || 44;
    const pts = [];
    for (let i = 0; i <= n; i++) {
        pts.push(v1.clone().lerp(v2, i / n).normalize().multiplyScalar(r));
    }
    return pts;
}

/* ── Solar system orbital configuration ──────────────────────
   Bodies orbit on the XZ plane (with small Y tilts for depth).
   Position is computed each frame from `(time/period) + angle0`.
   Sun lives at origin; planets orbit Sun; moons orbit their hub.
*/
const BODIES = {
    'sun':           { kind: 'sun',    radius: 36, color: 0xffd87a },

    // Hubs / planets — orbit the Sun
    'identity':      { kind: 'earth',  radius: 22,
                       orbit: { around: 'sun', radius: 320, angle0: 0.35, period: 110, tilt: 0.02 } },
    'hub-exp':       { kind: 'planet', radius: 24, color: 0xe6d28a,
                       ring: { inner: 30, outer: 42, color: 0xb8a060, tiltDeg: 18 },
                       orbit: { around: 'sun', radius: 470, angle0: 2.1, period: 150, tilt: -0.05 } },
    'hub-proj':      { kind: 'planet', radius: 20, color: 0xc1502e,
                       orbit: { around: 'sun', radius: 620, angle0: 4.2, period: 190, tilt: 0.08 } },
    'hub-skills':    { kind: 'planet', radius: 34, color: 0xd8a86b,
                       orbit: { around: 'sun', radius: 800, angle0: 5.8, period: 240, tilt: -0.03 } },
    'hub-interests': { kind: 'planet', radius: 18, color: 0x3b6fb5,
                       orbit: { around: 'sun', radius: 980, angle0: 1.0, period: 310, tilt: 0.06 } },

    // Moons — orbit their parent hub
    'anotherbrain':  { kind: 'moon', radius: 4.5, color: 0xa0c8ff, orbit: { around: 'hub-exp', radius: 36, angle0: 0.0, period: 11, tilt: 0.0 } },
    'utbm':          { kind: 'moon', radius: 4.0, color: 0xc8e0ff, orbit: { around: 'hub-exp', radius: 48, angle0: 1.7, period: 17, tilt: 0.15 } },
    'uqac':          { kind: 'moon', radius: 3.8, color: 0x88b8e8, orbit: { around: 'hub-exp', radius: 60, angle0: 3.2, period: 22, tilt: -0.1 } },
    'agh':           { kind: 'moon', radius: 3.8, color: 0xb0d0ff, orbit: { around: 'hub-exp', radius: 72, angle0: 5.0, period: 28, tilt: 0.2 } },

    'mi7':           { kind: 'moon', radius: 4.4, color: 0xff9e6a, orbit: { around: 'hub-proj', radius: 32, angle0: 0.4, period: 9,  tilt: 0.0 } },
    'chatbot':       { kind: 'moon', radius: 3.8, color: 0xffb088, orbit: { around: 'hub-proj', radius: 44, angle0: 2.1, period: 14, tilt: 0.15 } },
    'hackathon':     { kind: 'moon', radius: 3.6, color: 0xffc09a, orbit: { around: 'hub-proj', radius: 56, angle0: 3.9, period: 19, tilt: -0.12 } },
    'github':        { kind: 'moon', radius: 3.6, color: 0xe8e8e8, orbit: { around: 'hub-proj', radius: 68, angle0: 5.6, period: 24, tilt: 0.18 } },

    'sk-python':     { kind: 'moon', radius: 4.0, color: 0xffe170, orbit: { around: 'hub-skills', radius: 50, angle0: 0.0, period: 13, tilt: 0.0 } },
    'sk-cpp':        { kind: 'moon', radius: 3.8, color: 0xb0ccff, orbit: { around: 'hub-skills', radius: 64, angle0: 1.3, period: 18, tilt: 0.1 } },
    'sk-cupy':       { kind: 'moon', radius: 3.6, color: 0x88f0c8, orbit: { around: 'hub-skills', radius: 78, angle0: 2.6, period: 23, tilt: -0.1 } },
    'sk-pytorch':    { kind: 'moon', radius: 4.0, color: 0xff8a6a, orbit: { around: 'hub-skills', radius: 92, angle0: 3.9, period: 28, tilt: 0.15 } },
    'sk-cv':         { kind: 'moon', radius: 3.6, color: 0x9ad8ff, orbit: { around: 'hub-skills', radius: 106, angle0: 5.2, period: 34, tilt: -0.18 } },

    'documentary':   { kind: 'moon', radius: 4.0, color: 0xc792ea, orbit: { around: 'hub-interests', radius: 30, angle0: 0.0, period: 12, tilt: 0.0 } },
    'travel':        { kind: 'moon', radius: 4.0, color: 0xa088e0, orbit: { around: 'hub-interests', radius: 44, angle0: 3.14, period: 18, tilt: 0.15 } },

    // Pluto — hidden far body. Tiny, gray, label hidden until camera distance > 1800.
    'pluto':         { kind: 'moon', radius: 2.4, color: 0x9d9088, orbit: { around: 'sun', radius: 1500, angle0: 1.7, period: 540, tilt: 0.18 } },
};

// Camera fly distance per body kind (added to body radius for framing)
const FLY_DISTANCE = { sun: 280, earth: 95, planet: 110, moon: 22 };

// Slow-but-visible time scale (period values above are seconds for a full orbit at scale=1)
// Mutable: Konami easter egg temporarily multiplies this.
let ORBIT_SPEED = 0.18;
const ORBIT_SPEED_BASE = 0.18;

// Compute the world position of `nodeId` at simulation time `tSec`.
// Recurses through parent orbits (moon → hub → sun) so moons follow their hub.
function computeOrbitPosition(nodeId, tSec) {
    const b = BODIES[nodeId];
    if (!b || b.kind === 'sun') return new THREE.Vector3(0, 0, 0);
    const o = b.orbit;
    if (!o) return new THREE.Vector3(0, 0, 0);
    const parent = computeOrbitPosition(o.around, tSec);
    const a = o.angle0 + tSec * ORBIT_SPEED * (2 * Math.PI / o.period);
    const x = parent.x + o.radius * Math.cos(a);
    const z = parent.z + o.radius * Math.sin(a);
    const y = parent.y + Math.sin(a * 0.7) * o.radius * (o.tilt || 0);
    return new THREE.Vector3(x, y, z);
}

// Refresh every node._pos using current sim time
function updateAllOrbits(tSec) {
    NODES.forEach(n => {
        if (BODIES[n.id]) n._pos = computeOrbitPosition(n.id, tSec);
    });
}

/* ── Continent outlines via TopoJSON, attached to a parent at given radius */
async function loadContinents(parent, radius) {
    const r = (radius != null ? radius : 22) * 1.01;
    try {
        const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(res => res.json());
        const mesh = topojson.mesh(topo, topo.objects.land);
        const positions = [];
        mesh.coordinates.forEach(ring => {
            for (let i = 0; i < ring.length - 1; i++) {
                positions.push(...latLonToXYZ(ring[i][1],   ring[i][0],   r).toArray());
                positions.push(...latLonToXYZ(ring[i+1][1], ring[i+1][0], r).toArray());
            }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        parent.add(new THREE.LineSegments(geo,
            new THREE.LineBasicMaterial({ color: 0x4cf0a0, transparent: true, opacity: 0.35 })
        ));
    } catch (e) {
        console.warn('continent load failed:', e);
    }
}

/* ── Node HTML ─────────────────────────────────────────────── */
function nodeInnerHTML(node) {
    const L     = state.lang;
    const label = L === 'fr' ? node.fr : node.en;
    const sub   = L === 'fr' ? (node.sub_fr || node.sub_en || '') : (node.sub_en || '');
    const subHtml = sub ? `<span class="node-dot-sub">${sub}</span>` : '';
    return `<div class="node-dot"></div><div class="node-dot-label"><span class="node-dot-name">${label}</span>${subHtml}</div>`;
}

/* ── Render nodes into #node-overlay ──────────────────────── */
function renderNodes() {
    const overlay = document.getElementById('node-overlay');
    overlay.querySelectorAll('.graph-node').forEach(el => el.remove());

    NODES.forEach((node, i) => {
        const el = document.createElement('div');
        el.className = `graph-node node-${node.type}`;
        el.id = `node-${node.id}`;
        el.style.animationDelay = `${i * 0.045}s`;
        el.innerHTML = nodeInnerHTML(node);
        overlay.appendChild(el);
    });
}

/* ── Globe / Three.js scene ─────────────────────────────────── */
function initGlobe(onReady) {
    const canvas = document.getElementById('globe-canvas');
    const cont   = canvas.parentElement;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    state._scene = scene;
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 12000);
    state._camera = camera;

    // Compute Earth's initial position so we can spawn the camera nearby.
    updateAllOrbits(0);
    const earthInitPos = getNodeById('identity')._pos.clone();
    // Camera starts looking AT Earth, FROM the Earth-Sun line extended away from Sun.
    const camOffsetDir = earthInitPos.clone().normalize();
    camera.position.copy(earthInitPos).add(camOffsetDir.clone().multiplyScalar(240)).add(new THREE.Vector3(0, 60, 0));

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enablePan       = false;
    controls.minDistance     = 30;
    controls.maxDistance     = 3500;
    controls.autoRotate      = false; // re-enabled after intro
    controls.autoRotateSpeed = 0.12;
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.07;
    controls.target.copy(earthInitPos);
    state._controls = controls;

    // ── Lighting (Sun = real point light + global ambient) ──
    const sunLight = new THREE.PointLight(0xffe4a8, 2.8, 0, 1.6);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x223344, 0.45));

    // ── Sun mesh + glow sprite ──
    const sunGeo = new THREE.SphereGeometry(BODIES['sun'].radius, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({ color: BODIES['sun'].color });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);
    state._sunMesh = sunMesh;
    state._sunMatColorBase = new THREE.Color(BODIES['sun'].color);

    // Sun corona — additive sprite shader on a larger sphere
    const sunGlow = new THREE.Mesh(
        new THREE.SphereGeometry(BODIES['sun'].radius * 2.6, 48, 48),
        new THREE.ShaderMaterial({
            uniforms: { glowColor: { value: new THREE.Color(0xffd87a) } },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    gl_FragColor = vec4(glowColor, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        })
    );
    scene.add(sunGlow);
    state._sunGlow = sunGlow;

    // ── Textures (Earth only) ──
    const texLoader  = new THREE.TextureLoader();
    texLoader.crossOrigin = 'anonymous';

    // ── Earth — kept as the only textured body, lit by the actual Sun's direction ──
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    state._earthGroup = earthGroup;

    const dayMap   = texLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const nightMap = texLoader.load('https://threejs.org/examples/textures/planets/earth_lights_2048.png');
    const earthMat = new THREE.ShaderMaterial({
        uniforms: {
            dayMap:    { value: dayMap },
            nightMap:  { value: nightMap },
            sunDir:    { value: new THREE.Vector3(1, 0, 0) },
            nightBoost:{ value: 1.4 },
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
                vUv = uv;
                vWorldNormal = normalize(mat3(modelMatrix) * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D dayMap;
            uniform sampler2D nightMap;
            uniform vec3  sunDir;
            uniform float nightBoost;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
                vec3 day   = texture2D(dayMap,   vUv).rgb;
                vec3 night = texture2D(nightMap, vUv).rgb * nightBoost;
                float cosTheta = dot(normalize(vWorldNormal), normalize(sunDir));
                float mixK = smoothstep(-0.12, 0.18, cosTheta);
                vec3 col = mix(night, day, mixK);
                col = mix(col, col * vec3(0.85, 1.08, 0.95), 0.18);
                gl_FragColor = vec4(col, 1.0);
            }
        `,
    });
    const earthR = BODIES['identity'].radius;
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(earthR, 64, 64), earthMat);
    earthMesh.rotation.y = -Math.PI / 2;
    earthGroup.add(earthMesh);
    state._earthMat = earthMat;

    // Earth clouds
    const cloudMap = texLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');
    const cloudMesh = new THREE.Mesh(
        new THREE.SphereGeometry(earthR * 1.035, 64, 64),
        new THREE.MeshBasicMaterial({
            map: cloudMap, transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.55, depthWrite: false,
        })
    );
    cloudMesh.rotation.y = -Math.PI / 2;
    earthGroup.add(cloudMesh);

    // Earth atmosphere
    const atmoMat = new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(0x00ff88) } },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
                gl_FragColor = vec4(glowColor, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
    });
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(earthR * 1.08, 48, 48), atmoMat));

    // ── Other planets (4 + their moons) — flat-colored, lit by sunLight ──
    const bodyMeshes = { earth: earthGroup, sun: sunMesh }; // id → mesh/group
    state._bodyMeshes = bodyMeshes;

    function createPlanetMesh(id) {
        const cfg = BODIES[id];
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
            color: cfg.color,
            roughness: 0.85, metalness: 0.05,
            emissive: cfg.color, emissiveIntensity: 0.06,
        });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(cfg.radius, 48, 48), mat);
        group.add(mesh);
        if (cfg.ring) {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(cfg.ring.inner, cfg.ring.outer, 96),
                new THREE.MeshBasicMaterial({
                    color: cfg.ring.color, side: THREE.DoubleSide,
                    transparent: true, opacity: 0.55, depthWrite: false,
                }),
            );
            ring.rotation.x = Math.PI / 2;
            ring.rotation.z = (cfg.ring.tiltDeg || 0) * Math.PI / 180;
            group.add(ring);
        }
        return group;
    }

    ['hub-exp', 'hub-proj', 'hub-skills', 'hub-interests'].forEach(id => {
        const m = createPlanetMesh(id);
        scene.add(m);
        bodyMeshes[id] = m;
    });

    // Moons — flat-colored small spheres
    function createMoonMesh(id) {
        const cfg = BODIES[id];
        const mat = new THREE.MeshStandardMaterial({
            color: cfg.color, roughness: 0.9, metalness: 0.02,
            emissive: cfg.color, emissiveIntensity: 0.12,
        });
        return new THREE.Mesh(new THREE.SphereGeometry(cfg.radius, 24, 24), mat);
    }
    Object.entries(BODIES).forEach(([id, cfg]) => {
        if (cfg.kind !== 'moon') return;
        const m = createMoonMesh(id);
        scene.add(m);
        bodyMeshes[id] = m;
    });

    // Parallax starfield — 3 depth layers with per-star twinkle
    function buildStarLayer(count, radius, sizeMul, baseAlpha) {
        const positions = new Float32Array(count * 3);
        const phases    = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const u = Math.random(), v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi   = Math.acos(2 * v - 1);
            const r     = radius + (Math.random() - 0.5) * radius * 0.15;
            positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            phases[i] = Math.random() * 6.2831853;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('phase',    new THREE.BufferAttribute(phases, 1));
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, sizeMul: { value: sizeMul }, baseAlpha: { value: baseAlpha } },
            vertexShader: `
                attribute float phase;
                uniform float time;
                uniform float sizeMul;
                varying float vBright;
                void main() {
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = sizeMul * (340.0 / -mv.z);
                    gl_Position = projectionMatrix * mv;
                    vBright = 0.45 + 0.55 * (0.5 + 0.5 * sin(time * 1.6 + phase));
                }
            `,
            fragmentShader: `
                uniform float baseAlpha;
                varying float vBright;
                void main() {
                    vec2 c = gl_PointCoord - 0.5;
                    float a = smoothstep(0.5, 0.0, length(c));
                    gl_FragColor = vec4(vec3(1.0), a * vBright * baseAlpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Points(geo, mat);
        return { mesh, mat };
    }
    const starLayers = [
        buildStarLayer(700,  800, 1.6, 0.95),
        buildStarLayer(500, 1300, 1.0, 0.80),
        buildStarLayer(350, 1900, 0.7, 0.65),
    ];
    starLayers.forEach(l => scene.add(l.mesh));

    // Shooting stars — occasional streak across the sky
    function spawnShootingStar() {
        if (state._reducedMotion) return;
        const theta = Math.random() * 2 * Math.PI;
        const phi   = Math.acos(2 * Math.random() - 1);
        const R     = 1500;
        const a = new THREE.Vector3(
            R * Math.sin(phi) * Math.cos(theta),
            R * Math.cos(phi),
            R * Math.sin(phi) * Math.sin(theta),
        );
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 320,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 320,
        );
        const b = a.clone().add(offset);
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        const mat = new THREE.LineBasicMaterial({ color: 0xb8e0ff, transparent: true, opacity: 0, depthWrite: false });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        const t0 = performance.now();
        function step(now) {
            const t = (now - t0) / 1100;
            if (t >= 1) { scene.remove(line); geo.dispose(); mat.dispose(); return; }
            mat.opacity = t < 0.3 ? (t / 0.3) * 0.85 : (1 - (t - 0.3) / 0.7) * 0.85;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const _shootTimer = setInterval(spawnShootingStar, 11000 + Math.random() * 4000);
    state._shootTimer = _shootTimer;

    // Continent outlines — attached to Earth group so they translate/rotate with it
    loadContinents(earthGroup, earthR);

    // Orbital path rings (thin, faint, in scene root). Drawn for each planet around the Sun.
    const orbitRingGroup = new THREE.Group();
    state._orbitRings = orbitRingGroup;
    scene.add(orbitRingGroup);
    ['identity', 'hub-exp', 'hub-proj', 'hub-skills', 'hub-interests'].forEach(id => {
        const o = BODIES[id].orbit;
        const r = o.radius;
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(r - 0.6, r + 0.6, 128),
            new THREE.MeshBasicMaterial({
                color: 0x2a4a36, side: THREE.DoubleSide,
                transparent: true, opacity: 0.18, depthWrite: false,
            }),
        );
        ring.rotation.x = Math.PI / 2;
        orbitRingGroup.add(ring);
    });

    state._arcLines = {}; // legacy guard for clearHighlight

    // Resize handler
    function resize() {
        const w = cont.clientWidth;
        const h = cont.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Project HTML nodes to screen coordinates each frame
    const overlay = document.getElementById('node-overlay');
    const tempV   = new THREE.Vector3();

    function projectNodes() {
        const w = cont.clientWidth;
        const h = cont.clientHeight;
        const camDist = camera.position.length();

        NODES.forEach(node => {
            const el = document.getElementById(`node-${node.id}`);
            if (!el || !node._pos) return;

            const hubVis = isNodeVisible(node.id);
            el.classList.toggle('node-hidden', !hubVis);

            tempV.copy(node._pos).project(camera);
            const sx = (tempV.x + 1) / 2 * w;
            const sy = (-tempV.y + 1) / 2 * h;
            el.style.left    = sx + 'px';
            el.style.top     = sy + 'px';
            // Hidden if behind camera; Pluto extra-gated by distance (must zoom out)
            const plutoGated = node.id === 'pluto' && camDist < 1800;
            el.style.display = (tempV.z > 1 || plutoGated) ? 'none' : '';
        });
    }

    // Main render loop — drives orbital motion + Earth's physics-based terminator
    function animate() {
        requestAnimationFrame(animate);
        if (rocketState.active) {
            tickRocket();
            // Skip OrbitControls.update — it would re-sync camera from its
            // internal spherical state and yank the chase cam back.
        } else {
            controls.update();
        }

        const tSec = performance.now() * 0.001;
        // Sim time freezes under reduce-motion (snapshot at boot)
        const simT = state._reducedMotion ? 0 : tSec;
        updateAllOrbits(simT);

        // Place each body at its computed orbit position
        Object.entries(BODIES).forEach(([id, cfg]) => {
            if (cfg.kind === 'sun') return;
            const node = getNodeById(id);
            const mesh = bodyMeshes[id === 'identity' ? 'earth' : id] || bodyMeshes[id];
            if (mesh && node && node._pos) mesh.position.copy(node._pos);
        });

        // Earth terminator follows real Sun→Earth geometry (sun at origin)
        const earthPos = getNodeById('identity')._pos;
        if (earthPos) {
            earthMat.uniforms.sunDir.value.copy(earthPos).negate().normalize();
        }

        cloudMesh.rotation.y += 0.00035;
        starLayers.forEach((l, i) => {
            l.mat.uniforms.time.value = tSec;
            l.mesh.rotation.y = tSec * (0.0005 + i * 0.00025);
        });

        renderer.render(scene, camera);
        projectNodes();
    }
    animate();

    // Cinematic intro: hold on Earth ~0.8s, then pull back to reveal solar system.
    // Camera target tweens from Earth → Sun (origin); camera position pulls to wide view.
    function cinematicIntro() {
        if (state._reducedMotion) {
            camera.position.set(0, 600, 1900);
            controls.target.set(0, 0, 0);
            controls.autoRotate = false;
            controls.update();
            return;
        }
        const startPos    = camera.position.clone();
        const startTarget = controls.target.clone();
        // Pull back along the Earth-side hemisphere so the system unfolds in front of us.
        const endPos    = new THREE.Vector3(0, 620, 2000);
        const endTarget = new THREE.Vector3(0, 0, 0);
        const holdMs    = 800;
        const sweepMs   = 2800;
        const t0        = performance.now();
        state._introActive = true;
        function step(now) {
            if (!state._introActive) {
                controls.autoRotate = true;
                return;
            }
            const elapsed = now - t0;
            if (elapsed < holdMs) {
                requestAnimationFrame(step);
                return;
            }
            const t    = Math.min((elapsed - holdMs) / sweepMs, 1);
            const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            camera.position.lerpVectors(startPos, endPos, ease);
            controls.target.lerpVectors(startTarget, endTarget, ease);
            controls.update();
            if (t < 1) requestAnimationFrame(step);
            else {
                state._introActive = false;
                controls.autoRotate = true;
            }
        }
        requestAnimationFrame(step);
    }
    cinematicIntro();

    onReady();
}

/* ── Highlight ─────────────────────────────────────────────── */
function highlightGraph(nodeId) {
    const neighbors = getNeighborIds(nodeId);
    const active    = new Set([nodeId, ...neighbors]);

    document.querySelectorAll('.graph-node').forEach(el => {
        const id = el.id.replace('node-', '');
        el.classList.toggle('node-dimmed',      !active.has(id));
        el.classList.toggle('node-highlighted',  active.has(id));
    });
}

function clearHighlight() {
    document.querySelectorAll('.graph-node').forEach(el =>
        el.classList.remove('node-dimmed', 'node-highlighted'));

    EDGES.forEach(edge => {
        const arc = state._arcLines[`${edge.from}-${edge.to}`];
        if (arc) { arc.mat.color.setHex(0x1e3a28); arc.mat.opacity = 0.5; }
    });
}

/* ── Selection ─────────────────────────────────────────────── */
function selectNode(id) {
    const isHub = id in HUB_CHILDREN;

    if (isHub) {
        if (state.expandedHubs.has(id) && state.activeNodeId === id) {
            // Second click on active expanded hub: collapse + close
            state.expandedHubs.delete(id);
            updateHubExpanded();
            closePanel();
            return;
        }
        state.expandedHubs.add(id);
        updateHubExpanded();
    }

    if (state.activeNodeId === id) { closePanel(); return; }
    state.activeNodeId = id;
    const node = getNodeById(id);
    if (!node) return;
    highlightGraph(id);
    flyToNode(node);
    if (node.panel) openPanel(node);
    recordAlignmentClick(id);
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

const GH_CACHE_KEY = 'gh-repos-cache-v1';
const GH_CACHE_TTL = 30 * 60 * 1000; // 30min

async function fetchGithubRepos() {
    try {
        const raw = localStorage.getItem(GH_CACHE_KEY);
        if (raw) {
            const cached = JSON.parse(raw);
            if (cached.t && Date.now() - cached.t < GH_CACHE_TTL && Array.isArray(cached.data)) {
                return cached.data;
            }
        }
    } catch {}
    const res   = await fetch('https://api.github.com/users/Glenrunc/repos?sort=updated&per_page=30');
    const repos = await res.json();
    try { localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ t: Date.now(), data: repos })); } catch {}
    return repos;
}

async function renderGithubPanel(body, L) {
    const loading = L === 'fr' ? 'Chargement des dépôts…' : 'Fetching repositories…';
    body.innerHTML = `<div class="p-section"><div class="p-prompt">curl api.github.com/users/Glenrunc/repos</div><p class="p-text">${loading}</p></div>`;

    try {
        const repos = await fetchGithubRepos();
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

/* ── Rocket mode: drivable spacecraft (WASD+QE, X to eject) ──
   Spawned by terminal `rocket` / `launch` / `./rocket`.
   Forward direction is rocket's local -Z (Three.js convention),
   so mesh.lookAt(target) faces the rocket at target naturally.
*/
const ROCKET = {
    MAX_SPEED:    260,      // u/s
    ACCEL:        240,      // u/s²
    DAMP:         0.985,    // per-frame velocity damping
    YAW_RATE:     2.2,      // rad/s
    PITCH_RATE:   1.9,
    CHASE_BACK:   18,
    CHASE_UP:     6,
    CHASE_LEAD:   10,
    CHASE_LERP:   0.18,
    WORLD_BOUND:  3500,
    LAND_PAD:     6,        // extra units beyond body radius for landing detect
};

const rocketState = {
    active: false,
    mesh: null,
    velocity: null,
    keys: new Set(),
    savedCamPos: null,
    savedTarget: null,
    prevAutoRotate: false,
    landed: false,
    landingTimer: null,
    hudEl: null,
    lastTickMs: 0,
};

function buildRocketMesh() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 4, 24),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.55, metalness: 0.25 }),
    );
    body.rotation.x = Math.PI / 2; // cylinder along Z
    group.add(body);

    // Nose cone, points forward (-Z)
    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 1.4, 24),
        new THREE.MeshStandardMaterial({ color: 0xff3030, roughness: 0.5, metalness: 0.2 }),
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -2.7;
    group.add(nose);

    // 3 fins at the back
    const finMat = new THREE.MeshStandardMaterial({ color: 0xff3030, roughness: 0.65 });
    [0, 120, 240].forEach(deg => {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.9), finMat);
        const rad = deg * Math.PI / 180;
        fin.position.set(Math.cos(rad) * 0.6, Math.sin(rad) * 0.6, 1.5);
        fin.rotation.z = rad;
        group.add(fin);
    });

    // Exhaust cone (points -forward = +Z), additive
    const exhaust = new THREE.Mesh(
        new THREE.ConeGeometry(0.45, 1.7, 16),
        new THREE.MeshBasicMaterial({
            color: 0x88c8ff, transparent: true, opacity: 0.85,
            blending: THREE.AdditiveBlending, depthWrite: false,
        }),
    );
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.z = 2.8;
    exhaust.name = 'exhaust';
    exhaust.visible = false; // off until thrust applied
    group.add(exhaust);

    const engineLight = new THREE.PointLight(0x88c8ff, 0.0, 22, 2);
    engineLight.position.z = 2.5;
    engineLight.name = 'engine-light';
    group.add(engineLight);

    return group;
}

function enterRocketMode() {
    if (rocketState.active) return;
    const scene = state._scene, camera = state._camera, controls = state._controls;
    if (!scene || !camera || !controls) return;

    rocketState.savedCamPos    = camera.position.clone();
    rocketState.savedTarget    = controls.target.clone();
    rocketState.prevAutoRotate = controls.autoRotate;
    controls.autoRotate = false;
    controls.enabled    = false;

    const mesh = buildRocketMesh();
    // Spawn near camera, BUT orient rocket toward the Sun (origin) so pressing
    // forward thrust points straight at the planetary system.
    const toOrigin = camera.position.clone().negate().normalize();
    mesh.position.copy(camera.position).addScaledVector(toOrigin, 28);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(mesh);

    // Snap chase camera immediately behind the rocket so the player sees the planets
    // ahead from frame one (no lerp ramp-up).
    const forwardInit = new THREE.Vector3(0, 0, -1).applyQuaternion(mesh.quaternion);
    camera.position.copy(mesh.position)
        .addScaledVector(forwardInit, -ROCKET.CHASE_BACK)
        .add(new THREE.Vector3(0, ROCKET.CHASE_UP, 0));
    controls.target.copy(mesh.position).addScaledVector(forwardInit, ROCKET.CHASE_LEAD);
    camera.lookAt(controls.target);

    rocketState.mesh        = mesh;
    rocketState.velocity    = new THREE.Vector3();
    rocketState.active      = true;
    rocketState.landed      = false;
    rocketState.lastTickMs  = performance.now();
    rocketState.landingTimer = null;
    rocketState.keys.clear();
    showRocketHud();
}

function exitRocketMode(focusBodyId) {
    if (!rocketState.active) return;
    const scene = state._scene, camera = state._camera, controls = state._controls;

    if (rocketState.mesh) {
        scene.remove(rocketState.mesh);
        rocketState.mesh.traverse(c => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
                const ms = Array.isArray(c.material) ? c.material : [c.material];
                ms.forEach(m => m.dispose());
            }
        });
    }
    rocketState.mesh = null;
    rocketState.active = false;
    rocketState.keys.clear();
    if (rocketState.landingTimer) { clearTimeout(rocketState.landingTimer); rocketState.landingTimer = null; }
    hideRocketHud();

    // If we landed on a body, let selectNode/flyToNode keep the framing.
    // Otherwise restore the saved camera pose.
    if (!focusBodyId) {
        camera.position.copy(rocketState.savedCamPos);
        controls.target.copy(rocketState.savedTarget);
    }
    controls.autoRotate = rocketState.prevAutoRotate;
    controls.enabled    = true;
    controls.update();
}

function showRocketHud() {
    if (rocketState.hudEl) return;
    const el = document.createElement('div');
    el.className = 'rocket-hud';
    el.id = 'rocket-hud';
    el.innerHTML = `
<div class="rh-line rh-title">&gt; ROCKET MODE</div>
<div class="rh-line"><span>SPEED</span> <span id="rh-speed">0.0</span> u/s · <span>HEADING</span> <span id="rh-heading">(0.0, 0.0, -1.0)</span></div>
<div class="rh-line"><span>NEAREST</span> <span id="rh-nearest">—</span></div>`;
    document.body.appendChild(el);
    rocketState.hudEl = el;

    // On-screen keymap with live-pressed indicators
    const keys = document.createElement('div');
    keys.className = 'rocket-keys';
    keys.id = 'rocket-keys';
    keys.innerHTML = `
<div class="rk-row"><span class="rk" id="rk-e">E</span></div>
<div class="rk-row"><span class="rk" id="rk-q">Q</span><span class="rk rk-thrust" id="rk-z">Z</span><span class="rk" id="rk-d">D</span></div>
<div class="rk-row"><span class="rk" id="rk-a">A</span></div>
<div class="rk-row rk-labels"><span>pitch</span><span>yaw / thrust / yaw</span><span>pitch</span></div>
<div class="rk-eject"><span class="rk rk-x" id="rk-x">X · eject</span></div>`;
    document.body.appendChild(keys);
}
function hideRocketHud() {
    const el = rocketState.hudEl || document.getElementById('rocket-hud');
    if (el) el.remove();
    rocketState.hudEl = null;
    const km = document.getElementById('rocket-keys');
    if (km) km.remove();
}

function tickRocket() {
    if (!rocketState.active || !rocketState.mesh) return;
    const now = performance.now();
    let dt = (now - rocketState.lastTickMs) / 1000;
    rocketState.lastTickMs = now;
    if (dt > 0.1) dt = 0.1;

    const mesh = rocketState.mesh;
    const keys = rocketState.keys;
    const v    = rocketState.velocity;

    // AZERTY mapping: z thrust · q yaw-left · d yaw-right · e pitch-up · a pitch-down
    const yawIn   = (keys.has('q') ? 1 : 0) - (keys.has('d') ? 1 : 0);
    const pitchIn = (keys.has('e') ? 1 : 0) - (keys.has('a') ? 1 : 0);
    if (yawIn)   mesh.rotateY(yawIn   * ROCKET.YAW_RATE   * dt);
    if (pitchIn) mesh.rotateX(pitchIn * ROCKET.PITCH_RATE * dt);

    // Thrust along local forward (-Z)
    const thrustIn = keys.has('z') ? 1 : 0;
    const forward  = new THREE.Vector3(0, 0, -1).applyQuaternion(mesh.quaternion);
    if (thrustIn) v.addScaledVector(forward, ROCKET.ACCEL * dt * thrustIn);

    v.multiplyScalar(ROCKET.DAMP);
    if (v.length() > ROCKET.MAX_SPEED) v.setLength(ROCKET.MAX_SPEED);

    mesh.position.addScaledVector(v, dt);

    // Soft world bound — reflect at sphere of radius WORLD_BOUND
    if (mesh.position.length() > ROCKET.WORLD_BOUND) {
        mesh.position.setLength(ROCKET.WORLD_BOUND);
        const n = mesh.position.clone().normalize();
        v.addScaledVector(n, -2 * v.dot(n));
        v.multiplyScalar(0.55);
    }

    // Engine FX
    const exhaust = mesh.getObjectByName('exhaust');
    const eLight  = mesh.getObjectByName('engine-light');
    if (exhaust) {
        exhaust.visible = thrustIn > 0;
        if (exhaust.visible) {
            const wobble = 1 + 0.35 * Math.sin(now * 0.05);
            exhaust.scale.set(1, wobble, 1);
        }
    }
    if (eLight) eLight.intensity = thrustIn > 0 ? 1.6 : 0;

    // Chase camera (skip when landed — selectNode/flyToNode owns the camera then)
    if (!rocketState.landed) {
        const cam      = state._camera;
        const controls = state._controls;
        const desiredCam = mesh.position.clone()
            .addScaledVector(forward, -ROCKET.CHASE_BACK)
            .add(new THREE.Vector3(0, ROCKET.CHASE_UP, 0));
        const desiredTgt = mesh.position.clone().addScaledVector(forward, ROCKET.CHASE_LEAD);
        const k = state._reducedMotion ? 1 : ROCKET.CHASE_LERP;
        cam.position.lerp(desiredCam, k);
        controls.target.lerp(desiredTgt, k);
        cam.lookAt(controls.target);
    }

    // Collision check
    checkRocketCollision(mesh.position);

    updateRocketHud(v, forward);
    ROCKET_KEYS.forEach(k => {
        const ke = document.getElementById('rk-' + k);
        if (ke) ke.classList.toggle('active', keys.has(k));
    });
}

function updateRocketHud(velocity, forward) {
    const el = rocketState.hudEl;
    if (!el) return;
    const speedEl   = document.getElementById('rh-speed');
    const headingEl = document.getElementById('rh-heading');
    if (speedEl)   speedEl.textContent   = velocity.length().toFixed(1);
    if (headingEl) headingEl.textContent = `(${forward.x.toFixed(2)}, ${forward.y.toFixed(2)}, ${forward.z.toFixed(2)})`;
}

function checkRocketCollision(rocketPos) {
    if (rocketState.landed) return;
    let hit = null, hitDist = Infinity;
    let nearestId = null, nearestDist = Infinity;
    for (const [id, cfg] of Object.entries(BODIES)) {
        const node = getNodeById(id);
        if (!node || !node._pos) continue;
        const d = rocketPos.distanceTo(node._pos);
        const surface = d - cfg.radius;
        if (surface < nearestDist) { nearestDist = surface; nearestId = id; }
        if (surface <= ROCKET.LAND_PAD && surface < hitDist) {
            hit = id; hitDist = surface;
        }
    }
    const nearestEl = document.getElementById('rh-nearest');
    if (nearestEl) {
        const surfaceTxt = Math.max(0, nearestDist).toFixed(0);
        nearestEl.textContent = nearestId ? `${nearestId}  ·  ${surfaceTxt} u` : '—';
    }
    if (hit) landOnBody(hit);
}

function landOnBody(bodyId) {
    if (rocketState.landed) return;
    rocketState.landed = true;
    rocketState.velocity.set(0, 0, 0);

    // Sun = punishment, not a panel
    if (bodyId === 'sun') {
        triggerSolarFlare();
        rocketState.landingTimer = setTimeout(() => exitRocketMode(null), 1400);
        showLandingBanner('DO NOT FLY INTO THE SUN');
        return;
    }

    // Skills hub leaves have no panel — bump to the parent hub instead
    const node = getNodeById(bodyId);
    if (!node) { rocketState.landingTimer = setTimeout(() => exitRocketMode(null), 1000); return; }

    const labelId = (node.type === 'skill') ? 'hub-skills' : bodyId;
    selectNode(labelId);

    const display = (node.en || labelId).toUpperCase();
    showLandingBanner(`LANDED · ${display}`);
    rocketState.landingTimer = setTimeout(() => exitRocketMode(labelId), 1300);
}

function showLandingBanner(text) {
    let banner = document.getElementById('rocket-banner');
    if (banner) banner.remove();
    banner = document.createElement('div');
    banner.id = 'rocket-banner';
    banner.className = 'rocket-banner';
    banner.textContent = text;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('visible'));
    setTimeout(() => {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 500);
    }, 1100);
}

/* Rocket key handlers — capture phase so they preempt terminal auto-focus */
const ROCKET_KEYS = ['z', 'q', 'd', 'e', 'a'];
function rocketKeydown(e) {
    if (!rocketState.active) return;
    const k = e.key.toLowerCase();
    if (k === 'escape' || k === 'x') { e.preventDefault(); e.stopPropagation(); exitRocketMode(); return; }
    if (ROCKET_KEYS.includes(k)) {
        e.preventDefault(); e.stopPropagation();
        rocketState.keys.add(k);
    }
}
function rocketKeyup(e) {
    if (!rocketState.active) return;
    const k = e.key.toLowerCase();
    if (ROCKET_KEYS.includes(k)) {
        e.preventDefault(); e.stopPropagation();
        rocketState.keys.delete(k);
    }
}

/* ── Vim overlay: fullscreen fake Neovim with cv.tex open ──── */
const VIM_BODY = [
    '\\documentclass{article}',
    '\\usepackage{matteo}',
    '\\begin{document}',
    '',
    '\\title{Mattéo Pourcine}',
    '\\role{AI Systems Engineer}',
    '\\location{France · open to relocation}',
    '',
    '\\section{Experience}',
    '  AnotherBrain  · R\\&D Intern · Paris   · 2023--2024',
    '  UTBM          · Engineering · Belfort  · 2021--2026',
    '  AGH           · Erasmus     · Kraków   · 2023',
    '  UQAC          · Exchange    · Saguenay · 2024',
    '',
    '\\section{Stack}',
    '  Python · PyTorch · C++ · CuPy · CUDA · OpenCV',
    '',
    '\\section{Specialty}',
    '  Computer vision, deep learning, medical imaging,',
    '  biometrics, video pipelines.',
    '',
    '\\section{Contact}',
    '  \\email{pourcinematteo@gmail.com}',
    '',
    '\\end{document}',
    '',
    '~',
    '~',
    '~',
];

function openVimOverlay(filename) {
    if (document.getElementById('vim-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'vim-overlay';
    overlay.className = 'vim-overlay';
    const file = filename || 'cv.tex';
    overlay.innerHTML = `
<div class="vim-buffer">${VIM_BODY.map((l, i) => `<div class="vim-line"><span class="vim-no">${String(i+1).padStart(3,' ')}</span>${l.replace(/</g,'&lt;').replace(/>/g,'&gt;') || '&nbsp;'}</div>`).join('')}</div>
<div class="vim-statusline"><span class="vim-mode">-- NORMAL --</span><span class="vim-file">${file}</span><span class="vim-pos">1,1   All</span></div>
<div class="vim-cmdline">type :q to exit · :wq to save and exit</div>`;
    document.body.appendChild(overlay);
    function handler(e) {
        const k = e.key;
        if (k === 'Escape' || (e.target.tagName !== 'INPUT' && (k === ':' && false))) { closeVimOverlay(); }
        if (k === 'Escape') { closeVimOverlay(); e.preventDefault(); }
    }
    overlay._handler = handler;
    window.addEventListener('keydown', handler);
}

function closeVimOverlay() {
    const overlay = document.getElementById('vim-overlay');
    if (!overlay) return;
    if (overlay._handler) window.removeEventListener('keydown', overlay._handler);
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 250);
}

/* ── sudo rm -rf / — drama, then restore ───────────────────── */
function triggerSudoNuke(showOutput) {
    const bm = state._bodyMeshes;
    if (!bm) { showOutput(['&gt; permission denied']); return; }
    showOutput(['&gt; permission denied. trying anyway…']);
    const order = ['hub-proj','mi7','chatbot','hackathon','github',
                   'hub-skills','sk-python','sk-cpp','sk-cupy','sk-pytorch','sk-cv',
                   'hub-exp','anotherbrain','utbm','uqac','agh',
                   'hub-interests','documentary','travel',
                   'earth'];
    const meshes = order.map(id => bm[id]).filter(Boolean);
    const step = 220;
    meshes.forEach((m, i) => {
        setTimeout(() => fadeMesh(m, 1, 0, 400), 400 + i * step);
    });
    const total = 400 + meshes.length * step + 800;
    setTimeout(() => {
        showOutput(['&gt; kernel panic averted. restoring.']);
        meshes.forEach((m, i) => setTimeout(() => fadeMesh(m, 0, 1, 500), i * 60));
    }, total);
}

function fadeMesh(meshOrGroup, from, to, duration) {
    if (state._reducedMotion) {
        applyOpacity(meshOrGroup, to);
        return;
    }
    const t0 = performance.now();
    function step(now) {
        const t = Math.min((now - t0) / duration, 1);
        applyOpacity(meshOrGroup, from + (to - from) * t);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function applyOpacity(obj, v) {
    obj.traverse(c => {
        if (c.material) {
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach(m => { m.transparent = true; m.opacity = v; });
        }
    });
}

/* ── hack — fake hacker animation, ends with ACCESS GRANTED ── */
function triggerHackAnim(streamLines) {
    const HEX = '0123456789abcdef';
    const rand = (n) => Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join('');
    const lines = [];
    for (let i = 0; i < 16; i++) {
        const addr = rand(8).toUpperCase();
        const bytes = Array.from({ length: 6 }, () => rand(2)).join(' ');
        lines.push(`&gt; <span style="color:#7afff0">${addr}</span>  ${bytes}  <span style="color:#3a5440">[ok]</span>`);
    }
    lines.push('&gt; bypassing firewall…');
    lines.push('&gt; injecting payload…');
    lines.push('&gt; <span style="color:#00ff88;font-weight:700">ACCESS GRANTED · welcome, Mattéo</span>');
    streamLines(lines, 130);
}

/* ── Konami easter egg: ↑↑↓↓←→←→BA → matrix rain + 20× orbits */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
let _konamiBuf = [];

function konamiKeydown(e) {
    // Don't intercept if the user is typing in the fake terminal
    const termInput = document.getElementById('term-input');
    if (document.activeElement === termInput) return;
    const code = e.code || e.key;
    _konamiBuf.push(code);
    if (_konamiBuf.length > KONAMI.length) _konamiBuf.shift();
    const match = _konamiBuf.length === KONAMI.length &&
        _konamiBuf.every((k, i) => k === KONAMI[i] || (KONAMI[i] === 'KeyB' && /^b$/i.test(k)) || (KONAMI[i] === 'KeyA' && /^a$/i.test(k)));
    if (match) {
        _konamiBuf = [];
        triggerKonami();
    }
}

function triggerKonami() {
    // Speed up orbits for 8s
    ORBIT_SPEED = ORBIT_SPEED_BASE * 20;
    setTimeout(() => { ORBIT_SPEED = ORBIT_SPEED_BASE; }, 8000);

    if (state._reducedMotion) {
        showFlareBanner('konami code accepted');
        return;
    }

    // Matrix rain overlay
    const root = document.createElement('div');
    root.id = 'matrix-rain';
    root.className = 'matrix-rain';
    const canvas = document.createElement('canvas');
    root.appendChild(canvas);
    document.body.appendChild(root);

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const fontSize = 16;
    const cols = Math.floor(W / fontSize);
    const drops = new Array(cols).fill(0).map(() => Math.random() * -H / fontSize);
    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

    let stopped = false;
    function frame() {
        if (stopped) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < cols; i++) {
            const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
            ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    setTimeout(() => {
        root.classList.add('fade-out');
        setTimeout(() => { stopped = true; root.remove(); }, 600);
    }, 7400);
}

/* ── Planet-alignment easter egg ─────────────────────────────
   Click Mars → Jupiter → Saturn → Neptune → Earth within 12s
   to unlock an achievement panel. Persists via localStorage.
*/
const ALIGNMENT_SEQ = ['hub-proj', 'hub-skills', 'hub-exp', 'hub-interests', 'identity'];
let _alignBuf = [];
let _alignStart = 0;

function recordAlignmentClick(id) {
    if (!ALIGNMENT_SEQ.includes(id)) {
        _alignBuf = []; _alignStart = 0; return;
    }
    const now = Date.now();
    if (_alignBuf.length === 0 || (now - _alignStart) > 12000) {
        _alignBuf = []; _alignStart = now;
    }
    _alignBuf.push(id);
    // Trim head if it doesn't match the expected prefix
    while (_alignBuf.length > 0 && _alignBuf[0] !== ALIGNMENT_SEQ[0]) _alignBuf.shift();
    // Validate prefix
    for (let i = 0; i < _alignBuf.length; i++) {
        if (_alignBuf[i] !== ALIGNMENT_SEQ[i]) { _alignBuf = []; _alignStart = 0; return; }
    }
    if (_alignBuf.length === ALIGNMENT_SEQ.length) {
        _alignBuf = []; _alignStart = 0;
        unlockAlignment();
    }
}

function unlockAlignment() {
    const already = !!localStorage.getItem('achievement-alignment');
    if (!already) localStorage.setItem('achievement-alignment', String(Date.now()));
    const L = state.lang;
    const title = L === 'fr' ? 'Alignement Planétaire' : 'Planetary Alignment';
    const sub   = already
        ? (L === 'fr' ? 'tu as déjà accompli ceci.' : 'you already pulled this off.')
        : (L === 'fr' ? 'seulement ~1% des visiteurs y arrivent.' : 'only ~1% of visitors do this.');
    const body  = L === 'fr'
        ? `Tu as cliqué Mars → Jupiter → Saturne → Neptune → Terre dans l'ordre. Tu mérites une réponse rapide.`
        : `You clicked Mars → Jupiter → Saturn → Neptune → Earth in order. You've earned a fast reply.`;
    const panelHtml = `
<div class="p-section">
  <div class="p-prompt">cat ~/.achievements/alignment.md</div>
  <div class="p-name">🏆 ${title}</div>
  <div class="p-meta">${sub}</div>
</div>
<div class="p-section">
  <div class="p-label">Note</div>
  <p class="p-text">${body}</p>
</div>
<div class="p-section">
  <div class="p-label">Contact</div>
  <a class="p-email" href="mailto:pourcinematteo@gmail.com?subject=${encodeURIComponent(title)}">pourcinematteo@gmail.com</a>
</div>`;
    document.getElementById('panel-path').textContent = '~/.achievements/alignment.md';
    document.getElementById('panel-body').innerHTML = panelHtml;
    document.getElementById('detail-panel').classList.add('open');
}

/* ── Sun-wrath easter egg: 7 clicks ≤2s → solar flare ─────── */
let _sunClicks = [];
function handleSunClick() {
    const now = performance.now();
    _sunClicks = _sunClicks.filter(t => now - t < 2000);
    _sunClicks.push(now);
    if (_sunClicks.length >= 7) {
        _sunClicks = [];
        triggerSolarFlare();
    }
}

function triggerSolarFlare() {
    const glow = state._sunGlow;
    const mesh = state._sunMesh;
    const base = state._sunMatColorBase;
    if (glow && mesh && base) {
        const dur = 1500;
        const t0 = performance.now();
        const angryColor = new THREE.Color(0xff5030);
        function step(now) {
            const t = Math.min((now - t0) / dur, 1);
            const k = Math.sin(t * Math.PI);            // 0→1→0
            const scale = 1 + 0.7 * k;
            glow.scale.set(scale, scale, scale);
            mesh.material.color.lerpColors(base, angryColor, k);
            if (t < 1) requestAnimationFrame(step);
            else {
                glow.scale.set(1, 1, 1);
                mesh.material.color.copy(base);
            }
        }
        if (state._reducedMotion) {
            // skip animation, no visual flare
        } else {
            requestAnimationFrame(step);
        }
    }
    showFlareBanner(state.lang === 'fr' ? 'tu as offensé le Soleil.' : 'you have angered the Sun.');
}

function showFlareBanner(text) {
    let banner = document.getElementById('flare-banner');
    if (banner) banner.remove();
    banner = document.createElement('div');
    banner.id = 'flare-banner';
    banner.className = 'flare-banner';
    banner.textContent = text;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('visible'));
    setTimeout(() => {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 600);
    }, 2400);
}

/* ── Fly camera to face a body in the solar system ───────────
   Tweens both controls.target (→ body pos) and camera.position
   (→ body pos + offset away from the Sun).
*/
function flyToNode(node) {
    if (!node._pos || !state._camera) return;
    const camera   = state._camera;
    const controls = state._controls;
    if (!controls) return;

    controls.autoRotate = false;
    const cfg = BODIES[node.id];
    if (!cfg) return;

    // Pick offset based on body kind
    const offsetMag = FLY_DISTANCE[cfg.kind] || 100;
    // Direction: from parent body outward through this body (so the parent is
    // visible behind it). Sun → keep current camera direction.
    let outward;
    if (node._pos.lengthSq() < 1e-3) {
        outward = camera.position.clone().sub(controls.target).normalize();
    } else if (cfg.orbit) {
        const parentNode = getNodeById(cfg.orbit.around);
        const parentPos  = (parentNode && parentNode._pos) ? parentNode._pos : new THREE.Vector3();
        outward = node._pos.clone().sub(parentPos).normalize();
    } else {
        outward = node._pos.clone().normalize();
    }
    const camTarget = node._pos.clone();
    const camPosEnd = node._pos.clone().add(outward.multiplyScalar(cfg.radius + offsetMag)).add(new THREE.Vector3(0, cfg.radius * 0.6, 0));

    const startPos    = camera.position.clone();
    const startTarget = controls.target.clone();
    const dur = 900, t0 = performance.now();

    if (state.flyAnim) cancelAnimationFrame(state.flyAnim);

    function step(now) {
        const t    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(startPos, camPosEnd, ease);
        controls.target.lerpVectors(startTarget, camTarget, ease);
        controls.update();
        if (t < 1) state.flyAnim = requestAnimationFrame(step);
        else state.flyAnim = null;
    }
    state.flyAnim = requestAnimationFrame(step);
}

/* ── Interactions ───────────────────────────────────────────── */
function setupInteractions() {
    const canvas   = document.getElementById('globe-canvas');
    const overlay  = document.getElementById('node-overlay');
    const camera   = state._camera;
    const controls = state._controls;

    // Node clicks via event delegation on overlay
    overlay.addEventListener('click', e => {
        const nodeEl = e.target.closest('.graph-node');
        if (!nodeEl) return;
        const id = nodeEl.id.replace('node-', '');
        const node = getNodeById(id);
        if (!node) return;
        if (node.type === 'sun') { handleSunClick(); return; }
        if (node.type === 'skill') return; // skills have no panel
        selectNode(id);
    });

    // Canvas click without drag → deselect. Pointerdown also cancels cinematic intro.
    let _ptrMoved = false;
    canvas.addEventListener('pointerdown', () => {
        _ptrMoved = false;
        if (state._introActive) state._introActive = false;
    });
    canvas.addEventListener('pointermove', e => { if (e.buttons) _ptrMoved = true; });
    canvas.addEventListener('pointerup', () => { if (!_ptrMoved) closePanel(); });

    // Zoom buttons
    document.getElementById('zoom-in').addEventListener('click', () => {
        const dir = camera.position.clone().normalize();
        const next = camera.position.clone().addScaledVector(dir, -35);
        if (next.length() >= controls.minDistance) camera.position.copy(next);
        controls.update();
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
        const dir = camera.position.clone().normalize();
        const next = camera.position.clone().addScaledVector(dir, 35);
        if (next.length() <= controls.maxDistance) camera.position.copy(next);
        controls.update();
    });
    document.getElementById('zoom-reset').addEventListener('click', () => {
        camera.position.set(0, 600, 1900);
        controls.target.set(0, 0, 0);
        controls.autoRotate = true;
        controls.update();
        closePanel();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
}

/* ── Language ───────────────────────────────────────────────── */
const LANG_UI = {
    en: { 'header-role': 'AI Systems Engineer',   'header-hint': 'click nodes to explore' },
    fr: { 'header-role': 'Ingénieur Systèmes IA', 'header-hint': 'cliquez les nœuds'      },
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
    { text: 'PORTFOLIO  v4.0',            cls: 'boot-title' },
    { text: '─'.repeat(34),               cls: 'boot-sep'   },
    { text: '> loading kernel',           ok: '          [OK]' },
    { text: '> mounting renderer',        ok: '         [OK]' },
    { text: '> calibrating orbits',       ok: '       [OK]' },
    { text: '> aligning planetary bodies', ok: ' [OK]' },
    { text: '─'.repeat(34),               cls: 'boot-sep'   },
];

function runBootSequence(onComplete) {
    // Under reduced-motion, skip the boot animation entirely
    if (state._reducedMotion) { onComplete(); return; }

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

    addLine('<span class="boot-ready">&gt; globe ready.</span>', '', t);
    t += 220;
    addLine('<span class="boot-prompt">matteo@portfolio:~$&nbsp;<span class="boot-cursor-blink">_</span></span>', '', t);
    t += 650;

    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => { overlay.remove(); onComplete(); }, 560);
    }, t);
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
                '&nbsp;&nbsp;clear         — reset globe view',
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
                showOutput(['&gt; experience · saturn/', '&nbsp;&nbsp;anotherbrain · utbm · uqac · agh']);
            } else if (args === 'skills') {
                selectNode('hub-skills');
                showOutput(['&gt; skills/', '&nbsp;&nbsp;python&nbsp;&nbsp;pytorch&nbsp;&nbsp;cupy&nbsp;&nbsp;opencv&nbsp;&nbsp;c++']);
            } else {
                showOutput([
                    '&gt; system bodies:',
                    '&nbsp;&nbsp;sun ★  ·  identity (earth) 🌍',
                    '&nbsp;&nbsp;hub-exp (saturn) → anotherbrain · utbm · uqac · agh',
                    '&nbsp;&nbsp;hub-proj (mars) → mi7 · chatbot · hackathon · github',
                    '&nbsp;&nbsp;hub-skills (jupiter) → python · cpp · cupy · pytorch · cv',
                    '&nbsp;&nbsp;hub-interests (neptune) → documentary · travel',
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
                const b = BODIES[target.id];
                const orbStr = b && b.orbit
                    ? ` (orbit r=${b.orbit.radius}, T=${b.orbit.period}s)`
                    : '';
                showOutput([`&gt; → ${target.id}${orbStr}`]);
            } else {
                showOutput([`&gt; cd: ${args}: no such node`], true);
            }
        } else if (cmd === 'pwd') {
            const cur = state.activeNodeId ? getNodeById(state.activeNodeId) : null;
            showOutput(['&gt; ' + (cur ? (cur.panel?.path || '~/' + cur.id) : '~/globe')]);
        } else if (cmd === 'clear') {
            closePanel();
            if (state._camera && state._controls) {
                state._camera.position.set(0, 600, 1900);
                state._controls.target.set(0, 0, 0);
                state._controls.autoRotate = true;
                state._controls.update();
            }
            hideOutput();
        } else if (cmd === './contact') {
            selectNode('identity');
            showOutput(['&gt; opening contact...']);
        } else if (cmd === 'rocket' || cmd === 'launch' || cmd === './rocket') {
            if (rocketState.active) { showOutput(['&gt; already piloting · type eject to exit']); }
            else { enterRocketMode(); showOutput(['&gt; 🚀 rocket launched · Z thrust · Q/D yaw · E/A pitch · X to eject']); }
        } else if (cmd === 'eject') {
            if (rocketState.active) { exitRocketMode(); showOutput(['&gt; ejected.']); }
            else { showOutput(['&gt; you are not in a rocket.']); }
        } else if (cmd === 'vim' || cmd === 'vi' || cmd === 'nvim') {
            openVimOverlay(args || 'cv.tex');
            hideOutput();
        } else if (cmd === ':wq' || cmd === ':q' || cmd === ':q!' || cmd === 'wq' || raw.trim() === ':wq') {
            if (document.getElementById('vim-overlay')) closeVimOverlay();
            else showOutput(["&gt; you're not in vim. or are you?"]);
        } else if (cmd === 'sudo') {
            if (args.startsWith('rm -rf')) {
                triggerSudoNuke(showOutput);
            } else if (args === 'make me a sandwich') {
                showOutput(['&gt; okay.', '&nbsp;&nbsp;🥪']);
            } else {
                showOutput(['&gt; nice try']);
            }
        } else if (cmd === 'nmap') {
            showOutput([
                '&gt; Starting nmap 7.94 on localhost',
                '&gt; PORT     STATE  SERVICE',
                '&nbsp;&nbsp;22/tcp   open   ssh',
                '&nbsp;&nbsp;80/tcp   open   http',
                '&nbsp;&nbsp;443/tcp  open   https',
                '&nbsp;&nbsp;3000/tcp open   portfolio',
                '&nbsp;&nbsp;1337/tcp open   ??? (filtered)',
                '&gt; Nmap done · 1 host up · 5 open ports',
            ]);
        } else if (cmd === 'traceroute' || cmd === 'tracert') {
            streamLines([
                '&gt; traceroute to matteo.com (∞)',
                '&nbsp;1  localhost              0.4 ms',
                '&nbsp;2  utbm.belfort.fr        12 ms',
                '&nbsp;3  agh.krakow.pl          42 ms',
                '&nbsp;4  uqac.saguenay.ca       78 ms',
                '&nbsp;5  anotherbrain.paris     18 ms',
                '&nbsp;6  matteo *               EOF',
            ], 520);
        } else if (cmd === 'fortune') {
            const fortunes = [
                'Test in prod. Live in fear.',
                '`float32` is enough for anyone.',
                'There are only two hard things: cache invalidation, naming things, and off-by-one errors.',
                'Premature optimization is the root of most of my git stash.',
                'Every CNN started as a fully-connected layer that gave up.',
                'A model is just a confident average.',
                "It compiles? Ship it.",
                'Data preprocessing > model architecture · always.',
            ];
            showOutput([`&gt; ${fortunes[Math.floor(Math.random() * fortunes.length)]}`]);
        } else if (cmd === 'cowsay') {
            const msg = (parts.slice(1).join(' ') || 'moo').slice(0, 60);
            const bar = '-'.repeat(msg.length + 2);
            showOutput([
                ` ${bar}`,
                `&lt; ${msg.replace(/</g,'&lt;').replace(/>/g,'&gt;')} &gt;`,
                ` ${bar}`,
                '&nbsp;&nbsp;&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;^__^',
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\&nbsp;(oo)\\_______',
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(__)\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)\\/\\',
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;||----w&nbsp;|',
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;||',
            ]);
        } else if (cmd === 'man' && args === 'matteo') {
            showOutput([
                '&gt; MATTEO(1)                User Commands               MATTEO(1)',
                '&gt; NAME',
                '&nbsp;&nbsp;&nbsp;&nbsp;matteo — AI systems engineer',
                '&gt; SYNOPSIS',
                '&nbsp;&nbsp;&nbsp;&nbsp;matteo [--hire] [--remote] [--cv]',
                '&gt; DESCRIPTION',
                '&nbsp;&nbsp;&nbsp;&nbsp;Specializes in computer vision and deep learning.',
                '&nbsp;&nbsp;&nbsp;&nbsp;Trained at UTBM. Field-tested at AnotherBrain.',
                '&gt; SEE ALSO',
                '&nbsp;&nbsp;&nbsp;&nbsp;pourcinematteo@gmail.com',
            ]);
        } else if ((cmd === 'whoami' || cmd === './whoami') && (args === '-r' || args === '--recursive')) {
            streamLines([
                '&gt; you',
                '&gt; a visitor',
                '&gt; a human',
                '&gt; carbon',
                '&gt; stardust',
                '&gt; the universe observing itself',
            ], 280);
        } else if (cmd === 'hack' || cmd === './hack') {
            triggerHackAnim(streamLines);
        } else if (cmd === 'matrix') {
            triggerKonami();
            showOutput(['&gt; wake up.']);
        } else if (cmd === 'exit' || cmd === 'quit') {
            showOutput(['&gt; nice try']);
        } else if (cmd) {
            showOutput([`&gt; ${cmd}: command not found — try 'help'`], true);
        }
    }

    // Stream output lines one at a time with an interval (preserves output until done)
    function streamLines(lines, intervalMs) {
        clearTimeout(hideTimer);
        outBox.innerHTML = '';
        outBox.className = 'visible';
        let i = 0;
        const tick = () => {
            if (i >= lines.length) {
                hideTimer = setTimeout(() => { outBox.className = ''; }, 5500);
                return;
            }
            const div = document.createElement('div');
            div.className = 'term-out-line';
            div.innerHTML = lines[i++];
            outBox.appendChild(div);
            setTimeout(tick, intervalMs);
        };
        tick();
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
        if (document.getElementById('vim-overlay')) return;
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
    state._reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    document.getElementById('lang-toggle').addEventListener('click', () =>
        setLang(state.lang === 'en' ? 'fr' : 'en'));
    document.getElementById('modal-close').addEventListener('click', closeVideoModal);
    document.getElementById('video-modal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeVideoModal();
    });
    document.getElementById('panel-close').addEventListener('click', closePanel);

    initFakeTerm();

    window.addEventListener('keydown', konamiKeydown);
    window.addEventListener('keydown', rocketKeydown, true);
    window.addEventListener('keyup',   rocketKeyup,   true);

    runBootSequence(() => {
        renderNodes();
        initGlobe(() => {
            setupInteractions();
            updateLangUI();
        });
    });

    console.log('%c Mattéo Pourcine / AI Systems Engineer ', 'background:#000;color:#00ff88;font-family:monospace;padding:4px 8px;border:1px solid #00ff88');
    console.log('%c pourcinematteo@gmail.com ', 'color:#00d4ff;font-family:monospace');
    console.log('%c type "help" in the terminal bar ↓ ', 'color:#3a5440;font-family:monospace');
});
