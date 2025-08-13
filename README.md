# Memo

A React Native app built with Expo featuring beautiful login and signup screens with glass-like UI elements and Firebase authentication.

## Features

- **Beautiful Glass-like UI** - Modern design with blur effects and gradients
- **Dark Theme** - Elegant black background with purple/blue accent colors
- **Firebase Authentication** - Real email/password authentication with secure error handling
- **Login Screen** - Email and password authentication with validation
- **Signup Screen** - Full registration form with password confirmation
- **Home Screen** - User dashboard with account information
- **Custom Alerts** - Beautiful, secure error messages
- **Responsive Design** - Works perfectly on all screen sizes
- **Form Validation** - Real-time input validation and error handling
- **Loading States** - Smooth loading animations during authentication
- **Persistent Sessions** - Users stay logged in between app sessions

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- Firebase project (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Memo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Firebase configuration
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Get your Firebase configuration from Project Settings
   - Update the `.env` file with your Firebase values

5. Start the development server:
```bash
npm start
```

### Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important:** Never commit your `.env` file to version control. It's already added to `.gitignore`.

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator/device
- `npm run ios` - Start the app on iOS simulator/device
- `npm run web` - Start the app in web browser

### Development

- The main app code is in `App.js`
- Authentication context is in `contexts/AuthContext.js`
- Firebase service is in `services/authService.js`
- Login screen is in `screens/LoginScreen.js`
- Signup screen is in `screens/SignupScreen.js`
- Home screen is in `screens/HomeScreen.js`
- Reusable components are in `screens/components/`
- Styles are organized in `styles/` directory
- Configuration is in `app.json`

### UI Features

- **Glass-like Input Fields** - Blur effects with transparent backgrounds
- **Gradient Buttons** - Beautiful purple to blue gradient buttons
- **Custom Alerts** - Secure, beautiful error messages
- **Decorative Elements** - Subtle background circles for visual appeal
- **Smooth Animations** - Loading states and transitions
- **Keyboard Handling** - Proper keyboard avoidance for better UX

### Security Features

- **Secure Error Messages** - Generic error messages that don't reveal account existence
- **Input Validation** - Client-side validation for better UX
- **Firebase Security** - Server-side authentication and validation
- **Environment Variables** - Secure configuration management

### Building for Production

To build your app for production:

```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

## Project Structure

```
├── App.js                    # Main app component with navigation
├── config/
│   └── firebase.js           # Firebase configuration
├── contexts/
│   └── AuthContext.js        # Authentication context
├── services/
│   └── authService.js        # Firebase authentication service
├── hooks/
│   └── useCustomAlert.js     # Custom alert hook
├── screens/
│   ├── components/           # Reusable UI components
│   ├── LoginScreen.js        # Login screen with authentication
│   ├── SignupScreen.js       # Signup screen with validation
│   └── HomeScreen.js         # User dashboard
├── styles/                   # Organized StyleSheet files
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment variables template
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── assets/                   # Images, fonts, and other assets
└── node_modules/             # Installed dependencies
```

## Dependencies

- **Firebase** - Authentication and backend services
- **React Navigation** - For screen navigation
- **Expo Linear Gradient** - For gradient backgrounds and buttons
- **Expo Blur** - For glass-like blur effects
- **React Native Screens** - For better screen performance
- **React Native Safe Area Context** - For safe area handling
- **React Native Reanimated** - For smooth animations
- **AsyncStorage** - For persistent authentication state

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Expo CLI Commands](https://docs.expo.dev/workflow/expo-cli/)