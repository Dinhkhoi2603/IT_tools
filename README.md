# IT_tools

<div align="center">
  
  **A modern web platform providing a comprehensive collection of utility tools for IT professionals**
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-Latest-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📝 API Documentation](#-api-documentation)
- [👥 Contributing](#-contributing)
- [📄 License](#-license)

## Overview

IT_tools is a plugin-based platform that allows IT professionals to access a variety of utility tools through a single interface. The system features a dynamic tool loading mechanism that enables hot-swapping of tools without requiring application redeployment.

## ✨ Features

- **Dynamic Tool Loading** — Add, enable, or disable tools without redeploying the application
- **Plugin Architecture** — Extend functionality with custom plugins using PF4J
- **User Authentication** — Secure JWT-based authentication with role-based access control
- **Social Login** — GitHub OAuth integration for simplified login process
- **Admin Dashboard** — Comprehensive interface to manage tools, users, and application settings
- **Tool Upload System** — Admin users can upload new tool implementations directly through the web interface
- **Tool Categories** — Organized tools by categories for easy discovery and navigation
- **Favorites System** — Users can bookmark their frequently used tools for quick access
- **Premium Features** — Support for premium tool access based on user subscription level

## 🛠️ Technology Stack

### Backend

- **Java 21**
- **Spring Boot 3.4.3**
  - Spring Security with JWT authentication
  - Spring Data MongoDB for database operations
  - Spring Web for RESTful APIs
- **MongoDB Atlas** — Cloud database service
- **PF4J** — Plugin Framework for Java providing the tool plugin architecture
- **OAuth2** — Social login integration
- **Lombok** — Reduce boilerplate code
- **Google libphonenumber** — Phone number validation and formatting
- **Spring dotenv** — Environment variable management

### Frontend

- **React** — UI library for building the user interface
- **Vite** — Next generation frontend build tool
- **Tailwind CSS** — Utility-first CSS framework
- **React Router** — Client-side routing solution
- **Axios** — Promise-based HTTP client
- **JWT Decode** — Token parsing for authentication
- **React Context API** — Application state management
- **HeroIcons** — Beautiful UI icons

## 🏗️ Architecture

IT_tools implements a clean 3-Layer Architecture on the backend:

```
┌─────────────────────────┐
│   Presentation Layer    │
│      (Controllers)      │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│   Business Logic Layer  │
│        (Services)       │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│    Data Access Layer    │
│      (Repositories)     │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│       Database          │
│      (MongoDB)          │
└─────────────────────────┘
```

The frontend uses a component-based architecture with React, emphasizing:
- Reusable UI components
- Separation of concerns
- Centralized state management

## 📁 Project Structure

```
IT_tools/
├── src/
│   ├── main/
│   │   ├── java/com/example/it_tools/
│   │   │   ├── config/             # Configuration classes
│   │   │   ├── controller/         # REST controllers
│   │   │   ├── model/              # Entity classes
│   │   │   ├── repository/         # Data access layer
│   │   │   ├── security/           # Security configuration and JWT
│   │   │   ├── service/            # Business logic
│   │   │   └── ItToolsApplication.java # Main class
│   │   └── resources/
│   │       ├── application.properties # Application configuration
│   │       └── static/            # Static resources
│   └── test/                    # Unit tests
│
└── frontend/
    ├── public/                  # Public assets
    ├── src/
    │   ├── components/          # Reusable UI components
    │   │   └── tools/           # Tool implementations
    │   ├── context/             # React context providers
    │   ├── pages/               # Page components
    │   ├── services/            # API services
    │   ├── App.jsx              # Root component
    │   └── main.jsx             # Entry point
    ├── package.json             # NPM dependencies
    └── vite.config.js           # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Java JDK 21
- Node.js 16+ and npm 8+
- Maven 3.6+
- MongoDB Atlas Account

### Backend Setup

1. **Clone the repository:**

```bash
git clone <repository-url>
cd IT_tools
```

2. **Create a `.env` file in the project root with the following variables:**

```properties
# MongoDB configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=it_tools

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000

# GitHub OAuth (if applicable)
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_REDIRECT_URI=http://localhost:8080/auth/github/callback
```

3. **Build and run the backend:**

```bash
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The development server will start on `http://localhost:5173`.

## 📝 API Documentation

API documentation is automatically generated using SpringDoc OpenAPI and can be accessed at:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Spec: `http://localhost:8080/v3/api-docs`

## 👥 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Plugin Development

To create your own tool plugin, add a new `.jsx` file in the appropriate category directory under `frontend/src/components/tools/`. Each tool must include the following metadata at the beginning of the file:

```jsx
export const toolMeta = {
  id: 'unique-tool-id',           // Unique identifier (kebab-case)
  name: 'Your Tool Name',         // Display name
  description: 'Brief description of what your tool does',
  category: 'your-category',      // Must match directory name
  path: '/tools/your-category/unique-tool-id', // Must match pattern
  icon: ArrowsRightLeftIcon,      // Icon from HeroIcons or any incon that you prefer
  order: 1,                       // Display order within category (1-based)
};
```

## 📄 License

This project is a student project trying to clone the original https://github.com/CorentinTh/it-tools

---

<div align="center">
  <p>Made with ❤️ by the IT_tools Team</p>
  <p>
    <a href="https://github.com/yourusername/IT_tools/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/IT_tools/issues">Request Feature</a>
  </p>
</div>
