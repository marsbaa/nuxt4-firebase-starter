# Pastoral Care App

A purpose-built web application for pastors, chaplains, care coordinators, and ministry leaders to support their care work. Built with Nuxt 4 and Firebase, this application provides a calm, warm, and secure environment for managing pastoral relationships and sensitive information.

## Purpose

Pastoral care work involves sensitive conversations, confidential information, and the emotional weight of walking with people through life's challenges. This application is designed to support that sacred work with:

- **Calm Interface** - Reduced visual noise and generous spacing for focus and peace
- **Warm Design** - Earth tones and gentle styling that reflect the human nature of care
- **Trust & Safety** - Secure authentication and data handling for confidential information
- **Purposeful Tools** - Features designed to support care relationships, not metrics or productivity

## Features

- 🔐 **Secure Authentication** - Firebase-powered email/password authentication with privacy-focused design
- 👤 **Profile Management** - Personal profile system with Firestore integration
- 🎨 **Pastoral Design System** - Warm earth tones, generous spacing, and calming visual language
- 🔔 **Gentle Notifications** - Supportive feedback system with respectful messaging
- 🛡️ **Protected Routes** - Secure access to sensitive information
- 📱 **Responsive Design** - Thoughtfully designed for mobile, tablet, and desktop use
- ♿ **Accessible** - WCAG 2.1 AA compliant for inclusive access
- 🚀 **Modern Stack** - Built on Nuxt 4 for performance and developer experience

## Design Philosophy

This application is designed to feel like **a quiet room, not an office system**. The interface prioritizes:

- **Breathing room over information density** - Space to think and reflect
- **Warmth over efficiency** - Human connection over transactions
- **Clarity over complexity** - Clear guidance without overwhelming detail
- **Dignity over urgency** - Respectful pacing that honors the weight of care work

The visual design uses soft earth tones, generous whitespace, gentle curves, and supportive language to create a calm, trustworthy environment for sensitive work.

## Project Structure

```
care-covenant-app/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── AppAlert.vue     # Gentle alert/notification component
│   │   ├── AppButton.vue    # Soft, accessible button component
│   │   ├── AppCard.vue      # Card container with warm styling
│   │   ├── AppIcon.vue      # Icon wrapper with rounded styling
│   │   ├── AppInput.vue     # Form input with supportive design
│   │   └── ToastContainer.vue # Toast notification system
│   ├── composables/         # Vue composables for logic
│   │   ├── useAuth.ts       # Authentication management
│   │   ├── useFirebase.ts   # Firebase client initialization
│   │   ├── useProfile.ts    # Profile data management
│   │   └── useToast.ts      # Notification system
│   ├── layouts/
│   │   └── dashboard.vue    # Main dashboard layout with navigation
│   ├── middleware/
│   │   └── auth.ts          # Authentication route protection
│   ├── pages/               # Application pages
│   │   ├── index.vue        # Welcome/landing page
│   │   ├── login.vue        # Sign in page
│   │   ├── register.vue     # Account creation page
│   │   ├── dashboard.vue    # Main dashboard home
│   │   ├── profile.vue      # User profile management
│   │   ├── settings.vue     # Account settings
│   │   └── change-password.vue # Password management
│   ├── plugins/
│   │   └── firebase.client.ts # Firebase client plugin
│   └── app.vue              # Root application component
├── server/
│   └── utils/
│       └── firebase-admin.ts # Firebase Admin SDK (server-side)
├── openspec/                # OpenSpec specifications and proposals
│   ├── project.md           # Project context and conventions
│   ├── specs/               # Current feature specifications
│   └── changes/             # Active and archived change proposals
├── .env.example             # Environment variables template
├── tailwind.config.ts       # Pastoral design system configuration
└── nuxt.config.ts           # Nuxt framework configuration
```

## Prerequisites

- **Node.js** 18 or higher
- **npm**, pnpm, yarn, or bun
- **Firebase Project** with Authentication and Firestore enabled

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd care-covenant-app

# Install dependencies
npm install
```

### 2. Firebase Setup

#### Create Firebase Project

1. Visit the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** and complete the setup wizard
3. Open your new project dashboard

#### Enable Authentication

1. Navigate to **Build > Authentication**
2. Click **"Get Started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication
5. Save changes

#### Create Firestore Database

1. Navigate to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (development) or **"Production mode"** (production)
4. Select a database location close to your users
5. Click **"Enable"**

#### Get Firebase Credentials

**Client SDK (Public)**:

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click the web icon `</>` to add a web app
4. Register your app and copy the configuration values

**Admin SDK (Server-side)**:

1. Go to **Project Settings > Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Extract `project_id`, `client_email`, and `private_key`

### 3. Configure Environment

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
# Firebase Client SDK (Public - exposed to browser)
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-only - KEEP SECRET)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Security Notes**:

- `NUXT_PUBLIC_*` variables are safe to expose to the browser
- `FIREBASE_*` variables are server-only and must remain secret
- Never commit `.env` to version control
- The private key must include newline characters (`\n`)

### 4. Run Development Server

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

You can now:

- Create an account at [`/register`](http://localhost:3000/register)
- Sign in at [`/login`](http://localhost:3000/login)
- Access the dashboard at [`/dashboard`](http://localhost:3000/dashboard)

## Development

### Component Usage

#### AppButton

```vue
<AppButton variant="primary" @click="handleSave">
  Save changes
</AppButton>

<!-- Variants: primary, secondary, danger -->
<AppButton variant="secondary" :loading="isLoading">
  Cancel
</AppButton>
```

#### AppInput

```vue
<AppInput
  v-model="email"
  type="email"
  label="Email address"
  icon="heroicons:envelope"
  placeholder="your@email.com"
  :error="emailError"
/>
```

#### AppCard

```vue
<AppCard>
  <template #header>
    <h2 class="text-lg font-medium text-stone-800">Card Title</h2>
  </template>
  <template #default>
    <p class="text-stone-600">Card content with warm styling</p>
  </template>
</AppCard>
```

#### AppAlert

```vue
<AppAlert type="success" :dismissible="true">
  Your profile has been updated.
</AppAlert>

<!-- Types: success, error, warning, info -->
```

### Authentication Composable

```typescript
const { user, loading, signIn, signUp, signOut, changePassword } = useAuth();

// Sign in
await signIn(email, password);

// Create account
await signUp(email, password);

// Sign out
await signOut();

// Change password
await changePassword(currentPassword, newPassword);

// Check authentication state
if (user.value) {
  console.log("Signed in as:", user.value.email);
}
```

### Profile Management

```typescript
const { profile, loading, updateProfile } = useProfile();

// Update profile
await updateProfile({
  displayName: "Pastor John",
  bio: "Serving at Community Church",
  photoURL: "https://example.com/photo.jpg",
});

// Access profile data
console.log(profile.value?.displayName);
```

### Toast Notifications

```typescript
const toast = useToast();

// Show supportive messages
toast.success("Changes saved successfully");
toast.error("Something went wrong—please try again");
toast.info("Check your email for a verification link");
toast.warning("Your session will expire soon");
```

### Protected Routes

Add authentication middleware to pages requiring login:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
```

### Icon System

This project uses [Iconify](https://iconify.design/) with [Heroicons](https://heroicons.com/) for a warm, rounded icon style:

```vue
<template>
  <!-- Basic icon -->
  <AppIcon name="heroicons:user-circle" />

  <!-- With custom size -->
  <AppIcon name="heroicons:envelope" class="w-6 h-6" />

  <!-- With custom color -->
  <AppIcon name="heroicons:check-circle" class="text-green-600" />
</template>
```

Browse icons at [icon-sets.iconify.design](https://icon-sets.iconify.design/). Prefer rounded, outline-style icon families for consistency with the pastoral design language.

## Firestore Security Rules

For production, implement proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Add these rules in the Firebase Console under **Firestore Database > Rules**.

## Testing

This project includes configurations for unit, component, and end-to-end testing:

```bash
# Run all unit and component tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit
npm run test:nuxt

# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Environment Variables

Configure all environment variables in your hosting platform:

- **Vercel**: Project Settings > Environment Variables
- **Netlify**: Site Settings > Build & Deploy > Environment
- **Firebase Hosting**: Use Firebase Functions config or `.env` files

### Security Checklist

- ✅ Never commit `.env` or service account keys to version control
- ✅ Use environment variables for all sensitive credentials
- ✅ Configure Firestore security rules for production
- ✅ Enable HTTPS (required for Firebase Authentication)
- ✅ Set appropriate CORS policies
- ✅ Consider rate limiting for authentication endpoints
- ✅ Regularly review Firebase Authentication settings

### Performance

- Enable Firebase hosting CDN for static assets
- Configure proper caching headers
- Monitor Firebase quotas and usage
- Consider Firebase Performance Monitoring

## OpenSpec Workflow

This project uses [OpenSpec](https://openspec.dev/) for change management. When proposing changes:

1. Create a proposal in [`openspec/changes/`](openspec/changes/)
2. Document specifications and design decisions
3. Create tasks and track progress
4. Archive completed changes

See [`openspec/AGENTS.md`](openspec/AGENTS.md) for detailed workflow instructions.

## Contributing

Contributions should align with the pastoral care mission and design philosophy:

- Maintain calm, warm visual design
- Use respectful, supportive language
- Prioritize accessibility and inclusivity
- Follow existing code patterns and conventions
- Add tests for new functionality

## Design System

The application uses a custom Tailwind configuration with pastoral design tokens:

- **Colors**: Warm earth tones (sage, taupe, stone) with soft semantic colors
- **Typography**: Softer weights with generous line height for readability
- **Spacing**: Increased whitespace and breathing room throughout
- **Components**: Gentle curves, subtle shadows, and warm interactions

See [`openspec/changes/update-pastoral-care-ui-design/STYLE_GUIDE.md`](openspec/changes/update-pastoral-care-ui-design/STYLE_GUIDE.md) for complete design guidelines.

## Technology Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) - Vue 3 meta-framework
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom pastoral theme
- **Icons**: [Iconify](https://iconify.design/) via [@nuxt/icon](https://nuxt.com/modules/icon)
- **Testing**: [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)

## Support

For questions and issues:

- Review the [Nuxt documentation](https://nuxt.com/docs)
- Check the [Firebase documentation](https://firebase.google.com/docs)
- Open an issue on GitHub
- Review [`openspec/project.md`](openspec/project.md) for project context

## License

MIT

## Acknowledgments

Built with care for those who care for others.

- Framework: [Nuxt 4](https://nuxt.com/)
- Authentication: [Firebase](https://firebase.google.com/)
- Design: [Tailwind CSS](https://tailwindcss.com/)
- Icons: [Iconify](https://iconify.design/) + [Heroicons](https://heroicons.com/)
- Change Management: [OpenSpec](https://openspec.dev/)
