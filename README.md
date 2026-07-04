# Aliaqa Alizada | Frontend Developer Portfolio

A modern, high-performance, and bilingual portfolio website designed to showcase web development projects, technical skills, and professional experience.

The website features a clean, minimal dark theme, smooth micro-animations, a dynamic cursor shadow effect, and a modular asynchronous template loading architecture.

[View Live Demo](https://aliaqa-alizada.de/) | [LinkedIn](https://www.linkedin.com/feed/)

---

## 🚀 Key Features

*   **Modular & Dynamic Architecture:** Sections (About Me, Technologies, Testimonials, Dialogs) are modularized as separate HTML templates and loaded asynchronously using the JavaScript Fetch API. This keeps `index.html` lightweight and improves codebase maintainability.
*   **Internationalization (i18n):** Seamless translation switching (English and German) without page reloads. The selected language is persisted in `localStorage` to preserve the user's preference for future visits.
*   **Interactive Project Showcase:** Detailed project cards open in responsive modal dialogs (including projects like *Join*, *El Pollo Loco*, and *DABubble*), featuring carousel-style navigation between projects.
*   **Dynamic Testimonial Carousel:** A custom slider demonstrating recommendations and feedback from colleagues and project partners.
*   **Accessibility & SEO:** Built using semantic HTML5, structured heading hierarchies, and metadata optimized for search engines and social media previews (OpenGraph).
*   **Contact Form with Real-time Validation:** Client-side input validation with friendly error feedback, integrated with a secure backend PHP mailer (`send.php`) for email delivery.

---

## 🛠️ Tech Stack

The core portfolio is built using native web technologies to ensure lightning-fast load times, clean code, and zero runtime overhead:

| Technology / Tool | Badge | Description |
| :--- | :--- | :--- |
| **HTML5** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Structure of the application shell and modular templates. |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Modular stylesheets, custom scrollbars, CSS variables for the dark theme, and responsive layouts. |
| **JavaScript (ES6+)** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Section orchestration, internationalization (i18n) handling, carousel logic, and modal dialog control. |
| **PHP** | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white) | Server-side script (`send.php`) for sending contact form messages via email. |
| **Git** | ![Git](https://img.shields.io/badge/Git-F05033?style=flat-square&logo=git&logoColor=white) | Version control and source code management. |

---

## 📂 Project Structure

The files are structured logically to separate styling, scripting, and modular HTML sections, facilitating clean development and scalability:

```text
portfolio/
├── assets/             # Static assets
│   ├── fonts/          # Custom web typography
│   └── imgs/           # Project screenshots, preview images, and SVG icons
├── html/               # Modular HTML sections fetched dynamically via JavaScript
│   ├── aboutme-section.html
│   ├── legal-notice.html
│   ├── privacy-policy.html
│   ├── projects-dialog.html
│   ├── technologies-section.html
│   └── testimonial-section.html
├── script/             # Modularized JavaScript source files
│   ├── i18n.js         # Localization logic and translation dictionary
│   ├── projects-dialog.js # Interactive modal overlay logic
│   ├── scroll-restore.js  # Scroll position management
│   └── testimonial-section.js # Carousel slider implementation
├── styles/             # Modularized CSS stylesheets
│   ├── aboutme-technologies.css
│   ├── cards-burger-footer.css
│   ├── contact.css
│   ├── header-hero.css
│   ├── legal-notice.css
│   ├── privacy-policy.css
│   ├── projects-dialog.css
│   ├── responsive.css  # Mobile-first responsiveness
│   └── testimonial-slider.css
├── index.html          # Main application entry point (App Shell)
├── script-core.js      # Core template loading, validation, and backend communication
├── script-ui.js        # Mobile menu toggle, cursor shadow, smooth scroll, and IntersectionObservers
├── style.css           # Global layout styles, design tokens, and animation keyframes
├── send.php            # PHP contact mail processor
├── .prettierrc         # Code formatting configuration
└── .gitignore          # Version control ignore rules
```

---

## ⚙️ Local Development & Setup

Because this project dynamically fetches HTML modules from the `html/` directory using JavaScript, standard browsers will block these asynchronous calls under the CORS security policy if `index.html` is opened directly via the local file system (`file://`).

To run the project locally, you must run it through a local web server:

### VS Code "Live Server" (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension from the extensions marketplace.
3. Click the **Go Live** button in the status bar at the bottom right, or right-click `index.html` and select **Open with Live Server**.

---

## 📬 Contact

*   **Developer:** Aliaqa Alizada
*   **LinkedIn:** [Aliaqa Alizada](https://www.linkedin.com/feed/)
*   **GitHub:** [Ali-Alizada](https://github.com/Ali-Alizada)
