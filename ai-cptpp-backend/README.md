# Project Management Platform Backend

A production-ready backend for a Project Management Platform built with Node.js, Express.js, PostgreSQL, and Prisma.

## Features

- **Authentication & Authorization**: JWT-based authentication with access and refresh tokens
- **Role-based Access Control**: Three user roles (ADMIN, PROJECT_MANAGER, CLIENT)
- **Project Management**: Create, update, and manage projects with team assignments
- **Invoice Management**: Handle project invoices with payment tracking
- **Communication System**: Messaging between users and clients
- **Clean Architecture**: Well-structured codebase following clean architecture principles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Environment Config**: dotenv

## Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # Route definitions
├── services/       # Business logic
├── middleware/     # Express middleware
├── validators/     # Zod validation schemas
├── utils/          # Utility functions
├── config/         # Configuration files
├── prisma/         # Database schema
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

4. Set up the database:

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed the database
   npm run prisma:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Projects

- `GET /projects` - Get all projects (filtered by role)
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create project (Admin/PM)
- `PATCH /projects/:id` - Update project (Admin/PM)
- `DELETE /projects/:id` - Delete project (Admin)

### Team Members

- `GET /projects/:projectId/members` - Get team members
- `POST /projects/:projectId/members` - Add team member (Admin/PM)
- `DELETE /projects/:projectId/members/:userId` - Remove team member (Admin/PM)

### Invoices

- `GET /invoices` - Get all invoices (filtered by role)
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create invoice (Admin/PM)
- `PATCH /invoices/:id` - Update invoice (Admin/PM)
- `PATCH /invoices/:id/pay` - Pay invoice (Client)

### Communications

- `GET /communications` - Get all communications
- `GET /communications/:id` - Get communication by ID
- `POST /communications` - Send message
- `PATCH /communications/:id/read` - Mark as read
- `DELETE /communications/:id` - Delete message

## Authorization Rules

### ADMIN

- Full access to all resources
- Can manage users, projects, invoices

### PROJECT_MANAGER

- Can create and manage projects they are assigned to
- Can add team members to projects
- Can communicate with clients
- Can view invoices for their projects

### CLIENT

- Can view their own projects
- Can view invoices related to their projects
- Can send and receive messages

## Database Schema

The application uses the following main entities:

- Users (with roles)
- Projects
- Team Members
- Invoices
- Communications
- Refresh Tokens

See `prisma/schema.prisma` for the complete schema definition.

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm test` - Run tests

### Environment Variables

See `.env.example` for required environment variables.

## License

ISC
