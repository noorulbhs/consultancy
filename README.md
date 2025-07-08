# IT Consultancy - Full Stack Angular Application

A comprehensive IT consultancy platform built with Angular 18, featuring a modern public website and a powerful admin dashboard for content management.

## 🚀 Live Demo

- **Public Website:** [http://localhost:4200](http://localhost:4200)
- **Admin Dashboard:** [http://localhost:4200/admin](http://localhost:4200/admin)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🌐 Public Website

#### **Home Page**
- Modern hero section with call-to-action
- Services overview with interactive cards
- Featured team members showcase
- Customer testimonials carousel
- Company statistics counter
- Why choose us section
- Recent blog posts
- Contact form with validation

#### **Service Pages**
- Detailed service descriptions
- Technology stack showcases
- Case studies and portfolios
- Pricing information
- Service request forms

#### **About Page**
- Company history and mission
- Team member profiles
- Company values and culture
- Office locations and contact info

#### **Blog System**
- Article listing with categories
- Search and filter functionality
- Tag-based navigation
- Reading time estimates
- Author profiles
- Social sharing integration

#### **Careers**
- Job listings with detailed descriptions
- Application forms
- Company benefits showcase
- Team culture highlights

#### **Contact**
- Contact form with validation
- Office location maps
- Multiple contact methods
- Real-time form submission

### 🔧 Admin Dashboard

#### **Dashboard Analytics**
- Real-time statistics overview
- Activity tracking and logs
- Performance metrics
- Recent activities feed
- System health monitoring
- User engagement analytics

#### **Content Management**

##### **Blog Manager**
- Create, edit, delete blog posts
- Rich text editor (Quill.js)
- Image upload and management
- Category and tag management
- SEO optimization tools
- Publishing workflow
- Draft management

##### **Job Manager**
- Post and manage job openings
- Application tracking
- Candidate management
- Job categories and locations
- Salary ranges and benefits
- Application deadline management

##### **Project Portfolio Manager**
- Showcase company projects
- Technology stack tracking
- Project status management
- Client information
- Project galleries
- Case study creation

##### **Team Manager**
- Add and manage team members
- Role and department assignment
- Skills and expertise tracking
- Social media links
- Professional bios
- Team hierarchy management

##### **Services Manager**
- Service offerings management
- Pricing and packages
- Service categories
- Feature comparisons
- Service request tracking

##### **Testimonial Manager**
- Customer review management
- Star rating system
- Client information tracking
- Review moderation
- Featured testimonials

##### **Static Page Manager**
- About page content
- Privacy policy
- Terms of service
- FAQ management
- Company information

##### **Site Settings**
- Global configuration
- Contact information
- Social media links
- SEO settings
- Email configurations
- Theme customization

##### **Enquiry Manager**
- Contact form submissions
- Lead management
- Response tracking
- Follow-up reminders
- Export functionality

#### **Authentication & Security**
- Secure admin login
- Route guards protection
- Session management
- Role-based access control
- Activity logging

#### **User Experience**
- Real-time notifications
- Form validation with loading states
- Responsive design
- Keyboard shortcuts
- Bulk operations
- Export/import functionality

## 🛠 Technology Stack

### **Frontend Framework**
- **Angular 18** - Latest Angular framework with standalone components
- **TypeScript** - Type-safe JavaScript development
- **RxJS** - Reactive programming for async operations
- **Angular Router** - Client-side routing and navigation

### **UI/UX Libraries**
- **Angular Material** - Google's Material Design components
- **Font Awesome** - Icon library
- **Bootstrap 5** - CSS framework for responsive design
- **Angular Animations** - Smooth transitions and effects

### **Form Handling**
- **Angular Reactive Forms** - Type-safe form management
- **Custom Validators** - Business logic validation
- **FormValidationService** - Centralized validation logic
- **Real-time Validation** - Instant feedback

### **Rich Text Editing**
- **Quill.js (ngx-quill)** - Rich text editor for blog posts
- **Customizable toolbar** - Tailored editing experience
- **Image upload support** - Media management

### **State Management**
- **Angular Services** - Centralized data management
- **BehaviorSubject** - Reactive state management
- **Local Storage** - Client-side data persistence

### **Notifications**
- **Custom Toast System** - User feedback notifications
- **Animation Support** - Smooth notification transitions
- **Auto-dismiss** - Automatic notification cleanup

### **Development Tools**
- **Angular CLI** - Project scaffolding and build tools
- **TSConfig** - TypeScript configuration
- **ESLint** - Code quality and style
- **Prettier** - Code formatting

### **Build & Deployment**
- **Webpack** - Module bundling
- **Angular Build Optimizer** - Production optimization
- **Tree Shaking** - Dead code elimination
- **Lazy Loading** - Performance optimization

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                           # Authentication module
│   │   ├── guards/                     # Route guards
│   │   ├── login/                      # Login components
│   │   ├── services/                   # Auth services
│   │   └── mock/                       # Mock credentials
│   │
│   ├── core/                           # Core utilities
│   │   ├── components/                 # Shared components
│   │   │   └── notification-toast/     # Toast notifications
│   │   ├── services/                   # Core services
│   │   │   ├── notification.service.ts # Notification system
│   │   │   └── form-validation.service.ts # Form validation
│   │   └── constants/                  # API endpoints
│   │
│   ├── modules/
│   │   ├── admin/                      # Admin dashboard
│   │   │   ├── dashboard/              # Admin dashboard
│   │   │   ├── layout/                 # Admin layout
│   │   │   ├── blog-manager/           # Blog management
│   │   │   ├── job-manager/            # Job management
│   │   │   ├── project-manager/        # Project management
│   │   │   ├── team-manager/           # Team management
│   │   │   ├── services-manager/       # Services management
│   │   │   ├── testimonial-manager/    # Testimonial management
│   │   │   ├── static-page-manager/    # Static pages
│   │   │   ├── site-settings/          # Site configuration
│   │   │   ├── enquiry-manager/        # Contact enquiries
│   │   │   └── services/               # Admin services
│   │   │       ├── activity-tracker.service.ts
│   │   │       ├── dashboard.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   └── public/                     # Public website
│   │       ├── home/                   # Home page
│   │       │   ├── components/         # Home components
│   │       │   │   ├── hero/
│   │       │   │   ├── navbar/
│   │       │   │   ├── footer/
│   │       │   │   ├── testimonials/
│   │       │   │   ├── stats/
│   │       │   │   └── why-choose-us/
│   │       │   └── services/           # Home services
│   │       ├── about/                  # About page
│   │       ├── services/               # Services page
│   │       ├── blog/                   # Blog page
│   │       ├── careers/                # Careers page
│   │       ├── contact/                # Contact page
│   │       └── layouts/                # Public layouts
│   │
│   ├── app.component.ts                # Root component
│   ├── app.config.ts                   # App configuration
│   └── app.routes.ts                   # Route definitions
│
├── assets/                             # Static assets
├── styles.scss                         # Global styles
└── index.html                          # Entry point
```

## 🔧 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v18 or higher)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/noorulbhs/consultancy.git
   cd consultancy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not installed)**
   ```bash
   npm install -g @angular/cli
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open the application**
   - Public Website: [http://localhost:4200](http://localhost:4200)
   - Admin Dashboard: [http://localhost:4200/admin](http://localhost:4200/admin)

### Build for Production

```bash
# Build the application
npm run build
# or
ng build --prod

# Serve the built application
npm install -g http-server
http-server dist/it-consultancy
```

## 🎯 Usage

### Public Website Access

Navigate to the different sections:
- **Home:** Main landing page with overview
- **About:** Company information and team
- **Services:** Detailed service offerings
- **Blog:** Articles and insights
- **Careers:** Job opportunities
- **Contact:** Get in touch form

### Admin Dashboard Access

1. **Login to Admin**
   - URL: [http://localhost:4200/admin](http://localhost:4200/admin)
   - Email: `admin@consultancy.com`
   - Password: `admin123`

2. **Dashboard Features**
   - View analytics and activity logs
   - Manage all content types
   - Monitor system health

3. **Content Management**
   - Use the sidebar navigation
   - Click "Add New" buttons to create content
   - Use "Validate Form" for form checking
   - Save or publish content

### Form Validation

All forms include:
- **Real-time validation** with instant feedback
- **"Validate Form" button** for comprehensive checking
- **Loading states** during validation
- **Success/error notifications** with detailed messages

## 📡 API Documentation

### Mock Data Services

The application uses mock services for demonstration:

#### **Blog Service**
```typescript
// Get all blogs
getBlogPosts(): Observable<BlogPost[]>

// Get blog by ID
getBlogById(id: number): Observable<BlogPost>

// Create new blog
addBlog(blog: BlogPost): Observable<any>

// Update blog
updateBlog(id: number, blog: BlogPost): Observable<any>

// Delete blog
deleteBlog(id: number): Observable<any>
```

#### **Job Service**
```typescript
// Job management
getJobs(): Observable<Job[]>
getById(id: number): Observable<Job>
add(job: Job): Observable<any>
update(id: number, job: Job): Observable<any>
delete(id: number): Observable<any>
```

#### **Project Service**
```typescript
// Portfolio management
getProjects(): Observable<Project[]>
getProjectById(id: number): Observable<Project>
addProject(project: Project): Observable<any>
updateProject(id: number, project: Project): Observable<any>
deleteProject(id: number): Observable<any>
```

### Notification Service

```typescript
// Show notifications
success(title: string, message: string): string
error(title: string, message: string): string
warning(title: string, message: string): string
info(title: string, message: string): string

// Dismiss notifications
dismiss(notificationId?: string): void
clear(): void
```

### Form Validation Service

```typescript
// Async validation with loading
validateForm(form: FormGroup, fieldDisplayNames?: object): Promise<boolean>

// Synchronous validation
validateFormSync(form: FormGroup, fieldDisplayNames?: object): boolean

// Field error checking
hasFieldError(form: FormGroup, fieldName: string, showValidationErrors: boolean): boolean
getFieldError(form: FormGroup, fieldName: string, showValidationErrors: boolean, fieldDisplayNames?: object): string
```

## 🎨 Customization

### Theme Customization

Modify the global styles in `src/styles.scss`:

```scss
// Primary color scheme
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
}
```

### Component Styling

Each component has its own SCSS file for specific styling.

### Adding New Modules

1. Generate new module: `ng generate module modules/admin/new-module`
2. Add components: `ng generate component modules/admin/new-module/components/list`
3. Create services: `ng generate service modules/admin/new-module/services/new-module`
4. Add routes to `app.routes.ts`
5. Update navigation in admin layout

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test
# or
ng test

# End-to-end tests
npm run e2e
# or
ng e2e

# Test coverage
ng test --code-coverage
```

### Test Structure

- **Unit Tests:** `*.spec.ts` files alongside components
- **Integration Tests:** Testing component interactions
- **E2E Tests:** Full user workflow testing

## 🚀 Deployment

### Deployment Options

1. **Static Hosting (Netlify, Vercel)**
   ```bash
   ng build --prod
   # Upload dist/ folder
   ```

2. **Docker Deployment**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN ng build --prod
   EXPOSE 4200
   CMD ["ng", "serve", "--host", "0.0.0.0"]
   ```

3. **Cloud Platforms**
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make changes and commit**
   ```bash
   git commit -m "feat: Add new feature"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/new-feature
   ```
5. **Create a Pull Request**

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for new features
- Update documentation

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

## 📝 Changelog

### Version 1.0.0 (Current)

#### Features Added
- ✅ Complete admin panel with CRUD operations
- ✅ Public website with all pages
- ✅ Authentication system with guards
- ✅ Form validation with loading states
- ✅ Toast notification system
- ✅ Activity tracking
- ✅ Responsive design
- ✅ Rich text editor integration
- ✅ Mock data services
- ✅ Professional UI/UX

#### Technical Improvements
- ✅ Angular 18 with standalone components
- ✅ TypeScript strict mode
- ✅ Modular architecture
- ✅ Service-based state management
- ✅ Lazy loading for performance
- ✅ Progressive web app features

## 🆘 Troubleshooting

### Common Issues

#### **Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean
```

#### **Development Server Issues**
```bash
# Kill existing processes
taskkill /F /IM node.exe  # Windows
pkill -f node             # Mac/Linux

# Restart server
ng serve
```

#### **Module Not Found Errors**
- Check import paths
- Verify module exports
- Update angular.json configuration

### Performance Optimization

- Use OnPush change detection strategy
- Implement virtual scrolling for large lists
- Optimize images and assets
- Enable lazy loading for routes
- Use trackBy functions in *ngFor

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** Your Name
- **Designer:** Design Team
- **Project Manager:** PM Team

## 📞 Support

- **Email:** support@consultancy.com
- **Documentation:** [GitHub Wiki](https://github.com/noorulbhs/consultancy/wiki)
- **Issues:** [GitHub Issues](https://github.com/noorulbhs/consultancy/issues)

---

## 🎉 Acknowledgments

- Angular team for the excellent framework
- Material Design for UI components
- Quill.js for rich text editing
- Font Awesome for icons
- Bootstrap for responsive grid system

---

**Made with ❤️ using Angular 18**
