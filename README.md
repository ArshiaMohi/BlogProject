# 📝 BlogProject

### A Modern Blog Management System Built with Spring Boot

A full-stack blog management web application developed with **Java, Spring Boot, Spring Security, Thymeleaf, and PostgreSQL**. The project provides an organized platform for publishing and managing posts, organizing content with categories and tags, handling comments, and controlling administrative operations through a dedicated admin panel.

The application focuses on clean layered architecture, role-based access control, database relationships, server-side rendering, and a responsive user interface.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [User Roles](#-user-roles)
- [Application Pages](#-application-pages)
- [Database and Data Management](#-database-and-data-management)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🌟 Overview

BlogProject is a web-based blogging platform designed to demonstrate the development of a structured Java web application using the Spring ecosystem.

The application brings together content creation, post organization, comment management, user authentication, and administrative moderation in one system.

Its main goals are to:

- Provide an organized environment for creating and browsing blog posts.
- Manage categories and tags to improve content organization.
- Support user registration and authentication.
- Separate regular user capabilities from administrative operations.
- Support moderation workflows for posts and comments.
- Apply a layered architecture that separates controllers, services, and data access.

---

## ✨ Features

### 👤 User Management

- User registration and authentication.
- Password encoding using BCrypt.
- Role-based authorization for protected operations.
- User activation and deactivation through administrative functionality.
- User management operations restricted to authorized administrators.

### 📰 Blog Post Management

- Create blog posts with text content and an optional image.
- Browse published posts.
- View individual post details.
- Search posts by title.
- Organize posts using categories and tags.
- Support post publishing and unpublishing through administrative operations.
- Use soft deletion where implemented by the application.

### 🏷️ Categories and Tags

- Create and manage categories.
- Create and manage tags.
- Associate blog content with categories and tags.
- Filter published posts by tag.
- Keep content organized and easier to discover.

### 💬 Comment System

- Submit comments on blog posts.
- Display approved comments.
- Moderate comments through the administrative interface.
- Approve, reject, or remove comments through authorized administrative operations.

### 🛡️ Administrative Dashboard

- Access a dedicated administration area.
- Manage users.
- Manage blog posts and their publishing status.
- Review and moderate comments.
- Manage content-related resources.

### 🎨 Web Interface

- Server-rendered pages using Thymeleaf.
- Dedicated login and registration pages.
- Home page with blog post listings.
- Individual post detail pages.
- Post creation page.
- Category and tag navigation.
- Administrative dashboard and content management pages.
- Custom CSS styling and reusable page layouts.

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Java | Main programming language |
| Spring Boot | Application framework |
| Spring MVC | HTTP requests and controller handling |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Data access and repository operations |
| Hibernate / JPA | Object-relational mapping |
| PostgreSQL | Relational database |
| Thymeleaf | Server-side HTML rendering |
| HTML5 | Page structure |
| CSS3 | Styling and visual design |
| Maven | Dependency management and build automation |
| IntelliJ IDEA | Development environment |

---

## 🏗️ Architecture

The project follows a layered architecture to separate application responsibilities.

```text
┌──────────────────────────────────────┐
│          Presentation Layer          │
│       Thymeleaf + Web Pages          │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│           Controller Layer           │
│   Page and REST-style Controllers    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│             Service Layer            │
│       Interfaces + Implementations   │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│           Repository Layer           │
│        Spring Data JPA               │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│             PostgreSQL               │
└──────────────────────────────────────┘
```

### Architectural Principles

- **Separation of concerns:** Each layer has a clearly defined responsibility.
- **Service interfaces and implementations:** Business logic is separated from controller logic.
- **Repository-based data access:** Database operations are handled through Spring Data JPA repositories.
- **DTO-based data transfer:** Data Transfer Objects are used where defined by the application.
- **Dependency injection:** Spring manages application components and their dependencies.
- **Centralized security configuration:** Access rules are configured through Spring Security.

---

## 🔐 User Roles

The application distinguishes between regular users and administrators.

| Capability | Authenticated User | Administrator |
|---|:---:|:---:|
| Access protected pages | ✓ | ✓ |
| Create blog posts | ✓ | ✓ |
| Submit comments | ✓ | ✓ |
| Manage users | — | ✓ |
| Manage categories and tags | — | ✓ |
| Moderate comments | — | ✓ |
| Manage publishing status | — | ✓ |
| Access administrative pages | — | ✓ |

*The table describes the intended authorization model. Actual permissions depend on the application's security configuration and controller mappings.*

---

## 🖥️ Application Pages

The application includes the following web pages:

| Page | Description |
|---|---|
| Home | Browse available published blog posts |
| Login | Authenticate an existing user |
| Registration | Create a new user account |
| Post Details | Read a post and interact with its comment section |
| Create Post | Submit a new blog post |
| Category and Tag Views | Explore organized blog content |
| Admin Dashboard | Access administrative tools |
| Content Management | Manage posts and review content |
| User Management | Manage registered accounts |
| Comment Management | Review and moderate comments |

### 📸 Screenshots

Screenshots of the application will be added here.

<!-- Add screenshots after uploading them to a repository folder such as docs/images/. -->

<!-- Example:
![Home Page](docs/images/home.png)
![Login Page](docs/images/login.png)
![Admin Dashboard](docs/images/admin-dashboard.png)
-->

---

## 🗄️ Database and Data Management

BlogProject uses PostgreSQL as its relational database.

The database layer is responsible for storing and managing application data, including:

- User accounts and roles.
- Blog posts and their associated content.
- Categories and tags.
- Comments and moderation status.
- Relationships between related entities.

The application uses JPA entity mappings to represent relationships between domain objects and database tables.

Where implemented, soft deletion preserves records instead of immediately removing them from the database.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites

Make sure the following tools are installed:

- **Java Development Kit (JDK):** Use the Java version configured for the project.
- **Maven:** Or use the Maven Wrapper if it is included in the repository.
- **PostgreSQL:** A running PostgreSQL server.
- **Git:** To clone the repository.
- **IntelliJ IDEA or another Java IDE:** Recommended for development.

### 1. Clone the Repository

```bash
git clone https://github.com/ArshiaMohi/BlogProject.git
cd BlogProject
```

> If the repository name or its directory differs, replace `BlogProject` with the actual repository name.

### 2. Create the Database

Create a PostgreSQL database for the application.

```sql
CREATE DATABASE blog_db;
```

If the application is configured to use a different database name, use the name specified in its configuration.

### 3. Configure Database Access

Open the application's configuration file and configure the PostgreSQL connection.

The configuration file is typically located at:

```text
src/main/resources/application.properties
```

Set the appropriate database URL, username, and password for your local environment.

See the [Configuration](#-configuration) section below.

### 4. Build the Project

If Maven is installed:

```bash
mvn clean package
```

If the repository includes the Maven Wrapper, use the appropriate wrapper command for your operating system.

### 5. Start the Application

Run the application from your IDE, or use Maven:

```bash
mvn spring-boot:run
```

Once the application starts successfully, open the local URL configured for the application in your browser.

The default Spring Boot HTTP port is `8080`, unless configured otherwise.

---

## ⚙️ Configuration

Before running the project, configure the database connection in `application.properties` or the configuration mechanism used by the application.

A typical PostgreSQL configuration looks like this:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

The environment variables shown above are examples. Configure them in your local environment, or use the configuration approach supported by your project.

**Important:**

- Never commit real database passwords or other secrets.
- Do not publish private credentials in screenshots or documentation.
- Verify the project's actual JPA schema-generation settings before running it against an existing database.
- Use the database settings expected by the current source code.

---

## ▶️ Running the Application

After configuring PostgreSQL and starting Spring Boot:

1. Confirm that the application starts without errors.
2. Open the application's local URL in your browser.
3. Register a user account if registration is enabled.
4. Sign in using the registered account.
5. Explore the available blog features.
6. Use an authorized administrator account to access administrative functionality.

Administrative access depends on the roles and accounts configured in the application.

---

## 🛡️ Security

The project uses Spring Security to handle authentication and authorization.

Security-related functionality includes:

- Password encoding with BCrypt.
- Form-based login.
- Role-based restrictions for administrative operations.
- Authentication requirements for protected requests.
- Public access to registration and login pages, as configured.

**Development note:** Review the CSRF configuration and all authorization rules before deploying the application outside a controlled development or educational environment. Never expose a development database or administrative credentials publicly.

---

## 📁 Project Structure

The application is organized into packages according to their responsibilities.

```text
BlogProject/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/arshia/blogproject/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       └── service/
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   ├── js/
│           │   └── images/
│           ├── templates/
│           └── application.properties
├── pom.xml
└── README.md
```

*This is a conceptual overview of the expected structure. The actual directories and class names may differ slightly in the repository.*

---

## 🔮 Future Improvements

Potential improvements for future versions include:

- Automated unit and integration tests.
- Pagination and more advanced search functionality.
- Improved validation and error handling.
- Stronger production-ready security configuration.
- Environment-specific configuration profiles.
- API documentation.
- Automated build verification through GitHub Actions.
- Additional accessibility and responsive-design improvements.

These items are possible future enhancements and are not necessarily implemented in the current version.

---

## 👨‍💻 Author

**Arshia Mohi**

GitHub: [@ArshiaMohi](https://github.com/ArshiaMohi)

---

## 📄 License

This project was developed for educational purposes.

No license has been specified unless a license file is added to the repository.
