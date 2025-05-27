# Blue Whale Asian Fusion Restaurant Web Application

![Vite](https://img.shields.io/badge/built%20with-Vite-blue)
![React](https://img.shields.io/badge/framework-React-blue)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/style-Tailwind%20CSS-teal)
![Firebase](https://img.shields.io/badge/backend-Firebase-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## Project Description

Blue Whale Asian Fusion Restaurant is a modern, responsive web application designed to showcase the restaurant's offerings, manage reservations, and provide an engaging user experience. The app supports multi-language (English and Portuguese), real-time updates on restaurant status, daily specials, and active offers. It also includes an admin panel for managing reservations, careers, and settings.

## Tech Stack and Framework

- **React 18**: Chosen for its component-based architecture, rich ecosystem, and excellent TypeScript support. React enables building a dynamic and responsive UI efficiently.
- **Vite**: Used as the build tool for its blazing fast development server and optimized build process, significantly improving developer experience over traditional bundlers like Webpack.
- **TypeScript**: Provides static typing, improving code quality, maintainability, and developer productivity.
- **Tailwind CSS**: Utility-first CSS framework chosen for rapid UI development and easy customization. Preferred over Bootstrap for its flexibility and smaller bundle size.
- **Firebase**: Backend-as-a-Service for real-time database, authentication, and hosting capabilities. Simplifies backend management compared to building a custom backend.
- **React Router DOM**: For client-side routing, enabling a multi-page SPA experience including a separate admin panel.
- **Material UI & lucide-react**: Icon libraries chosen for comprehensive icon sets and ease of use.
- **Recharts**: For rendering interactive charts and data visualizations in the admin dashboard.
- **Framer Motion**: For smooth animations and transitions enhancing user experience.
- **React Slick & Slick Carousel**: For responsive carousels and sliders.
- **React Datepicker**: For user-friendly date selection in reservation forms.
- **React PDF Viewer**: To display PDF documents within the app.
- **Resend**: For sending transactional emails reliably.
- **Google Translate API**: To support multi-language translations dynamically.

## Features

- **User Authentication**: Admin login system to secure the admin panel.
- **Reservation System**: Users can book tables via a modal form with real-time availability.
- **Multi-language Support**: English and Portuguese translations for UI text.
- **Real-time Updates**: Restaurant status, daily specials, and active offers update live using Firebase Firestore.
- **Admin Panel**: Manage reservations, careers, settings, and view dashboards with charts.
- **Responsive Design**: Fully responsive UI optimized for desktop and mobile devices.
- **Email Integration**: Automated email confirmations for reservations.
- **Interactive Components**: Carousels, charts, and animations for engaging UX.
- **Google Maps Integration**: Embedded map showing restaurant location.
- **PDF Viewer**: Display restaurant menu PDF within the app.

## Libraries/Packages Used and Why

| Library/Package           | Purpose                          | Reason for Choice                                                                                  |
|--------------------------|---------------------------------|--------------------------------------------------------------------------------------------------|
| React                    | UI library                      | Popular, performant, strong community, excellent TypeScript support                              |
| Vite                     | Build tool                     | Fast dev server and build, better DX than Webpack                                               |
| TypeScript               | Static typing                  | Improves code quality and maintainability                                                       |
| Tailwind CSS             | Styling                       | Utility-first, highly customizable, smaller bundle size than Bootstrap                           |
| Firebase                 | Backend services              | Real-time database, authentication, hosting, easy integration                                   |
| React Router DOM         | Routing                       | Declarative routing for SPA, nested routes for admin panel                                      |
| Material UI & lucide-react | Icons                        | Comprehensive icon sets, easy to use                                                            |
| Recharts                 | Charts                        | Simple, customizable charting library                                                           |
| Framer Motion            | Animations                   | Powerful animation library for React                                                            |
| React Slick & Slick Carousel | Carousels                 | Responsive, easy to implement carousels                                                        |
| React Datepicker         | Date inputs                  | User-friendly date picker component                                                             |
| React PDF Viewer         | PDF display                  | Render PDFs inside React apps                                                                    |
| Resend                   | Email sending                | Reliable transactional email service                                                            |
| Google Translate API     | Translation                  | Supports dynamic multi-language translations                                                    |
| dotenv                   | Environment variables        | Manage environment variables securely                                                           |
| ESLint                   | Linting                     | Code quality and consistency                                                                     |

## Folder Structure & Modules

```
src/
├── admin/                  # Admin panel components and pages
│   ├── components/         # Admin layout and shared components
│   └── pages/              # Admin pages: Dashboard, Login, Reservations, Careers, Settings
├── components/             # Reusable UI components (Navbar, Hero, Gallery, MenuSection, etc.)
├── firebase/               # Firebase configuration and initialization
├── pages/                  # API routes for backend functions (email sending, etc.)
├── services/               # Service modules (email services, etc.)
├── utils/                  # Utility functions (e.g., translation helpers)
├── App.tsx                 # Main app component
├── main.tsx                # App entry point with routing setup
├── index.css               # Global styles including Tailwind imports
└── vite-env.d.ts           # Vite environment typings
```

## Setup Instructions

### Prerequisites

- Node.js (>=16.x)
- npm (>=8.x) or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

This starts the Vite development server. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Additional Notes

- Environment variables should be configured in a `.env` file at the project root.
- Firebase configuration is located in `src/firebase/config.ts`.
- API routes for sending emails are in `src/pages/api/`.
- Admin panel routes are protected and require authentication.

---

This README provides a comprehensive overview of the Blue Whale Asian Fusion Restaurant web application, its architecture, and how to get started with development and deployment.
