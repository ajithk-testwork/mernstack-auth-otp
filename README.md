UserVault: Secure MERN Authentication & Notes Manager

A high-performance, full-stack MERN application designed for secure personal note management. This platform features a robust JWT-based authentication system, ensuring that every user has a private, encrypted workspace to manage their digital thoughts with full CRUD functionality.


✨ Features
🔐 Authentication & Security :-

Secure Onboarding: User registration and login powered by JWT (JSON Web Token) for stateless authorization.

Password Safety: Industry-standard password hashing using bcryptjs.

Session Management: Secure logout functionality and client-side token handling via localStorage.

Protected Access: Custom middleware and React Router guards prevent unauthorized access to private data.


📝 Personal Notes Management:-

Full CRUD Lifecycle: Create, Read, Update, and Delete notes with a real-time responsive interface.

Data Isolation: Notes are strictly user-specific; users can only interact with their own data.

Polished UX: Optimized with Tailwind CSS for a clean, professional dashboard aesthetic.


👤 Profile Management:-

Account Oversight: View and manage profile details via secure, token-authorized endpoints.

Verified Sessions: Profile access is restricted to authenticated users only.


🛠️ Tech Stack Frontend :-

Core: React.js & Vite

Styling: Tailwind CSS

Routing: React Router DOM

API Client: Axios


Backend :-

Server: Node.js & Express.js

Database: MongoDB & Mongoose

Security: JWT & bcryptjs


🔐 Authentication Flow :-

Registration: User signs up; the password is hashed before being stored in MongoDB.

Login: On successful credential verification, a unique JWT is generated.

Client Storage: The token is stored in the browser's localStorage for session persistence.

Authorized Requests: The token is automatically attached to the Authorization header for all API calls.

Middleware Validation: The backend validates the token on every protected route to ensure authorized access.
