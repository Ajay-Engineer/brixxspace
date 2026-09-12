# BrixxSpace (Pinnacle Build CMS) — Complete Project Documentation

---

## 1. Project Overview & Brand Identity

**BrixxSpace** (formerly *Pinnacle Build CMS*) is a full-stack, enterprise-grade Construction, Infrastructure, and Real Estate Management Platform. Designed for modern construction firms, architectural studios, and infrastructure developers, the platform provides a public-facing digital experience, an interactive **Client Portal** for live construction progress tracking, and a comprehensive **Admin CMS & CRM** backend.

### Key Objectives
- **Showcase Architectural Excellence**: Present deep case studies, episodes/walkthrough videos, technical drawings, and material specifications.
- **Client Transparency**: Provide clients with a dedicated portal to monitor ongoing project stages, progress percentages, document repositories, and milestone timelines.
- **Unified Management (CMS & CRM)**: Enable administrators to manage services, construction packages, workers/subcontractors, inbound leads, property listings, blog articles, and hero promotions through a centralized dashboard.

---

## 2. Technology Stack & Architecture

```
                                  +---------------------------------------+
                                  |            Client Browser             |
                                  |    (React 18 + Vite + Tailwind CSS)   |
                                  +-------------------+-------------------+
                                                      |
                                          HTTP / REST / Axios
                                     (JWT Cookies & Bearer Tokens)
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |            Express.js API             |
                                  |     (Port 5001 / Serverless Entry)    |
                                  +---------+-------------------+---------+
                                            |                   |
                                            v                   v
                    +-------------------------------+   +-------------------------------+
                    |        MongoDB Atlas          |   |   External Services / APIs    |
                    |   (Mongoose ODM Schemas)      |   |   - Cloudinary (Media Store)  |
                    +-------------------------------+   |   - Nodemailer (SMTP OTP)     |
                                                        +-------------------------------+
```

### Frontend
- **Framework & Core**: React 18 with TypeScript, bundled using Vite.
- **Styling & UI Components**: Tailwind CSS, Shadcn UI (Radix UI primitives), Lucide React Icons.
- **Animation & Transitions**: Framer Motion for scroll reveals, transitions, and micro-interactions.
- **State & Data Fetching**: `@tanstack/react-query` (React Query) for server state caching and optimistic updates.
- **Forms & Validation**: `react-hook-form` with `zod` schema resolvers.
- **Routing & Meta**: `react-router-dom` v6 for client-side routing, `react-helmet-async` for SEO metadata management.
- **Notifications**: `sonner` and Radix `Toaster` for toast notifications.

### Backend
- **Runtime & Framework**: Node.js with Express.js.
- **Database & ODM**: MongoDB with Mongoose ODM.
- **Authentication**: JWT (JSON Web Tokens) with dual support for HTTP-Only secure cookies (`res.cookie('jwt')`) and standard `Authorization: Bearer` headers.
- **Security & Utilities**: `helmet` (HTTP headers security), `cors` (multi-origin regex validation), `bcryptjs` (password hashing), `cookie-parser`, `morgan` (HTTP request logging).
- **Communication & Mailing**: `nodemailer` with custom SMTP transport for OTP verification and transactional notifications.
- **File & Media Handling**: `multer` with Cloudinary CDN integration for high-resolution image uploads.

---

## 3. System Architecture & Directory Structure

```
pinnacle-build-cms/
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js           # Login, Register, Profile, Password Reset
│   │   ├── otpController.js            # OTP generation and email dispatch
│   │   ├── projectController.js        # Project CRUD, filtering, categories
│   │   ├── projectCategoryController.js
│   │   ├── projectSubcategoryController.js
│   │   ├── serviceController.js        # Services CRUD
│   │   ├── serviceCategoryController.js
│   │   ├── serviceSubcategoryController.js
│   │   ├── propertyController.js       # Real estate listings
│   │   ├── packageController.js        # Construction packages
│   │   ├── workerController.js         # Workforce & subcontractor directory
│   │   ├── contactController.js        # Inbound contact leads & inquiries
│   │   ├── blogController.js           # Articles and content publishing
│   │   ├── testimonialController.js    # Client reviews & testimonials
│   │   ├── sliderImageController.js    # Hero carousel banners
│   │   ├── promotionController.js      # Promotional campaigns
│   │   └── userProjectController.js    # Client-specific project associations
│   ├── middleware/
│   │   ├── authMiddleware.js           # Token verification & admin role guard
│   │   └── errorMiddleware.js          # Global error handling and formatting
│   ├── models/                         # Mongoose Data Models
│   │   ├── User.js
│   │   ├── Otp.js
│   │   ├── Project.js
│   │   ├── ProjectCategory.js
│   │   ├── ProjectSubcategory.js
│   │   ├── Service.js
│   │   ├── ServiceCategory.js
│   │   ├── ServiceSubcategory.js
│   │   ├── Property.js
│   │   ├── Package.js
│   │   ├── Worker.js
│   │   ├── Blog.js
│   │   ├── Contact.js
│   │   ├── Testimonial.js
│   │   ├── SliderImage.js
│   │   ├── Promotion.js
│   │   └── UserProject.js
│   ├── routes/                         # Express Route Definitions
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── ...
│   ├── utils/
│   │   ├── email.js                    # Nodemailer SMTP transporter setup
│   │   └── createAdmin.js              # Script to bootstrap initial admin account
│   ├── server.js                       # Express app bootstrap & port binding
│   └── package.json
│
├── src/
│   ├── components/                     # Reusable UI & Layout Components
│   │   ├── ui/                         # Shadcn UI primitives (Button, Dialog, etc.)
│   │   ├── Navbar.tsx                  # Global navigation bar with auth state
│   │   ├── Footer.tsx                  # Global footer with links and company info
│   │   ├── AdminLayout.tsx             # Sidebar navigation for admin console
│   │   ├── ProjectCard.tsx             # Card component for project listings
│   │   └── ScrollToTop.tsx             # Automatic scroll reset on route changes
│   ├── contexts/
│   │   └── AuthContext.tsx             # Global Auth Provider (User, Login, Signup, Logout)
│   ├── lib/
│   │   ├── api.ts                      # Axios instance with interceptors and credentials
│   │   ├── cloudinary.ts               # Cloudinary upload helpers
│   │   └── utils.ts                    # Tailwind class merger utilities
│   ├── pages/
│   │   ├── Index.tsx                   # Homepage (Hero, Featured, About preview)
│   │   ├── About.tsx                   # Company Story, Vision, Leadership
│   │   ├── Services.tsx                # High-level services list
│   │   ├── ServiceCategoryDetail.tsx   # Service Category drilldown
│   │   ├── ServiceSubcategoryDetail.tsx# Service Subcategory deep dive
│   │   ├── Projects.tsx                # Portfolio grid with filters
│   │   ├── ProjectDetail.tsx           # In-depth architectural case study
│   │   ├── Properties.tsx              # Property listings & real estate
│   │   ├── PropertyDetail.tsx          # Property specs, blueprints, inquiries
│   │   ├── PackageDetail.tsx           # Construction package details & pricing
│   │   ├── Blog.tsx                    # Articles directory
│   │   ├── BlogPost.tsx                # Individual article reader
│   │   ├── Contact.tsx                 # Inquiry form & consultation scheduler
│   │   ├── Auth.tsx                    # Sign In / Sign Up with OTP verification
│   │   ├── Dashboard.tsx               # Client Dashboard (Track personal projects)
│   │   ├── Profile.tsx                 # User profile settings
│   │   ├── Interests.tsx               # Client shortlisted properties/projects
│   │   └── admin/                      # Admin Backoffice Pages
│   │       ├── AdminDashboard.tsx      # Metrics summary & overview
│   │       ├── AdminProjects.tsx       # Manage projects, episodes, specs
│   │       ├── AdminProjectCategories.tsx
│   │       ├── AdminProjectSubcategories.tsx
│   │       ├── AdminServices.tsx
│   │       ├── AdminServiceCategories.tsx
│   │       ├── AdminServiceSubcategories.tsx
│   │       ├── AdminProperties.tsx     # Property listings management
│   │       ├── AdminPackages.tsx       # Construction packages management
│   │       ├── AdminContacts.tsx       # Inbound lead & CRM pipeline
│   │       ├── AdminWorkers.tsx        # Contractor & worker management
│   │       ├── AdminBlogs.tsx          # Blog publisher
│   │       ├── AdminTestimonials.tsx   # Reviews management
│   │       ├── AdminSliderImages.tsx   # Hero carousel manager
│   │       ├── AdminPromotions.tsx     # Banners & promotional offers
│   │       └── AdminProjectInterests.tsx
│   ├── App.tsx                         # Main Router and React Query provider
│   └── main.tsx                        # Application mount
├── package.json
└── vite.config.ts
```

---

## 4. Core Features & Functional Modules

### 4.1. Authentication & Security
- **Email + OTP Verification**: New user registrations require a 6-digit one-time password sent via Nodemailer SMTP to prevent spam.
- **Role-Based Access Control (RBAC)**:
  - `admin`: Full read/write access to all CMS modules, CRM inquiries, workers, and project assignments.
  - `user`: Access to personal profile, saved interests, and the Client Tracking Dashboard.
- **Dual Authentication Support**:
  - Secure, HTTP-Only Cookie (`jwt`) for seamless web sessions.
  - Authorization Bearer Header via Axios Interceptor (`src/lib/api.ts`) for mobile/cross-origin requests.
- **Password Reset Flow**: Secure tokenless OTP verification to change forgotten passwords.

### 4.2. Deep Architectural Case Studies (Project Module)
- **Episodes & Video Walkthroughs**: Support for multi-part video series (YouTube/Vimeo) embedded per project.
- **E-Book & Architectural Drawings**: Downloadable blueprints, specification sheets, and project brochures.
- **Product & Material Specifications**: Categorized materials used (flooring, sanitaryware, structural steel, paint, fixtures).
- **Design Team & Credits**: Principal architects, structural consultants, cinematographers, and contractors.
- **Technical Specs**: Plot area, facing (Vastu compliance), number of rooms, floors, and parking capacities.

### 4.3. Client Tracking Portal (`/dashboard`)
- **Real-Time Progress Meter**: Visual progress bar indicating project stage completion (0% - 100%).
- **Status Badges**: `ongoing`, `completed`, `upcoming`.
- **Document Repository**: Access to contracts, approval permits, structural plans, and milestone sign-offs.
- **Direct Support Connection**: Quick contact to assigned project managers.

### 4.4. Service & Package Hierarchies
- **Two-Tier Service Structure**: `ServiceCategory` (e.g., Turnkey Construction, Interior Architecture) $\rightarrow$ `ServiceSubcategory` (e.g., Villa Construction, Modular Kitchens).
- **Construction Packages**: Tiered turnkey solutions (Basic, Standard, Premium, Luxury) with per-square-foot cost breakdowns, material specifications, and deliverables.

### 4.5. Admin CMS & CRM Backoffice
- **Lead Pipeline**: View contact form submissions, consultation requests, and project inquiries with status tracking.
- **Workforce Management**: Directory of workers, contractors, skillsets, and active assignments.
- **Content Studio**: Markdown-enabled blog manager, image sliders, promotional banners, and client testimonials.

---

## 5. Database Schema & Data Models

| Model | Key Fields | Description |
| :--- | :--- | :--- |
| **`User`** | `fullName`, `email`, `password`, `phone`, `role` (`user`/`admin`), `company`, `avatarUrl` | User accounts and admin profiles with bcrypt encryption. |
| **`Otp`** | `email`, `otp`, `createdAt` (TTL 10 min) | Temporary stores for 6-digit verification codes. |
| **`Project`** | `title`, `description`, `category`, `status`, `progress`, `gallery`, `episodes`, `ebook`, `products`, `team`, `extended_info` | Comprehensive project portfolio entries. |
| **`ProjectCategory`** / **`ProjectSubcategory`** | `name`, `slug`, `description`, `image_url` | Hierarchical taxonomy for architectural projects. |
| **`Service`** | `title`, `description`, `icon`, `category`, `features` | Company services and specialties. |
| **`ServiceCategory`** / **`ServiceSubcategory`** | `name`, `slug`, `heroImage`, `features`, `benefits`, `process`, `faqs`, `gallery` | Rich structured content for services. |
| **`Property`** | `title`, `description`, `price`, `location`, `property_type`, `area`, `bedrooms`, `bathrooms`, `status`, `images` | Real estate listings for sale or rent. |
| **`Package`** | `name`, `price`, `description`, `features`, `specifications`, `is_popular` | Pre-defined construction packages. |
| **`Worker`** | `name`, `role`, `phone`, `email`, `skills`, `experience_years`, `daily_rate`, `status` | Contractor and internal workforce roster. |
| **`Contact`** | `name`, `email`, `phone`, `subject`, `message`, `status` (`new`, `contacted`, `resolved`) | CRM contact leads and client requests. |
| **`Blog`** | `title`, `slug`, `content`, `excerpt`, `cover_image`, `category`, `author`, `published` | News and technical construction articles. |
| **`Testimonial`** | `name`, `designation`, `company`, `content`, `rating`, `avatar_url` | Verified client reviews. |
| **`SliderImage`** | `title`, `subtitle`, `image_url`, `link`, `order`, `active` | Homepage carousel banners. |
| **`Promotion`** | `title`, `description`, `code`, `discount_percent`, `valid_until`, `active` | Marketing promotions and campaign codes. |
| **`UserProject`** | `user_id`, `project_id`, `access_level` | Mapping linking client user accounts to specific projects. |

---

## 6. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (requires valid email OTP).
- `POST /api/auth/login` — Authenticate user and issue JWT cookie/token.
- `GET /api/auth/me` — Fetch currently authenticated user profile (Private).
- `PUT /api/auth/profile` — Update user profile details (Private).
- `POST /api/auth/logout` — Invalidate JWT cookie.
- `POST /api/auth/send-otp` — Generate and email 6-digit OTP code.
- `POST /api/auth/verify-otp` — Validate OTP code.
- `POST /api/auth/reset-password` — Reset password after OTP validation.

### Projects & Portfolios (`/api/projects`)
- `GET /api/projects` — List all projects (supports query filters for status, category, featured).
- `GET /api/projects/:id` — Get single project details with populated categories and subcategories.
- `POST /api/projects` — Create new project (Admin only).
- `PUT /api/projects/:id` — Update project details (Admin only).
- `DELETE /api/projects/:id` — Remove project (Admin only).

### Services & Subcategories (`/api/services`, `/api/service-subcategories`)
- `GET /api/services` — List all primary services.
- `GET /api/service-categories` — Fetch all service categories.
- `GET /api/service-subcategories` — Fetch all subcategories.
- `GET /api/service-subcategories/:slug` — Fetch deep content (process, benefits, FAQs) by slug.

### Properties & Real Estate (`/api/properties`)
- `GET /api/properties` — List available property listings.
- `GET /api/properties/:id` — Retrieve property specs and gallery.
- `POST /api/properties` — Create property listing (Admin only).
- `PUT /api/properties/:id` — Update property (Admin only).
- `DELETE /api/properties/:id` — Delete property (Admin only).

### CRM & Contact Inquiries (`/api/contacts`)
- `POST /api/contacts` — Submit contact/consultation form.
- `GET /api/contacts` — List all leads and messages (Admin only).
- `PUT /api/contacts/:id` — Update lead status (`new`, `in-progress`, `closed`) (Admin only).

---

## 7. Environment Configuration & Setup Guide

### 7.1. Prerequisites
- **Node.js**: Version `18.x` or higher
- **MongoDB**: MongoDB Atlas URI or local instance
- **SMTP Server**: Gmail App Password or custom SMTP host (e.g., Hostinger, SendGrid)
- **Cloudinary Account**: For image and file asset hosting

### 7.2. Backend Environment Variables (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/brixxspace?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here

# SMTP Configuration for OTP & Inquiries
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
EMAIL_FROM="BrixxSpace" <your_email@domain.com>
```

### 7.3. Frontend Environment Variables (`.env`)
```env
VITE_API_URL=http://localhost:5001/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 7.4. Running the Application Locally

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will listen on `http://localhost:5001`.*

2. **Start the Frontend Client**:
   ```bash
   # From the root directory:
   npm install
   npm run dev
   ```
   *The frontend Vite dev server will start on `http://localhost:8080` (or `http://localhost:5173`).*

3. **Bootstrap Admin User (Optional)**:
   ```bash
   cd backend
   node utils/createAdmin.js
   ```
   *(Default admin credentials can be configured in `backend/createAdmin.js`)*

---

## 8. Deployment Architecture

- **Frontend**: Hosted on **Firebase Hosting** / **Vercel** with SPA rewrites (`"rewrites": [ { "source": "**", "destination": "/index.html" } ]`).
- **Backend API**: Hosted on **Render** (Node Web Service) or **Vercel Serverless Functions** (using `backend/vercel.json` and exported `app`).
- **Database**: **MongoDB Atlas** with IP whitelisting.
- **Media**: **Cloudinary** for auto-optimized images and documents.

---
*Documentation compiled for BrixxSpace Engineering & Operations Team.*
