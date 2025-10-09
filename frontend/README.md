# React + Vite Frontend Starter Template

A modern, opinionated React + Vite starter template for rapid frontend development. This template is designed for quick project setup, featuring the latest packages, essential tooling, and a robust initial codebase including user authentication, Redux state management, custom hooks, and reusable UI components.

---

## ✨ Features

- **Vite** for lightning-fast development and builds
- **React 19** with functional components and hooks
- **Redux Toolkit** for scalable state management
- **React Router v7** for client-side routing
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui** is installed, so you can easily add and use shadcn UI components as needed
- **Class Variance Authority** and **clsx** for advanced class management
- **Lucide Icons** for beautiful iconography
- **Axios** with interceptor setup for API requests
- **Custom Hooks**: `useFetch`, `usePagination`, `useRole`
- **Authentication**: JWT-based auth with Redux and localStorage utilities
- **Reusable Components**: Error page, Unauthorized page, Protected/Private routes, Navbar, Spinner loader, and more
- **ESLint** with recommended rules and React hooks support
- **Ready for environment variables** via `.env` files

---

## 📦 Included Packages

See [`package.json`](package.json) for full details.

- `react`, `react-dom`
- `@reduxjs/toolkit`, `react-redux`
- `react-router-dom`
- `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge`
- `class-variance-authority`, `clsx`
- `lucide-react`
- `axios`
- `@radix-ui/react-slot`
- `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- `tw-animate-css`
- `shadcn/ui` (pre-installed, just add components as needed)

---

## 🗂️ Project Structure

```bash
src
├── api/                  # Axios instance and API utilities
│   └── axios.js
├── assets/               # Static assets (images, svgs)
│   ├── react.svg
│   └── images/
│       └── person1.jpg
├── components/           # Reusable UI components
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx
│   ├── ProtectedRoute.jsx
│   ├── loaders/
│   │   ├── Spinner.jsx
│   │   └── styles/
│   │       └── spinner.css
│   └── ui/
│       └── button.jsx
├── hooks/                # Custom React hooks
│   ├── useFetch.js
│   ├── usePagination.js
│   └── useRole.js
├── lib/                  # Utility functions
│   └── utils.js
├── pages/                # Route pages
│   ├── Dashboard.jsx
│   ├── Error.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Story.jsx
│   └── Unauthorized.jsx
├── redux/                # Redux store, reducers, and async thunks
│   ├── store.js
│   ├── api/
│   │   └── userApi.js
│   └── reducers/
│       └── userReducer.js
├── utils/                # Utility helpers (localStorage, etc.)
│   └── localStorageUtils.jsx
├── App.jsx               # Main app component
├── index.css             # Tailwind and global styles
└── main.jsx              # Entry point
```

---

## 🚀 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/NishantMoolya/react-vite-starter.git
   cd react-vite-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

5. **Edit source files**

   Start editing the source files in the `src` directory. The app will automatically reload with your changes.

---

## 🛠️ Development Tools

This template is pre-configured with essential development tools:

- **ESLint**: For identifying and fixing linting issues
- **Prettier**: For code formatting
- **Husky**: For Git hooks
- **Lint-staged**: For running linters on pre-committed files

---

<!-- ## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

--- -->

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Blazing fast frontend build tool
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated, batteries-included toolset for efficient Redux development
- [React Router](https://reactrouter.com/) - Declarative routing for React.js
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs
- [Lucide Icons](https://lucide.dev/) - Beautifully crafted open-source icons
- [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components you can copy and paste into your apps

---

## 📞 Support

For support, open an issue on the [GitHub repository](https://github.com/yourusername/react-vite-starter/issues) or contact the maintainer.

---

Happy coding! 🎉
