# Portfolio Website

A modern, responsive portfolio website built with vanilla HTML5, CSS3, and JavaScript. This project showcases professional skills, projects, and experience with smooth animations and interactive elements.

## 🌟 Features

- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern Animations**: Smooth scroll animations, typing effects, and interactive elements
- **Dark/Light Mode**: Toggle between themes with automatic system preference detection
- **Performance Optimized**: Fast loading with lazy loading and optimized assets
- **SEO Friendly**: Semantic HTML structure with proper meta tags
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Progressive Web App**: Service worker implementation for offline functionality

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies** (optional, for development tools)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or simply open index.html in your browser
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── main.css            # Main styles with CSS variables
│   └── responsive.css      # Responsive breakpoints and media queries
├── js/
│   ├── main.js             # Core functionality and navigation
│   ├── typed.js            # Typing animations and text effects
│   └── animations.js       # Advanced animations and interactions
├── assets/
│   ├── images/             # Profile photos, project screenshots
│   ├── icons/              # Favicons and icon files
│   └── documents/          # Resume/CV files
├── components/             # Reusable HTML components (future use)
└── package.json           # Project dependencies and scripts
```

## 🎨 Customization

### 1. Personal Information
Update the following in `index.html`:
- Replace `[Your Name]` with your actual name
- Update contact information in the contact section
- Replace social media links with your profiles
- Update meta tags for SEO

### 2. Styling and Colors
Modify CSS variables in `css/main.css`:
```css
:root {
    --primary-color: #667eea;    /* Your brand color */
    --secondary-color: #764ba2;  /* Secondary accent */
    --accent-color: #f093fb;     /* Highlight color */
    /* ... other variables */
}
```

### 3. Content Sections
- **About**: Update the about section with your background
- **Skills**: Modify skill items and add your technologies
- **Projects**: Replace project placeholders with your work
- **Experience**: Add your work experience and timeline
- **Contact**: Update contact form and information

### 4. Images
Replace placeholder images in `assets/images/`:
- `profile-photo.jpg` - Your main profile photo
- `about-photo.jpg` - Additional photo for about section
- `project-*.jpg` - Screenshots of your projects

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start live development server
npm run serve        # Start basic HTTP server

# Building
npm run build        # Minify CSS and JS for production
npm run minify:css   # Minify CSS files
npm run minify:js    # Minify JavaScript files

# Quality Assurance
npm run lint         # Check JavaScript for errors
npm run lint:fix     # Fix JavaScript errors automatically
npm run format       # Format code with Prettier
npm run validate:html # Validate HTML structure

# Testing & Performance
npm test            # Run Jest tests
npm run lighthouse  # Generate Lighthouse performance report

# Deployment
npm run deploy:gh-pages  # Deploy to GitHub Pages
```

## 📱 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## 🎯 Performance Features

- **Lazy Loading**: Images load as they come into viewport
- **Critical CSS**: Above-the-fold styles inlined
- **Minified Assets**: Compressed CSS and JavaScript
- **Optimized Images**: WebP format with fallbacks
- **Service Worker**: Caching for offline functionality
- **Preloading**: Critical resources preloaded

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader compatibility
- Focus management
- Reduced motion support

## 🌐 SEO Optimization

- Meta tags for social sharing
- Structured data markup
- Semantic HTML elements
- Optimized images with alt text
- Fast loading performance
- Mobile-friendly design

## 🚀 Deployment Options

### GitHub Pages
```bash
npm run deploy:gh-pages
```

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import your GitHub repository
2. Deploy with default settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [Unsplash](https://unsplash.com/) for placeholder images
- Inspiration from modern portfolio designs

## 📞 Support

If you have any questions or need help customizing this portfolio, feel free to:

- Open an issue on GitHub
- Contact me at [your.email@example.com]
- Connect on [LinkedIn](https://linkedin.com/in/yourprofile)

---

**Made with ❤️ and lots of coffee**

Remember to star ⭐ this repository if it helped you!