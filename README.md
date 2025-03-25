# Movies Management APIs

## 📝 Description
A RESTful API service built with NestJS for managing movie data. This application integrates with the Star Wars API (SWAPI) to automatically sync movie information and provides secure endpoints for movie management with JWT authentication.

### Key Features
- 🔐 Secure authentication and role-based authorization
- 🎬 Automated movie synchronization with SWAPI
- 📊 CRUD operations for movie management
- 🔄 Real-time data updates
- 📚 Comprehensive API documentation with Swagger
- ✅ Extensive test coverage
- 🐳 Docker containerization for easy deployment

### Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## 🔧 Requirements
- Docker
- Docker Compose

## 🚀 Installation and Execution

### 🐳 With Docker (Recommended)
1. Start services:
```bash
docker compose up --build -d
```

This will start:
- 🌐 API at http://localhost:3000
- 🗄️ PostgreSQL database on port 5432

2. To stop services:
```bash
docker compose down
```

### 💻 Manually
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Start the application:
```bash
npm run start:dev
```

### 🧪 Run unit and integration tests
```bash
npm run test
```

## 🔍 Testing with Swagger

To test the endpoints, use swagger at:
```bash
http://localhost:3000/api
```

## 📁 Project Structure

```
src/
├── entity/              # Base module for entities
│   ├── application/     # Application layer
│   │   ├── facades/     # Facades
│   │   ├── services/    # Services
│   │   └── crons/       # Scheduled tasks
│   ├── domain/          # Domain layer
│   │   ├── entities/    # Entities
│   │   ├── errors/      # Custom errors
│   │   ├── enums/       # Enumerations
│   │   ├── interfaces/  # Domain interfaces
│   │   └── repositories/# Repository contracts
│   └── infrastructure/  # Infrastructure layer
│       ├── controllers/ # Controllers
│       ├── dtos/        # Data Transfer Objects
│       ├── guards/      # Route protection guards
│       ├── mock-data/   # Test data
│       ├── repositories/# Repository implementations
│       └── strategies/  # Implementation strategies
│
├── common/              # Shared elements
│   ├── decorators/      # Decorators
│   └── interceptors/    # Interceptors
│
├── prisma/              # Database configuration
│   ├── migrations/      # Database migrations
│   └── schema.prisma    # Database schema
│
├── utils/               # Shared utilities
│
└── test/                # Tests
    ├── controllers/     # Controller tests
    ├── services/        # Service tests
    ├── facades/         # Facade tests
    ├── strategies/      # Strategy tests
    └── crons/           # Scheduled task tests
```

### 🗂️ Entity Description

- **🔐 auth/**: User authentication and authorization management
- **🎬 movies/**: Movie management business logic

## 🎯 Design Approach

### 📐 Clean Architecture

The project follows Clean Architecture principles, organized in concentric layers:

#### 🎯 Domain Layer (Core)
- Contains business logic and rules
- Defines entities and repository interfaces
- Independent of external frameworks
- Contains business error definitions (MovieNotFoundError, UnauthorizedError)
- Defines core business types and enums (Role, Movie)

#### 💼 Application Layer
- Orchestrates use cases
- Implements business workflows
- Contains services and facades
- Depends only on domain layer
- Handles business operations

#### 🔌 Infrastructure Layer
- Implements technical details and adapters
- Contains NestJS-specific implementations (controllers, guards)
- Contains database implementations (Prisma repositories)
- Manages external services integration (SWAPI)
- Handles HTTP/REST components and DTOs

#### Key Benefits
- 🎯 **Independent of Frameworks**: Core business logic doesn't depend on external libraries
- 🔄 **Testable**: Easy to test due to clear separation of concerns
- 🛠️ **Independent of UI**: Business rules don't depend on interface
- 📊 **Independent of Database**: Business logic doesn't depend on specific database
- 🔍 **Independent of External Services**: Core business rules are isolated from external services

This architecture ensures that business rules can be tested without UI, database, web server, or any external element.

### 🔄 Domain-Driven Design (DDD) Principles

- **Ubiquitous Language**: Using consistent business terminology across code and documentation (e.g., Movie, User, Role)

- **Bounded Contexts**: Large-scale separation of the application into distinct domains - auth handles user management while movies handles film-related operations

- **Entities & Value Objects**: Domain entities (Movie, User) with unique identifiers and lifecycle, complemented by immutable DTOs for data transfer

- **Aggregate Roots**: Movie entity designed as an aggregate root, prepared for future related entities (like reviews or ratings) while maintaining data consistency

- **Repository Pattern**: Abstract data access through domain-oriented repository interfaces, maintaining persistence ignorance in the domain layer

### 🛡️ Security-First Approach
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained authorization with user roles
- **Input Validation**: DTO-based request validation
- **Error Handling**: Structured error responses and domain exceptions
- **Environment Security**: Secure configuration management

### 🧪 Testing Strategy
- **Unit Tests**: Testing business logic in isolation
- **Integration Tests**: Testing component interactions
- **Repository Tests**: Database operation testing
- **Mock Implementations**: Test doubles for external dependencies
- **Continuous Testing**: Automated tests in CI pipeline

### 🔌 API Design
- **RESTful Principles**: Resource-oriented endpoints
- **OpenAPI/Swagger**: Comprehensive API documentation
- **DTO Validation**: Request/Response data validation
- **Consistent Responses**: Standardized API responses
- **Error Handling**: Detailed error messages and codes


