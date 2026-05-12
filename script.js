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
    {
        id: 'identity', type: 'identity',
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
    <a class="p-link" href="https://linkedin.com/in/matteo-pourcine" target="_blank">→ linkedin.com/in/matteo-pourcine</a>
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
        geo: { lat: 48.85, lon: 2.35 },
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
        geo: { lat: 47.64, lon: 6.85 },
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
        geo: { lat: 48.43, lon: -71.07 },
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
        geo: { lat: 50.06, lon: 19.94 },
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

// Assign ._pos to every node — all on globe surface (r=205), arcs hug surface too
function computeNodePositions() {
    const S = 205;

    // Experience nodes: real geographic coordinates
    NODES.forEach(n => {
        if (n.geo) n._pos = latLonToXYZ(n.geo.lat, n.geo.lon, S);
    });

    // Identity: France center, r=212 for slight visual prominence
    getNodeById('identity')._pos      = latLonToXYZ(46.0,   2.0,  212);

    // Hub nodes: geographically spread across Europe/Atlantic
    getNodeById('hub-exp')._pos       = latLonToXYZ(56.0,   3.0,  S);  // North Sea
    getNodeById('hub-proj')._pos      = latLonToXYZ(43.0,  -9.0,  S);  // NW Spain coast
    getNodeById('hub-interests')._pos = latLonToXYZ(60.0,   5.0,  S);  // Norway
    getNodeById('hub-skills')._pos    = latLonToXYZ(36.0,  14.0,  S);  // Sicily/Malta

    // Project leaf nodes: Atlantic / North Sea
    getNodeById('mi7')._pos           = latLonToXYZ(50.0, -12.0,  S);
    getNodeById('chatbot')._pos       = latLonToXYZ(54.0,  15.0,  S);  // Baltic
    getNodeById('hackathon')._pos     = latLonToXYZ(45.0, -18.0,  S);  // Atlantic
    getNodeById('github')._pos        = latLonToXYZ(57.0,  -6.0,  S);  // Scotland

    // Skill nodes: Mediterranean / Middle East
    getNodeById('sk-python')._pos     = latLonToXYZ(35.0,  15.0,  S);
    getNodeById('sk-cpp')._pos        = latLonToXYZ(28.0,  12.0,  S);
    getNodeById('sk-cupy')._pos       = latLonToXYZ(40.0,  25.0,  S);  // Greece
    getNodeById('sk-pytorch')._pos    = latLonToXYZ(32.0,  35.0,  S);  // Middle East
    getNodeById('sk-cv')._pos         = latLonToXYZ(51.0,  28.0,  S);  // Ukraine

    // Interest nodes: Atlantic coast
    getNodeById('documentary')._pos   = latLonToXYZ(46.0,  -4.0,  S);
    getNodeById('travel')._pos        = latLonToXYZ(42.5,   3.0,  S);
}

/* ── Continent outlines via TopoJSON ───────────────────────── */
async function loadContinents(scene) {
    try {
        const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(r => r.json());
        const mesh = topojson.mesh(topo, topo.objects.land);
        const positions = [];
        mesh.coordinates.forEach(ring => {
            for (let i = 0; i < ring.length - 1; i++) {
                positions.push(...latLonToXYZ(ring[i][1],   ring[i][0],   202).toArray());
                positions.push(...latLonToXYZ(ring[i+1][1], ring[i+1][0], 202).toArray());
            }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        scene.add(new THREE.LineSegments(geo,
            new THREE.LineBasicMaterial({ color: 0x1f7a40, transparent: true, opacity: 0.7 })
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
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 5000);
    camera.position.set(0, 80, 520);
    state._camera = camera;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enablePan       = false;
    controls.minDistance     = 260;
    controls.maxDistance     = 1100;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.22;
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.07;
    controls.target.set(0, 0, 0);
    state._controls = controls;

    // Globe body
    scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(200, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x040a07 })
    ));

    // Lat/lon wireframe grid (subtle, behind continent outlines)
    scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(201.5, 24, 12),
        new THREE.MeshBasicMaterial({ color: 0x163320, wireframe: true, transparent: true, opacity: 0.10 })
    ));

    // Atmosphere glow
    scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(218, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.033, side: THREE.BackSide })
    ));

    // Starfield
    const starPos = new Float32Array(1400 * 3);
    for (let i = 0; i < 1400; i++) {
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        const r = 750 + Math.random() * 350;
        starPos[i * 3]     = r * Math.sin(p) * Math.cos(t);
        starPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        starPos[i * 3 + 2] = r * Math.cos(p);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent: true, opacity: 0.38 })
    ));

    // Compute 3D positions for all nodes
    computeNodePositions();
    loadContinents(scene);

    // Build arcs for each edge
    const arcLines = {};
    EDGES.forEach(edge => {
        const a = getNodeById(edge.from);
        const b = getNodeById(edge.to);
        if (!a?._pos || !b?._pos) return;
        const r   = Math.max(a._pos.length(), b._pos.length()) * 0.985;
        const pts = greatCirclePoints(a._pos, b._pos, Math.max(r, 203));
        const geo = new THREE.BufferGeometry().setFromPoints(
            new THREE.CatmullRomCurve3(pts).getPoints(64)
        );
        const mat  = new THREE.LineBasicMaterial({ color: 0x1e3a28, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        arcLines[`${edge.from}-${edge.to}`] = { mat, line, curve: new THREE.CatmullRomCurve3(pts) };
    });
    state._arcLines = arcLines;

    // EdgePackets — InstancedMesh squares that travel along arcs
    const validEdges = EDGES.filter(e => arcLines[`${e.from}-${e.to}`]);
    const packets    = validEdges.map(e => ({
        key:   `${e.from}-${e.to}`,
        from:  e.from,
        to:    e.to,
        t:     Math.random(),
        speed: 0.0009 + Math.random() * 0.0013,
    }));

    const pktMat  = new THREE.MeshBasicMaterial({
        color: 0x00ff88, transparent: true, opacity: 0.8,
        side: THREE.DoubleSide, depthWrite: false
    });
    const pktMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 1.5), pktMat, packets.length);
    pktMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(pktMesh);
    const dummy = new THREE.Object3D();

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
        const camN = camera.position.clone().normalize();

        NODES.forEach(node => {
            const el = document.getElementById(`node-${node.id}`);
            if (!el || !node._pos) return;

            // Hub-based visibility: leaf nodes hidden when hub is collapsed
            const hubVis = isNodeVisible(node.id);
            el.classList.toggle('node-hidden', !hubVis);

            tempV.copy(node._pos).project(camera);
            const sx = (tempV.x + 1) / 2 * w;
            const sy = (-tempV.y + 1) / 2 * h;

            const dot    = node._pos.clone().normalize().dot(camN);
            const onBack = dot < 0.0;

            el.style.left    = sx + 'px';
            el.style.top     = sy + 'px';
            el.style.display = (onBack || tempV.z > 1) ? 'none' : '';
        });
    }

    // Animate packets along arcs, update arc highlight colors
    function animatePackets() {
        const active = state.activeNodeId;
        packets.forEach((p, i) => {
            const arc = arcLines[p.key];
            const edgeVis = isNodeVisible(p.from) && isNodeVisible(p.to);

            if (!arc || !edgeVis) {
                if (arc) { arc.mat.opacity = 0; }
                dummy.position.set(9999, 9999, 9999);
                dummy.updateMatrix();
                pktMesh.setMatrixAt(i, dummy.matrix);
                return;
            }

            p.t = (p.t + p.speed) % 1;
            const pt = arc.curve.getPoint(p.t);
            dummy.position.copy(pt);
            dummy.lookAt(camera.position);
            dummy.updateMatrix();
            pktMesh.setMatrixAt(i, dummy.matrix);

            const connected = !active || p.from === active || p.to === active;
            arc.mat.color.setHex(active ? (connected ? 0x00ff88 : 0x0a1205) : 0x1e3a28);
            arc.mat.opacity  = active ? (connected ? 0.9 : 0.04) : 0.5;
        });
        pktMesh.instanceMatrix.needsUpdate = true;
    }

    // Main render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        animatePackets();
        renderer.render(scene, camera);
        projectNodes();
    }
    animate();

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

/* ── Fly camera to face a node ──────────────────────────────── */
function flyToNode(node) {
    if (!node._pos || !state._camera) return;

    const camera   = state._camera;
    const controls = state._controls;

    controls.autoRotate = false;

    // Camera moves to face node's hemisphere, keeps similar distance (min 380)
    const dist      = Math.max(camera.position.length(), 380);
    const targetPos = node._pos.clone().normalize().multiplyScalar(dist);
    targetPos.y    += 40;

    const startPos = camera.position.clone();
    const dur = 800, t0 = performance.now();

    if (state.flyAnim) cancelAnimationFrame(state.flyAnim);

    function step(now) {
        const t    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(startPos, targetPos, ease);
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
        if (node && node.type !== 'skill') selectNode(id);
    });

    // Canvas click without drag → deselect
    let _ptrMoved = false;
    canvas.addEventListener('pointerdown', () => { _ptrMoved = false; });
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
        camera.position.set(0, 80, 520);
        controls.target.set(0, 0, 0);
        controls.autoRotate = true;
        controls.update();
        closePanel();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
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
    { text: 'PORTFOLIO  v3.0',            cls: 'boot-title' },
    { text: '─'.repeat(34),               cls: 'boot-sep'   },
    { text: '> loading kernel',           ok: '          [OK]' },
    { text: '> mounting globe renderer',  ok: '  [OK]' },
    { text: '> placing nodes on earth',   ok: '   [OK]' },
    { text: '> routing neural pathways',  ok: '  [OK]' },
    { text: '─'.repeat(34),               cls: 'boot-sep'   },
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
                showOutput(['&gt; experience/', '&nbsp;&nbsp;anotherbrain · Paris', '&nbsp;&nbsp;utbm · Belfort', '&nbsp;&nbsp;uqac · Canada', '&nbsp;&nbsp;agh · Poland']);
            } else if (args === 'skills') {
                selectNode('hub-skills');
                showOutput(['&gt; skills/', '&nbsp;&nbsp;python&nbsp;&nbsp;pytorch&nbsp;&nbsp;cupy&nbsp;&nbsp;opencv&nbsp;&nbsp;c++']);
            } else {
                showOutput([
                    '&gt; nodes:',
                    '&nbsp;&nbsp;identity',
                    '&nbsp;&nbsp;hub-exp · anotherbrain(Paris) · utbm(Belfort)',
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uqac(Canada) · agh(Poland)',
                    '&nbsp;&nbsp;hub-proj · mi7 · chatbot · hackathon · github',
                    '&nbsp;&nbsp;hub-skills · hub-interests · documentary · travel',
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
                const geoStr = target.geo
                    ? ` (${target.geo.lat.toFixed(1)}°N, ${Math.abs(target.geo.lon).toFixed(1)}°${target.geo.lon >= 0 ? 'E' : 'W'})`
                    : '';
                showOutput([`&gt; → ${target.id}${geoStr}`]);
            } else {
                showOutput([`&gt; cd: ${args}: no such node`], true);
            }
        } else if (cmd === 'pwd') {
            const cur = state.activeNodeId ? getNodeById(state.activeNodeId) : null;
            showOutput(['&gt; ' + (cur ? (cur.panel?.path || '~/' + cur.id) : '~/globe')]);
        } else if (cmd === 'clear') {
            closePanel();
            if (state._camera && state._controls) {
                state._camera.position.set(0, 80, 520);
                state._controls.target.set(0, 0, 0);
                state._controls.autoRotate = true;
                state._controls.update();
            }
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
        initGlobe(() => {
            setupInteractions();
            updateLangUI();
            initVisitorCounter();
        });
    });

    console.log('%c Mattéo Pourcine / AI Systems Engineer ', 'background:#000;color:#00ff88;font-family:monospace;padding:4px 8px;border:1px solid #00ff88');
    console.log('%c pourcinematteo@gmail.com ', 'color:#00d4ff;font-family:monospace');
    console.log('%c type "help" in the terminal bar ↓ ', 'color:#3a5440;font-family:monospace');
});
