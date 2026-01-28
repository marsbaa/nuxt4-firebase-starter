# Nuxt 4 + Firebase Starter

A production-ready starter template for building authenticated web applications with Nuxt 4 and Firebase. This template includes a complete authentication system, user profile management, and a modern UI built with Tailwind CSS.

## Features

- 🔐 **Firebase Authentication** - Email/password authentication with login, registration, and password management
- 👤 **User Profile Management** - Complete profile system with Firestore integration
- 🎨 **Tailwind CSS** - Modern, responsive UI components
- 🔔 **Toast Notifications** - User-friendly feedback system
- 🎯 **Icon System** - Integrated icon library with accessibility support
- 🛡️ **Protected Routes** - Authentication middleware for secure pages
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Nuxt 4** - Built on the latest Nuxt framework

## Project Structure

```
nuxt4-firebase-starter/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── AppAlert.vue     # Alert/notification component
│   │   ├── AppButton.vue    # Button component
│   │   ├── AppCard.vue      # Card container component
│   │   ├── AppIcon.vue      # Icon component wrapper
│   │   ├── AppInput.vue     # Form input component
│   │   └── ToastContainer.vue # Toast notification system
│   ├── composables/         # Vue composables
│   │   ├── useAuth.ts       # Authentication logic
│   │   ├── useFirebase.ts   # Firebase client initialization
│   │   ├── useProfile.ts    # Profile management
│   │   └── useToast.ts      # Toast notification system
│   ├── layouts/
│   │   └── dashboard.vue    # Dashboard layout with navigation
│   ├── middleware/
│   │   └── auth.ts          # Authentication route protection
│   ├── pages/               # Application pages
│   │   ├── index.vue        # Home/landing page
│   │   ├── login.vue        # Login page
│   │   ├── register.vue     # Registration page
│   │   ├── dashboard.vue    # User dashboard
│   │   ├── profile.vue      # Profile management
│   │   ├── settings.vue     # User settings
│   │   └── change-password.vue # Password change
│   ├── plugins/
│   │   └── firebase.client.ts # Firebase client plugin
│   └── app.vue              # Root app component
├── server/
│   └── utils/
│       └── firebase-admin.ts # Firebase Admin SDK initialization
├── .env.example             # Environment variables template
└── nuxt.config.ts           # Nuxt configuration
```

## Prerequisites

- Node.js 18+ or higher
- npm, pnpm, yarn, or bun
- A Firebase project (see Firebase Setup below)

## Quick Start

### 1. Clone & Install

```bash
# Clone the repository (or use as template)
git clone <your-repo-url>
cd nuxt4-firebase-starter

# Install dependencies
npm install
```

### 2. Firebase Setup

#### Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on your project to open the dashboard

#### Enable Authentication

1. In the Firebase Console, navigate to **Build > Authentication**
2. Click "Get Started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

#### Create Firestore Database

1. Navigate to **Build > Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development) or **production mode** (for production)
4. Select a location for your database
5. Click "Enable"

#### Get Client SDK Configuration

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web icon `</>` to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object - you'll need these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

#### Generate Service Account (Admin SDK)

1. In Firebase Console, go to **Project Settings > Service accounts**
2. Click "Generate new private key"
3. Click "Generate key" - this downloads a JSON file
4. Open the JSON file and note these values:
   - `project_id`
   - `client_email`
   - `private_key`

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
# Firebase Client SDK Configuration (Public)
NUXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK Configuration (Server-side only - Keep Secret!)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**

- The `NUXT_PUBLIC_*` variables are exposed to the client
- Admin SDK variables (`FIREBASE_*`) are server-only and never exposed to the client
- Keep your private key secure and never commit it to version control
- The private key must include the full header/footer with `\n` newline characters

### 4. Run Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The app will automatically open in your browser. You can now:

- Register a new account at `/register`
- Login at `/login`
- Access the dashboard at `/dashboard`

## Icon System

This project uses [Iconify](https://iconify.design/) for icons via the `AppIcon` component.

### Using Icons

```vue
<template>
  <!-- Basic icon -->
  <AppIcon name="mdi:account" />

  <!-- With custom size -->
  <AppIcon name="mdi:email" class="w-6 h-6" />

  <!-- With custom color -->
  <AppIcon name="mdi:check" class="text-green-600" />

  <!-- Loading state -->
  <AppIcon name="mdi:loading" class="animate-spin" />
</template>
```

### Available Icon Collections

The project is configured to use Material Design Icons (mdi), but you can use any [Iconify collection](https://icon-sets.iconify.design/):

- `mdi:icon-name` - Material Design Icons
- `heroicons:icon-name` - Heroicons
- `ph:icon-name` - Phosphor Icons
- `lucide:icon-name` - Lucide Icons
- And 100+ more...

### Accessibility

All icons include proper ARIA labels by default. The `AppIcon` component automatically handles accessibility attributes.

## UI Components

### AppButton

```vue
<AppButton variant="primary" @click="handleClick">
  Click Me
</AppButton>

<!-- Variants: primary, secondary, danger -->
<AppButton variant="danger" :loading="isLoading">
  Delete
</AppButton>
```

### AppInput

```vue
<AppInput
  v-model="email"
  type="email"
  label="Email"
  icon="mdi:email"
  placeholder="Enter your email"
  :error="emailError"
/>
```

### AppCard

```vue
<AppCard>
  <template #header>
    <h2>Card Title</h2>
  </template>
  <template #default>
    Card content goes here
  </template>
</AppCard>
```

### AppAlert

```vue
<AppAlert type="success" :dismissible="true">
  Operation completed successfully!
</AppAlert>

<!-- Types: success, error, warning, info -->
```

## Authentication

### useAuth Composable

```typescript
const { user, loading, signIn, signUp, signOut } = useAuth();

// Sign in
await signIn(email, password);

// Sign up
await signUp(email, password);

// Sign out
await signOut();

// Check auth state
if (user.value) {
  console.log("User is logged in:", user.value.email);
}
```

### Protected Routes

Add the auth middleware to any page that requires authentication:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
```

## Profile Management

### useProfile Composable

```typescript
const { profile, loading, updateProfile } = useProfile();

// Update profile
await updateProfile({
  displayName: "John Doe",
  bio: "Software developer",
  photoURL: "https://example.com/photo.jpg",
});

// Access profile data
console.log(profile.value?.displayName);
```

## Toast Notifications

### useToast Composable

```typescript
const toast = useToast();

// Show success
toast.success("Profile updated successfully!");

// Show error
toast.error("Failed to update profile");

// Show info
toast.info("Check your email for verification");

// Show warning
toast.warning("Your session is about to expire");
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

### Environment Variables in Production

Ensure all environment variables are properly configured in your hosting platform:

- Vercel: Add variables in Project Settings > Environment Variables
- Netlify: Add variables in Site Settings > Build & Deploy > Environment
- Firebase Hosting: Use `.env` files or Firebase Functions config

### Security Considerations

- Never commit `.env` to version control
- Use environment variables for all sensitive credentials
- Enable Firebase Security Rules for Firestore
- Set up proper CORS policies
- Use HTTPS in production
- Implement rate limiting for authentication endpoints

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

The project includes test configurations for:

- Unit tests with Vitest
- Component tests with Vitest
- E2E tests with Playwright

Run tests:

```bash
# Unit and component tests
npm run test

# E2E tests
npm run test:e2e
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:

- Check the [Nuxt documentation](https://nuxt.com/docs)
- Check the [Firebase documentation](https://firebase.google.com/docs)
- Open an issue on GitHub

## Acknowledgments

- Built with [Nuxt 4](https://nuxt.com/)
- Authentication powered by [Firebase](https://firebase.google.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Iconify](https://iconify.design/)
